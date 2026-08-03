/** Sample content so template cards/previews show a real filled layout. */
export const DEMO_CV = {
  name: 'Phorn Sokkhim',
  jobTitle: 'Aspiring Software Developer',
  email: 'sokkhim519@gmail.com',
  phone: '0966660019',
  location: 'Phnom Penh',
  linkedin: 'github.com/khimweb',
  summary:
    'Goal-oriented, adaptable, and always striving to learn, grow, and deliver the best results.',
  photoUrl: '/assets/sample-profile.svg' as string | null,
  experience: [
    {
      company: 'HYUNDAI PACKAGING',
      position: 'Customer Service Representative',
      startDate: 'Dec 2025',
      endDate: '',
      current: true,
      responsibilities: [
        'Problem-Solving Customer Service Professional | Aspiring Software Developer. Analytical and solution-oriented with a strong track record of daily technical troubleshooting and end-user support.',
      ],
    },
    {
      company: 'Bestway international',
      position: 'English Teacher',
      startDate: 'Mar 2025',
      endDate: 'Oct 2025',
      current: false,
      responsibilities: [
        'Solution-focused professional with a strong foundation in English education, root-cause troubleshooting, and client support.',
      ],
    },
  ],
  education: [
    {
      institution: 'BELTEI International School',
      degree: "Bachelor's Degree in Software Engineering",
      field: 'Software Engineering',
      startYear: '2024',
      endYear: '',
      current: true,
      gpa: '',
      description: 'Competition: 2nd Place – Frontend Website Development. Full-stack web and mobile projects with Flutter, Spring Boot, Laravel, React, and SQL.',
    },
  ],
  skills: [
    { name: 'Website Full-Stack', level: 'Advanced' },
    { name: 'Teamwork', level: 'Advanced' },
    { name: 'Communication', level: 'Advanced' },
    { name: 'Customer Service', level: 'Advanced' },
    { name: 'Teacher', level: 'Intermediate' },
    { name: 'Mobile App', level: 'Intermediate' },
    { name: 'Java/Springboot', level: 'Intermediate' },
    { name: 'React/Django', level: 'Intermediate' },
    { name: 'PHP/Laravel', level: 'Intermediate' },
    { name: 'HTML/CSS/TAILWIND', level: 'Advanced' },
    { name: 'Flutter', level: 'Intermediate' },
    { name: 'SQL/SQL-Server', level: 'Intermediate' },
  ],
  languages: [
    { name: 'Khmer', proficiency: 'Native' },
    { name: 'English', proficiency: 'Intermediate' },
  ],
  certifications: [] as { name?: string; issuer?: string; date?: string }[],
  projects: [
    {
      name: 'System HelpDesk',
      description: 'Django + HTML/CSS/Tailwind + SQLite. Hosting: GitHub / Render / MongoDB',
      link: 'https://kiro-helpdesk.onrender.com',
    },
    {
      name: 'E-commerce Project',
      description: '4–5 full-stack web and mobile apps using Flutter + Spring Boot',
      link: '',
    },
  ],
  references: [
    {
      name: 'Reference Full Name',
      position: 'Job position goes here',
      company: 'Company name goes here',
      phone: '00 123 456 789',
      email: 'demo@gmail.com',
    },
  ],
  hobbies: [
    { name: 'Music' },
    { name: 'Travel' },
    { name: 'Coding' },
    { name: 'Reading' },
  ],
};
