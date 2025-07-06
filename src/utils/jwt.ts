import crypto from 'crypto';

const base64url = (str) => str.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

export function signJWT(payload, secret, options = {}) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encHeader = base64url(Buffer.from(JSON.stringify(header)).toString('base64'));
  const encPayload = base64url(Buffer.from(JSON.stringify(payload)).toString('base64'));
  const data = `${encHeader}.${encPayload}`;
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64');
  return `${data}.${base64url(signature)}`;
}

export function verifyJWT(token, secret) {
  const [encHeader, encPayload, signature] = token.split('.');
  const data = `${encHeader}.${encPayload}`;
  const expectedSig = base64url(crypto.createHmac('sha256', secret).update(data).digest('base64'));
  if (signature !== expectedSig) return null;
  return JSON.parse(Buffer.from(encPayload, 'base64').toString());
}
