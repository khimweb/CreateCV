import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CvEducation { institution?: string; degree?: string; field?: string; startYear?: string; endYear?: string; current?: boolean; gpa?: string; description?: string; }
export interface CvExperience { company?: string; position?: string; startDate?: string; endDate?: string; current?: boolean; responsibilities?: string[]; }
export interface CvSkill { name?: string; level?: string; }
export interface CvLanguage { name?: string; proficiency?: string; }
export interface CvReference { name?: string; position?: string; company?: string; phone?: string; email?: string; }

@Component({
  selector: 'app-classic-dark-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cv" [style.--accent]="accent" [style.--fs.px]="fontSize" [style.--fw]="fontWeight" [style.--lh]="lineHeight" [style.--font]="fontFamily">
      <!-- LEFT COLUMN -->
      <div class="left">
        <!-- Photo above the card -->
        <div class="photo-frame">
          @if (photoUrl) { <img [src]="photoUrl" alt="" /> }
          @else { <span class="ph-i">{{ initials }}</span> }
        </div>
        <!-- Dark rounded card -->
        <div class="card">
          <!-- Contact -->
          <div class="sec">
            <div class="white-pill">CONTACT</div>
            <div class="ct-list">
              @if (phone) { <div class="ct-item"><div class="ct-circle"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6.57-6.57A19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div><span>{{ phone }}</span></div> }
              @if (email) { <div class="ct-item"><div class="ct-circle"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div><span>{{ email }}</span></div> }
              @if (location) { <div class="ct-item"><div class="ct-circle"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div><span>{{ location }}</span></div> }
            </div>
          </div>
          <!-- Education -->
          @if (education.length) {
          <div class="sec">
            <div class="white-pill">EDUCATION</div>
            @for (ed of education; track $index) {
              <div class="edu-block">
                <div class="edu-deg">{{ degreeLine(ed) }}</div>
                @if (ed.institution) { <div class="edu-inst">{{ ed.institution }}</div> }
                <div class="edu-date">{{ formatRange(ed.startYear, ed.endYear, ed.current) }}{{ ed.gpa ? ' | GPA: ' + ed.gpa : '' }}</div>
              </div>
            }
          </div>
          }
          <!-- Language -->
          @if (languages.length) {
          <div class="sec">
            <div class="white-pill">LANGUAGE</div>
            @for (lang of languages; track $index) {
              @if (lang.name) {
              <div class="lang-row">
                <span>{{ lang.name }}</span>
                <div class="lang-track"><div class="lang-fill" [style.width]="langPct(lang.proficiency)"></div></div>
              </div>
              }
            }
          </div>
          }
          <!-- Reference -->
          @if (references.length) {
          <div class="sec">
            <div class="white-pill">REFERENCE</div>
            @for (ref of references; track $index) {
              @if (ref.name) {
              <div class="ref-block">
                <div class="ref-name">{{ ref.name }}</div>
                @if (ref.company || ref.position) { <div class="ref-role">{{ refRole(ref) }}</div> }
                @if (ref.phone) { <div class="ref-phone">{{ ref.phone }}</div> }
              </div>
              }
            }
          </div>
          }
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="right">
        <div class="name-block">
          <h1>{{ firstName }}<br/>{{ lastName }}</h1>
          @if (jobTitle) { <p class="job">{{ jobTitle }}</p> }
        </div>
        <!-- About Me -->
        @if (summary) {
        <div class="r-sec">
          <div class="dark-pill">ABOUT ME</div>
          <p class="about">{{ summary }}</p>
        </div>
        }
        <!-- Experience -->
        @if (experience.length) {
        <div class="r-sec">
          <div class="dark-pill">EXPERIENCE</div>
          <div class="timeline">
            @for (job of experience; track $index) {
            <div class="tl-item">
              <div class="tl-date">{{ formatExpRange(job) }}</div>
              @if (job.company) { <div class="tl-co">{{ job.company }}</div> }
              <div class="tl-role">{{ job.position || 'Position' }}</div>
              @if (job.responsibilities?.length) {
                <ul class="tl-ul">@for (r of job.responsibilities; track $index) { @if (r) { <li>{{ r }}</li> } }</ul>
              }
            </div>
            }
          </div>
        </div>
        }
        <!-- Skill -->
        @if (skills.length) {
        <div class="r-sec">
          <div class="dark-pill">SKILL</div>
          <div class="sk-list">
            @for (sk of skills; track $index) {
              @if (sk.name) {
              <div class="sk-row">
                <span class="sk-name">{{ sk.name }}</span>
                <span class="sk-dots">@for (d of [1,2,3,4,5]; track d) { <span class="dot" [class.on]="d <= skillLevel(sk.level)"></span> }</span>
              </div>
              }
            }
          </div>
        </div>
        }
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }
    .cv {
      --accent: #5d6778; --fs: 10px; --fw: 400; --lh: 1.5; --font: 'Segoe UI', Arial, sans-serif;
      width: 210mm; min-height: 297mm; box-sizing: border-box;
      font-family: var(--font); font-size: var(--fs); font-weight: var(--fw); line-height: var(--lh);
      background: #fff; color: #222;
      display: flex; gap: 28px; padding: 32px 28px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.12);
    }

    /* ═══ LEFT ═══ */
    .left { width: 38%; display: flex; flex-direction: column; gap: 14px; }
    .photo-frame {
      width: 150px; height: 150px; border-radius: 50%; overflow: hidden;
      margin: 0 auto; border: 1px solid #ddd; background: #e5e7eb;
      display: flex; align-items: center; justify-content: center;
    }
    .photo-frame img { width: 100%; height: 100%; object-fit: cover; }
    .ph-i { font-size: calc(var(--fs) * 4); font-weight: 700; color: #5d6778; }

    /* Dark card */
    .card {
      background: var(--accent); border-radius: 20px; padding: 26px 18px;
      color: #fff; display: flex; flex-direction: column; gap: 22px; flex: 1;
    }
    .sec {}

    /* White pill heading (sidebar) */
    .white-pill {
      background: #fff; color: var(--accent);
      font-size: calc(var(--fs) * 1.15); font-weight: 700;
      text-transform: uppercase; letter-spacing: 1.5px; text-align: center;
      padding: 5px 0; border-radius: 999px; margin-bottom: 12px;
    }

    /* Contact */
    .ct-list { display: flex; flex-direction: column; gap: 10px; }
    .ct-item { display: flex; align-items: center; gap: 10px; font-size: calc(var(--fs) * 0.95); color: #e2e8f0; }
    .ct-circle {
      width: 24px; height: 24px; border-radius: 50%;
      border: 1.5px solid #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .ct-circle svg { width: 11px; height: 11px; stroke: #fff; fill: none; stroke-width: 2; }

    /* Education */
    .edu-block { margin-bottom: 10px; }
    .edu-deg { font-weight: 600; font-size: calc(var(--fs) * 1); }
    .edu-inst { font-size: calc(var(--fs) * 0.9); color: #cbd5e1; font-style: italic; }
    .edu-date { font-size: calc(var(--fs) * 0.85); color: #94a3b8; margin-top: 3px; }

    /* Language */
    .lang-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 9px; font-size: calc(var(--fs) * 0.95); }
    .lang-track { width: 55%; height: 5px; background: #717d91; border-radius: 3px; overflow: hidden; }
    .lang-fill { height: 100%; background: #fff; border-radius: 3px; }

    /* Reference */
    .ref-block { margin-bottom: 10px; font-size: calc(var(--fs) * 0.95); }
    .ref-name { font-weight: 600; }
    .ref-role { font-size: calc(var(--fs) * 0.88); color: #cbd5e1; }
    .ref-phone { font-size: calc(var(--fs) * 0.88); color: #e2e8f0; }

    /* ═══ RIGHT ═══ */
    .right { width: 62%; display: flex; flex-direction: column; }
    .name-block { margin: 16px 0 26px; }
    .name-block h1 {
      font-size: calc(var(--fs) * 3.6); font-weight: 800; color: #1e293b;
      line-height: 1.08; text-transform: uppercase; letter-spacing: 1px; margin: 0;
    }
    .job {
      font-size: calc(var(--fs) * 1.2); font-weight: 600; color: #475569;
      letter-spacing: 2.5px; text-transform: uppercase; margin-top: 10px;
    }

    /* Right sections */
    .r-sec { margin-bottom: 22px; }

    /* Dark pill heading (right side) */
    .dark-pill {
      display: inline-block; background: var(--accent); color: #fff;
      font-size: calc(var(--fs) * 1.05); font-weight: 700;
      text-transform: uppercase; letter-spacing: 1.5px; text-align: center;
      padding: 5px 22px; border-radius: 999px; margin-bottom: 12px;
    }

    /* About */
    .about { font-size: calc(var(--fs) * 1); color: #475569; text-align: justify; margin: 0; }

    /* Experience timeline */
    .timeline {
      border-left: 1.5px solid #1e293b; padding-left: 14px; margin-left: 4px;
      display: flex; flex-direction: column; gap: 18px;
    }
    .tl-item { position: relative; }
    .tl-item::before {
      content: ''; position: absolute; left: -19px; top: 4px;
      width: 8px; height: 8px; background: #1e293b; border-radius: 50%;
    }
    .tl-date { font-size: calc(var(--fs) * 0.95); color: #64748b; font-weight: 500; }
    .tl-co { font-size: calc(var(--fs) * 0.95); color: #334155; font-weight: 600; }
    .tl-role { font-size: calc(var(--fs) * 1.1); font-weight: 700; color: #0f172a; margin: 2px 0 5px; }
    .tl-ul { padding-left: 14px; margin: 4px 0 0; list-style-type: disc; }
    .tl-ul li { font-size: calc(var(--fs) * 0.9); color: #475569; line-height: 1.5; margin-bottom: 3px; text-align: justify; }

    /* Skills */
    .sk-list { display: flex; flex-direction: column; gap: 8px; }
    .sk-row { display: flex; justify-content: space-between; align-items: center; width: 90%; }
    .sk-name { font-size: calc(var(--fs) * 0.95); color: #334155; font-weight: 500; }
    .sk-dots { display: flex; gap: 5px; }
    .dot { width: 11px; height: 11px; border-radius: 50%; background: #cbd5e1; }
    .dot.on { background: var(--accent); }

    /* ═══ PRINT ═══ */
    @media print {
      :host { display: block; }
      .cv { width: 100% !important; min-height: 0 !important; box-shadow: none !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; color-adjust: exact; }
      .r-sec, .tl-item { break-inside: avoid; page-break-inside: avoid; }
      @page { size: A4 portrait; margin: 0; }
    }
  `],
})
export class ClassicDarkCvComponent {
  @Input() accent = '#5d6778';
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
  @Input() references: CvReference[] = [];
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.5;
  @Input() fontFamily = "'Segoe UI', Arial, sans-serif";

  get firstName(): string { const p = (this.name || 'RUFUS STEWART').trim().split(/\s+/); return p.length > 1 ? p.slice(0, -1).join(' ') : p[0]; }
  get lastName(): string { const p = (this.name || 'RUFUS STEWART').trim().split(/\s+/); return p.length > 1 ? p[p.length - 1] : ''; }
  get initials(): string { return (this.name || 'RS').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join(''); }
  degreeLine(ed: CvEducation): string { return [ed.degree, ed.field].filter(Boolean).join(' in ') || 'Degree'; }
  formatRange(start?: string, end?: string, current?: boolean): string { const s = start || '', e = current ? 'Present' : (end || ''); if (s && e) return `${s} - ${e}`; return s || e || ''; }
  formatExpRange(job: CvExperience): string { const s = job.startDate || '', e = job.current ? 'Present' : (job.endDate || ''); if (s && e) return `${s} - ${e}`; return s || e || ''; }
  refRole(ref: CvReference): string { return [ref.company, ref.position].filter(v => !!v).join(' / '); }
  langPct(p?: string): string { const m: Record<string, string> = { Beginner: '20%', Basic: '30%', Elementary: '30%', Intermediate: '55%', Conversational: '45%', Advanced: '75%', Fluent: '90%', Native: '100%' }; return m[p || ''] ?? '55%'; }
  skillLevel(level?: string): number { const m: Record<string, number> = { Beginner: 1, Basic: 2, Intermediate: 3, Advanced: 4, Expert: 5 }; return m[level || ''] ?? 3; }
}
