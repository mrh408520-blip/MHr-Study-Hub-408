import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'mrh_admin_session';
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'mrh-studio-admin-secret';

function buildSignedSession(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(encoded)
    .digest('hex');

  return `${encoded}.${signature}`;
}

export function createAdminSession(user) {
  return buildSignedSession({
    user,
    issuedAt: Date.now(),
    expiresAt: Date.now() + ADMIN_SESSION_TTL_MS,
  });
}

export function verifyAdminSession(sessionValue) {
  if (!sessionValue || typeof sessionValue !== 'string') return null;

  const [payloadPart, signature] = sessionValue.split('.');
  if (!payloadPart || !signature) return null;

  const expectedSignature = createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(payloadPart)
    .digest('hex');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
    if (!payload?.user || payload.expiresAt < Date.now()) return null;
    return payload.user;
  } catch (error) {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSession(sessionValue);
}

export function setAdminSessionCookie(response, user, rememberMe = false) {
  const cookieOptions = {
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSession(user),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };

  if (rememberMe) {
    response.cookies.set({
      ...cookieOptions,
      maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
    });
    return;
  }

  response.cookies.set({
    ...cookieOptions,
    maxAge: undefined,
    expires: undefined,
  });
}

export function clearAdminSessionCookie(response) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  });
}
