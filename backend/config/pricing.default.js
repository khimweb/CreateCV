const DEFAULT_HOMEPAGE_PRICING = {
  exchangeRateKhr: 4100,
  telegramLink: 'https://t.me/cvresumecqprofessional',
  plans: {
    coverLetter: {
      name: 'Cover Letter',
      badge: 'Quick & Essential',
      description: 'A polished, recruiter-ready letter tailored to introduce your strengths.',
      priceUsd: 1,
      period: '/ one-time',
      features: [
        'Professional formal header & styling',
        'Matches your CV typography & accent',
        'Instant high-res PDF & Word download',
        'No watermark & unlimited edits'
      ],
      buttonText: 'Choose Cover Letter',
      buttonLink: '/templates'
    },
    professionalCv: {
      name: 'Professional CV',
      badge: 'Complete CV',
      ribbon: 'Most Popular',
      description: 'Recruiter-standard curriculum vitae with interactive styling & live color picker.',
      priceUsd: 4,
      period: '/ one-time',
      features: [
        'Access all 15+ modern CV templates',
        'Custom color schemes & typography zoom',
        'Export to PDF, DOCX & editable PPTX',
        '100% Watermark removed & instant unlock'
      ],
      buttonText: 'Build My CV Now',
      buttonLink: '/templates'
    },
    editPic: {
      name: 'Edit Pic for CV',
      badge: 'Studio Service',
      description: 'Upgrade regular selfies into crisp, corporate studio headshots with suit & backdrop.',
      priceUsd: 5,
      period: '/ photo',
      features: [
        'Formal business attire / suit fitting',
        'Studio background (blue, white or grey)',
        'Lighting, face retouch & glare removal',
        'Direct 1-on-1 support via Telegram'
      ],
      buttonText: 'Contact on Telegram',
      buttonLink: 'https://t.me/cvresumecqprofessional'
    }
  },
  bundle: {
    kicker: 'ALL-IN-ONE CAREER PACKAGE',
    title: 'CV + Cover Letter + Edit Pic Professional',
    badgeTop: '🔥 BEST VALUE • SAVE $2 (ORIGINAL $10)',
    description: 'Everything you need to stand out from hundreds of applicants. You get the complete CV, the matching Cover Letter, plus a studio-edited executive photo delivered via Telegram.',
    originalPriceUsd: 10,
    priceUsd: 8,
    telegramButtonText: 'Get Bundle via Telegram ($8)',
    secondaryButtonText: 'Start Online Now',
    secondaryButtonLink: '/templates',
    subtext: 'Fast turnaround • Dedicated assistance',
    items: [
      { name: 'Professional CV', value: '$4 value' },
      { name: 'Cover Letter', value: '$1 value' },
      { name: 'Studio Photo Edit', value: '$5 value' },
      { name: 'Priority Telegram Support', value: '' }
    ]
  }
};

module.exports = { DEFAULT_HOMEPAGE_PRICING };
