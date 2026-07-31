import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Star, ArrowLeft } from 'lucide-angular';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';
import { DEMO_CV } from '../../shared/demo-cv-data';

interface CvTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  defaultColors: string[];
  avgRating: number;
}

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProfessionalCvComponent],
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
          <div
            class="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-sky-500/20 shadow-md"
          >
            <div class="h-[min(78vh,820px)] overflow-auto p-4 flex justify-center">
              <div class="origin-top" [style.zoom]="0.72">
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
              </div>
            </div>
          </div>

          <div class="space-y-6 lg:sticky lg:top-28">
            <div>
              <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100">{{ t.name }}</h1>
              <p class="text-sm text-slate-500 dark:text-sky-300 mt-1">
                {{ t.description || 'A polished two-column CV with experience timeline and skills sidebar.' }}
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
                    [class.dark:border-white]="selectedColor() === color"
                    [class.ring-2]="selectedColor() === color"
                    [class.ring-offset-2]="selectedColor() === color"
                    [class.border-white]="selectedColor() !== color"
                    [class.shadow]="true"
                    [attr.aria-label]="'Select color ' + color"
                  ></button>
                }
              </div>
              <p class="text-xs text-slate-400 mt-2">Preview updates instantly when you pick a color.</p>
            </div>

            <div>
              <p class="text-xs uppercase tracking-wide text-slate-400 dark:text-sky-400 mb-2">Rate this template</p>
              <div class="flex gap-1">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                  <button
                    type="button"
                    (click)="rate(star)"
                    class="transition hover:scale-110 active:scale-95"
                  >
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
      const normalized: CvTemplate = {
        id: String(template.id),
        name: template.name,
        description: template.description,
        thumbnailUrl: template.thumbnail_url || template.thumbnailUrl,
        defaultColors: Array.isArray(colors) && colors.length ? colors : ['#667B97', '#163E63', '#0284C7', '#334155'],
        avgRating: template.avg_rating ?? template.avgRating ?? 0,
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
            queryParams: { templateId: t.id, cvId, color: this.selectedColor() },
          });
        },
        error: () => {
          // Fallback: create draft via CVs API
          this.http.post<{ cv: { id: string | number } }>('/api/v1/cvs', { templateId: t.id }).subscribe({
            next: ({ cv }) =>
              this.router.navigate(['/make-cv'], {
                queryParams: { templateId: t.id, cvId: cv.id, color: this.selectedColor() },
              }),
            error: () => alert('Could not start this template. Please log in and try again.'),
          });
        },
      });
  }
}
