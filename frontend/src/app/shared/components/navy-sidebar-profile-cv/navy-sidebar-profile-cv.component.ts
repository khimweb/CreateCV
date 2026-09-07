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
      <!-- Left Sidebar Column (Navy Canvas) -->
      <aside class="sidebar">
        <!-- Circular Portrait Frame with White Ring -->
        <div class="photo-frame">
          <img [src]="resolvedPhotoUrl" alt="Candidate Portrait" class="photo-img" />
        </div>

        <!-- CONTACT Section -->
        <section class="side-block">
          <div class="side-header">
            <span class="badge-icon-circle white-badge">
              <!-- Telephone Handset Icon -->
              <svg viewBox="0 0 24 24" fill="currentColor" class="badge-svg">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.43-3.9-6.63-6.82l1.97-1.57a1.002 1.002 0 0 0 .24-1.02A11.36 11.36 0 0 1 8.92 4c0-.55-.45-1-1-1H4.01c-.55 0-1 .45-1 1 0 9.39 7.63 17.02 17 17.02.55 0 1-.45 1-1v-3.64c0-.55-.45-1-1-1z"/>
              </svg>
            </span>
            <h2 class="side-title">CONTACT</h2>
          </div>

          <div class="contact-list">
            <div class="contact-item">
              <span class="contact-icon-box" aria-hidden="true">
                <!-- Desk / Retro Phone Icon -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="contact-svg">
                  <path d="M19 16c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v2zm-7-11c3.87 0 7 2.13 7 4H5c0-1.87 3.13-4 7-4zm8 14H4c-1.1 0-2-.9-2-2v-4c0-1.48.81-2.77 2-3.46V9c0-3.31 3.58-6 8-6s8 2.69 8 6v1.54c1.19.69 2 1.98 2 3.46v4c0 1.1-.9 2-2 2zM12 11.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                </svg>
              </span>
              <span class="contact-text">{{ resolvedPhone }}</span>
            </div>

            <div class="contact-item">
              <span class="contact-icon-box" aria-hidden="true">
                <!-- Solid Envelope Icon -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="contact-svg">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
              <span class="contact-text">{{ resolvedEmail }}</span>
            </div>

            <div class="contact-item">
              <span class="contact-icon-box" aria-hidden="true">
                <!-- Solid Location Pin Icon -->
                <svg viewBox="0 0 24 24" fill="currentColor" class="contact-svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                </svg>
              </span>
              <span class="contact-text">{{ resolvedLocation }}</span>
            </div>
          </div>
        </section>

        <!-- EDUCATION Section -->
        <section class="side-block">
          <div class="side-header">
            <span class="badge-icon-circle white-badge">
              <!-- Mortarboard / Graduation Cap Icon -->
              <svg viewBox="0 0 24 24" fill="currentColor" class="badge-svg">
                <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </span>
            <h2 class="side-title">EDUCATION</h2>
          </div>

          <div class="edu-list">
            @for (edu of resolvedEducation; track $index) {
              <div class="edu-item">
                <div class="edu-school">{{ edu.institution }}</div>
                <div class="edu-degree">{{ edu.degree }}</div>
                <div class="edu-years">{{ edu.years }}</div>
              </div>
            }
          </div>
        </section>

        <!-- SKILLS Section -->
        <section class="side-block">
          <div class="side-header">
            <span class="badge-icon-circle white-badge">
              <!-- Puzzle Piece Icon -->
              <svg viewBox="0 0 24 24" fill="currentColor" class="badge-svg">
                <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/>
              </svg>
            </span>
            <h2 class="side-title">SKILLS</h2>
          </div>

          <ul class="side-bullets">
            @for (skill of resolvedSkills; track $index) {
              <li>{{ skill }}</li>
            }
          </ul>
        </section>

        <!-- LANGUAGE Section -->
        <section class="side-block">
          <div class="side-header">
            <span class="badge-icon-circle white-badge">
              <!-- Dictionary / Book Icon -->
              <svg viewBox="0 0 24 24" fill="currentColor" class="badge-svg">
                <path d="M18 2H6c-1.2 0-2 .8-2 2v16c0 1.2.8 2 2 2h12c1.2 0 2-.8 2-2V4c0-1.2-.8-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v7l2.5-1.87L12 11V4h6v16z"/>
              </svg>
            </span>
            <h2 class="side-title">LANGUAGE</h2>
          </div>

          <ul class="side-bullets">
            @for (lang of resolvedLanguages; track $index) {
              <li>{{ lang }}</li>
            }
          </ul>
        </section>
      </aside>

      <!-- Right Main Column (White Sheet) -->
      <main class="main-content">
        <!-- Header: Candidate Name & Job Title -->
        <header class="main-header">
          <h1 class="candidate-name">
            <span class="name-line">{{ nameLine1 }}</span>
            <span class="name-line">{{ nameLine2 }}</span>
          </h1>
          <p class="candidate-role">{{ resolvedJobTitle }}</p>
        </header>

        <!-- ABOUT ME Section -->
        <section class="main-block">
          <div class="main-header-row">
            <span class="badge-icon-circle navy-badge">
              <!-- User Profile Silhouette Icon -->
              <svg viewBox="0 0 24 24" fill="currentColor" class="badge-svg-white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </span>
            <h2 class="main-title">ABOUT ME</h2>
          </div>
          <p class="about-text">{{ resolvedSummary }}</p>
        </section>

        <!-- EXPERIENCE Section with Timeline -->
        <section class="main-block">
          <div class="main-header-row">
            <span class="badge-icon-circle navy-badge">
              <!-- Briefcase Icon -->
              <svg viewBox="0 0 24 24" fill="currentColor" class="badge-svg-white">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
            </span>
            <h2 class="main-title">EXPERIENCE</h2>
          </div>

          <div class="timeline">
            @for (item of resolvedExperience; track $index) {
              <div class="tl-item">
                <span class="tl-node" aria-hidden="true"></span>
                <div class="tl-header">
                  <h3 class="tl-position">{{ item.position }}</h3>
                  <span class="tl-period">{{ item.period }}</span>
                </div>
                <div class="tl-company">{{ item.company }}</div>
                <p class="tl-desc">{{ item.description }}</p>
              </div>
            }
          </div>
        </section>

        <!-- REFERENCES Section -->
        <section class="main-block">
          <div class="main-header-row">
            <span class="badge-icon-circle navy-badge">
              <!-- Two People / References Icon -->
              <svg viewBox="0 0 24 24" fill="currentColor" class="badge-svg-white">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </span>
            <h2 class="main-title">REFERENCES</h2>
          </div>

          <div class="ref-grid">
            @for (ref of resolvedReferences; track $index) {
              <div class="ref-card">
                <h3 class="ref-name">{{ ref.name }}</h3>
                <div class="ref-role">{{ ref.role }}</div>
                <div class="ref-contact-row">
                  <span class="ref-lbl">Phone:</span>
                  <span>{{ ref.phone }}</span>
                </div>
                <div class="ref-contact-row">
                  <span class="ref-lbl">Email:</span>
                  <span>{{ ref.email }}</span>
                </div>
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
      --accent: #16394F;
      --fs: 10px;
      --fw: 400;
      --lh: 1.55;
      --font: 'Montserrat', 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

      box-sizing: border-box;
      display: grid;
      grid-template-columns: 35.5% 64.5%;
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

    /* Left Sidebar */
    .sidebar {
      box-sizing: border-box;
      min-height: 297mm;
      padding: 34px 22px 28px 24px;
      background: var(--accent);
      color: #ffffff;
      display: flex;
      flex-direction: column;
    }

    .photo-frame {
      width: 142px;
      height: 142px;
      margin: 0 auto 30px auto;
      border: 4.5px solid #ffffff;
      border-radius: 50%;
      overflow: hidden;
      background-color: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
      margin-bottom: 25px;
      break-inside: avoid;
    }

    .side-block:last-child {
      margin-bottom: 0;
    }

    .side-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 11px;
    }

    .side-title {
      margin: 0;
      font-size: calc(var(--fs) * 1.25);
      font-weight: 700;
      letter-spacing: 0.16em;
      color: #ffffff;
      text-transform: uppercase;
      line-height: 1;
    }

    /* Circular Badges */
    .badge-icon-circle {
      width: 25px;
      height: 25px;
      min-width: 25px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .white-badge {
      background-color: #ffffff;
      color: var(--accent);
    }

    .navy-badge {
      background-color: var(--accent);
      color: #ffffff;
    }

    .badge-svg {
      width: 13.5px;
      height: 13.5px;
      fill: var(--accent);
    }

    .badge-svg-white {
      width: 13.5px;
      height: 13.5px;
      fill: #ffffff;
    }

    /* Contact Details */
    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 9px;
      color: #ffffff;
      font-size: calc(var(--fs) * 1.05);
      line-height: 1.3;
    }

    .contact-icon-box {
      width: 16px;
      height: 16px;
      min-width: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .contact-svg {
      width: 13.5px;
      height: 13.5px;
      fill: #ffffff;
    }

    .contact-text {
      flex: 1;
      word-break: break-word;
      color: #ffffff;
    }

    /* Education Details */
    .edu-list {
      display: flex;
      flex-direction: column;
      gap: 13px;
    }

    .edu-item {
      display: flex;
      flex-direction: column;
      gap: 1.5px;
    }

    .edu-school {
      font-size: calc(var(--fs) * 1.12);
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.02em;
    }

    .edu-degree {
      font-size: calc(var(--fs) * 0.98);
      color: #E2E8F0;
      line-height: 1.3;
    }

    .edu-years {
      font-size: calc(var(--fs) * 0.92);
      color: #CBD5E1;
    }

    /* Bullets in Sidebar (Skills, Language) */
    .side-bullets {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 5.5px;
    }

    .side-bullets li {
      position: relative;
      padding-left: 14px;
      font-size: calc(var(--fs) * 1.04);
      color: #ffffff;
      line-height: 1.35;
    }

    .side-bullets li::before {
      content: '•';
      position: absolute;
      left: 1px;
      top: -1px;
      color: #ffffff;
      font-size: calc(var(--fs) * 1.25);
    }

    /* Right Main Column */
    .main-content {
      box-sizing: border-box;
      min-width: 0;
      padding: 34px 28px 28px 30px;
      display: flex;
      flex-direction: column;
    }

    /* Header */
    .main-header {
      margin-bottom: 26px;
    }

    .candidate-name {
      margin: 0;
      display: flex;
      flex-direction: column;
      font-size: calc(var(--fs) * 3.3);
      font-weight: 800;
      line-height: 1.04;
      letter-spacing: 0.04em;
      color: #1E293B;
      text-transform: uppercase;
    }

    .name-line {
      display: block;
    }

    .candidate-role {
      margin: 8px 0 0;
      color: #334155;
      font-size: calc(var(--fs) * 1.48);
      font-weight: 500;
      letter-spacing: 0.05em;
    }

    /* Blocks in Main Content */
    .main-block {
      margin-bottom: 23px;
      break-inside: avoid;
    }

    .main-block:last-child {
      margin-bottom: 0;
    }

    .main-header-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .main-title {
      margin: 0;
      color: #1E293B;
      font-size: calc(var(--fs) * 1.28);
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      line-height: 1;
    }

    .about-text {
      margin: 0;
      color: #475569;
      font-size: calc(var(--fs) * 0.98);
      line-height: 1.58;
      text-align: justify;
    }

    /* Experience Timeline */
    .timeline {
      position: relative;
      padding-left: 14px;
      border-left: 1.5px solid #CBD5E1;
      margin-left: 5px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 8px;
    }

    .tl-item {
      position: relative;
    }

    .tl-node {
      position: absolute;
      left: -19px;
      top: 3.5px;
      width: 8.5px;
      height: 8.5px;
      border-radius: 50%;
      background-color: var(--accent);
    }

    .tl-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 2px;
    }

    .tl-position {
      margin: 0;
      font-size: calc(var(--fs) * 1.16);
      font-weight: 700;
      color: #1E293B;
      letter-spacing: 0.01em;
    }

    .tl-period {
      flex: 0 0 auto;
      font-size: calc(var(--fs) * 0.94);
      font-weight: 500;
      color: #64748B;
      white-space: nowrap;
    }

    .tl-company {
      font-size: calc(var(--fs) * 1.04);
      font-style: italic;
      color: #475569;
      margin-bottom: 3.5px;
    }

    .tl-desc {
      margin: 0;
      font-size: calc(var(--fs) * 0.95);
      line-height: 1.46;
      color: #475569;
      text-align: justify;
    }

    /* References Grid */
    .ref-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 8px;
    }

    .ref-card {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ref-name {
      margin: 0;
      font-size: calc(var(--fs) * 1.25);
      font-weight: 700;
      color: #1E293B;
    }

    .ref-role {
      font-size: calc(var(--fs) * 1.04);
      color: #475569;
      margin-bottom: 5px;
    }

    .ref-contact-row {
      display: flex;
      align-items: baseline;
      gap: 5px;
      font-size: calc(var(--fs) * 0.94);
      color: #334155;
      line-height: 1.35;
    }

    .ref-lbl {
      font-weight: 700;
      color: #1E293B;
    }

    /* Print & Responsive */
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
        width: 100% !important;
        min-height: 0 !important;
        box-shadow: none !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .sidebar {
        min-height: 0 !important;
      }
      @page {
        size: A4 portrait;
        margin: 0;
      }
    }
  `],
})
export class NavySidebarProfileCvComponent {
  @Input() accent = '#16394F';
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
  @Input() references: CvReference[] = [];
  @Input() hobbies: any[] = [];

  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.55;
  @Input() fontFamily = "'Montserrat', 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  @Input() sectionLabels: Record<string, string> = {};
  @Input() sectionOrder: string[] = [];

  get resolvedPhotoUrl(): string {
    if (this.photoUrl && !this.photoUrl.includes('placeholder') && this.photoUrl !== '/assets/sample-profile.svg') {
      return this.photoUrl;
    }
    return '/assets/lorna-alvarado-photo.png';
  }

  get resolvedName(): string {
    const raw = (this.name || '').trim();
    if (!raw || raw.toLowerCase() === 'your name' || raw.toLowerCase() === 'untitled cv') {
      return 'LORNA ALVARADO';
    }
    return raw;
  }

  get nameLine1(): string {
    const parts = this.resolvedName.split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return this.resolvedName;
    return parts[0];
  }

  get nameLine2(): string {
    const parts = this.resolvedName.split(/\s+/).filter(Boolean);
    if (parts.length <= 1) return '';
    return parts.slice(1).join(' ');
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
      return '123-456-7890';
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

  get resolvedEducation(): Array<{ institution: string; degree: string; years: string }> {
    if (this.education && this.education.length) {
      const isGeneric =
        this.education.length === 1 &&
        this.education[0]?.degree === "Bachelor's Degree" &&
        this.education[0]?.institution === 'Your University' &&
        (!this.name || this.name === 'Your Name');

      if (!isGeneric) {
        return this.education.map((e) => ({
          institution: e.institution || 'University Name',
          degree: [e.degree, e.field].filter(Boolean).join(' in ') || 'Degree Name',
          years: [e.startYear, e.current ? 'Present' : e.endYear].filter(Boolean).join(' - ') || '2020 - 2023',
        }));
      }
    }

    return [
      {
        institution: 'Borcelle University',
        degree: 'Bachelor of Business Management',
        years: '2020 - 2023',
      },
      {
        institution: 'Wardiere University',
        degree: 'Bachelor of Business Management',
        years: '2016 - 2020',
      },
      {
        institution: 'Borcelle University',
        degree: 'Bachelor of Business Management',
        years: '2012 - 2016',
      },
    ];
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
      'Management Skills',
      'Creativity',
      'Digital Marketing',
      'Negotiation',
      'Critical Thinking',
      'Leadership',
    ];
  }

  get resolvedLanguages(): string[] {
    if (this.languages && this.languages.length) {
      const isGeneric =
        this.languages.length === 2 &&
        this.languages[0]?.name === 'Khmer' &&
        (!this.name || this.name === 'Your Name');

      if (!isGeneric) {
        return this.languages.map((l) => (typeof l === 'string' ? l : l.name || '')).filter(Boolean);
      }
    }

    return ['English', 'Spain'];
  }

  get resolvedSummary(): string {
    const raw = (this.summary || '').trim();
    if (!raw || raw.startsWith('Brief overview of your professional background') || raw === 'Short summary...') {
      return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    }
    return raw;
  }

  get resolvedExperience(): Array<{ position: string; company: string; period: string; description: string }> {
    if (this.experience && this.experience.length) {
      const isGeneric =
        this.experience.length === 2 &&
        this.experience[0]?.company === 'Company Name' &&
        (!this.name || this.name === 'Your Name');

      if (!isGeneric) {
        return this.experience.map((e) => {
          let desc = e.description || '';
          if (!desc && Array.isArray(e.responsibilities) && e.responsibilities.length) {
            desc = e.responsibilities.join('. ') + '.';
          }
          return {
            position: e.position || 'Position Title',
            company: e.company || 'Company Name',
            period: [e.startDate, e.current ? 'Present' : e.endDate].filter(Boolean).join(' - ') || '2016 - 2020',
            description: desc || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan.',
          };
        });
      }
    }

    return [
      {
        position: 'Product Design Manager',
        company: 'Arowwai Industries',
        period: '2016 - 2020',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.',
      },
      {
        position: 'Marketing Manager',
        company: 'Arowwai Industries',
        period: '2019 - 2020',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.',
      },
      {
        position: 'Marketing Manager',
        company: 'Arowwai Industries',
        period: '2017 - 2019',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.',
      },
      {
        position: 'Marketing Manager',
        company: 'Arowwai Industries',
        period: '2016 - 2017',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.',
      },
    ];
  }

  get resolvedReferences(): Array<{ name: string; role: string; phone: string; email: string }> {
    if (this.references && this.references.length) {
      const isGeneric =
        this.references.length === 1 &&
        this.references[0]?.name === 'Reference Full Name' &&
        (!this.name || this.name === 'Your Name');

      if (!isGeneric) {
        return this.references.map((r) => ({
          name: r.name || 'Reference Person',
          role: [r.company, r.position].filter(Boolean).join(' / ') || 'CEO',
          phone: r.phone || '123-456-7890',
          email: r.email || 'hello@reallygreatsite.com',
        }));
      }
    }

    return [
      {
        name: 'Harumi Kobayashi',
        role: 'Wardiere Inc. / CEO',
        phone: '123-456-7890',
        email: 'hello@reallygreatsite.com',
      },
      {
        name: 'Bailey Dupont',
        role: 'Wardiere Inc. / CEO',
        phone: '123-456-7890',
        email: 'hello@reallygreatsite.com',
      },
    ];
  }
}
