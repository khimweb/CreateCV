import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ReportRow {
  bucket?: string;
  date?: string;
  orders: number;
  revenue_cents: number;
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100">Reports</h1>

      <div class="flex flex-wrap gap-2 items-center">
        <input type="date" [(ngModel)]="from" (ngModelChange)="load()"
               class="px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-sky-200
                      dark:border-sky-500/30 text-sm transition-all duration-300 ease-in-out" />
        <span class="text-slate-400 text-sm">to</span>
        <input type="date" [(ngModel)]="to" (ngModelChange)="load()"
               class="px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-sky-200
                      dark:border-sky-500/30 text-sm transition-all duration-300 ease-in-out" />

        <select [(ngModel)]="groupBy" (ngModelChange)="load()"
                class="px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-sky-200
                       dark:border-sky-500/30 text-sm transition-all duration-300 ease-in-out">
          <option value="timeOfDay">By time of day</option>
          <option value="date">By date</option>
        </select>
      </div>
    </div>

    <div class="rounded-2xl overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                border border-white/40 dark:border-sky-500/20 shadow-md">
      <table class="w-full text-sm">
        <thead class="bg-sky-50/60 dark:bg-sky-500/10 text-slate-500 dark:text-sky-300">
          <tr>
            <th class="text-left px-5 py-3 font-medium">{{ groupBy === 'date' ? 'Date' : 'Time of day' }}</th>
            <th class="text-left px-5 py-3 font-medium">Orders</th>
            <th class="text-left px-5 py-3 font-medium">Revenue</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track (row.bucket || row.date)) {
            <tr class="border-t border-sky-100 dark:border-sky-500/10">
              <td class="px-5 py-3 capitalize text-slate-700 dark:text-sky-100">{{ row.bucket || row.date }}</td>
              <td class="px-5 py-3 text-slate-600 dark:text-sky-200">{{ row.orders }}</td>
              <td class="px-5 py-3 text-slate-600 dark:text-sky-200">\${{ (row.revenue_cents / 100).toFixed(2) }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class AdminReportsComponent implements OnInit {
  rows = signal<ReportRow[]>([]);
  from = '';
  to = '';
  groupBy: 'timeOfDay' | 'date' = 'timeOfDay';

  constructor(private http: HttpClient) {}

  ngOnInit() { this.load(); }

  load() {
    this.http.get<{ rows: ReportRow[] }>('/api/v1/admin/reports', {
      params: { from: this.from, to: this.to, groupBy: this.groupBy },
    }).subscribe(({ rows }) => this.rows.set(rows));
  }
}
