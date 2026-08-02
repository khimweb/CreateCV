import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Trash2, Search, Eye } from 'lucide-angular';

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
  imports: [CommonModule, FormsModule, LucideAngularModule],
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

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      @for (t of templates(); track t.id) {
        <div class="rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                    shadow-sm hover:shadow-md transition-all duration-200 group">
          <div class="relative">
            <img [src]="t.thumbnail_url" [alt]="t.name" class="w-full h-44 object-cover" />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center gap-2 transition-all duration-200 opacity-0 group-hover:opacity-100">
              <button type="button" (click)="preview.set(t)"
                      class="p-2 rounded-full bg-white/90 text-slate-700 hover:scale-110 transition-transform">
                <lucide-icon [img]="Eye" class="w-4 h-4" />
              </button>
              <button type="button" (click)="confirmRemove(t)"
                      class="p-2 rounded-full bg-red-500/90 text-white hover:scale-110 transition-transform">
                <lucide-icon [img]="Trash2" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="p-4">
            <p class="font-medium text-slate-800 dark:text-white text-sm">{{ t.name }}</p>
            <p class="text-xs text-slate-400 mt-1">{{ t.category }} · {{ t.sold_count }} sold · {{ t.avg_rating }}★</p>
            <button type="button" (click)="toggleActive(t)"
                    class="mt-3 w-full py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
                    [ngClass]="{
                      'bg-emerald-50 text-emerald-600': t.is_active,
                      'bg-red-50 text-red-500': !t.is_active
                    }">
              {{ t.is_active ? '● Active' : '○ Inactive' }}
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Preview modal -->
    @if (preview(); as p) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
           (click)="preview.set(null)">
        <div class="max-w-2xl w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl" (click)="$event.stopPropagation()">
          <img [src]="p.thumbnail_url" [alt]="p.name" class="w-full max-h-[70vh] object-contain bg-slate-100 dark:bg-slate-800" />
          <div class="p-4 flex items-center justify-between">
            <p class="font-medium text-slate-800 dark:text-white">{{ p.name }}</p>
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

  templates = signal<AdminTemplate[]>([]);
  preview = signal<AdminTemplate | null>(null);
  alertTemplate = signal<AdminTemplate | null>(null);
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

  confirmRemove(t: AdminTemplate) {
    this.alertTemplate.set(t);
  }

  removeTemplate(t: AdminTemplate) {
    this.http.delete(`/api/v1/admin/templates/${t.id}`).subscribe(() => {
      this.alertTemplate.set(null);
      this.load();
    });
  }
}
