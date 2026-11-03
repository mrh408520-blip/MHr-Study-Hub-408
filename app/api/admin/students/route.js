import { getAdminSession } from '@/lib/adminAuth';
import { getAdminStudents } from '@/lib/adminData';
import { ObjectId } from 'mongodb';

export async function GET() {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const students = await getAdminStudents();
  return Response.json(students);
}

export async function POST(request) {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, phone, email, course, status } = body || {};

  if (!name || !phone || !email || !course) {
    return Response.json({ error: 'Name, phone, email and course are required.' }, { status: 400 });
  }

  const { getDb } = await import('@/lib/mongodb');
  const db = await getDb();
  const studentId = `ST${Date.now().toString().slice(-6)}`;

  const record = {
    studentId,
    fullName: name,
    name,
    phone,
    email,
    course,
    status: status || 'Active',
    admissionStatus: 'Approved',
    paymentStatus: 'Paid',
    enrollmentDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'Admin Panel',
    amount: 0,
  };

  await db.collection('admissions').insertOne(record);
  return Response.json({ success: true, student: record });
}

export async function PATCH(request) {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { _id, id, name, phone, email, course, status } = body || {};
  const recordId = _id || id;

  if (!recordId) {
    return Response.json({ error: 'Student ID is required.' }, { status: 400 });
  }

  const { getDb } = await import('@/lib/mongodb');
  const db = await getDb();
  const filter = ObjectId.isValid(recordId) ? { _id: new ObjectId(recordId) } : { _id: recordId };
  const result = await db.collection('admissions').updateOne(
    filter,
    {
      $set: {
        fullName: name,
        name,
        phone,
        email,
        course,
        status: status || 'Active',
        admissionStatus: status || 'Active',
        updatedAt: new Date(),
      }
    }
  );

  return Response.json({ success: result.modifiedCount > 0 || result.matchedCount > 0 });
}
