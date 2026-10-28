import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export async function POST(request, { params }) {
  try {
    const db = await getDb();
    const { id } = await params;
    const paymentData = await request.json();
    const normalizedPayment = {
      ...paymentData,
      paymentProofImage: paymentData?.paymentProofImage || paymentData?.imageName || paymentData?.paymentImageName || '',
      imageName: paymentData?.paymentProofImage || paymentData?.imageName || paymentData?.paymentImageName || '',
    };

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
    const admission = await db.collection('admissions').findOne(filter);

    if (!admission) {
      return Response.json(
        { success: false, error: 'Admission not found' },
        { status: 404 }
      );
    }

    const paymentRecord = {
      admissionId: admission._id.toString ? admission._id.toString() : String(admission._id),
      fullName: admission.fullName || '',
      phone: admission.phone || '',
      email: admission.email || '',
      course: admission.course || '',
      transactionId: normalizedPayment.transactionId || '',
      paymentNote: normalizedPayment.paymentNote || '',
      paymentProofImage: normalizedPayment.paymentProofImage || '',
      imageName: normalizedPayment.imageName || '',
      amount: 20,
      paymentStatus: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('payments').updateOne(
      { admissionId: paymentRecord.admissionId },
      { $set: paymentRecord },
      { upsert: true }
    );

    await db.collection('admissions').updateOne(filter, {
      $set: {
        paymentStatus: 'completed',
        paymentDetails: normalizedPayment,
        updatedAt: new Date(),
      },
    });

    return Response.json(
      {
        success: true,
        message: 'Payment recorded successfully',
        payment: paymentRecord,
      },
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