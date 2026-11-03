import { getAdminSession } from '@/lib/adminAuth';
import { getAdminDashboardData } from '@/lib/adminData';

export async function GET() {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getAdminDashboardData();
  return Response.json(data);
}
