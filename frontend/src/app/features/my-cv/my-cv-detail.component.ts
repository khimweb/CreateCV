import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Save, Download, Pencil, Trash2 } from 'lucide-angular';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';
import { WarmTaupeTimelineCvComponent } from '../../shared/components/warm-taupe-timeline-cv/warm-taupe-timeline-cv.component';
import { SlateRoundedPanelsCvComponent } from '../../shared/components/slate-rounded-panels-cv/slate-rounded-panels-cv.component';
import { NavySidebarProfileCvComponent } from '../../shared/components/navy-sidebar-profile-cv/navy-sidebar-profile-cv.component';
import { GraphiteBannerTimelineCvComponent } from '../../shared/components/graphite-banner-timeline-cv/graphite-banner-timeline-cv.component';

interface CvDetail {
  id: string;
  title: string;
  template_name: string;
  selected_color: string;
  default_colors: string[];
  content: any;
  pdf_url: string | null;
}

@Component({
  selector: 'app-my-cv-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProfessionalCvComponent, WarmTaupeTimelineCvComponent, SlateRoundedPanelsCvComponent, NavySidebarProfileCvComponent, GraphiteBannerTimelineCvComponent],
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
            @if (layoutOf(c) === 'graphite-banner-timeline') {
              <app-graphite-banner-timeline-cv
                [accent]="c.content?.accent || c.selected_color || '#323E4D'"
                [photoUrl]="c.content?.photoUrl || null"
                [name]="c.content?.fullName || c.title" [jobTitle]="c.content?.jobTitle || ''" [email]="c.content?.email || ''" [phone]="c.content?.phone || ''" [location]="c.content?.location || ''" [linkedin]="c.content?.linkedin || ''" [summary]="c.content?.summary || ''"
                [education]="arr(c.content?.education)" [experience]="arr(c.content?.experience)" [skills]="arr(c.content?.skills)" [languages]="arr(c.content?.languages)" [certifications]="arr(c.content?.certifications)" [projects]="arr(c.content?.projects)" [references]="arr(c.content?.references)" [hobbies]="arr(c.content?.hobbies)"
              />
            } @else if (layoutOf(c) === 'navy-sidebar-profile') {
              <app-navy-sidebar-profile-cv
                [accent]="c.content?.accent || c.selected_color || '#1E3A52'"
                [photoUrl]="c.content?.photoUrl || null"
                [name]="c.content?.fullName || c.title" [jobTitle]="c.content?.jobTitle || ''" [email]="c.content?.email || ''" [phone]="c.content?.phone || ''" [location]="c.content?.location || ''" [linkedin]="c.content?.linkedin || ''" [summary]="c.content?.summary || ''"
                [education]="arr(c.content?.education)" [experience]="arr(c.content?.experience)" [skills]="arr(c.content?.skills)" [languages]="arr(c.content?.languages)" [certifications]="arr(c.content?.certifications)" [projects]="arr(c.content?.projects)" [references]="arr(c.content?.references)" [hobbies]="arr(c.content?.hobbies)"
              />
            } @else if (layoutOf(c) === 'slate-rounded-panels') {
              <app-slate-rounded-panels-cv
                [accent]="c.content?.accent || c.selected_color || '#364152'"
                [photoUrl]="c.content?.photoUrl || null"
                [name]="c.content?.fullName || c.title" [jobTitle]="c.content?.jobTitle || ''" [email]="c.content?.email || ''" [phone]="c.content?.phone || ''" [location]="c.content?.location || ''" [linkedin]="c.content?.linkedin || ''" [summary]="c.content?.summary || ''"
                [education]="arr(c.content?.education)" [experience]="arr(c.content?.experience)" [skills]="arr(c.content?.skills)" [languages]="arr(c.content?.languages)" [certifications]="arr(c.content?.certifications)" [projects]="arr(c.content?.projects)" [references]="arr(c.content?.references)" [hobbies]="arr(c.content?.hobbies)"
              />
            } @else if (layoutOf(c) === 'warm-taupe-timeline') {
              <app-warm-taupe-timeline-cv
                [accent]="c.content?.accent || c.selected_color || '#A87C64'"
                [photoUrl]="c.content?.photoUrl || null"
                [name]="c.content?.fullName || c.title" [jobTitle]="c.content?.jobTitle || ''" [email]="c.content?.email || ''" [phone]="c.content?.phone || ''" [location]="c.content?.location || ''" [linkedin]="c.content?.linkedin || ''" [summary]="c.content?.summary || ''"
                [education]="arr(c.content?.education)" [experience]="arr(c.content?.experience)" [skills]="arr(c.content?.skills)" [languages]="arr(c.content?.languages)" [certifications]="arr(c.content?.certifications)" [projects]="arr(c.content?.projects)" [references]="arr(c.content?.references)" [hobbies]="arr(c.content?.hobbies)"
                [fontSize]="c.content?.typography?.fontSize || 10" [fontWeight]="c.content?.typography?.fontWeight || 400" [lineHeight]="c.content?.typography?.lineHeight || 1.42" [fontFamily]="c.content?.typography?.fontFamily || undefined"
              />
            } @else {
              <app-professional-cv
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
            }
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

  layoutOf(c: CvDetail): string {
    const layout = c.content?.layout;
    if (layout) return layout;
    const name = (c.template_name || '').toLowerCase();
    if (name.includes('graphite')) return 'graphite-banner-timeline';
    if (name.includes('navy sidebar')) return 'navy-sidebar-profile';
    if (name.includes('slate rounded')) return 'slate-rounded-panels';
    if (name.includes('warm taupe')) return 'warm-taupe-timeline';
    return 'professional';
  }

  arr(v: any): any[] {
    return Array.isArray(v) ? v : [];
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
