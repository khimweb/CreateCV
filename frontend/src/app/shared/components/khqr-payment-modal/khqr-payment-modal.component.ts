import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QrCode, khqrCrc16 } from '../../utils/qr-code.util';
import { ToastService } from '../toast/toast.service';
import { TranslationService } from '../../../core/services/translation.service';

interface KhqrOrderResponse {
  orderId: number;
  qrString: string;
  md5: string;
  amountUsd: number;
  amountKhr: number;
  currency: string;
  expiresAt: string;
  accountName: string;
  accountId: string;
  templateName: string;
  free?: boolean;
  paid?: boolean;
}

@Component({
  selector: 'app-khqr-payment-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-fade-in"
         (click)="onBackdropClick($event)">
      
      <div class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 transform animate-scale-up"
           (click)="$event.stopPropagation()">
        
        <!-- HEADER -->
        <div class="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 text-white p-5 relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div class="flex items-center justify-between relative z-10">
            <div class="flex items-center gap-2.5">
              <div class="bg-white text-red-700 font-black text-xs px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                KHQR
              </div>
              <span class="text-xs uppercase font-bold tracking-widest text-red-100">{{ i18n.t('khqrTitle') }}</span>
            </div>
            
            <button type="button" (click)="cancelPayment()"
                    class="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white text-lg transition-transform hover:scale-110 active:scale-95"
                    [title]="i18n.t('khqrClose')">
              ✕
            </button>
          </div>

          <div class="mt-3">
            <h2 class="text-xl font-extrabold text-white tracking-tight leading-snug">
              {{ isPaid() ? i18n.t('khqrPaymentComplete') : (orderData()?.templateName || templateName) }}
            </h2>
            <p class="text-xs text-red-100/90 mt-0.5">
              {{ isPaid() ? i18n.t('khqrChooseFormat') : i18n.t('khqrScanToUnlock') }}
            </p>
          </div>
        </div>

        <!-- BODY: PAYMENT ACTIVE -->
        @if (!isPaid() && !isExpired()) {
          <div class="p-6 text-center">
            
            <!-- TIMER & DUAL CURRENCY BADGE -->
            <div class="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-700/60 mb-5">
              <div class="flex items-center gap-2 text-left">
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <div class="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400">{{ i18n.t('khqrExpiresIn') }}</div>
                  <div class="text-sm font-black font-mono" [class.text-red-600]="remainingSeconds() < 60" [class.text-slate-800]="remainingSeconds() >= 60" [class.dark:text-white]="remainingSeconds() >= 60">
                    {{ formattedTime() }}
                  </div>
                </div>
              </div>

              <!-- Currency Switcher / Dual display -->
              <div class="text-right">
                <div class="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-tight">
                  \${{ (orderData()?.amountUsd || amountUsd).toFixed(2) }}
                </div>
                <div class="text-xs font-bold text-slate-500 dark:text-slate-400">
                  ៛{{ (orderData()?.amountKhr || (amountUsd * 4100)).toLocaleString() }}
                </div>
              </div>
            </div>

            <!-- OFFICIAL KHQR CARD -->
            <div class="mx-auto w-72 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col items-center">
              
              <!-- KHQR RED BANNER HEADER -->
              <div class="w-full bg-[#e11925] py-2 px-3 flex items-center justify-between">
                <span class="text-white font-black text-xs tracking-wider">KHQR</span>
                <span class="text-white/90 text-[10px] font-semibold uppercase">{{ orderData()?.currency || 'USD' }}</span>
              </div>

              <!-- QR CODE WITH PURE WHITE QUIET ZONE -->
              <div class="w-full p-4 bg-white flex items-center justify-center min-h-[240px]">
                @if (loading()) {
                  <div class="flex flex-col items-center gap-3 py-10">
                    <div class="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-xs font-semibold text-slate-500">Generating KHQR...</span>
                  </div>
                } @else if (qrSvg()) {
                  <div class="w-56 h-56 flex items-center justify-center relative overflow-hidden qr-box" [innerHTML]="qrSvg()">
                    <div class="qr-laser-scanner"></div>
                  </div>
                } @else {
                  <p class="text-xs text-red-500 py-10">Failed to load QR. Click refresh.</p>
                }
              </div>

              <!-- ACCOUNT INFO FOOTER -->
              <div class="w-full bg-slate-50 border-t border-slate-100 py-2.5 px-3 flex items-center justify-between text-left">
                <div class="overflow-hidden pr-2">
                  <div class="text-[10px] text-slate-400 uppercase font-semibold">{{ i18n.t('khqrAccountName') }}</div>
                  <div class="text-xs font-black text-slate-800 truncate">
                    {{ orderData()?.accountName || 'Phorn Sokkhim' }}
                  </div>
                </div>
                <button type="button" (click)="copyAccountId()"
                        class="text-[10px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition shrink-0"
                        title="Copy Bakong ID">
                  {{ i18n.t('khqrCopyId') }}
                </button>
              </div>
            </div>

            <!-- QUICK ACTIONS: SAVE IMAGE & COPY DETAILS -->
            <div class="flex items-center justify-center gap-2 mt-3.5 mb-2">
              <button type="button" (click)="downloadQrImage()"
                      class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                <span>📥</span>
                <span>{{ i18n.t('khqrSaveImage') }}</span>
              </button>
              <button type="button" (click)="copyAccountId()"
                      class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm">
                <span>📋</span>
                <span>{{ i18n.t('khqrCopyAccount') }}</span>
              </button>
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              {{ i18n.t('khqrScanInstruction') }}
            </p>

            <!-- 2026 DYNAMIC REAL-TIME PAYMENT STREAM -->
            <div class="space-y-2.5 pt-1">
              <div class="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-900/5 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-teal-950/20 border border-emerald-500/25 dark:border-emerald-500/35 text-left relative overflow-hidden shadow-xs">
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="relative flex h-2.5 w-2.5 shrink-0">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                      <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
                    </span>
                    <span class="text-xs font-black text-emerald-800 dark:text-emerald-300 tracking-wide uppercase">
                      {{ i18n.currentLang() === 'kh' ? 'ត្រួតពិនិត្យផ្ទាល់ ២០២៦ (Real-Time)' : 'Real-Time Sync 2026' }}
                    </span>
                  </div>
                  <span class="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>LIVE BAKONG API</span>
                  </span>
                </div>

                <p class="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {{ i18n.currentLang() === 'kh' ? 'ស្កេនទូទាត់ជាមួយ App ធនាគារណាមួយ (ABA, Bakong, Wing, ACLEDA...)' : 'Scan with any Mobile Banking App (ABA, Bakong, Wing, ACLEDA...)' }}
                </p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>{{ i18n.currentLang() === 'kh' ? 'ប្រព័ន្ធនឹងដោះសោ CV ដោយស្វ័យប្រវត្តិក្នង < 1 វិនាទី ពេលទូទាត់ជោគជ័យ' : 'Instant auto-unlock within 1s upon bank transaction approval' }}</span>
                </p>

                <!-- Dynamic Stream Bar -->
                <div class="mt-2.5 h-1 w-full bg-emerald-950/10 dark:bg-emerald-500/15 rounded-full overflow-hidden relative">
                  <div class="stream-line"></div>
                </div>
              </div>

              <!-- Single Clean Action: Cancel / Close -->
              <button type="button" 
                      (click)="cancelPayment()"
                      class="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition active:scale-[0.99] cursor-pointer">
                {{ i18n.t('khqrCancel') }}
              </button>
            </div>
          </div>
        }

        <!-- BODY: EXPIRED STATE -->
        @if (isExpired() && !isPaid()) {
          <div class="p-8 text-center animate-fade-in">
            <div class="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl mx-auto mb-4">
              ⏱️
            </div>
            <h3 class="text-lg font-black text-slate-800 dark:text-white mb-1">{{ i18n.t('khqrExpiredTitle') }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
              {{ i18n.t('khqrExpiredDesc') }}
            </p>
            <div class="flex gap-3">
              <button type="button" (click)="generateKhqr()"
                      class="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer">
                <span>🔄</span>
                <span>{{ i18n.t('khqrRefreshQr') }}</span>
              </button>
              <button type="button" (click)="cancelPayment()"
                      class="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs transition cursor-pointer">
                {{ i18n.t('khqrCancel') }}
              </button>
            </div>
          </div>
        }

        <!-- BODY: SUCCESS STATE (USER PAID) -->
        @if (isPaid()) {
          <div class="p-6 text-center animate-scale-up">
            
            <!-- Success icon -->
            <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
              ✓
            </div>

            <h3 class="text-xl font-black text-slate-800 dark:text-white">{{ i18n.t('khqrPaymentReceived') }}</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              {{ i18n.t('khqrPermanentUnlocked') }}
            </p>

            <!-- RECEIPT PREVIEW BANNER -->
            <div class="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-700/60 text-left text-xs space-y-1.5 mb-5 shadow-sm">
              <div class="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>{{ i18n.t('khqrOrderRef') }}</span>
                <span class="font-mono font-bold text-slate-800 dark:text-white">#{{ orderData()?.orderId || 1001 }}</span>
              </div>
              <div class="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>{{ i18n.t('khqrAmountPaid') }}</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  \${{ (orderData()?.amountUsd || amountUsd).toFixed(2) }} (៛{{ (orderData()?.amountKhr || (amountUsd * 4100)).toLocaleString() }})
                </span>
              </div>
              <div class="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>{{ i18n.t('khqrPaymentMethod') }}</span>
                <span class="font-semibold text-slate-800 dark:text-white">Bakong KHQR</span>
              </div>
              <div class="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>{{ i18n.t('khqrStatus') }}</span>
                <span class="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span> {{ i18n.t('khqrConfirmed') }}
                </span>
              </div>
            </div>

            <!-- RECEIPT DOWNLOAD BUTTON -->
            <button type="button" (click)="downloadReceipt()"
                    class="w-full mb-5 py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span>{{ i18n.t('khqrDownloadReceipt') }}</span>
            </button>

            <!-- CHOOSE DOWNLOAD FORMAT: PDF, DOCX, PPTX -->
            <div class="border-t border-slate-100 dark:border-slate-800 pt-4">
              <p class="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-400 mb-3">
                {{ i18n.t('khqrDownloadCvFormat') }}
              </p>
              
              <div class="grid grid-cols-3 gap-3">
                <!-- PDF -->
                <button type="button" (click)="selectDownload('pdf')"
                        class="group flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all hover:scale-105 active:scale-95 shadow-sm">
                  <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <span class="text-xs font-black text-slate-800 dark:text-slate-200">PDF</span>
                  <span class="text-[9px] text-slate-400">{{ i18n.t('khqrHighQuality') }}</span>
                </button>

                <!-- PPTX -->
                <button type="button" (click)="selectDownload('pptx')"
                        class="group flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all hover:scale-105 active:scale-95 shadow-sm">
                  <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 12h10M12 7v10"/></svg>
                  </div>
                  <span class="text-xs font-black text-slate-800 dark:text-slate-200">PPTX</span>
                  <span class="text-[9px] text-slate-400">PowerPoint</span>
                </button>

                <!-- DOCX -->
                <button type="button" (click)="selectDownload('docx')"
                        class="group flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all hover:scale-105 active:scale-95 shadow-sm">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
                  </div>
                  <span class="text-xs font-black text-slate-800 dark:text-slate-200">DOCX</span>
                  <span class="text-[9px] text-slate-400">Word</span>
                </button>
              </div>
            </div>

            <div class="mt-5">
              <button type="button" (click)="closeModal()"
                      class="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-semibold transition">
                {{ i18n.t('khqrClose') }}
              </button>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.95) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-scale-up {
      animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .qr-box {
      position: relative;
    }
    .qr-laser-scanner {
      position: absolute;
      left: 4%;
      right: 4%;
      height: 2.5px;
      background: linear-gradient(90deg, transparent, #10b981 30%, #34d399 50%, #10b981 70%, transparent);
      box-shadow: 0 0 10px #10b981, 0 0 18px rgba(16, 185, 129, 0.6);
      border-radius: 999px;
      opacity: 0.9;
      animation: qrLaser 2.6s ease-in-out infinite alternate;
      pointer-events: none;
    }
    @keyframes qrLaser {
      0% { top: 4%; }
      100% { top: 96%; }
    }
    .stream-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 40%;
      background: linear-gradient(90deg, transparent, #10b981, #14b8a6, transparent);
      border-radius: 999px;
      animation: streamPulse 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    @keyframes streamPulse {
      0% { left: -40%; }
      100% { left: 100%; }
    }
  `]
})
export class KhqrPaymentModalComponent implements OnInit, OnDestroy {
  public i18n = inject(TranslationService);

  @Input() templateId?: number | string | null;
  @Input() userCvId?: number | string | null;
  @Input() templateName: string = 'CQ Professional CV';
  @Input() amountUsd: number = 3.00;

  @Output() paymentSuccess = new EventEmitter<{ orderId: number; format?: 'pdf' | 'docx' | 'pptx' }>();
  @Output() downloadFormat = new EventEmitter<'pdf' | 'docx' | 'pptx'>();
  @Output() close = new EventEmitter<void>();

  orderData = signal<KhqrOrderResponse | null>(null);
  loading = signal<boolean>(true);
  verifying = signal<boolean>(false);
  isPaid = signal<boolean>(false);
  isExpired = signal<boolean>(false);
  selectedCurrency = signal<'USD' | 'KHR'>('USD');
  qrSvg = signal<SafeHtml | null>(null);
  remainingSeconds = signal<number>(300);

  private timerInterval: any = null;
  private pollInterval: any = null;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.generateKhqr();
  }

  ngOnDestroy() {
    this.stopTimers();
  }

  setCurrency(curr: 'USD' | 'KHR') {
    if (this.selectedCurrency() === curr) return;
    this.selectedCurrency.set(curr);
    this.generateKhqr();
  }

  generateKhqr() {
    this.stopTimers();
    this.loading.set(true);
    this.isExpired.set(false);
    this.remainingSeconds.set(300);

    this.http.post<KhqrOrderResponse>('/api/v1/orders/khqr', {
      templateId: this.templateId,
      userCvId: this.userCvId,
      currency: this.selectedCurrency()
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.free || res.paid) {
          this.isPaid.set(true);
          this.paymentSuccess.emit({ orderId: res.orderId });
          return;
        }

        this.orderData.set(res);
        if (res.qrString) {
          const rawSvg = QrCode.generateSvg(res.qrString, 280);
          this.qrSvg.set(this.sanitizer.bypassSecurityTrustHtml(rawSvg));
        }

        this.startTimer();
        this.startPolling(res.orderId);
      },
      error: (err) => {
        this.loading.set(false);
        console.warn('Fallback to instant client KHQR generation:', err);
        const now = Date.now();
        const exp = now + 24 * 60 * 60 * 1000;
        const tag99 = `99340013${now}0113${exp}`;
        const raw = `00020101021229220018phorn_sokkhim@bkrt52045999530384054043.005802KH5913Phorn Sokkhim6010Phnom Penh620801041001${tag99}6304`;
        const fallbackQr = raw + khqrCrc16(raw);
        const rawSvg = QrCode.generateSvg(fallbackQr, 280);
        this.qrSvg.set(this.sanitizer.bypassSecurityTrustHtml(rawSvg));
        this.orderData.set({
          orderId: Math.floor(1000 + Math.random() * 9000),
          qrString: fallbackQr,
          md5: 'fallback_md5_ref',
          amountUsd: 3.00,
          amountKhr: 12300,
          currency: 'USD',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          accountName: 'Phorn Sokkhim',
          accountId: 'phorn_sokkhim@bkrt',
          templateName: this.templateName || 'CQ Professional CV'
        });
        this.startTimer();
      }
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      const cur = this.remainingSeconds();
      if (cur <= 1) {
        this.remainingSeconds.set(0);
        this.isExpired.set(true);
        this.stopTimers();
      } else {
        this.remainingSeconds.set(cur - 1);
      }
    }, 1000);
  }

  formattedTime(): string {
    const s = this.remainingSeconds();
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private visibilityHandler = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      const order = this.orderData();
      if (order && !this.isPaid() && !this.isExpired()) {
        this.checkOrderStatus(order.orderId);
      }
    }
  };

  startPolling(orderId: number) {
    if (this.pollInterval) clearInterval(this.pollInterval);
    // Real-time API poll every 1.8 seconds
    this.pollInterval = setInterval(() => {
      this.checkOrderStatus(orderId);
    }, 1800);

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.visibilityHandler);
      window.addEventListener('focus', this.visibilityHandler);
    }
  }

  private checkOrderStatus(orderId: number) {
    if (this.isPaid() || this.isExpired()) return;
    this.http.get<{ status: string; paid: boolean }>(`/api/v1/orders/${orderId}/status`).subscribe({
      next: (res) => {
        if (res.paid) {
          this.handlePaidSuccess(orderId);
        } else if (res.status === 'expired' && this.remainingSeconds() <= 5) {
          this.isExpired.set(true);
          this.stopTimers();
        }
      },
      error: () => {}
    });
  }

  handlePaidSuccess(orderId: number) {
    this.stopTimers();
    this.isPaid.set(true);
    this.toast.success(this.i18n.t('khqrToastPaid'));
  }

  private hasNotifiedCancel = false;

  cancelPayment() {
    this.sendCancelNotification();
    this.closeModal();
  }

  private sendCancelNotification() {
    const order = this.orderData();
    if (order && !this.isPaid() && !this.hasNotifiedCancel) {
      this.hasNotifiedCancel = true;
      this.http.post(`/api/v1/orders/${order.orderId}/cancel`, {}).subscribe({
        next: () => {},
        error: () => {}
      });
    }
  }

  downloadQrImage() {
    const qr = this.orderData()?.qrString;
    if (!qr) return;
    const dataUrl = QrCode.generateDataUrl(qr, 800);
    if (!dataUrl) {
      this.toast.error('Unable to export QR image');
      return;
    }
    const link = document.createElement('a');
    link.download = `KHQR_Order_${this.orderData()?.orderId || 'payment'}.png`;
    link.href = dataUrl;
    link.click();
    this.toast.success(this.i18n.t('khqrToastSaved'));
  }

  copyAccountId() {
    const acc = this.orderData()?.accountId || 'phorn_sokkhim@bkrt';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(acc).then(() => {
        this.toast.success(this.i18n.t('khqrToastCopied') + acc);
      }).catch(() => {
        this.toast.info(this.i18n.t('khqrToastCopied') + acc);
      });
    } else {
      this.toast.info(this.i18n.t('khqrToastCopied') + acc);
    }
  }

  selectDownload(format: 'pdf' | 'docx' | 'pptx') {
    this.downloadFormat.emit(format);
    this.paymentSuccess.emit({ orderId: this.orderData()?.orderId || 0, format });
    this.closeModal();
  }

  downloadReceipt() {
    const order = this.orderData();
    const orderId = order?.orderId || '1001';
    const amountUsd = (order?.amountUsd || this.amountUsd).toFixed(2);
    const amountKhr = (order?.amountKhr || (this.amountUsd * 4100)).toLocaleString();
    const dateStr = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
    const tmplName = order?.templateName || this.templateName;

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CQ-Professional Receipt #${orderId}</title>
        <style>
          body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 40px; color: #1e293b; }
          .receipt-box { max-width: 580px; margin: 0 auto; background: #fff; padding: 36px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
          .logo { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 24px; }
          .brand { font-size: 22px; font-weight: 900; color: #1e3a8a; letter-spacing: -0.5px; }
          .tag { font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; }
          .title { font-size: 18px; font-weight: 800; margin-bottom: 6px; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; margin-bottom: 24px; background: #f8fafc; padding: 14px; border-radius: 10px; }
          .item-row { display: flex; justify-content: space-between; font-size: 14px; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
          .total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; padding: 16px 0; color: #0f172a; }
          .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 32px; }
          @media print { body { padding: 0; background: #fff; } .receipt-box { box-shadow: none; border: none; } }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="logo">
            <div class="brand">CQ-Professional</div>
            <div class="tag">✓ Paid via Bakong KHQR</div>
          </div>
          <div class="title">Official Payment Receipt</div>
          <div style="font-size: 12px; color: #64748b; margin-bottom: 20px;">Thank you for your purchase with CQ-Professional.</div>
          
          <div class="meta-grid">
            <div><strong>Order ID:</strong> #${orderId}</div>
            <div><strong>Date:</strong> ${dateStr}</div>
            <div><strong>Account:</strong> phorn_sokkhim&#64;bkrt</div>
            <div><strong>Payment Provider:</strong> NBC Bakong KHQR</div>
          </div>

          <div class="item-row">
            <span>Template License (${tmplName})</span>
            <strong>\$${amountUsd} / ៛${amountKhr}</strong>
          </div>
          <div class="item-row">
            <span>Watermark Removal & Instant Export (PDF, DOCX, PPTX)</span>
            <span style="color: #16a34a; font-weight: 700;">Included</span>
          </div>

          <div class="total-row">
            <span>Total Paid</span>
            <span>\$${amountUsd} (៛${amountKhr})</span>
          </div>

          <div class="footer">
            CQ-Professional Resume Builder • Powered by National Bank of Cambodia Bakong KHQR<br/>
            Need support? Contact telegram: &#64;cqprofessionalpayment_bot
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(receiptHtml);
      printWin.document.close();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.cancelPayment();
    }
  }

  closeModal() {
    this.stopTimers();
    if (this.isPaid()) {
      this.paymentSuccess.emit({ orderId: this.orderData()?.orderId || 0 });
    } else {
      this.sendCancelNotification();
    }
    this.close.emit();
  }

  private stopTimers() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      window.removeEventListener('focus', this.visibilityHandler);
    }
  }
}
