import { getDb } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const db = await getDb();
    const data = await request.json();
    const createdAt = new Date();

    const result = await db.collection('admissions').insertOne({
      ...data,
      createdAt,
    });

    const id = String(result.insertedId);

    return Response.json(
      {
        success: true,
        id,
        _id: id,
        data: {
          id,
          _id: id,
          ...data,
          createdAt: createdAt.toISOString(),
        },
        message: 'Admission created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('MongoDB Error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}