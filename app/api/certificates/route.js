import { db } from '@/lib/firebaseAdmin';

export async function POST(request) {
  try {
    const { certificateId } = await request.json();

    // Query Firestore for matching certificate
    const snapshot = await db
      .collection('certificates')
      .where('certificateId', '==', certificateId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return Response.json(
        { verified: false, message: 'Certificate not found' },
        { status: 404 }
      );
    }

    const certificateData = snapshot.docs[0].data();

    return Response.json({
      verified: true,
      data: certificateData,
    });
  } catch (error) {
    return Response.json(
      { verified: false, error: error.message },
      { status: 500 }
    );
  }
}