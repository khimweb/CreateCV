import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Star, ArrowLeft } from 'lucide-angular';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';
import { ModernSplitCvComponent } from '../../shared/components/modern-split-cv/modern-split-cv.component';
import { CleanSidebarCvComponent } from '../../shared/components/clean-sidebar-cv/clean-sidebar-cv.component';
import { ElegantFrameCvComponent } from '../../shared/components/elegant-frame-cv/elegant-frame-cv.component';
import { ClassicDarkCvComponent } from '../../shared/components/classic-dark-cv/classic-dark-cv.component';
import { FormalClassicCvComponent } from '../../shared/components/formal-classic-cv/formal-classic-cv.component';
import { CoverLetterCvComponent } from '../../shared/components/cover-letter-cv/cover-letter-cv.component';
import { DEMO_CV } from '../../shared/demo-cv-data';

interface CvTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  defaultColors: string[];
  avgRating: number;
  layout: 'professional' | 'modern-split' | 'clean-sidebar' | 'elegant-frame' | 'classic-dark' | 'formal-classic' | 'cover-letter';
}

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProfessionalCvComponent, ModernSplitCvComponent, CleanSidebarCvComponent, ElegantFrameCvComponent, ClassicDarkCvComponent, FormalClassicCvComponent, CoverLetterCvComponent],
  template: `
    @if (template(); as t) {
      <section class="max-w-6xl mx-auto px-4 pt-28 pb-16">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-700 mb-4 transition"
          (click)="back()"
        >
          <lucide-icon [img]="ArrowLeft" class="w-4 h-4" /> Back to templates
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start">
          <!-- Real layout preview (scaled to fit column) -->
          <div class="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-sky-500/20 shadow-md">
            <div class="h-[min(78vh,820px)] overflow-auto p-4 flex justify-center">
              <div class="origin-top" [style.zoom]="0.72">
                @if (t.layout === 'modern-split') {
                  <app-modern-split-cv
                    [accent]="selectedColor()"
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
                  />
                } @else if (t.layout === 'clean-sidebar') {
                  <app-clean-sidebar-cv
                    [accent]="selectedColor()"
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
                  />
                } @else if (t.layout === 'elegant-frame') {
                  <app-elegant-frame-cv
                    [accent]="selectedColor()"
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
                  />
                } @else if (t.layout === 'classic-dark') {
                  <app-classic-dark-cv
                    [accent]="selectedColor()"
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
                  />
                } @else if (t.layout === 'cover-letter') {
                  <app-cover-letter-cv
                    [accent]="selectedColor()"
                    [name]="demo.name"
                    [phone]="demo.phone"
                    [email]="demo.email"
                    [location]="demo.location"
                  />
                } @else {
                  <app-professional-cv
                    [accent]="selectedColor()"
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
                  />
                }
              </div>
            </div>
          </div>

          <div class="space-y-6 lg:sticky lg:top-28">
            <div>
              <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100">{{ t.name }}</h1>
              <p class="text-sm text-slate-500 dark:text-sky-300 mt-1">
                {{ t.description || 'A polished professional CV layout.' }}
              </p>
            </div>

            <div>
              <p class="text-xs uppercase tracking-wide text-slate-400 dark:text-sky-400 mb-2">Color scheme</p>
              <div class="flex flex-wrap gap-3">
                @for (color of t.defaultColors; track color) {
                  <button
                    type="button"
                    (click)="selectedColor.set(color)"
                    [style.background]="color"
                    class="h-9 w-9 rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95"
                    [class.border-slate-900]="selectedColor() === color"
                    [class.ring-2]="selectedColor() === color"
                    [class.ring-offset-2]="selectedColor() === color"
                    [class.border-white]="selectedColor() !== color"
                    [class.shadow]="true"
                    [attr.aria-label]="'Select color ' + color"
                  ></button>
                }
                <button
                  type="button"
                  (click)="showColorPicker.set(!showColorPicker())"
                  class="h-9 px-3 rounded-full border-2 border-slate-300 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  More colors
                </button>
              </div>

              @if (showColorPicker()) {
                <div class="mt-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-lg">
                  <p class="text-xs font-semibold text-slate-500 mb-3">Pick any color</p>
                  <div class="grid grid-cols-8 gap-2 mb-3">
                    @for (c of moreColors; track c) {
                      <button
                        type="button"
                        (click)="pickColor(c)"
                        [style.background]="c"
                        class="w-7 h-7 rounded-full border-2 transition-all duration-150 hover:scale-125 active:scale-95"
                        [class.border-slate-900]="selectedColor() === c"
                        [class.ring-2]="selectedColor() === c"
                        [class.border-white]="selectedColor() !== c"
                      ></button>
                    }
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="text-xs text-slate-500 font-medium">Custom:</label>
                    <input
                      type="color"
                      [value]="selectedColor()"
                      (input)="pickColor($any($event.target).value)"
                      class="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0"
                    />
                    <span class="text-xs text-slate-400 font-mono">{{ selectedColor() }}</span>
                  </div>
                </div>
              }

              <p class="text-xs text-slate-400 mt-2">Preview updates instantly when you pick a color.</p>
            </div>

            <div>
              <p class="text-xs uppercase tracking-wide text-slate-400 dark:text-sky-400 mb-2">Rate this template</p>
              <div class="flex gap-1">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                  <button type="button" (click)="rate(star)" class="transition hover:scale-110 active:scale-95">
                    <lucide-icon
                      [img]="Star"
                      class="w-6 h-6"
                      [class.fill-amber-500]="star <= (userRating() ?? 0)"
                      [class.text-amber-500]="star <= (userRating() ?? 0)"
                      [class.text-slate-300]="star > (userRating() ?? 0)"
                    />
                  </button>
                }
                <span class="ml-2 text-sm text-slate-500 dark:text-sky-300 self-center">{{ t.avgRating }} avg</span>
              </div>
            </div>

            <button
              type="button"
              (click)="useTemplate(t)"
              class="w-full py-3 rounded-2xl bg-sky-700 dark:bg-sky-600 text-white font-medium shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              Use This Template
            </button>
          </div>
        </div>
      </section>
    }
  `,
})
export class TemplatePreviewComponent implements OnInit {
  readonly Star = Star;
  readonly ArrowLeft = ArrowLeft;
  readonly demo = DEMO_CV;

  template = signal<CvTemplate | null>(null);
  selectedColor = signal<string>('#667B97');
  userRating = signal<number | null>(null);
  showColorPicker = signal(false);

  moreColors = [
    '#1a5f5a', '#0f4c81', '#2c3e50', '#1b3a5c', '#334155', '#0369a1',
    '#7b2d8b', '#6b4c9a', '#4c1d95', '#7c3aed', '#ec4899', '#be185d',
    '#dc2626', '#c0392b', '#ea580c', '#d97706', '#ca8a04', '#65a30d',
    '#16a34a', '#059669', '#0d9488', '#0891b2', '#0284c7', '#1d4ed8',
    '#5a6a7a', '#667B97', '#163E63', '#1e293b', '#374151', '#4b5563',
    '#6b7280', '#78716c', '#8b5e3c', '#92400e', '#713f12', '#365314',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const qColor = this.route.snapshot.queryParamMap.get('color');

    this.http.get<{ template: any }>(`/api/v1/templates/${id}`).subscribe(({ template }) => {
      const colors =
        typeof template.default_colors === 'string'
          ? JSON.parse(template.default_colors || '[]')
          : template.defaultColors || template.default_colors || [];
      const name = (template.name as string).toLowerCase();
      const layout: CvTemplate['layout'] = name.includes('cover')
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
      const normalized: CvTemplate = {
        id: String(template.id),
        name: template.name,
        description: template.description,
        thumbnailUrl: template.thumbnail_url || template.thumbnailUrl,
        defaultColors: Array.isArray(colors) && colors.length ? colors : ['#667B97', '#163E63', '#0284C7', '#334155'],
        avgRating: template.avg_rating ?? template.avgRating ?? 0,
        layout,
      };
      this.template.set(normalized);

      if (qColor && normalized.defaultColors.some((c) => c.toLowerCase() === qColor.toLowerCase())) {
        this.selectedColor.set(qColor);
      } else if (normalized.defaultColors.length) {
        this.selectedColor.set(normalized.defaultColors[0]);
      }
    });
  }

  back() {
    this.router.navigate(['/templates']);
  }

  pickColor(color: string) {
    this.selectedColor.set(color);
  }

  rate(stars: number) {
    this.userRating.set(stars);
    const t = this.template();
    if (!t) return;
    this.http.post(`/api/v1/templates/${t.id}/reviews`, { rating: stars }).subscribe();
  }

  useTemplate(t: CvTemplate) {
    this.http
      .post<{ cvId: string; cv?: { id: string | number } }>(`/api/v1/templates/${t.id}/select`, {
        selectedColor: this.selectedColor(),
      })
      .subscribe({
        next: (res) => {
          const cvId = res.cvId ?? res.cv?.id;
          this.router.navigate(['/make-cv'], {
            queryParams: { templateId: t.id, cvId, color: this.selectedColor(), layout: t.layout },
          });
        },
        error: () => {
          this.http.post<{ cv: { id: string | number } }>('/api/v1/cvs', { templateId: t.id }).subscribe({
            next: ({ cv }) =>
              this.router.navigate(['/make-cv'], {
                queryParams: { templateId: t.id, cvId: cv.id, color: this.selectedColor(), layout: t.layout },
              }),
            error: () => alert('Could not start this template. Please log in and try again.'),
          });
        },
      });
  }
}
