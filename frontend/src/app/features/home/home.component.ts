import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Sparkles, Palette, Download, Star } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <!-- Hero -->
    <section class="pt-40 pb-20 px-4 text-center max-w-3xl mx-auto">
      <h1 class="text-4xl sm:text-5xl font-semibold text-slate-800 dark:text-sky-100 mb-4">
        Build a CV that gets you the interview.
      </h1>
      <p class="text-slate-600 dark:text-sky-300 mb-8">
        Pick a template, fill it in, and download a polished PDF — all in one place.
      </p>
      <a routerLink="/templates"
         class="inline-block px-8 py-3 rounded-2xl bg-sky-700 dark:bg-sky-600 text-white font-medium
                shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">
        Browse Templates
      </a>
    </section>

    <!-- Features -->
    <section class="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
      @for (f of features; track f.title) {
        <div class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                    border border-white/40 dark:border-sky-500/20 shadow-md
                    hover:scale-105 transition-all duration-300 ease-in-out">
          <lucide-icon [img]="f.icon" class="w-6 h-6 text-sky-600 dark:text-sky-400 mb-3" />
          <p class="font-medium text-slate-800 dark:text-sky-100 mb-1">{{ f.title }}</p>
          <p class="text-sm text-slate-500 dark:text-sky-300">{{ f.desc }}</p>
        </div>
      }
    </section>

    <!-- Stats -->
    <section class="max-w-5xl mx-auto px-4 py-16 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
      @for (s of stats; track s.label) {
        <div>
          <p class="text-3xl font-semibold text-sky-700 dark:text-sky-300">{{ s.value }}</p>
          <p class="text-sm text-slate-500 dark:text-sky-400">{{ s.label }}</p>
        </div>
      }
    </section>

    <!-- Testimonials -->
    <section class="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
      @for (t of testimonials; track t.name) {
        <div class="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                    border border-white/40 dark:border-sky-500/20 shadow-md">
          <p class="text-sm text-slate-600 dark:text-sky-200 mb-4">&ldquo;{{ t.quote }}&rdquo;</p>
          <p class="text-sm font-medium text-slate-800 dark:text-sky-100">{{ t.name }}</p>
        </div>
      }
    </section>

    <!-- CTA -->
    <section class="max-w-3xl mx-auto px-4 py-20 text-center">
      <h2 class="text-2xl font-semibold text-slate-800 dark:text-sky-100 mb-4">Ready to get started?</h2>
      <a routerLink="/templates"
         class="inline-block px-8 py-3 rounded-2xl bg-sky-700 dark:bg-sky-600 text-white font-medium
                shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">
        Create Your CV
      </a>
    </section>
  `,
})
export class HomeComponent {
  readonly features = [
    { icon: Sparkles, title: 'Modern templates', desc: 'Dozens of designs built for real hiring pipelines.' },
    { icon: Palette, title: 'Live color themes', desc: 'Switch accent colors instantly and see the change live.' },
    { icon: Download, title: 'One-click PDF', desc: 'Export a print-ready PDF whenever you\'re ready.' },
  ];

  readonly stats = [
    { value: '12k+', label: 'CVs created' },
    { value: '48', label: 'Templates' },
    { value: '4.8', label: 'Avg. rating' },
    { value: '9k+', label: 'Downloads' },
  ];

  readonly testimonials = [
    { name: 'Dara K.', quote: 'Had a finished CV in ten minutes and landed an interview the same week.' },
    { name: 'Sophea L.', quote: 'The live preview made it so easy to see exactly what I was sending.' },
    { name: 'Vibol S.', quote: 'Clean templates that don\'t look like everyone else\'s.' },
  ];
}
