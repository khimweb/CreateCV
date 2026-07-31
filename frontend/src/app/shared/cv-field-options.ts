/** Shared selectable options for the Make CV workstation. */

export const JOB_TITLES = [
  'Software Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer',
  'Web Developer',
  'English Teacher',
  'Customer Service Representative',
  'IT Support',
  'Project Manager',
  'UI/UX Designer',
  'Data Analyst',
  'Accountant',
  'Marketing Specialist',
  'Sales Executive',
  'Intern',
];

export const LOCATIONS = [
  'Phnom Penh, Cambodia',
  'Siem Reap, Cambodia',
  'Battambang, Cambodia',
  'Sihanoukville, Cambodia',
  'Remote',
  'Bangkok, Thailand',
  'Ho Chi Minh City, Vietnam',
];

export const INSTITUTIONS = [
  'Royal University of Phnom Penh',
  'BELTEI International School',
  'Norton University',
  'American University of Phnom Penh',
  'Institute of Technology of Cambodia',
  'Paññāsāstra University of Cambodia',
  'University of Puthisastra',
  'Build Bright University',
  'National University of Management',
  'Other',
];

export const DEGREES = [
  'High School Diploma',
  'Associate Degree',
  'Bachelor of Science',
  'Bachelor of Arts',
  "Bachelor's Degree",
  'Master of Science',
  'Master of Arts',
  "Master's Degree",
  'MBA',
  'PhD',
  'Certificate',
  'Diploma',
];

export const FIELDS_OF_STUDY = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Business Administration',
  'English',
  'Accounting',
  'Marketing',
  'Graphic Design',
  'Engineering',
  'Finance',
  'Hospitality',
  'Other',
];

export const SKILL_SUGGESTIONS = [
  'Website Full-Stack',
  'HTML/CSS/Tailwind',
  'JavaScript / TypeScript',
  'React / Next.js',
  'Node.js / Express',
  'Java / Spring Boot',
  'Python / Django',
  'PHP / Laravel',
  'Flutter / Dart',
  'Mobile App',
  'SQL / PostgreSQL',
  'MongoDB',
  'Teamwork',
  'Communication',
  'Customer Service',
  'Teaching',
  'Problem Solving',
  'Git / GitHub',
];

export const LANGUAGE_OPTIONS = [
  'Khmer',
  'English',
  'Chinese',
  'French',
  'Thai',
  'Vietnamese',
  'Japanese',
  'Korean',
  'Spanish',
  'German',
];

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function yearOptions(from = 1990, to = new Date().getFullYear() + 6): string[] {
  const years: string[] = [];
  for (let y = to; y >= from; y--) years.push(String(y));
  return years;
}

export const FONT_WEIGHTS = [
  { label: 'Regular', value: 400 },
  { label: 'Medium', value: 500 },
  { label: 'Semi-bold', value: 600 },
  { label: 'Bold', value: 700 },
];

export const LINE_HEIGHTS = [
  { label: 'Compact', value: 1.2 },
  { label: 'Normal', value: 1.4 },
  { label: 'Relaxed', value: 1.6 },
  { label: 'Loose', value: 1.8 },
];
