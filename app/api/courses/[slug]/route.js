import { getCourseFromDb } from '@/lib/coursesData';

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const course = await getCourseFromDb(slug);

    if (!course) {
      return Response.json({ error: 'Course not found' }, { status: 404 });
    }

    return Response.json(course, { status: 200 });
  } catch (error) {
    console.error('Course detail API error:', error);
    return Response.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
