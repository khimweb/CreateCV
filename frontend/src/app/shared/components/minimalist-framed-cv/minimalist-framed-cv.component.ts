import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface CvEducation {
  institution?: string;
  degree?: string;
  field?: string;
  startYear?: string;
  endYear?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
}

interface CvExperience {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  responsibilities?: string[];
  description?: string;
}

interface CvSkill {
  name?: string;
  level?: string;
}

interface CvLanguage {
  name?: string;
  proficiency?: string;
}

@Component({
  selector: 'app-minimalist-framed-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="mf-page"
      [style.--accent]="accent"
      [style.--fs.px]="fontSize"
      [style.--fw]="fontWeight"
      [style.--lh]="lineHeight"
      [style.--font]="fontFamily"
    >
      <!-- Header Row -->
      <header class="mf-header">
          <!-- Left: Name & Professional Title -->
          <div class="mf-title-col">
            <h1 class="mf-name">{{ resolvedName }}</h1>
            <p class="mf-role">{{ resolvedJobTitle }}</p>
          </div>

          <!-- Right: Contact Information with Icons -->
          <div class="mf-contact-col">
            @if (resolvedPhone) {
              <div class="mf-contact-item">
                <span class="mf-icon-box" aria-hidden="true">
                  <!-- Phone Handset Icon -->
                  <svg viewBox="0 0 24 24" fill="currentColor" class="mf-icon">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.43-3.9-6.63-6.82l1.97-1.57a1.002 1.002 0 0 0 .24-1.02A11.36 11.36 0 0 1 8.92 4c0-.55-.45-1-1-1H4.01c-.55 0-1 .45-1 1 0 9.39 7.63 17.02 17 17.02.55 0 1-.45 1-1v-3.64c0-.55-.45-1-1-1z"/>
                  </svg>
                </span>
                <span>{{ resolvedPhone }}</span>
              </div>
            }

            @if (resolvedEmail) {
              <div class="mf-contact-item">
                <span class="mf-icon-box" aria-hidden="true">
                  <!-- Envelope Icon -->
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mf-icon">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <span>{{ resolvedEmail }}</span>
              </div>
            }

            @if (resolvedLocation) {
              <div class="mf-contact-item">
                <span class="mf-icon-box" aria-hidden="true">
                  <!-- Location Pin Icon -->
                  <svg viewBox="0 0 24 24" fill="currentColor" class="mf-icon">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                </span>
                <span>{{ resolvedLocation }}</span>
              </div>
            }
          </div>
        </header>

        <!-- Full-Width Divider Line Below Header -->
        <hr class="mf-divider" />

        <!-- SUMMARY Section -->
        <section class="mf-summary-section">
          <h2 class="mf-section-title">SUMMARY</h2>
          <p class="mf-summary-text">{{ resolvedSummary }}</p>
        </section>

        <!-- Full-Width Divider Line Below Summary -->
        <hr class="mf-divider" />

        <!-- Main Two-Column Layout -->
        <div class="mf-body-grid">
          <!-- Left Column: Skills, Education, Languages -->
          <aside class="mf-left-col">
            <!-- SKILLS -->
            <section class="mf-block">
              <h2 class="mf-section-title">SKILLS</h2>
              <ul class="mf-bullets">
                @for (skill of resolvedSkills; track $index) {
                  <li>{{ skill }}</li>
                }
              </ul>
            </section>

            <!-- Column Divider -->
            <hr class="mf-col-divider" />

            <!-- EDUCATION -->
            <section class="mf-block">
              <h2 class="mf-section-title">EDUCATION</h2>
              <div class="mf-edu-list">
                @for (edu of resolvedEducation; track $index) {
                  <div class="mf-edu-item">
                    <h3 class="mf-edu-degree">{{ edu.degree }}</h3>
                    <p class="mf-edu-school">{{ edu.institution }}</p>
                    <span class="mf-edu-years">{{ edu.years }}</span>
                  </div>
                }
              </div>
            </section>

            <!-- Column Divider -->
            <hr class="mf-col-divider" />

            <!-- LANGUAGES -->
            <section class="mf-block">
              <h2 class="mf-section-title">LANGUAGES</h2>
              <ul class="mf-bullets">
                @for (lang of resolvedLanguages; track $index) {
                  <li>{{ lang }}</li>
                }
              </ul>
            </section>
          </aside>

          <!-- Right Column: WORK EXPERIENCE with Timeline -->
          <main class="mf-right-col">
            <section class="mf-block">
              <h2 class="mf-section-title">WORK EXPERIENCE</h2>

              <div class="mf-timeline">
                @for (exp of resolvedExperience; track $index) {
                  <div class="mf-tl-item">
                    <!-- Timeline Node Dot -->
                    <span class="mf-tl-node" aria-hidden="true"></span>

                    <!-- Role & Organization -->
                    <h3 class="mf-exp-title">{{ exp.position }}</h3>
                    <div class="mf-exp-company">{{ exp.company }}</div>
                    <div class="mf-exp-period">{{ exp.period }}</div>

                    <!-- Bullet Points -->
                    @if (exp.bullets.length) {
                      <ul class="mf-exp-bullets">
                        @for (bullet of exp.bullets; track $index) {
                          <li>{{ bullet }}</li>
                        }
                      </ul>
                    }
                  </div>
                }
              </div>
            </section>
          </main>
        </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    .mf-page {
      --accent: #1F2937;
      --fs: 10px;
      --fw: 400;
      --lh: 1.5;
      --font: 'Montserrat', 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      background-color: #ffffff;
      padding: 16mm 18mm 16mm 18mm;
      font-family: var(--font);
      font-size: var(--fs);
      font-weight: var(--fw);
      line-height: var(--lh);
      color: #374151;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Header */
    .mf-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }

    .mf-title-col {
      flex: 1;
    }

    .mf-name {
      margin: 0 0 5px;
      font-size: calc(var(--fs) * 2.8);
      font-weight: 800;
      letter-spacing: 0.04em;
      color: var(--accent);
      text-transform: uppercase;
      line-height: 1.08;
    }

    .mf-role {
      margin: 0;
      font-size: calc(var(--fs) * 1.45);
      font-weight: 500;
      color: #374151;
      letter-spacing: 0.02em;
      line-height: 1.2;
    }

    /* Contact Details on Header Right */
    .mf-contact-col {
      display: flex;
      flex-direction: column;
      gap: 5.5px;
      align-items: flex-start;
    }

    .mf-contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: calc(var(--fs) * 0.95);
      color: #374151;
      line-height: 1.2;
    }

    .mf-icon-box {
      width: 14px;
      height: 14px;
      min-width: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #374151;
    }

    .mf-icon {
      width: 13.5px;
      height: 13.5px;
    }

    /* Full-Width Divider Line */
    .mf-divider {
      border: none;
      border-top: 1.5px solid #9CA3AF;
      margin: 16px 0 17px;
      width: 100%;
    }

    /* Section Title */
    .mf-section-title {
      margin: 0 0 10px;
      font-size: calc(var(--fs) * 1.25);
      font-weight: 800;
      letter-spacing: 0.12em;
      color: var(--accent);
      text-transform: uppercase;
      line-height: 1.1;
    }

    /* Summary Section */
    .mf-summary-section {
      display: flex;
      flex-direction: column;
    }

    .mf-summary-text {
      margin: 0;
      font-size: calc(var(--fs) * 0.96);
      line-height: 1.56;
      color: #374151;
      text-align: justify;
    }

    /* Main Two-Column Layout */
    .mf-body-grid {
      display: grid;
      grid-template-columns: 32.5% 67.5%;
      gap: 28px;
      flex: 1;
    }

    .mf-left-col {
      display: flex;
      flex-direction: column;
    }

    .mf-right-col {
      display: flex;
      flex-direction: column;
    }

    .mf-block {
      display: flex;
      flex-direction: column;
    }

    /* Column Divider */
    .mf-col-divider {
      border: none;
      border-top: 1.5px solid #9CA3AF;
      margin: 16px 0;
      width: 100%;
    }

    /* Bullet List in Left Column (Skills, Languages) */
    .mf-bullets {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 5.5px;
    }

    .mf-bullets li {
      position: relative;
      padding-left: 14px;
      font-size: calc(var(--fs) * 0.96);
      color: #374151;
      line-height: 1.34;
    }

    .mf-bullets li::before {
      content: '•';
      position: absolute;
      left: 1px;
      top: -1px;
      color: var(--accent);
      font-size: 13px;
    }

    /* Education Items in Left Column */
    .mf-edu-list {
      display: flex;
      flex-direction: column;
      gap: 13px;
    }

    .mf-edu-item {
      display: flex;
      flex-direction: column;
    }

    .mf-edu-degree {
      margin: 0 0 2px;
      font-size: calc(var(--fs) * 1.02);
      font-weight: 700;
      color: var(--accent);
      line-height: 1.25;
    }

    .mf-edu-school {
      margin: 0 0 1px;
      font-size: calc(var(--fs) * 0.95);
      color: #4B5563;
      line-height: 1.25;
    }

    .mf-edu-years {
      font-size: calc(var(--fs) * 0.9);
      color: #6B7280;
    }

    /* Work Experience Timeline in Right Column */
    .mf-timeline {
      position: relative;
      padding-left: 18px;
      border-left: 1.5px solid #9CA3AF;
      margin-left: 5px;
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .mf-tl-item {
      position: relative;
    }

    .mf-tl-node {
      position: absolute;
      left: -22.75px;
      top: 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--accent);
    }

    .mf-exp-title {
      margin: 0 0 1px;
      font-size: calc(var(--fs) * 1.12);
      font-weight: 700;
      color: var(--accent);
      line-height: 1.25;
    }

    .mf-exp-company {
      font-size: calc(var(--fs) * 0.96);
      color: #4B5563;
      font-weight: 500;
      margin-bottom: 1px;
    }

    .mf-exp-period {
      font-size: calc(var(--fs) * 0.92);
      font-style: italic;
      color: #4B5563;
      margin-bottom: 6px;
    }

    .mf-exp-bullets {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mf-exp-bullets li {
      position: relative;
      padding-left: 13px;
      font-size: calc(var(--fs) * 0.91);
      line-height: 1.45;
      color: #374151;
      text-align: justify;
    }

    .mf-exp-bullets li::before {
      content: '•';
      position: absolute;
      left: 1px;
      top: 0;
      color: var(--accent);
      font-size: 11px;
    }

    /* Responsive & Print */
    @media screen and (max-width: 700px) {
      :host {
        display: block;
        overflow-x: auto;
      }
      .mf-page {
        transform-origin: top left;
      }
    }

    @media print {
      :host {
        display: block;
      }
      .mf-page {
        width: 210mm !important;
        min-height: 297mm !important;
        box-sizing: border-box !important;
        margin: 0 auto !important;
        box-shadow: none !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      section, .tl-item { break-inside: avoid; page-break-inside: avoid; }
      @page {
        size: A4 portrait;
        margin: 0;
      }
    }
  `],
})
export class MinimalistFramedCvComponent {
  @Input() accent = '#1F2937';
  @Input() name = '';
  @Input() jobTitle = '';
  @Input() email = '';
  @Input() phone = '';
  @Input() location = '';
  @Input() linkedin = '';
  @Input() summary = '';
  @Input() photoUrl: string | null = null;

  @Input() education: CvEducation[] = [];
  @Input() experience: CvExperience[] = [];
  @Input() skills: CvSkill[] = [];
  @Input() languages: CvLanguage[] = [];
  @Input() certifications: any[] = [];
  @Input() projects: any[] = [];
  @Input() references: any[] = [];
  @Input() hobbies: any[] = [];

  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.55;
  @Input() fontFamily = "'Montserrat', 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  @Input() sectionLabels: Record<string, string> = {};
  @Input() sectionOrder: string[] = [];

  get resolvedName(): string {
    const raw = (this.name || '').trim();
    if (!raw || raw.toLowerCase() === 'your name' || raw.toLowerCase() === 'untitled cv') {
      return 'LORNA ALVARADO';
    }
    return raw;
  }

  get resolvedJobTitle(): string {
    const raw = (this.jobTitle || '').trim();
    if (!raw || raw.toLowerCase() === 'professional title') {
      return 'Sales Representative';
    }
    return raw;
  }

  get resolvedPhone(): string {
    const raw = (this.phone || '').trim();
    if (!raw || raw === '+855 12 345 678' || raw === '+1 234 567 8900') {
      return '+123-456-7890';
    }
    return raw;
  }

  get resolvedEmail(): string {
    const raw = (this.email || '').trim();
    if (!raw || raw === 'you@example.com' || raw === 'user@domain.com') {
      return 'hello@reallygreatsite.com';
    }
    return raw;
  }

  get resolvedLocation(): string {
    const raw = (this.location || '').trim();
    if (!raw || raw === 'City, Country' || raw === 'Phnom Penh, Cambodia') {
      return '123 Anywhere St., Any City';
    }
    return raw;
  }

  get resolvedSummary(): string {
    const raw = (this.summary || '').trim();
    if (!raw || raw.startsWith('Brief overview of your professional background') || raw === 'Short summary...') {
      return 'I am a Sales Representative is a professional who initializes and manages relationships with customers. They serve as their point of contact and lead from initial outreach through the making of the final purchase by them or someone in their household.';
    }
    return raw;
  }

  get resolvedSkills(): string[] {
    if (this.skills && this.skills.length) {
      const isGeneric =
        this.skills.length === 4 &&
        this.skills[0]?.name === 'Communication' &&
        this.skills[1]?.name === 'Teamwork' &&
        (!this.name || this.name === 'Your Name');

      if (!isGeneric) {
        return this.skills.map((s) => (typeof s === 'string' ? s : s.name || '')).filter(Boolean);
      }
    }

    return [
      'Client Acquisition',
      'B2B Sales',
      'Negotiation',
      'Relationship Management',
      'Market Analysis',
      'Sales Strategies',
      'Negotiation Skills',
      'Problem-Solving',
      'Time Management',
      'Presentation Skills',
      'Networking',
    ];
  }

  get resolvedEducation(): Array<{ institution: string; degree: string; years: string }> {
    if (this.education && this.education.length) {
      const isGeneric =
        this.education.length === 1 &&
        this.education[0]?.degree === "Bachelor's Degree" &&
        this.education[0]?.institution === 'Your University' &&
        (!this.name || this.name === 'Your Name');

      if (!isGeneric) {
        return this.education.map((e) => ({
          degree: [e.degree, e.field].filter(Boolean).join(' in ') || 'Bachelor of Business Management',
          institution: e.institution || 'Wardiere University',
          years: [e.startYear, e.current ? 'Present' : e.endYear].filter(Boolean).join(' - ') || '2016 - 2020',
        }));
      }
    }

    return [
      {
        degree: 'Bachelor of Business Management',
        institution: 'Wardiere University',
        years: '2016 - 2020',
      },
      {
        degree: 'Bachelor of Business Management',
        institution: 'Wardiere University',
        years: '2020 - 2023',
      },
    ];
  }

  get resolvedLanguages(): string[] {
    if (this.languages && this.languages.length) {
      const isGeneric =
        this.languages.length === 2 &&
        this.languages[0]?.name === 'Khmer' &&
        (!this.name || this.name === 'Your Name');

      if (!isGeneric) {
        return this.languages.map((l) => {
          const name = typeof l === 'string' ? l : l.name || '';
          const prof = typeof l === 'object' && l.proficiency ? ` (${l.proficiency})` : '';
          return `${name}${prof}`;
        }).filter(Boolean);
      }
    }

    return [
      'English (Fluent)',
      'French (Fluent)',
      'German (Basic)',
      'Spanish (Intermediate)',
    ];
  }

  get resolvedExperience(): Array<{
    position: string;
    company: string;
    period: string;
    bullets: string[];
  }> {
    if (this.experience && this.experience.length) {
      const isGeneric =
        this.experience.length === 2 &&
        this.experience[0]?.company === 'Company Name' &&
        (!this.name || this.name === 'Your Name');

      if (!isGeneric) {
        return this.experience.map((e) => {
          const bullets: string[] = [];
          if (Array.isArray(e.responsibilities) && e.responsibilities.length) {
            bullets.push(...e.responsibilities.map((r) => String(r).replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean));
          }
          if (!bullets.length && e.description) {
            bullets.push(
              ...e.description
                .split('\n')
                .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
                .filter(Boolean),
            );
          }
          return {
            position: e.position || 'Position',
            company: e.company || 'Company Name',
            period: [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' to ') || '2021 to Present',
            bullets: bullets.length ? bullets : ['Carried out key responsibilities successfully and efficiently.'],
          };
        });
      }
    }

    return [
      {
        position: 'Senior Sales Representative',
        company: 'Timmerman Industries',
        period: 'January 2021 to Present',
        bullets: [
          'Developed and executed sales strategies, resulting in a 25% increase in annual revenue. Managed a portfolio of 50+ clients, achieving a 95% customer retention rate.',
          'Conducted market research to identify new business opportunities and target prospects.',
        ],
      },
      {
        position: 'FMCG Sales Agent',
        company: 'Timmerman Industries',
        period: 'June 2018 to December 2020',
        bullets: [
          'Prospected and qualified leads through cold calling, email campaigns, and networking events.',
          'Maintained up-to-date knowledge of product features and benefits to provide accurate information to clients.',
        ],
      },
      {
        position: 'Sales Agent',
        company: 'Timmerman Industries',
        period: 'June 2017 to December 2018',
        bullets: [
          'Prospected and qualified leads through cold calling, email campaigns, and networking events.',
          'Increased sales by 20% by implementing effective upselling and cross-selling strategies.',
          'Maintained up-to-date knowledge of product features and benefits to provide accurate information to clients.',
        ],
      },
      {
        position: 'Sales Agent',
        company: 'Timmerman Industries',
        period: 'June 2015 to December 2017',
        bullets: [
          'Prospected and qualified leads through cold calling, email campaigns, and networking events.',
          'Increased sales by 20% by implementing effective upselling and cross-selling strategies.',
          'Maintained up-to-date knowledge of product features and benefits to provide accurate information to clients.',
        ],
      },
    ];
  }
}
