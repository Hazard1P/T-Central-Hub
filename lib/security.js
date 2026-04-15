import crypto from 'crypto';

function getSecretSource() {
  return process.env.SESSION_SECRET || process.env.SUPPORT_LINK_SECRET || process.env.STEAM_API_KEY || '';
}

function getKeyMaterial() {
  const secret = getSecretSource();

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET or SUPPORT_LINK_SECRET must be configured in production.');
    }
    return crypto.createHash('sha256').update('development-secret-change-me').digest();
  }

  return crypto.createHash('sha256').update(secret).digest();
}

export function hasStrongServerSecret() {
  return Boolean(getSecretSource());
}

export function encryptJson(value) {
  const key = getKeyMaterial();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(value), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, ciphertext]).toString('base64url');
}

export function decryptJson(encoded) {
  const key = getKeyMaterial();
  const raw = Buffer.from(encoded, 'base64url');
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
