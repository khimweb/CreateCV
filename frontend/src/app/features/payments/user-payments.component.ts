import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Receipt,
  Download,
  Printer,
  FileSpreadsheet,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Calendar,
  Layers,
  ArrowRight,
  X,
  FileText,
  Sparkles,
  RefreshCw
} from 'lucide-angular';
import PptxGenJS from 'pptxgenjs';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../shared/components/toast/toast.service';

export interface UserOrder {
  id: number;
  user_id: number;
  template_id: number;
  user_cv_id?: number | null;
  amount_cents: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_provider?: string;
  payment_ref?: string;
  purchased_at: string;
  template_name?: string;
  template_category?: string;
  cv_title?: string;
  thumbnail_url?: string;
}

@Component({
  selector: 'app-user-payments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Ambient Glow Orbs -->
      <div class="glow glow-one" aria-hidden="true"></div>
      <div class="glow glow-two" aria-hidden="true"></div>
      <div class="glow glow-three" aria-hidden="true"></div>

      <div class="max-w-6xl mx-auto space-y-8">
        <!-- TOP HEADER / HERO -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none backdrop-blur-xl relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-full blur-2xl"></div>
          
          <div class="relative space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <lucide-icon [img]="Sparkles" class="w-3.5 h-3.5" />
              <span>{{ i18n.t('payBadge') }}</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {{ i18n.t('payTitle') }}
            </h1>
            <p class="text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              {{ i18n.t('paySubtitle') }}
            </p>
          </div>

          <div class="relative flex flex-wrap gap-3 items-center">
            <button
              type="button"
              (click)="recheckPendingPayments()"
              [disabled]="rechecking()"
              class="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <lucide-icon [img]="RefreshCw" [class.animate-spin]="rechecking()" class="w-4 h-4" />
              <span>{{ i18n.t('payBtnRecheckAll') }}</span>
            </button>
            <button
              type="button"
              (click)="exportAllExcel()"
              [disabled]="orders().length === 0"
              class="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <lucide-icon [img]="FileSpreadsheet" class="w-4 h-4" />
              <span>{{ i18n.t('payBtnExportHistory') }}</span>
            </button>
            <a
              routerLink="/templates"
              class="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition flex items-center gap-2 active:scale-95"
            >
              <span>{{ i18n.t('payBtnExplore') }}</span>
              <lucide-icon [img]="ArrowRight" class="w-4 h-4" />
            </a>
          </div>
        </div>

        <!-- STATS OVERVIEW CARDS -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Spent -->
          <div class="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase mb-1">
              <span>{{ i18n.t('payStatTotalSpent') }}</span>
              <lucide-icon [img]="CreditCard" class="w-4 h-4 text-blue-500" />
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">
              \${{ totalSpentUsd().toFixed(2) }}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              ៛{{ totalSpentKhr().toLocaleString() }} KHR
            </div>
          </div>

          <!-- Total Orders -->
          <div class="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase mb-1">
              <span>{{ i18n.t('payStatOrders') }}</span>
              <lucide-icon [img]="Receipt" class="w-4 h-4 text-emerald-500" />
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">
              {{ orders().length }}
            </div>
            <div class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              {{ paidCount() }} {{ i18n.t('payStatVerifiedPaid') }}
            </div>
          </div>

          <!-- Unlocked Licenses -->
          <div class="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase mb-1">
              <span>{{ i18n.t('payStatUnlocked') }}</span>
              <lucide-icon [img]="Layers" class="w-4 h-4 text-indigo-500" />
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">
              {{ paidCount() }}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {{ i18n.t('payStatWatermarkRemoved') }}
            </div>
          </div>

          <!-- Gateway Provider -->
          <div class="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase mb-1">
              <span>{{ i18n.t('payStatGateway') }}</span>
              <lucide-icon [img]="ShieldCheck" class="w-4 h-4 text-teal-500" />
            </div>
            <div class="text-base font-black text-slate-900 dark:text-white truncate">
              NBC Bakong KHQR
            </div>
            <div class="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-1 truncate">
              phorn_sokkhim&#64;bkrt
            </div>
          </div>
        </div>

        <!-- SEARCH & FILTER TOOLBAR -->
        <div class="bg-white dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Search input -->
          <div class="relative w-full sm:w-80 search-wrapper-animated">
            <lucide-icon [img]="Search" class="search-icon-animated w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors pointer-events-none" />
            <input
              type="text"
              [(ngModel)]="searchQuery"
              [placeholder]="i18n.t('paySearchPlaceholder')"
              class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <!-- Filter tabs -->
          <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              (click)="selectedTab.set('all')"
              [class.bg-white]="selectedTab() === 'all'"
              [class.dark:bg-slate-700]="selectedTab() === 'all'"
              [class.shadow-sm]="selectedTab() === 'all'"
              [class.text-slate-900]="selectedTab() === 'all'"
              [class.dark:text-white]="selectedTab() === 'all'"
              class="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 transition cursor-pointer"
            >
              {{ i18n.t('payTabAll') }} ({{ orders().length }})
            </button>
            <button
              type="button"
              (click)="selectedTab.set('paid')"
              [class.bg-white]="selectedTab() === 'paid'"
              [class.dark:bg-slate-700]="selectedTab() === 'paid'"
              [class.shadow-sm]="selectedTab() === 'paid'"
              [class.text-emerald-700]="selectedTab() === 'paid'"
              [class.dark:text-emerald-400]="selectedTab() === 'paid'"
              class="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 transition cursor-pointer"
            >
              {{ i18n.t('payTabPaid') }} ({{ paidCount() }})
            </button>
            <button
              type="button"
              (click)="selectedTab.set('pending')"
              [class.bg-white]="selectedTab() === 'pending'"
              [class.dark:bg-slate-700]="selectedTab() === 'pending'"
              [class.shadow-sm]="selectedTab() === 'pending'"
              [class.text-amber-700]="selectedTab() === 'pending'"
              [class.dark:text-amber-400]="selectedTab() === 'pending'"
              class="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-500 dark:text-slate-400 transition cursor-pointer"
            >
              {{ i18n.t('payTabPending') }} ({{ pendingCount() }})
            </button>
          </div>
        </div>

        <!-- TRANSACTIONS LIST / TABLE -->
        <div class="bg-white dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          @if (loading()) {
            <div class="py-20 text-center space-y-3">
              <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p class="text-xs font-semibold text-slate-500">{{ i18n.t('payLoading') }}</p>
            </div>
          } @else if (filteredOrders().length === 0) {
            <div class="py-20 text-center space-y-4 max-w-sm mx-auto px-4">
              <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <lucide-icon [img]="Receipt" class="w-8 h-8" />
              </div>
              <div class="space-y-1">
                <h3 class="text-base font-bold text-slate-800 dark:text-white">{{ i18n.t('payEmptyTitle') }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  @if (searchQuery()) {
                    {{ i18n.t('payEmptySearchPrefix') }} "{{ searchQuery() }}".
                  } @else {
                    {{ i18n.t('payEmptyDesc') }}
                  }
                </p>
              </div>
              <a
                routerLink="/templates"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
              >
                <span>{{ i18n.t('payBtnBrowse') }}</span>
                <lucide-icon [img]="ArrowRight" class="w-4 h-4" />
              </a>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/30">
                    <th class="py-4 px-6">{{ i18n.t('payThReceipt') }}</th>
                    <th class="py-4 px-6">{{ i18n.t('payThItem') }}</th>
                    <th class="py-4 px-6">{{ i18n.t('payThDate') }}</th>
                    <th class="py-4 px-6">{{ i18n.t('payThAmount') }}</th>
                    <th class="py-4 px-6">{{ i18n.t('payThMethod') }}</th>
                    <th class="py-4 px-6">{{ i18n.t('payThStatus') }}</th>
                    <th class="py-4 px-6 text-right">{{ i18n.t('payThActions') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  @for (order of filteredOrders(); track order.id) {
                    <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition">
                      <!-- Receipt ID -->
                      <td class="py-4 px-6 font-mono font-bold text-blue-600 dark:text-blue-400">
                        #REC-{{ padOrderId(order.id) }}
                      </td>

                      <!-- Item -->
                      <td class="py-4 px-6">
                        <div class="font-bold text-slate-900 dark:text-white">
                          {{ order.template_name || 'CV Template' }}
                        </div>
                        <div class="text-[11px] text-slate-400">
                          {{ order.template_category || 'Professional' }} • {{ order.cv_title ? ('CV: ' + order.cv_title) : i18n.t('payDirectLicense') }}
                        </div>
                      </td>

                      <!-- Date -->
                      <td class="py-4 px-6 text-slate-600 dark:text-slate-300">
                        {{ formatDate(order.purchased_at) }}
                      </td>

                      <!-- Amount -->
                      <td class="py-4 px-6">
                        <span class="font-bold text-slate-900 dark:text-white">
                          \${{ (order.amount_cents / 100).toFixed(2) }}
                        </span>
                        <span class="text-[11px] text-slate-400 ml-1">
                          (៛{{ Math.round((order.amount_cents / 100) * 4100).toLocaleString() }})
                        </span>
                      </td>

                      <!-- Method -->
                      <td class="py-4 px-6">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold text-[10px]">
                          <span>KHQR</span>
                          <span>Bakong</span>
                        </span>
                      </td>

                      <!-- Status -->
                      <td class="py-4 px-6">
                        @if (order.status === 'paid') {
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                            <lucide-icon [img]="CheckCircle2" class="w-3.5 h-3.5" />
                            <span>{{ i18n.t('payStatusPaid') }}</span>
                          </span>
                        } @else if (order.status === 'pending') {
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                            <lucide-icon [img]="Clock" class="w-3.5 h-3.5" />
                            <span>{{ i18n.t('payStatusPending') }}</span>
                          </span>
                        } @else {
                          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[11px]">
                            <lucide-icon [img]="XCircle" class="w-3.5 h-3.5" />
                            <span>{{ order.status }}</span>
                          </span>
                        }
                      </td>

                      <!-- Actions -->
                      <td class="py-4 px-6 text-right">
                        <div class="inline-flex items-center gap-1.5 justify-end">
                          @if (order.status !== 'paid') {
                            <!-- Verify / Recheck payment status button -->
                            <button
                              type="button"
                              (click)="verifyOrder(order)"
                              [title]="i18n.t('payTipVerify')"
                              class="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                            >
                              <lucide-icon [img]="RefreshCw" class="w-3.5 h-3.5" />
                              <span>{{ i18n.currentLang() === 'kh' ? 'ផ្ទៀងផ្ទាត់' : 'Verify' }}</span>
                            </button>
                          }

                          <!-- View Receipt Modal -->
                          <button
                            type="button"
                            (click)="viewReceipt(order)"
                            [title]="i18n.t('payTipView')"
                            class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold transition cursor-pointer"
                          >
                            <lucide-icon [img]="Eye" class="w-4 h-4" />
                          </button>

                          <!-- PDF Print Export -->
                          <button
                            type="button"
                            (click)="exportPdf(order)"
                            [title]="i18n.t('payTipPdf')"
                            class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                          >
                            <lucide-icon [img]="Printer" class="w-4 h-4" />
                          </button>

                          <!-- Excel Export -->
                          <button
                            type="button"
                            (click)="exportExcel(order)"
                            [title]="i18n.t('payTipExcel')"
                            class="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold transition cursor-pointer"
                          >
                            <lucide-icon [img]="FileSpreadsheet" class="w-4 h-4" />
                          </button>

                          <!-- PPTX Export -->
                          <button
                            type="button"
                            (click)="exportPptx(order)"
                            [title]="i18n.t('payTipPptx')"
                            class="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 font-bold transition cursor-pointer"
                          >
                            <lucide-icon [img]="Download" class="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>

        <!-- FOOTER BRANDING & COMPLIANCE -->
        <footer class="pt-6 pb-12 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <div class="flex items-center justify-center gap-2 font-semibold">
            <span>{{ i18n.t('payFooterTitle') }}</span>
          </div>
          <p>
            {{ i18n.t('payFooterDesc1') }} <a href="https://t.me/cvresumeonline" target="_blank" class="text-blue-600 hover:underline font-semibold">&#64;cvresumeonline</a>.
          </p>
        </footer>
      </div>

      <!-- ======================================================== -->
      <!-- NEXT-GENERATION OFFICIAL RECEIPT MODAL -->
      <!-- ======================================================== -->
      @if (selectedOrder(); as order) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
            <!-- Modal Close Bar -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
              <div class="flex items-center gap-2">
                <lucide-icon [img]="Receipt" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span class="text-sm font-black text-slate-900 dark:text-white">{{ i18n.t('payModalPreviewTitle') }}</span>
              </div>
              <button
                type="button"
                (click)="selectedOrder.set(null)"
                class="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <lucide-icon [img]="X" class="w-5 h-5" />
              </button>
            </div>

            <!-- RECEIPT DOCUMENT CONTAINER -->
            <div id="receipt-print-container" class="p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100">
              
              <!-- DOCUMENT HEADER -->
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-100 dark:border-slate-800">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
                      CQ
                    </div>
                    <div>
                      <div class="text-xl font-black tracking-tight text-slate-900 dark:text-white">CQ-Professional</div>
                      <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Creative CV Builder</div>
                    </div>
                  </div>
                </div>

                <div class="sm:text-right space-y-1">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    <lucide-icon [img]="CheckCircle2" class="w-3.5 h-3.5" />
                    <span>{{ i18n.t('payModalPaidBadge') }}</span>
                  </span>
                  <div class="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    #REC-{{ padOrderId(order.id) }}
                  </div>
                </div>
              </div>

              <!-- DOCUMENT META & PARTIES -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div class="space-y-1">
                  <div class="text-[10px] uppercase font-bold text-slate-400">{{ i18n.t('payModalBilledTo') }}</div>
                  <div class="font-bold text-slate-900 dark:text-white">{{ auth.currentUser()?.fullName || i18n.t('payModalValuedCustomer') }}</div>
                  <div class="text-slate-500 dark:text-slate-400">{{ auth.currentUser()?.email || 'customer@example.com' }}</div>
                  <div class="text-slate-500 dark:text-slate-400">{{ i18n.t('payModalCustomerId') }} #UID-{{ auth.currentUser()?.id || order.user_id }}</div>
                </div>
                <div class="space-y-1 sm:text-right">
                  <div class="text-[10px] uppercase font-bold text-slate-400">{{ i18n.t('payModalMerchantInfo') }}</div>
                  <div class="font-bold text-slate-900 dark:text-white">Phorn Sokhim</div>
                  <div class="text-slate-500 dark:text-slate-400 font-mono">phorn_sokkhim&#64;bkrt</div>
                  <div class="text-slate-500 dark:text-slate-400">{{ i18n.t('payModalGateway') }}</div>
                </div>
              </div>

              <!-- TRANSACTION METADATA -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs border-y border-slate-100 dark:border-slate-800">
                <div>
                  <div class="text-[10px] text-slate-400 font-semibold uppercase">{{ i18n.t('payModalDateIssued') }}</div>
                  <div class="font-bold text-slate-800 dark:text-slate-200">{{ formatDate(order.purchased_at) }}</div>
                </div>
                <div>
                  <div class="text-[10px] text-slate-400 font-semibold uppercase">{{ i18n.t('payModalPaymentType') }}</div>
                  <div class="font-bold text-slate-800 dark:text-slate-200">Bakong KHQR Dynamic</div>
                </div>
                <div>
                  <div class="text-[10px] text-slate-400 font-semibold uppercase">{{ i18n.t('payModalCurrency') }}</div>
                  <div class="font-bold text-slate-800 dark:text-slate-200">{{ order.currency || 'USD' }} / KHR</div>
                </div>
                <div>
                  <div class="text-[10px] text-slate-400 font-semibold uppercase">{{ i18n.t('payModalStatus') }}</div>
                  <div class="font-bold text-emerald-600 dark:text-emerald-400">{{ i18n.t('payModalStatusConfirmed') }}</div>
                </div>
              </div>

              <!-- ITEMIZED ORDER BREAKDOWN -->
              <div class="space-y-3">
                <div class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ i18n.t('payModalOrderItems') }}</div>
                <div class="border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead class="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase">
                      <tr>
                        <th class="py-3 px-4">{{ i18n.t('payModalThItem') }}</th>
                        <th class="py-3 px-4 text-center">{{ i18n.t('payModalThQty') }}</th>
                        <th class="py-3 px-4 text-right">{{ i18n.t('payModalThPrice') }}</th>
                        <th class="py-3 px-4 text-right">{{ i18n.t('payModalThTotal') }}</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td class="py-3.5 px-4">
                          <div class="font-bold text-slate-900 dark:text-white">{{ order.template_name || 'CQ Premium Template' }}</div>
                          <div class="text-[11px] text-slate-500 dark:text-slate-400">{{ i18n.t('payModalItemDesc') }}</div>
                        </td>
                        <td class="py-3.5 px-4 text-center font-bold">1</td>
                        <td class="py-3.5 px-4 text-right font-mono">\${{ (order.amount_cents / 100).toFixed(2) }}</td>
                        <td class="py-3.5 px-4 text-right font-mono font-bold">\${{ (order.amount_cents / 100).toFixed(2) }}</td>
                      </tr>
                      <tr>
                        <td class="py-3 px-4">
                          <div class="font-semibold text-slate-700 dark:text-slate-300">{{ i18n.t('payModalMultiExport') }}</div>
                          <div class="text-[11px] text-slate-400">{{ i18n.t('payModalExportDesc') }}</div>
                        </td>
                        <td class="py-3 px-4 text-center">1</td>
                        <td class="py-3 px-4 text-right text-emerald-600 font-bold">{{ i18n.t('payModalIncluded') }}</td>
                        <td class="py-3 px-4 text-right text-emerald-600 font-bold">\$0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- FINANCIAL TOTALS -->
              <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-1 w-full sm:w-auto">
                  <div class="font-semibold text-slate-500 dark:text-slate-400">{{ i18n.t('payModalBakongRef') }}</div>
                  <div class="font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">
                    {{ order.payment_ref || 'NBC-KHQR-VERIFIED' }}
                  </div>
                </div>

                <div class="w-full sm:w-64 space-y-1.5 text-xs text-right">
                  <div class="flex justify-between text-slate-500">
                    <span>{{ i18n.t('payModalSubtotal') }}</span>
                    <span class="font-mono font-semibold">\${{ (order.amount_cents / 100).toFixed(2) }}</span>
                  </div>
                  <div class="flex justify-between text-slate-500">
                    <span>{{ i18n.t('payModalTax') }}</span>
                    <span class="font-mono font-semibold">\$0.00</span>
                  </div>
                  <div class="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>{{ i18n.t('payModalTotalPaid') }}</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-mono">
                      \${{ (order.amount_cents / 100).toFixed(2) }}
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-400">
                    (៛{{ Math.round((order.amount_cents / 100) * 4100).toLocaleString() }} KHR)
                  </div>
                </div>
              </div>

              <!-- DOCUMENT FOOTER WITH VERIFICATION BADGE -->
              <div class="pt-6 border-t border-slate-100 dark:border-slate-800 text-center space-y-2 text-[11px] text-slate-400">
                <div class="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <lucide-icon [img]="ShieldCheck" class="w-4 h-4" />
                  <span>{{ i18n.t('payModalVerifiedNbc') }}</span>
                </div>
                <p>
                  {{ i18n.t('payModalAllRights') }}<br />
                  {{ i18n.t('payModalInquiries') }}
                </p>
              </div>
            </div>

            <!-- MODAL BOTTOM ACTION BAR -->
            <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-100 dark:border-slate-800">
              <span class="text-xs text-slate-500 font-semibold">
                {{ i18n.t('payModalExportPreferred') }}
              </span>
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  (click)="exportPdf(order)"
                  class="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <lucide-icon [img]="Printer" class="w-3.5 h-3.5" />
                  <span>{{ i18n.t('payModalBtnPrint') }}</span>
                </button>
                <button
                  type="button"
                  (click)="exportExcel(order)"
                  class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <lucide-icon [img]="FileSpreadsheet" class="w-3.5 h-3.5" />
                  <span>{{ i18n.t('payModalBtnExcel') }}</span>
                </button>
                <button
                  type="button"
                  (click)="exportPptx(order)"
                  class="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <lucide-icon [img]="Download" class="w-3.5 h-3.5" />
                  <span>{{ i18n.t('payModalBtnPptx') }}</span>
                </button>
                <button
                  type="button"
                  (click)="selectedOrder.set(null)"
                  class="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  {{ i18n.t('payModalBtnClose') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
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

    @media print {
      body * {
        visibility: hidden;
      }
      #receipt-print-container, #receipt-print-container * {
        visibility: visible;
      }
      #receipt-print-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: 0;
        padding: 20px;
        background: white !important;
        color: black !important;
      }
    }
  `]
})
export class UserPaymentsComponent implements OnInit {
  protected readonly Math = Math;
  protected readonly Receipt = Receipt;
  protected readonly Download = Download;
  protected readonly Printer = Printer;
  protected readonly FileSpreadsheet = FileSpreadsheet;
  protected readonly Eye = Eye;
  protected readonly CheckCircle2 = CheckCircle2;
  protected readonly Clock = Clock;
  protected readonly XCircle = XCircle;
  protected readonly Search = Search;
  protected readonly ExternalLink = ExternalLink;
  protected readonly ShieldCheck = ShieldCheck;
  protected readonly CreditCard = CreditCard;
  protected readonly Calendar = Calendar;
  protected readonly Layers = Layers;
  protected readonly ArrowRight = ArrowRight;
  protected readonly X = X;
  protected readonly FileText = FileText;
  protected readonly Sparkles = Sparkles;
  protected readonly RefreshCw = RefreshCw;

  private http = inject(HttpClient);
  public auth = inject(AuthService);
  private toast = inject(ToastService);
  public i18n = inject(TranslationService);

  orders = signal<UserOrder[]>([]);
  loading = signal(true);
  rechecking = signal(false);
  searchQuery = signal('');
  selectedTab = signal<'all' | 'paid' | 'pending'>('all');
  selectedOrder = signal<UserOrder | null>(null);

  paidCount = computed(() => this.orders().filter((o) => o.status === 'paid').length);
  pendingCount = computed(() => this.orders().filter((o) => o.status === 'pending').length);

  totalSpentUsd = computed(() => {
    return this.orders()
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + o.amount_cents / 100, 0);
  });

  totalSpentKhr = computed(() => {
    return Math.round(this.totalSpentUsd() * 4100);
  });

  filteredOrders = computed(() => {
    let list = this.orders();
    const tab = this.selectedTab();
    if (tab === 'paid') list = list.filter((o) => o.status === 'paid');
    if (tab === 'pending') list = list.filter((o) => o.status === 'pending');

    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter((o) => {
        const idMatch = String(o.id).includes(q) || `rec-${this.padOrderId(o.id)}`.toLowerCase().includes(q);
        const nameMatch = (o.template_name || '').toLowerCase().includes(q);
        const refMatch = (o.payment_ref || '').toLowerCase().includes(q);
        return idMatch || nameMatch || refMatch;
      });
    }
    return list;
  });

  ngOnInit() {
    this.fetchOrders();
  }

  recheckPendingPayments() {
    this.rechecking.set(true);
    this.http.post<{ success: boolean; verifiedCount: number; message: string }>('/api/v1/orders/verify-all', {}).subscribe({
      next: (res) => {
        this.rechecking.set(false);
        this.fetchOrders();
        if (res && res.verifiedCount > 0) {
          this.toast.success(this.i18n.t('payToastVerifySuccess'));
        } else {
          this.toast.info(this.i18n.t('payToastVerifyNone'));
        }
      },
      error: () => {
        this.rechecking.set(false);
        this.fetchOrders();
        this.toast.info(this.i18n.t('payToastVerifyNone'));
      }
    });
  }

  verifyOrder(order: UserOrder) {
    this.http.post<{ success: boolean; order?: any }>(`/api/v1/orders/${order.id}/verify`, {}).subscribe({
      next: () => {
        this.toast.success(this.i18n.t('payToastVerifySuccess'));
        this.fetchOrders();
      },
      error: (err) => {
        console.error('Verify order error:', err);
        this.toast.error(this.i18n.currentLang() === 'kh' ? 'មិនអាចផ្ទៀងផ្ទាត់ការបញ្ជាទិញបានទេ។' : 'Unable to verify order. Please contact support.');
      }
    });
  }

  fetchOrders() {
    this.loading.set(true);
    this.http.get<{ orders: UserOrder[] }>('/api/v1/orders').subscribe({
      next: (res) => {
        this.orders.set(res.orders || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.loading.set(false);
        this.toast.error(this.i18n.currentLang() === 'kh' ? 'មិនអាចទាញយកទិន្នន័យប្រវត្តិទូទាត់ប្រាក់បានឡើយ។' : 'Unable to fetch transaction records.');
      },
    });
  }

  padOrderId(id: number): string {
    return String(id).padStart(5, '0');
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    try {
      const fixed = !dateStr.endsWith('Z') && !dateStr.includes('+') ? dateStr.replace(' ', 'T') + 'Z' : dateStr;
      const d = new Date(fixed);
      const locale = this.i18n.currentLang() === 'kh' ? 'km-KH' : 'en-US';
      return d.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  }

  viewReceipt(order: UserOrder) {
    this.selectedOrder.set(order);
  }

  // EXPORT 1: PDF Print
  exportPdf(order: UserOrder) {
    const user = this.auth.currentUser();
    const orderId = this.padOrderId(order.id);
    const amountUsd = (order.amount_cents / 100).toFixed(2);
    const amountKhr = Math.round((order.amount_cents / 100) * 4100).toLocaleString();
    const dateStr = this.formatDate(order.purchased_at);
    const tmplName = order.template_name || 'CQ Premium Template';

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CQ-Professional Receipt #REC-${orderId}</title>
        <meta charset="utf-8"/>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #fff; margin: 0; padding: 20px; color: #0f172a; }
          .receipt-container { max-width: 650px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; background: #ffffff; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 20px; }
          .brand-badge { display: inline-flex; align-items: center; gap: 8px; font-weight: 900; font-size: 20px; color: #1e3a8a; }
          .badge-paid { background: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc; border-radius: 12px; padding: 16px; font-size: 12px; margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
          .table th { background: #f1f5f9; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #475569; }
          .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; }
          .totals { margin-left: auto; width: 260px; font-size: 13px; margin-bottom: 24px; }
          .totals-row { display: flex; justify-content: space-between; padding: 4px 0; color: #475569; }
          .grand-total { display: flex; justify-content: space-between; padding: 10px 0; font-size: 16px; font-weight: 900; color: #0f172a; border-top: 2px solid #e2e8f0; }
          .footer { text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 11px; color: #94a3b8; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            <div class="brand-badge">CQ-Professional</div>
            <div>
              <span class="badge-paid">✓ Paid via Bakong KHQR</span>
              <div style="font-family: monospace; font-size: 12px; color: #64748b; margin-top: 4px;">#REC-${orderId}</div>
            </div>
          </div>

          <div class="info-grid">
            <div>
              <div style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Customer Details</div>
              <strong>${user?.fullName || 'Valued Customer'}</strong><br/>
              ${user?.email || 'customer@example.com'}<br/>
              Date: ${dateStr}
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700;">Merchant & Gateway</div>
              <strong>Phorn Sokkhim</strong><br/>
              phorn_sokkhim&#64;bkrt<br/>
              NBC Bakong KHQR Gateway
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Item & Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${tmplName}</strong><br/>
                  <span style="color: #64748b; font-size: 11px;">Watermark removed • Unlimited exports (PDF, DOCX, PPTX)</span>
                </td>
                <td style="text-align: center;">1</td>
                <td style="text-align: right; font-weight: 700;">\$${amountUsd}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>\$${amountUsd}</span>
            </div>
            <div class="totals-row">
              <span>Tax (0%)</span>
              <span>\$0.00</span>
            </div>
            <div class="grand-total">
              <span>Total Paid</span>
              <span style="color: #16a34a;">\$${amountUsd} (៛${amountKhr})</span>
            </div>
          </div>

          <div class="footer">
            <strong>Digitally Verified via National Bank of Cambodia Bakong Open API</strong><br/>
            Reference MD5: ${order.payment_ref || 'NBC-VERIFIED'}<br/>
            Need support? Contact telegram: &#64;cvresumeonline
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(printHtml);
      printWin.document.close();
      this.toast.success(this.i18n.t('payToastPdfSuccess'));
    } else {
      this.toast.error(this.i18n.t('payToastPdfBlocked'));
    }
  }

  // EXPORT 2: Excel (.csv formatted)
  exportExcel(order: UserOrder) {
    const user = this.auth.currentUser();
    const rows = [
      ['CQ-Professional Official Payment Receipt'],
      ['Receipt Number', `#REC-${this.padOrderId(order.id)}`],
      ['Date Issued', this.formatDate(order.purchased_at)],
      ['Customer Name', user?.fullName || 'Customer'],
      ['Customer Email', user?.email || '—'],
      ['Template Name', order.template_name || 'CV Template'],
      ['Template Category', order.template_category || 'Professional'],
      ['Amount (USD)', (order.amount_cents / 100).toFixed(2)],
      ['Amount (KHR)', Math.round((order.amount_cents / 100) * 4100).toString()],
      ['Payment Gateway', 'NBC Bakong KHQR'],
      ['Merchant Account', 'phorn_sokkhim@bkrt'],
      ['Transaction Reference', order.payment_ref || 'NBC-KHQR-VERIFIED'],
      ['Payment Status', order.status.toUpperCase()],
      [''],
      ['Electronic Verification', 'National Bank of Cambodia Bakong Network Verified'],
    ];

    const csvContent = '\uFEFF' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CQ_Receipt_REC-${this.padOrderId(order.id)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast.success(this.i18n.t('payToastExcelSuccess'));
  }

  exportAllExcel() {
    const orders = this.orders();
    if (!orders.length) return;

    const rows = [
      [
        'Receipt #',
        'Date',
        'Template',
        'Category',
        'Amount USD',
        'Amount KHR',
        'Gateway',
        'Payment Ref',
        'Status',
      ],
      ...orders.map((o) => [
        `#REC-${this.padOrderId(o.id)}`,
        this.formatDate(o.purchased_at),
        o.template_name || 'CV Template',
        o.template_category || 'Professional',
        (o.amount_cents / 100).toFixed(2),
        Math.round((o.amount_cents / 100) * 4100).toString(),
        'NBC Bakong KHQR',
        o.payment_ref || '—',
        o.status.toUpperCase(),
      ]),
    ];

    const csvContent = '\uFEFF' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CQ_Payment_History_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast.success(this.i18n.t('payToastAllExcelSuccess'));
  }

  // EXPORT 3: PowerPoint (.pptx)
  async exportPptx(order: UserOrder) {
    try {
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_16x9';

      const slide = pptx.addSlide();
      slide.background = { color: 'F8FAFC' };

      // Top Header Banner
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 0.4,
        w: 12.33,
        h: 1.1,
        fill: { color: '1E3A8A' },
      });

      slide.addText('CQ-Professional • Electronic Payment Receipt', {
        x: 0.8,
        y: 0.55,
        w: 8.0,
        h: 0.4,
        fontSize: 20,
        bold: true,
        color: 'FFFFFF',
      });

      slide.addText(`Receipt #REC-${this.padOrderId(order.id)} • Verified Paid`, {
        x: 0.8,
        y: 0.95,
        w: 8.0,
        h: 0.3,
        fontSize: 12,
        color: '93C5FD',
      });

      // Key Metrics Cards
      // Card 1: Amount Paid
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.5,
        y: 1.8,
        w: 3.8,
        h: 1.3,
        fill: { color: 'FFFFFF' },
        line: { color: 'E2E8F0', width: 1 },
      });
      slide.addText('AMOUNT PAID', { x: 0.7, y: 1.95, fontSize: 10, bold: true, color: '64748B' });
      slide.addText(`\$${(order.amount_cents / 100).toFixed(2)} USD`, { x: 0.7, y: 2.25, fontSize: 20, bold: true, color: '16A34A' });
      slide.addText(`(៛${Math.round((order.amount_cents / 100) * 4100).toLocaleString()} KHR)`, { x: 0.7, y: 2.7, fontSize: 11, color: '64748B' });

      // Card 2: Template Name
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 4.75,
        y: 1.8,
        w: 3.8,
        h: 1.3,
        fill: { color: 'FFFFFF' },
        line: { color: 'E2E8F0', width: 1 },
      });
      slide.addText('TEMPLATE LICENSED', { x: 4.95, y: 1.95, fontSize: 10, bold: true, color: '64748B' });
      slide.addText(order.template_name || 'CV Template', { x: 4.95, y: 2.25, fontSize: 16, bold: true, color: '0F172A' });
      slide.addText(`Category: ${order.template_category || 'Professional'}`, { x: 4.95, y: 2.7, fontSize: 11, color: '64748B' });

      // Card 3: Gateway
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 9.0,
        y: 1.8,
        w: 3.8,
        h: 1.3,
        fill: { color: 'FFFFFF' },
        line: { color: 'E2E8F0', width: 1 },
      });
      slide.addText('PAYMENT METHOD', { x: 9.2, y: 1.95, fontSize: 10, bold: true, color: '64748B' });
      slide.addText('NBC Bakong KHQR', { x: 9.2, y: 2.25, fontSize: 16, bold: true, color: 'DC2626' });
      slide.addText('Recipient: phorn_sokkhim@bkrt', { x: 9.2, y: 2.7, fontSize: 11, color: '64748B' });

      // Itemized Table
      const tableRows = [
        [
          { text: 'Description', options: { bold: true, fill: { color: 'E2E8F0' }, color: '1E293B' } },
          { text: 'Qty', options: { bold: true, fill: { color: 'E2E8F0' }, color: '1E293B', align: 'center' } },
          { text: 'Unit Price', options: { bold: true, fill: { color: 'E2E8F0' }, color: '1E293B', align: 'right' } },
          { text: 'Total', options: { bold: true, fill: { color: 'E2E8F0' }, color: '1E293B', align: 'right' } },
        ],
        [
          { text: `${order.template_name || 'CV Template'} (Watermark Removed, Lifetime Access)` },
          { text: '1', options: { align: 'center' } },
          { text: `\$${(order.amount_cents / 100).toFixed(2)}`, options: { align: 'right' } },
          { text: `\$${(order.amount_cents / 100).toFixed(2)}`, options: { align: 'right', bold: true } },
        ],
        [
          { text: 'Multi-Format Vector Export (PDF, DOCX, PPTX)' },
          { text: '1', options: { align: 'center' } },
          { text: 'Included', options: { align: 'right', color: '16A34A' } },
          { text: '\$0.00', options: { align: 'right', color: '16A34A' } },
        ],
      ];

      slide.addTable(tableRows as any, {
        x: 0.5,
        y: 3.4,
        w: 12.33,
        rowH: 0.45,
        fontSize: 11,
        border: { color: 'CBD5E1', pt: 1 },
      });

      // Verification Footer
      slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 5.6,
        w: 12.33,
        h: 1.2,
        fill: { color: 'FFFFFF' },
        line: { color: 'E2E8F0', width: 1 },
      });

      slide.addText('DIGITAL VERIFICATION & SUPPORT', {
        x: 0.8,
        y: 5.75,
        fontSize: 10,
        bold: true,
        color: '0F172A',
      });

      slide.addText(
        `• Transaction Ref: ${order.payment_ref || 'NBC-KHQR-VERIFIED'}\n• Date: ${this.formatDate(order.purchased_at)}\n• Customer: ${this.auth.currentUser()?.fullName || 'User'} (${this.auth.currentUser()?.email || '—'})\n• Telegram Support: @cvresumeonline`,
        {
          x: 0.8,
          y: 6.0,
          w: 11.5,
          fontSize: 10,
          color: '475569',
        }
      );

      await pptx.writeFile({ fileName: `CQ_Receipt_REC-${this.padOrderId(order.id)}.pptx` });
      this.toast.success(this.i18n.t('payToastPptxSuccess'));
    } catch (e) {
      console.error('Failed to export PPTX:', e);
      this.toast.error(this.i18n.t('payToastPptxError'));
    }
  }
}
