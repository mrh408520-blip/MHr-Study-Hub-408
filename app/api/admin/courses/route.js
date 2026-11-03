import { getAdminSession } from '@/lib/adminAuth';
import { getAdminCourses } from '@/lib/adminData';
import { ObjectId } from 'mongodb';

export async function GET() {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const courses = await getAdminCourses();
  return Response.json(courses);
}

export async function POST(request) {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, short, description, fee, duration, status, slug } = body || {};
  if (!title) {
    return Response.json({ error: 'Course title is required.' }, { status: 400 });
  }

  const { getDb } = await import('@/lib/mongodb');
  const db = await getDb();
  const baseSlug = slug || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'course';
  const candidateSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  const course = {
    slug: candidateSlug,
    title,
    short: short || description || 'New course',
    description: description || short || '',
    fee: Number(fee || 0),
    duration: duration || '1 Month',
    status: status || 'active',
    order: (await db.collection('courses').countDocuments({})) + 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [],
  };

  const result = await db.collection('courses').insertOne(course);
  return Response.json({ success: true, course: { ...course, _id: result.insertedId } });
}

export async function PATCH(request) {
  const user = await getAdminSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { _id, id, fee, title, description, duration, status, short } = await request.json();
  const courseId = _id || id;
  if (!courseId || (fee === undefined && !title && !description && !duration && !status && !short)) {
    return Response.json({ error: 'Course details are required' }, { status: 400 });
  }

  const { getDb } = await import('@/lib/mongodb');
  const db = await getDb();
  const filter = ObjectId.isValid(courseId) ? { _id: new ObjectId(courseId) } : { _id: courseId };
  const update = {
    $set: {
      updatedAt: new Date(),
    },
  };

  if (fee !== undefined) update.$set.fee = Number(fee);
  if (title) update.$set.title = title;
  if (description !== undefined) update.$set.description = description;
  if (short !== undefined) update.$set.short = short;
  if (duration) update.$set.duration = duration;
  if (status) update.$set.status = status;

  const result = await db.collection('courses').updateOne(filter, update);
  return Response.json({ success: result.modifiedCount > 0 || result.matchedCount > 0, result });
}
