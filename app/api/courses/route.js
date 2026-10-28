import { getCoursesFromDb } from '@/lib/coursesData';

export async function GET() {
  try {
    const courses = await getCoursesFromDb();
    return Response.json(courses, { status: 200 });
  } catch (error) {
    console.error('Courses API error:', error);
    return Response.json([], { status: 500 });
  }
}
