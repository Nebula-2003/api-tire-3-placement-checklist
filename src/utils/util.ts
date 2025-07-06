import crypto from 'node:crypto';

const base64url = (str: string) => str.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

export function signJWT(payload: string, secret: string, options = {}) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encHeader = base64url(Buffer.from(JSON.stringify(header)).toString('base64'));
  const encPayload = base64url(Buffer.from(JSON.stringify(payload)).toString('base64'));
  const data = `${encHeader}.${encPayload}`;
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64');
  return `${data}.${base64url(signature)}`;
}

export function verifyJWT(token: string, secret: string) {
  const [encHeader, encPayload, signature] = token.split('.');
  const data = `${encHeader}.${encPayload}`;
  const expectedSig = base64url(crypto.createHmac('sha256', secret).update(data).digest('base64'));
  if (signature !== expectedSig) return null;
  return JSON.parse(Buffer.from(encPayload, 'base64').toString());
}

export function makeResponse({
  success,
  message,
  data = null,
  error = null,
  meta = undefined,
  requestId = undefined,
}: {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
  meta?: any;
  requestId?: string;
}) {
  return {
    success,
    message,
    data,
    error,
    meta,
    timestamp: new Date().toISOString(),
    requestId: requestId || `req_${Math.random().toString(36).slice(2, 12)}`,
  };
}