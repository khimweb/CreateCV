/**
 * Creates:
 *  1. A new "Azure Glass Pro" template
 *  2. A sample CV using that template with full data + photo
 */
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const { db, query } = require('./db/pool');

const PHOTO_PATH = process.argv[2]; // pass path as first arg

(async () => {
  try {
    /* ── 1. Read & encode the photo ─────────────────────────── */
    let photoUrl = '';
    if (PHOTO_PATH && fs.existsSync(PHOTO_PATH)) {
      const ext  = path.extname(PHOTO_PATH).slice(1).replace('jpg', 'jpeg');
      const data = fs.readFileSync(PHOTO_PATH).toString('base64');
      photoUrl   = `data:image/${ext};base64,${data}`;
      console.log(`✓ Photo loaded (${Math.round(data.length / 1024)} KB base64)`);
    } else {
      console.log('⚠ No photo path provided or file not found — CV will have no photo.');
    }

    /* ── 2. Upsert the "Azure Glass Pro" template ───────────── */
    const TEMPLATE_NAME = 'Azure Glass Pro';
    let templateId;

    const existing = await query('SELECT id FROM cv_templates WHERE name = ?', [TEMPLATE_NAME]);
    if (existing.rows.length) {
      templateId = existing.rows[0].id;
      console.log(`✓ Template already exists  id=${templateId}`);
    } else {
      const result = await query(
        `INSERT INTO cv_templates
          (name, description, category, thumbnail_url, preview_html, default_colors, price_cents)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          TEMPLATE_NAME,
          'A sleek azure-blue & white two-column CV with glassmorphism accents, bold header bar, circular portrait, icon-tagged contact row, skill progress bars, and a clean experience timeline.',
          'Modern',
          '',
          '',
          JSON.stringify(['#0EA5E9', '#0369A1', '#F0F9FF', '#0F172A']),
          299,
        ]
      );
      templateId = result.lastID;
      console.log(`✓ Template created  id=${templateId}`);
    }

    /* ── 3. Insert the sample CV for user id 5 (admin) ─────── */
    const cvContent = {
      fullName:     'Alex Chen',
      jobTitle:     'Senior Full-Stack Developer',
      email:        'alex.chen@techmail.com',
      phone:        '+1 (415) 882-3370',
      location:     'San Francisco, CA',
      linkedin:     'linkedin.com/in/alexchen-dev',
      github:       'github.com/alexchen',
      website:      'alexchen.dev',
      summary:
        'Passionate full-stack engineer with 6+ years of experience building scalable web applications. ' +
        'Proven track record of leading cross-functional teams and delivering products that delight users. ' +
        'Deep expertise in React, Node.js, TypeScript, and cloud-native architecture.',
      photoUrl,

      education: [
        {
          degree:      'B.Sc. Computer Science',
          institution: 'University of California, Berkeley',
          startDate:   '2014-08',
          endDate:     '2018-05',
          description: 'Graduated Magna Cum Laude. Dean\'s List 4 semesters. Thesis on distributed graph algorithms.',
        },
      ],

      experience: [
        {
          title:       'Senior Full-Stack Developer',
          company:     'Stripe Inc.',
          startDate:   '2021-03',
          endDate:     '',
          current:     true,
          description:
            '• Led a team of 6 engineers to rebuild the merchant dashboard — reduced load time by 62%.\n' +
            '• Architected a real-time webhook delivery system handling 2M+ events/day.\n' +
            '• Mentored 3 junior engineers; 2 promoted within 12 months.',
        },
        {
          title:       'Full-Stack Engineer',
          company:     'Airbnb',
          startDate:   '2018-07',
          endDate:     '2021-02',
          current:     false,
          description:
            '• Built the host onboarding flow used by 500K+ new hosts per year.\n' +
            '• Optimised PostgreSQL queries, cutting p99 API latency from 820 ms → 210 ms.\n' +
            '• Contributed to open-source React component library (2.4K GitHub stars).',
        },
      ],

      skills: [
        { name: 'TypeScript / JavaScript', level: 'Expert' },
        { name: 'React & Next.js',         level: 'Expert' },
        { name: 'Node.js / Express',       level: 'Expert' },
        { name: 'PostgreSQL & Redis',      level: 'Advanced' },
        { name: 'AWS (EC2, S3, Lambda)',   level: 'Advanced' },
        { name: 'Docker & Kubernetes',     level: 'Intermediate' },
        { name: 'GraphQL & REST APIs',     level: 'Advanced' },
        { name: 'Python',                  level: 'Intermediate' },
      ],

      languages: [
        { name: 'English',  level: 'Native'       },
        { name: 'Mandarin', level: 'Professional' },
        { name: 'Spanish',  level: 'Conversational'},
      ],

      certifications: [
        {
          name:        'AWS Certified Solutions Architect – Professional',
          issuer:      'Amazon Web Services',
          date:        '2023-04',
          description: 'Credential ID: AWS-SAP-123456',
        },
        {
          name:        'Google Cloud Professional Developer',
          issuer:      'Google',
          date:        '2022-09',
          description: 'Credential ID: GCP-PD-789012',
        },
      ],

      projects: [
        {
          name:        'OpenBoard — Real-time Kanban',
          url:         'github.com/alexchen/openboard',
          description:
            'Open-source project management tool built with Next.js 14, tRPC, and Prisma. ' +
            '4.1K GitHub stars, 350+ forks.',
          technologies: ['Next.js', 'tRPC', 'Prisma', 'PostgreSQL'],
        },
        {
          name:        'NeuralSearch SDK',
          url:         'npmjs.com/package/neuralsearch',
          description:
            'TypeScript SDK wrapping vector-similarity search APIs. 80K weekly npm downloads.',
          technologies: ['TypeScript', 'Pinecone', 'OpenAI'],
        },
      ],

      references: [
        {
          name:     'Sarah Mitchell',
          title:    'Engineering Manager @ Stripe',
          email:    's.mitchell@stripe.com',
          phone:    '+1 (415) 000-0001',
        },
      ],
    };

    const insert = await query(
      `INSERT INTO user_cvs (user_id, template_id, title, selected_color, content, is_finalized)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        5,                               // admin user id
        templateId,
        'Alex Chen — Senior Full-Stack Developer',
        '#0EA5E9',
        JSON.stringify(cvContent),
        1,
      ]
    );

    console.log(`\n✓ Sample CV created  id=${insert.lastID}`);
    console.log(`  Template : ${TEMPLATE_NAME} (id ${templateId})`);
    console.log(`  User     : Admin (id 5)`);
    console.log(`  Title    : Alex Chen — Senior Full-Stack Developer`);
    console.log('\nView it at: http://localhost:4200/my-cv');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    db.close();
  }
})();
