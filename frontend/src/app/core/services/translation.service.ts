import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'kh';

export interface Translations {
  [key: string]: {
    en: string;
    kh: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'cq_language_preference';

  // Current language signal
  currentLang = signal<Language>(this.getInitialLanguage());

  // Dictionary of translations
  private dictionary: Translations = {
    // Nav links
    navHome: { en: 'Home', kh: 'ទំព័រដើម' },
    navTemplates: { en: 'Templates', kh: 'គំរូ CV' },
    navMyCv: { en: 'My CV', kh: 'CV របស់ខ្ញុំ' },
    navMore: { en: 'More', kh: 'បន្ថែម' },
    navPricing: { en: 'Pricing', kh: 'តម្លៃ' },
    navAbout: { en: 'About CQ', kh: 'អំពីយើង' },
    navContact: { en: 'Contact', kh: 'ទំនាក់ទំនង' },
    navHelp: { en: 'Help Center', kh: 'មជ្ឈមណ្ឌលជំនួយ' },
    navPayments: { en: 'Payments', kh: 'ប្រវត្តិបង់ប្រាក់' },
    navSignIn: { en: 'Sign In', kh: 'ចូលគណនី' },
    navCreateCv: { en: 'Create CV', kh: 'បង្កើត CV' },
    navMyAccount: { en: 'My Account', kh: 'គណនីរបស់ខ្ញុំ' },
    navAdmin: { en: 'Administrator', kh: 'អ្នកគ្រប់គ្រង' },
    navAdminPanel: { en: 'Admin Panel', kh: 'ផ្ទាំងគ្រប់គ្រង Admin' },
    navSettings: { en: 'Settings', kh: 'ការកំណត់' },
    navLogOut: { en: 'Log out', kh: 'ចាកចេញ' },
    navReceipts: { en: 'Payments & Receipts', kh: 'ការទូទាត់ និងបង្កាន់ដៃ' },

    // Hero & Common
    heroBadge: { en: '2026 Modern Career Suite', kh: 'ឈុតអាជីពទំនើបឆ្នាំ ២០២៦' },
    heroTitlePrefix: { en: 'Land Your Dream Job with a', kh: 'ឈានទៅរកការងារក្នុងក្តីស្រមៃជាមួយ' },
    heroTitleAccent: { en: 'Standout CV & Cover Letter', kh: 'CV និងលិខិតសុំការងារដ៏ទាក់ទាញ' },
    heroDesc: {
      en: 'Recruiter-tested A4 layouts, instant live preview, studio-grade portrait retouching, and seamless export in PDF, Word & PowerPoint. Powered by fast NBC Bakong KHQR.',
      kh: 'ប្លង់ទម្រង់ A4 ស្របតាមស្តង់ដារជ្រើសរើសបុគ្គលិក មើលគំរូជាក់ស្តែងភ្លាមៗ កែរូបថតកម្រិតស្ទូឌីយោ និងទាញយកជា PDF, Word និង PowerPoint យ៉ាងរលូន។ ទូទាត់រហ័សតាម NBC បាគង KHQR។'
    },
    heroBtnStart: { en: 'Create My CV Now', kh: 'បង្កើត CV របស់ខ្ញុំឥឡូវនេះ' },
    heroBtnPricing: { en: 'View Pricing & Plans', kh: 'មើលតម្លៃ និងកញ្ចប់សេវា' },

    // Trust pills
    trustKhqr: { en: 'Instant KHQR Scan', kh: 'ស្កេន KHQR ភ្លាមៗ' },
    trustA4: { en: 'Real A4 Print Layouts', kh: 'ទម្រង់បោះពុម្ព A4 ពិតប្រាកដ' },
    trustTelegram: { en: 'Telegram Support', kh: 'សេវាជំនួយតាម Telegram' },

    // Hero Preview Showcase
    previewApprovedBadge: { en: 'Recruiter-Approved Design', kh: 'រចនាបថស្របតាមស្តង់ដារជ្រើសរើសបុគ្គលិក' },
    previewRatingTrust: { en: 'Trusted by 2,500+ job seekers', kh: 'ជឿទុកចិត្តដោយអ្នកស្វែងរកការងារជាង 2,500 នាក់' },
    previewReadyExport: { en: 'Ready for Export', kh: 'រួចរាល់សម្រាប់ការទាញយក' },

    // Stats Ticker
    statTemplates: { en: 'Designer Templates', kh: 'គំរូរចនាអាជីព' },
    statPrice: { en: 'Starting Price', kh: 'តម្លៃចាប់ផ្តើមត្រឹម' },
    statA4: { en: 'Standard A4 Format', kh: 'ទម្រង់ស្តង់ដារ A4' },
    statTime: { en: 'Average Build Time', kh: 'ចំណាយពេលត្រឹម' },

    // Pricing Section
    pricingBadge: { en: 'Transparent & Affordable', kh: 'តម្លៃសមរម្យ និងច្បាស់លាស់' },
    pricingTitle: { en: 'Simple, Honest Pricing For Every Step', kh: 'តម្លៃសមរម្យ និងស្មោះត្រង់សម្រាប់គ្រប់ដំណាក់កាល' },
    pricingSubtitle: {
      en: 'Get individual tools or save big with our all-in-one career bundle. No hidden subscriptions.',
      kh: 'ទិញសេវាកម្មដាច់ដោយឡែក ឬសន្សំសំចៃខ្ពស់ជាមួយកញ្ចប់រួម។ គ្មានការកាត់ប្រាក់ប្រចាំខែឡើយ។'
    },

    // Individual Plans
    planCoverLetterBadge: { en: 'Essential Match', kh: 'ចាំបាច់សម្រាប់ការងារ' },
    planCoverLetterDesc: { en: 'Professional ATS-compliant cover letter builder', kh: 'បង្កើតលិខិតសុំការងារស្របតាមស្តង់ដារក្រុមហ៊ុន' },
    planCoverLetterBtn: { en: 'Create Cover Letter', kh: 'បង្កើតលិខិតឥឡូវនេះ' },

    planCvBadge: { en: 'Core Career Tool', kh: 'ឧបករណ៍ស្នូលសម្រាប់អាជីព' },
    planCvRibbon: { en: 'Most Popular', kh: 'ពេញនិយមបំផុត' },
    planCvDesc: { en: 'One-time unlock for full A4 template & exports', kh: 'បង់ម្តងប្រើប្រាស់ និងទាញយកគំរូ A4 បានរហូត' },
    planCvBtn: { en: 'Choose Template & Start', kh: 'ជ្រើសរើសគំរូ និងចាប់ផ្តើម' },

    planPhotoBadge: { en: 'Studio Grade', kh: 'កម្រិតស្ទូឌីយោ' },
    planPhotoDesc: { en: 'Hand-retouched by a professional designer via Telegram', kh: 'កាត់ត និងកែរូបថតដោយអ្នករចនាជំនាញតាម Telegram' },
    planPhotoBtn: { en: 'Contact via Telegram', kh: 'ទាក់ទងតាម Telegram' },

    // Mega Combo Bundle
    bundleBadgeTop: { en: 'ALL-IN-ONE CAREER ACCELERATOR', kh: 'កញ្ចប់ពិសេសពន្លឿនអាជីពការងារ' },
    bundleKicker: { en: 'THE BEST VALUE PACK', kh: 'កញ្ចប់សន្សំសំចៃខ្ពស់បំផុត' },
    bundleTitle: { en: 'Complete Job Application Bundle', kh: 'កញ្ចប់ពេញលេញសម្រាប់ដាក់ពាក្យការងារ' },
    bundleDesc: {
      en: 'Everything you need to apply with 100% confidence. Get your tailored CV, matching cover letter, and a polished studio portrait in one swift package.',
      kh: 'គ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីដាក់ពាក្យដោយទំនុកចិត្តខ្ពស់។ ទទួលបាន CV ផ្ទាល់ខ្លួន លិខិតសុំការងារដែលត្រូវគ្នា និងរូបថតកែសម្រួលយ៉ាងស្រស់ស្អាតក្នុងកញ្ចប់តែមួយ។'
    },
    bundleItemCv: { en: '1× Professional CV Template', kh: 'គំរូ CV អាជីពស្តង់ដារ 1' },
    bundleItemCl: { en: '1× Matching Cover Letter', kh: 'លិខិតសុំការងារដែលត្រូវគ្នា 1' },
    bundleItemPhoto: { en: '1× Studio Portrait Retouch', kh: 'សេវាកែសម្រួលរូបថតកម្រិតស្ទូឌីយោ 1' },
    bundleItemFormats: { en: 'Instant Multi-Format Export (PDF, Word, PPTX)', kh: 'ទាញយកជា PDF, Word, PPTX ភ្លាមៗ' },
    bundleItemSupport: { en: 'Telegram Direct VIP Support', kh: 'សេវាជំនួយពិសេសតាម Telegram' },
    bundleOrderTelegram: { en: 'Order via Telegram', kh: 'កុម្ម៉ង់តាម Telegram' },
    bundleBuildOnline: { en: 'Build Online', kh: 'បង្កើតលើវេបសាយ' },
    bundleSubtext: { en: 'One-time payment • Lifetime access • Zero watermarks', kh: 'បង់តែម្តង • ប្រើប្រាស់បានរហូត • គ្មាន Watermark' },

    // Why Choose Section
    whyBadge: { en: 'Why Choose CQ Professional', kh: 'ហេតុអ្វីជ្រើសរើស CQ Professional' },
    whyTitle: { en: 'Built For Results, Not Just Aesthetics', kh: 'បង្កើតឡើងដើម្បីលទ្ធផល មិនមែនត្រឹមតែសម្រស់' },
    whySubtitle: {
      en: 'Every pixel is optimized to pass recruiter scans, look crisp on print, and present your career narrative clearly.',
      kh: 'គ្រប់ព័ត៌មានត្រូវបានរៀបចំយ៉ាងច្បាស់លាស់ ដើម្បីទាក់ទាញភ្នែកអ្នកជ្រើសរើសបុគ្គលិក បោះពុម្ពច្បាស់ល្អ និងបង្ហាញពីសមត្ថភាពរបស់អ្នក។'
    },
    benefit1Title: { en: 'Pixel-Perfect Real A4 Layouts', kh: 'ប្លង់ទម្រង់ A4 ស្តង់ដារឥតខ្ចោះ' },
    benefit1Text: {
      en: 'What you see is exactly what you get. Engineered specifically to print on standard A4 paper without awkward breaks or misalignment.',
      kh: 'អ្វីដែលអ្នកឃើញគឺជាអ្វីដែលអ្នកទទួលបាន។ រៀបចំឡើងយ៉ាងពិសេសដើម្បីបោះពុម្ពលើក្រដាស A4 ដោយគ្មានការដាច់ទំព័រ ឬខូចទ្រង់ទ្រាយឡើយ។'
    },
    benefit2Title: { en: 'Studio-Grade Portrait Retouching', kh: 'កែសម្រួលរូបថតកម្រិតស្ទូឌីយោ' },
    benefit2Text: {
      en: 'Our professional designers touch up lighting, remove background distractions, and format your photo cleanly for modern HR standards.',
      kh: 'អ្នករចនាជំនាញរបស់យើងជួយកែពន្លឺ លុបផ្ទៃខាងក្រោយរញ៉េរញ៉ៃ និងតម្រឹមរូបថតរបស់អ្នកឱ្យស្របតាមស្តង់ដារធនធានមនុស្សទំនើប។'
    },
    benefit3Title: { en: 'Instant NBC Bakong KHQR Payment', kh: 'ទូទាត់រហ័សតាម NBC បាគង KHQR' },
    benefit3Text: {
      en: 'Scan and unlock in seconds using any banking app in Cambodia. No credit cards or lengthy checkouts needed.',
      kh: 'ស្កេន និងបើកដំណើរការត្រឹមប៉ុន្មានវិនាទីតាមរយៈកម្មវិធីធនាគារនានាក្នុងប្រទេសកម្ពុជា។ មិនចាំបាច់មានកាតឥណទាន ឬនីតិវិធីស្មុគស្មាញ។'
    },
    benefit4Title: { en: 'Multi-Format Export: PDF, Word & PPTX', kh: 'ទាញយកជា PDF, Word និង PPTX' },
    benefit4Text: {
      en: 'Export your completed documents in standard PDF for email, editable Word (.doc) for quick tweaks, or PowerPoint for tailored presentations.',
      kh: 'ទាញយកឯកសាររបស់អ្នកជា PDF សម្រាប់ផ្ញើអ៊ីមែល Word (.doc) សម្រាប់កែសម្រួលបន្ថែម ឬ PowerPoint សម្រាប់ការធ្វើបទបង្ហាញ។'
    },
    benefitSupportTitle: { en: 'Direct Telegram Photo & Care Support', kh: 'សេវាជំនួយ និងកាត់តរូបថតតាម Telegram' },
    benefitSupportText: {
      en: 'Need your photo retouched in a professional formal suit or custom design tweaks? Connect directly with our team on Telegram.',
      kh: 'ត្រូវការជំនួយកែសម្រួលរូបថតក្នុងឈុតអាជីព ឬកែប្រែទម្រង់តាមតម្រូវការ? អាចទាក់ទងផ្ទាល់ជាមួយក្រុមការងារយើងតាម Telegram។'
    },

    // Templates Showcase Section
    templatesBadge: { en: 'Tested A4 CV Designs', kh: 'គំរូ CV ស្តង់ដារ A4 ដែលបានផ្ទៀងផ្ទាត់' },
    templatesTitle: { en: 'Preview Live CV Layouts Before You Start', kh: 'មើលគំរូ CV ជាក់ស្តែងមុនពេលអ្នកចាប់ផ្តើម' },
    templatesSubtitle: { en: '4 distinct recruiter-approved styles formatted to standard full A4 print.', kh: 'រចនាបថ 4 ប្លែកពីគ្នា ស្របតាមស្តង់ដារជ្រើសរើសបុគ្គលិក និងបោះពុម្ពលើក្រដាស A4 យ៉ាងល្អឥតខ្ចោះ។' },
    templatesSeeAll: { en: 'See all 19 templates', kh: 'មើលគំរូទាំង 19+' },
    useTemplate: { en: 'Use Template', kh: 'ប្រើគំរូនេះ' },

    // Cover Letters Showcase Section
    clBadge: { en: 'Matching Cover Letters', kh: 'លិខិតសុំការងារដែលត្រូវគ្នា' },
    clTitle: { en: 'Pair With a Matching Cover Letter', kh: 'ផ្គូផ្គងជាមួយលិខិតសុំការងារដ៏ទាក់ទាញ' },
    clSubtitle: { en: '4 ATS-ready cover letter designs to introduce your strengths and win interviews.', kh: 'រចនាបថលិខិតសុំការងារ 4 ប្លែកពីគ្នា ដើម្បីបង្ហាញពីភាពខ្លាំង និងទទួលបានការសម្ភាសន៍។' },
    useLetter: { en: 'Use Letter', kh: 'ប្រើលិខិតនេះ' },

    // Final CTA Section
    ctaBadge: { en: 'Ready When You Are', kh: 'រួចរាល់សម្រាប់អ្នកជានិច្ច' },
    ctaTitle: { en: 'Build the CV You Will Be Proud to Send', kh: 'បង្កើត CV ដែលអ្នកមានមោទនភាពក្នុងការផ្ញើ' },
    ctaDesc: {
      en: 'Choose your layout, preview live, and unlock your watermark-free document in minutes. Need help or custom photo retouching? Connect directly with us on Telegram!',
      kh: 'ជ្រើសរើសប្លង់ដែលអ្នកពេញចិត្ត មើលគំរូជាក់ស្តែង និងទាញយកឯកសារគ្មានសញ្ញាសម្គាល់ (Watermark) ក្នុងរយៈពេលតែប៉ុន្មាននាទី។ ត្រូវការជំនួយ ឬកែរូបថត? ទាក់ទងមកយើងដោយផ្ទាល់តាម Telegram!'
    },
    ctaChooseTemplate: { en: 'Choose a Template', kh: 'ជ្រើសរើសគំរូ CV' },
    ctaTelegramSupport: { en: 'Telegram Support', kh: 'ជំនួយតាម Telegram' },

    // Switcher tooltips
    langSwitchToKh: { en: 'Switch to Khmer', kh: 'ប្តូរទៅជាភាសាខ្មែរ' },
    langSwitchToEn: { en: 'Switch to English', kh: 'ប្តូរទៅជាភាសាអង់គ្លេស' },

    // Template Gallery Page (/templates)
    galleryBadge: { en: '19+ Handcrafted A4 Designs • ATS Optimized', kh: 'គំរូ A4 ជាង 19+ រចនាយ៉ាងប្រណិត • ស្របតាមស្តង់ដារក្រុមហ៊ុន' },
    galleryTitlePrefix: { en: 'Choose Your', kh: 'ជ្រើសរើស' },
    galleryTitleHighlight: { en: 'Signature Template', kh: 'គំរូ CV តាមចិត្តរបស់អ្នក' },
    gallerySubtitle: {
      en: 'Every layout is mathematically locked to standard 210mm × 297mm A4 proportions. Select an accent color, preview live, and export with zero watermarks.',
      kh: 'គ្រប់ប្លង់ត្រូវបានរៀបចំយ៉ាងត្រឹមត្រូវតាមខ្នាតស្តង់ដារ A4 (210mm × 297mm)។ ជ្រើសរើសពណ៌ដែលអ្នកពេញចិត្ត មើលគំរូផ្ទាល់ និងទាញយកដោយគ្មាន Watermark ឡើយ។'
    },
    gallerySearchPlaceholder: {
      en: 'Search by name, category or role (e.g. Modern, Timeline, Minimalist)...',
      kh: 'ស្វែងរកតាមឈ្មោះ ឬប្រភេទគំរូ (ឧទាហរណ៍៖ Modern, Timeline, Minimalist)...'
    },
    galleryFilterAll: { en: 'All Layouts', kh: 'គ្រប់ទម្រង់ទាំងអស់' },
    galleryFilterPhoto: { en: 'With Photo', kh: 'មានរូបថត' },
    galleryFilterNone: { en: 'No Photo', kh: 'គ្មានរូបថត' },
    galleryCatAll: { en: 'All Templates', kh: 'គំរូទាំងអស់' },
    galleryCatModern: { en: 'Modern', kh: 'បែបទំនើប' },
    galleryCatMinimal: { en: 'Minimal', kh: 'បែបសាមញ្ញ' },
    galleryCatProfessional: { en: 'Professional', kh: 'បែបអាជីព' },
    galleryCatCreative: { en: 'Creative', kh: 'បែបច្នៃប្រឌិត' },
    galleryCatClassic: { en: 'Classic', kh: 'បែបបុរាណ' },
    galleryCatCoverLetter: { en: 'Cover Letter', kh: 'លិខិតសុំការងារ' },
    galleryShowing: { en: 'Showing', kh: 'បង្ហាញ' },
    galleryOf: { en: 'of', kh: 'ក្នុងចំណោម' },
    galleryUse: { en: 'Use', kh: 'ប្រើ' },
    galleryThemes: { en: 'themes', kh: 'ជម្រើសពណ៌' },
    galleryBadgePhoto: { en: '📸 Portrait', kh: '📸 មានរូបថត' },
    galleryBadgeTextOnly: { en: '📄 Text', kh: '📄 អត្ថបទសុទ្ធ' },
    galleryEmptyTitle: { en: 'No templates found', kh: 'រកមិនឃើញគំរូឡើយ' },
    galleryEmptyDesc: {
      en: 'No layouts matched your search or filters. Try searching for something else or reset your criteria.',
      kh: 'មិនមានគំរូណាដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។ សូមសាកល្បងស្វែងរកពាក្យផ្សេង ឬកំណត់ការស្វែងរកឡើងវិញ។'
    },
    galleryResetFilters: { en: 'Reset All Filters', kh: 'កំណត់ការស្វែងរកឡើងវិញ' },
    galleryRetouchHeading: {
      en: 'Need Studio Photo Retouching in Formal Attire? ($5)',
      kh: 'ត្រូវការជំនួយកាត់តរូបថតក្នុងឈុតអាវធំអាជីព? ($5)'
    },
    galleryRetouchSub: {
      en: 'Our graphic design team swaps casual selfies into corporate suits with studio backdrops ready for your CV.',
      kh: 'ក្រុមការងាររចនារបស់យើងជួយប្តូររូបថតធម្មតាឱ្យទៅជារូបថតក្នុងឈុតអាវធំផ្លូវការស្អាតបាត ស័ក្តិសមបំផុតសម្រាប់ដាក់ក្នុង CV។'
    },
    galleryTelegramContact: { en: 'Contact on Telegram ($5)', kh: 'ទាក់ទងតាម Telegram ($5)' },

    // My CV Dashboard Page (/my-cv)
    myCvBadge: { en: 'DOCUMENT DASHBOARD', kh: 'ផ្ទាំងគ្រប់គ្រងឯកសារ' },
    myCvTitlePrefix: { en: 'My', kh: 'បណ្តុំឯកសារ' },
    myCvTitleHighlight: { en: 'CV Library', kh: 'CV របស់ខ្ញុំ' },
    myCvSubtitle: {
      en: 'Preview, customize, download, and manage your CVs and cover letters in full A4 quality.',
      kh: 'មើលគំរូ កែសម្រួល ទាញយក និងគ្រប់គ្រង CV ព្រមទាំងលិខិតសុំការងាររបស់អ្នកតាមខ្នាត A4 យ៉ាងច្បាស់ល្អឥតខ្ចោះ។'
    },
    myCvCreateNew: { en: 'Create New CV', kh: 'បង្កើត CV ថ្មី' },
    myCvTotalDocs: { en: 'Total Documents', kh: 'ឯកសារសរុប' },
    myCvUnlockedExport: { en: 'Unlocked (Ready to Export)', kh: 'បានដោះសោ (រួចរាល់សម្រាប់ទាញយក)' },
    myCvDraftsProgress: { en: 'Drafts (In Progress)', kh: 'ឯកសារព្រាង (កំពុងកែសម្រួល)' },
    myCvSearchPlaceholder: {
      en: 'Search documents by title or template...',
      kh: 'ស្វែងរកឯកសារតាមចំណងជើង ឬឈ្មោះគំរូ...'
    },
    myCvAllDocs: { en: 'All Documents', kh: 'ឯកសារទាំងអស់' },
    myCvUnlocked: { en: 'Unlocked', kh: 'បានដោះសោ' },
    myCvDraft: { en: 'Drafts', kh: 'ឯកសារព្រាង' },
    myCvEmptyTitle: { en: 'Your CV Library is Empty', kh: 'មិនទាន់មានឯកសារ CV នៅក្នុងបញ្ជីឡើយ' },
    myCvEmptyDesc: {
      en: "You haven't created any CVs or cover letters yet. Choose from our modern, ATS-ready templates to get started.",
      kh: 'អ្នកមិនទាន់បានបង្កើត CV ឬលិខិតសុំការងារណាមួយនៅឡើយទេ។ សូមជ្រើសរើសគំរូទំនើបៗរបស់យើងដើម្បីចាប់ផ្តើម។'
    },
    myCvEmptyBtn: { en: 'Browse Templates & Create CV', kh: 'ស្វែងរកគំរូ & បង្កើត CV' },
    myCvNoMatchesTitle: { en: 'No matching documents', kh: 'រកមិនឃើញឯកសារដែលត្រូវគ្នាឡើយ' },
    myCvNoMatchesDesc: {
      en: 'No documents matched your search query or filter. Try clearing your filters or searching for something else.',
      kh: 'មិនមានឯកសារណាដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។ សូមសាកល្បងសម្អាតតម្រង ឬស្វែងរកពាក្យផ្សេង។'
    },
    myCvResetFilters: { en: 'Reset Search & Filters', kh: 'កំណត់ការស្វែងរកឡើងវិញ' },
    myCvBadgeCl: { en: 'Cover Letter', kh: 'លិខិតសុំការងារ' },
    myCvBadgeCv: { en: 'Curriculum Vitae', kh: 'ប្រវត្តិរូបសង្ខេប (CV)' },
    myCvBtnEdit: { en: 'Edit', kh: 'កែសម្រួល' },
    myCvBtnEditCv: { en: 'Edit CV', kh: 'កែសម្រួល CV' },
    myCvBtnPreview: { en: 'Preview', kh: 'មើលផ្ទាល់' },
    myCvBtnDownload: { en: 'Download', kh: 'ទាញយក' },
    myCvBtnGetCv: { en: 'Get CV', kh: 'ដោះសោ CV' },
    myCvBtnDeleteTooltip: { en: 'Delete document', kh: 'លុបឯកសារ' },
    myCvExportTitle: { en: 'Export Document', kh: 'ទាញយកឯកសារ' },
    myCvExportSubtitle: { en: 'Select your preferred export format:', kh: 'សូមជ្រើសរើសទម្រង់ឯកសារដែលអ្នកចង់ទាញយក៖' },
    myCvHighQuality: { en: 'High Quality', kh: 'គុណភាពខ្ពស់' },
    myCvCancel: { en: 'Cancel', kh: 'បោះបង់' },

    // About Page Translations
    aboutBadge: { en: 'About CQ-Professional • Career Suite', kh: 'អំពី CQ-Professional • ឈុតឧបករណ៍អាជីព' },
    aboutHeroTitle1: { en: 'Crafted for Careers.', kh: 'បង្កើតឡើងដើម្បីអាជីពការងារ។' },
    aboutHeroTitle2: { en: 'Engineered for Confidence.', kh: 'រចនាឡើងដើម្បីទំនុកចិត្តខ្ពស់។' },
    aboutHeroLead: {
      en: 'We built CQ-Professional to fix everything wrong with modern resume builders: hidden $30/month subscription traps, rigid formats that break on export, and low-res downloads. Here, you get true A4 pixel-perfect layouts, instant KHQR access, and dedicated studio portrait retouching.',
      kh: 'យើងបានបង្កើត CQ-Professional ឡើងដើម្បីដោះស្រាយរាល់បញ្ហាដែលជួបប្រទះលើគេហទំព័របង្កើត CV ទូទៅ៖ ការលួចកាត់ប្រាក់ប្រចាំខែរហូតដល់ $30 ទម្រង់ខូចពេលទាញយក និងរូបភាពបែកគុណភាពទាប។ នៅទីនេះ អ្នកទទួលបានប្លង់ទម្រង់ A4 ស្តង់ដារច្បាស់កម្រិតខ្ពស់ ទូទាត់រហ័សតាម KHQR និងសេវាកាត់តរូបថតក្នុងឈុតអាវធំអាជីពយ៉ាងស្អាតបាត។'
    },
    aboutBtnExplore: { en: 'Explore 19+ Templates', kh: 'ស្វែងរកគំរូជាង ១៩+' },
    aboutBtnStartFree: { en: 'Start Building Free', kh: 'ចាប់ផ្តើមបង្កើតដោយឥតគិតថ្លៃ' },
    aboutTrustA4: { en: 'Standard A4 Print Precision', kh: 'ទម្រង់បោះពុម្ពស្តង់ដារ A4 ច្បាស់ល្អ' },
    aboutTrustNoSub: { en: 'Zero Subscription Traps', kh: 'គ្មានការកាត់ប្រាក់ប្រចាំខែឡើយ' },
    aboutTrustKhqr: { en: 'Instant Bakong KHQR', kh: 'ទូទាត់រហ័សតាម បាគង KHQR' },

    // Advantage Card
    aboutAdvStandard: { en: 'The CQ-Professional Standard', kh: 'ស្តង់ដារគុណភាព CQ-Professional' },
    aboutAdvHonest: { en: '100% Honest', kh: 'ស្មោះត្រង់ ១០០%' },
    aboutAdvTitle: { en: 'Why Job Seekers Choose Us', kh: 'ហេតុអ្វីបេក្ខជនជ្រើសរើសយើងខ្ញុំ' },
    aboutAdvItem1Title: { en: 'Pixel-Perfect 210 × 297mm A4', kh: 'ទំហំ A4 ស្តង់ដារពិត ២១០ × ២៩៧ មីលីម៉ែត្រ' },
    aboutAdvItem1Desc: { en: 'Guaranteed consistent formatting on screen, PDF export, and physical paper print.', kh: 'ធានាទម្រង់ដូចគ្នាបេះបិទទាំងលើអេក្រង់ ពេលទាញយកជា PDF និងពេលបោះពុម្ពលើក្រដាសជាក់ស្តែង។' },
    aboutAdvItem2Title: { en: 'Honest Transparent Pricing', kh: 'តម្លៃសមរម្យ និងស្មោះត្រង់ច្បាស់លាស់' },
    aboutAdvItem2Desc: { en: '$1 Cover Letter • $4 Professional CV • $8 All-In-One Pro Suite. No auto-renewing fees.', kh: '$1 លិខិតសុំការងារ • $4 CV អាជីព • $8 កញ្ចប់ពេញលេញ All-In-One។ គ្មានការកាត់លុយបន្តស្វ័យប្រវត្តិឡើយ។' },
    aboutAdvItem3Title: { en: 'NBC Bakong KHQR Instant Unlock', kh: 'ស្កេនដោះសោភ្លាមៗតាម NBC បាគង KHQR' },
    aboutAdvItem3Desc: { en: 'Scan with ABA Mobile, ACLEDA, Wing, or Bakong to instantly unlock watermark-free files.', kh: 'ស្កេនជាមួយ ABA Mobile, ACLEDA, Wing ឬ Bakong ដើម្បីដោះសោទាញយកឯកសារគ្មាន watermark ភ្លាមៗ។' },
    aboutAdvItem4Title: { en: 'Human Studio Photo Retouching ($5)', kh: 'សេវាកាត់តកែរូបថតស្ទូឌីយោដោយអ្នកជំនាញ ($5)' },
    aboutAdvItem4Desc: { en: 'Real graphic designers swap casual selfies into crisp formal suits with studio backdrops.', kh: 'អ្នករចនាជំនាញជួយប្តូររូបថតសែលហ្វីធម្មតា ឱ្យទៅជារូបថតក្នុងឈុតអាវធំផ្លូវការយ៉ាងស្រស់ស្អាត។' },
    aboutAdvRatingTrust: { en: 'Trusted by 2,500+ professionals', kh: 'ជឿទុកចិត្តដោយអ្នកអាជីពជាង ២,៥០០ នាក់' },

    // Stats ribbon
    aboutStatTemplates: { en: 'Designer A4 Templates', kh: 'គំរូ A4 អាជីពស្តង់ដារ' },
    aboutStatCost: { en: 'Accessible Starting Cost', kh: 'តម្លៃចាប់ផ្តើមសមរម្យបំផុត' },
    aboutStatPrintRatio: { en: 'A4 Vector Print Ratio', kh: 'ខ្នាតបោះពុម្ព A4 ត្រឹមត្រូវ ១០០%' },
    aboutStatTime: { en: 'Average Time to Finish', kh: 'ចំណាយពេលបង្កើតជាមធ្យម' },

    // Pillars
    aboutPillarsBadge: { en: 'Our Core Philosophy', kh: 'ទស្សនវិស័យចម្បងរបស់យើង' },
    aboutPillarsTitle: { en: 'Built with Intention in Every Pixel', kh: 'បង្កើតឡើងដោយការយកចិត្តទុកដាក់លើគ្រប់ចំណុច' },
    aboutPillarsSubtitle: {
      en: 'We combine high-performance web engineering with recruiter standards so your skills get the spotlight they deserve.',
      kh: 'យើងរួមបញ្ចូលគ្នារវាងបច្ចេកវិទ្យាគេហទំព័រទំនើប និងស្តង់ដារជ្រើសរើសបុគ្គលិក ដើម្បីឱ្យសមត្ថភាព និងបទពិសោធន៍របស់អ្នកលេចធ្លោបំផុត។'
    },
    aboutPillar1Title: { en: 'Mathematical A4 Precision', kh: 'ភាពជាក់លាក់ខ្ពស់តាមខ្នាត A4' },
    aboutPillar1Desc: {
      en: 'Unlike generic web editors that reflow unpredictably, our canvas is locked to 210mm × 297mm. Headers, margins, and lines stay in identical position on paper and screens.',
      kh: 'ខុសពីកម្មវិធីបង្កើត CV ផ្សេងទៀតដែលតែងតែខូចទ្រង់ទ្រាយ ផ្ទាំងការងាររបស់យើងត្រូវបានកំណត់យ៉ាងម៉ត់ចត់ត្រឹម ២១០ × ២៩៧ មីលីម៉ែត្រ។ ចំណងជើង គម្លាត និងបន្ទាត់រក្សាទីតាំងដូចគ្នាបេះបិទ។'
    },
    aboutPillar2Title: { en: 'ATS & Recruiter Vetted', kh: 'ស្របតាមស្តង់ដារក្រុមហ៊ុន និងប្រព័ន្ធ ATS' },
    aboutPillar2Desc: {
      en: 'Clear visual hierarchy, optimal line lengths, and semantic section sequencing ensure human recruiters and automated tracking systems can scan your qualifications effortlessly.',
      kh: 'ការរៀបចំលំដាប់លំដោយច្បាស់លាស់ ប្រវែងបន្ទាត់សមរម្យ និងផ្នែកនីមួយៗមានរបៀបរៀបរយ ជួយឱ្យអ្នកជ្រើសរើសបុគ្គលិក និងប្រព័ន្ធ ATS អាចមើលដឹងពីសមត្ថភាពរបស់អ្នកបានយ៉ាងងាយស្រួល។'
    },
    aboutPillar3Title: { en: 'Transparent One-Time Fees', kh: 'តម្លៃសមរម្យ បង់តែមួយដងគត់' },
    aboutPillar3Desc: {
      en: 'We never trap candidates in recurring credit card subscriptions. Pay once via NBC Bakong KHQR for what you need: $1 Cover Letter, $4 CV, or our $8 Complete Career Set.',
      kh: 'យើងមិនដែលមានការកាត់ប្រាក់ប្រចាំខែតាមកាតធនាគារឡើយ។ បង់ប្រាក់តែម្តងតាម NBC បាគង KHQR តាមអ្វីដែលអ្នកត្រូវការ៖ $1 លិខិតសុំការងារ, $4 CV, ឬ $8 កញ្ចប់ពេញលេញ។'
    },
    aboutPillar4Title: { en: 'Studio Human Touch', kh: 'ជំនួយកែសម្រួលរូបថតដោយអ្នករចនាផ្ទាល់' },
    aboutPillar4Desc: {
      en: 'Good resumes need great portraits. Through our dedicated Telegram concierge, our human design team enhances your headshot with executive attire and studio backdrops.',
      kh: 'CV ល្អត្រូវតែមានរូបថតសមរម្យ និងមានវិជ្ជាជីវៈ។ តាមរយៈ Telegram ក្រុមការងាររចនារបស់យើងនឹងជួយប្តូររូបថតរបស់អ្នកឱ្យក្លាយជាឈុតអាវធំផ្លូវការយ៉ាងស្រស់ស្អាត។'
    },

    // Showcase
    aboutShowcaseBadge: { en: 'Full A4 Real Templates', kh: 'គំរូ A4 ពិតប្រាកដជាក់ស្តែង' },
    aboutShowcaseTitle: { en: 'See the Actual Quality Before Starting', kh: 'ពិនិត្យមើលគុណភាពជាក់ស្តែងមុនពេលចាប់ផ្តើម' },
    aboutShowcaseSubtitle: {
      en: 'Interactive live renders powered by our A4 scaling engine. Every template retains crisp formatting.',
      kh: 'គំរូបង្ហាញជាក់ស្តែងជាមួយប្រព័ន្ធ A4 Scaling។ គ្រប់គំរូទាំងអស់រក្សាបាននូវទម្រង់ច្បាស់ល្អឥតខ្ចោះ។'
    },
    aboutShowcaseViewAll: { en: 'View All 19 Templates', kh: 'មើលគំរូទាំង ១៩+' },
    aboutCard1Overlay: { en: 'Explore Professional Layout ↗', kh: 'ស្វែងរកគំរូ Professional Layout ↗' },
    aboutCard1Sub: { en: 'Balanced chronology for experienced candidates', kh: 'ការរៀបចំបទពិសោធន៍តាមលំដាប់លំដោយសម្រាប់បេក្ខជនមានបទពិសោធន៍' },
    aboutCard2Overlay: { en: 'Explore Modern Split ↗', kh: 'ស្វែងរកគំរូ Modern Split ↗' },
    aboutCard2Sub: { en: 'High-contrast two-tone layout for creative roles', kh: 'ការរចនាបែបពីរសម្លេងយ៉ាងទាក់ទាញ ស័ក្តិសមសម្រាប់ផ្នែកច្នៃប្រឌិត' },
    aboutCard3Overlay: { en: 'Explore Elegant Frame ↗', kh: 'ស្វែងរកគំរូ Elegant Frame ↗' },
    aboutCard3Sub: { en: 'Executive bordered design for distinguished leaders', kh: 'ទម្រង់ស៊ុមដ៏ប្រណិតសម្រាប់ថ្នាក់ដឹកនាំ និងអ្នកគ្រប់គ្រង' },

    // 3-step Process
    aboutProcessBadge: { en: 'Frictionless Workflow', kh: 'ដំណាក់កាលងាយៗ និងរហ័ស' },
    aboutProcessTitle: { en: 'From Blank Slate to Interview in 3 Simple Steps', kh: 'ពីការចាប់ផ្តើមដំបូងរហូតដល់ការសម្ភាសន៍ការងារត្រឹម ៣ ជំហាន' },
    aboutProcessSubtitle: {
      en: 'No complex design software or confusing layers. Our guided form updates your live A4 document in real-time.',
      kh: 'មិនចាំបាច់ប្រើកម្មវិធីឌីហ្សាញស្មុគស្មាញឡើយ។ ប្រព័ន្ធបំពេញទិន្នន័យរបស់យើងនឹងបង្ហាញការផ្លាស់ប្តូរលើផ្ទាំង A4 ផ្ទាល់ភ្លាមៗ។'
    },
    aboutProcessBtn: { en: 'Create Your CV Now', kh: 'បង្កើត CV របស់អ្នកឥឡូវនេះ' },
    aboutStep1Title: { en: 'Pick Your Signature Template', kh: 'ជ្រើសរើសគំរូដែលអ្នកពេញចិត្ត' },
    aboutStep1Desc: {
      en: 'Browse 19+ recruiter-tested styles, switch accent colors, and select between CV or Cover Letter format.',
      kh: 'ជ្រើសរើសក្នុងចំណោមគំរូជាង ១៩+ ផ្លាស់ប្តូរពណ៌តាមចិត្ត និងជ្រើសរើសរវាងទម្រង់ CV ឬលិខិតសុំការងារ។'
    },
    aboutStep2Title: { en: 'Fill In Your Credentials', kh: 'បំពេញព័ត៌មានផ្ទាល់ខ្លួន និងប្រវត្តិការងារ' },
    aboutStep2Desc: {
      en: 'Enter your experience, education, skills, and upload your portrait. Watch your A4 page update live with zero lag.',
      kh: 'បញ្ចូលបទពិសោធន៍ ការសិក្សា ជំនាញ និងរូបថតរបស់អ្នក។ ផ្ទាំង A4 នឹងបង្ហាញព័ត៌មានជាក់ស្តែងភ្លាមៗយ៉ាងរលូន។'
    },
    aboutStep3Title: { en: 'Scan KHQR & Export Full PDF', kh: 'ស្កេន KHQR និងទាញយកជា PDF ពេញលេញ' },
    aboutStep3Desc: {
      en: 'Instantly remove watermarks with Bakong KHQR, export to vector PDF or DOCX, and send your application with pride.',
      kh: 'ដោះសោលុប watermark ភ្លាមៗជាមួយ បាគង KHQR ទាញយកជា PDF ឬ Word (DOCX) និងដាក់ពាក្យការងារដោយទំនុកចិត្ត។'
    },

    // Location & Story (Prey Kei)
    aboutLocBadge: { en: 'Rooted in Cambodia • Built for Global Careers', kh: 'ផ្តើមចេញពីកម្ពុជា • ដើម្បីអាជីពការងារកម្រិតអន្តរជាតិ' },
    aboutLocHeadingPrefix: { en: 'Crafted with Pride in', kh: 'បង្កើតឡើងដោយមោទនភាពនៅ' },
    aboutLocHeadingHighlight: { en: 'Prey Kei.', kh: 'ព្រៃកី (Prey Kei)។' },
    aboutLocLead: {
      en: 'CQ-Professional was designed and developed right here in Prey Kei, Phnom Penh. We believe world-class career tools should be accessible to all talent—from ambitious university students preparing for their first internship to seasoned professionals stepping into leadership roles.',
      kh: 'CQ-Professional ត្រូវបានបង្កើត និងអភិវឌ្ឍឡើងនៅសង្កាត់ព្រៃកី រាជធានីភ្នំពេញ។ យើងជឿជាក់ថា ឧបករណ៍ជំនួយអាជីពការងារកម្រិតស្តង់ដារអន្តរជាតិ គួរតែមានតម្លៃសមរម្យសម្រាប់មនុស្សគ្រប់រូប—ចាប់តាំងពីនិស្សិតសាកលវិទ្យាល័យដែលកំពុងត្រៀមចុះកម្មសិក្សា រហូតដល់អ្នកជំនាញដែលមានបទពិសោធន៍ច្រើនឆ្នាំ។'
    },
    aboutLocSub: {
      en: 'Have questions, need custom template adjustments, or want your photo retouched in a corporate suit? Our team is right here to assist you directly.',
      kh: 'មានចម្ងល់ ត្រូវការការកែសម្រួលគំរូបន្ថែម ឬចង់បានការកាត់តរូបថតក្នុងឈុតអាវធំផ្លូវការមែនទេ? ក្រុមការងារយើងខ្ញុំនៅទីនេះផ្ទាល់ដើម្បីជួយសម្រួលលោកអ្នក។'
    },
    aboutLocBtnMaps: { en: 'View on Google Maps ↗', kh: 'មើលលើ Google Maps ↗' },
    aboutLocBtnTelegram: { en: 'Telegram Concierge', kh: 'សេវាជំនួយ Telegram' },
    aboutLocTag: { en: 'Prey Kei, Phnom Penh', kh: 'ព្រៃកី, រាជធានីភ្នំពេញ' },

    // Final CTA
    aboutCtaBadge: { en: 'Start Standing Out', kh: 'ចាប់ផ្តើមបង្កើតភាពលេចធ្លោ' },
    aboutCtaTitle: { en: 'Ready to Build a CV You Are Truly Proud Of?', kh: 'ត្រៀមខ្លួនរួចរាល់ហើយឬនៅ ក្នុងការបង្កើត CV ដ៏មានមោទនភាព?' },
    aboutCtaDesc: {
      en: 'Join thousands of applicants who upgraded their job search with CQ-Professional. Choose your layout, preview live, and unlock your document in minutes.',
      kh: 'ចូលរួមជាមួយបេក្ខជនរាប់ពាន់នាក់ដែលបានបង្កើនប្រសិទ្ធភាពក្នុងការស្វែងរកការងារជាមួយ CQ-Professional។ ជ្រើសរើសគំរូ មើលការបង្ហាញផ្ទាល់ និងទាញយកឯកសាររបស់អ្នកក្នុងរយៈពេលប៉ុន្មាននាទី។'
    },
    aboutCtaBtnChoose: { en: 'Choose a Template', kh: 'ជ្រើសរើសគំរូ CV' },
    aboutCtaBtnTelegram: { en: 'Chat on Telegram', kh: 'ជជែកតាម Telegram' },

    // Contact Page Translations
    contactEyebrow: { en: 'CONTACT CQ PROFESSIONAL', kh: 'ទំនាក់ទំនង CQ PROFESSIONAL' },
    contactHeroTitle1: { en: 'Let’s make your next', kh: 'រួមគ្នាធ្វើឱ្យ' },
    contactHeroTitleHighlight: { en: 'career move', kh: 'ការបោះជំហានក្នុងអាជីព' },
    contactHeroTitle2: { en: 'count.', kh: 'របស់អ្នកទទួលបានជោគជ័យ។' },
    contactHeroDesc: {
      en: 'Whether you need help with your CV, a template, or your account, our support team is ready to help you move forward with confidence.',
      kh: 'មិនថាអ្នកត្រូវការជំនួយជាមួយ CV, គំរូរចនា ឬគណនីរបស់អ្នកទេ ក្រុមការងាររបស់យើងត្រៀមខ្លួនរួចជាស្រេចដើម្បីជួយអ្នកបោះជំហានទៅមុខដោយទំនុកចិត្ត។'
    },
    contactTrustFriendly: { en: 'Friendly support', kh: 'សេវាកម្មរួសរាយរាក់ទាក់' },
    contactTrustDirect: { en: 'Direct response', kh: 'ឆ្លើយតបផ្ទាល់រហ័ស' },
    contactTrustReal: { en: 'Real people', kh: 'ក្រុមការងារពិតប្រាកដ' },

    contactFormEyebrow: { en: 'SEND A MESSAGE', kh: 'ផ្ញើសារមកកាន់យើង' },
    contactFormTitle: { en: 'How can we help?', kh: 'តើយើងអាចជួយអ្វីបានខ្លះ?' },
    contactFormSubtitle: { en: 'Tell us what you need. We will reply as soon as we can.', kh: 'សូមប្រាប់ពីអ្វីដែលអ្នកត្រូវការ។ យើងនឹងឆ្លើយតបឱ្យបានឆាប់រហ័សបំផុត។' },
    contactFieldName: { en: 'Your name', kh: 'ឈ្មោះរបស់អ្នក' },
    contactPlaceholderName: { en: 'Your full name', kh: 'ឈ្មោះពេញរបស់អ្នក' },
    contactFieldEmail: { en: 'Email address', kh: 'អាសយដ្ឋានអ៊ីមែល' },
    contactPlaceholderEmail: { en: 'you@example.com', kh: 'you@example.com' },
    contactFieldSubject: { en: 'What can we help with?', kh: 'តើអ្នកត្រូវការជំនួយលើផ្នែកណា?' },
    contactTopicSelect: { en: 'Select a topic', kh: 'ជ្រើសរើសប្រធានបទ' },
    contactTopicCv: { en: 'Creating a CV', kh: 'ការបង្កើត CV' },
    contactTopicTemplates: { en: 'Templates', kh: 'គំរូ CV & Templates' },
    contactTopicAccount: { en: 'Account support', kh: 'ជំនួយផ្នែកគណនី' },
    contactTopicFeedback: { en: 'Feedback', kh: 'មតិកែលម្អ' },
    contactFieldMessage: { en: 'Your message', kh: 'សាររបស់អ្នក' },
    contactPlaceholderMessage: { en: 'Tell us how we can help...', kh: 'សូមសរសេរសារ ឬចម្ងល់របស់អ្នកនៅទីនេះ...' },
    contactMsgSuccess: { en: 'Thanks — your message has been sent.', kh: 'សូមអរគុណ — សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ។' },
    contactMsgError: { en: 'We could not send your message. Please try again, or contact us directly below.', kh: 'មិនអាចផ្ញើសារបានទេ។ សូមសាកល្បងម្តងទៀត ឬទាក់ទងមកយើងដោយផ្ទាល់ខាងក្រោម។' },
    contactBtnSending: { en: 'Sending message...', kh: 'កំពុងផ្ញើសារ...' },
    contactBtnSend: { en: 'Send message', kh: 'ផ្ញើសារ' },

    contactSideEyebrow: { en: 'REACH US DIRECTLY', kh: 'ទាក់ទងមកយើងដោយផ្ទាល់' },
    contactSideTitle: { en: 'Stay connected with CQ.', kh: 'រក្សាទំនាក់ទំនងជាមួយ CQ' },
    contactSideSubtitle: { en: 'Choose the contact method that feels easiest for you. We are here to make CV building feel simple.', kh: 'ជ្រើសរើសវិធីទាក់ទងដែលងាយស្រួលបំផុតសម្រាប់អ្នក។ យើងនៅទីនេះដើម្បីធ្វើឱ្យការបង្កើត CV កាន់តែងាយស្រួល។' },
    contactLabelEmail: { en: 'EMAIL', kh: 'អ៊ីមែល' },
    contactLabelPhone: { en: 'PHONE', kh: 'ទូរស័ព្ទ' },
    contactSocialTitle: { en: 'Follow CQ Professional', kh: 'តាមដាន CQ Professional' },
    contactFbDesc: { en: 'Updates and CV tips', kh: 'ព័ត៌មានថ្មីៗ និងគន្លឹះបង្កើត CV' },
    contactTiktokDesc: { en: 'Quick career content', kh: 'វីដេអូខ្លីៗអំពីការងារ និងអាជីព' },
    contactTelegramDesc: { en: 'Message our community', kh: 'ផ្ញើសារ ឬចូលរួមសហគមន៍' },
    contactSafeTitle: { en: 'Your message matters.', kh: 'សាររបស់អ្នកមានតម្លៃជានិច្ច។' },
    contactSafeDesc: { en: 'Messages from this form go directly to our support inbox.', kh: 'សារទាំងអស់ពីទម្រង់នេះនឹងផ្ញើផ្ទាល់ទៅកាន់ប្រអប់សារជំនួយរបស់យើង។' },

    // Help Center Page Translations
    helpBadge: { en: '24/7 Customer Support & Help Center', kh: 'មជ្ឈមណ្ឌលជំនួយ & សេវាបម្រើអតិថិជន ២៤/៧' },
    helpHeroTitlePrefix: { en: 'How can we', kh: 'តើយើងអាច' },
    helpHeroTitleAccent: { en: 'help you', kh: 'ជួយអ្វីដល់អ្នក' },
    helpHeroTitleSuffix: { en: 'today?', kh: 'នៅថ្ងៃនេះ?' },
    helpHeroDesc: {
      en: 'Need help with your CV template, payment verification, watermark removal, or custom design? Reach our dedicated support team directly on Telegram or TikTok for instant assistance.',
      kh: 'ត្រូវការជំនួយលើគំរូ CV, ផ្ទៀងផ្ទាត់ការបង់ប្រាក់, ដក Watermark ចេញ ឬការរចនាផ្ទាល់ខ្លួន? អាចទាក់ទងមកកាន់ក្រុមការងារយើងផ្ទាល់តាម Telegram ឬ TikTok ដើម្បីទទួលបានការជួយភ្លាមៗ។'
    },
    helpTrustResponse: { en: 'Average response: < 3 mins', kh: 'ឆ្លើយតបជាមធ្យម: < ៣ នាទី' },
    helpTrustBakong: { en: 'Official Bakong Verified', kh: 'ផ្ទៀងផ្ទាត់ដោយប្រព័ន្ធបាគងផ្លូវការ' },
    helpTrustHuman: { en: 'Dedicated Human Support', kh: 'ក្រុមការងារពិតប្រាកដរង់ចាំជួយ' },

    // Telegram Card
    helpTgBadge: { en: '⚡ Official Support', kh: '⚡ សេវាជំនួយផ្លូវការ' },
    helpTgEyebrow: { en: 'Telegram Official Support', kh: 'ជំនួយផ្លូវការតាម Telegram' },
    helpTgTitle: { en: 'Chat on Telegram', kh: 'ជជែកផ្ទាល់តាម Telegram' },
    helpTgDesc1: { en: 'Connect directly with', kh: 'ទាក់ទងផ្ទាល់ជាមួយ' },
    helpTgDesc2: {
      en: 'on Telegram for real-time payment unlock, custom CV design assistance, or scan the official QR code below.',
      kh: 'តាម Telegram ដើម្បីដោះសោការបង់ប្រាក់ភ្លាមៗ ជួយរចនា CV ឬស្កេន QR Code ផ្លូវការខាងក្រោម។'
    },
    helpTgOfficialQr: { en: 'Official QR', kh: 'QR កូដផ្លូវការ' },
    helpTgActiveNow: { en: '● Active Now', kh: '● កំពុងដំណើរការ' },
    helpTgScanHint: {
      en: 'Scan with Telegram or your phone camera to chat directly.',
      kh: 'ស្កេនជាមួយ Telegram ឬកាមេរ៉ាទូរស័ព្ទដើម្បីជជែកផ្ទាល់។'
    },
    helpTgZoomQr: { en: 'Zoom full QR code', kh: 'ពង្រីកមើល QR Code ពេញ' },
    helpTgChannel: { en: 'Channel', kh: 'ឆានែល' },
    helpTgTicketBot: { en: 'Ticket Bot', kh: 'Bot ជំនួយ' },
    helpTgBtnMessage: { en: 'Message @phornsokkhim on Telegram', kh: 'ផ្ញើសារទៅ @phornsokkhim លើ Telegram' },
    helpTgBtnChannel: { en: 'Official Channel', kh: 'ឆានែលផ្លូវការ' },
    helpTgBtnBot: { en: 'Problem Report Bot', kh: 'Bot រាយការណ៍បញ្ហា' },

    // TikTok Card
    helpTiktokBadge: { en: '🎬 Tutorials & DM', kh: '🎬 វីដេអូបង្រៀន & សារ DM' },
    helpTiktokEyebrow: { en: 'TikTok Community & Support', kh: 'សហគមន៍ និងជំនួយលើ TikTok' },
    helpTiktokTitle: { en: 'Follow & DM on TikTok', kh: 'តាមដាន និងផ្ញើសារតាម TikTok' },
    helpTiktokDesc: {
      en: 'Watch helpful video guides on styling your CV, choosing the right template, career interview tips, and message our team directly on TikTok.',
      kh: 'ទស្សនាវីដេអូណែនាំពីរបៀបរៀបចំ CV, ការជ្រើសរើសគំរូស័ក្តិសម, គន្លឹះសម្ភាសន៍ការងារ និងផ្ញើសារផ្ទាល់ទៅកាន់ក្រុមការងារតាម TikTok។'
    },
    helpTiktokAccount: { en: 'Account', kh: 'គណនី' },
    helpTiktokDaily: { en: 'Daily Content', kh: 'មាតិកាប្រចាំថ្ងៃ' },
    helpTiktokBtn: { en: 'Open TikTok (@cqprofessional1111)', kh: 'ចូលមើល TikTok (@cqprofessional1111)' },
    helpTiktokHint: { en: 'Drop a comment or direct message anytime!', kh: 'អាចបញ្ចេញមតិ ឬផ្ញើសារផ្ទាល់បានគ្រប់ពេល!' },

    // Secondary Hotlines
    helpHotlinePhone: { en: 'Direct Phone Call', kh: 'ទូរស័ព្ទផ្ទាល់' },
    helpHotlinePhoneHours: { en: 'Monday – Sunday • 8:00 AM – 10:00 PM', kh: 'ចន្ទ ដល់ អាទិត្យ • ៨:០០ ព្រឹក – ១០:០០ យប់' },
    helpHotlineCallNow: { en: 'Call Now', kh: 'ខលឥឡូវនេះ' },
    helpHotlineEmail: { en: 'Official Email', kh: 'អ៊ីមែលផ្លូវការ' },
    helpHotlineEmailDesc: { en: 'For business inquiries, receipts & invoices', kh: 'សម្រាប់កិច្ចការងារទូទៅ បង្កាន់ដៃ និងវិក្កយបត្រ' },
    helpHotlineSendEmail: { en: 'Send Email', kh: 'ផ្ញើអ៊ីមែល' },
    helpHotlineBilling: { en: 'Payment History', kh: 'ប្រវត្តិបង់ប្រាក់' },
    helpHotlineBillingTitle: { en: 'View Receipts & Status', kh: 'មើលបង្កាន់ដៃ & ស្ថានភាព' },
    helpHotlineBillingDesc: { en: 'Check all past purchases and export invoices', kh: 'ពិនិត្យការទិញពីមុន និងទាញយកវិក្កយបត្រ' },
    helpHotlineGoPayments: { en: 'Go to Payments', kh: 'ទៅកាន់ទំព័របង់ប្រាក់' },

    // FAQ Section
    helpFaqEyebrow: { en: 'Common Questions', kh: 'សំណួរដែលសួរញឹកញាប់' },
    helpFaqTitle: { en: 'Frequently Asked Questions', kh: 'សំណួរ និងចម្លើយទូទៅ' },
    helpFaqSubtitle: {
      en: 'Quick answers to the most common questions regarding payments, exports, and template editing.',
      kh: 'ចម្លើយរហ័សចំពោះសំណួរទូទៅទាក់ទងនឹងការបង់ប្រាក់ ការទាញយកឯកសារ និងការកែសម្រួលគំរូ CV។'
    },

    // Interactive Support Tabs
    helpSupportEyebrow: { en: 'Real-Time Support & Ticket Dispatch', kh: 'សេវាជំនួយភ្លាមៗ & ផ្ញើសំបុត្រស្នើសុំ' },
    helpSupportTitle: { en: 'Chat with Bot or Leave a Message', kh: 'ជជែកជាមួយ Bot ឬទុកសារនៅទីនេះ' },
    helpTabChatbot: { en: 'Live Support Chatbot', kh: 'ជំនួយការឆ្លាតវៃ Bot' },
    helpTabLeaveMsg: { en: 'Leave a Message', kh: 'ទុកសារមកកាន់យើង' },
    helpBotBadge: { en: 'CQ Support Bot', kh: 'CQ Support Bot' },
    helpBotOnline: { en: 'ONLINE 24/7', kh: 'ដំណើរការ ២៤/៧' },
    helpBotConnected: { en: 'Connected to Telegram Bot:', kh: 'ភ្ជាប់ផ្ទាល់ជាមួយ Telegram Bot:' },
    helpBotOpenTg: { en: 'Open in Telegram', kh: 'បើកក្នុង Telegram' },
    helpChatSending: { en: 'Forwarding to Telegram bot...', kh: 'កំពុងបញ្ជូនទៅ Telegram Bot...' },
    helpQuickInquiries: { en: 'Quick Inquiries:', kh: 'សំណួររហ័ស:' },
    helpChatPlaceholder: { en: 'Type your question or issue description here...', kh: 'សរសេរសំណួរ ឬបញ្ហារបស់អ្នកនៅទីនេះ...' },
    helpChatBtnSend: { en: 'Send to Bot', kh: 'ផ្ញើទៅកាន់ Bot' },

    // Leave a Message Tab
    helpTicketTitle: { en: "Can't find what you need? Leave a Message.", kh: 'រកមិនឃើញអ្វីដែលអ្នកត្រូវការមែនទេ? ទុកសារនៅទីនេះ។' },
    helpTicketSubtitle1: {
      en: 'Fill in your information below. When you click Submit, your message is delivered directly in real-time to our Telegram Problem Report Bot',
      kh: 'សូមបំពេញព័ត៌មានខាងក្រោម។ នៅពេលចុចផ្ញើ សាររបស់អ្នកនឹងត្រូវបញ្ជូនភ្លាមៗទៅកាន់ Telegram Bot រាយការណ៍បញ្ហា'
    },
    helpTicketSubtitle2: {
      en: '(@cqticketproblemreport_bot).',
      kh: '(@cqticketproblemreport_bot)។'
    },
    helpFieldName: { en: 'Your Full Name', kh: 'ឈ្មោះពេញរបស់អ្នក' },
    helpPlaceholderName: { en: 'e.g. Sokkhim Phorn', kh: 'ឧ. ផន សុឃីម' },
    helpNameError: { en: 'Please enter your name.', kh: 'សូមបញ្ចូលឈ្មោះរបស់អ្នក។' },
    helpFieldEmail: { en: 'Email Address', kh: 'អាសយដ្ឋានអ៊ីមែល' },
    helpPlaceholderEmail: { en: 'e.g. you@example.com', kh: 'ឧ. you@example.com' },
    helpEmailError: { en: 'Please enter a valid email address.', kh: 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលដែលត្រឹមត្រូវ។' },
    helpFieldCategory: { en: 'Category / Issue Type', kh: 'ប្រភេទបញ្ហា / ប្រធានបទ' },
    helpCategoryKhqr: { en: 'Payment / KHQR Verification Issue', kh: 'បញ្ហាការទូទាត់ / ផ្ទៀងផ្ទាត់ KHQR' },
    helpCategoryWatermark: { en: 'Watermark Removal Assistance', kh: 'ជំនួយដក Watermark ចេញពីឯកសារ' },
    helpCategoryExport: { en: 'Template Export (PDF / Word / PPTX)', kh: 'ការទាញយកគំរូ (PDF / Word / PPTX)' },
    helpCategoryPhoto: { en: 'Professional Photo Retouching ($5)', kh: 'សេវាកាត់តកែរូបថតអាជីព ($5)' },
    helpCategoryOther: { en: 'Other Inquiries', kh: 'ចម្ងល់ផ្សេងៗ' },
    helpFieldOrderId: { en: 'Order ID / Payment Ref (Optional)', kh: 'លេខកូដកម្ម៉ង់ / លេខយោងបង់ប្រាក់ (មិនតម្រូវ)' },
    helpPlaceholderOrderId: { en: 'e.g. 1045 or Bakong MD5 hash', kh: 'ឧ. 1045 ឬលេខកូដ Bakong MD5' },
    helpFieldMessage: { en: 'Your Message or Issue Details', kh: 'សារ ឬព័ត៌មានលម្អិតពីបញ្ហា' },
    helpPlaceholderMessage: {
      en: 'Describe your issue or question in detail so our team can assist you right away...',
      kh: 'សូមរៀបរាប់ពីបញ្ហា ឬចម្ងល់របស់អ្នកឱ្យបានក្បោះក្បាយ ដើម្បីឱ្យក្រុមការងារអាចជួយបានរហ័ស...'
    },
    helpMessageError: { en: 'Please enter your message.', kh: 'សូមបញ្ចូលសាររបស់អ្នក។' },
    helpSuccessTitle: { en: 'Message Dispatched to Telegram Bot!', kh: 'សារត្រូវបានបញ្ជូនទៅ Telegram Bot ដោយជោគជ័យ!' },
    helpSuccessDesc1: { en: 'Your ticket has been delivered straight to', kh: 'សំណើរបស់អ្នកបានបញ្ជូនទៅកាន់' },
    helpSuccessDesc2: { en: 'Admin has received the alert.', kh: 'រួចរាល់។ អ្នកគ្រប់គ្រងបានទទួលការជូនដំណឹងនេះហើយ។' },
    helpSuccessBtnBot: { en: 'Open in Telegram Bot', kh: 'បើកក្នុង Telegram Bot' },
    helpSuccessBtnAnother: { en: 'Send Another Message', kh: 'ផ្ញើសារថ្មីមួយទៀត' },
    helpErrorNotice: { en: 'Network notice: Unable to submit right now.', kh: 'បញ្ហាបណ្តាញ: មិនអាចផ្ញើសារបានទេនៅពេលនេះ។' },
    helpErrorDirect: { en: 'You can message us directly on Telegram anytime:', kh: 'អ្នកអាចផ្ញើសារមកកាន់យើងដោយផ្ទាល់តាម Telegram បានគ្រប់ពេល:' },
    helpErrorOrOpen: { en: 'or open', kh: 'ឬបើក' },
    helpBtnSubmitting: { en: 'Sending to Telegram Bot...', kh: 'កំពុងបញ្ជូនទៅ Telegram Bot...' },
    helpBtnSubmit: { en: 'Submit Help Request', kh: 'ផ្ញើសំណើសុំជំនួយ' },
    helpBtnChatBot: { en: 'Chat on Telegram Bot', kh: 'ជជែកលើ Telegram Bot' },

    // QR Modal & Footer
    helpModalTitle: { en: 'Official Telegram QR Code', kh: 'QR Code ផ្លូវការលើ Telegram' },
    helpModalScanHint: {
      en: 'Scan with Telegram or your phone camera to start a direct chat with Phorn Sokhim.',
      kh: 'ស្កេនជាមួយ Telegram ឬកាមេរ៉ាទូរស័ព្ទដើម្បីចាប់ផ្តើមជជែកផ្ទាល់ជាមួយ Phorn Sokhim។'
    },
    helpModalOpenBtn: { en: 'Open in Telegram (@phornsokkhim)', kh: 'បើកក្នុង Telegram (@phornsokkhim)' },
    helpModalChannelBtn: { en: 'Join Official Channel (@cvresumeonline)', kh: 'ចូលរួមឆានែលផ្លូវការ (@cvresumeonline)' },
    helpFooterText: {
      en: 'CQ-Professional Resume & Cover Letter Suite • All inquiries are handled by our dedicated team in Phnom Penh.',
      kh: 'CQ-Professional Resume & Cover Letter Suite • រាល់ចម្ងល់ទាំងអស់ត្រូវបានដោះស្រាយដោយក្រុមការងារផ្ទាល់នៅរាជធានីភ្នំពេញ។'
    },

    // Payments & Receipts Page Translations
    payBadge: { en: 'CQ-Professional Billing', kh: 'ការទូទាត់ CQ-Professional' },
    payTitle: { en: 'Payments & Receipts', kh: 'ការទូទាត់ និងបង្កាន់ដៃ' },
    paySubtitle: {
      en: 'Access and download official payment receipts, review transaction history with National Bank of Cambodia Bakong KHQR, and export records as PDF, Excel, or PowerPoint.',
      kh: 'ចូលមើល និងទាញយកបង្កាន់ដៃទូទាត់ផ្លូវការ ពិនិត្យប្រវត្តិប្រតិបត្តិការតាមបាគង KHQR នៃធនាគារជាតិនៃកម្ពុជា និងទាញយកទិន្នន័យជា PDF, Excel ឬ PowerPoint។'
    },
    payBtnExportHistory: { en: 'Export History (Excel)', kh: 'ទាញយកប្រវត្តិ (Excel)' },
    payBtnExplore: { en: 'Explore Templates', kh: 'មើលគំរូ CV បន្ថែម' },

    // Stats
    payStatTotalSpent: { en: 'Total Spent', kh: 'ចំណាយសរុប' },
    payStatOrders: { en: 'Orders Placed', kh: 'ចំនួនបញ្ជាទិញ' },
    payStatVerifiedPaid: { en: 'Verified Paid', kh: 'បានទូទាត់ជោគជ័យ' },
    payStatUnlocked: { en: 'Unlocked Templates', kh: 'គំរូដែលបានដោះសោ' },
    payStatWatermarkRemoved: { en: 'Watermark permanently removed', kh: 'ដក Watermark ចេញជាស្ថាពរ' },
    payStatGateway: { en: 'Payment Gateway', kh: 'ច្រកទូទាត់ប្រាក់' },

    // Search & Filter
    paySearchPlaceholder: { en: 'Search by Order #, template name...', kh: 'ស្វែងរកតាមលេខបង្កាន់ដៃ, ឈ្មោះគំរូ...' },
    payTabAll: { en: 'All', kh: 'ទាំងអស់' },
    payTabPaid: { en: 'Paid', kh: 'បានទូទាត់' },
    payTabPending: { en: 'Pending', kh: 'រង់ចាំទូទាត់' },

    // States
    payLoading: { en: 'Loading payment history...', kh: 'កំពុងទាញយកប្រវត្តិការទូទាត់...' },
    payEmptyTitle: { en: 'No payment records found', kh: 'មិនមានកំណត់ត្រាទូទាត់ប្រាក់ឡើយ' },
    payEmptySearchPrefix: { en: 'No transactions matched your search query', kh: 'មិនមានប្រតិបត្តិការណាដែលត្រូវនឹងការស្វែងរករបស់អ្នកឡើយ' },
    payEmptyDesc: {
      en: "You haven't completed any template payments yet. Browse our premium CV templates to get started!",
      kh: 'អ្នកមិនទាន់បានធ្វើការទូទាត់ទិញគំរូ CV ណាមួយនៅឡើយទេ។ សូមចូលមើលគំរូ CV អាជីពរបស់យើងដើម្បីចាប់ផ្តើម!'
    },
    payBtnBrowse: { en: 'Browse Templates', kh: 'មើលគំរូ CV ទាំងអស់' },

    // Table Headers
    payThReceipt: { en: 'Receipt #', kh: 'លេខបង្កាន់ដៃ' },
    payThItem: { en: 'Template / Item', kh: 'គំរូ / សេវាកម្ម' },
    payThDate: { en: 'Date & Time', kh: 'កាលបរិច្ឆេទ & ម៉ោង' },
    payThAmount: { en: 'Amount', kh: 'ចំនួនទឹកប្រាក់' },
    payThMethod: { en: 'Method', kh: 'វិធីសាស្ត្រ' },
    payThStatus: { en: 'Status', kh: 'ស្ថានភាព' },
    payThActions: { en: 'Actions', kh: 'សកម្មភាព' },

    // Statuses & Actions
    payStatusPaid: { en: 'Paid', kh: 'បានទូទាត់' },
    payStatusPending: { en: 'Pending', kh: 'រង់ចាំទូទាត់' },
    payDirectLicense: { en: 'Direct License', kh: 'អាជ្ញាប័ណ្ណផ្ទាល់' },
    payTipView: { en: 'View Official Receipt', kh: 'មើលបង្កាន់ដៃផ្លូវការ' },
    payTipPdf: { en: 'Print / Save as PDF', kh: 'បោះពុម្ព / រក្សាទុកជា PDF' },
    payTipExcel: { en: 'Export Excel (.csv)', kh: 'ទាញយក Excel (.csv)' },
    payTipPptx: { en: 'Export PowerPoint (.pptx)', kh: 'ទាញយក PowerPoint (.pptx)' },

    // Footer
    payFooterTitle: {
      en: 'CQ-Professional Document & Payment Management • National Bank of Cambodia Bakong KHQR Certified',
      kh: 'CQ-Professional ប្រព័ន្ធគ្រប់គ្រងឯកសារ និងការទូទាត់ • ទទួលស្គាល់ដោយប្រព័ន្ធបាគង KHQR នៃធនាគារជាតិនៃកម្ពុជា'
    },
    payFooterDesc1: {
      en: 'Official tax and payment invoices are stored permanently for your convenience. Need billing assistance? Contact our team on Telegram:',
      kh: 'វិក្កយបត្រ និងបង្កាន់ដៃទូទាត់ផ្លូវការត្រូវបានរក្សាទុកជាអចិន្ត្រៃយ៍សម្រាប់លោកអ្នក។ ត្រូវការជំនួយផ្នែកគណនេយ្យ? ទាក់ទងក្រុមការងារយើងតាម Telegram:'
    },

    // Receipt Modal
    payModalPreviewTitle: { en: 'Electronic Receipt Preview', kh: 'ទិដ្ឋភាពបង្កាន់ដៃអេឡិចត្រូនិក' },
    payModalPaidBadge: { en: 'Official Paid Receipt', kh: 'បង្កាន់ដៃទូទាត់ផ្លូវការ' },
    payModalBilledTo: { en: 'Billed To (Customer)', kh: 'ចេញជូនអតិថិជន' },
    payModalCustomerId: { en: 'Customer ID:', kh: 'លេខសម្គាល់អតិថិជន:' },
    payModalValuedCustomer: { en: 'Valued Customer', kh: 'អតិថិជនកិត្តិយស' },
    payModalMerchantInfo: { en: 'Payment & Merchant Info', kh: 'ព័ត៌មានអាជីវករ & ការទូទាត់' },
    payModalGateway: { en: 'NBC Bakong KHQR Gateway', kh: 'ច្រកទូទាត់ NBC បាគង KHQR' },
    payModalDateIssued: { en: 'Date Issued', kh: 'កាលបរិច្ឆេទចេញ' },
    payModalPaymentType: { en: 'Payment Type', kh: 'ប្រភេទការទូទាត់' },
    payModalCurrency: { en: 'Currency', kh: 'រូបិយប័ណ្ណ' },
    payModalStatus: { en: 'Transaction Status', kh: 'ស្ថានភាពប្រតិបត្តិការ' },
    payModalStatusConfirmed: { en: 'Confirmed (Paid)', kh: 'បានបញ្ជាក់ (ទូទាត់រួច)' },
    payModalOrderItems: { en: 'Order Items', kh: 'បញ្ជីទំនិញ / សេវាកម្ម' },
    payModalThItem: { en: 'Item & Description', kh: 'មុខទំនិញ & ការពិពណ៌នា' },
    payModalThQty: { en: 'Qty', kh: 'ចំនួន' },
    payModalThPrice: { en: 'Price (USD)', kh: 'តម្លៃ (USD)' },
    payModalThTotal: { en: 'Total', kh: 'សរុប' },
    payModalItemDesc: {
      en: 'Lifetime license • Full watermark removal • Unlimited downloads',
      kh: 'អាជ្ញាប័ណ្ណពេញមួយជីវិត • ដក Watermark ចេញទាំងស្រុង • ទាញយកគ្មានដែនកំណត់'
    },
    payModalMultiExport: { en: 'Multi-Format Vector Export (PDF, DOCX, PPTX)', kh: 'ការទាញយកជាច្រើនទម្រង់ (PDF, DOCX, PPTX)' },
    payModalExportDesc: { en: 'Print-ready 300 DPI high-definition formatting', kh: 'ទម្រង់កម្រិតច្បាស់ខ្ពស់ 300 DPI សម្រាប់បោះពុម្ព' },
    payModalIncluded: { en: 'Included', kh: 'រួមបញ្ចូល' },
    payModalBakongRef: { en: 'Bakong Reference Hash:', kh: 'លេខកូដយោងបាគង (MD5 Hash):' },
    payModalSubtotal: { en: 'Subtotal:', kh: 'សរុបរង:' },
    payModalTax: { en: 'Tax & Fees (0%):', kh: 'ពន្ធ & សេវា (0%):' },
    payModalTotalPaid: { en: 'Total Paid:', kh: 'សរុបប្រាក់ដែលបានបង់:' },
    payModalVerifiedNbc: { en: 'Digitally verified via National Bank of Cambodia Bakong Open API', kh: 'ផ្ទៀងផ្ទាត់ឌីជីថលតាមរយៈ Bakong Open API នៃធនាគារជាតិនៃកម្ពុជា' },
    payModalAllRights: { en: 'CQ-Professional Resume & Cover Letter Suite • All rights reserved.', kh: 'CQ-Professional Resume & Cover Letter Suite • រក្សាសិទ្ធិគ្រប់យ៉ាង។' },
    payModalInquiries: { en: 'For inquiries or official confirmation, contact telegram: @cvresumeonline', kh: 'សម្រាប់ចម្ងល់ ឬការបញ្ជាក់ផ្លូវការ សូមទាក់ទងតាម Telegram: @cvresumeonline' },
    payModalExportPreferred: { en: 'Export receipt in your preferred format:', kh: 'ទាញយកបង្កាន់ដៃជាទម្រង់ដែលអ្នកពេញចិត្ត:' },
    payModalBtnPrint: { en: 'Print / PDF', kh: 'បោះពុម្ព / PDF' },
    payModalBtnExcel: { en: 'Excel (.csv)', kh: 'Excel (.csv)' },
    payModalBtnPptx: { en: 'PowerPoint (.pptx)', kh: 'PowerPoint (.pptx)' },
    payModalBtnClose: { en: 'Close', kh: 'បិទ' },

    // Toast alerts
    payToastExcelSuccess: { en: 'Receipt exported to Excel (.csv).', kh: 'បានទាញយកបង្កាន់ដៃជា Excel (.csv) ដោយជោគជ័យ។' },
    payToastAllExcelSuccess: { en: 'All transactions exported to Excel.', kh: 'បានទាញយកប្រវត្តិប្រតិបត្តិការទាំងអស់ជា Excel ដោយជោគជ័យ។' },
    payToastPptxSuccess: { en: 'Receipt exported to PowerPoint (.pptx).', kh: 'បានទាញយកបង្កាន់ដៃជា PowerPoint (.pptx) ដោយជោគជ័យ។' },
    payToastPptxError: { en: 'Failed to generate PowerPoint receipt.', kh: 'មិនអាចបង្កើតបង្កាន់ដៃជា PowerPoint បានទេ។' },
    payToastPdfSuccess: { en: 'Generated PDF print preview.', kh: 'បានបើកផ្ទាំងទិដ្ឋភាពបោះពុម្ព PDF។' },
    payToastPdfBlocked: { en: 'Pop-up blocked. Please allow pop-ups to print receipt.', kh: 'ផ្ទាំង Pop-up ត្រូវបានរារាំង។ សូមអនុញ្ញាត Pop-up ដើម្បីបោះពុម្ពបង្កាន់ដៃ។' },

    // KHQR Payment Popup Modal
    khqrTitle: { en: 'Bakong Payment', kh: 'ការទូទាត់បាគង' },
    khqrPaymentComplete: { en: 'Payment Complete 🎉', kh: 'ការទូទាត់ជោគជ័យ 🎉' },
    khqrChooseFormat: { en: 'Choose your download format below', kh: 'សូមជ្រើសរើសទម្រង់ឯកសារដើម្បីទាញយក' },
    khqrScanToUnlock: { en: 'Scan to unlock full CV without watermark', kh: 'ស្កេនដើម្បីដោះសោ CV គ្មាន Watermark' },
    khqrExpiresIn: { en: 'Expires in', kh: 'ផុតកំណត់ក្នុងរយៈពេល' },
    khqrAccountName: { en: 'Account Name', kh: 'ឈ្មោះគណនី' },
    khqrCopyId: { en: '📋 Copy ID', kh: '📋 ចម្លង ID' },
    khqrSaveImage: { en: 'Save QR Image', kh: 'រក្សាទុក QR' },
    khqrCopyAccount: { en: 'Copy Account', kh: 'ចម្លងគណនី' },
    khqrScanInstruction: {
      en: 'Open Bakong App, ABA, ACLEDA, or Wing. Scan with camera or import from photos.',
      kh: 'បើកកម្មវិធី Bakong, ABA, ACLEDA ឬ Wing ដើម្បីស្កេន ឬទាញរូបភាពពីអាល់ប៊ុម។'
    },
    khqrWaiting: { en: 'Waiting for payment in real-time...', kh: 'កំពុងរង់ចាំការទូទាត់ភ្លាមៗ...' },
    khqrCancel: { en: 'Cancel', kh: 'បោះបង់' },
    khqrExpiredTitle: { en: 'KHQR Expired', kh: 'KHQR បានផុតកំណត់' },
    khqrExpiredDesc: {
      en: 'This payment session timed out after 5 minutes. No worries, you can generate a fresh QR code right now.',
      kh: 'ការទូទាត់នេះបានផុតកំណត់ក្រោយ ៥ នាទី។ លោកអ្នកអាចបង្កើតកូដ QR ថ្មីបានភ្លាមៗ។'
    },
    khqrRefreshQr: { en: '🔄 Refresh QR Code', kh: '🔄 បង្កើតកូដ QR ថ្មី' },
    khqrPaymentReceived: { en: 'Payment Received!', kh: 'ទទួលបានការទូទាត់ជោគជ័យ!' },
    khqrPermanentUnlocked: {
      en: 'Your template is permanently unlocked with no watermark.',
      kh: 'គំរូ CV របស់អ្នកត្រូវបានដោះសោជាស្ថាពរដោយគ្មាន Watermark។'
    },
    khqrOrderRef: { en: 'Order Reference:', kh: 'លេខយោងការបញ្ជាទិញ:' },
    khqrAmountPaid: { en: 'Amount Paid:', kh: 'ចំនួនទឹកប្រាក់ដែលបានបង់:' },
    khqrPaymentMethod: { en: 'Payment Method:', kh: 'វិធីសាស្ត្រទូទាត់:' },
    khqrStatus: { en: 'Status:', kh: 'ស្ថានភាព:' },
    khqrConfirmed: { en: 'Confirmed', kh: 'បានបញ្ជាក់' },
    khqrDownloadReceipt: { en: 'Download Official Receipt (PDF)', kh: 'ទាញយកបង្កាន់ដៃផ្លូវការ (PDF)' },
    khqrDownloadCvFormat: { en: 'Download CV Format', kh: 'ទាញយកទម្រង់ CV' },
    khqrHighQuality: { en: 'High Quality', kh: 'គុណភាពខ្ពស់' },
    khqrClose: { en: 'Close', kh: 'បិទ' },
    khqrToastPaid: { en: '🎉 Payment Received! Your CV template has been unlocked.', kh: '🎉 ទទួលបានការទូទាត់ជោគជ័យ! គំរូ CV របស់អ្នកត្រូវបានដោះសោរួចរាល់។' },
    khqrToastSaved: { en: 'QR Code saved! You can scan or import it directly in your banking app.', kh: 'បានរក្សាទុក QR Code! អ្នកអាចស្កេន ឬទាញចូលកម្មវិធីធនាគាររបស់អ្នកបាន។' },
    khqrToastCopied: { en: 'Copied Bakong ID: ', kh: 'បានចម្លងលេខសម្គាល់បាគង៖ ' },
    khqrBtnAlreadyPaid: { en: 'I Have Paid • Check Status', kh: 'ខ្ញុំបានបង់ប្រាក់រួចរាល់ • ពិនិត្យស្ថានភាព' },
    khqrCheckingStatus: { en: 'Verifying payment with Bakong...', kh: 'កំពុងផ្ទៀងផ្ទាត់ការបង់ប្រាក់ជាមួយបាគង...' },
    khqrExpiredCheckPaid: { en: 'Already paid? Verify Status', kh: 'បានបង់ប្រាក់រួចហើយ? ពិនិត្យស្ថានភាព' },
    payBtnRecheckAll: { en: 'Recheck Pending Payments', kh: 'ផ្ទៀងផ្ទាត់ការទូទាត់ឡើងវិញ' },
    payTipVerify: { en: 'Verify & Check Payment Status', kh: 'ពិនិត្យ និងផ្ទៀងផ្ទាត់ស្ថានភាពទូទាត់' },
    payToastVerifySuccess: {
      en: '🎉 Payment verified! Order has been marked Paid and CV watermark removed.',
      kh: '🎉 ការទូទាត់ត្រូវបានផ្ទៀងផ្ទាត់ជោគជ័យ! ការបញ្ជាទិញបានទូទាត់រួចរាល់ និងបានដក Watermark។'
    },
    payToastVerifyNone: { en: 'All orders are already up to date.', kh: 'រាល់ប្រតិបត្តិការទាំងអស់ត្រូវបានធ្វើបច្ចុប្បន្នភាពរួចរាល់។' },

    // Settings Page (/settings, /setting)
    settingsKicker: { en: 'ACCOUNT CENTRE', kh: 'មជ្ឈមណ្ឌលគណនី' },
    settingsTitle: { en: 'Settings', kh: 'ការកំណត់' },
    settingsSubtitle: {
      en: 'Manage your profile, preferences, and account security.',
      kh: 'គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន ការកំណត់ទូទៅ និងសុវត្ថិភាពគណនីរបស់អ្នក។'
    },
    settingsProfileFallback: { en: 'Your profile', kh: 'គណនីរបស់អ្នក' },
    settingsTabProfile: { en: 'Profile', kh: 'ព័ត៌មានផ្ទាល់ខ្លួន' },
    settingsTabSecurity: { en: 'Security', kh: 'សុវត្ថិភាព' },
    settingsTabAppearance: { en: 'Appearance', kh: 'ទម្រង់ផ្ទៃ' },
    settingsTabActivity: { en: 'Activity', kh: 'ប្រវត្តិសកម្មភាព' },
    settingsSafeTitle: { en: 'Your account is secure', kh: 'គណនីមានសុវត្ថិភាពខ្ពស់' },
    settingsSafeDesc: { en: 'Keep your details up to date.', kh: 'សូមរក្សាព័ត៌មានរបស់អ្នកឱ្យទាន់សម័យ។' },

    // Profile Panel
    settingsProfileKicker: { en: 'PERSONAL DETAILS', kh: 'ព័ត៌មានលម្អិតផ្ទាល់ខ្លួន' },
    settingsProfileHead: { en: 'Profile information', kh: 'ព័ត៌មានគណនី' },
    settingsProfileDesc: {
      en: 'This is how your account appears in CQ-Professional.',
      kh: 'ព័ត៌មាននេះបង្ហាញនៅលើគណនី CQ-Professional របស់អ្នក។'
    },
    settingsChangeCover: { en: 'Change cover', kh: 'ប្តូររូបគម្រប' },
    settingsFullNameLabel: { en: 'Full name', kh: 'ឈ្មោះពេញ' },
    settingsFullNamePlaceholder: { en: 'Your full name', kh: 'បញ្ចូលឈ្មោះពេញរបស់អ្នក' },
    settingsEmailLabel: { en: 'Email address', kh: 'អាសយដ្ឋានអ៊ីមែល' },
    settingsBtnSaveChanges: { en: 'Save changes', kh: 'រក្សាទុកការកែប្រែ' },
    settingsBtnSaving: { en: 'Saving...', kh: 'កំពុងរក្សាទុក...' },
    settingsProfileSuccess: { en: 'Profile updated successfully.', kh: 'បានកែប្រែព័ត៌មានផ្ទាល់ខ្លួនដោយជោគជ័យ។' },
    settingsProfileFailed: { en: 'Failed to save profile.', kh: 'មិនអាចរក្សាទុកព័ត៌មានផ្ទាល់ខ្លួនបានទេ។' },
    settingsProfileToastSuccess: { en: 'Profile saved!', kh: 'បានរក្សាទុកព័ត៌មានផ្ទាល់ខ្លួន!' },

    // Security Panel
    settingsSecurityKicker: { en: 'ACCOUNT SECURITY', kh: 'សុវត្ថិភាពគណនី' },
    settingsSecurityHead: { en: 'Change your password', kh: 'ប្តូរពាក្យសម្ងាត់' },
    settingsSecurityDesc: {
      en: 'Use a strong password you do not use elsewhere.',
      kh: 'សូមប្រើពាក្យសម្ងាត់ដែលមានសុវត្ថិភាព និងមិនធ្លាប់ប្រើនៅកន្លែងផ្សេង។'
    },
    settingsProtectionActive: { en: 'Password protection is active', kh: 'ការការពារពាក្យសម្ងាត់កំពុងដំណើរការ' },
    settingsProtectionDesc: {
      en: 'Update your password at any time to protect your account.',
      kh: 'អ្នកអាចផ្លាស់ប្តូរពាក្យសម្ងាត់បានគ្រប់ពេលដើម្បីការពារគណនី។'
    },
    settingsCurrentPwLabel: { en: 'Current password', kh: 'ពាក្យសម្ងាត់បច្ចុប្បន្ន' },
    settingsCurrentPwPlaceholder: { en: 'Enter current password', kh: 'បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន' },
    settingsNewPwLabel: { en: 'New password', kh: 'ពាក្យសម្ងាត់ថ្មី' },
    settingsNewPwPlaceholder: { en: 'At least 8 characters', kh: 'យ៉ាងហោចណាស់ ៨ តួអក្សរ' },
    settingsConfirmPwLabel: { en: 'Confirm new password', kh: 'ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី' },
    settingsConfirmPwPlaceholder: { en: 'Repeat your new password', kh: 'បញ្ចូលពាក្យសម្ងាត់ថ្មីម្តងទៀត' },
    settingsBtnUpdatePw: { en: 'Update password', kh: 'ផ្លាស់ប្តូរពាក្យសម្ងាត់' },
    settingsBtnUpdatingPw: { en: 'Updating...', kh: 'កំពុងផ្លាស់ប្តូរ...' },
    settingsPwMismatch: { en: 'New passwords do not match.', kh: 'ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាឡើយ។' },
    settingsPwMinLength: { en: 'New password must be at least 8 characters.', kh: 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៨ តួអក្សរ។' },
    settingsPwSuccess: { en: 'Password changed successfully.', kh: 'បានផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ!' },
    settingsPwFailed: { en: 'Failed to change password.', kh: 'មិនអាចផ្លាស់ប្តូរពាក្យសម្ងាត់បានទេ។' },

    // Appearance Panel
    settingsPrefKicker: { en: 'YOUR PREFERENCES', kh: 'ចំណូលចិត្តរបស់អ្នក' },
    settingsPrefHead: { en: 'Appearance', kh: 'ទម្រង់ផ្ទៃ' },
    settingsPrefDesc: {
      en: 'Choose how CQ-Professional looks on this device.',
      kh: 'ជ្រើសរើសរបៀបបង្ហាញផ្ទៃលើឧបករណ៍របស់អ្នក។'
    },
    settingsColorMode: { en: 'Color mode', kh: 'ពណ៌ផ្ទៃ' },
    settingsColorModeDesc: {
      en: 'Switch between a light and dark workspace.',
      kh: 'ផ្លាស់ប្តូររវាងផ្ទៃពន្លឺភ្លឺ (Light) និងផ្ទៃងងឹត (Dark)។'
    },
    settingsModeLight: { en: '☀ Light', kh: '☀ ពន្លឺភ្លឺ' },
    settingsModeDark: { en: '◐ Dark', kh: '◐ ងងឹត' },
    settingsLightEnabledToast: { en: 'Light mode enabled.', kh: 'បានបើកប្រើប្រាស់ទម្រង់ពន្លឺភ្លឺ (Light)។' },
    settingsDarkEnabledToast: { en: 'Dark mode enabled.', kh: 'បានបើកប្រើប្រាស់ទម្រង់ងងឹត (Dark)។' },
    settingsEditorExp: { en: 'CV editor experience', kh: 'បទពិសោធន៍កែសម្រួល CV' },
    settingsEditorExpDesc: {
      en: 'Your work is saved securely to your account.',
      kh: 'រាល់ទិន្នន័យត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិក្នងគណនីរបស់អ្នក។'
    },
    settingsEnabledBadge: { en: 'Enabled', kh: 'បើកដំណើរការ' },

    // Activity Panel
    settingsHistoryKicker: { en: 'ACCOUNT HISTORY', kh: 'ប្រវត្តិគណនី' },
    settingsHistoryHead: { en: 'Activity', kh: 'សកម្មភាព' },
    settingsHistoryDesc: {
      en: 'A quick view of your account milestones.',
      kh: 'ទិដ្ឋភាពទូទៅនៃកាលបរិច្ឆេទសំខាន់ៗនៃគណនីរបស់អ្នក។'
    },
    settingsAccountCreated: { en: 'Account created', kh: 'កាលបរិច្ឆេទបង្កើតគណនី' },
    settingsAccountCreatedFallback: {
      en: 'Your CQ-Professional account is active.',
      kh: 'គណនី CQ-Professional របស់អ្នកកំពុងដំណើរការ។'
    },
    settingsLastSignIn: { en: 'Last sign in', kh: 'ចូលប្រើប្រាស់ចុងក្រោយ' },
    settingsLastSignInFallback: {
      en: 'Your current session is active.',
      kh: 'វគ្គប្រើប្រាស់បច្ចុប្បន្នកំពុងដំណើរការ។'
    },
  };

  constructor() {
    // Apply language attribute to document
    this.updateHtmlLang(this.currentLang());
  }

  private getInitialLanguage(): Language {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as Language;
      if (saved === 'kh' || saved === 'en') return saved;
      // Default to English
      return 'en';
    } catch {
      return 'en';
    }
  }

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
    try {
      localStorage.setItem(this.STORAGE_KEY, lang);
    } catch {}
    this.updateHtmlLang(lang);
  }

  toggleLanguage() {
    const next = this.currentLang() === 'en' ? 'kh' : 'en';
    this.setLanguage(next);
  }

  private updateHtmlLang(lang: Language) {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang === 'kh' ? 'km' : 'en');
      if (lang === 'kh') {
        document.documentElement.classList.add('lang-khmer');
      } else {
        document.documentElement.classList.remove('lang-khmer');
      }
    }
  }

  /**
   * Translate a key with reactive signal support
   */
  t(key: string, fallback?: string): string {
    const lang = this.currentLang();
    const item = this.dictionary[key];
    if (!item) return fallback || key;
    return item[lang] || fallback || key;
  }

  // Quick computed helpers for navbar
  readonly isKhmer = computed(() => this.currentLang() === 'kh');
  readonly isEnglish = computed(() => this.currentLang() === 'en');
}
