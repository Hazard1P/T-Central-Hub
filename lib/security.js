import crypto from 'crypto';

const SESSION_KEY_VERSION = Number.parseInt(process.env.SESSION_KEY_VERSION ?? '1', 10);
const PAYLOAD_VERSION_PREFIX = `v${Number.isNaN(SESSION_KEY_VERSION) ? 1 : SESSION_KEY_VERSION}.`;
let cachedDevSecret;
let warnedMissingSecret = false;

function getSessionSecret() {
  const sessionSecret = process.env.SESSION_SECRET;

  if (sessionSecret) {
    return sessionSecret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET is required in production for session cryptography.');
  }

  if (!cachedDevSecret) {
    cachedDevSecret = crypto.randomBytes(32).toString('base64url');
  }

  if (!warnedMissingSecret) {
    warnedMissingSecret = true;
    console.warn('SESSION_SECRET is not set; using an ephemeral in-memory secret for non-production runtime.');
  }

  return cachedDevSecret;
}

function getKeyMaterial() {
  return crypto.createHash('sha256').update(getSessionSecret()).digest();
}

export function encryptJson(value) {
  const key = getKeyMaterial();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(value), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  const payload = Buffer.concat([iv, tag, ciphertext]).toString('base64url');

  return `${PAYLOAD_VERSION_PREFIX}${payload}`;
}

export function decryptJson(encoded) {
  const key = getKeyMaterial();
  const payload = encoded.startsWith('v') && encoded.includes('.') ? encoded.slice(encoded.indexOf('.') + 1) : encoded;
  const raw = Buffer.from(payload, 'base64url');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ciphertext = raw.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plaintext.toString('utf8'));
}

export function signValue(value) {
  const key = getKeyMaterial();
  return crypto.createHmac('sha256', key).update(value).digest('base64url');
}
