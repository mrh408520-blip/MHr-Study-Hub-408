import { db } from '@/lib/firebaseAdmin';

export async function POST(request) {
  try {
    const data = await request.json();

    // Add a new document to the "admissions" collection
    const docRef = await db.collection('admissions').add({
      ...data,
      createdAt: new Date().toISOString(),
    });

    // UPDATE THIS RETURN STATEMENT
    // We send back multiple ID formats and the submitted data 
    // so the frontend has everything it needs to render the success screen!
    return Response.json(
      { 
        success: true, 
        id: docRef.id,
        _id: docRef.id,
        data: {
          id: docRef.id,
          _id: docRef.id,
          ...data 
        },
        message: 'Admission created successfully' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Firebase Error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}