import { getAdminSession } from '@/lib/adminAuth';

export async function GET() {
  const user = await getAdminSession();

  if (!user) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  return Response.json({ authenticated: true, user });
}
