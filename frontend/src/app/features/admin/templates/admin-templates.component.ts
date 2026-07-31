import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface AdminTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string;
  is_active: boolean;
  sold_count: number;
  avg_rating: number;
}

@Component({
  selector: 'app-admin-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100">Templates</h1>
      <div class="flex gap-2">
        <select [(ngModel)]="category" (ngModelChange)="load()"
                class="px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-sky-200
                       dark:border-sky-500/30 text-sm transition-all duration-300 ease-in-out">
          <option value="">All categories</option>
          <option value="general">General</option>
          <option value="modern">Modern</option>
          <option value="creative">Creative</option>
          <option value="executive">Executive</option>
        </select>
        <input [(ngModel)]="search" (ngModelChange)="load()" placeholder="Search templates"
               class="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-sky-200
                      dark:border-sky-500/30 text-sm transition-all duration-300 ease-in-out w-56" />
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      @for (t of templates(); track t.id) {
        <div class="rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                    border border-white/40 dark:border-sky-500/20 shadow-md
                    transition-all duration-300 ease-in-out hover:scale-[1.02]">
          <button type="button" (click)="preview.set(t)" class="w-full">
            <img [src]="t.thumbnail_url" [alt]="t.name" class="w-full h-48 object-cover" />
          </button>
          <div class="p-4">
            <p class="font-medium text-slate-800 dark:text-sky-100">{{ t.name }}</p>
            <p class="text-xs text-slate-500 dark:text-sky-300 mb-3">{{ t.category }} · {{ t.sold_count }} sold · {{ t.avg_rating }}★</p>
            <button type="button" (click)="toggleActive(t)"
                    class="w-full py-2 rounded-xl text-xs font-medium transition-all duration-300 ease-in-out
                           hover:scale-105 active:scale-95"
                    [class.bg-emerald-100]="t.is_active" [class.text-emerald-700]="t.is_active"
                    [class.bg-red-100]="!t.is_active" [class.text-red-700]="!t.is_active">
              {{ t.is_active ? 'Active — click to disable' : 'Inactive — click to enable' }}
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Preview modal -->
    @if (preview(); as p) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
           (click)="preview.set(null)">
        <div class="max-w-2xl w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl" (click)="$event.stopPropagation()">
          <img [src]="p.thumbnail_url" [alt]="p.name" class="w-full max-h-[70vh] object-contain bg-slate-100 dark:bg-slate-800" />
          <div class="p-4 flex items-center justify-between">
            <p class="font-medium text-slate-800 dark:text-sky-100">{{ p.name }}</p>
            <button type="button" (click)="preview.set(null)"
                    class="px-4 py-2 rounded-xl bg-sky-700 text-white text-sm hover:scale-105 active:scale-95
                           transition-all duration-300 ease-in-out">Close</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminTemplatesComponent implements OnInit {
  templates = signal<AdminTemplate[]>([]);
  preview = signal<AdminTemplate | null>(null);
  category = '';
  search = '';

  constructor(private http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<{ templates: AdminTemplate[] }>('/api/v1/admin/templates', {
      params: { category: this.category, search: this.search },
    }).subscribe(({ templates }) => this.templates.set(templates));
  }

  toggleActive(t: AdminTemplate) {
    this.http.patch(`/api/v1/admin/templates/${t.id}/toggle-active`, {}).subscribe(() => this.load());
  }
}
