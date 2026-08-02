import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Trash2, Pencil } from 'lucide-angular';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';
import { ModernSplitCvComponent } from '../../shared/components/modern-split-cv/modern-split-cv.component';
import { CleanSidebarCvComponent } from '../../shared/components/clean-sidebar-cv/clean-sidebar-cv.component';
import { ElegantFrameCvComponent } from '../../shared/components/elegant-frame-cv/elegant-frame-cv.component';
import { ClassicDarkCvComponent } from '../../shared/components/classic-dark-cv/classic-dark-cv.component';

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
  imports: [CommonModule, ProfessionalCvComponent, ModernSplitCvComponent, CleanSidebarCvComponent, ElegantFrameCvComponent, ClassicDarkCvComponent, LucideAngularModule],
  template: `
    <section class="cv-library">
      <div class="library-head">
        <div><p class="library-kicker">YOUR CV LIBRARY</p><h1>My CVs</h1><p>Open a full preview, then edit whenever you are ready.</p></div>
        <div class="library-actions"><label class="search-box"><span>⌕</span><input type="search" placeholder="Search your CVs" [value]="searchQuery()" (input)="searchQuery.set($any($event.target).value)" /></label><a href="/templates" class="new-cv">+ Create new CV</a></div>
      </div>

      @if (cvs().length === 0) {
        <p class="text-slate-500 dark:text-sky-300">You haven't saved any CVs yet — pick a template to get started.</p>
      }

      <div class="cv-grid">
        @for (cv of filteredCvs(); track cv.id) {
          <div class="group relative">
            <div class="cv-card">
              <div class="cv-thumb pointer-events-none" aria-hidden="true">
                @if (layoutOf(cv) === 'modern-split') {
                  <app-modern-split-cv
                    [accent]="cv.selected_color || '#1b3a5c'"
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)"
                    [experience]="asArray(contentOf(cv).experience)"
                    [skills]="asArray(contentOf(cv).skills)"
                    [languages]="asArray(contentOf(cv).languages)"
                    [references]="asArray(contentOf(cv).references)"
                    [hobbies]="asArray(contentOf(cv).hobbies)"
                  />
                } @else if (layoutOf(cv) === 'clean-sidebar') {
                  <app-clean-sidebar-cv
                    [accent]="cv.selected_color || '#5a6a7a'"
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)"
                    [experience]="asArray(contentOf(cv).experience)"
                    [skills]="asArray(contentOf(cv).skills)"
                    [languages]="asArray(contentOf(cv).languages)"
                    [references]="asArray(contentOf(cv).references)"
                  />
                } @else if (layoutOf(cv) === 'elegant-frame') {
                  <app-elegant-frame-cv
                    [accent]="cv.selected_color || '#2c3e50'"
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
                    [references]="asArray(contentOf(cv).references)"
                  />
                } @else if (layoutOf(cv) === 'classic-dark') {
                  <app-classic-dark-cv
                    [accent]="cv.selected_color || '#2c3e50'"
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
                    [references]="asArray(contentOf(cv).references)"
                  />
                } @else {
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
                }
              </div>

              <div class="cv-overlay">
                <button type="button" (click)="edit(cv)"
                  class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-sky-700 text-white font-medium shadow-lg hover:scale-105 active:scale-95 transition">
                  <lucide-icon [img]="Pencil" class="w-4 h-4" /> Edit
                </button>
                <button type="button" (click)="remove(cv, $event)"
                  class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-red-600 text-white font-medium shadow-lg hover:scale-105 active:scale-95 transition">
                  <lucide-icon [img]="Trash2" class="w-4 h-4" /> Delete
                </button>
              </div>
            </div>

            <div class="cv-meta">
              <div><p>{{ cv.title }}</p><span>{{ cv.template_name }}</span></div>
              <button type="button" (click)="edit(cv)" class="edit-link">Edit CV →</button>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .cv-library { min-height:100vh; box-sizing:border-box; padding:118px 28px 60px; background:linear-gradient(135deg,#f4f7ff,#edf2fc 55%,#f8faff); }
    .library-head { max-width:1640px; margin:0 auto 32px; display:flex; align-items:end; justify-content:space-between; gap:24px; }
    .library-kicker { color:#486dcc; font-size:.68rem; font-weight:800; letter-spacing:.15em; margin:0 0 10px; }
    .library-head h1 { color:#1a2e66; font-size:2.4rem; letter-spacing:-.045em; margin:0 0 7px; }
    .library-head p:last-child { color:#75829a; font-size:.9rem; margin:0; }
    .new-cv { flex:none; border-radius:10px; padding:13px 19px; background:#4167ca; color:#fff; text-decoration:none; font-size:.84rem; font-weight:800; box-shadow:0 9px 18px #4167ca3d; transition:.2s; }.new-cv:hover { background:#3158bb; transform:translateY(-2px); }
    .library-actions { display:flex; align-items:center; gap:12px; }.search-box { display:flex; align-items:center; gap:7px; width:220px; box-sizing:border-box; padding:0 12px; height:42px; border:1px solid #dce5f4; border-radius:10px; background:#fff; color:#6d7d9a; transition:.2s; }.search-box:focus-within { border-color:#4167ca; box-shadow:0 0 0 3px #e2eaff; }.search-box span { font-size:1.25rem; line-height:1; }.search-box input { min-width:0; width:100%; border:0; outline:0; background:transparent; color:#26395d; font:inherit; font-size:.78rem; }.search-box input::placeholder { color:#94a0b5; }
    .cv-grid { max-width:1640px; margin:auto; display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,290px)); justify-content:start; gap:28px 26px; }
    .cv-card {
      position: relative;
      width: 100%;
      aspect-ratio: 210 / 297;
      overflow: hidden;
      border-radius: 14px;
      border: 1px solid #dce4f0;
      background: #fff;
      box-shadow: 0 8px 25px rgb(39 61 112 / 0.12);
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      container-type: size;
    }
    .cv-card:hover {
      box-shadow: 0 18px 35px rgb(39 61 112 / 0.18);
      transform: translateY(-4px);
    }
    .cv-thumb {
      position: absolute;
      top: 0;
      left: 0;
      width: 210mm;
      min-height: 297mm;
      transform-origin: top left;
      transform: scale(calc(100cqw / 793.7));
    }
    .cv-overlay {
      position: absolute;
      inset: 0;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: rgb(15 23 42 / 0.4);
      backdrop-filter: blur(2px);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .group:hover .cv-overlay {
      opacity: 1;
    }
    .cv-meta { display:flex; justify-content:space-between; align-items:center; gap:14px; padding:14px 4px 0; }.cv-meta p { color:#1d315f; font-size:.94rem; font-weight:800; margin:0 0 4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }.cv-meta span { color:#71809b; font-size:.73rem; }.edit-link { border:0; background:transparent; color:#4167ca; font-size:.76rem; font-weight:800; cursor:pointer; white-space:nowrap; }
    @media(max-width:620px){.cv-library{padding:94px 16px 38px}.library-head{align-items:start;flex-direction:column;margin-bottom:24px}.library-head h1{font-size:2rem}.library-actions{width:100%;flex-direction:column;align-items:stretch}.search-box{width:100%}.new-cv{text-align:center}.cv-grid{grid-template-columns:1fr;gap:25px}}
  `],
})
export class MyCvDashboardComponent implements OnInit {
  Pencil = Pencil;
  Trash2 = Trash2;
  cvs = signal<SavedCv[]>([]);
  searchQuery = signal('');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<{ cvs: SavedCv[] }>('/api/v1/cvs').subscribe(({ cvs }) =>
      this.cvs.set(
        (cvs || []).map((c) => ({ ...c, content: this.parseContent(c.content) })),
      ),
    );
  }

  parseContent(content: any) {
    if (!content) return {};
    if (typeof content === 'string') {
      try { return JSON.parse(content); } catch { return {}; }
    }
    return content;
  }

  contentOf(cv: SavedCv) { return this.parseContent(cv.content); }

  filteredCvs() {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return this.cvs();
    return this.cvs().filter((cv) => `${cv.title} ${cv.template_name}`.toLowerCase().includes(query));
  }

  asArray(v: any): any[] { return Array.isArray(v) ? v : []; }

  layoutOf(cv: SavedCv): string {
    const content = this.contentOf(cv);
    if (content.layout) return content.layout;
    const name = (cv.template_name || '').toLowerCase();
    if (name.includes('geometric')) return 'classic-dark';
    if (name.includes('elegant')) return 'elegant-frame';
    if (name.includes('clean')) return 'clean-sidebar';
    if (name.includes('modern')) return 'modern-split';
    return 'professional';
  }

  edit(cv: SavedCv) {
    const content = this.contentOf(cv);
    this.router.navigate(['/make-cv'], {
      queryParams: { cvId: cv.id, layout: content.layout || this.layoutOf(cv) },
    });
  }

  remove(cv: SavedCv, event: Event) {
    event.stopPropagation();
    if (!confirm(`Delete "${cv.title}"? This cannot be undone.`)) return;
    this.http.delete(`/api/v1/cvs/${cv.id}`).subscribe({
      next: () => this.cvs.update((list) => list.filter((c) => c.id !== cv.id)),
      error: () => alert('Could not delete this CV.'),
    });
  }
}
