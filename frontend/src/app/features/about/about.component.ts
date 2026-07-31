import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snap-y snap-mandatory h-screen overflow-y-scroll">
      @for (section of sections; track section.title) {
        <section class="h-screen snap-start flex flex-col items-center justify-center px-6 text-center
                        bg-sky-50 dark:bg-[#0F172A] transition-all duration-300 ease-in-out">
          <h2 class="text-3xl font-semibold text-slate-800 dark:text-sky-100 mb-4">{{ section.title }}</h2>
          <p class="max-w-xl text-slate-600 dark:text-sky-300">{{ section.body }}</p>
        </section>
      }
    </div>
  `,
})
export class AboutComponent {
  readonly sections = [
    { title: 'Our vision', body: 'We believe a great CV shouldn\'t take a design degree to build. CV Creator gives everyone the tools professionals use, without the learning curve.' },
    { title: 'How it works', body: 'Pick a template, fill in your details in a guided workstation, and watch your CV update live before you download it.' },
    { title: 'Built for the job hunt', body: 'Every template is designed around what hiring teams actually scan for — clarity, structure, and relevant detail.' },
    { title: 'The technology', body: 'A modern Angular front end, a PostgreSQL-backed API, and real-time reactive previews keep the experience fast and reliable.' },
    { title: 'What\'s next', body: 'We\'re building more templates, deeper customization, and smarter guidance for every stage of your career.' },
  ];
}
