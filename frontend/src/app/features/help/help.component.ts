import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import {
  LucideAngularModule,
  Send,
  MessageCircle,
  BadgeCheck,
  ArrowUpRight,
  HelpCircle,
  Phone,
  Mail,
  Sparkles,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Bot,
  User,
} from 'lucide-angular';


interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: 'payment' | 'editing' | 'formats' | 'services';
  open?: boolean;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, LucideAngularModule],
  template: `
    <main class="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 py-8 sm:py-12 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Ambient Glow Orbs -->
      <div class="glow glow-one" aria-hidden="true"></div>
      <div class="glow glow-two" aria-hidden="true"></div>
      <div class="glow glow-three" aria-hidden="true"></div>

      <div class="max-w-5xl mx-auto space-y-12">
        <!-- HERO SECTION -->
        <section class="text-center space-y-4 pt-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <lucide-icon [img]="Sparkles" class="w-3.5 h-3.5" />
            <span>{{ i18n.t('helpBadge') }}</span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {{ i18n.t('helpHeroTitlePrefix') }} <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">{{ i18n.t('helpHeroTitleAccent') }}</span> {{ i18n.t('helpHeroTitleSuffix') }}
          </h1>

          <p class="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {{ i18n.t('helpHeroDesc') }}
          </p>

          <!-- Quick Trust Badges -->
          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <lucide-icon [img]="Clock" class="w-3.5 h-3.5 text-emerald-500" />
              <span>{{ i18n.t('helpTrustResponse') }}</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <lucide-icon [img]="ShieldCheck" class="w-3.5 h-3.5 text-blue-500" />
              <span>{{ i18n.t('helpTrustBakong') }}</span>
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <lucide-icon [img]="BadgeCheck" class="w-3.5 h-3.5 text-purple-500" />
              <span>{{ i18n.t('helpTrustHuman') }}</span>
            </span>
          </div>
        </section>

        <!-- PRIMARY DIRECT CONTACT CARDS (TELEGRAM & TIKTOK PROMINENT) -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 1. TELEGRAM CARD (VIBRANT BLUE + OFFICIAL QR CODE) -->
          <div class="relative group bg-gradient-to-br from-sky-500/10 via-blue-600/5 to-indigo-600/10 dark:from-sky-950/40 dark:via-slate-900 dark:to-blue-950/40 p-5 sm:p-8 rounded-3xl border border-sky-200 dark:border-sky-800/60 shadow-xl shadow-sky-500/5 hover:shadow-sky-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div class="absolute -top-12 -right-12 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl group-hover:scale-125 transition duration-500 pointer-events-none"></div>

            <div class="space-y-4 relative">
              <div class="flex items-center justify-between">
                <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
                  <lucide-icon [img]="Send" class="w-7 h-7 -translate-x-0.5 translate-y-0.5" />
                </div>
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 text-[11px] font-black uppercase tracking-wider">
                  {{ i18n.t('helpTgBadge') }}
                </span>
              </div>

              <div class="space-y-1">
                <div class="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">{{ i18n.t('helpTgEyebrow') }}</div>
                <h3 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ i18n.t('helpTgTitle') }}
                </h3>
              </div>

              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ i18n.t('helpTgDesc1') }} <strong>Phorn Sokhim</strong> (&#64;phornsokkhim) {{ i18n.t('helpTgDesc2') }}
              </p>

              <!-- OFFICIAL TELEGRAM QR CODE SHOWCASE -->
              <div class="p-4 bg-white/90 dark:bg-slate-800/90 rounded-2xl border border-sky-200 dark:border-sky-800/80 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <div class="relative group/qr shrink-0 cursor-pointer" (click)="showQrModal.set(true)">
                  <img
                    src="/assets/telegram-qr-phornsokkhim.png"
                    alt="Official Telegram QR Code @phornsokkhim"
                    class="w-24 sm:w-32 h-24 sm:h-32 rounded-xl object-contain bg-white p-1 border border-slate-200 dark:border-slate-700 shadow hover:scale-105 transition-transform duration-200"
                  />
                  <div class="absolute bottom-1 right-1 bg-sky-600 text-white p-1 rounded-lg text-[10px] font-bold flex items-center gap-0.5 shadow">
                    <lucide-icon [img]="Search" class="w-2.5 h-2.5" />
                  </div>
                </div>

                <div class="space-y-1.5 text-center sm:text-left flex-1">
                  <div class="flex items-center justify-center sm:justify-start gap-1.5">
                    <span class="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 text-[10px] font-black uppercase tracking-wider">
                      {{ i18n.t('helpTgOfficialQr') }}
                    </span>
                    <span class="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">{{ i18n.t('helpTgActiveNow') }}</span>
                  </div>
                  <div class="text-sm font-black text-slate-900 dark:text-white">
                    &#64;phornsokkhim
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {{ i18n.t('helpTgScanHint') }}
                  </p>
                  <button
                    type="button"
                    (click)="showQrModal.set(true)"
                    class="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-0.5 cursor-pointer"
                  >
                    <span>{{ i18n.t('helpTgZoomQr') }}</span>
                    <lucide-icon [img]="ArrowUpRight" class="w-3 h-3" />
                  </button>
                </div>
              </div>

              <!-- Channel & Bot Indicators -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div class="p-2.5 bg-white/70 dark:bg-slate-800/70 rounded-xl border border-sky-100 dark:border-sky-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2 min-w-0">
                  <span class="truncate min-w-0">{{ i18n.t('helpTgChannel') }}: <strong>&#64;cvresumeonline</strong></span>
                  <span class="text-sky-600 dark:text-sky-400 font-bold text-[10px] shrink-0">📣 Channel</span>
                </div>
                <div class="p-2.5 bg-white/70 dark:bg-slate-800/70 rounded-xl border border-sky-100 dark:border-sky-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2 min-w-0">
                  <span class="truncate min-w-0">{{ i18n.t('helpTgTicketBot') }}: <strong>&#64;cqticketproblemreport_bot</strong></span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] shrink-0">🤖 Bot</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="pt-6 relative space-y-2">
              <a
                href="https://t.me/phornsokkhim"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <lucide-icon [img]="Send" class="w-4 h-4" />
                <span>{{ i18n.t('helpTgBtnMessage') }}</span>
                <lucide-icon [img]="ArrowUpRight" class="w-4 h-4" />
              </a>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href="https://t.me/cvresumeonline"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="py-2.5 px-3 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>{{ i18n.t('helpTgBtnChannel') }}</span>
                  <lucide-icon [img]="ExternalLink" class="w-3 h-3 text-sky-500" />
                </a>

                <a
                  href="https://t.me/cqticketproblemreport_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="py-2.5 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>{{ i18n.t('helpTgBtnBot') }}</span>
                  <lucide-icon [img]="ArrowUpRight" class="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <!-- 2. TIKTOK CARD (SLEEK MODERN DARK / NEON ACCENTS) -->
          <div class="relative group bg-gradient-to-br from-rose-500/10 via-slate-900/5 to-cyan-500/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-5 sm:p-8 rounded-3xl border border-slate-300/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 hover:shadow-slate-900/15 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div class="absolute -top-12 -right-12 w-40 h-40 bg-rose-500/15 rounded-full blur-2xl group-hover:scale-125 transition duration-500 pointer-events-none"></div>

            <div class="space-y-4 relative">
              <div class="flex items-center justify-between">
                <div class="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-slate-900/30 border border-slate-700">
                  <span class="bg-gradient-to-tr from-cyan-400 to-rose-400 bg-clip-text text-transparent">♪</span>
                </div>
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[11px] font-black uppercase tracking-wider">
                  {{ i18n.t('helpTiktokBadge') }}
                </span>
              </div>

              <div class="space-y-1">
                <div class="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">{{ i18n.t('helpTiktokEyebrow') }}</div>
                <h3 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ i18n.t('helpTiktokTitle') }}
                </h3>
              </div>

              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ i18n.t('helpTiktokDesc') }}
              </p>

              <div class="p-3 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{{ i18n.t('helpTiktokAccount') }}: <strong>&#64;cqprofessional1111</strong></span>
                <span class="text-rose-600 dark:text-rose-400 font-sans font-bold text-[11px]">{{ i18n.t('helpTiktokDaily') }}</span>
              </div>
            </div>

            <div class="pt-6 relative space-y-2.5">
              <a
                href="https://www.tiktok.com/@cqprofessional1111"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-3.5 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-950/20 transition flex items-center justify-center gap-2 border border-slate-800 active:scale-[0.99]"
              >
                <span>{{ i18n.t('helpTiktokBtn') }}</span>
                <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 text-cyan-400" />
              </a>

              <div class="text-center">
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  {{ i18n.t('helpTiktokHint') }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- SECONDARY DIRECT HOTLINES (PHONE, EMAIL, BILLING) -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Hotline Phone -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div class="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              <lucide-icon [img]="Phone" class="w-4 h-4" />
              <span>{{ i18n.t('helpHotlinePhone') }}</span>
            </div>
            <div class="text-lg font-black text-slate-900 dark:text-white">
              096 491 0220
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ i18n.t('helpHotlinePhoneHours') }}
            </p>
            <a
              href="tel:+855964910220"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 pt-1"
            >
              <span>{{ i18n.t('helpHotlineCallNow') }}</span>
              <lucide-icon [img]="ArrowUpRight" class="w-3.5 h-3.5" />
            </a>
          </div>

          <!-- Email Support -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div class="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
              <lucide-icon [img]="Mail" class="w-4 h-4" />
              <span>{{ i18n.t('helpHotlineEmail') }}</span>
            </div>
            <div class="text-sm font-black text-slate-900 dark:text-white truncate">
              sokkhim519&#64;gmail.com
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ i18n.t('helpHotlineEmailDesc') }}
            </p>
            <a
              href="mailto:sokkhim519@gmail.com"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 pt-1"
            >
              <span>{{ i18n.t('helpHotlineSendEmail') }}</span>
              <lucide-icon [img]="ArrowUpRight" class="w-3.5 h-3.5" />
            </a>
          </div>

          <!-- Billing & Payments Page -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div class="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
              <lucide-icon [img]="CheckCircle2" class="w-4 h-4" />
              <span>{{ i18n.t('helpHotlineBilling') }}</span>
            </div>
            <div class="text-sm font-black text-slate-900 dark:text-white">
              {{ i18n.t('helpHotlineBillingTitle') }}
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ i18n.t('helpHotlineBillingDesc') }}
            </p>
            <a
              routerLink="/payments"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 pt-1"
            >
              <span>{{ i18n.t('helpHotlineGoPayments') }}</span>
              <lucide-icon [img]="ArrowUpRight" class="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        <!-- FREQUENTLY ASKED QUESTIONS (FAQ) -->
        <section class="bg-white dark:bg-slate-900 p-5 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <lucide-icon [img]="HelpCircle" class="w-4 h-4" />
              <span>{{ i18n.t('helpFaqEyebrow') }}</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">
              {{ i18n.t('helpFaqTitle') }}
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ i18n.t('helpFaqSubtitle') }}
            </p>
          </div>

          <div class="space-y-3 pt-2">
            @for (faq of faqs(); track faq.id; let i = $index) {
              <div class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition">
                <button
                  type="button"
                  (click)="toggleFaq(faq.id)"
                  class="w-full py-4 px-5 text-left font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                >
                  <span>{{ faq.question }}</span>
                  <lucide-icon
                    [img]="ChevronDown"
                    class="w-4 h-4 text-slate-400 transition-transform duration-200"
                    [class.rotate-180]="faq.open"
                  />
                </button>
                @if (faq.open) {
                  <div class="px-5 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20">
                    {{ faq.answer }}
                  </div>
                }
              </div>
            }
          </div>
        </section>

        <!-- INTERACTIVE SUPPORT SECTION: CHATBOT & LEAVE A MESSAGE TABS -->
        <section class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          <!-- Top Tab Header -->
          <div class="p-4 sm:p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <lucide-icon [img]="Bot" class="w-4 h-4" />
                <span>{{ i18n.t('helpSupportEyebrow') }}</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {{ i18n.t('helpSupportTitle') }}
              </h2>
            </div>

            <!-- Tab Switcher -->
            <div class="flex items-center bg-slate-200/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700">
              <button
                type="button"
                (click)="activeTab.set('chat')"
                [class.bg-white]="activeTab() === 'chat'"
                [class.dark:bg-slate-800]="activeTab() === 'chat'"
                [class.text-blue-600]="activeTab() === 'chat'"
                [class.dark:text-blue-400]="activeTab() === 'chat'"
                [class.shadow-sm]="activeTab() === 'chat'"
                class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <lucide-icon [img]="Bot" class="w-3.5 h-3.5" />
                <span>{{ i18n.t('helpTabChatbot') }}</span>
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>

              <button
                type="button"
                (click)="activeTab.set('ticket')"
                [class.bg-white]="activeTab() === 'ticket'"
                [class.dark:bg-slate-800]="activeTab() === 'ticket'"
                [class.text-blue-600]="activeTab() === 'ticket'"
                [class.dark:text-blue-400]="activeTab() === 'ticket'"
                [class.shadow-sm]="activeTab() === 'ticket'"
                class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                <lucide-icon [img]="MessageCircle" class="w-3.5 h-3.5" />
                <span>{{ i18n.t('helpTabLeaveMsg') }}</span>
              </button>
            </div>
          </div>

          <!-- TAB 1: LIVE SUPPORT CHATBOT (INTERACTIVE) -->
          @if (activeTab() === 'chat') {
            <div class="p-6 sm:p-8 space-y-6">
              <div class="flex items-center justify-between p-3.5 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/70 rounded-2xl text-xs">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/30">
                    <lucide-icon [img]="Bot" class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{{ i18n.t('helpBotBadge') }}</span>
                      <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold">{{ i18n.t('helpBotOnline') }}</span>
                    </div>
                    <div class="text-[11px] text-slate-500 dark:text-slate-400">
                      {{ i18n.t('helpBotConnected') }} <strong>&#64;cqticketproblemreport_bot</strong>
                    </div>
                  </div>
                </div>

                <a
                  href="https://t.me/cqticketproblemreport_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow transition"
                >
                  <lucide-icon [img]="Send" class="w-3.5 h-3.5" />
                  <span>{{ i18n.t('helpBotOpenTg') }}</span>
                  <lucide-icon [img]="ArrowUpRight" class="w-3.5 h-3.5" />
                </a>
              </div>

              <!-- Chat Message History Feed -->
              <div class="space-y-4 max-h-[420px] overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                @for (msg of chatMessages(); track msg.id) {
                  @if (msg.sender === 'bot') {
                    <div class="flex items-start gap-3 max-w-xl">
                      <div class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <lucide-icon [img]="Bot" class="w-4 h-4" />
                      </div>
                      <div class="space-y-1">
                        <div class="p-4 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 shadow-sm leading-relaxed whitespace-pre-line">
                          {{ msg.text }}
                        </div>
                        <div class="text-[10px] text-slate-400 px-1">{{ msg.time }}</div>
                      </div>
                    </div>
                  } @else {
                    <div class="flex items-start justify-end gap-3 max-w-xl ml-auto">
                      <div class="space-y-1 text-right">
                        <div class="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm text-xs shadow-md leading-relaxed whitespace-pre-line text-left">
                          {{ msg.text }}
                        </div>
                        <div class="text-[10px] text-slate-400 px-1">{{ msg.time }}</div>
                      </div>
                      <div class="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <lucide-icon [img]="User" class="w-4 h-4" />
                      </div>
                    </div>
                  }
                }

                @if (chatSending()) {
                  <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2">
                    <div class="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                    <div class="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></div>
                    <div class="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></div>
                    <span>{{ i18n.t('helpChatSending') }}</span>
                  </div>
                }
              </div>

              <!-- Quick Topic Suggestion Chips -->
              <div class="space-y-2">
                <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ i18n.t('helpQuickInquiries') }}</span>
                <div class="flex flex-wrap gap-2">
                  @for (chip of quickChips(); track chip.label) {
                    <button
                      type="button"
                      (click)="sendQuickChip(chip.prompt)"
                      class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                    >
                      {{ chip.label }}
                    </button>
                  }
                </div>
              </div>

              <!-- Chat Input Box -->
              <form (ngSubmit)="submitChatMessage()" class="flex items-center gap-2">
                <input
                  type="text"
                  [(ngModel)]="currentChatMessage"
                  name="chatMsg"
                  [placeholder]="i18n.t('helpChatPlaceholder')"
                  class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  [disabled]="!currentChatMessage.trim() || chatSending()"
                  class="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                >
                  <lucide-icon [img]="Send" class="w-4 h-4" />
                  <span>{{ i18n.t('helpChatBtnSend') }}</span>
                </button>
              </form>
            </div>
          }

          <!-- TAB 2: LEAVE A MESSAGE (FORM VIEW) -->
          @if (activeTab() === 'ticket') {
            <div class="p-6 sm:p-10 space-y-6">
              <div class="space-y-1">
                <h3 class="text-xl font-black text-slate-900 dark:text-white">
                  {{ i18n.t('helpTicketTitle') }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ i18n.t('helpTicketSubtitle1') }} (<strong>&#64;cqticketproblemreport_bot</strong>) {{ i18n.t('helpTicketSubtitle2') }}
                </p>
              </div>

              <form [formGroup]="ticketForm" (ngSubmit)="submitTicket()" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Name Input -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {{ i18n.t('helpFieldName') }} <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      formControlName="name"
                      [placeholder]="i18n.t('helpPlaceholderName')"
                      [class.border-rose-400]="isFieldInvalid('name')"
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    @if (isFieldInvalid('name')) {
                      <p class="text-[11px] text-rose-500 font-semibold mt-1">{{ i18n.t('helpNameError') }}</p>
                    }
                  </div>

                  <!-- Email Input -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {{ i18n.t('helpFieldEmail') }} <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      formControlName="email"
                      [placeholder]="i18n.t('helpPlaceholderEmail')"
                      [class.border-rose-400]="isFieldInvalid('email')"
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    @if (isFieldInvalid('email')) {
                      <p class="text-[11px] text-rose-500 font-semibold mt-1">{{ i18n.t('helpEmailError') }}</p>
                    }
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Category -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{{ i18n.t('helpFieldCategory') }}</label>
                    <select
                      formControlName="subject"
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Payment / KHQR Verification">{{ i18n.t('helpCategoryKhqr') }}</option>
                      <option value="Watermark Removal">{{ i18n.t('helpCategoryWatermark') }}</option>
                      <option value="Template Export (PDF / Word / PPTX)">{{ i18n.t('helpCategoryExport') }}</option>
                      <option value="Professional Photo Retouching ($5)">{{ i18n.t('helpCategoryPhoto') }}</option>
                      <option value="Other Inquiries">{{ i18n.t('helpCategoryOther') }}</option>
                    </select>
                  </div>

                  <!-- Order ID (Optional) -->
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{{ i18n.t('helpFieldOrderId') }}</label>
                    <input
                      type="text"
                      formControlName="orderId"
                      [placeholder]="i18n.t('helpPlaceholderOrderId')"
                      class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <!-- Message Textarea -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {{ i18n.t('helpFieldMessage') }} <span class="text-rose-500">*</span>
                  </label>
                  <textarea
                    formControlName="message"
                    rows="4"
                    [placeholder]="i18n.t('helpPlaceholderMessage')"
                    [class.border-rose-400]="isFieldInvalid('message')"
                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  ></textarea>
                  @if (isFieldInvalid('message')) {
                    <p class="text-[11px] text-rose-500 font-semibold mt-1">{{ i18n.t('helpMessageError') }}</p>
                  }
                </div>

                <!-- Success Confirmation Card -->
                @if (ticketStatus() === 'sent') {
                  <div class="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
                    <div class="flex items-start gap-3">
                      <lucide-icon [img]="CheckCircle2" class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 class="font-bold text-sm text-emerald-800 dark:text-emerald-200">
                          {{ i18n.t('helpSuccessTitle') }}
                        </h4>
                        <p class="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                          {{ i18n.t('helpSuccessDesc1') }} <strong>&#64;cqticketproblemreport_bot</strong>. {{ i18n.t('helpSuccessDesc2') }}
                        </p>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2 pt-1">
                      <a
                        href="https://t.me/cqticketproblemreport_bot"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow transition"
                      >
                        <lucide-icon [img]="Send" class="w-3.5 h-3.5" />
                        <span>{{ i18n.t('helpSuccessBtnBot') }}</span>
                        <lucide-icon [img]="ArrowUpRight" class="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        (click)="resetTicketForm()"
                        class="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                      >
                        {{ i18n.t('helpSuccessBtnAnother') }}
                      </button>
                    </div>
                  </div>
                }

                <!-- Error Alert -->
                @if (ticketStatus() === 'error') {
                  <div class="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300 font-semibold space-y-2">
                    <div class="flex items-center gap-2">
                      <lucide-icon [img]="AlertCircle" class="w-4 h-4" />
                      <span>{{ i18n.t('helpErrorNotice') }}</span>
                    </div>
                    <p class="font-normal text-[11px]">
                      {{ i18n.t('helpErrorDirect') }}
                      <a href="https://t.me/cvresumecqprofessional" target="_blank" class="underline font-bold">
                        &#64;cvresumecqprofessional
                      </a>
                      {{ i18n.t('helpErrorOrOpen') }}
                      <a href="https://t.me/cqticketproblemreport_bot" target="_blank" class="underline font-bold">
                        &#64;cqticketproblemreport_bot
                      </a>.
                    </p>
                  </div>
                }

                <div class="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    [disabled]="ticketStatus() === 'sending'"
                    class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <lucide-icon [img]="Send" class="w-4 h-4" />
                    <span>{{ ticketStatus() === 'sending' ? i18n.t('helpBtnSubmitting') : i18n.t('helpBtnSubmit') }}</span>
                  </button>

                  <a
                    href="https://t.me/cqticketproblemreport_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <span>{{ i18n.t('helpBtnChatBot') }}</span>
                    <lucide-icon [img]="ArrowUpRight" class="w-3.5 h-3.5 text-sky-500" />
                  </a>
                </div>
              </form>
            </div>
          }
        </section>

        <!-- TELEGRAM QR CODE MODAL -->
        @if (showQrModal()) {
          <div
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn"
            (click)="showQrModal.set(false)"
          >
            <div
              class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center relative"
              (click)="$event.stopPropagation()"
            >
              <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div class="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
                  <lucide-icon [img]="Send" class="w-4 h-4" />
                  <span>{{ i18n.t('helpModalTitle') }}</span>
                </div>
                <button
                  type="button"
                  (click)="showQrModal.set(false)"
                  class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div class="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner">
                <img
                  src="/assets/telegram-qr-phornsokkhim.png"
                  alt="Telegram QR @phornsokkhim"
                  class="w-64 h-auto max-w-full rounded-xl object-contain shadow"
                />
              </div>

              <div class="space-y-1">
                <div class="text-base font-black text-slate-900 dark:text-white">
                  &#64;PHORNSOKKHIM
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  {{ i18n.t('helpModalScanHint') }}
                </p>
              </div>

              <div class="pt-2 flex flex-col gap-2">
                <a
                  href="https://t.me/phornsokkhim"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <lucide-icon [img]="Send" class="w-3.5 h-3.5" />
                  <span>{{ i18n.t('helpModalOpenBtn') }}</span>
                  <lucide-icon [img]="ArrowUpRight" class="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://t.me/cvresumeonline"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>{{ i18n.t('helpModalChannelBtn') }}</span>
                  <lucide-icon [img]="ExternalLink" class="w-3 h-3 text-sky-500" />
                </a>
              </div>
            </div>
          </div>
        }

        <!-- FOOTER SUPPORT NOTE -->
        <footer class="text-center text-xs text-slate-500 dark:text-slate-400 space-y-2 pt-6 pb-8 border-t border-slate-200 dark:border-slate-800">
          <p>
            {{ i18n.t('helpFooterText') }}
          </p>
          <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold">
            <a href="https://t.me/phornsokkhim" target="_blank" class="text-sky-600 hover:underline">Telegram: &#64;phornsokkhim</a>
            <span class="hidden sm:inline">•</span>
            <a href="https://t.me/cvresumeonline" target="_blank" class="text-blue-600 hover:underline">Channel: &#64;cvresumeonline</a>
            <span class="hidden sm:inline">•</span>
            <a href="https://t.me/cqticketproblemreport_bot" target="_blank" class="text-indigo-600 hover:underline">Bot: &#64;cqticketproblemreport_bot</a>
            <span class="hidden sm:inline">•</span>
            <a href="https://www.tiktok.com/@cqprofessional1111" target="_blank" class="text-rose-600 hover:underline">TikTok: &#64;cqprofessional1111</a>
            <span class="hidden sm:inline">•</span>
            <a href="tel:+855964910220" class="text-emerald-600 hover:underline">096 491 0220</a>
          </div>
        </footer>
      </div>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      background: linear-gradient(150deg, #f8faff 0%, #eef3ff 45%, #f4f8ff 100%);
    }
    :host-context(.dark) {
      background: linear-gradient(145deg, #0d1527 0%, #111b32 50%, #111a2c 100%);
    }
    .glow {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      z-index: 0;
    }
    .glow-one {
      width: 550px;
      height: 550px;
      right: -150px;
      top: 50px;
      background: rgba(99, 102, 241, 0.18);
    }
    .glow-two {
      width: 480px;
      height: 480px;
      left: -180px;
      top: 600px;
      background: rgba(14, 165, 233, 0.16);
    }
    .glow-three {
      width: 600px;
      height: 600px;
      right: -200px;
      top: 1000px;
      background: rgba(168, 85, 247, 0.14);
    }
    :host-context(.dark) .glow-one { background: #4d3f9866; }
    :host-context(.dark) .glow-two { background: #1d5b8d55; }
    :host-context(.dark) .glow-three { background: #5d388f44; }
  `]
})
export class HelpComponent implements OnInit {
  readonly Send = Send;
  readonly MessageCircle = MessageCircle;
  readonly BadgeCheck = BadgeCheck;
  readonly ArrowUpRight = ArrowUpRight;
  readonly HelpCircle = HelpCircle;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly Sparkles = Sparkles;
  readonly ChevronDown = ChevronDown;
  readonly ExternalLink = ExternalLink;
  readonly ShieldCheck = ShieldCheck;
  readonly Clock = Clock;
  readonly Search = Search;
  readonly CheckCircle2 = CheckCircle2;
  readonly AlertCircle = AlertCircle;
  readonly Bot = Bot;
  readonly User = User;

  readonly i18n = inject(TranslationService);

  showQrModal = signal(false);
  activeTab = signal<'chat' | 'ticket'>('ticket');
  ticketStatus = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  ticketForm: FormGroup;

  // Live Chatbot State
  chatSending = signal(false);
  currentChatMessage = '';
  chatMessages = signal<Array<{ id: number; sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      id: 1,
      sender: 'bot',
      text: '👋 Hello! I am your CQ Support Assistant connected to @cqticketproblemreport_bot.\n\nHow can I help you today? You can select a quick inquiry below or type your problem directly!',
      time: 'Just now',
    },
  ]);

  readonly quickChips = computed(() => {
    const isKh = this.i18n.currentLang() === 'kh';
    return [
      {
        label: isKh ? '⚡ បង់ប្រាក់ KHQR (ដោះសោ)' : '⚡ Paid with KHQR (Unlock)',
        prompt: isKh
          ? 'ខ្ញុំបានបង់ប្រាក់តាមរយៈ Bakong KHQR សូមជួយផ្ទៀងផ្ទាត់ និងដោះសោ CV របស់ខ្ញុំ។'
          : 'I paid via Bakong KHQR, please verify and unlock my CV.',
      },
      {
        label: isKh ? '🎨 របៀបដក Watermark' : '🎨 Remove Watermark',
        prompt: isKh
          ? 'តើខ្ញុំត្រូវធ្វើដូចម្តេចដើម្បីដក Watermark ចេញពី CV?'
          : 'How do I remove the watermark from my CV?',
      },
      {
        label: isKh ? '📄 ទាញយក PDF / Word / PPTX' : '📄 PDF / Word / PPTX Export',
        prompt: isKh
          ? 'តើខ្ញុំអាចទាញយក CV ជាទម្រង់ PDF, DOCX ឬ PPTX ដោយរបៀបណា?'
          : 'How can I download my CV in PDF, DOCX, or PPTX format?',
      },
      {
        label: isKh ? '📸 សេវាកែរូបថត $5' : '📸 $5 Photo Retouching',
        prompt: isKh
          ? 'ខ្ញុំចង់កម្ម៉ង់សេវាកម្មកាត់តកែរូបថតអាជីពតម្លៃ $5។'
          : 'I want to order the $5 professional portrait retouching service.',
      },
      {
        label: isKh ? '🚨 ផ្ញើសារបន្ទាន់ទៅ Admin' : '🚨 Send Alert to Admin',
        prompt: isKh
          ? 'សូមជួយជូនដំណឹងទៅ Admin ខ្ញុំមានបញ្ហាបន្ទាន់ជាមួយការកម្ម៉ង់របស់ខ្ញុំ។'
          : 'Please alert the admin that I have an urgent issue with my order.',
      },
    ];
  });

  expandedFaqs = signal<Record<number, boolean>>({ 0: true });

  readonly faqs = computed<FaqItem[]>(() => {
    const isKh = this.i18n.currentLang() === 'kh';
    const exp = this.expandedFaqs();
    return [
      {
        id: 0,
        question: isKh
          ? 'ខ្ញុំបានបង់ប្រាក់តាមរយៈបាគង KHQR រួចហើយ ប៉ុន្តែ CV មិនទាន់ដោះសោ។ តើខ្ញុំគួរធ្វើដូចម្តេច?'
          : 'I paid via Bakong KHQR, but my CV is not unlocked yet. What should I do?',
        answer: isKh
          ? 'ប្រព័ន្ធទូទាត់របស់យើងផ្ទៀងផ្ទាត់ប្រតិបត្តិការស្វ័យប្រវត្តិតាមរយៈ Bakong Open API របស់ធនាគារជាតិនៃកម្ពុជាភ្លាមៗ។ ប្រសិនបើកម្មវិធីធនាគាររបស់អ្នកបានកាត់ប្រាក់រួចរាល់ សូមចូលទៅកាន់ទំព័រ "ការទូទាត់ និងបង្កាន់ដៃ" ឬ Refresh ទំព័រឡើងវិញ។ អ្នកក៏អាចផ្ញើលេខសម្គាល់បញ្ជាទិញ (Order ID) ទៅកាន់ Telegram (@phornsokkhim) ឬឆានែលផ្លូវការ (@cvresumeonline) ដើម្បីឱ្យក្រុមការងារដោះសោជូនក្នុងរយៈពេលត្រឹមតែ ១ នាទីប៉ុណ្ណោះ!'
          : 'Our payment system automatically checks transaction status directly with the National Bank of Cambodia Bakong Open API in real-time. If your banking app completed the transfer, please visit the "Payments & Receipts" page or refresh your browser. You can also send your Order ID to our Telegram (@phornsokkhim) or official channel (@cvresumeonline) for immediate 1-minute manual activation!',
        category: 'payment',
        open: !!exp[0],
      },
      {
        id: 1,
        question: isKh
          ? 'តើខ្ញុំអាចកែប្រែព័ត៌មាន CV ឡើងវិញបានទេ បន្ទាប់ពីបានបង់ប្រាក់រួច?'
          : 'Can I edit my CV after making a payment?',
        answer: isKh
          ? 'បាទ/ចាស ពិតជាអាចបានយ៉ាងងាយស្រួល! នៅពេលដែលគំរូ ឬ CV ត្រូវបានដោះសោរួច អ្នកមានសិទ្ធិកែប្រែព័ត៌មានបានរហូតដោយឥតគិតថ្លៃបន្ថែម។ អ្នកអាចកែប្រែខ្លឹមសារ ប្តូរពណ៌ រៀបចំផ្នែកបទពិសោធន៍ឡើងវិញ និងទាញយកជាឯកសារថ្មីបានគ្រប់ពេលវេលា។'
          : 'Yes, absolutely! Once a template or CV is unlocked, you retain full lifetime editing privileges. You can update your text, change accent colors, reorder experience sections, and export updated versions at any time without paying again.',
        category: 'editing',
        open: !!exp[1],
      },
      {
        id: 2,
        question: isKh
          ? 'តើខ្ញុំអាចទាញយក CV ឬលិខិតសុំការងារជាទម្រង់ File អ្វីខ្លះបាន?'
          : 'What formats can I export my CV or Cover Letter in?',
        answer: isKh
          ? 'អ្នកអាចទាញយកជា ៣ ទម្រង់ស្តង់ដារអាជីព៖ PDF កម្រិតច្បាស់ខ្ពស់ (ស័ក្តិសមបំផុតសម្រាប់បោះពុម្ព ឬដាក់ពាក្យទៅកាន់ក្រុមហ៊ុន), Microsoft Word (.docx) និង PowerPoint (.pptx)។'
          : 'You can export in 3 professional formats: High-resolution vector PDF (perfect for printing or submitting to recruiters), Microsoft Word (.docx), and PowerPoint (.pptx).',
        category: 'formats',
        open: !!exp[2],
      },
      {
        id: 3,
        question: isKh
          ? 'តើសេវាកម្មកែរូបថតអាជីព $5 ឬកញ្ចប់ពិសេស $8 ដំណើរការយ៉ាងដូចម្តេច?'
          : 'How does the $5 Professional Photo Editing or $8 Bundle work?',
        answer: isKh
          ? 'យើងខ្ញុំមានសេវាកម្មកាត់តកែសម្ផស្សរូបថត និងប្តូរឈុតសម្លៀកបំពាក់ការងារផ្លូវការក្នុងតម្លៃត្រឹមតែ $5។ ឬជ្រើសរើសកញ្ចប់ពិសេស $8 ដែលរួមបញ្ចូល គំរូ CV 1 + លិខិតសុំការងារ 1 + សេវាកែរូបថតអាជីព 1។ សូមផ្ញើរូបថតរបស់អ្នកមកកាន់ Telegram (@phornsokkhim) ក្រុមការងារយើងនឹងរៀបចំជូនភ្លាមៗ!'
          : 'We offer professional portrait retouching and formal business attire placement for $5. Alternatively, our $8 bundle includes 1 CV Template + 1 Cover Letter + Professional Photo Editing. Contact us on Telegram (@phornsokkhim) with your photo and we will prepare it for your CV!',
        category: 'services',
        open: !!exp[3],
      },
      {
        id: 4,
        question: isKh
          ? 'តើកម្មវិធីធនាគារណាខ្លះអាចស្កេនបង់ប្រាក់តាមបាគង KHQR បាន?'
          : 'What banking apps support Bakong KHQR scan to pay?',
        answer: isKh
          ? 'គ្រប់កម្មវិធីធនាគារចម្បងៗនៅកម្ពុជាទាំងអស់គាំទ្រការស្កេនបង់ប្រាក់តាមបាគង KHQR រួមមាន៖ Bakong App, ABA Mobile, ACLEDA mobile, Wing Bank, Canadia Bank, Sathapana Bank និង TrueMoney ជាដើម។'
          : 'All major Cambodian banking applications support Bakong KHQR, including Bakong App, ABA Mobile, ACLEDA mobile, Wing Bank, Canadia Bank, Sathapana, and TrueMoney.',
        category: 'payment',
        open: !!exp[4],
      },
    ];
  });

  constructor(private fb: FormBuilder, private http: HttpClient, private auth: AuthService) {
    this.ticketForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['Payment / KHQR Verification'],
      orderId: [''],
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Set initial greeting based on initial language
    const isKh = this.i18n.currentLang() === 'kh';
    this.chatMessages.set([
      {
        id: 1,
        sender: 'bot',
        text: isKh
          ? '👋 សួស្តី! ខ្ញុំជាជំនួយការស្វ័យប្រវត្តិ CQ Support Bot ភ្ជាប់ផ្ទាល់ជាមួយ @cqticketproblemreport_bot។\n\nតើខ្ញុំអាចជួយអ្វីដល់អ្នកនៅថ្ងៃនេះ? អ្នកអាចជ្រើសរើសសំណួររហ័សខាងក្រោម ឬសរសេរបញ្ហារបស់អ្នកដោយផ្ទាល់!'
          : '👋 Hello! I am your CQ Support Assistant connected to @cqticketproblemreport_bot.\n\nHow can I help you today? You can select a quick inquiry below or type your problem directly!',
        time: isKh ? 'អម្បាញ់មិញ' : 'Just now',
      },
    ]);

    // Auto pre-fill name and email if user is logged in
    const user = this.auth.currentUser();
    if (user) {
      this.ticketForm.patchValue({
        name: user.fullName || '',
        email: user.email || '',
      });
    }
  }

  toggleFaq(id: number) {
    this.expandedFaqs.update((m) => ({ ...m, [id]: !m[id] }));
  }

  isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.ticketForm.get(fieldName);
    return !!(ctrl && ctrl.touched && ctrl.invalid);
  }

  resetTicketForm() {
    this.ticketStatus.set('idle');
    const user = this.auth.currentUser();
    this.ticketForm.reset({
      name: user?.fullName || '',
      email: user?.email || '',
      subject: 'Payment / KHQR Verification',
      orderId: '',
      message: '',
    });
  }

  submitTicket() {
    if (this.ticketForm.invalid) {
      Object.values(this.ticketForm.controls).forEach((ctrl) => ctrl.markAsTouched());
      return;
    }

    this.ticketStatus.set('sending');
    this.http.post('/api/v1/contact', this.ticketForm.getRawValue()).subscribe({
      next: () => {
        this.ticketStatus.set('sent');
      },
      error: (err) => {
        console.error('Ticket submission error:', err);
        this.ticketStatus.set('error');
      },
    });
  }

  sendQuickChip(promptText: string) {
    this.currentChatMessage = promptText;
    this.submitChatMessage();
  }

  submitChatMessage() {
    const text = this.currentChatMessage.trim();
    if (!text || this.chatSending()) return;

    const user = this.auth.currentUser();
    const isKh = this.i18n.currentLang() === 'kh';
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    this.chatMessages.update((msgs) => [
      ...msgs,
      { id: Date.now(), sender: 'user', text, time: timeNow },
    ]);

    this.currentChatMessage = '';
    this.chatSending.set(true);

    // Forward message to Telegram bot via API
    this.http
      .post('/api/v1/contact', {
        name: user?.fullName || 'Website Live Chat User',
        email: user?.email || 'livechat@cqprofessional.com',
        subject: 'Live Chatbot Inquiry',
        message: text,
      })
      .subscribe({
        next: () => {
          this.chatSending.set(false);
          let reply = '';
          const lower = text.toLowerCase();

          if (
            lower.includes('khqr') ||
            lower.includes('paid') ||
            lower.includes('unlock') ||
            lower.includes('payment') ||
            lower.includes('បង់ប្រាក់') ||
            lower.includes('ដោះសោ')
          ) {
            reply = isKh
              ? `✅ សំណួរអំពីការបង់ប្រាក់ត្រូវបានបញ្ជូនទៅកាន់ Telegram Bot (@cqticketproblemreport_bot) រួចរាល់!\n\nប្រសិនបើអ្នកបានផ្ទេរប្រាក់តាម Bakong KHQR សូមពិនិត្យទំព័រ "ការទូទាត់ និងបង្កាន់ដៃ" ឬផ្ញើលេខសម្គាល់បញ្ជាទិញ (Order ID) / រូបថតប្រតិបត្តិការទៅកាន់ Admin តាម Telegram (@phornsokkhim) ដើម្បីដោះសោជូនក្នុងរយៈពេលត្រឹមតែ ១ នាទី។`
              : `✅ Your payment inquiry has been sent to our Telegram bot (@cqticketproblemreport_bot)!\n\nIf you transferred via Bakong KHQR, please check your "Payments & Receipts" page or send your Order ID / transaction screenshot to admin on Telegram (@phornsokkhim) for immediate 1-minute activation.`;
          } else if (lower.includes('watermark') || lower.includes('ដក watermark')) {
            reply = isKh
              ? `🎨 ការដក Watermark៖ នៅពេលដែលគំរូ CV ត្រូវបានដោះសោបន្ទាប់ពីការទូទាត់រួចរាល់ សញ្ញា Watermark ទាំងអស់នឹងត្រូវបានដកចេញជាស្វ័យប្រវត្តពីគ្រប់ឯកសារ PDF, DOCX និង PPTX ដែលអ្នកទាញយក។`
              : `🎨 Watermark removal: Once a template is unlocked with payment, all watermarks are permanently removed from all your PDF, DOCX, and PPTX exports.`;
          } else if (
            lower.includes('photo') ||
            lower.includes('retouch') ||
            lower.includes('រូបថត') ||
            lower.includes('កែរូប')
          ) {
            reply = isKh
              ? `📸 សេវាកាត់តរូបថត $5៖ សូមផ្ញើរូបថតរបស់អ្នកមកកាន់ Telegram (@phornsokkhim)។ ក្រុមការងារ Design របស់យើងនឹងកែសម្រួលផ្ទៃមុខ និងប្តូរឈុតសម្លៀកបំពាក់ផ្លូវការសម្រាប់ CV របស់អ្នកយ៉ាងស្រស់ស្អាត!`
              : `📸 $5 Photo Retouching: Send your photo to our Telegram (@phornsokkhim). Our design team will retouch your portrait and place formal business attire for your CV!`;
          } else {
            reply = isKh
              ? `🚀 ខ្ញុំបានបញ្ជូនសាររបស់អ្នកផ្ទាល់ទៅកាន់ Telegram Bot របស់អ្នកគ្រប់គ្រង (@cqticketproblemreport_bot) រួចហើយ!\n\nក្រុមការងាររបស់យើងនៅរាជធានីភ្នំពេញបានទទួលសំណើនេះ និងត្រៀមខ្លួនជួយអ្នកភ្លាមៗ។ អ្នកក៏អាចជជែកផ្ទាល់បានគ្រប់ពេលតាម @phornsokkhim ឬចូលរួមឆានែលផ្លូវការ @cvresumeonline។`
              : `🚀 I have forwarded your message directly to our Admin's Telegram Bot (@cqticketproblemreport_bot)!\n\nOur team in Phnom Penh has received your ticket and will assist you right away. You can also chat directly anytime at @phornsokkhim or join our official channel @cvresumeonline.`;
          }

          this.chatMessages.update((msgs) => [
            ...msgs,
            { id: Date.now() + 1, sender: 'bot', text: reply, time: isKh ? 'អម្បាញ់មិញ' : 'Just now' },
          ]);
        },
        error: () => {
          this.chatSending.set(false);
          this.chatMessages.update((msgs) => [
            ...msgs,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: isKh
                ? '⚠️ បញ្ហាបណ្តាញ៖ អ្នកអាចទាក់ទងមកកាន់ Admin យើងខ្ញុំដោយផ្ទាល់តាម Telegram @phornsokkhim ឬបើក @cqticketproblemreport_bot។'
                : '⚠️ Network notice: You can reach our admin directly anytime on Telegram at @phornsokkhim or open @cqticketproblemreport_bot.',
              time: isKh ? 'អម្បាញ់មិញ' : 'Just now',
            },
          ]);
        },
      });
  }
}

