import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Save, Download, Pencil, Trash2 } from 'lucide-angular';
import { CvRendererComponent, normalizeLayout } from '../../shared/components/cv-renderer/cv-renderer.component';

interface CvDetail {
  id: string;
  title: string;
  template_name: string;
  template_layout?: string;
  selected_color: string;
  default_colors: string[];
  content: any;
  pdf_url: string | null;
}

@Component({
  selector: 'app-my-cv-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CvRendererComponent],
  template: `
    @if (cv(); as c) {
      <section class="max-w-5xl mx-auto px-4 pt-32 pb-16">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100">{{ c.title }}</h1>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              (click)="editInWorkstation(c)"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-sky-100 hover:scale-105 active:scale-95 transition"
            >
              <lucide-icon [img]="Pencil" class="w-4 h-4" /> Edit
            </button>
            <button
              type="button"
              (click)="save(c)"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-sky-100/80 dark:bg-sky-500/20 text-sky-700 dark:text-sky-100 hover:scale-105 active:scale-95 transition"
            >
              <lucide-icon [img]="Save" class="w-4 h-4" /> Save
            </button>
            <button
              type="button"
              (click)="download(c)"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-sky-700 dark:bg-sky-600 text-white shadow-md hover:scale-105 active:scale-95 transition"
            >
              <lucide-icon [img]="Download" class="w-4 h-4" /> Download PDF
            </button>
            <button
              type="button"
              (click)="remove(c)"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-700 hover:scale-105 active:scale-95 transition"
            >
              <lucide-icon [img]="Trash2" class="w-4 h-4" /> Delete
            </button>
          </div>
        </div>

        <div class="flex gap-3 mb-6">
          @for (color of c.default_colors; track color) {
            <button
              type="button"
              (click)="setColor(c, color)"
              [style.background]="color"
              class="h-8 w-8 rounded-full border-2 transition hover:scale-105 active:scale-95"
              [class.border-slate-800]="c.selected_color === color"
              [class.dark:border-white]="c.selected_color === color"
              [class.border-transparent]="c.selected_color !== color"
            ></button>
          }
        </div>

        <div
          class="rounded-2xl p-4 sm:p-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-sky-500/20 shadow-md overflow-auto"
          [style.borderTop]="'6px solid ' + c.selected_color"
        >
          <div class="print-root a4-wrap mx-auto">
            <app-cv-renderer
              [layout]="layoutOf(c)"
              [accent]="c.selected_color"
              [photoUrl]="c.content?.photoUrl || null"
              [name]="c.content?.fullName || c.title"
              [jobTitle]="c.content?.jobTitle || ''"
              [email]="c.content?.email || ''"
              [phone]="c.content?.phone || ''"
              [location]="c.content?.location || ''"
              [linkedin]="c.content?.linkedin || ''"
              [summary]="c.content?.summary || ''"
              [education]="arr(c.content?.education)"
              [experience]="arr(c.content?.experience)"
              [skills]="arr(c.content?.skills)"
              [languages]="arr(c.content?.languages)"
              [certifications]="arr(c.content?.certifications)"
              [projects]="arr(c.content?.projects)"
            />
          </div>
        </div>
      </section>
    }
  `,
  styles: [
    `
      .a4-wrap {
        width: 210mm;
        max-width: 100%;
      }
    `,
  ],
})
export class MyCvDetailComponent implements OnInit {
  readonly Save = Save;
  readonly Download = Download;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  cv = signal<CvDetail | null>(null);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('cv_id')!;
    this.http.get<{ cv: any }>(`/api/v1/cvs/${id}`).subscribe(({ cv }) =>
      this.cv.set({
        ...cv,
        content: typeof cv.content === 'string' ? JSON.parse(cv.content || '{}') : cv.content || {},
        default_colors:
          typeof cv.default_colors === 'string' ? JSON.parse(cv.default_colors) : cv.default_colors || [],
      }),
    );
  }

  arr(v: any): any[] {
    return Array.isArray(v) ? v : [];
  }

  layoutOf(c: CvDetail) {
    return normalizeLayout(c.template_layout);
  }

  setColor(c: CvDetail, color: string) {
    this.http.put(`/api/v1/cvs/${c.id}/color`, { color }).subscribe(() => {
      this.cv.set({ ...c, selected_color: color });
    });
  }

  save(c: CvDetail) {
    this.http.put(`/api/v1/cvs/${c.id}`, { content: c.content, title: c.title }).subscribe({
      next: () => alert('Saved.'),
      error: () => alert('Could not save.'),
    });
  }

  download(c: CvDetail) {
    // Prefer browser A4 print of the real template (full fidelity + photo)
    setTimeout(() => window.print(), 100);
    this.http.post<{ pdfUrl: string }>(`/api/v1/cvs/${c.id}/download`, {}).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  remove(c: CvDetail) {
    if (!confirm(`Delete “${c.title}”?`)) return;
    this.http.delete(`/api/v1/cvs/${c.id}`).subscribe({
      next: () => this.router.navigate(['/my-cv']),
      error: () => alert('Could not delete.'),
    });
  }

  editInWorkstation(c: CvDetail) {
    this.router.navigate(['/make-cv'], { queryParams: { cvId: c.id } });
  }
}
