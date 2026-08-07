import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Trash2, Search, Eye } from 'lucide-angular';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ProfessionalCvComponent } from '../../../shared/components/professional-cv/professional-cv.component';
import { ModernSplitCvComponent } from '../../../shared/components/modern-split-cv/modern-split-cv.component';
import { CleanSidebarCvComponent } from '../../../shared/components/clean-sidebar-cv/clean-sidebar-cv.component';
import { ElegantFrameCvComponent } from '../../../shared/components/elegant-frame-cv/elegant-frame-cv.component';
import { ClassicDarkCvComponent } from '../../../shared/components/classic-dark-cv/classic-dark-cv.component';
import { FormalClassicCvComponent } from '../../../shared/components/formal-classic-cv/formal-classic-cv.component';
import { CoverLetterCvComponent } from '../../../shared/components/cover-letter-cv/cover-letter-cv.component';
import { WarmTaupeTimelineCvComponent } from '../../../shared/components/warm-taupe-timeline-cv/warm-taupe-timeline-cv.component';
import { SlateRoundedPanelsCvComponent } from '../../../shared/components/slate-rounded-panels-cv/slate-rounded-panels-cv.component';
import { NavySidebarProfileCvComponent } from '../../../shared/components/navy-sidebar-profile-cv/navy-sidebar-profile-cv.component';
import { GraphiteBannerTimelineCvComponent } from '../../../shared/components/graphite-banner-timeline-cv/graphite-banner-timeline-cv.component';
import { A4FitDirective } from '../../../shared/directives/a4-fit.directive';
import { DEMO_CV } from '../../../shared/demo-cv-data';

interface AdminTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string;
  is_active: boolean;
  sold_count: number;
  avg_rating: number;
  default_colors: string;
  layout: string;
}

@Component({
  selector: 'app-admin-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ProfessionalCvComponent, ModernSplitCvComponent, CleanSidebarCvComponent, ElegantFrameCvComponent, ClassicDarkCvComponent, FormalClassicCvComponent, CoverLetterCvComponent, WarmTaupeTimelineCvComponent, SlateRoundedPanelsCvComponent, NavySidebarProfileCvComponent, GraphiteBannerTimelineCvComponent, A4FitDirective],
  template: `
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white">Templates</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ templates().length }} templates total</p>
      </div>
      <div class="flex gap-2">
        <select [(ngModel)]="category" (ngModelChange)="load()"
                class="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200
                       dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All categories</option>
          <option value="general">General</option>
          <option value="modern">Modern</option>
          <option value="creative">Creative</option>
          <option value="executive">Executive</option>
        </select>
        <div class="relative">
          <lucide-icon [img]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Search..."
                 class="pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200
                        dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" />
        </div>
      </div>
    </div>

    <!-- Grid with live CV previews -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      @for (t of templates(); track t.id) {
        <div class="rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                    shadow-sm hover:shadow-lg transition-all duration-300 group">
          <!-- Live CV Preview -->
          <div appA4Fit class="cv-card cursor-pointer" (click)="preview.set(t)">
            <div class="cv-thumb pointer-events-none">
              @if (t.layout === 'modern-split') {
                <app-modern-split-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
              } @else if (t.layout === 'clean-sidebar') {
                <app-clean-sidebar-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
              } @else if (t.layout === 'elegant-frame') {
                <app-elegant-frame-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
              } @else if (t.layout === 'classic-dark') {
                <app-classic-dark-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
              } @else if (t.layout === 'formal-classic') {
                <app-formal-classic-cv [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [projects]="demo.projects" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
              } @else if (t.layout === 'graphite-banner-timeline') {
                <app-graphite-banner-timeline-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5" />
              } @else if (t.layout === 'navy-sidebar-profile') {
                <app-navy-sidebar-profile-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5" />
              } @else if (t.layout === 'slate-rounded-panels') {
                <app-slate-rounded-panels-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.45" />
              } @else if (t.layout === 'warm-taupe-timeline') {
                <app-warm-taupe-timeline-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
              } @else if (t.layout === 'cover-letter') {
                <app-cover-letter-cv [accent]="getAccent(t)" [name]="demo.name" [phone]="demo.phone" [email]="demo.email" [location]="demo.location" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5" />
              } @else {
                <app-professional-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" [sectionLines]="true" />
              }
            </div>
          </div>

          <!-- Info + Actions -->
          <div class="p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-slate-800 dark:text-white text-sm">{{ t.name }}</p>
                <p class="text-xs text-slate-400 mt-0.5">{{ t.category }} · {{ t.sold_count }} sold · {{ t.avg_rating }}★</p>
              </div>
              <button type="button" (click)="confirmRemove(t)"
                      class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors">
                <lucide-icon [img]="Trash2" class="w-4 h-4" />
              </button>
            </div>
            <button type="button" (click)="toggleActive(t)"
                    class="mt-3 w-full py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
                    [ngClass]="{ 'bg-emerald-50 text-emerald-600': t.is_active, 'bg-red-50 text-red-500': !t.is_active }">
              {{ t.is_active ? '● Active' : '○ Inactive' }}
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Full Preview Modal -->
    @if (preview(); as p) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
           (click)="preview.set(null)">
        <div class="relative bg-white rounded-2xl shadow-2xl overflow-hidden" style="width:700px;max-width:95vw;max-height:90vh;overflow:auto" (click)="$event.stopPropagation()">
          <div class="p-2">
            <div class="cv-preview-full pointer-events-none">
              @if (p.layout === 'modern-split') {
                <app-modern-split-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
              } @else if (p.layout === 'clean-sidebar') {
                <app-clean-sidebar-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
              } @else if (p.layout === 'elegant-frame') {
                <app-elegant-frame-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
              } @else if (p.layout === 'classic-dark') {
                <app-classic-dark-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
              } @else if (p.layout === 'formal-classic') {
                <app-formal-classic-cv [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [projects]="demo.projects" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
              } @else if (p.layout === 'graphite-banner-timeline') {
                <app-graphite-banner-timeline-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.55" />
              } @else if (p.layout === 'navy-sidebar-profile') {
                <app-navy-sidebar-profile-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.55" />
              } @else if (p.layout === 'slate-rounded-panels') {
                <app-slate-rounded-panels-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.5" />
              } @else if (p.layout === 'warm-taupe-timeline') {
                <app-warm-taupe-timeline-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
              } @else if (p.layout === 'cover-letter') {
                <app-cover-letter-cv [accent]="getAccent(p)" [name]="demo.name" [phone]="demo.phone" [email]="demo.email" [location]="demo.location" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.5" />
              } @else {
                <app-professional-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" [sectionLines]="true" />
              }
            </div>
          </div>
          <div class="sticky bottom-0 p-3 bg-white border-t flex items-center justify-between">
            <p class="font-semibold text-slate-800 text-sm">{{ p.name }} <span class="text-slate-400 font-normal">· {{ p.category }}</span></p>
            <button type="button" (click)="preview.set(null)"
                    class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors">Close</button>
          </div>
        </div>
      </div>
    }

    <!-- iOS-style Remove Alert -->
    @if (alertTemplate(); as t) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
           (click)="alertTemplate.set(null)">
        <div class="w-full max-w-xs rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease-out]"
             (click)="$event.stopPropagation()">
          <div class="px-6 pt-6 pb-4 text-center">
            <p class="font-semibold text-slate-800 dark:text-white text-base">Delete Template</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Delete <strong>{{ t.name }}</strong>? This cannot be undone.
            </p>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-700">
            <button type="button" (click)="removeTemplate(t)"
                    class="w-full py-3 text-red-500 font-semibold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              Delete
            </button>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-700">
            <button type="button" (click)="alertTemplate.set(null)"
                    class="w-full py-3 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .cv-card {
      position: relative; width: 100%; aspect-ratio: 210/297; overflow: hidden;
      border-bottom: 1px solid #e2e8f0; background: #fff; container-type: size;
    }
    .cv-thumb {
      position: absolute; top: 0; left: 0; width: 210mm; height: 297mm; overflow: hidden;
      transform-origin: top left; transform: scale(var(--a4-scale, 0.264));
    }
    .cv-preview-full {
      width: 210mm; min-height: 297mm; transform-origin: top left;
      transform: scale(calc(680px / 793.7)); transform-origin: top center;
      margin: 0 auto;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class AdminTemplatesComponent implements OnInit {
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly demo = DEMO_CV;

  templates = signal<AdminTemplate[]>([]);
  preview = signal<AdminTemplate | null>(null);
  alertTemplate = signal<AdminTemplate | null>(null);
  category = '';
  search = '';

  constructor(private http: HttpClient, private toast: ToastService) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<{ templates: any[] }>('/api/v1/admin/templates', {
      params: { category: this.category, search: this.search },
    }).subscribe(({ templates }) => {
      this.templates.set(templates.map(t => ({
        ...t,
        id: String(t.id),
        layout: this.detectLayout(t.name),
      })));
    });
  }

  detectLayout(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('graphite')) return 'graphite-banner-timeline';
    if (n.includes('navy sidebar')) return 'navy-sidebar-profile';
    if (n.includes('slate rounded')) return 'slate-rounded-panels';
    if (n.includes('warm taupe')) return 'warm-taupe-timeline';
    if (n.includes('cover')) return 'cover-letter';
    if (n.includes('formal')) return 'formal-classic';
    if (n.includes('classic')) return 'classic-dark';
    if (n.includes('elegant')) return 'elegant-frame';
    if (n.includes('clean')) return 'clean-sidebar';
    if (n.includes('modern')) return 'modern-split';
    return 'professional';
  }

  getAccent(t: AdminTemplate): string {
    try {
      const colors = typeof t.default_colors === 'string' ? JSON.parse(t.default_colors) : t.default_colors;
      return Array.isArray(colors) && colors.length ? colors[0] : '#667B97';
    } catch { return '#667B97'; }
  }

  toggleActive(t: AdminTemplate) {
    this.http.patch(`/api/v1/admin/templates/${t.id}/toggle-active`, {}).subscribe({
      next: () => { this.toast.success(t.is_active ? 'Template disabled' : 'Template enabled'); this.load(); },
      error: () => this.toast.error('Failed to update template')
    });
  }

  confirmRemove(t: AdminTemplate) {
    this.alertTemplate.set(t);
  }

  removeTemplate(t: AdminTemplate) {
    this.http.delete(`/api/v1/admin/templates/${t.id}`).subscribe({
      next: () => { this.alertTemplate.set(null); this.toast.success('Template deleted'); this.load(); },
      error: () => { this.alertTemplate.set(null); this.toast.error('Failed to delete template'); }
    });
  }
}
