import { db } from '@/lib/firebaseAdmin';

export async function POST(request, { params }) {
  try {
    // In Next.js 15, params must be awaited
    const { id } = await params;
    
    // Get the payment data sent from your frontend
    const paymentData = await request.json();

    // Update the specific admission document in Firebase
    await db.collection('admissions').doc(id).update({
      paymentStatus: 'completed',
      paymentDetails: paymentData,
      updatedAt: new Date().toISOString(),
    });

    return Response.json(
      { success: true, message: 'Payment recorded successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment Error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}