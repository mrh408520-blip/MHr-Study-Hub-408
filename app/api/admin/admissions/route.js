import { getAdminSession } from '@/lib/adminAuth';
import { getAdminAdmissions } from '@/lib/adminData';
import { ObjectId } from 'mongodb';

export async function GET() {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admissions = await getAdminAdmissions();
  return Response.json(admissions);
}

export async function PATCH(request) {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, _id, admissionStatus, paymentStatus, notes } = body || {};
  const recordId = id || _id;

  if (!recordId) {
    return Response.json({ error: 'Application ID is required.' }, { status: 400 });
  }

  const { getDb } = await import('@/lib/mongodb');
  const db = await getDb();
  const filter = ObjectId.isValid(recordId) ? { _id: new ObjectId(recordId) } : { _id: recordId };

  const update = { $set: { updatedAt: new Date() } };
  if (admissionStatus) update.$set.admissionStatus = admissionStatus;
  if (paymentStatus) update.$set.paymentStatus = paymentStatus;
  if (notes) update.$set.notes = notes;

  const result = await db.collection('admissions').updateOne(filter, update);
  if (!result.matchedCount) {
    return Response.json({ error: 'Application not found.' }, { status: 404 });
  }

  const refreshed = await db.collection('admissions').findOne(filter);
  return Response.json({ success: true, application: refreshed });
}
