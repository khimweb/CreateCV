import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="min-h-screen flex items-center justify-center px-4 pt-24 pb-12
                     bg-sky-50 dark:bg-[#0F172A] transition-all duration-300 ease-in-out">
      <form [formGroup]="form" (ngSubmit)="submit()"
            class="w-full max-w-lg p-8 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                   border border-white/40 dark:border-sky-500/20 shadow-[0_8px_32px_rgba(2,132,199,0.15)]">
        <h1 class="text-2xl font-semibold text-slate-800 dark:text-sky-100 mb-1">Get in touch</h1>
        <p class="text-sm text-slate-500 dark:text-sky-300 mb-6">Questions, feedback, or partnership ideas — we read everything.</p>

        <label class="block text-sm text-slate-600 dark:text-sky-200 mb-1">Name</label>
        <input formControlName="name" [ngClass]="inputClass" class="w-full mb-4" />

        <label class="block text-sm text-slate-600 dark:text-sky-200 mb-1">Email</label>
        <input formControlName="email" type="email" [ngClass]="inputClass" class="w-full mb-4" />

        <label class="block text-sm text-slate-600 dark:text-sky-200 mb-1">Subject</label>
        <input formControlName="subject" [ngClass]="inputClass" class="w-full mb-4" />

        <label class="block text-sm text-slate-600 dark:text-sky-200 mb-1">Message</label>
        <textarea formControlName="message" rows="5" [ngClass]="inputClass" class="w-full mb-6"></textarea>

        @if (status() === 'sent') {
          <p class="text-sm text-emerald-600 dark:text-emerald-400 mb-4">Thanks — we'll get back to you soon.</p>
        }
        @if (status() === 'error') {
          <p class="text-sm text-red-500 mb-4">Something went wrong. Please try again.</p>
        }

        <button type="submit" [disabled]="form.invalid || status() === 'sending'"
                class="w-full py-2.5 rounded-xl bg-sky-700 dark:bg-sky-600 text-white font-medium
                       shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100
                       transition-all duration-300 ease-in-out">
          Send message
        </button>
      </form>
    </section>
  `,
})
export class ContactComponent {
  readonly inputClass =
    'px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-sky-200 ' +
    'dark:border-sky-500/30 focus:outline-none focus:ring-2 focus:ring-sky-500 ' +
    'transition-all duration-300 ease-in-out';

  status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');

  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.status.set('sending');
    this.http.post('/api/v1/contact', this.form.getRawValue()).subscribe({
      next: () => { this.status.set('sent'); this.form.reset(); },
      error: () => this.status.set('error'),
    });
  }
}
