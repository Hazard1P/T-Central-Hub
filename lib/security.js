import crypto from 'crypto';

function resolveSessionSecret() {
  const sessionSecret = process.env.SESSION_SECRET;
  if (sessionSecret) {
    return sessionSecret;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    throw new Error(
      'Startup error: SESSION_SECRET must be set when NODE_ENV=production.'
    );
  }

  if (process.env.ALLOW_DEV_SESSION_SECRET_FALLBACK === 'true') {
    return 'development-session-secret-change-me';
  }

  throw new Error(
    'Startup error: SESSION_SECRET is not set. Set SESSION_SECRET or enable ALLOW_DEV_SESSION_SECRET_FALLBACK=true for local development only.'
  );
}

const SESSION_KEY_MATERIAL = crypto
  .createHash('sha256')
  .update(resolveSessionSecret())
  .digest();

export function encryptJson(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', SESSION_KEY_MATERIAL, iv);
  const plaintext = Buffer.from(JSON.stringify(value), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, ciphertext]).toString('base64url');
}

export function decryptJson(encoded) {
  const raw = Buffer.from(encoded, 'base64url');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ciphertext = raw.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', SESSION_KEY_MATERIAL, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plaintext.toString('utf8'));
}

export function signValue(value) {
  return crypto
    .createHmac('sha256', SESSION_KEY_MATERIAL)
    .update(value)
    .digest('base64url');
}
