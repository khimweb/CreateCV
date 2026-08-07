/**
 * Display-only sample content for the Make CV live preview.
 *
 * These values make an empty template easy to read while building a CV.
 * They are never persisted: `serializeContent()` always saves the real form
 * values, so anything the user types replaces the matching placeholder.
 */
export const PREVIEW_PLACEHOLDER = {
  name: 'Your Name',
  jobTitle: 'Professional Title',
  email: 'you@example.com',
  phone: '+855 12 345 678',
  location: 'Phnom Penh, Cambodia',
  linkedin: 'linkedin.com/in/your-profile',
  summary:
    'Goal-oriented and adaptable professional with strong communication skills, a collaborative mindset, and a track record of delivering dependable results.',
  education: [
    {
      institution: 'Your University',
      degree: "Bachelor's Degree",
      field: 'Your Field of Study',
      startYear: '2021',
      endYear: '2025',
      current: false,
      gpa: '3.5 / 4.0',
      description: 'Relevant coursework, achievements, or activities go here.',
    },
  ],
  experience: [
    {
      company: 'Company Name',
      position: 'Your Job Title',
      startDate: 'Jan 2024',
      endDate: '',
      current: true,
      responsibilities: [
        'Describe a key responsibility and the impact you delivered in this role.',
        'Add a measurable achievement, such as improving a process or result.',
      ],
    },
    {
      company: 'Previous Company',
      position: 'Previous Job Title',
      startDate: 'Feb 2022',
      endDate: 'Dec 2023',
      current: false,
      responsibilities: ['Summarise what you were responsible for and what you accomplished.'],
    },
  ],
  skills: [
    { name: 'Communication', level: 'Advanced' },
    { name: 'Teamwork', level: 'Advanced' },
    { name: 'Problem Solving', level: 'Intermediate' },
    { name: 'Time Management', level: 'Intermediate' },
  ],
  languages: [
    { name: 'Khmer', proficiency: 'Native' },
    { name: 'English', proficiency: 'Intermediate' },
  ],
  certifications: [{ name: 'Certificate Name', issuer: 'Issuing Organisation', date: '2025' }],
  projects: [
    {
      name: 'Project Name',
      description: 'Short description of the project, your role, and the tools you used.',
      link: '',
    },
  ],
  references: [
    {
      name: 'Reference Full Name',
      position: 'Job Position',
      company: 'Company Name',
      phone: '+855 12 000 000',
      email: 'reference@example.com',
    },
  ],
  hobbies: [{ name: 'Reading' }, { name: 'Travel' }, { name: 'Music' }],
};
