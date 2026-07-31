import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100 mb-6">About</h1>

    <div class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                border border-white/40 dark:border-sky-500/20 shadow-md max-w-md space-y-2 text-sm">
      <p><strong class="text-slate-800 dark:text-sky-100">CV Creator Admin</strong></p>
      <p class="text-slate-500 dark:text-sky-300">Version 1.0.0</p>
      <p class="text-slate-500 dark:text-sky-300">Angular + Node.js/Express + PostgreSQL</p>
      <p class="text-slate-500 dark:text-sky-300">Support: sokkhim519&#64;gmail.com</p>
    </div>
  `,
})
export class AdminAboutComponent {}
