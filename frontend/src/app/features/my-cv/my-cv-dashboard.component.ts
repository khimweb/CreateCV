import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Trash2, Pencil } from 'lucide-angular';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';

interface SavedCv {
  id: string;
  title: string;
  template_name: string;
  thumbnail_url: string;
  updated_at: string;
  content?: any;
  selected_color?: string;
}

@Component({
  selector: 'app-my-cv-dashboard',
  standalone: true,
  imports: [CommonModule, ProfessionalCvComponent, LucideAngularModule],
  template: `
    <section class="max-w-6xl mx-auto px-4 pt-32 pb-16">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 class="text-3xl font-semibold text-slate-800 dark:text-sky-100">My CVs</h1>
        <a
          href="/templates"
          class="px-5 py-2.5 rounded-xl bg-sky-700 text-white font-medium shadow hover:scale-105 active:scale-95 transition"
          >+ New CV</a
        >
      </div>

      @if (cvs().length === 0) {
        <p class="text-slate-500 dark:text-sky-300">You haven't saved any CVs yet — pick a template to get started.</p>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (cv of cvs(); track cv.id) {
          <div
            class="group relative rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-sky-500/20 shadow-md transition-all duration-300 ease-in-out hover:scale-[1.02]"
          >
            <div class="h-64 overflow-hidden bg-slate-100">
              <div class="w-[210mm] origin-top-left scale-[0.32]">
                <app-professional-cv
                  [accent]="cv.selected_color || '#667b97'"
                  [photoUrl]="contentOf(cv).photoUrl || null"
                  [name]="contentOf(cv).fullName || cv.title"
                  [jobTitle]="contentOf(cv).jobTitle || ''"
                  [email]="contentOf(cv).email || ''"
                  [phone]="contentOf(cv).phone || ''"
                  [location]="contentOf(cv).location || ''"
                  [linkedin]="contentOf(cv).linkedin || ''"
                  [summary]="contentOf(cv).summary || ''"
                  [education]="asArray(contentOf(cv).education)"
                  [experience]="asArray(contentOf(cv).experience)"
                  [skills]="asArray(contentOf(cv).skills)"
                  [languages]="asArray(contentOf(cv).languages)"
                  [certifications]="asArray(contentOf(cv).certifications)"
                  [projects]="asArray(contentOf(cv).projects)"
                />
              </div>
            </div>

            <div class="p-4">
              <p class="font-medium text-slate-800 dark:text-sky-100 truncate">{{ cv.title }}</p>
              <p class="text-xs text-slate-500 dark:text-sky-300">{{ cv.template_name }}</p>
            </div>

            <div
              class="absolute inset-0 flex items-center justify-center gap-3 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
            >
              <button
                type="button"
                (click)="edit(cv)"
                class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-sky-700 text-white font-medium shadow-lg hover:scale-105 active:scale-95 transition"
              >
                <lucide-icon [img]="Pencil" class="w-4 h-4" /> Edit
              </button>
              <button
                type="button"
                (click)="remove(cv, $event)"
                class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-red-600 text-white font-medium shadow-lg hover:scale-105 active:scale-95 transition"
              >
                <lucide-icon [img]="Trash2" class="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class MyCvDashboardComponent implements OnInit {
  Pencil = Pencil;
  Trash2 = Trash2;
  cvs = signal<SavedCv[]>([]);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<{ cvs: SavedCv[] }>('/api/v1/cvs').subscribe(({ cvs }) =>
      this.cvs.set(
        (cvs || []).map((c) => ({
          ...c,
          content: this.parseContent(c.content),
        })),
      ),
    );
  }

  parseContent(content: any) {
    if (!content) return {};
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch {
        return {};
      }
    }
    return content;
  }

  contentOf(cv: SavedCv) {
    return this.parseContent(cv.content);
  }

  asArray(v: any): any[] {
    return Array.isArray(v) ? v : [];
  }

  edit(cv: SavedCv) {
    this.router.navigate(['/make-cv'], { queryParams: { cvId: cv.id } });
  }

  remove(cv: SavedCv, event: Event) {
    event.stopPropagation();
    if (!confirm(`Delete “${cv.title}”? This cannot be undone.`)) return;
    this.http.delete(`/api/v1/cvs/${cv.id}`).subscribe({
      next: () => this.cvs.update((list) => list.filter((c) => c.id !== cv.id)),
      error: () => alert('Could not delete this CV.'),
    });
  }
}
