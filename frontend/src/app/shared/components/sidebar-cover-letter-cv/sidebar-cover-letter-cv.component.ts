import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, Phone, MapPin } from 'lucide-angular';

@Component({
  selector: 'app-sidebar-cover-letter-cv',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <article
      class="scl-container"
      [style.--fs.px]="fontSize"
      [style.--fw]="fontWeight"
      [style.--lh]="lineHeight"
      [style.--font]="fontFamily"
      [style.--accent]="accent"
    >
      <!-- Header: Name + Subtitle -->
      <header class="scl-header">
        <h1 class="scl-name">{{ name || 'Daniel Murray' }}</h1>
        <div class="scl-title">{{ (jobTitle || 'ADMINISTRATIVE ASSISTANT').toUpperCase() }}</div>
      </header>

      <!-- Bold Accent Rule -->
      <div class="scl-accent-bar"></div>

      <!-- Content: Split 2 columns -->
      <div class="scl-body-grid">
        <!-- Main Column: Recipient, Greeting, Paragraphs, Sign-off -->
        <main class="scl-main">
          <!-- Recipient info -->
          <div class="scl-recipient">
            <div class="scl-to">To: {{ resolvedRecipient.name }}</div>
            @if (resolvedRecipient.dept) {
              <div class="scl-company">{{ resolvedRecipient.dept }}</div>
            }
            @if (subject) {
              <div class="scl-subject">Subject: {{ subject }}</div>
            }
          </div>

          <!-- Greeting -->
          <div class="scl-greeting">{{ greeting || 'Dear Ms. Woods,' }}</div>

          <!-- Letter Body -->
          <div class="scl-content">
            @for (block of resolvedBlocks; track $index) {
              @if (block.type === 'bullets') {
                <ul class="scl-bullet-list">
                  @for (item of block.items; track $index) {
                    <li>{{ item }}</li>
                  }
                </ul>
              } @else {
                <p>{{ block.text }}</p>
              }
            }
          </div>

          <!-- Closing & Signature -->
          <div class="scl-closing-block">
            <div class="scl-closing">{{ closing || 'Sincerely,' }}</div>
            <div class="scl-signature-name">{{ name || 'Daniel Murray' }}</div>
          </div>
        </main>

        <!-- Right Sidebar: Contact Info -->
        <aside class="scl-sidebar">
          @if (email || !name) {
            <div class="scl-contact-item">
              <span class="scl-icon-box"><lucide-icon [img]="Mail" class="w-3.5 h-3.5" /></span>
              <span class="scl-contact-text">{{ email || 'murray.dani3@gmail.com' }}</span>
            </div>
          }
          @if (phone || !name) {
            <div class="scl-contact-item">
              <span class="scl-icon-box"><lucide-icon [img]="Phone" class="w-3.5 h-3.5" /></span>
              <span class="scl-contact-text">{{ phone || '(469) 732-9961' }}</span>
            </div>
          }
          @if (location || !name) {
            <div class="scl-contact-item">
              <span class="scl-icon-box"><lucide-icon [img]="MapPin" class="w-3.5 h-3.5" /></span>
              <span class="scl-contact-text">{{ location || '2400 President Ave, Los Angeles, CA 90710, United States' }}</span>
            </div>
          }
        </aside>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    .scl-container {
      --fs: 10px;
      --fw: 400;
      --lh: 1.55;
      --font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --accent: #B91C1C;

      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      font-family: var(--font);
      font-size: var(--fs);
      font-weight: var(--fw);
      line-height: var(--lh);
      background-color: #ffffff;
      padding: 44px 48px;
      color: #1f2937;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Header */
    .scl-header {
      margin-bottom: 2px;
    }

    .scl-name {
      font-family: var(--font);
      font-size: calc(var(--fs) * 2.4);
      font-weight: 800;
      font-style: italic;
      color: var(--accent);
      margin: 0 0 4px;
      line-height: 1.15;
    }

    .scl-title {
      font-size: calc(var(--fs) * 0.95);
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #9ca3af;
      margin: 0;
    }

    /* Bold horizontal accent bar */
    .scl-accent-bar {
      height: 4px;
      background-color: var(--accent);
      margin: 16px 0 24px;
      width: 100%;
      border-radius: 1px;
    }

    /* Split Grid */
    .scl-body-grid {
      display: grid;
      grid-template-columns: 1fr 200px;
      gap: 24px;
      flex: 1;
      align-items: start;
    }

    /* Left Main */
    .scl-main {
      min-width: 0;
    }

    .scl-recipient {
      margin-bottom: 16px;
    }

    .scl-to {
      font-size: calc(var(--fs) * 1.15);
      font-weight: 700;
      color: #111827;
    }

    .scl-company {
      font-size: calc(var(--fs) * 0.88);
      color: #9ca3af;
      margin-top: 1px;
    }

    .scl-subject {
      font-size: calc(var(--fs) * 1.0);
      font-weight: 600;
      color: #111827;
      margin-top: 4px;
    }

    .scl-greeting {
      font-size: calc(var(--fs) * 1.02);
      font-weight: 500;
      color: #111827;
      margin-bottom: 12px;
    }

    .scl-content {
      margin-bottom: 22px;
    }

    .scl-content p {
      font-size: calc(var(--fs) * 0.98);
      color: #27272a;
      line-height: var(--lh);
      text-align: justify;
      margin: 0 0 11px;
    }

    .scl-bullet-list {
      list-style-type: disc;
      padding-left: 20px;
      margin: 0 0 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .scl-bullet-list li {
      font-size: calc(var(--fs) * 0.96);
      color: #27272a;
      line-height: calc(var(--lh) * 0.96);
    }

    /* Closing */
    .scl-closing-block {
      margin-top: auto;
    }

    .scl-closing {
      font-size: calc(var(--fs) * 1.0);
      color: #111827;
      margin-bottom: 18px;
    }

    .scl-signature-name {
      font-size: calc(var(--fs) * 1.0);
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    /* Right Sidebar */
    .scl-sidebar {
      border-left: 1px solid #e5e7eb;
      padding-left: 18px;
      padding-top: 60px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      word-break: break-word;
    }

    .scl-contact-item {
      display: flex;
      align-items: flex-start;
      gap: 7px;
    }

    .scl-icon-box {
      color: var(--accent);
      flex-shrink: 0;
      margin-top: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .scl-contact-text {
      font-size: calc(var(--fs) * 0.92);
      color: #374151;
      line-height: 1.35;
    }

    /* Print */
    @media print {
      :host {
        display: block;
      }
      .scl-container {
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
export class SidebarCoverLetterCvComponent {
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly MapPin = MapPin;

  @Input() accent = '#B91C1C';
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
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.55;
  @Input() fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
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
      name: 'Ms Woods',
      dept: 'Spike',
    };
  }

  get resolvedBlocks(): Array<{ type: 'paragraph'; text: string } | { type: 'bullets'; items: string[] }> {
    if (this.bodyText && this.bodyText.trim()) {
      const rawBlocks = this.bodyText.split('\n\n').map((p) => p.trim()).filter(Boolean);
      return rawBlocks.map((block) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        const allBullets = lines.length > 0 && lines.every((l) => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'));
        if (allBullets) {
          return {
            type: 'bullets',
            items: lines.map((l) => l.replace(/^[•\-\*]\s*/, '')),
          };
        }
        return {
          type: 'paragraph',
          text: block,
        };
      });
    }

    return [
      { type: 'paragraph', text: 'Since my childhood, I have experienced a deep pleasure in keeping every plate spinning.' },
      {
        type: 'paragraph',
        text: 'When a Spike employee requests administrative assistance, they need to know that you will not only complete what they ask, but also do it to the very highest standard. This requires practiced organizational skills, mental agility and a singular focus on tasks. In my five years of admin experience, I have never missed a deadline and always received the best appraisals for quality of work. Admin assistants need to get things done and do them well.',
      },
      {
        type: 'paragraph',
        text: 'You expect your administrative assistants to be familiar with the latest technology, utilize the most cutting-edge communication methods and organize their time so that they can be of the most use to the most people. My weekly productivity blog has 5,500 subscribers, so the latest thinking and practice is not foreign to me.',
      },
      { type: 'paragraph', text: 'Five years of administration experience make me the perfect candidate:' },
      {
        type: 'bullets',
        items: [
          'Exclusive experience in consumer fashion. I know the demands of the industry.',
          'Work ethic – complete 80-100 individual tasks a day – I just love ticking them off.',
          'Ambitions to grow. Am about to complete a distance learning business degree.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Busy days put a smile on my face. When tasks are coming at me thick and fast, I don\'t let anything drop off the table unless I know that I have done my best. In my role as an administrative assistant, adopting a service-first attitude with all those I work with helps me to make their working days more successful by filling in the gaps.',
      },
      {
        type: 'paragraph',
        text: 'If I have the skills to do a great job, there is no task that I would not take on. If I don\'t possess the skills, I will learn them or ask someone else to help me.',
      },
      {
        type: 'paragraph',
        text: 'If it sounds like I might be able to make a difference to your Spike family, I would be grateful if you would consider my application. I hope to be a value-added and reliable addition to your administrative team.',
      },
    ];
  }
}
