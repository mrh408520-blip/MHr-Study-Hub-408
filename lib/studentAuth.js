import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

export const STUDENT_SESSION_COOKIE = 'mrh_student_session';
const STUDENT_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const STUDENT_SESSION_SECRET = process.env.STUDENT_SESSION_SECRET || 'mrh-studio-student-secret';

function buildSignedSession(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', STUDENT_SESSION_SECRET)
    .update(encoded)
    .digest('hex');

  return `${encoded}.${signature}`;
}

export function createStudentSession(student) {
  return buildSignedSession({
    student,
    issuedAt: Date.now(),
    expiresAt: Date.now() + STUDENT_SESSION_TTL_MS,
  });
}

export function verifyStudentSession(sessionValue) {
  if (!sessionValue || typeof sessionValue !== 'string') return null;

  const [payloadPart, signature] = sessionValue.split('.');
  if (!payloadPart || !signature) return null;

  const expectedSignature = createHmac('sha256', STUDENT_SESSION_SECRET)
    .update(payloadPart)
    .digest('hex');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8'));
    if (!payload?.student || payload.expiresAt < Date.now()) return null;
    return payload.student;
  } catch (error) {
    return null;
  }
}

export async function getStudentSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(STUDENT_SESSION_COOKIE)?.value;
  return verifyStudentSession(sessionValue);
}

export function setStudentSessionCookie(response, student) {
  response.cookies.set({
    name: STUDENT_SESSION_COOKIE,
    value: createStudentSession(student),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(STUDENT_SESSION_TTL_MS / 1000),
  });
}

export function clearStudentSessionCookie(response) {
  response.cookies.set({
    name: STUDENT_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  });
}
