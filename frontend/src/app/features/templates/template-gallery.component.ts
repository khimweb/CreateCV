import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Search } from 'lucide-angular';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';
import { ModernSplitCvComponent } from '../../shared/components/modern-split-cv/modern-split-cv.component';
import { CleanSidebarCvComponent } from '../../shared/components/clean-sidebar-cv/clean-sidebar-cv.component';
import { ElegantFrameCvComponent } from '../../shared/components/elegant-frame-cv/elegant-frame-cv.component';
import { ClassicDarkCvComponent } from '../../shared/components/classic-dark-cv/classic-dark-cv.component';
import { FormalClassicCvComponent } from '../../shared/components/formal-classic-cv/formal-classic-cv.component';
import { CoverLetterCvComponent } from '../../shared/components/cover-letter-cv/cover-letter-cv.component';
import { WarmTaupeTimelineCvComponent } from '../../shared/components/warm-taupe-timeline-cv/warm-taupe-timeline-cv.component';
import { SlateRoundedPanelsCvComponent } from '../../shared/components/slate-rounded-panels-cv/slate-rounded-panels-cv.component';
import { NavySidebarProfileCvComponent } from '../../shared/components/navy-sidebar-profile-cv/navy-sidebar-profile-cv.component';
import { GraphiteBannerTimelineCvComponent } from '../../shared/components/graphite-banner-timeline-cv/graphite-banner-timeline-cv.component';
import { A4FitDirective } from '../../shared/directives/a4-fit.directive';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DEMO_CV } from '../../shared/demo-cv-data';

interface CvTemplate {
  id: string;
  name: string;
  category: string;
  accent: string;
  colors: string[];
  hasPhoto: boolean;
  description?: string;
  layout: 'professional' | 'modern-split' | 'clean-sidebar' | 'elegant-frame' | 'classic-dark' | 'formal-classic' | 'cover-letter' | 'warm-taupe-timeline' | 'slate-rounded-panels' | 'navy-sidebar-profile' | 'graphite-banner-timeline';
}

@Component({
  selector: 'app-template-gallery',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProfessionalCvComponent, ModernSplitCvComponent, CleanSidebarCvComponent, ElegantFrameCvComponent, ClassicDarkCvComponent, FormalClassicCvComponent, CoverLetterCvComponent, WarmTaupeTimelineCvComponent, SlateRoundedPanelsCvComponent, NavySidebarProfileCvComponent, GraphiteBannerTimelineCvComponent, A4FitDirective],
  template: `
    <section class="max-w-6xl mx-auto px-4 pt-28 pb-14 text-slate-900 dark:text-sky-50">
      <header class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Choose Your Perfect Template</h1>
        <p class="mt-1.5 text-sm sm:text-base text-slate-500 dark:text-sky-200 max-w-xl">
          Real A4 layouts — pick a color, then use the template.
        </p>
      </header>

      <div class="flex flex-wrap gap-2 items-center">
        <label
          class="flex items-center gap-2 w-full sm:w-72 px-3 py-2 rounded-full border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 shadow-sm"
        >
          <lucide-icon [img]="Search" class="w-4 h-4 text-slate-400 shrink-0" />
          <input
            class="w-full outline-none bg-transparent text-sm"
            placeholder="Search templates..."
            (input)="search.set($any($event.target).value)"
          />
        </label>
        <button type="button" class="chip" (click)="photoFilter.set('all')" [class.active]="photoFilter() === 'all'">
          All
        </button>
        <button type="button" class="chip" (click)="photoFilter.set('photo')" [class.active]="photoFilter() === 'photo'">
          With Photo
        </button>
        <button type="button" class="chip" (click)="photoFilter.set('none')" [class.active]="photoFilter() === 'none'">
          No Photo
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-2 border-b border-slate-200/80 dark:border-slate-700 pb-4">
        @for (item of categories; track item) {
          <button type="button" class="chip" (click)="category.set(item)" [class.active]="category() === item">
            {{ item }}
          </button>
        }
        <span class="ml-auto self-center text-xs text-slate-500">
          <b class="text-slate-800 dark:text-white">{{ filtered().length }}</b> layouts
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        @for (t of filtered(); track t.id) {
          <article class="group">
            <!-- Fixed A4 card: aspect ratio locks the CV frame -->
            <div appA4Fit class="cv-card group-hover:shadow-xl group-hover:-translate-y-0.5" (click)="select(t)" role="button" tabindex="0" (keydown.enter)="select(t)" [attr.aria-label]="'Open full preview of ' + t.name">
              <div class="cv-thumb pointer-events-none" aria-hidden="true">
                @if (t.layout === 'modern-split') {
                  <app-modern-split-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name"
                    [jobTitle]="demo.jobTitle"
                    [email]="demo.email"
                    [phone]="demo.phone"
                    [location]="demo.location"
                    [summary]="demo.summary"
                    [photoUrl]="demo.photoUrl"
                    [experience]="demo.experience"
                    [education]="demo.education"
                    [skills]="demo.skills"
                    [languages]="demo.languages"
                    [references]="demo.references"
                    [hobbies]="demo.hobbies"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'clean-sidebar') {
                  <app-clean-sidebar-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name"
                    [jobTitle]="demo.jobTitle"
                    [email]="demo.email"
                    [phone]="demo.phone"
                    [location]="demo.location"
                    [summary]="demo.summary"
                    [photoUrl]="demo.photoUrl"
                    [experience]="demo.experience"
                    [education]="demo.education"
                    [skills]="demo.skills"
                    [languages]="demo.languages"
                    [references]="demo.references"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'elegant-frame') {
                  <app-elegant-frame-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name"
                    [jobTitle]="demo.jobTitle"
                    [email]="demo.email"
                    [phone]="demo.phone"
                    [location]="demo.location"
                    [linkedin]="demo.linkedin"
                    [summary]="demo.summary"
                    [photoUrl]="demo.photoUrl"
                    [experience]="demo.experience"
                    [education]="demo.education"
                    [skills]="demo.skills"
                    [languages]="demo.languages"
                    [certifications]="demo.certifications"
                    [hobbies]="demo.hobbies"
                    [references]="demo.references"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'classic-dark') {
                  <app-classic-dark-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name"
                    [jobTitle]="demo.jobTitle"
                    [email]="demo.email"
                    [phone]="demo.phone"
                    [location]="demo.location"
                    [linkedin]="demo.linkedin"
                    [summary]="demo.summary"
                    [photoUrl]="demo.photoUrl"
                    [experience]="demo.experience"
                    [education]="demo.education"
                    [skills]="demo.skills"
                    [languages]="demo.languages"
                    [references]="demo.references"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'formal-classic') {
                  <app-formal-classic-cv
                    [name]="demo.name"
                    [jobTitle]="demo.jobTitle"
                    [email]="demo.email"
                    [phone]="demo.phone"
                    [location]="demo.location"
                    [linkedin]="demo.linkedin"
                    [summary]="demo.summary"
                    [photoUrl]="demo.photoUrl"
                    [experience]="demo.experience"
                    [education]="demo.education"
                    [skills]="demo.skills"
                    [languages]="demo.languages"
                    [references]="demo.references"
                    [projects]="demo.projects"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'graphite-banner-timeline') {
                  <app-graphite-banner-timeline-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl"
                    [education]="demo.education" [experience]="demo.experience" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies"
                    [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5"
                  />
                } @else if (t.layout === 'navy-sidebar-profile') {
                  <app-navy-sidebar-profile-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl"
                    [education]="demo.education" [experience]="demo.experience" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies"
                    [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5"
                  />
                } @else if (t.layout === 'slate-rounded-panels') {
                  <app-slate-rounded-panels-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl"
                    [education]="demo.education" [experience]="demo.experience" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies"
                    [fontSize]="9" [fontWeight]="400" [lineHeight]="1.45"
                  />
                } @else if (t.layout === 'warm-taupe-timeline') {
                  <app-warm-taupe-timeline-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl"
                    [education]="demo.education" [experience]="demo.experience" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies"
                    [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'cover-letter') {
                  <app-cover-letter-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name"
                    [phone]="demo.phone"
                    [email]="demo.email"
                    [location]="demo.location"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.5"
                  />
                } @else {
                  <app-professional-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name"
                    [jobTitle]="demo.jobTitle"
                    [email]="demo.email"
                    [phone]="demo.phone"
                    [location]="demo.location"
                    [linkedin]="demo.linkedin"
                    [summary]="demo.summary"
                    [photoUrl]="demo.photoUrl"
                    [experience]="demo.experience"
                    [education]="demo.education"
                    [skills]="demo.skills"
                    [languages]="demo.languages"
                    [certifications]="demo.certifications"
                    [projects]="demo.projects"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                    [sectionLines]="true"
                  />
                }
              </div>

              <div class="cv-card-overlay">
                <button type="button" class="cta" (click)="select(t)">Use template</button>
              </div>

              <span class="absolute bottom-3 left-3 tag z-10">{{ t.category }}</span>
            </div>

            <div class="mt-3 px-0.5">
              <h2 class="text-base font-semibold text-slate-800 dark:text-sky-50 truncate">{{ t.name }}</h2>
              <div class="flex items-center gap-2 mt-2">
                @for (c of t.colors; track c) {
                  <button
                    type="button"
                    class="swatch"
                    [style.background]="c"
                    [class.selected]="accentFor(t) === c"
                    title="Use this color"
                    (click)="setColor(t, c, $event)"
                  ></button>
                }
                <span class="text-xs text-slate-400">{{ t.colors.length }} colors</span>
              </div>
            </div>
          </article>
        }
      </div>

      @if (filtered().length === 0) {
        <p class="mt-12 text-center text-slate-500 text-sm">No templates match your filters.</p>
      }
    </section>
  `,
  styles: [
    `
      .chip {
        padding: 0.4rem 0.9rem;
        border-radius: 9999px;
        background: #fff;
        border: 1px solid #e2e8f0;
        font-weight: 600;
        font-size: 0.8rem;
        color: #475569;
        transition: 0.2s ease;
      }
      .chip:hover,
      .chip.active {
        background: #062b50;
        color: #fff;
        border-color: #062b50;
        box-shadow: 0 4px 12px #062b5030;
      }
      .tag {
        background: #173a61;
        color: #fff;
        border-radius: 9999px;
        padding: 0.3rem 0.7rem;
        text-transform: uppercase;
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.04em;
      }
      .swatch {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid #fff;
        box-shadow: 0 0 0 1.5px #cbd5e1;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        padding: 0;
        cursor: pointer;
      }
      .swatch:hover {
        transform: scale(1.15);
      }
      .swatch.selected {
        box-shadow: 0 0 0 2px #062b50;
        transform: scale(1.12);
      }
      .cta {
        padding: 0.65rem 1.25rem;
        border-radius: 9999px;
        background: #0369a1 !important;
        color: #fff !important;
        border: none !important;
        font-weight: 700;
        font-size: 0.875rem;
        box-shadow: 0 8px 24px #0369a155;
      }
      .cta:hover {
        background: #0284c7 !important;
      }
      .cv-card {
        position: relative;
        width: 100%;
        aspect-ratio: 210 / 297;
        overflow: hidden;
        border-radius: 1.25rem;
        border: 1px solid #e2e8f0;
        background: #fff;
        box-shadow: 0 4px 24px rgb(15 23 42 / 0.10);
        transition: box-shadow 0.3s ease, transform 0.3s ease;
        container-type: size;
      }
      .cv-thumb {
        position: absolute;
        top: 0;
        left: 0;
        width: 210mm;
        height: 297mm;
        overflow: hidden;
        transform-origin: top left;
        /* --a4-scale is measured by appA4Fit so the whole A4 page fits. */
        transform: scale(var(--a4-scale, 0.264));
      }
      .cv-card-overlay {
        position: absolute;
        inset: 0;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(15 23 42 / 0.4);
        backdrop-filter: blur(2px);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .group:hover .cv-card-overlay {
        opacity: 1;
      }
      :host-context(.dark) .chip {
        background: #0f172a;
        border-color: #334155;
        color: #94a3b8;
      }
      :host-context(.dark) .chip.active,
      :host-context(.dark) .chip:hover {
        background: #0369a1;
        border-color: #0369a1;
        color: #fff;
      }

      /* Compact gallery cards still keep the complete A4 layout visible. */
      :host {
        display: block;
        min-height: 100vh;
        background: radial-gradient(circle at 84% 8%, #e7e3ff 0, transparent 26rem), linear-gradient(145deg, #fbfcff, #f2f4ff);
        font-family: Manrope, Inter, system-ui, sans-serif;
      }
      :host > section {
        max-width: 1280px !important;
        padding: 116px 24px 84px !important;
      }
      :host header {
        max-width: 700px;
        margin: 0 auto 2rem;
        text-align: center;
      }
      :host header h1 {
        color: #1c2540;
        font-size: clamp(2rem, 4vw, 3.45rem);
        line-height: 1.08;
        letter-spacing: -0.055em;
      }
      :host header p {
        margin: 0.8rem auto 0;
        color: #707a91;
        line-height: 1.65;
      }
      :host label {
        min-height: 48px;
        border-radius: 15px !important;
        border-color: #e0e3f0 !important;
        box-shadow: 0 8px 20px #263a6910;
      }
      :host > section > div:nth-of-type(2) {
        padding-top: 1rem;
        border-color: #e1e5f0 !important;
      }
      :host > section > div:nth-of-type(3) {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(210px, 260px)) !important;
        justify-content: center;
        gap: 20px !important;
        margin-top: 28px !important;
      }
      .chip {
        border-color: #dfe2ee;
        color: #5e687c;
        background: #ffffffc9;
      }
      .chip:hover,
      .chip.active {
        background: #5d46d4;
        border-color: #5d46d4;
        box-shadow: 0 7px 17px #5d46d42e;
      }
      .group {
        min-width: 0;
        padding: 9px 9px 12px;
        border: 1px solid #e5e7f0;
        border-radius: 20px;
        background: #fff;
        box-shadow: 0 13px 30px #2d3d6612;
        transition: transform .24s cubic-bezier(.32,.72,0,1), box-shadow .24s;
      }
      .group:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 42px #2d3d6620;
      }
      .cv-card {
        border-radius: 13px;
        border-color: #e2e5ee;
        box-shadow: 0 5px 16px #1e293b12;
      }
      .cv-card-overlay {
        inset: auto 9px 9px auto;
        justify-content: flex-end;
        align-items: flex-end;
        background: transparent;
        backdrop-filter: none;
        opacity: 1;
        pointer-events: none;
      }
      .cta {
        pointer-events: auto;
        padding: 0.5rem 0.72rem;
        border-radius: 10px;
        background: #ffffffeb !important;
        color: #5140bb !important;
        border: 1px solid #dedaf7 !important;
        box-shadow: 0 5px 14px #17255426;
        font-size: 0.69rem;
      }
      .cta:hover {
        background: #5d46d4 !important;
        border-color: #5d46d4 !important;
        color: #fff !important;
      }
      .group > div:last-child {
        margin: 0 !important;
        padding: 13px 3px 0;
      }
      .group h2 {
        color: #252d43;
        font-size: 0.86rem;
        letter-spacing: -0.02em;
      }
      .swatch {
        width: 16px;
        height: 16px;
      }
      @media (max-width: 700px) {
        :host > section { padding: 88px 16px 72px !important; }
        :host header { margin-bottom: 1.45rem; }
        :host header h1 { font-size: 2rem; }
        :host > section > div:nth-of-type(3) {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 12px !important;
          margin-top: 20px !important;
        }
        .group { padding: 6px 6px 9px; border-radius: 15px; }
        .cv-card { border-radius: 10px; }
        .cta { padding: 0.4rem 0.5rem; font-size: 0.6rem; }
        .group > div:last-child { padding: 9px 2px 0; }
        .group h2 { font-size: 0.72rem; }
        .swatch { width: 13px; height: 13px; }
      }
      @media (max-width: 350px) {
        :host > section > div:nth-of-type(3) { grid-template-columns: minmax(0, 250px) !important; }
      }
      /* Large, complete A4 previews: never crop the CV behind an action overlay. */
      :host > section > div:nth-of-type(3) {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        justify-content: stretch;
        gap: 26px !important;
        margin-top: 30px !important;
      }
      .group {
        padding: 10px 10px 15px;
        border-radius: 22px;
      }
      .cv-card {
        border-radius: 14px;
        cursor: pointer;
        box-shadow: 0 10px 28px #1e293b16;
      }
      .cv-card:focus-visible {
        outline: 3px solid #765fe3;
        outline-offset: 4px;
      }
      .cv-card-overlay { display: none; }
      .group > div:last-child { padding: 15px 5px 1px; }
      .group h2 { font-size: .94rem; }
      @media (max-width: 1080px) {
        :host > section > div:nth-of-type(3) {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 22px !important;
        }
      }
      @media (max-width: 640px) {
        :host > section { padding-left: 18px !important; padding-right: 18px !important; }
        :host > section > div:nth-of-type(3) {
          grid-template-columns: minmax(0, 1fr) !important;
          gap: 20px !important;
        }
        .group { max-width: 430px; width: 100%; margin: 0 auto; padding: 8px 8px 13px; }
        .group h2 { font-size: .9rem; }
        .swatch { width: 16px; height: 16px; }
      }
      @media (prefers-reduced-motion: reduce) {
        .group, .chip, .cv-card { transition: none !important; }
      }
    `,
  ],
})
export class TemplateGalleryComponent implements OnInit {
  readonly Search = Search;
  readonly demo = DEMO_CV;

  categories = ['All Templates', 'Modern', 'Minimal', 'Professional', 'Creative', 'Classic'];
  search = signal('');
  category = signal('All Templates');
  photoFilter = signal<'all' | 'photo' | 'none'>('all');
  templates = signal<CvTemplate[]>([]);
  /** Per-template selected accent */
  colorPick = signal<Record<string, string>>({});

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    return this.templates().filter(
      (t) =>
        (!q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)) &&
        (this.category() === 'All Templates' || t.category === this.category()) &&
        (this.photoFilter() === 'all' || (this.photoFilter() === 'photo') === t.hasPhoto),
    );
  });

  constructor(
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.http.get<{ templates: any[] }>('/api/v1/templates').subscribe(({ templates }) => {
      this.templates.set(
        (templates || []).map((t) => {
          let colors: string[] = ['#667B97', '#163E63', '#0284C7', '#334155'];
          try {
            const parsed = typeof t.default_colors === 'string' ? JSON.parse(t.default_colors) : t.default_colors;
            if (Array.isArray(parsed) && parsed.length) colors = parsed;
          } catch {
            /* keep defaults */
          }
          const name = (t.name as string).toLowerCase();
          const layout = name.includes('graphite')
            ? 'graphite-banner-timeline'
            : name.includes('navy sidebar')
            ? 'navy-sidebar-profile'
            : name.includes('slate rounded')
            ? 'slate-rounded-panels'
            : name.includes('warm taupe')
            ? 'warm-taupe-timeline'
            : name.includes('cover')
            ? 'cover-letter'
            : name.includes('formal')
            ? 'formal-classic'
            : name.includes('classic')
            ? 'classic-dark'
            : name.includes('elegant')
              ? 'elegant-frame'
              : name.includes('clean')
                ? 'clean-sidebar'
                : name.includes('modern')
                  ? 'modern-split'
                  : 'professional';
          return {
            id: String(t.id),
            name: t.name,
            category: t.category || 'Professional',
            accent: colors[0],
            colors,
            hasPhoto: true,
            description: t.description,
            layout: layout as CvTemplate['layout'],
          };
        }),
      );
    });
  }

  accentFor(t: CvTemplate): string {
    return this.colorPick()[t.id] || t.accent;
  }

  setColor(t: CvTemplate, color: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.colorPick.update((m) => ({ ...m, [t.id]: color }));
  }

  select(t: CvTemplate) {
    const color = encodeURIComponent(this.accentFor(t));
    const url = `/templates/preview/${t.id}?color=${color}`;
    if (this.auth.requireLoginOrRedirect(url)) {
      this.router.navigate(['/templates/preview', t.id], {
        queryParams: { color: this.accentFor(t) },
      });
    }
  }
}
