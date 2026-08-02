export const COURSES = [
  {
    slug: 'basic-of-computer',
    title: 'Basic of Computer',
    short: 'Master the fundamentals of computers, Windows, Internet, and digital literacy.',
    icon: 'Monitor',
    color: 'from-blue-500 to-cyan-500',
    duration: '1 Month',
    fee: 1500,
    level: 'Beginner',
    certificate: true,
    who: 'Absolute beginners, homemakers, students, seniors who want to become confident with computers.',
    outcomes: [
      'Confidently operate a Windows PC',
      'Manage files, folders and storage devices',
      'Use the internet, email and Google Drive safely',
      'Understand basic cyber-security'
    ],
    syllabus: [
      'Computer Introduction','Hardware & Software','Input/Output Devices','Keyboard & Mouse','Windows Interface','File & Folder Management','Settings','USB/Pen Drive','Internet Basics','Web Browsing','Gmail','Google Drive','Printing Basics','Basic Cyber Security','Final Practical Test'
    ]
  },
  {
    slug: 'basic-of-ms-word',
    title: 'Basic of Microsoft Word',
    short: 'Create beautiful, professional documents with confidence.',
    icon: 'FileText',
    color: 'from-indigo-500 to-blue-600',
    duration: '3 Weeks',
    fee: 1200,
    level: 'Beginner',
    certificate: true,
    who: 'Students, office workers, and anyone who wants to prepare polished documents.',
    outcomes: ['Design professional documents','Use tables, images and layouts effectively','Prepare print-ready files'],
    syllabus: ['Word Interface','Create & Save Document','Text Formatting','Paragraph Formatting','Bullets & Numbering','Tables','Images & Shapes','Headers & Footers','Page Layout','Page Borders','Find & Replace','Print Settings','Mini Project','Final Test']
  },
  {
    slug: 'basic-of-ms-excel',
    title: 'Basic of Microsoft Excel',
    short: 'Work with data, formulas, charts and automate simple tasks.',
    icon: 'Table',
    color: 'from-emerald-500 to-teal-600',
    duration: '1 Month',
    fee: 1800,
    level: 'Beginner',
    certificate: true,
    who: 'Anyone working with data, accounts, reports or inventory.',
    outcomes: ['Write everyday formulas','Analyse data with sorting, filtering and charts','Build clean printable reports'],
    syllabus: ['Excel Interface','Workbook & Worksheet','Rows & Columns','Cell Formatting','Basic Formulas','Functions (SUM, AVERAGE, MIN, MAX)','IF Function','COUNT Functions','Text Functions','Date Functions','Sorting','Filtering','Conditional Formatting','Charts','Printing','Project']
  },
  {
    slug: 'basic-of-ms-powerpoint',
    title: 'Basic of Microsoft PowerPoint',
    short: 'Design beautiful, animated, presentation-ready slide decks.',
    icon: 'Presentation',
    color: 'from-orange-500 to-rose-500',
    duration: '2 Weeks',
    fee: 1000,
    level: 'Beginner',
    certificate: true,
    who: 'Students, teachers, sales & marketing professionals.',
    outcomes: ['Create engaging slide decks','Use animations, media and SmartArt','Deliver confident presentations'],
    syllabus: ['Interface','Slides','Themes','Text','Images','Icons & Shapes','SmartArt','Charts','Audio & Video','Animations','Slide Show','Project']
  },
  {
    slug: 'basic-of-c-programming',
    title: 'Basic of C Programming',
    short: 'Learn the language that built the modern computing world.',
    icon: 'Code2',
    color: 'from-sky-500 to-blue-700',
    duration: '2 Months',
    fee: 3000,
    level: 'Beginner',
    certificate: true,
    who: 'Students entering CS, and beginners who want strong programming foundations.',
    outcomes: ['Write structured C programs','Understand memory, loops, functions','Build small console projects'],
    syllabus: ['Introduction','IDE Setup','Variables','Data Types','Operators','Input/Output','if/else','switch','Loops','Arrays','Strings','Functions','File Handling','Mini Project']
  },
  {
    slug: 'basic-of-python',
    title: 'Basic of Python',
    short: 'The most in-demand language for automation, data and AI.',
    icon: 'Braces',
    color: 'from-yellow-500 to-amber-600',
    duration: '2 Months',
    fee: 3500,
    level: 'Beginner',
    certificate: true,
    who: 'Aspiring developers, data enthusiasts, and hobbyists.',
    outcomes: ['Write clean Python code','Work with files, data structures & OOP','Build a final capstone project'],
    syllabus: ['Installation','Variables','Data Types','Input/Output','Operators','Conditions','Loops','Functions','Lists','Tuples','Sets','Dictionaries','Strings','File Handling','OOP Basics','Final Project']
  },
  {
    slug: 'basic-of-sql',
    title: 'Basic of SQL',
    short: 'Talk to databases confidently — the skill every tech job wants.',
    icon: 'Database',
    color: 'from-purple-500 to-fuchsia-600',
    duration: '1.5 Months',
    fee: 2500,
    level: 'Beginner',
    certificate: true,
    who: 'Analysts, developers, and anyone working with data.',
    outcomes: ['Query real databases','Design simple schemas','Use joins, aggregates and views'],
    syllabus: ['Database Introduction','DBMS vs RDBMS','Tables','Data Types','CREATE','INSERT','SELECT','WHERE','ORDER BY','UPDATE','DELETE','Aggregate Functions','GROUP BY','HAVING','JOINS','Primary & Foreign Keys','Views','Backup & Restore','Mini Project','Final Test']
  },
  {
    slug: 'basic-of-power-bi',
    title: 'Basic of Power BI',
    short: 'Turn raw data into stunning, interactive business dashboards.',
    icon: 'BarChart3',
    color: 'from-cyan-500 to-blue-700',
    duration: '1.5 Months',
    fee: 2800,
    level: 'Beginner',
    certificate: true,
    who: 'Analysts, managers, and anyone who wants to visualise data.',
    outcomes: ['Import & clean data','Model with DAX','Design professional dashboards & publish reports'],
    syllabus: ['Introduction','Installation','Import Data','Data Cleaning','Power Query','Relationships','DAX Basics','Measures','Visualizations','Filters','Slicers','Maps','KPI Cards','Dashboard Design','Publishing','Sharing Reports','Projects','Final Dashboard']
  }
];

export const SITE = {
  brand: 'MR.H Studio',
  location: 'Roorkee, India',
  phone: '9389883632',
  whatsapp: '7668944271',
  email: 'mrh408520@gmail.com',
  address: 'Roorkee, India',
  upiId: 'mrh408520@upi',
  upiName: 'MRH Studio',
  seatLockFee: 20,
  social: {
    youtube: '#',
    instagram: '#',
    facebook: '#',
    whatsapp: 'https://wa.me/917668944271'
  }
};

export function getCourse(slug){
  return COURSES.find(c => c.slug === slug);
}
