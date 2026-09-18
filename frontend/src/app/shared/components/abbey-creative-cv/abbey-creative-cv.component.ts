import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface CvEducation { institution?: string; degree?: string; field?: string; startYear?: string; endYear?: string; current?: boolean; gpa?: string; description?: string; }
interface CvExperience { company?: string; position?: string; startDate?: string; endDate?: string; current?: boolean; responsibilities?: string[]; description?: string; }
interface CvSkill { name?: string; level?: string; }
interface CvLanguage { name?: string; proficiency?: string; }
interface CvReference { name?: string; position?: string; company?: string; phone?: string; email?: string; }
interface CvHobby { name?: string; }
interface CvCertification { name?: string; issuer?: string; date?: string; }
interface CvProject { name?: string; description?: string; link?: string; }

@Component({
  selector: 'app-abbey-creative-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv-paper" [style.--accent]="accent" [style.--fs.px]="fontSize" [style.--fw]="fontWeight" [style.--lh]="lineHeight" [style.--font]="fontFamily">
      <div class="layout">
        <!-- ─── LEFT SIDEBAR (DARK CHARCOAL SLATE) ─── -->
        <aside class="sidebar">
          <!-- Circular Profile Photo with Direct Accent Ring -->
          <div class="photo-wrapper">
            <div class="photo-ring">
              <img [src]="resolvedPhotoUrl" alt="Profile Portrait" class="photo-img" />
            </div>
          </div>

          <!-- ABOUT ME -->
          <section class="sb-section">
            <h2 class="sb-title">{{ lbl('About Me', 'ABOUT ME') }}</h2>
            <p class="sb-desc">{{ resolvedSummary }}</p>
          </section>

          <!-- CONTACT -->
          <section class="sb-section">
            <h2 class="sb-title">{{ lbl('Contact', 'CONTACT') }}</h2>
            <div class="contact-items">
              @if (isDemo) {
                <div class="contact-entry">
                  <span class="entry-label">{{ lbl('Address', 'Address:') }}</span>
                  <span class="entry-value">{{ location || '12th Avenue Street Australia 40000' }}</span>
                </div>
                <div class="contact-entry">
                  <span class="entry-label">{{ lbl('Mobile', 'Mobile:') }}</span>
                  <span class="entry-value">{{ phone || '02800200' }}</span>
                </div>
                <div class="contact-entry">
                  <span class="entry-label">{{ lbl('Home', 'Home:') }}</span>
                  <span class="entry-value">02800200</span>
                </div>
                <div class="contact-entry">
                  <span class="entry-label">{{ lbl('Email', 'Email:') }}</span>
                  <span class="entry-value">{{ email || 'abbeywatson@gmail.com' }}</span>
                </div>
                <div class="contact-entry">
                  <span class="entry-label">{{ lbl('Website', 'Website:') }}</span>
                  <span class="entry-value">{{ linkedin || 'abbeywatson.com' }}</span>
                </div>
                <div class="contact-entry">
                  <span class="entry-label">Skype:</span>
                  <span class="entry-value">abbeywatson</span>
                </div>
              } @else {
                @if (location) {
                  <div class="contact-entry">
                    <span class="entry-label">{{ lbl('Address', 'Address:') }}</span>
                    <span class="entry-value">{{ location }}</span>
                  </div>
                }
                @if (phone) {
                  <div class="contact-entry">
                    <span class="entry-label">{{ lbl('Mobile', 'Mobile:') }}</span>
                    <span class="entry-value">{{ phone }}</span>
                  </div>
                }
                @if (email) {
                  <div class="contact-entry">
                    <span class="entry-label">{{ lbl('Email', 'Email:') }}</span>
                    <span class="entry-value">{{ email }}</span>
                  </div>
                }
                @if (linkedin) {
                  <div class="contact-entry">
                    <span class="entry-label">{{ lbl('Website', 'Website:') }}</span>
                    <span class="entry-value">{{ linkedin }}</span>
                  </div>
                }
                @if (dob) {
                  <div class="contact-entry">
                    <span class="entry-label">{{ lbl('Date of Birth', 'Date of Birth:') }}</span>
                    <span class="entry-value">{{ dob }}</span>
                  </div>
                }
              }
            </div>
          </section>

          <!-- SKILLS (HORIZONTAL PROGRESS BARS BESIDE SKILL NAME) -->
          <section class="sb-section">
            <h2 class="sb-title">{{ lbl('Skills', 'SKILLS') }}</h2>
            <div class="skill-list">
              @for (sk of resolvedSkills; track sk.name) {
                <div class="skill-row">
                  <span class="skill-label">{{ sk.name }}</span>
                  <div class="skill-bar-wrap">
                    <div class="skill-bar-fill" [style.width.%]="sk.percent"></div>
                  </div>
                </div>
              }
            </div>
          </section>

          <!-- LANGUAGES (IF PRESENT) -->
          @if (languages && languages.length) {
            <section class="sb-section">
              <h2 class="sb-title">{{ lbl('Languages', 'LANGUAGES') }}</h2>
              <div class="skill-list">
                @for (lang of languages; track lang.name) {
                  <div class="skill-row">
                    <span class="skill-label">{{ lang.name }}</span>
                    <div class="skill-bar-wrap">
                      <div class="skill-bar-fill" [style.width.%]="langPercent(lang.proficiency || '')"></div>
                    </div>
                  </div>
                }
              </div>
            </section>
          }

          <!-- HOBBIES (IF PRESENT) -->
          @if (hobbyNames.length) {
            <section class="sb-section">
              <h2 class="sb-title">{{ lbl('Hobbies', 'HOBBIES') }}</h2>
              <div class="hobby-tags">
                @for (h of hobbyNames; track h) {
                  <span class="hobby-tag">{{ h }}</span>
                }
              </div>
            </section>
          }
        </aside>

        <!-- ─── RIGHT MAIN CONTENT (PRISTINE WHITE) ─── -->
        <main class="main-content">
          <!-- NAME & TITLE HEADER -->
          <header class="name-header">
            <h1 class="header-name">
              <span class="first-name">{{ resolvedFirstName }}</span>
              <span class="last-name"> {{ resolvedLastName }}</span>
            </h1>
            <p class="header-title">{{ resolvedJobTitle }}</p>
            <div class="header-accent-line"></div>
          </header>

          <!-- EXPERIENCES -->
          <section class="main-section">
            <div class="section-title-wrap">
              <span class="section-icon-badge">
                <!-- Briefcase Icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </span>
              <h2 class="section-heading">{{ lbl('Work Experience', 'EXPERIENCES') }}</h2>
            </div>
            <div class="section-full-rule"></div>

            <div class="entries-stack">
              @for (item of resolvedExperiences; track item.company || item.position) {
                <div class="entry-row">
                  <div class="entry-meta-col">
                    <div class="meta-role">{{ item.position || 'Graphic Designer' }}</div>
                    <div class="meta-date">{{ experienceDates(item) }}</div>
                  </div>
                  <div class="entry-content-col">
                    <div class="content-org">{{ item.company || 'Studio Name' }}</div>
                    @if (item.description) {
                      <p class="content-desc">{{ item.description }}</p>
                    }
                    @if (item.responsibilities && item.responsibilities.length) {
                      <ul class="content-bullets">
                        @for (r of item.responsibilities; track r) {
                          <li>{{ r }}</li>
                        }
                      </ul>
                    }
                  </div>
                </div>
              }
            </div>
          </section>

          <!-- EDUCATION -->
          <section class="main-section">
            <div class="section-title-wrap">
              <span class="section-icon-badge">
                <!-- Graduation Cap Icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </span>
              <h2 class="section-heading">{{ lbl('Education', 'EDUCATION') }}</h2>
            </div>
            <div class="section-full-rule"></div>

            <div class="entries-stack">
              @for (item of resolvedEducation; track item.institution || item.degree) {
                <div class="entry-row">
                  <div class="entry-meta-col">
                    <div class="meta-role">{{ item.institution || 'University Name' }}</div>
                    <div class="meta-date">{{ educationDates(item) }}</div>
                  </div>
                  <div class="entry-content-col">
                    <div class="content-org">{{ item.degree || item.field || 'Degree Program' }}</div>
                    @if (item.description) {
                      <p class="content-desc">{{ item.description }}</p>
                    }
                  </div>
                </div>
              }
            </div>
          </section>

          <!-- CERTIFICATIONS (IF PRESENT) -->
          @if (certifications && certifications.length) {
            <section class="main-section">
              <div class="section-title-wrap">
                <span class="section-icon-badge">
                  <!-- Award Badge Icon -->
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="8" r="6"/>
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                </span>
                <h2 class="section-heading">{{ lbl('Certifications', 'CERTIFICATIONS') }}</h2>
              </div>
              <div class="section-full-rule"></div>

              <div class="entries-stack">
                @for (cert of certifications; track cert.name) {
                  <div class="entry-row">
                    <div class="entry-meta-col">
                      <div class="meta-role">{{ cert.name }}</div>
                      <div class="meta-date">{{ cert.date }}</div>
                    </div>
                    <div class="entry-content-col">
                      <div class="content-org">{{ cert.issuer }}</div>
                    </div>
                  </div>
                }
              </div>
            </section>
          }

          <!-- REFERENCE -->
          <section class="main-section">
            <div class="section-title-wrap">
              <span class="section-icon-badge">
                <!-- Users Icon -->
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
              <h2 class="section-heading">{{ lbl('References', 'REFERENCE') }}</h2>
            </div>
            <div class="section-full-rule"></div>

            <div class="ref-grid">
              @for (ref of resolvedReferences; track ref.name) {
                <div class="ref-card">
                  <div class="ref-person-name">{{ ref.name }}</div>
                  <div class="ref-person-role">{{ referenceRole(ref) }}</div>
                  @if (ref.phone) {
                    <div class="ref-contact-line">Phone: {{ ref.phone }}</div>
                  }
                  @if (ref.email) {
                    <div class="ref-contact-line">Email: {{ ref.email }}</div>
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
    :host { display: block; }
    * { box-sizing: border-box; }

    .cv-paper {
      --accent: #E27B2B;
      --fs: 10px;
      --fw: 400;
      --lh: 1.5;
      --font: 'Montserrat', 'Inter', 'Segoe UI', -apple-system, sans-serif;
      box-sizing: border-box;
      width: 210mm;
      min-height: 297mm;
      background: #FFFFFF;
      overflow: hidden;
      font-family: var(--font);
      font-size: var(--fs);
      font-weight: var(--fw);
      line-height: var(--lh);
      box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .layout {
      display: grid;
      grid-template-columns: 68mm 1fr;
      min-height: 297mm;
    }

    /* ════════════════════════════════════════════
       LEFT SIDEBAR: DARK CHARCOAL SLATE
       ════════════════════════════════════════════ */
    .sidebar {
      background-color: #30343D;
      color: #FFFFFF;
      padding: 9mm 6.5mm 9mm 6.5mm;
      display: flex;
      flex-direction: column;
      min-height: 297mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Circular Photo with Direct Accent Ring */
    .photo-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 7mm;
    }

    .photo-ring {
      width: 35mm;
      height: 35mm;
      border-radius: 50%;
      border: 1.8mm solid var(--accent);
      background: #444955;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }

    .photo-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }

    /* Sidebar Sections */
    .sb-section {
      margin-bottom: 5.8mm;
      break-inside: avoid;
    }
    .sb-section:last-child {
      margin-bottom: 0;
    }

    .sb-title {
      margin: 0 0 2.4mm 0;
      font-size: calc(var(--fs) * 1.22);
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .sb-desc {
      margin: 0;
      font-size: calc(var(--fs) * 0.85);
      color: #CBD1DC;
      line-height: 1.55;
      text-align: justify;
      font-weight: 400;
    }

    /* Contact Details */
    .contact-items {
      display: flex;
      flex-direction: column;
      gap: 2.2mm;
    }

    .contact-entry {
      display: flex;
      flex-direction: column;
      gap: 0.4mm;
    }

    .entry-label {
      font-size: calc(var(--fs) * 0.88);
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.02em;
    }

    .entry-value {
      font-size: calc(var(--fs) * 0.84);
      color: #CBD1DC;
      word-break: break-word;
      line-height: 1.35;
    }

    /* Skills: Horizontal Progress Bars Beside Skill Name */
    .skill-list {
      display: flex;
      flex-direction: column;
      gap: 2.4mm;
    }

    .skill-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2.5mm;
    }

    .skill-label {
      font-size: calc(var(--fs) * 0.88);
      font-weight: 600;
      color: #FFFFFF;
      letter-spacing: 0.01em;
      white-space: nowrap;
      min-width: 20mm;
    }

    .skill-bar-wrap {
      flex: 1;
      height: 1.6mm;
      background: #474C57;
      border-radius: 1mm;
      overflow: hidden;
    }

    .skill-bar-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 1mm;
      transition: width 0.3s ease;
    }

    /* Hobbies */
    .hobby-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 1.6mm 2mm;
    }

    .hobby-tag {
      font-size: calc(var(--fs) * 0.84);
      color: #CBD1DC;
      background: rgba(255, 255, 255, 0.08);
      padding: 0.6mm 2.2mm;
      border-radius: 1mm;
      border: 0.3mm solid rgba(255, 255, 255, 0.18);
    }

    /* ════════════════════════════════════════════
       RIGHT MAIN CONTENT: PRISTINE WHITE
       ════════════════════════════════════════════ */
    .main-content {
      background: #FFFFFF;
      color: #2F333B;
      padding: 9mm 10mm 9mm 8.5mm;
      display: flex;
      flex-direction: column;
    }

    /* Header: ABBEY WATSON */
    .name-header {
      margin-bottom: 5.5mm;
    }

    .header-name {
      margin: 0;
      font-size: calc(var(--fs) * 3.15);
      font-weight: 800;
      line-height: 1.05;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .first-name {
      color: #1F232B;
    }

    .last-name {
      color: var(--accent);
    }

    .header-title {
      margin: 1.6mm 0 0 0;
      font-size: calc(var(--fs) * 1.32);
      font-weight: 500;
      color: #4D5360;
      letter-spacing: 0.02em;
    }

    .header-accent-line {
      margin-top: 2.5mm;
      width: 48mm;
      height: 0.5mm;
      background: var(--accent);
    }

    /* Main Sections */
    .main-section {
      margin-bottom: 5mm;
      break-inside: avoid;
    }
    .main-section:last-child {
      margin-bottom: 0;
    }

    .section-title-wrap {
      display: flex;
      align-items: center;
      gap: 2.6mm;
    }

    .section-icon-badge {
      width: 6.2mm;
      height: 6.2mm;
      border-radius: 50%;
      background: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .section-icon-badge svg {
      width: 3.5mm;
      height: 3.5mm;
      stroke: #FFFFFF;
    }

    .section-heading {
      margin: 0;
      font-size: calc(var(--fs) * 1.25);
      font-weight: 800;
      color: #1F232B;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .section-full-rule {
      width: 100%;
      height: 0.45mm;
      background: var(--accent);
      margin-top: 1.4mm;
      margin-bottom: 3.5mm;
    }

    /* Entry Rows (2-column layout per entry) */
    .entries-stack {
      display: flex;
      flex-direction: column;
      gap: 3.6mm;
    }

    .entry-row {
      display: grid;
      grid-template-columns: 34mm 1fr;
      gap: 3.5mm;
      align-items: start;
      break-inside: avoid;
    }

    .entry-meta-col {
      display: flex;
      flex-direction: column;
      gap: 0.6mm;
    }

    .meta-role {
      font-size: calc(var(--fs) * 0.94);
      font-weight: 800;
      color: #1F232B;
      line-height: 1.25;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .meta-date {
      font-size: calc(var(--fs) * 0.82);
      color: #727988;
      font-weight: 600;
    }

    .entry-content-col {
      display: flex;
      flex-direction: column;
      gap: 0.8mm;
    }

    .content-org {
      font-size: calc(var(--fs) * 0.94);
      font-weight: 800;
      color: #2F343E;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      line-height: 1.25;
    }

    .content-desc {
      margin: 0;
      font-size: calc(var(--fs) * 0.84);
      color: #555B68;
      line-height: 1.52;
      text-align: justify;
    }

    .content-bullets {
      margin: 0;
      padding-left: 3.5mm;
      font-size: calc(var(--fs) * 0.84);
      color: #555B68;
      display: flex;
      flex-direction: column;
      gap: 0.6mm;
    }

    .content-bullets li {
      line-height: 1.45;
    }

    /* References: 2-column cards */
    .ref-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4mm;
    }

    .ref-card {
      display: flex;
      flex-direction: column;
      gap: 0.6mm;
      break-inside: avoid;
    }

    .ref-person-name {
      font-size: calc(var(--fs) * 0.96);
      font-weight: 800;
      color: #1F232B;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .ref-person-role {
      font-size: calc(var(--fs) * 0.85);
      color: #505664;
      font-weight: 500;
      margin-bottom: 0.5mm;
    }

    .ref-contact-line {
      font-size: calc(var(--fs) * 0.82);
      color: #656C7A;
      line-height: 1.4;
      word-break: break-all;
    }

    /* ════════════════════════════════════════════
       RESPONSIVE & PRINT RULES
       ════════════════════════════════════════════ */
    @media screen and (max-width: 700px) {
      :host { display: block; overflow-x: auto; }
      .cv-paper { transform-origin: top left; }
    }

    @media print {
      :host { display: block; }
      .cv-paper {
        width: 210mm !important;
        max-width: 210mm !important;
        min-width: 210mm !important;
        min-height: 297mm !important;
        box-shadow: none !important;
        margin: 0 auto !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .layout {
        display: grid !important;
        grid-template-columns: 68mm 1fr !important;
      }
      .sidebar {
        min-height: 297mm !important;
      }
      .sb-section, .main-section, .entry-row, .ref-card {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      @page {
        size: A4 portrait;
        margin: 0;
      }
    }
  `]
})
export class AbbeyCreativeCvComponent {
  @Input() accent = '#E27B2B';
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
  @Input() certifications: CvCertification[] = [];
  @Input() projects: CvProject[] = [];
  @Input() references: CvReference[] = [];
  @Input() hobbies: CvHobby[] = [];
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.5;
  @Input() fontFamily = "'Montserrat', 'Inter', 'Segoe UI', -apple-system, sans-serif";
  @Input() sectionLabels: Record<string, string> = {};
  @Input() sectionOrder: string[] = [];

  lbl(key: string, fallback?: string): string {
    if (!this.sectionLabels) return fallback ?? key;
    if (this.sectionLabels[key]) return this.sectionLabels[key];
    const k = key.toLowerCase().replace(/[^a-z]/g, '');
    for (const [sKey, val] of Object.entries(this.sectionLabels)) {
      const sk = sKey.toLowerCase().replace(/[^a-z]/g, '');
      if (sk === k) return val;
      if (k.includes('contact') && (sk.includes('contact') || sk.includes('personal'))) {
        return val;
      }
      if ((k.includes('about') || k.includes('profile') || k.includes('summary')) &&
          (sk.includes('about') || sk.includes('profile') || sk.includes('summary'))) {
        return val;
      }
      if ((k.includes('work') || k.includes('experience')) &&
          (sk.includes('work') || sk.includes('experience'))) {
        return val;
      }
      if (k.includes('educat') && sk.includes('educat')) {
        return val;
      }
      if (k.includes('skill') && sk.includes('skill')) {
        return val;
      }
      if (k.includes('lang') && sk.includes('lang')) {
        return val;
      }
      if (k.includes('ref') && sk.includes('ref')) {
        return val;
      }
      if (k.includes('certif') && sk.includes('certif')) {
        return val;
      }
    }
    return fallback ?? key;
  }

  get isDemo(): boolean {
    return !this.name || this.name.trim().toUpperCase() === 'ABBEY WATSON';
  }

  get resolvedPhotoUrl(): string {
    return this.photoUrl || '/assets/abbey-watson-photo.png';
  }

  get resolvedSummary(): string {
    return (
      this.summary ||
      'My Name is Abbey Watson lorem empus id fringilla molestie ornare diam in cleste ipsum etium rosn ollicitudin est, porttitor amet hitmasla Done cporttitor dolor shit dolor kiren lorem nisl molestie pretium etfring is the shitp lorem ipcum retiunci amet is tudinest moles tium lorem olestie pretium apaza all the rosen fringilla lorem ipsum .'
    );
  }

  get resolvedFirstName(): string {
    const raw = (this.name || 'ABBEY WATSON').trim();
    const parts = raw.split(/\s+/);
    if (parts.length <= 1) return parts[0] || 'ABBEY';
    return parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
  }

  get resolvedLastName(): string {
    const raw = (this.name || 'ABBEY WATSON').trim();
    const parts = raw.split(/\s+/);
    if (parts.length <= 1) return '';
    return parts.slice(Math.ceil(parts.length / 2)).join(' ');
  }

  get resolvedJobTitle(): string {
    return (this.jobTitle || '').trim() || 'Creative Director';
  }

  get resolvedSkills(): { name: string; percent: number }[] {
    if (this.skills && this.skills.length) {
      const mapped = this.skills
        .map(s => ({ name: s.name || '', percent: this.skillPercent(s.level || '') }))
        .filter(s => s.name);
      if (mapped.length) return mapped;
    }
    return [
      { name: 'Wordpress', percent: 80 },
      { name: 'Joomla', percent: 65 },
      { name: 'Photoshop', percent: 75 },
      { name: 'Illustrator', percent: 60 },
      { name: 'HTML 5', percent: 90 }
    ];
  }

  get resolvedExperiences(): CvExperience[] {
    if (this.experience && this.experience.length) {
      return this.experience;
    }
    return [
      {
        company: 'SOFT DESIGN STUDIOS',
        position: 'GRAPHIC DESIGNER',
        startDate: '2015',
        endDate: '2017',
        description: 'Porttitor amet massa Done cporttitor dolor et nisl molestie ium feliscon lore ipsum dolor tfringilla lorem lorem ipsum ollicitudin est dolor time.'
      },
      {
        company: 'WEB TECH LTD',
        position: 'WEB DESIGNER',
        startDate: '2013',
        endDate: '2015',
        description: 'Porttitor amet massa Done cporttitor dolor et nisl molestie ium feliscon lore ipsum dolor tfringilla lorem lorem ipsum ollicitudin est dolor time.'
      },
      {
        company: 'DEV CREATIVE SOLUTIONS',
        position: 'LEAD WEB DESIGNER',
        startDate: '2010',
        endDate: '2013',
        description: 'Porttitor amet massa Done cporttitor dolor et nisl molestie ium feliscon lore ipsum dolor tfringilla lorem lorem ipsum ollicitudin est dolor time. Done cporttitor'
      }
    ];
  }

  get resolvedEducation(): CvEducation[] {
    if (this.education && this.education.length) {
      return this.education;
    }
    return [
      {
        institution: 'UNIVERSITY OF LOREM',
        degree: 'CERTIFICATE OF WEB TRAINIG',
        startYear: '2008',
        endYear: '2010',
        description: 'Porttitor amet massa Done cporttitor dolor et nisl molestie ium feliscon lore ipsum dolor tfringilla lorem lorem ipsum ollicitudin est dolor time.'
      },
      {
        institution: 'UNIVERSITY OF LOREM',
        degree: 'BECHELOR OF ART DIRECTOR',
        startYear: '2007',
        endYear: '2009',
        description: 'Porttitor amet massa Done cporttitor dolor et nisl molestie ium feliscon lore ipsum dolor tfringilla lorem lorem ipsum ollicitudin est dolor time. Done cporttitor'
      },
      {
        institution: 'UNIVERSITY OF LOREM',
        degree: 'BECHELOR OF ART DIRECTOR',
        startYear: '2007',
        endYear: '2009',
        description: 'Porttitor amet massa Done cporttitor dolor et nisl molestie ium feliscon lore ipsum dolor tfringilla lorem lorem ipsum ollicitudin est dolor time. Done cporttitor'
      }
    ];
  }

  get resolvedReferences(): CvReference[] {
    if (this.references && this.references.length) {
      return this.references;
    }
    return [
      {
        name: 'WILLIAM KLEIMAN',
        position: 'Director',
        company: 'Matrix media limited',
        phone: '+555 123 5566',
        email: 'williamkleiman@gmail.com'
      },
      {
        name: 'JENSEN SMITH',
        position: 'Web developer',
        company: 'Design mate LTD',
        phone: '+123 5556 4455',
        email: 'jensonsmith@gmail.com'
      }
    ];
  }

  get hobbyNames(): string[] {
    return (this.hobbies || []).map(h => (typeof h === 'string' ? h : h?.name)).filter(Boolean) as string[];
  }

  referenceRole(ref: CvReference): string {
    const parts: string[] = [];
    if (ref.position) parts.push(ref.position);
    if (ref.company) parts.push(ref.company);
    return parts.join(', ');
  }

  skillPercent(level: string): number {
    const l = (level || '').toLowerCase().trim();
    const map: Record<string, number> = {
      beginner: 25,
      basic: 38,
      intermediate: 58,
      advanced: 80,
      expert: 95,
      fluent: 85,
      native: 100
    };
    return map[l] ?? 70;
  }

  langPercent(proficiency: string): number {
    const p = (proficiency || '').toLowerCase().trim();
    const map: Record<string, number> = {
      beginner: 25,
      basic: 40,
      intermediate: 60,
      advanced: 80,
      fluent: 90,
      native: 100,
      expert: 95
    };
    return map[p] ?? 75;
  }

  experienceDates(item: CvExperience): string {
    return [item.startDate, item.current ? 'Present' : item.endDate].filter(Boolean).join(' - ');
  }

  educationDates(item: CvEducation): string {
    return [item.startYear, item.current ? 'Present' : item.endYear].filter(Boolean).join(' - ');
  }
}
