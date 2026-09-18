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

interface CvReference {
  name?: string;
  position?: string;
  company?: string;
  phone?: string;
  email?: string;
}

@Component({
  selector: 'app-navy-sidebar-profile-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="cv-paper"
      [style.--accent]="accent"
      [style.--fs.px]="fontSize"
      [style.--fw]="fontWeight"
      [style.--lh]="lineHeight"
      [style.--font]="fontFamily"
    >
      <!-- Left Sidebar Column (Deep Slate Navy Canvas) -->
      <aside class="sidebar">
        <!-- Circular Portrait Frame with White Ring -->
        <div class="photo-frame">
          <img [src]="resolvedPhotoUrl" alt="Candidate Portrait" class="photo-img" />
        </div>

        <!-- CONTACT Section -->
        <section class="side-block">
          <h2 class="side-title">CONTACT</h2>
          <div class="side-divider"></div>

          <div class="contact-list">
            <div class="contact-item">
              <span class="contact-icon-circle" aria-hidden="true">
                <!-- Location Pin Icon -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="contact-svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                </svg>
              </span>
              <span class="contact-text">{{ resolvedLocation }}</span>
            </div>

            <div class="contact-item">
              <span class="contact-icon-circle" aria-hidden="true">
                <!-- Phone Icon -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="contact-svg">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.43-3.9-6.63-6.82l1.97-1.57a1.002 1.002 0 0 0 .24-1.02A11.36 11.36 0 0 1 8.92 4c0-.55-.45-1-1-1H4.01c-.55 0-1 .45-1 1 0 9.39 7.63 17.02 17 17.02.55 0 1-.45 1-1v-3.64c0-.55-.45-1-1-1z"/>
                </svg>
              </span>
              <span class="contact-text">{{ resolvedPhone }}</span>
            </div>

            <div class="contact-item">
              <span class="contact-icon-circle" aria-hidden="true">
                <!-- Mail Icon -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="contact-svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
              <span class="contact-text">{{ resolvedEmail }}</span>
            </div>

            <div class="contact-item">
              <span class="contact-icon-circle" aria-hidden="true">
                <!-- Calendar / Date of Birth Icon -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="contact-svg">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                </svg>
              </span>
              <span class="contact-text">{{ resolvedDob }}</span>
            </div>
          </div>
        </section>

        <!-- EDUCATION Section -->
        <section class="side-block">
          <h2 class="side-title">EDUCATION</h2>
          <div class="side-divider"></div>

          <div class="edu-list">
            @for (edu of resolvedEducation; track $index) {
              <div class="edu-item">
                <div class="edu-degree">{{ edu.degree }}</div>
                <div class="edu-school">{{ edu.institution }}</div>
                <div class="edu-years">{{ edu.years }}</div>
              </div>
            }
          </div>
        </section>

        <!-- SKILLS Section -->
        <section class="side-block">
          <h2 class="side-title">SKILLS</h2>
          <div class="side-divider"></div>

          <!-- Professional Skills Subgroup -->
          <div class="skill-category">
            <h3 class="skill-category-title">// Professional</h3>
            <ul class="skill-list">
              @for (skill of professionalSkills; track $index) {
                <li class="skill-item">{{ skill }}</li>
              }
            </ul>
          </div>

          <!-- Technical Skills Subgroup -->
          @if (technicalSkills.length) {
            <div class="skill-category">
              <h3 class="skill-category-title">// Technical</h3>
              <ul class="skill-list">
                @for (skill of technicalSkills; track $index) {
                  <li class="skill-item">{{ skill }}</li>
                }
              </ul>
            </div>
          }
        </section>
      </aside>

      <!-- Right Main Column (Clean White Canvas) -->
      <main class="main-content">
        <!-- Candidate Header -->
        <header class="main-header">
          <h1 class="candidate-name">{{ resolvedName }}</h1>
          <p class="candidate-title">{{ resolvedJobTitle }}</p>
          <p class="candidate-summary">{{ resolvedSummary }}</p>
        </header>

        <!-- WORK EXPERIENCE Section with Timeline -->
        <section class="main-section">
          <div class="section-title-wrap">
            <h2 class="section-title">WORK EXPERIENCE</h2>
            <div class="section-rule"></div>
          </div>

          <div class="timeline">
            @for (item of resolvedExperience; track $index) {
              <div class="tl-item">
                <span class="tl-hollow-node" aria-hidden="true"></span>
                <div class="tl-heading">
                  <span class="tl-company">{{ item.company }}</span>
                  <span class="tl-slash">/</span>
                  <span class="tl-position">{{ item.position }}</span>
                </div>
                <div class="tl-date">From {{ item.period }}</div>
                @if (item.description) {
                  <p class="tl-desc">{{ item.description }}</p>
                }
                @if (item.responsibilities && item.responsibilities.length) {
                  <ul class="tl-bullets">
                    @for (bullet of item.responsibilities; track $index) {
                      <li>{{ bullet }}</li>
                    }
                  </ul>
                }
              </div>
            }
          </div>
        </section>

        <!-- REFERENCES Section -->
        <section class="main-section">
          <div class="section-title-wrap">
            <h2 class="section-title">REFERENCES</h2>
            <div class="section-rule"></div>
          </div>

          <div class="ref-grid">
            @for (ref of resolvedReferences; track $index) {
              <div class="ref-card">
                <h3 class="ref-name">{{ ref.name }}</h3>
                <div class="ref-company-role">{{ ref.company }} / {{ ref.role }}</div>
                <div class="ref-line">Phone: {{ ref.phone }}</div>
                <div class="ref-line">Email: {{ ref.email }}</div>
              </div>
            }
          </div>
        </section>
      </main>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    .cv-paper {
      --accent: #333A4C;
      --fs: 10px;
      --fw: 400;
      --lh: 1.55;
      --font: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

      box-sizing: border-box;
      display: grid;
      grid-template-columns: 34.5% 65.5%;
      width: 210mm;
      min-height: 297mm;
      overflow: hidden;
      background: #ffffff;
      color: #334155;
      font-family: var(--font);
      font-size: var(--fs);
      font-weight: var(--fw);
      line-height: var(--lh);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ─── Left Sidebar ─────────────────────────────────── */
    .sidebar {
      box-sizing: border-box;
      min-width: 0;
      min-height: 297mm;
      padding: 38px 22px 32px 24px;
      background-color: var(--accent);
      color: #ffffff;
      display: flex;
      flex-direction: column;
    }

    .photo-frame {
      width: 136px;
      height: 136px;
      margin: 0 auto 34px auto;
      border: 4px solid #ffffff;
      border-radius: 50%;
      overflow: hidden;
      background-color: #ffffff;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .photo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }

    .side-block {
      margin-bottom: 26px;
      break-inside: avoid;
    }

    .side-block:last-child {
      margin-bottom: 0;
    }

    .side-title {
      margin: 0 0 7px 0;
      font-size: calc(var(--fs) * 1.28);
      font-weight: 700;
      letter-spacing: 0.16em;
      color: #ffffff;
      text-transform: uppercase;
      line-height: 1.1;
    }

    .side-divider {
      height: 1px;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.35);
      margin-bottom: 14px;
    }

    /* Contact Details */
    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #ffffff;
      line-height: 1.35;
    }

    .contact-icon-circle {
      width: 22px;
      height: 22px;
      min-width: 22px;
      border-radius: 50%;
      border: 1.2px solid rgba(255, 255, 255, 0.85);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: transparent;
    }

    .contact-svg {
      width: 11px;
      height: 11px;
      fill: #ffffff;
    }

    .contact-text {
      flex: 1;
      word-break: break-word;
      color: #ffffff;
      font-size: calc(var(--fs) * 0.98);
      letter-spacing: 0.01em;
    }

    /* Education Details */
    .edu-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .edu-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .edu-degree {
      font-size: calc(var(--fs) * 1.08);
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.01em;
      line-height: 1.25;
    }

    .edu-school {
      font-size: calc(var(--fs) * 0.98);
      color: rgba(255, 255, 255, 0.92);
      line-height: 1.3;
    }

    .edu-years {
      font-size: calc(var(--fs) * 0.9);
      color: rgba(255, 255, 255, 0.65);
      margin-top: 1px;
    }

    /* Skills Details */
    .skill-category {
      margin-bottom: 12px;
    }

    .skill-category:last-child {
      margin-bottom: 0;
    }

    .skill-category-title {
      margin: 0 0 6px 0;
      font-size: calc(var(--fs) * 1.05);
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.03em;
    }

    .skill-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 3.5px;
    }

    .skill-item {
      font-size: calc(var(--fs) * 0.96);
      color: rgba(255, 255, 255, 0.92);
      line-height: 1.35;
    }

    /* ─── Right Main Column ────────────────────────────── */
    .main-content {
      box-sizing: border-box;
      min-width: 0;
      padding: 40px 32px 32px 34px;
      display: flex;
      flex-direction: column;
      background: #ffffff;
    }

    /* Header */
    .main-header {
      margin-bottom: 24px;
    }

    .candidate-name {
      margin: 0 0 6px 0;
      font-size: calc(var(--fs) * 2.85);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: 0.16em;
      color: #1E2532;
      text-transform: uppercase;
    }

    .candidate-title {
      margin: 0 0 16px 0;
      font-size: calc(var(--fs) * 1.15);
      font-weight: 600;
      letter-spacing: 0.22em;
      color: #2B3548;
      text-transform: uppercase;
    }

    .candidate-summary {
      margin: 0;
      color: #475569;
      font-size: calc(var(--fs) * 0.96);
      line-height: 1.58;
      text-align: justify;
    }

    /* Sections */
    .main-section {
      margin-bottom: 24px;
      break-inside: avoid;
    }

    .main-section:last-child {
      margin-bottom: 0;
    }

    .section-title-wrap {
      margin-bottom: 15px;
    }

    .section-title {
      margin: 0 0 6px 0;
      color: #1E2532;
      font-size: calc(var(--fs) * 1.28);
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      line-height: 1.1;
    }

    .section-rule {
      height: 1.2px;
      width: 100%;
      background-color: #1E2532;
    }

    /* Timeline */
    .timeline {
      position: relative;
      padding-left: 20px;
      border-left: 1.5px solid #64748B;
      margin-left: 6px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .tl-item {
      position: relative;
    }

    .tl-hollow-node {
      position: absolute;
      left: -26px;
      top: 3px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 1.8px solid var(--accent);
      background-color: #ffffff;
      box-sizing: border-box;
    }

    .tl-heading {
      display: flex;
      align-items: baseline;
      gap: 5px;
      line-height: 1.25;
      margin-bottom: 2px;
    }

    .tl-company {
      font-size: calc(var(--fs) * 1.12);
      font-weight: 700;
      color: #1E2532;
    }

    .tl-slash {
      color: #64748B;
      font-weight: 400;
    }

    .tl-position {
      font-size: calc(var(--fs) * 1.1);
      font-weight: 500;
      color: #1E2532;
    }

    .tl-date {
      font-size: calc(var(--fs) * 0.92);
      font-style: italic;
      color: #64748B;
      margin-bottom: 5px;
    }

    .tl-desc {
      margin: 0 0 5px 0;
      font-size: calc(var(--fs) * 0.95);
      line-height: 1.48;
      color: #475569;
      text-align: justify;
    }

    .tl-bullets {
      list-style: disc;
      margin: 0;
      padding-left: 15px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .tl-bullets li {
      font-size: calc(var(--fs) * 0.92);
      color: #475569;
      line-height: 1.44;
    }

    /* References */
    .ref-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px;
    }

    .ref-card {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ref-name {
      margin: 0 0 2px 0;
      font-size: calc(var(--fs) * 1.15);
      font-weight: 700;
      color: #1E2532;
    }

    .ref-company-role {
      font-size: calc(var(--fs) * 0.96);
      color: #475569;
      margin-bottom: 4px;
    }

    .ref-line {
      font-size: calc(var(--fs) * 0.92);
      color: #475569;
      line-height: 1.4;
    }

    /* Responsive & Print */
    @media screen and (max-width: 700px) {
      :host {
        display: block;
        overflow-x: auto;
      }
      .cv-paper {
        transform-origin: top left;
      }
    }

    @media print {
      :host {
        display: block;
        height: auto !important;
        overflow: visible !important;
      }
      .cv-paper {
        display: grid !important;
        grid-template-columns: 34.5% 65.5% !important;
        width: 210mm !important;
        max-width: 210mm !important;
        min-width: 210mm !important;
        min-height: 297mm !important;
        box-shadow: none !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .sidebar {
        min-width: 0 !important;
        min-height: 297mm !important;
      }
      .main-content {
        min-width: 0 !important;
      }
      @page {
        size: A4 portrait;
        margin: 0;
      }
    }
  `],
})
export class NavySidebarProfileCvComponent {
  @Input() accent = '#333A4C';
  @Input() name = '';
  @Input() jobTitle = '';
  @Input() email = '';
  @Input() phone = '';
  @Input() location = '';
  @Input() linkedin = '';
  @Input() dob = '';
  @Input() summary = '';
  @Input() photoUrl: string | null = null;

  @Input() education: CvEducation[] = [];
  @Input() experience: CvExperience[] = [];
  @Input() skills: CvSkill[] = [];
  @Input() languages: CvLanguage[] = [];
  @Input() certifications: any[] = [];
  @Input() projects: any[] = [];
  @Input() references: CvReference[] = [];
  @Input() hobbies: any[] = [];

  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.55;
  @Input() fontFamily = "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  @Input() sectionLabels: Record<string, string> = {};
  @Input() sectionOrder: string[] = [];

  get resolvedPhotoUrl(): string {
    if (this.photoUrl && !this.photoUrl.includes('placeholder') && this.photoUrl !== '/assets/sample-profile.svg') {
      return this.photoUrl;
    }
    return '/assets/mike-richrd-photo.png';
  }

  get resolvedName(): string {
    const raw = (this.name || '').trim();
    if (!raw || raw.toLowerCase() === 'your name' || raw.toLowerCase() === 'untitled cv') {
      return 'MIKE RICHRD';
    }
    return raw;
  }

  get resolvedJobTitle(): string {
    const raw = (this.jobTitle || '').trim();
    if (!raw || raw.toLowerCase() === 'professional title') {
      return 'PROFESSIONAL TITLE';
    }
    return raw;
  }

  get resolvedSummary(): string {
    const raw = (this.summary || '').trim();
    if (!raw || raw.toLowerCase().includes('lorem ipsum dolor sit amet, consectetur adipiscing elit')) {
      return 'My Name is Mike Richrd tandard dummy text one evers since the when unknown printer ipsu ipsu galley type and scrambled it to specimen book. Dolors Ipsum is simply dummy text of the and Lorem been the dustryu etting lorem when ane lorem standard Dolor Ipsum is.';
    }
    return raw;
  }

  get resolvedPhone(): string {
    const raw = (this.phone || '').trim();
    if (!raw || raw === '+855 12 345 678' || raw === '+1 234 567 8900' || raw === '123-456-7890') {
      return '00 999 123 456 789';
    }
    return raw;
  }

  get resolvedEmail(): string {
    const raw = (this.email || '').trim();
    if (!raw || raw === 'you@example.com' || raw === 'user@domain.com' || raw === 'hello@reallygreatsite.com') {
      return 'info@yourname.com';
    }
    return raw;
  }

  get resolvedLocation(): string {
    const raw = (this.location || '').trim();
    if (!raw || raw === 'City, Country' || raw === 'Phnom Penh, Cambodia' || raw === '123 Anywhere St., Any City') {
      return '12 Street, City/Country';
    }
    return raw;
  }

  get resolvedDob(): string {
    const raw = (this.dob || '').trim();
    if (!raw) {
      return 'Date of Birth';
    }
    return raw;
  }

  get resolvedWebsite(): string {
    const raw = (this.linkedin || '').trim();
    if (!raw) {
      return 'www.domainname.com';
    }
    return raw;
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
          institution: e.institution || 'University / Location',
          degree: [e.degree, e.field].filter(Boolean).join(' in ') || 'Enter Your Major',
          years: [e.startYear, e.current ? 'Present' : e.endYear].filter(Boolean).join(' - ') || '2011 - 2014',
        }));
      }
    }

    return [
      {
        institution: 'University / Location',
        degree: 'Enter Your Major',
        years: '2011 - 2014',
      },
      {
        institution: 'College / Location',
        degree: 'Enter Your Degree',
        years: '2007 - 2010',
      },
    ];
  }

  get allSkills(): string[] {
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
      'Public Relation',
      'Social Marketing',
      'Online marketing',
      'IT Application',
      'Planinng Meeting',
      'Planning',
      'Business System',
      'Microsoft Office',
      'Atocad (3D)',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Adobe Indesign',
    ];
  }

  get professionalSkills(): string[] {
    const list = this.allSkills;
    if (list.length <= 7) return list;
    return list.slice(0, 7);
  }

  get technicalSkills(): string[] {
    const list = this.allSkills;
    if (list.length <= 7) return [];
    return list.slice(7);
  }

  get resolvedExperience(): Array<{
    company: string;
    position: string;
    period: string;
    description: string;
    responsibilities?: string[];
  }> {
    if (this.experience && this.experience.length) {
      const isGeneric =
        this.experience.length === 1 &&
        this.experience[0]?.company === 'Your Company' &&
        (!this.name || this.name === 'Your Name');

      if (!isGeneric) {
        return this.experience.map((e) => ({
          company: e.company || 'Company Name',
          position: e.position || 'Your Job Position',
          period: [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' to ') || '2017 to 2019',
          description: e.description || '',
          responsibilities: e.responsibilities || [],
        }));
      }
    }

    return [
      {
        company: 'AB Development',
        position: 'Your Job Position',
        period: '2017 to 2019',
        description:
          'Dummy text is evers since the when unknown printer ipsu ipsu alleyd lorem ipsum dolor test. dummy text is evers since the when unknown printer ipsu ipsu galley and lorem ipsum dolor test.',
        responsibilities: [
          'Esetting lorem when ane lorem standard ipsu ipsu lor Ipsum is',
          'simply dummy text text the and Lorem industry text is evers since',
          'the standard lorem test of the and ipsum printer.',
        ],
      },
      {
        company: 'Blue Agency',
        position: 'Your Job Position',
        period: '2015 to 2017',
        description:
          'Dummy text is evers since the when unknown printer ipsu ipsu alleyd lorem ipsum dolor test. dummy text is evers since the when',
        responsibilities: [
          'Esetting lorem when ane lorem standard ipsu ipsu lor Ipsum is',
          'simply dummy text text the and Lorem industry text is evers since',
          'the standard lorem test of the and ipsum printer. unknown printer',
          'ipsu ipsu galley and lorem ipsum dolor test.',
        ],
      },
      {
        company: 'Creative Zone LTD',
        position: 'Your Job Position',
        period: '2012 to 2014',
        description:
          'Dummy text is evers since the when unknown printer ipsu ipsu alleyd lorem ipsum dolor test. dummy text is evers since the when unknown printer ipsu ipsu galley and lorem ipsum dolor test.',
        responsibilities: [
          'Esetting lorem when ane lorem standard ipsu ipsu lor Ipsum is',
          'simply dummy text text the and Lorem industry text is evers since',
          'the standard lorem test of the and ipsum printer.',
        ],
      },
    ];
  }

  get resolvedReferences(): Array<{
    name: string;
    role: string;
    company: string;
    phone: string;
    email: string;
  }> {
    if (this.references && this.references.length) {
      return this.references.map((r) => ({
        name: r.name || 'Reference Name',
        role: r.position || 'Position',
        company: r.company || 'Company Name',
        phone: r.phone || '+077 996 841 236',
        email: r.email || 'info@yourname.com',
      }));
    }

    return [
      {
        name: 'Amay Newston',
        role: 'Position',
        company: 'Company Name',
        phone: '+077 996 841 236',
        email: 'info@yourname.com',
      },
      {
        name: 'Olivia May',
        role: 'Position',
        company: 'Company Name',
        phone: '+077 996 841 236',
        email: 'info@yourname.com',
      },
    ];
  }
}
