import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-framed-cover-letter-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="framed-cl-container"
      [style.--fs.px]="fontSize"
      [style.--fw]="fontWeight"
      [style.--lh]="lineHeight"
      [style.--font]="fontFamily"
      [style.--accent]="accent"
    >
      <div class="framed-cl-page">
        <!-- Header: Centered uppercase serif name, title, address -->
        <header class="fcl-header">
          <h1 class="fcl-name">{{ (name || 'FELICITY KENDWELL').toUpperCase() }}</h1>
          @if (jobTitle || !name) {
            <div class="fcl-title">{{ jobTitle || 'Internship' }}</div>
          }
          @if (location || !name) {
            <div class="fcl-address">{{ location || '20 Park Street, London Bridge, London, SE1 9EL' }}</div>
          }
        </header>

        <!-- Contact Bar: Split Phone (Left) and Email (Right) -->
        <div class="fcl-contact-bar">
          <div class="fcl-contact-left">
            <span class="fcl-phone">{{ phone || '020 7950 5505' }}</span>
          </div>
          <div class="fcl-contact-right">
            <span class="fcl-email">{{ email || 'FelicityK@yahoo.com' }}</span>
          </div>
        </div>
        <hr class="fcl-divider" />

        <!-- Recipient Information (Left aligned) -->
        <div class="fcl-recipient">
          @if (resolvedRecipient.name) {
            <div class="fcl-rec-name">{{ resolvedRecipient.name }}</div>
          }
          @if (resolvedRecipient.dept) {
            <div class="fcl-rec-dept">{{ resolvedRecipient.dept }}</div>
          }
          @if (subject) {
            <div class="fcl-subject">Subject: {{ subject }}</div>
          }
        </div>

        <!-- Greeting -->
        <div class="fcl-greeting">{{ greeting || 'Dear Mr. Vince,' }}</div>

        <!-- Body Paragraphs -->
        <div class="fcl-body">
          @for (para of resolvedParagraphs; track $index) {
            <p>{{ para }}</p>
          }
        </div>

        <!-- Closing & Signature -->
        <div class="fcl-closing-block">
          <div class="fcl-closing">{{ closing || 'Regards' }}</div>
          <div class="fcl-signature-name">{{ name || 'Felicity Kendwell' }}</div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    .framed-cl-container {
      --fs: 11px;
      --fw: 400;
      --lh: 1.65;
      --font: 'Times New Roman', Times, 'Baskerville', Georgia, serif;
      --accent: #111827;

      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      font-family: var(--font);
      font-size: var(--fs);
      font-weight: var(--fw);
      line-height: var(--lh);
      background-color: #ffffff;
      padding: 56px 60px;
      color: #111;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .framed-cl-page {
      background: #ffffff;
      width: 100%;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    /* Header */
    .fcl-header {
      text-align: center;
      margin-bottom: 18px;
    }

    .fcl-name {
      font-family: var(--font);
      font-size: calc(var(--fs) * 2.1);
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #111827;
      margin: 0 0 6px;
      line-height: 1.25;
    }

    .fcl-title {
      font-size: calc(var(--fs) * 1.25);
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 6px;
    }

    .fcl-address {
      font-size: calc(var(--fs) * 1.05);
      color: #374151;
      margin: 0;
    }

    /* Contact Row */
    .fcl-contact-bar {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 0 2px 6px;
    }

    .fcl-phone {
      font-size: calc(var(--fs) * 1.1);
      font-weight: 700;
      color: #111827;
    }

    .fcl-email {
      font-size: calc(var(--fs) * 1.05);
      font-weight: 600;
      color: #111827;
    }

    .fcl-divider {
      border: none;
      border-top: 1.5px solid var(--accent, #222222);
      margin: 0 0 22px;
    }

    /* Recipient */
    .fcl-recipient {
      margin-bottom: 24px;
      text-align: left;
    }

    .fcl-rec-name {
      font-size: calc(var(--fs) * 1.08);
      font-weight: 700;
      color: #111827;
      margin-bottom: 3px;
    }

    .fcl-rec-dept {
      font-size: calc(var(--fs) * 1.02);
      font-weight: 400;
      color: #374151;
    }

    .fcl-subject {
      font-size: calc(var(--fs) * 1.02);
      font-weight: 600;
      color: #111827;
      margin-top: 6px;
    }

    /* Greeting */
    .fcl-greeting {
      font-size: calc(var(--fs) * 1.05);
      font-weight: 500;
      color: #111827;
      margin-bottom: 16px;
      text-align: left;
    }

    /* Body */
    .fcl-body {
      flex: 1;
      margin-bottom: 24px;
      text-align: left;
    }

    .fcl-body p {
      font-size: calc(var(--fs) * 1.05);
      color: #1a1a1a;
      line-height: var(--lh);
      text-align: justify;
      margin: 0 0 13px;
    }

    /* Closing & Signature */
    .fcl-closing-block {
      margin-top: auto;
      text-align: left;
    }

    .fcl-closing {
      font-size: calc(var(--fs) * 1.05);
      color: #111827;
      margin-bottom: 24px;
    }

    .fcl-signature-name {
      font-size: calc(var(--fs) * 1.05);
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    /* Print */
    @media print {
      :host {
        display: block;
      }
      .framed-cl-container {
        width: 210mm !important;
        min-height: 297mm !important;
        box-sizing: border-box !important;
        margin: 0 auto !important;
        box-shadow: none !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      @page {
        size: A4 portrait;
        margin: 0;
      }
    }
  `],
})
export class FramedCoverLetterCvComponent {
  @Input() accent = '#222222';
  @Input() name = '';
  @Input() jobTitle = '';
  @Input() phone = '';
  @Input() email = '';
  @Input() location = '';
  @Input() recipientName = '';
  @Input() recipientDept = '';
  @Input() subject = '';
  @Input() greeting = '';
  @Input() closing = '';
  @Input() bodyText = '';
  @Input() fontSize = 11;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.65;
  @Input() fontFamily = "'Times New Roman', Times, 'Baskerville', Georgia, serif";
  @Input() sectionOrder: string[] = [];

  get resolvedRecipient(): { name: string; dept: string } {
    if (this.recipientName) {
      return {
        name: this.recipientName,
        dept: this.recipientDept || '',
      };
    }
    if (this.recipientDept) {
      if (this.recipientDept.includes('\n')) {
        const lines = this.recipientDept.split('\n').map((l) => l.trim()).filter(Boolean);
        return { name: lines[0] || '', dept: lines.slice(1).join('\n') || '' };
      }
      return { name: this.recipientDept, dept: '' };
    }
    return {
      name: 'Gabriel Vince',
      dept: 'London Bridge Support Services',
    };
  }

  get resolvedParagraphs(): string[] {
    if (this.bodyText && this.bodyText.trim()) {
      return this.bodyText.split('\n\n').map((p) => p.trim()).filter(Boolean);
    }
    return [
      'I am applying for the internship role in Business Administration at your esteemed organisation.',
      'I am currently in year 2 of a Masters in Business Administration and I\'m eager to gain experience, which hopefully would help me to garner a full time position in your company in the future.',
      'The skills I possess would make me an ideal fit for the role, as I\'m meticulous with detail, have a can-do positive attitude, and fit in well in different environments.',
      'I enjoy working as part of a team, but I am equally comfortable working on my own initiative.',
      'London Bridge Support Services is a company that I\'m excited at the prospect of working for, as you have an outstanding reputation for delivering a quality service to customers. This is shown by the awards you have claimed over the years and your reviews on Glassdoor etc.',
      'My long-term career goals are to work with a company that offers challenges and develops employees, and this internship would help give me the knowledge and experience I need to achieve this.',
      'It would welcome the opportunity to discuss my experience in more detail and, of course, hear more about your organisation.',
    ];
  }
}
