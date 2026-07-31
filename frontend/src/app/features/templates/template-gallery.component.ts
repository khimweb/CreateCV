import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Search } from 'lucide-angular';
import { CvLayout, CvRendererComponent, normalizeLayout } from '../../shared/components/cv-renderer/cv-renderer.component';
import { FitWidthDirective } from '../../shared/directives/fit-width.directive';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DEMO_CV } from '../../shared/demo-cv-data';

interface CvTemplate {
  id: string;
  name: string;
  category: string;
  layout: CvLayout;
  accent: string;
  colors: string[];
  hasPhoto: boolean;
  description?: string;
}

@Component({
  selector: 'app-template-gallery',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CvRendererComponent, FitWidthDirective],
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

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        @for (t of filtered(); track t.id) {
          <article class="group">
            <!-- Fixed A4 card: aspect ratio locks the CV frame -->
            <div appFitWidth class="cv-card group-hover:shadow-xl group-hover:-translate-y-0.5">
              <div class="cv-thumb pointer-events-none" aria-hidden="true">
                <app-cv-renderer
                  [layout]="t.layout"
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
        border-radius: 1rem;
        border: 1px solid #e2e8f0;
        background: #e8eef4;
        box-shadow: 0 1px 3px rgb(15 23 42 / 0.06);
        transition: box-shadow 0.3s ease, transform 0.3s ease;
      }
      .cv-thumb {
        position: absolute;
        top: 0;
        left: 0;
        width: 210mm;
        min-height: 297mm;
        transform-origin: top left;
        /* --fit-scale comes from appFitWidth: card width ÷ A4 width. */
        transform: scale(var(--fit-scale, 0.45));
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
          return {
            id: String(t.id),
            name: t.name,
            category: t.category || 'Professional',
            layout: normalizeLayout(t.layout),
            accent: colors[0],
            colors,
            hasPhoto: true,
            description: t.description,
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
