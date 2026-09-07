import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navy-badge-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="nb-container"
      [style.--fs.px]="fontSize"
      [style.--fw]="fontWeight"
      [style.--lh]="lineHeight"
      [style.--font]="fontFamily"
      [style.--accent]="accent"
    >
      <div class="nb-sheet">
        <!-- Left Sidebar (Navy Column) -->
        <aside class="nb-sidebar">
          <!-- Top Photo Area -->
          <div class="nb-photo-wrapper">
            <img [src]="resolvedPhotoUrl" alt="Candidate Photo" class="nb-photo-img" />
          </div>

          <!-- ABOUT ME Section -->
          <section class="nb-side-section">
            <div class="nb-pill-badge">ABOUT ME</div>

            <div class="nb-metrics-list">
              <div class="nb-metric-row">
                <span class="nb-diamond">◆</span>
                <span class="nb-metric-label">DOB</span>
                <span class="nb-colon">:</span>
                <span class="nb-metric-val">{{ resolvedDob }}</span>
              </div>
              <div class="nb-metric-row">
                <span class="nb-diamond">◆</span>
                <span class="nb-metric-label">Height</span>
                <span class="nb-colon">:</span>
                <span class="nb-metric-val">{{ resolvedHeight }}</span>
              </div>
              <div class="nb-metric-row">
                <span class="nb-diamond">◆</span>
                <span class="nb-metric-label">Marital Status</span>
                <span class="nb-colon">:</span>
                <span class="nb-metric-val">{{ resolvedMaritalStatus }}</span>
              </div>
            </div>

            <!-- Contact List with matching icons -->
            <div class="nb-contact-list">
              <div class="nb-contact-item">
                <span class="nb-icon-box" aria-hidden="true">
                  <!-- Modern Location Pin Icon -->
                  <svg class="nb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <span class="nb-contact-text">{{ resolvedLocation }}</span>
              </div>
              <div class="nb-contact-item">
                <span class="nb-icon-box" aria-hidden="true">
                  <!-- Modern Smartphone Mobile Phone Icon -->
                  <svg class="nb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
                    <path d="M12 18h.01"/>
                  </svg>
                </span>
                <span class="nb-contact-text">{{ resolvedPhone }}</span>
              </div>
              <div class="nb-contact-item">
                <span class="nb-icon-box" aria-hidden="true">
                  <!-- Modern Mail Envelope Icon -->
                  <svg class="nb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <span class="nb-contact-text nb-email-text">{{ resolvedEmail }}</span>
              </div>
            </div>
          </section>

          <!-- LANGUAGE Section -->
          <section class="nb-side-section">
            <div class="nb-pill-badge">LANGUAGE</div>

            @for (lang of resolvedLanguages; track $index) {
              <div class="nb-lang-group">
                <div class="nb-lang-title">
                  <span class="nb-diamond">◆</span>
                  <span>{{ lang.name.toUpperCase() }}</span>
                </div>

                @for (meter of lang.meters; track meter.label) {
                  <div class="nb-meter-row">
                    <span class="nb-meter-label">{{ meter.label }}</span>
                    <div class="nb-meter-track">
                      <div class="nb-meter-fill" [style.width.%]="meter.percent"></div>
                    </div>
                  </div>
                }
              </div>
            }
          </section>

          <!-- PERSONAL TRAIT Section -->
          <section class="nb-side-section">
            <div class="nb-pill-badge">PERSONAL TRAIT</div>

            <div class="nb-traits-list">
              @for (trait of resolvedTraits; track $index) {
                <div class="nb-trait-item">- {{ trait }}</div>
              }
            </div>

            @if (resolvedExtraTraits.length) {
              <div class="nb-traits-separator"></div>
              <div class="nb-extra-heading">Extra Helpful Traits</div>
              <div class="nb-traits-list">
                @for (trait of resolvedExtraTraits; track $index) {
                  <div class="nb-trait-item">- {{ trait }}</div>
                }
              </div>
            }
          </section>
        </aside>

        <!-- Right Column: Navy Header on top + Curved White Card -->
        <div class="nb-right-col">
          <!-- Top Title Header Banner -->
          <header class="nb-header">
            <h1 class="nb-name">{{ resolvedName }}</h1>
            <div class="nb-apply-line">
              <span class="nb-apply-text">Apply for</span>
              <span class="nb-position-badge">{{ resolvedJobTitle }}</span>
            </div>
          </header>

          <!-- White Content Card with signature curved top-left and bottom-left corners -->
          <main class="nb-main-card">
            <!-- EXPERIENCE Section -->
            <section class="nb-main-section">
              <h2 class="nb-section-title">E X P E R I E N C E</h2>
              <div class="nb-exp-list">
                @for (exp of resolvedExperience; track $index) {
                  <div class="nb-exp-item">
                    <div class="nb-exp-headline">
                      <strong>{{ exp.title }}</strong>
                      @if (exp.company) {
                        <span> | {{ exp.company }}</span>
                      }
                      @if (exp.period && (!exp.company || !exp.company.includes(exp.period)) && (!exp.title || !exp.title.includes(exp.period))) {
                        <span class="nb-exp-period"> ({{ exp.period }})</span>
                      }
                    </div>
                    <ul class="nb-bullet-list">
                      @for (bullet of exp.bullets; track $index) {
                        <li>{{ bullet }}</li>
                      }
                    </ul>
                  </div>
                }
              </div>
            </section>

            <!-- EDUCATION Section -->
            <section class="nb-main-section">
              <h2 class="nb-section-title">E D U C A T I O N</h2>
              <div class="nb-edu-list">
                @for (edu of resolvedEducation; track $index) {
                  <div class="nb-edu-row">
                    <span class="nb-edu-period">{{ edu.period }}</span>
                    <span class="nb-edu-colon">:</span>
                    <span class="nb-edu-desc" [innerHTML]="edu.html"></span>
                  </div>
                }
              </div>

              @if (resolvedShortCourses.length) {
                <div class="nb-sub-heading">SHORT COURSES:</div>
                <div class="nb-edu-list">
                  @for (course of resolvedShortCourses; track $index) {
                    <div class="nb-edu-row">
                      <span class="nb-edu-period">{{ course.period }}</span>
                      <span class="nb-edu-colon">:</span>
                      <span class="nb-edu-desc" [innerHTML]="course.html"></span>
                    </div>
                  }
                </div>
              }
            </section>

            <!-- PROJECTS & ACHIEVEMENTS / QUALIFICATION Section -->
            @if (hasProjectsOrAchievements) {
              <section class="nb-main-section">
                <h2 class="nb-section-title">P R O J E C T S &nbsp; &amp; &nbsp; A C H I E V E M E N T S</h2>
                <ul class="nb-bullet-list">
                  @for (p of resolvedProjects; track $index) {
                    <li>{{ p }}</li>
                  }
                </ul>
                @if (resolvedOtherAchievements.length) {
                  <div class="nb-sub-heading" style="margin-top: 6px; margin-bottom: 3px;">OTHER ACHIEVEMENTS</div>
                  <ul class="nb-bullet-list">
                    @for (ach of resolvedOtherAchievements; track $index) {
                      <li>{{ ach }}</li>
                    }
                  </ul>
                }
              </section>
            } @else {
              <section class="nb-main-section">
                <h2 class="nb-section-title">Q U A L I F I C A T I O N</h2>
                <div class="nb-qual-grid">
                  <ul class="nb-qual-col">
                    @for (item of resolvedQualificationsCol1; track $index) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                  <ul class="nb-qual-col">
                    @for (item of resolvedQualificationsCol2; track $index) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                </div>
              </section>
            }

            <!-- REFERENCE Section -->
            <section class="nb-main-section">
              <h2 class="nb-section-title">R E F E R E N C E</h2>
              <div class="nb-ref-list">
                @for (ref of resolvedReferences; track $index) {
                  <div class="nb-ref-item">
                    <div class="nb-ref-name">• {{ ref.name }} ({{ ref.position }})</div>
                    <div class="nb-ref-contact">
                      @if (ref.email) {
                        <span>E-mail: {{ ref.email }}</span>
                      }
                      @if (ref.phone) {
                        <span>MP: {{ ref.phone }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </section>
          </main>
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    .nb-container {
      --fs: 9.5px;
      --fw: 400;
      --lh: 1.42;
      --font: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      --accent: #232D42;
      --bar-gold: #C59B27;
      --bar-track: #354257;

      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      font-family: var(--font);
      font-size: var(--fs);
      font-weight: var(--fw);
      line-height: var(--lh);
      background-color: var(--accent);
      color: #1f2937;
      display: flex;
      flex-direction: column;
      position: relative;
      padding-bottom: 22px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.14);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .nb-sheet {
      display: grid;
      grid-template-columns: 34% 66%;
      flex: 1;
      align-items: stretch;
      width: 100%;
    }

    /* Left Sidebar */
    .nb-sidebar {
      background-color: var(--accent);
      color: #ffffff;
      padding: 16px 14px 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .nb-photo-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 4px;
    }

    .nb-photo-img {
      width: 100%;
      max-width: 185px;
      height: 200px;
      border-radius: 18px;
      object-fit: cover;
      object-position: center top;
      display: block;
      border: none;
      box-shadow: none;
    }

    .nb-side-section {
      display: flex;
      flex-direction: column;
    }

    .nb-pill-badge {
      background-color: #ffffff;
      color: var(--accent);
      font-weight: 800;
      font-size: calc(var(--fs) * 1.05);
      letter-spacing: 0.12em;
      text-align: center;
      text-transform: uppercase;
      border-radius: 9999px;
      padding: 3.5px 16px;
      margin: 0 auto 9px auto;
      width: 92%;
      box-sizing: border-box;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    }

    .nb-diamond {
      color: #ffffff;
      font-size: 7px;
      flex-shrink: 0;
      line-height: 1;
      display: inline-block;
      margin-right: 3px;
    }

    .nb-metrics-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-bottom: 13px;
      font-size: calc(var(--fs) * 0.94);
    }

    .nb-metric-row {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nb-metric-label {
      width: 82px;
      flex-shrink: 0;
      font-weight: 500;
      color: #ffffff;
    }

    .nb-colon {
      flex-shrink: 0;
      margin-right: 4px;
      color: #ffffff;
    }

    .nb-metric-val {
      color: #ffffff;
      white-space: nowrap;
    }

    .nb-contact-list {
      display: flex;
      flex-direction: column;
      gap: 9px;
      font-size: calc(var(--fs) * 0.92);
      color: #ffffff;
      line-height: 1.34;
    }

    .nb-contact-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .nb-icon-box {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 1px;
    }

    .nb-icon {
      width: 15px;
      height: 15px;
      color: #ffffff;
      stroke: #ffffff;
    }

    .nb-contact-text {
      flex: 1;
      word-break: break-word;
      color: #ffffff;
    }

    .nb-email-text {
      word-break: break-all;
    }

    /* Language meters */
    .nb-lang-group {
      margin-bottom: 10px;
    }

    .nb-lang-group:last-child {
      margin-bottom: 0;
    }

    .nb-lang-title {
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 700;
      font-size: calc(var(--fs) * 0.98);
      margin-bottom: 5px;
      color: #ffffff;
    }

    .nb-meter-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 4px;
    }

    .nb-meter-label {
      font-size: calc(var(--fs) * 0.9);
      width: 54px;
      flex-shrink: 0;
      color: #ffffff;
    }

    .nb-meter-track {
      flex: 1;
      height: 6px;
      background-color: var(--bar-track);
      border-radius: 2px;
      overflow: hidden;
    }

    .nb-meter-fill {
      height: 100%;
      background-color: var(--bar-gold);
      border-radius: 2px;
    }

    /* Traits */
    .nb-traits-list {
      display: flex;
      flex-direction: column;
      gap: 4.5px;
      font-size: calc(var(--fs) * 0.9);
      line-height: 1.34;
      color: #ffffff;
    }

    .nb-trait-item {
      padding-left: 1px;
    }

    .nb-traits-separator {
      border-top: 1px solid rgba(255, 255, 255, 0.22);
      margin: 10px 0 6px;
    }

    .nb-extra-heading {
      font-weight: 700;
      font-size: calc(var(--fs) * 0.96);
      margin-bottom: 5px;
      color: #ffffff;
    }

    /* Right Column (Navy banner + Curved White Card) */
    .nb-right-col {
      display: flex;
      flex-direction: column;
      padding-right: 14px;
    }

    /* Header Banner on Navy background */
    .nb-header {
      padding: 22px 14px 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .nb-name {
      font-family: var(--font);
      font-size: calc(var(--fs) * 2.5);
      font-weight: 800;
      letter-spacing: 0.16em;
      color: #ffffff;
      margin: 0 0 8px;
      line-height: 1.1;
      text-transform: uppercase;
      text-align: center;
    }

    .nb-apply-line {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .nb-apply-text {
      color: #ffffff;
      font-size: calc(var(--fs) * 1.14);
      font-weight: 400;
    }

    .nb-position-badge {
      background-color: #ffffff;
      color: var(--accent);
      font-weight: 700;
      padding: 2.5px 12px;
      border-radius: 3px;
      font-size: calc(var(--fs) * 1.08);
      display: inline-block;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    /* Main White Card with signatures curved top-left and bottom-left */
    .nb-main-card {
      background-color: #ffffff;
      border-top-left-radius: 38px;
      border-bottom-left-radius: 38px;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 14px;
      padding: 22px 22px 22px 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 13px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      color: #1f2937;
    }

    .nb-main-section {
      display: flex;
      flex-direction: column;
    }

    .nb-section-title {
      font-family: var(--font);
      font-size: calc(var(--fs) * 1.18);
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--accent);
      border-bottom: 1.5px solid var(--accent);
      padding-bottom: 2px;
      margin: 0 0 7px;
    }

    .nb-exp-list {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }

    .nb-exp-headline {
      font-size: calc(var(--fs) * 0.98);
      color: #111827;
      margin-bottom: 3px;
    }

    .nb-exp-period {
      font-size: calc(var(--fs) * 0.9);
      color: #4b5563;
      font-weight: 400;
    }

    .nb-bullet-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2.5px;
    }

    .nb-bullet-list li {
      position: relative;
      padding-left: 13px;
      font-size: calc(var(--fs) * 0.92);
      color: #1f2937;
      line-height: 1.35;
      text-align: justify;
    }

    .nb-bullet-list li::before {
      content: '•';
      position: absolute;
      left: 1px;
      top: 0;
      color: #111827;
      font-size: calc(var(--fs) * 1.1);
    }

    /* Education */
    .nb-edu-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nb-edu-row {
      display: flex;
      align-items: flex-start;
      gap: 4px;
      font-size: calc(var(--fs) * 0.94);
      line-height: 1.36;
      color: #1f2937;
    }

    .nb-edu-period {
      width: 110px;
      flex-shrink: 0;
      color: #111827;
      font-weight: 500;
    }

    .nb-edu-colon {
      margin-right: 4px;
      flex-shrink: 0;
    }

    .nb-edu-desc {
      flex: 1;
    }

    .nb-sub-heading {
      font-weight: 700;
      font-size: calc(var(--fs) * 0.95);
      margin: 7px 0 3px;
      color: #111827;
      letter-spacing: 0.04em;
    }

    /* Qualifications Grid */
    .nb-qual-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .nb-qual-col {
      list-style-type: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 2.5px;
    }

    .nb-qual-col li {
      position: relative;
      padding-left: 13px;
      font-size: calc(var(--fs) * 0.92);
      color: #1f2937;
      line-height: 1.34;
    }

    .nb-qual-col li::before {
      content: '•';
      position: absolute;
      left: 1px;
      top: 0;
      color: #111827;
    }

    /* Reference */
    .nb-ref-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .nb-ref-item {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .nb-ref-name {
      font-size: calc(var(--fs) * 0.94);
      font-weight: 600;
      color: #111827;
    }

    .nb-ref-contact {
      padding-left: 13px;
      font-size: calc(var(--fs) * 0.89);
      color: #374151;
      line-height: 1.35;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    /* Print */
    @media print {
      :host {
        display: block;
      }
      .nb-container {
        width: 100% !important;
        min-height: 297mm !important;
        box-shadow: none !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      @page {
        size: A4 portrait;
        margin: 0;
      }
    }
  `],
})
export class NavyBadgeCvComponent {
  @Input() accent = '#232D42';
  @Input() photoUrl: string | null = null;
  @Input() name = '';
  @Input() jobTitle = '';
  @Input() email = '';
  @Input() phone = '';
  @Input() location = '';
  @Input() linkedin = '';
  @Input() summary = '';
  @Input() dob = 'January 06, 2005';
  @Input() height = '1.60m';
  @Input() maritalStatus = 'Single';

  @Input() experience: any[] = [];
  @Input() education: any[] = [];
  @Input() skills: any[] = [];
  @Input() languages: any[] = [];
  @Input() certifications: any[] = [];
  @Input() projects: any[] = [];
  @Input() references: any[] = [];
  @Input() hobbies: any[] = [];

  @Input() fontSize = 9.5;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.42;
  @Input() fontFamily = "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif";
  @Input() sectionLabels: { [key: string]: string } = {};
  @Input() sectionOrder: string[] = [];

  get resolvedPhotoUrl(): string {
    if (this.photoUrl && this.photoUrl !== '/assets/sample-profile.svg' && !this.photoUrl.includes('placeholder')) {
      return this.photoUrl;
    }
    return '/assets/saing-sokaiya-photo.jpg';
  }

  get resolvedName(): string {
    const raw = (this.name || '').trim();
    if (!raw || raw.toLowerCase() === 'your name' || raw.toLowerCase() === 'untitled cv') {
      return 'SAING SOKAIYA';
    }
    return raw;
  }

  get resolvedJobTitle(): string {
    const raw = (this.jobTitle || '').trim();
    if (!raw || raw.toLowerCase() === 'professional title' || raw === 'Accountant Assistance') {
      return 'ACCOUNTING ASSISTANT';
    }
    return raw.toUpperCase();
  }

  get resolvedEmail(): string {
    const raw = (this.email || '').trim();
    if (!raw || raw === 'you@example.com') {
      return 'kaiyabai2626@gmail.com';
    }
    return raw;
  }

  get resolvedPhone(): string {
    const raw = (this.phone || '').trim();
    if (!raw || raw === '+855 12 345 678') {
      return '096 491 0220';
    }
    return raw;
  }

  get resolvedLocation(): string {
    const raw = (this.location || '').trim();
    if (!raw || raw === 'Phnom Penh, Cambodia') {
      return 'Trapeang Sala Village, Sangkat Dangkor, Phom Penh';
    }
    return raw;
  }

  get resolvedDob(): string {
    return (this.dob || '').trim() || 'January 06, 2005';
  }

  get resolvedHeight(): string {
    return (this.height || '').trim() || '1.60m';
  }

  get resolvedMaritalStatus(): string {
    return (this.maritalStatus || '').trim() || 'Single';
  }

  private isGenericLanguages(): boolean {
    if (!this.languages || !this.languages.length) return true;
    if (
      this.languages.length === 2 &&
      this.languages[0]?.name === 'Khmer' &&
      this.languages[0]?.proficiency === 'Native' &&
      this.languages[1]?.name === 'English' &&
      this.languages[1]?.proficiency === 'Intermediate' &&
      (!this.name || this.name === 'Your Name')
    ) {
      return true;
    }
    return false;
  }

  get resolvedLanguages(): Array<{
    name: string;
    meters: Array<{ label: string; percent: number }>;
  }> {
    if (this.languages && this.languages.length && !this.isGenericLanguages()) {
      return this.languages.map((l: any) => {
        const langName = typeof l === 'string' ? l : l.name || 'Language';
        const prof = typeof l === 'object' ? l.proficiency : 'Intermediate';
        let base = 75;
        if (prof === 'Beginner') base = 50;
        if (prof === 'Intermediate') base = 75;
        if (prof === 'Fluent' || prof === 'Advanced') base = 85;
        if (prof === 'Native') base = 95;
        return {
          name: langName,
          meters: [
            { label: 'Speaking', percent: base },
            { label: 'Reading', percent: Math.min(100, base + 5) },
            { label: 'Writing', percent: Math.max(30, base - 5) },
          ],
        };
      });
    }

    return [
      {
        name: 'ENGLISH',
        meters: [
          { label: 'Speaking', percent: 88 },
          { label: 'Reading', percent: 80 },
          { label: 'Writing', percent: 82 },
        ],
      },
      {
        name: 'CHINESE',
        meters: [
          { label: 'Speaking', percent: 70 },
          { label: 'Reading', percent: 65 },
          { label: 'Writing', percent: 70 },
        ],
      },
    ];
  }

  get resolvedTraits(): string[] {
    if (this.hobbies && this.hobbies.length) {
      const isPlaceholderHobbies =
        this.hobbies.length === 3 &&
        this.hobbies[0]?.name === 'Reading' &&
        this.hobbies[1]?.name === 'Travel' &&
        this.hobbies[2]?.name === 'Music' &&
        (!this.name || this.name === 'Your Name');

      if (!isPlaceholderHobbies) {
        return this.hobbies.map((h: any) => (typeof h === 'string' ? h : h.name)).filter(Boolean);
      }
    }

    return [
      'Detail-oriented and accurate',
      'Responsible and reliable',
      'Honest and trustworthy',
      'Organized and disciplined',
      'Patient and hardworking',
      'Quick learner and adaptable',
      'Able to maintain confidentiality',
      'Strong sanse of responsibility',
    ];
  }

  get resolvedExtraTraits(): string[] {
    return [
      'Strong Communication Skills.',
      'Time Management – balances multiple reports and deadlines.',
      'Problem-Solving – finds solutions to financial discrepancies.',
    ];
  }

  get resolvedExperience(): Array<{
    title: string;
    company: string;
    period: string;
    bullets: string[];
  }> {
    if (this.experience && this.experience.length) {
      const isGenericExp =
        this.experience.length === 2 &&
        this.experience[0]?.company === 'Company Name' &&
        this.experience[1]?.company === 'Previous Company' &&
        (!this.name || this.name === 'Your Name');

      if (!isGenericExp) {
        return this.experience.map((e: any) => {
          const bullets: string[] = [];
          if (e.description) {
            const lines = e.description
              .split('\n')
              .map((l: string) => l.trim().replace(/^[•\-\*]\s*/, ''))
              .filter(Boolean);
            bullets.push(...lines);
          }
          if (Array.isArray(e.responsibilities)) {
            const lines = e.responsibilities
              .map((r: string) => (r || '').trim().replace(/^[•\-\*]\s*/, ''))
              .filter(Boolean);
            bullets.push(...lines);
          }
          return {
            title: e.position || e.jobTitle || 'Position',
            company: e.company || '',
            period:
              e.duration ||
              (e.startDate
                ? `${e.startDate} - ${e.current ? 'Present' : e.endDate || ''}`
                : `${e.startYear || ''} - ${e.current ? 'Present' : e.endYear || ''}`),
            bullets: bullets.length ? bullets : ['Carried out assigned responsibilities with accuracy and professionalism.'],
          };
        });
      }
    }

    return [
      {
        title: 'ACCOUNTING & ADMINISTRATIVE INTERN',
        company: 'iKEY International Institute',
        period: '',
        bullets: [
          'Assisted with the preparation of financial statements, including Profit & Loss, Balance Sheet, and Cash Flow reports.',
          'Supported monthly expense tracking, financial documentation, and record organization.',
          'Assisted with Chart of Accounts analysis and Owner\'s Equity reporting.',
          'Prepared business documents and supported administrative operations.',
          'Developed practical knowledge of accounting procedures and financial reporting.',
        ],
      },
      {
        title: 'CUSTOMER SERVICE STAFF',
        company: 'Hyundai Packaging II Co., Ltd.',
        period: '',
        bullets: [
          'Coordinated with production and other departments to support customer orders.',
          'Maintained organized customer information, order records, and supporting documents.',
          'Followed up on customer orders and delivery arrangements.',
          'Assisted in resolving customer concerns professionally and efficiently.',
          'Developed strong communication, coordination, documentation, and problem-solving skills.',
        ],
      },
      {
        title: 'CASHIER & SHOP ASSISTANT',
        company: 'Mak Sor Café',
        period: '',
        bullets: [
          'Handled daily cash and mobile payment transactions accurately.',
          'Recorded daily sales and organized basic transaction records.',
          'Assisted with monitoring inventory and reporting stock shortages.',
          'Supported daily shop operations and customer service.',
          'Developed strong time-management and customer service skills.',
        ],
      },
    ];
  }

  get resolvedEducation(): Array<{ period: string; html: string }> {
    if (this.education && this.education.length) {
      const isGenericEdu =
        this.education.length === 1 &&
        this.education[0]?.degree === "Bachelor's Degree" &&
        this.education[0]?.institution === 'Your University' &&
        (!this.name || this.name === 'Your Name');

      if (!isGenericEdu) {
        return this.education.map((e: any) => {
          const period =
            e.period ||
            (e.startYear
              ? `${e.startYear} - ${e.current ? 'Present' : e.endYear || ''}`
              : (e.startDate ? `${e.startDate} - ${e.current ? 'Present' : e.endDate || ''}` : ''));
          const degree = e.degree ? `<strong>${e.degree}</strong>` : '';
          const field = e.field ? `in ${e.field}` : '';
          const inst = e.institution ? `at ${e.institution}` : '';
          const parts = [degree, field, inst].filter(Boolean).join(' ');
          return {
            period: period.trim() || '2022 - Present',
            html: parts || 'Majoring in Accounting at University.',
          };
        });
      }
    }

    return [
      {
        period: '2025 - Present',
        html: 'Majoring in <strong>Accounting</strong> at Beltei International University,<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Year 3 | Foundation Year GPA: 3.72',
      },
      {
        period: '2022 - 2024',
        html: 'Finished High School at Chompu Vorn High School.',
      },
      {
        period: '2019 - 2022',
        html: 'Finished Secondary School at Trapeang Sala Secondary School.',
      },
    ];
  }

  get resolvedShortCourses(): Array<{ period: string; html: string }> {
    if (this.certifications && this.certifications.length) {
      const isPlaceholderCert =
        this.certifications.length === 1 &&
        this.certifications[0]?.name === 'Certificate Name' &&
        (!this.name || this.name === 'Your Name');

      if (!isPlaceholderCert) {
        return this.certifications.map((c: any) => {
          const date = c.date || c.year || '2025';
          const name = c.name ? `Finished <strong>${c.name}</strong>` : '';
          const issuer = c.issuer ? `at ${c.issuer}` : '';
          const parts = [name, issuer].filter(Boolean).join(' ');
          return {
            period: date,
            html: parts || 'Finished Course',
          };
        });
      }
    }

    return [];
  }

  get hasProjectsOrAchievements(): boolean {
    if (this.projects && this.projects.length) return true;
    if (this.skills && this.skills.length && !this.isGenericSkills()) return false;
    return true;
  }

  get resolvedProjects(): string[] {
    if (this.projects && this.projects.length) {
      return this.projects.map((p: any) => {
        if (typeof p === 'string') return p;
        return `${p.title || p.name || 'Project'}${p.description ? ' - ' + p.description : ''}`;
      });
    }

    return [
      'Co-founded and led PRUKSA, a career guidance platform for Cambodian students.',
      'Led data collection, customer validation, documentation, and outreach activities.',
      '1st Place – AI Hackathon, First Wave.',
      '2nd Place – UniPreneur Camp, Cluster 4.',
    ];
  }

  get resolvedOtherAchievements(): string[] {
    return [
      'Participant – Youth 21 Program 2026, a youth digital entrepreneurship and innovation program.',
      '2nd Place – Public Speaking Contest, Represent BELTEI International University.',
      'Three-Time Champion – Public Speaking Competition.',
      '1st Place – Academic Excellence Award, Levels 5-9.',
      'Participant – Model Parliament Program, National Assembly.',
    ];
  }

  private isGenericSkills(): boolean {
    if (!this.skills || !this.skills.length) return true;
    if (
      this.skills.length === 4 &&
      this.skills[0]?.name === 'Communication' &&
      this.skills[1]?.name === 'Teamwork' &&
      this.skills[2]?.name === 'Problem Solving' &&
      this.skills[3]?.name === 'Time Management' &&
      (!this.name || this.name === 'Your Name')
    ) {
      return true;
    }
    return false;
  }

  get resolvedQualificationsCol1(): string[] {
    if (this.skills && this.skills.length && !this.isGenericSkills()) {
      const half = Math.ceil(this.skills.length / 2);
      return this.skills.slice(0, half).map((s: any) => (typeof s === 'string' ? s : s.name)).filter(Boolean);
    }

    return [
      'QuickBooks Accounting',
      'Contemporary Management',
      'Accounting for Marketing',
      'Psychology',
      'Principles of Accounting I',
      'Principles of Accounting II',
      'English for Business',
      'Business Writing Skills',
    ];
  }

  get resolvedQualificationsCol2(): string[] {
    if (this.skills && this.skills.length && !this.isGenericSkills()) {
      const half = Math.ceil(this.skills.length / 2);
      return this.skills.slice(half).map((s: any) => (typeof s === 'string' ? s : s.name)).filter(Boolean);
    }

    return [
      'Business Strategy',
      'Principles of Economics',
      'Marketing Services',
      'Business Start-Ups',
      'Soft Skills',
      'Fundamental Math for Business',
      'Consumer Behavior',
      'Microeconomics',
    ];
  }

  get resolvedReferences(): Array<{
    name: string;
    position: string;
    email?: string;
    phone?: string;
  }> {
    if (this.references && this.references.length) {
      const isPlaceholderRef =
        this.references.length === 1 &&
        this.references[0]?.name === 'Reference Full Name' &&
        (!this.name || this.name === 'Your Name');

      if (!isPlaceholderRef) {
        return this.references.map((r: any) => ({
          name: r.name || 'Reference Person',
          position: r.position || r.title || 'Professional Reference',
          email: r.email || '',
          phone: r.phone || '',
        }));
      }
    }

    return [
      {
        name: 'Mr. OM DINA',
        position: 'Lecturer at Beltei International University',
        phone: '096 207 2076 / 012 99 63 97',
      },
      {
        name: 'Mr. Chey Khimthy',
        position: 'Lecturer, BELTEI International University',
        phone: '096 612 1951',
      },
      {
        name: 'Mr. Sok Savuth',
        position: 'Lecturer, BELTEI International University',
        phone: '066 834 169',
      },
    ];
  }
}
