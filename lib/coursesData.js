const FALLBACK_COURSES = [
  {
    slug: 'basic-of-computer',
    title: 'Basic of Computer',
    short: 'Master the fundamentals of computers and digital tools.',
    icon: 'Monitor',
    color: 'from-blue-500 to-cyan-500',
    duration: '1 Month',
    fee: 1500,
    level: 'Beginner',
    certificate: true,
    who: 'Students and beginners',
    outcomes: ['Use a PC confidently', 'Manage files and folders', 'Browse safely online'],
    syllabus: ['Computer basics', 'Windows', 'Internet', 'Email', 'Files'],
    order: 1,
    status: 'active',
  },
  {
    slug: 'basic-of-ms-excel',
    title: 'Basic of Microsoft Excel',
    short: 'Learn formulas, charts and simple data handling.',
    icon: 'Table',
    color: 'from-emerald-500 to-teal-600',
    duration: '1 Month',
    fee: 1800,
    level: 'Beginner',
    certificate: true,
    who: 'Students and office users',
    outcomes: ['Use spreadsheets efficiently', 'Create tables and charts', 'Apply everyday formulas'],
    syllabus: ['Excel basics', 'Formulas', 'Sorting', 'Filtering', 'Charts'],
    order: 2,
    status: 'active',
  },
  {
    slug: 'basic-of-python',
    title: 'Basic of Python',
    short: 'Get started with programming and automation.',
    icon: 'Braces',
    color: 'from-yellow-500 to-amber-600',
    duration: '2 Months',
    fee: 3500,
    level: 'Beginner',
    certificate: true,
    who: 'Aspiring developers',
    outcomes: ['Write Python code', 'Understand logic', 'Build simple programs'],
    syllabus: ['Variables', 'Loops', 'Functions', 'Lists', 'Projects'],
    order: 3,
    status: 'active',
  },
  {
    slug: 'basic-of-sql',
    title: 'Basic of SQL',
    short: 'Understand databases and data queries clearly.',
    icon: 'Database',
    color: 'from-purple-500 to-fuchsia-600',
    duration: '1.5 Months',
    fee: 2500,
    level: 'Beginner',
    certificate: true,
    who: 'Data learners and developers',
    outcomes: ['Query data', 'Create tables', 'Use joins and filters'],
    syllabus: ['Tables', 'Queries', 'Where', 'Joins', 'Reports'],
    order: 4,
    status: 'active',
  },
];

function normalizeCourse(course = {}) {
  return {
    slug: course.slug,
    title: course.title,
    short: course.short,
    icon: course.icon || 'BookOpen',
    color: course.color || 'from-blue-500 to-indigo-700',
    duration: course.duration || '1 Month',
    fee: Number(course.fee ?? 0),
    level: course.level || 'Beginner',
    certificate: course.certificate !== false,
    who: course.who || 'Students and beginners',
    outcomes: Array.isArray(course.outcomes) ? course.outcomes : [],
    syllabus: Array.isArray(course.syllabus) ? course.syllabus : [],
    order: Number(course.order ?? 999),
    status: course.status || 'active',
  };
}

export async function getCoursesFromDb() {
  try {
    const { getDb } = await import('./mongodb');
    const db = await getDb();
    const courses = await db
      .collection('courses')
      .find({ status: { $ne: 'archived' } })
      .sort({ order: 1, title: 1 })
      .toArray();

    return courses.map(normalizeCourse);
  } catch (error) {
    console.error('Failed to fetch courses from MongoDB:', error);
    return FALLBACK_COURSES.map(normalizeCourse);
  }
}

export async function getCourseFromDb(slug) {
  if (!slug) return null;
  const courses = await getCoursesFromDb();
  return courses.find((course) => course.slug === slug) || null;
}
