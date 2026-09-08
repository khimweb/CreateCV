import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minimalist-cover-letter-cv',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article
      class="mcl-container"
      [style.--fs.px]="fontSize"
      [style.--fw]="fontWeight"
      [style.--lh]="lineHeight"
      [style.--font]="fontFamily"
      [style.--accent]="accent"
    >
      <!-- Top Header: Name + Subtitle -->
      <header class="mcl-header">
        <h1 class="mcl-name">{{ name || 'Sophie Walton' }}</h1>
        <div class="mcl-title">{{ jobTitle || 'Customer Service' }}</div>
      </header>

      <!-- 2-Column Body Layout -->
      <div class="mcl-body-grid">
        <!-- Left Column: To & From Details -->
        <aside class="mcl-meta-col">
          <!-- "To" Block -->
          <div class="mcl-block">
            <div class="mcl-label">To</div>
            <div class="mcl-accent-name" [style.color]="accent">{{ resolvedRecipient.name }}</div>
            @if (resolvedRecipient.dept) {
              <div class="mcl-muted-text">{{ resolvedRecipient.dept }}</div>
            }
          </div>

          <!-- "From" Block -->
          <div class="mcl-block mcl-from-block">
            <div class="mcl-label">From</div>
            <div class="mcl-accent-name" [style.color]="accent">{{ name || 'Sophie Walton' }}</div>
            <div class="mcl-muted-text">{{ jobTitle || 'Customer Service' }}</div>

            @if (location || !name) {
              <div class="mcl-detail-group mcl-address">
                {{ location || '1 Ray Hall Lane, Birmingham,\nBirmingham, B43 6GG, United Kingdom' }}
              </div>
            }

            @if (phone || !name) {
              <div class="mcl-detail-group mcl-phone">
                {{ phone || '0121 657 9000' }}
              </div>
            }

            @if (email || !name) {
              <div class="mcl-detail-group mcl-email">
                {{ email || 'vc@yahoo.co.uk' }}
              </div>
            }
          </div>
        </aside>

        <!-- Right Column: Date, Greeting, Narrative & Bullets, Sign-off -->
        <main class="mcl-letter-col">
          <!-- Date -->
          <div class="mcl-date">{{ resolvedDate }}</div>

          <!-- Greeting -->
          <div class="mcl-greeting">{{ greeting || ('Dear ' + resolvedRecipient.name) }}</div>

          @if (subject) {
            <div class="mcl-subject">{{ subject }}</div>
          }

          <!-- Narrative Body -->
          <div class="mcl-content">
            @for (block of resolvedBlocks; track $index) {
              @if (block.type === 'bullets') {
                <ul class="mcl-bullet-list">
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
          <div class="mcl-closing-block">
            <div class="mcl-closing">{{ closing || 'Best regards,' }}</div>
            <div class="mcl-signature">{{ name || 'Sophie Walton' }}</div>
          </div>
        </main>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }

    .mcl-container {
      --fs: 10px;
      --fw: 400;
      --lh: 1.6;
      --font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --accent: #C59B58;

      width: 210mm;
      min-height: 297mm;
      box-sizing: border-box;
      font-family: var(--font);
      font-size: var(--fs);
      font-weight: var(--fw);
      line-height: var(--lh);
      background-color: #ffffff;
      padding: 48px 52px;
      color: #1f2937;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Top Header */
    .mcl-header {
      margin-bottom: 36px;
    }

    .mcl-name {
      font-family: var(--font);
      font-size: calc(var(--fs) * 2.6);
      font-weight: 600;
      color: #1e293b;
      letter-spacing: -0.015em;
      line-height: 1.15;
      margin: 0 0 4px;
    }

    .mcl-title {
      font-size: calc(var(--fs) * 1.05);
      font-weight: 400;
      color: #64748b;
      margin: 0;
    }

    /* Grid Layout */
    .mcl-body-grid {
      display: grid;
      grid-template-columns: 190px 1fr;
      gap: 36px;
      flex: 1;
      align-items: start;
    }

    /* Left Metadata Column */
    .mcl-meta-col {
      display: flex;
      flex-direction: column;
      word-break: break-word;
    }

    .mcl-block {
      display: flex;
      flex-direction: column;
    }

    .mcl-from-block {
      margin-top: 32px;
    }

    .mcl-label {
      font-size: calc(var(--fs) * 1.0);
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
    }

    .mcl-accent-name {
      font-size: calc(var(--fs) * 1.0);
      font-weight: 600;
      line-height: 1.3;
      color: var(--accent);
    }

    .mcl-muted-text {
      font-size: calc(var(--fs) * 0.95);
      color: #64748b;
      margin-top: 2px;
      line-height: 1.35;
    }

    .mcl-detail-group {
      margin-top: 14px;
      font-size: calc(var(--fs) * 0.92);
      color: #64748b;
      line-height: 1.4;
    }

    .mcl-address {
      white-space: pre-line;
    }

    .mcl-phone,
    .mcl-email {
      color: #475569;
    }

    .mcl-email {
      word-break: break-all;
    }

    /* Right Letter Column */
    .mcl-letter-col {
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .mcl-date {
      font-size: calc(var(--fs) * 1.0);
      color: #1e293b;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .mcl-greeting {
      font-size: calc(var(--fs) * 1.0);
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 14px;
    }

    .mcl-subject {
      font-size: calc(var(--fs) * 1.0);
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 12px;
    }

    .mcl-content {
      margin-bottom: 20px;
    }

    .mcl-content p {
      font-size: calc(var(--fs) * 0.96);
      color: #1f2937;
      line-height: var(--lh);
      text-align: justify;
      margin: 0 0 12px;
    }

    .mcl-bullet-list {
      list-style-type: disc;
      padding-left: 20px;
      margin: 0 0 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .mcl-bullet-list li {
      font-size: calc(var(--fs) * 0.94);
      color: #1f2937;
      line-height: calc(var(--lh) * 0.95);
    }

    /* Closing */
    .mcl-closing-block {
      margin-top: 12px;
    }

    .mcl-closing {
      font-size: calc(var(--fs) * 1.0);
      color: #1e293b;
      margin-bottom: 16px;
    }

    .mcl-signature {
      font-size: calc(var(--fs) * 1.0);
      font-weight: 600;
      color: #1e293b;
    }

    /* Print */
    @media print {
      :host {
        display: block;
      }
      .mcl-container {
        width: 210mm !important;
        max-width: 210mm !important;
        min-height: 297mm !important;
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
export class MinimalistCoverLetterCvComponent {
  @Input() accent = '#C59B58';
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
  @Input() date = '';
  @Input() fontSize = 10;
  @Input() fontWeight = 400;
  @Input() lineHeight = 1.6;
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
      name: 'Mr. Felsted',
      dept: 'Home Depot',
    };
  }

  get resolvedDate(): string {
    if (this.date) return this.date;
    return '06/07/2020';
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
      {
        type: 'paragraph',
        text: 'When serving customers, I put myself in their shoes and stay there until their needs are met.',
      },
      {
        type: 'paragraph',
        text: 'Not everyone knows the answers when it comes to home improvement projects: when they come to Home Depot, they come for the advice as much as the products. Customer service to them is as much about walking out with solutions as well as products. With thirty years of experience in running a hardware store, customers come back because you help them as well as sell to them. Now I want to help your customers.',
      },
      {
        type: 'paragraph',
        text: 'It is central to your culture that you expect your people to be good team players, make sure that the right product finds the right person and to maintain a high level of energy and enthusiasm at all times. You need great listeners, willing assistants and product champions.',
      },
      {
        type: 'paragraph',
        text: 'A 31-year career of retail service experience would make me the ideal candidate:',
      },
      {
        type: 'bullets',
        items: [
          'Personally served an average of 800 customers a week for thirty years',
          'Built my own home with the products from my store – home improvement smarts',
          'Customers trust employees who have experience and who are happy to share it.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Customer service has been a passion since I was serving mud pies to my sister as a child. While I might not have the energy to run my own store anymore, I am looking forward to focusing all my energies on the customers rather than being distracted by all the paperwork.',
      },
      {
        type: 'paragraph',
        text: 'I look forward to sharing some of my customer service stories and would be grateful for your consideration of my application. I would strive to be a dependable and productive addition to your customer service team.',
      },
    ];
  }
}
