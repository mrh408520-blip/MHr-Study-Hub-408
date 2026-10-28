import { getDb } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const db = await getDb();
    const body = await request.json();
    const certificateId = String(body?.certificateId ?? '').trim();

    if (!certificateId) {
      return Response.json(
        { found: false, error: 'Certificate ID is required.' },
        { status: 400 }
      );
    }

    const certificateData = await db.collection('certificates').findOne({ certificateId });

    if (!certificateData) {
      return Response.json(
        { found: false, message: 'Certificate not found' },
        { status: 404 }
      );
    }

    const certificate = {
      certificateId: certificateData.certificateId || certificateId,
      studentName: certificateData.studentName || 'Student',
      courseName: certificateData.courseName || certificateData.course || 'Course',
      issueDate: certificateData.issueDate || certificateData.issuedAt || 'N/A',
      status: certificateData.status || 'valid',
    };

    return Response.json({ found: true, certificate }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        found: false,
        error: error.message || 'MongoDB is not configured. Add your MongoDB environment variables and try again.',
      },
      { status: 500 }
    );
  }
}