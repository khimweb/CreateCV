import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cover-letter-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="cl" [style.--fs.px]="fontSize" [style.--fw]="fontWeight" [style.--lh]="lineHeight" [style.--font]="fontFamily" [style.--accent]="accent">

      <!-- Header: Name + Contact -->
      <header class="cl-header">
        <h1 class="cl-name">{{ name || 'YOUR NAME' }}</h1>
        <ul class="cl-contact">
          @if (location) { <li>Address: {{ location }}</li> }
          @if (phone) { <li>Phone: {{ phone }}</li> }
          @if (email) { <li>Email: {{ email }}</li> }
        </ul>
      </header>

      <hr class="cl-divider" />

      <!-- Recipient -->
      <div class="cl-recipient">
        @if (recipientDept) { <div class="cl-dept">{{ recipientDept }}</div> }
        @if (subject) { <div class="cl-subject">Subject: {{ subject }}</div> }
      </div>

      <!-- Greeting -->
      <div class="cl-greeting">{{ greeting || 'Dear Hiring Manager,' }}</div>

      <!-- Body paragraphs -->
      <div class="cl-body">
        @for (para of bodyParagraphs; track $index) {
          <p>{{ para }}</p>
        }
      </div>

      <!-- Closing -->
      <div class="cl-closing">
        <p>{{ closing || 'Yours sincerely,' }}</p>
      </div>

      <!-- Signature -->
      <div class="cl-signature">
        <p class="sig-name">{{ name || 'YOUR NAME' }}</p>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }
    .cl {
      --fs: 11px; --fw: 400; --lh: 1.6; --font: 'Times New Roman', Times, Georgia, serif; --accent: #1a5276;
      width: 210mm; min-height: 297mm; box-sizing: border-box;
      font-family: var(--font); font-size: var(--fs); font-weight: var(--fw); line-height: var(--lh);
      background: #fff; color: #111; padding: 48px 56px;
    }

    /* Header */
    .cl-header { margin-bottom: 8px; }
    .cl-name {
      font-family: Arial, Helvetica, sans-serif;
      font-size: calc(var(--fs) * 3.2); font-weight: 900;
      color: var(--accent); text-transform: uppercase;
      letter-spacing: 1px; margin: 0 0 10px;
    }
    .cl-contact {
      list-style: disc; padding-left: 18px;
      font-size: calc(var(--fs) * 1.1); color: #222;
      display: flex; flex-direction: column; gap: 3px;
    }

    /* Divider */
    .cl-divider { border: none; border-top: 2px solid var(--accent); margin: 14px 0 20px; }

    /* Recipient */
    .cl-recipient { margin-bottom: 16px; }
    .cl-dept { font-size: calc(var(--fs) * 1.2); font-weight: 700; color: #000; margin-bottom: 3px; }
    .cl-subject { font-size: calc(var(--fs) * 1.1); color: #222; }

    /* Greeting */
    .cl-greeting {
      font-size: calc(var(--fs) * 1.15); font-style: italic;
      color: #111; margin-bottom: 14px;
    }

    /* Body */
    .cl-body { margin-bottom: 24px; }
    .cl-body p {
      font-size: calc(var(--fs) * 1.15); color: #111;
      text-align: justify; margin: 0 0 12px;
    }

    /* Closing */
    .cl-closing { margin-bottom: 40px; }
    .cl-closing p { font-size: calc(var(--fs) * 1.15); color: #111; margin: 0; }

    /* Signature */
    .cl-signature { }
    .sig-name {
      font-size: calc(var(--fs) * 1.3); font-weight: 700;
      color: #000; text-transform: uppercase; margin: 0;
    }

    /* Print */
    @media print {
      :host { display: block; }
      .cl {
        width: 100% !important;
        min-height: 297mm !important;
        box-shadow: none !important;
      }
      @page { size: A4 portrait; margin: 0; }
    }
  `],
})
export class CoverLetterCvComponent {
  @Input() accent = '#1a5276';
  @Input() name = '';
  @Input() phone = '';
  @Input() email = '';
  @Input() location = '';
  @Input() recipientDept = 'Human Resource Department';
  @Input() subject = '';
  @Input() greeting = 'Dear Hiring Manager,';
  @Input() closing = 'Yours sincerely,';
  @Input() bodyText = '';
  @Input() fontSize = 11;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.6;
  @Input() fontFamily = "'Times New Roman', Times, Georgia, serif";

  get bodyParagraphs(): string[] {
    if (!this.bodyText) return [
      'I am writing to apply for this position. I am currently pursuing my degree and am highly motivated, detail-oriented, and eager to apply my knowledge and practical experience in a professional environment.',
      'I possess strong technical skills and have developed analytical and problem-solving abilities through academic projects and work experience.',
      'I am confident that my academic background, practical experience, and strong work ethic will allow me to contribute effectively. I am eager to learn, grow professionally, and support your organization\'s success.',
      'Thank you very much for considering my application. I would welcome the opportunity to attend an interview and further discuss how I can contribute to your team.',
    ];
    return this.bodyText.split('\n\n').filter(p => p.trim());
  }
}
