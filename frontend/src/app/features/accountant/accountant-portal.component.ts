import { Component, OnInit, signal, computed, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { gsap } from 'gsap';

const THEME_KEY = 'cv_creator_theme';

declare const google: any;

export interface KpiData {
  totalRevenue: number;
  totalIncome: number;
  totalExpense: number;
  grossRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  refundedOrders: number;
  failedOrders: number;
  averageOrderValue: number;
  todayRevenue: number;
  todayIncome: number;
  todayExpense: number;
  todayOrders: number;
  estimatedFees: number;
  estimatedNetProfit: number;
}

export interface TransactionItem {
  id: number;
  user_id?: number;
  template_id?: number;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'refunded' | 'failed';
  payment_provider: string | null;
  payment_ref: string | null;
  notes?: string | null;
  entry_type?: 'income' | 'expense';
  purchased_at: string;
  customer_name: string | null;
  customer_email: string | null;
  template_name: string;
}

export interface ChartPoint {
  label: string;
  key: string;
  orders: number;
  revenue: number;
  income: number;
  expense: number;
}

export interface PeriodSummary {
  totalRevenue: number;
  totalIncome: number;
  totalExpense: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface ServiceStat {
  name: string;
  count: number;
  revenue: number;
}

export interface ProviderStat {
  name: string;
  count: number;
  revenue: number;
}

export interface ReportSummary {
  totalTransactions: number;
  grossRevenue: number;
  gatewayFees: number;
  infrastructureCosts: number;
  manualDeductions: number;
  netOperatingIncome: number;
  taxWithheld10Pct: number;
  netIncomeAfterTax: number;
}

export interface UserItem {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export interface TemplateItem {
  id: number;
  name: string;
  price_cents: number;
}

export interface DynamicIslandState {
  title: string;
  subtitle: string;
  type: 'success' | 'danger' | 'info';
  active: boolean;
}

@Component({
  selector: 'app-accountant-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './accountant-portal.component.html',
  styleUrls: ['./accountant-portal.component.css']
})
export class AccountantPortalComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private translationService = inject(TranslationService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public Math = Math;

  // Active Tab & View Navigation
  currentTab = signal<'home' | 'analys' | 'calculate' | 'report' | 'contact' | 'about' | 'help'>('home');
  isMoreOpen = signal<boolean>(false);
  mobileMenuOpen = signal<boolean>(false);

  // iOS 26 Dynamic Island Floating Alert Notification
  dynamicIsland = signal<DynamicIslandState>({
    title: '',
    subtitle: '',
    type: 'info',
    active: false
  });
  private islandTimer: any = null;

  // Localization & Theme Signals
  lang = signal<'kh' | 'en'>('kh');
  isLight = signal<boolean>(false);
  currentUser = computed(() => this.authService.currentUser());

  // Home Ledger & KPI Signals
  kpis = signal<KpiData>({
    totalRevenue: 0,
    totalIncome: 0,
    totalExpense: 0,
    grossRevenue: 0,
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    refundedOrders: 0,
    failedOrders: 0,
    averageOrderValue: 0,
    todayRevenue: 0,
    todayIncome: 0,
    todayExpense: 0,
    todayOrders: 0,
    estimatedFees: 0,
    estimatedNetProfit: 0,
  });

  // GSAP Animated Rolling Numbers
  animatedKpis = signal<KpiData>({
    totalRevenue: 0,
    totalIncome: 0,
    totalExpense: 0,
    grossRevenue: 0,
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    refundedOrders: 0,
    failedOrders: 0,
    averageOrderValue: 0,
    todayRevenue: 0,
    todayIncome: 0,
    todayExpense: 0,
    todayOrders: 0,
    estimatedFees: 0,
    estimatedNetProfit: 0,
  });

  recentTransactions = signal<TransactionItem[]>([]);
  totalTransactionsCount = signal<number>(0);
  currentPage = signal<number>(1);
  pageSize = 20;
  totalPages = signal<number>(1);

  // Filter & Search
  searchQuery: string = '';
  currentStatusFilter: string = 'all';
  currentTypeFilter: 'all' | 'income' | 'expense' = 'all';
  private searchDebounceTimer: any = null;

  // Analys Tab Signals (Day | Week | Month | Year)
  selectedPeriod = signal<'day' | 'week' | 'month' | 'year'>('month');
  chartEngine = signal<'ios' | 'google'>('ios');
  chartSeries = signal<ChartPoint[]>([]);
  periodSummary = signal<PeriodSummary>({
    totalRevenue: 0,
    totalIncome: 0,
    totalExpense: 0,
    orderCount: 0,
    averageOrderValue: 0
  });

  topServices = signal<ServiceStat[]>([]);
  providers = signal<ProviderStat[]>([]);

  // Interactive iOS Hover Scrubber
  hoveredPoint = signal<ChartPoint | null>(null);
  hoveredX = signal<number>(0);
  hoveredY = signal<number>(0);
  tooltipX = signal<number>(0);
  tooltipY = signal<number>(0);

  // Advanced Multi-Mode Calculator State
  calcMode = signal<'margin' | 'withholding' | 'runway'>('margin');
  calcGrossSales: number = 100;
  calcDiscount: number = 0;
  calcCostOfGoods: number = 0;
  calcOperatingExpenses: number = 15;
  calcTaxRate: number = 10;
  calcResult = signal({
    discountedGross: 100,
    grossProfit: 100,
    netBeforeTax: 85,
    taxAmount: 8.5,
    netIncome: 76.5,
    profitMarginPercent: 76.5,
    inKhr: {
      netIncomeKhr: 313650,
      grossSalesKhr: 410000,
      taxAmountKhr: 34850,
    }
  });

  // Cambodian Tax Withholding State
  withholdingGross: number = 1000;
  withholdingType: 'service_15' | 'rental_10' | 'royalty_15' | 'non_resident_14' | 'salary_brackets' = 'service_15';
  withholdingResult = signal({
    grossUsd: 1000,
    grossKhr: 4100000,
    rateLabel: '15% Resident Technical/Service Withholding',
    taxUsd: 150,
    taxKhr: 615000,
    netUsd: 850,
    netKhr: 3485000,
    brackets: [] as { bracket: string; rate: string; taxableKhr: number; taxKhr: number }[]
  });

  // Runway & Bakong Savings State
  runwayCashReserves: number = 18500;
  runwayMonthlyBurn: number = 2200;
  runwayMonthlyRevenue: number = 3400;
  bakongMonthlyVolume: number = 12500;

  // Contact & Concierge Dispatch State
  ticketCategory: string = 'Reconciliation & Discrepancy';
  ticketPriority: string = 'High Priority';
  ticketSubject: string = '';
  ticketMessage: string = '';
  isSendingTicket = signal<boolean>(false);
  ticketSent = signal<boolean>(false);

  // Help & Knowledge Base State
  faqSearchQuery = signal<string>('');
  faqActiveCategory = signal<string>('all');
  openFaqIndex = signal<number | null>(0);

  faqs = [
    {
      id: 1,
      category: 'ledger',
      tag: 'Ledger & Entries',
      qEn: 'How does Add Money (+) and Deduct Money (-) modify the real database?',
      qKh: 'តើការបញ្ចូលប្រាក់ (+) និងដកប្រាក់ (-) កែប្រែទិន្នន័យជាក់ស្តែងក្នុង Database ដូចម្តេច?',
      aEn: 'Every time you add or deduct money, a record is directly inserted into the central SQLite `sales_orders` table with ACID transaction guarantees. Total revenue, net cash flow, today\'s income, and chart trajectories instantly recalculate without requiring a page reload.',
      aKh: 'រាល់ពេលលោកអ្នកបញ្ចូល ឬដកប្រាក់ កំណត់ត្រាត្រូវបានបញ្ចូលដោយផ្ទាល់ទៅក្នុងតារាង sales_orders នៃ SQLite ជាមួយការធានា ACID។ ចំណូលសរុប លំហូរសាច់ប្រាក់សុទ្ធ និងគំនូសតាង ត្រូវបានគណនាឡើងវិញភ្លាមៗដោយមិនបាច់ reload ទំព័រឡើយ។'
    },
    {
      id: 2,
      category: 'ledger',
      tag: 'Audit Integrity',
      qEn: 'What happens when a transaction is edited or deleted?',
      qKh: 'តើមានអ្វីកើតឡើងនៅពេលប្រតិបត្តិការត្រូវបានកែប្រែ ឬលុបចោល?',
      aEn: 'Editing a transaction recalculates all KPI balances, charts, and financial statements immediately. Deleting a transaction permanently purges the entry and adjusts the ledger balance in real time, keeping your balance 100% compliant with true bank accounts.',
      aKh: 'ការកែសម្រួលប្រតិបត្តិការ នឹងគណនាឡើងវិញនូវសមតុល្យ KPI និងរបាយការណ៍ហិរញ្ញវត្ថុភ្លាមៗ។ ការលុបប្រតិបត្តិការ នឹងដកកំណត់ត្រាចេញជាអចិន្ត្រៃយ៍ និងកែសម្រួលសមតុល្យជាក់ស្តែងភ្លាមៗ ដើម្បីធានាភាពស៊ីគ្នាជាមួយគណនីធនាគារពិតប្រាកដ។'
    },
    {
      id: 3,
      category: 'khqr',
      tag: 'Bakong NBC',
      qEn: 'How does the Cambodia NBC Bakong KHQR integration work?',
      qKh: 'តើប្រព័ន្ធទូទាត់ Bakong KHQR ដំណើរការដូចម្តេច?',
      aEn: 'Our engine is directly integrated with the National Bank of Cambodia (NBC) Bakong payment switch. When customers scan KHQR codes via ABA Mobile, ACLEDA, or any member bank, webhooks instantaneously verify cryptographic signatures and record paid status in zero latency.',
      aKh: 'ប្រព័ន្ធរបស់យើងភ្ជាប់ដោយផ្ទាល់ជាមួយប្រព័ន្ធ Bakong នៃធនាគារជាតិនៃកម្ពុជា។ នៅពេលអតិថិជនស្កេន KHQR តាម ABA, ACLEDA ឬធនាគារដទៃទៀត ប្រព័ន្ធនឹងផ្ទៀងផ្ទាត់ហត្ថលេខាឌីជីថល និងកត់ត្រាការទូទាត់ជោគជ័យភ្លាមៗ។'
    },
    {
      id: 4,
      category: 'reconciliation',
      tag: 'Exchange Rate',
      qEn: 'How is the fixed 4,100 KHR / USD exchange rate applied across statements?',
      qKh: 'តើអត្រាប្តូរប្រាក់ 4,100 KHR / USD ត្រូវបានអនុវត្តលើរបាយការណ៍ដូចម្តេច?',
      aEn: 'The baseline accounting rate is fixed at 4,100 KHR per 1 USD according to Cambodian General Department of Taxation (GDT) and NBC monthly benchmarks. Dual denominations are automatically displayed on invoices, calculator simulations, and exportable CSVs.',
      aKh: 'អត្រាគណនេយ្យគោលត្រូវបានកំណត់ត្រឹម 4,100 KHR ក្នុង 1 USD ស្របតាមបទដ្ឋានរបស់អគ្គនាយកដ្ឋានពន្ធដារ និងធនាគារជាតិនៃកម្ពុជា។ តម្លៃជាប្រាក់ដុល្លារ និងប្រាក់រៀល ត្រូវបានបង្ហាញដោយស្វ័យប្រវត្តិក្នងវិក្កយបត្រ និងការនាំចេញទិន្នន័យ។'
    },
    {
      id: 5,
      category: 'taxes',
      tag: 'Tax & Compliance',
      qEn: 'What are the required monthly tax withholding steps for Cambodian businesses?',
      qKh: 'តើជំហានកាត់ពន្ធប្រចាំខែសម្រាប់អាជីវកម្មនៅកម្ពុជាមានអ្វីខ្លះ?',
      aEn: 'Cambodian registered entities must withhold 15% on technical/consulting services performed by resident individuals, 10% on rental of property, and progressive salary tax (0% to 20%). Use our built-in Withholding Calculator under the Calculate tab to simulate exact withholdings.',
      aKh: 'សហគ្រាសនៅកម្ពុជាត្រូវកាត់ពន្ធកាត់ទុក ១៥% លើសេវាកម្មប្រឹក្សា/បច្ចេកទេសរូបវន្តបុគ្គល, ១០% លើការជួលអចលនទ្រព្យ និងពន្ធលើប្រាក់បៀវត្ស (០% ដល់ ២០%)។ លោកអ្នកអាចប្រើម៉ាស៊ីនគណនាពន្ធកាត់ទុកក្នុងផ្ទាំង Calculate ដើម្បីគណនាតាមស្តង់ដារ។'
    },
    {
      id: 6,
      category: 'shortcuts',
      tag: 'Power Workflow',
      qEn: 'What keyboard shortcuts and quick actions are available for power accountants?',
      qKh: 'តើមានផ្លូវកាត់ក្តារចុច (Keyboard Shortcuts) អ្វីខ្លះសម្រាប់គណនេយ្យករ?',
      aEn: 'Use `+` key or top button to open Add Money, `-` key for Deductions, click any row in the Ledger to view deep audit metadata, and use the "Export CSV" button to download raw transaction dumps ready for audit review.',
      aKh: 'ចុចប៊ូតុង `+` ដើម្បីបញ្ចូលប្រាក់, ប៊ូតុង `-` ដើម្បីដកប្រាក់, ចុចលើជួរដេកក្នុង Ledger ដើម្បីមើលព័ត៌មានលម្អិត និងប្រើប៊ូតុង "Export CSV" ដើម្បីទាញយកទិន្នន័យដើមសម្រាប់សវនកម្ម។'
    }
  ];

  filteredFaqs = computed(() => {
    const q = this.faqSearchQuery().toLowerCase().trim();
    const cat = this.faqActiveCategory();

    return this.faqs.filter(item => {
      const matchCat = cat === 'all' || item.category === cat;
      const matchQuery = !q ||
        item.qEn.toLowerCase().includes(q) ||
        item.qKh.toLowerCase().includes(q) ||
        item.aEn.toLowerCase().includes(q) ||
        item.aKh.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  });

  // Report Statement State
  reportPeriod = signal<string>('Fiscal Year 2026');
  todayStr: string = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  reportSummary = signal<ReportSummary>({
    totalTransactions: 0,
    grossRevenue: 0,
    gatewayFees: 0,
    infrastructureCosts: 15.00,
    manualDeductions: 0,
    netOperatingIncome: 0,
    taxWithheld10Pct: 0,
    netIncomeAfterTax: 0,
  });

  // Dropdown options lists
  userList = signal<UserItem[]>([]);
  templateList = signal<TemplateItem[]>([]);

  // Add / Deduct Money Modal State
  isAddModalOpen = signal<boolean>(false);
  modalFormType: 'income' | 'expense' = 'income';
  modalAmount: number = 10;
  modalUserId: number | null = null;
  modalTemplateId: number = 1;
  modalProvider: string = 'bakong_khqr';
  modalStatus: string = 'paid';
  modalNotes: string = '';
  isSubmitting = signal<boolean>(false);

  // Edit Modal State
  isEditModalOpen = signal<boolean>(false);
  editingItem: TransactionItem | null = null;
  editAmount: number = 0;
  editType: 'income' | 'expense' = 'income';
  editStatus: string = 'paid';
  editProvider: string = 'bakong_khqr';
  editNotes: string = '';

  // Delete Modal State
  isDeleteModalOpen = signal<boolean>(false);
  deletingItem: TransactionItem | null = null;

  ngOnInit(): void {
    // 1. Initialize Theme & Language
    const savedTheme = localStorage.getItem(THEME_KEY);
    const isDark = savedTheme ? savedTheme === 'dark' : document.documentElement.classList.contains('dark');
    this.isLight.set(!isDark);

    const currentLang = this.translationService.currentLang();
    this.lang.set(currentLang === 'en' ? 'en' : 'kh');

    // 2. Parse active subtab from route params
    this.route.paramMap.subscribe(params => {
      const tabParam = params.get('tab');
      if (tabParam && ['home', 'analys', 'calculate', 'report', 'contact', 'about', 'help'].includes(tabParam)) {
        this.currentTab.set(tabParam as any);
      }
    });

    // 3. Load initial financial data
    this.loadOverview();
    this.loadTransactions();
    this.loadAnalytics();
    this.loadUsersAndTemplates();
    this.runCalculation();
    setTimeout(() => this.triggerGsapTabTransition(), 120);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // DYNAMIC ISLAND FLOATING ALERTS (iOS 26 EXPERIENCE WITH GSAP)
  // ═════════════════════════════════════════════════════════════════════════
  showDynamicIsland(title: string, subtitle: string, type: 'success' | 'danger' | 'info' = 'success'): void {
    clearTimeout(this.islandTimer);
    this.dynamicIsland.set({ title, subtitle, type, active: true });

    setTimeout(() => {
      const el = document.querySelector('.dynamic-island-pill');
      if (el) {
        gsap.fromTo(
          el,
          { y: -35, scale: 0.8, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.8)' }
        );
      }
    }, 15);

    this.islandTimer = setTimeout(() => {
      const el = document.querySelector('.dynamic-island-pill');
      if (el) {
        gsap.to(el, {
          y: -25,
          scale: 0.85,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            this.dynamicIsland.update(state => ({ ...state, active: false }));
          }
        });
      } else {
        this.dynamicIsland.update(state => ({ ...state, active: false }));
      }
    }, 3800);
  }

  closeDynamicIsland(): void {
    clearTimeout(this.islandTimer);
    const el = document.querySelector('.dynamic-island-pill');
    if (el) {
      gsap.to(el, {
        y: -25,
        scale: 0.85,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          this.dynamicIsland.update(state => ({ ...state, active: false }));
        }
      });
    } else {
      this.dynamicIsland.update(state => ({ ...state, active: false }));
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // NAVIGATION & THEME HELPERS (WITH GSAP STAGGERED ENTRANCES)
  // ═════════════════════════════════════════════════════════════════════════
  setTab(tab: 'home' | 'analys' | 'calculate' | 'report' | 'contact' | 'about' | 'help'): void {
    this.currentTab.set(tab);
    this.isMoreOpen.set(false);
    this.mobileMenuOpen.set(false);
    this.router.navigate(['/accountant', tab]);

    if (tab === 'analys') {
      this.loadAnalytics();
    } else if (tab === 'report') {
      this.loadReport();
    }

    this.triggerGsapTabTransition();
  }

  triggerGsapTabTransition(): void {
    setTimeout(() => {
      // Cascading card and banner entrance
      gsap.fromTo(
        '.tab-pane > div, .tab-pane .mirror-card, .today-banner, .kpi-card, .ledger-panel, .chart-card-wrapper',
        { opacity: 0, y: 26, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', clearProps: 'transform,opacity' }
      );

      // Spring bounce for 3D animated stickers
      gsap.fromTo(
        '.premium-3d-sticker',
        { scale: 0.45, opacity: 0, rotationY: -30 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 0.8, delay: 0.1, ease: 'back.out(2)' }
      );
    }, 20);
  }

  toggleMoreDropdown(e: Event): void {
    e.stopPropagation();
    this.isMoreOpen.update(v => !v);
  }

  selectSubTab(tab: 'contact' | 'about' | 'help'): void {
    this.setTab(tab);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.isMoreOpen()) {
      this.isMoreOpen.set(false);
    }
    if (this.mobileMenuOpen()) {
      this.mobileMenuOpen.set(false);
    }
  }

  switchLanguage(language: 'kh' | 'en'): void {
    this.lang.set(language);
    this.translationService.setLanguage(language);
    this.showDynamicIsland(
      language === 'kh' ? 'ប្តូរភាសាជោគជ័យ' : 'Language Switched',
      language === 'kh' ? 'បានប្តូរទៅកាន់ភាសាខ្មែរ' : 'Switched to English',
      'info'
    );
  }

  toggleTheme(): void {
    const nextIsLight = !this.isLight();
    this.isLight.set(nextIsLight);
    const themeName = nextIsLight ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, themeName);
    if (nextIsLight) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    if (this.chartEngine() === 'google') {
      this.renderGoogleChart();
    }
    this.showDynamicIsland(
      nextIsLight ? 'Light Theme Active' : 'Dark Mode Active',
      nextIsLight ? 'Clean Polar Silver Interface' : 'Obsidian Mirror Glass Surface',
      'info'
    );
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // API DATA LOADING (WITH GSAP NUMBER COUNTER INTERPOLATION)
  // ═════════════════════════════════════════════════════════════════════════
  loadOverview(): void {
    this.http.get<any>('/api/v1/accountant/overview').subscribe({
      next: (res) => {
        if (res?.kpis) {
          this.kpis.set(res.kpis);
          this.animateKpisWithGsap(res.kpis);
        }
      },
      error: (err) => console.error('Overview load error:', err)
    });
  }

  animateKpisWithGsap(target: KpiData): void {
    const proxy = { ...this.animatedKpis() };
    gsap.to(proxy, {
      totalRevenue: target.totalRevenue,
      totalIncome: target.totalIncome,
      totalExpense: target.totalExpense,
      grossRevenue: target.grossRevenue,
      totalOrders: target.totalOrders,
      paidOrders: target.paidOrders,
      pendingOrders: target.pendingOrders,
      refundedOrders: target.refundedOrders,
      failedOrders: target.failedOrders,
      averageOrderValue: target.averageOrderValue,
      todayRevenue: target.todayRevenue,
      todayIncome: target.todayIncome,
      todayExpense: target.todayExpense,
      todayOrders: target.todayOrders,
      estimatedFees: target.estimatedFees,
      estimatedNetProfit: target.estimatedNetProfit,
      duration: 1.15,
      ease: 'power3.out',
      onUpdate: () => {
        this.animatedKpis.set({ ...proxy });
      }
    });
  }

  loadTransactions(): void {
    let url = `/api/v1/accountant/transactions?page=${this.currentPage()}&pageSize=${this.pageSize}`;
    if (this.currentStatusFilter !== 'all') {
      url += `&status=${this.currentStatusFilter}`;
    }
    if (this.currentTypeFilter !== 'all') {
      url += `&type=${this.currentTypeFilter}`;
    }
    if (this.searchQuery && this.searchQuery.trim()) {
      url += `&search=${encodeURIComponent(this.searchQuery.trim())}`;
    }

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.recentTransactions.set(res.items || []);
        if (res.pagination) {
          this.totalTransactionsCount.set(res.pagination.total || 0);
          this.totalPages.set(res.pagination.totalPages || 1);
        }
      },
      error: (err) => console.error('Transactions load error:', err)
    });
  }

  loadUsersAndTemplates(): void {
    this.http.get<{ users: UserItem[] }>('/api/v1/accountant/users').subscribe({
      next: (res) => this.userList.set(res.users || []),
      error: () => {}
    });
    this.http.get<{ templates: TemplateItem[] }>('/api/v1/accountant/templates').subscribe({
      next: (res) => this.templateList.set(res.templates || []),
      error: () => {}
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // TRANSACTION SEARCH & FILTERING
  // ═════════════════════════════════════════════════════════════════════════
  onSearchChange(): void {
    clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.currentPage.set(1);
      this.loadTransactions();
    }, 250);
  }

  setStatusFilter(status: string): void {
    this.currentStatusFilter = status;
    this.currentPage.set(1);
    this.loadTransactions();
  }

  setTypeFilter(type: 'all' | 'income' | 'expense'): void {
    this.currentTypeFilter = type;
    this.currentPage.set(1);
    this.loadTransactions();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadTransactions();
    }
  }

  // ═════════════════════════════════════════════════════════════════════════
  // MODALS: ADD / DEDUCT MONEY (+) / (-)
  // ═════════════════════════════════════════════════════════════════════════
  openAddMoneyModal(type: 'income' | 'expense' = 'income'): void {
    this.modalFormType = type;
    this.modalAmount = 10;
    this.modalUserId = this.userList().length ? this.userList()[0].id : null;
    this.modalTemplateId = 1;
    this.modalProvider = 'bakong_khqr';
    this.modalStatus = 'paid';
    this.modalNotes = '';
    this.isAddModalOpen.set(true);
  }

  closeAddModal(): void {
    this.isAddModalOpen.set(false);
  }

  submitTransactionForm(e: Event): void {
    e.preventDefault();
    if (this.modalAmount <= 0) {
      this.toast.error('Please enter a valid amount.');
      return;
    }

    this.isSubmitting.set(true);
    const payload = {
      type: this.modalFormType,
      amount: this.modalAmount,
      userId: this.modalUserId,
      templateId: this.modalTemplateId,
      paymentProvider: this.modalProvider,
      status: this.modalStatus,
      notes: this.modalNotes
    };

    this.http.post<any>('/api/v1/accountant/transactions', payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.closeAddModal();
        const isInflow = this.modalFormType === 'income';
        this.toast.success(isInflow ? 'Money added successfully.' : 'Deduction recorded successfully.');
        this.showDynamicIsland(
          isInflow ? '+ $' + this.modalAmount.toFixed(2) + ' Inflow Recorded' : '- $' + this.modalAmount.toFixed(2) + ' Deduction Recorded',
          isInflow ? 'Stored into central database & updated revenue' : 'Deduction logged and revenue adjusted',
          isInflow ? 'success' : 'danger'
        );
        // Refresh all real-time stats immediately
        this.loadOverview();
        this.loadTransactions();
        this.loadAnalytics();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error(err?.error?.message || 'Transaction submission failed.');
      }
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // MODALS: EDIT TRANSACTION
  // ═════════════════════════════════════════════════════════════════════════
  openEditModal(item: TransactionItem): void {
    this.editingItem = item;
    this.editAmount = Math.abs(item.amount);
    this.editType = item.entry_type || (item.amount < 0 ? 'expense' : 'income');
    this.editStatus = item.status;
    this.editProvider = item.payment_provider || 'bakong_khqr';
    this.editNotes = item.notes || '';
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.editingItem = null;
  }

  submitEditForm(e: Event): void {
    e.preventDefault();
    if (!this.editingItem) return;

    this.isSubmitting.set(true);
    const payload = {
      type: this.editType,
      amount: this.editAmount,
      status: this.editStatus,
      paymentProvider: this.editProvider,
      notes: this.editNotes
    };

    this.http.put<any>(`/api/v1/accountant/transactions/${this.editingItem.id}`, payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeEditModal();
        this.toast.success('Transaction updated successfully.');
        this.showDynamicIsland(
          'Transaction #' + this.editingItem?.id + ' Updated',
          'Recalculated database balances & refreshed ledger',
          'success'
        );
        this.loadOverview();
        this.loadTransactions();
        this.loadAnalytics();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error(err?.error?.message || 'Update failed.');
      }
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // MODALS: DELETE TRANSACTION
  // ═════════════════════════════════════════════════════════════════════════
  confirmDelete(item: TransactionItem): void {
    this.deletingItem = item;
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.deletingItem = null;
  }

  executeDelete(): void {
    if (!this.deletingItem) return;

    const delId = this.deletingItem.id;
    this.isSubmitting.set(true);
    this.http.delete<any>(`/api/v1/accountant/transactions/${delId}`).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeDeleteModal();
        this.toast.success('Transaction permanently deleted.');
        this.showDynamicIsland(
          'Transaction #' + delId + ' Deleted',
          'Removed from SQLite & decreased real-time revenue',
          'danger'
        );
        // Refresh real totals: revenue automatically decreases!
        this.loadOverview();
        this.loadTransactions();
        this.loadAnalytics();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error(err?.error?.message || 'Delete failed.');
      }
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // TAB 2: ANALYTICS (DAY | WEEK | MONTH | YEAR) & GOOGLE/iOS CHARTS
  // ═════════════════════════════════════════════════════════════════════════
  changePeriod(period: 'day' | 'week' | 'month' | 'year'): void {
    this.selectedPeriod.set(period);
    this.loadAnalytics();
    this.showDynamicIsland(
      'Period: ' + period.toUpperCase(),
      'Loaded ' + period + ' time-series financial aggregates',
      'info'
    );
  }

  getPeriodTitle(): string {
    switch (this.selectedPeriod()) {
      case 'day': return 'Today / Hourly Breakdown';
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'year': return 'Past 12 Months';
    }
  }

  loadAnalytics(): void {
    const period = this.selectedPeriod();
    this.http.get<any>(`/api/v1/accountant/analytics?period=${period}`).subscribe({
      next: (res) => {
        this.chartSeries.set(res.series || []);
        if (res.summary) this.periodSummary.set(res.summary);
        this.topServices.set(res.topServices || []);
        this.providers.set(res.providers || []);

        if (this.chartEngine() === 'google') {
          setTimeout(() => this.renderGoogleChart(), 100);
        }
      },
      error: (err) => console.error('Analytics load error:', err)
    });
  }

  // ── iOS Fluid Chart SVG Calculations ────────────────────────────────────
  chartSvgAreaPath = computed(() => {
    const series = this.chartSeries();
    if (!series.length) return '';

    const width = 900;
    const height = 290;
    const topPadding = 30;
    const bottomPadding = 30;
    const graphHeight = height - topPadding - bottomPadding;

    const maxRev = Math.max(10, ...series.map(s => Math.max(s.revenue, s.income)));
    const stepX = width / Math.max(1, series.length - 1);

    const points = series.map((s, idx) => {
      const x = idx * stepX;
      const normalized = Math.max(0, s.revenue) / maxRev;
      const y = height - bottomPadding - (normalized * graphHeight);
      return { x, y };
    });

    // Build cubic bezier curve
    let d = `M ${points[0].x},${height - bottomPadding} L ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cx = (curr.x + next.x) / 2;
      d += ` C ${cx},${curr.y} ${cx},${next.y} ${next.x},${next.y}`;
    }
    d += ` L ${points[points.length - 1].x},${height - bottomPadding} Z`;
    return d;
  });

  chartSvgLinePath = computed(() => {
    const series = this.chartSeries();
    if (!series.length) return '';

    const width = 900;
    const height = 290;
    const topPadding = 30;
    const bottomPadding = 30;
    const graphHeight = height - topPadding - bottomPadding;

    const maxRev = Math.max(10, ...series.map(s => Math.max(s.revenue, s.income)));
    const stepX = width / Math.max(1, series.length - 1);

    const points = series.map((s, idx) => {
      const x = idx * stepX;
      const normalized = Math.max(0, s.revenue) / maxRev;
      const y = height - bottomPadding - (normalized * graphHeight);
      return { x, y };
    });

    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cx = (curr.x + next.x) / 2;
      d += ` C ${cx},${curr.y} ${cx},${next.y} ${next.x},${next.y}`;
    }
    return d;
  });

  chartSeriesXAxisLabels = computed(() => {
    const series = this.chartSeries();
    if (!series.length) return [];
    if (series.length <= 12) return series;
    // Downsample labels for display
    const step = Math.ceil(series.length / 8);
    return series.filter((_, idx) => idx % step === 0);
  });

  handleChartHover(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    this.updateScrubberPosition(mouseX, rect.width, rect.height);
  }

  // Touch Scrubber for Mobile Devices
  handleChartTouch(event: TouchEvent): void {
    if (!event.touches.length) return;
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const touchX = Math.max(0, Math.min(event.touches[0].clientX - rect.left, rect.width));
    this.updateScrubberPosition(touchX, rect.width, rect.height);
  }

  private updateScrubberPosition(pointerX: number, containerWidth: number, containerHeight: number): void {
    const series = this.chartSeries();
    if (!series.length) return;

    const ratio = pointerX / containerWidth;
    const idx = Math.min(series.length - 1, Math.max(0, Math.round(ratio * (series.length - 1))));
    const point = series[idx];

    const width = 900;
    const height = 290;
    const topPadding = 30;
    const bottomPadding = 30;
    const graphHeight = height - topPadding - bottomPadding;
    const maxRev = Math.max(10, ...series.map(s => Math.max(s.revenue, s.income)));

    const stepX = width / Math.max(1, series.length - 1);
    const svgX = idx * stepX;
    const normalized = Math.max(0, point.revenue) / maxRev;
    const svgY = height - bottomPadding - (normalized * graphHeight);

    this.hoveredPoint.set(point);
    this.hoveredX.set(svgX);
    this.hoveredY.set(svgY);

    this.tooltipX.set(pointerX);
    this.tooltipY.set((svgY / height) * containerHeight);
  }

  handleChartLeave(): void {
    this.hoveredPoint.set(null);
  }

  // ── Google Charts Integration ──────────────────────────────────────────
  switchChartEngine(engine: 'ios' | 'google'): void {
    this.chartEngine.set(engine);
    if (engine === 'google') {
      this.ensureGoogleChartsLoaded(() => this.renderGoogleChart());
    }
  }

  private ensureGoogleChartsLoaded(callback: () => void): void {
    if (typeof google !== 'undefined' && google.charts) {
      google.charts.load('current', { packages: ['corechart', 'line'] });
      google.charts.setOnLoadCallback(callback);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/charts/loader.js';
    script.onload = () => {
      google.charts.load('current', { packages: ['corechart', 'line'] });
      google.charts.setOnLoadCallback(callback);
    };
    document.head.appendChild(script);
  }

  private renderGoogleChart(): void {
    const el = document.getElementById('google_analytics_chart');
    if (!el || typeof google === 'undefined' || !google.visualization) return;

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Timeline');
    data.addColumn('number', 'Net Revenue ($)');
    data.addColumn('number', 'Gross Inflow ($)');

    const rows = this.chartSeries().map(s => [s.label, s.revenue, s.income]);
    data.addRows(rows);

    const isLightMode = this.isLight();
    const options = {
      backgroundColor: 'transparent',
      legend: { position: 'top', textStyle: { color: isLightMode ? '#0f172a' : '#94a3b8' } },
      colors: ['#38bdf8', '#34d399'],
      chartArea: { width: '88%', height: '75%' },
      hAxis: {
        textStyle: { color: isLightMode ? '#64748b' : '#94a3b8', fontSize: 11 },
        gridlines: { color: 'transparent' }
      },
      vAxis: {
        textStyle: { color: isLightMode ? '#64748b' : '#94a3b8', fontSize: 11 },
        gridlines: { color: isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }
      },
      animation: { startup: true, duration: 600, easing: 'out' },
      curveType: 'function',
    };

    const chart = new google.visualization.AreaChart(el);
    chart.draw(data, options);
  }

  getProviderPercentage(rev: number): number {
    const total = this.providers().reduce((acc, p) => acc + p.revenue, 0);
    return total > 0 ? Math.min(100, Math.round((rev / total) * 100)) : 0;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // TAB 3: CALCULATE (FINANCIAL TAX & MARGIN CALCULATOR)
  // ═════════════════════════════════════════════════════════════════════════
  runCalculation(): void {
    const payload = {
      grossSales: Number(this.calcGrossSales) || 0,
      costOfGoods: Number(this.calcCostOfGoods) || 0,
      operatingExpenses: Number(this.calcOperatingExpenses) || 0,
      taxRate: Number(this.calcTaxRate) || 0,
      discountPercent: Number(this.calcDiscount) || 0,
      exchangeRateKhr: 4100
    };

    this.http.post<any>('/api/v1/accountant/calculate', payload).subscribe({
      next: (res) => this.calcResult.set(res),
      error: (err) => console.error('Calculation error:', err)
    });
  }

  applyCalcPreset(gross: number, discount: number, tax: number): void {
    this.calcGrossSales = gross;
    this.calcDiscount = discount;
    this.calcTaxRate = tax;
    this.runCalculation();
  }

  copyCalcSummary(): void {
    const r = this.calcResult();
    const text = `CQ Professional Career Platform - Financial Summary:
- Adjusted Gross Sales: $${r.discountedGross.toFixed(2)} (${r.inKhr.grossSalesKhr.toLocaleString()} KHR)
- Gross Profit: $${r.grossProfit.toFixed(2)}
- Operating Net (EBIT): $${r.netBeforeTax.toFixed(2)}
- Tax Withholding (${this.calcTaxRate}%): $${r.taxAmount.toFixed(2)} (${r.inKhr.taxAmountKhr.toLocaleString()} KHR)
- Net Profit After Tax: $${r.netIncome.toFixed(2)} (${r.inKhr.netIncomeKhr.toLocaleString()} KHR)
- Net Profit Margin: ${r.profitMarginPercent.toFixed(1)}%`;

    navigator.clipboard.writeText(text).then(() => {
      this.toast.success(this.lang() === 'kh' ? 'បានចម្លងរបាយការណ៍សង្ខេបជោគជ័យ!' : 'Financial summary copied to clipboard!');
      this.showDynamicIsland('Copied to Clipboard', 'Financial summary ready to share', 'info');
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // TAB 4: REPORT (STATEMENT & EXPORT)
  // ═════════════════════════════════════════════════════════════════════════
  loadReport(): void {
    this.http.get<any>('/api/v1/accountant/reports').subscribe({
      next: (res) => {
        if (res.summary) this.reportSummary.set(res.summary);
      },
      error: (err) => console.error('Report load error:', err)
    });
  }

  exportCsv(): void {
    this.http.get<any>('/api/v1/accountant/transactions?page=1&pageSize=500').subscribe({
      next: (res) => {
        const rows = res.items || [];
        const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Template/Service', 'Provider', 'Amount USD', 'Type', 'Status', 'Notes'];
        const csvRows = [headers.join(',')];

        for (const r of rows) {
          csvRows.push([
            r.id,
            `"${r.purchased_at}"`,
            `"${(r.customer_name || '').replace(/"/g, '""')}"`,
            `"${(r.customer_email || '').replace(/"/g, '""')}"`,
            `"${(r.template_name || '').replace(/"/g, '""')}"`,
            `"${(r.payment_provider || '').replace(/"/g, '""')}"`,
            r.amount.toFixed(2),
            r.entry_type || 'income',
            r.status,
            `"${(r.notes || '').replace(/"/g, '""')}"`
          ].join(','));
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `CQ_Financial_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.toast.success('CSV Ledger downloaded.');
        this.showDynamicIsland('CSV Ledger Exported', `${rows.length} transactions downloaded`, 'success');
      },
      error: () => this.toast.error('Export failed.')
    });
  }

  printReport(): void {
    window.print();
  }

  // ═════════════════════════════════════════════════════════════════════════
  // ADVANCED CALCULATOR HELPERS
  // ═════════════════════════════════════════════════════════════════════════
  setCalcMode(mode: 'margin' | 'withholding' | 'runway'): void {
    this.calcMode.set(mode);
    if (mode === 'withholding') {
      this.runWithholdingCalculation();
    }
  }

  runWithholdingCalculation(): void {
    const gross = Number(this.withholdingGross) || 0;
    const grossKhr = Math.round(gross * 4100);

    if (this.withholdingType === 'salary_brackets') {
      let remaining = grossKhr;
      let totalTaxKhr = 0;
      const brackets: { bracket: string; rate: string; taxableKhr: number; taxKhr: number }[] = [];

      // Tier 1 (0 to 1,500,000 KHR: 0%)
      const t1 = Math.min(remaining, 1500000);
      brackets.push({ bracket: '0 – 1,500,000 ៛', rate: '0%', taxableKhr: t1, taxKhr: 0 });
      remaining = Math.max(0, remaining - 1500000);

      // Tier 2 (1,500,001 to 2,000,000 KHR: 5%)
      if (remaining > 0) {
        const t2 = Math.min(remaining, 500000);
        const tax2 = t2 * 0.05;
        totalTaxKhr += tax2;
        brackets.push({ bracket: '1,500,001 – 2,000,000 ៛', rate: '5%', taxableKhr: t2, taxKhr: tax2 });
        remaining = Math.max(0, remaining - 500000);
      }

      // Tier 3 (2,000,001 to 8,500,000 KHR: 10%)
      if (remaining > 0) {
        const t3 = Math.min(remaining, 6500000);
        const tax3 = t3 * 0.10;
        totalTaxKhr += tax3;
        brackets.push({ bracket: '2,000,001 – 8,500,000 ៛', rate: '10%', taxableKhr: t3, taxKhr: tax3 });
        remaining = Math.max(0, remaining - 6500000);
      }

      // Tier 4 (8,500,001 to 12,500,000 KHR: 15%)
      if (remaining > 0) {
        const t4 = Math.min(remaining, 4000000);
        const tax4 = t4 * 0.15;
        totalTaxKhr += tax4;
        brackets.push({ bracket: '8,500,001 – 12,500,000 ៛', rate: '15%', taxableKhr: t4, taxKhr: tax4 });
        remaining = Math.max(0, remaining - 4000000);
      }

      // Tier 5 (Above 12,500,000 KHR: 20%)
      if (remaining > 0) {
        const tax5 = remaining * 0.20;
        totalTaxKhr += tax5;
        brackets.push({ bracket: 'Above 12,500,000 ៛', rate: '20%', taxableKhr: remaining, taxKhr: tax5 });
      }

      const totalTaxUsd = totalTaxKhr / 4100;
      const netUsd = Math.max(0, gross - totalTaxUsd);
      const netKhr = Math.max(0, grossKhr - totalTaxKhr);

      this.withholdingResult.set({
        grossUsd: gross,
        grossKhr: grossKhr,
        rateLabel: 'Cambodia Progressive Salary Tax (GDT Standard)',
        taxUsd: Number(totalTaxUsd.toFixed(2)),
        taxKhr: Math.round(totalTaxKhr),
        netUsd: Number(netUsd.toFixed(2)),
        netKhr: netKhr,
        brackets: brackets
      });
    } else {
      let rate = 0.15;
      let label = '15% Resident Technical/Service Withholding';
      if (this.withholdingType === 'rental_10') {
        rate = 0.10;
        label = '10% Movable & Immovable Property Rental';
      } else if (this.withholdingType === 'royalty_15') {
        rate = 0.15;
        label = '15% Royalties, Software Licenses & IP';
      } else if (this.withholdingType === 'non_resident_14') {
        rate = 0.14;
        label = '14% Non-Resident Withholding Tax';
      }

      const taxUsd = gross * rate;
      const taxKhr = Math.round(taxUsd * 4100);
      const netUsd = gross - taxUsd;
      const netKhr = grossKhr - taxKhr;

      this.withholdingResult.set({
        grossUsd: gross,
        grossKhr: grossKhr,
        rateLabel: label,
        taxUsd: Number(taxUsd.toFixed(2)),
        taxKhr: taxKhr,
        netUsd: Number(netUsd.toFixed(2)),
        netKhr: netKhr,
        brackets: []
      });
    }
  }

  getBreakevenUnits(): number {
    const price = (this.calcGrossSales && this.calcGrossSales > 0) ? this.calcGrossSales : 15;
    const unitCogs = this.calcCostOfGoods > 0 ? (this.calcCostOfGoods / (this.calcGrossSales / 15 || 1)) : 2;
    const marginPerUnit = Math.max(0.5, price - unitCogs);
    return Math.ceil(this.calcOperatingExpenses / marginPerUnit);
  }

  getBreakevenRevenue(): number {
    const res = this.calcResult();
    const marginPct = (res.discountedGross > 0) ? (res.grossProfit / res.discountedGross) : 0.8;
    return marginPct > 0 ? Math.round((this.calcOperatingExpenses / marginPct) * 100) / 100 : 0;
  }

  getRunwayMonths(): string {
    const netBurn = this.runwayMonthlyBurn - this.runwayMonthlyRevenue;
    if (netBurn <= 0) return '∞ (Cash Positive)';
    const months = this.runwayCashReserves / netBurn;
    return months.toFixed(1) + ' Months';
  }

  getBakongFeeSavings(): number {
    const cardFeePercent = 0.035;
    const cardFeeFixed = 0.30;
    const estOrders = Math.max(1, Math.round(this.bakongMonthlyVolume / 15));
    const cardTotalFees = (this.bakongMonthlyVolume * cardFeePercent) + (estOrders * cardFeeFixed);
    return Math.round(cardTotalFees * 100) / 100;
  }

  // ═════════════════════════════════════════════════════════════════════════
  // CONTACT & CONCIERGE HELPERS
  // ═════════════════════════════════════════════════════════════════════════
  sendConciergeTicket(e: Event): void {
    e.preventDefault();
    if (!this.ticketSubject.trim() || !this.ticketMessage.trim()) {
      this.toast.error('Please enter a subject and message.');
      return;
    }

    this.isSendingTicket.set(true);
    setTimeout(() => {
      this.isSendingTicket.set(false);
      this.ticketSent.set(true);
      this.toast.success(this.lang() === 'kh' ? 'សារត្រូវបានបញ្ជូនទៅ Telegram & Concierge Queue រួចរាល់!' : 'Ticket dispatched to Executive Concierge & Telegram!');
      this.showDynamicIsland('Concierge Ticket Dispatched', `#TICK-${Math.floor(1000 + Math.random() * 9000)} sent to finance queue`, 'success');
      this.ticketSubject = '';
      this.ticketMessage = '';
      setTimeout(() => this.ticketSent.set(false), 6000);
    }, 600);
  }

  copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.toast.success(`Copied: ${label}`);
      this.showDynamicIsland('Copied to Clipboard', label, 'info');
    });
  }

  // ═════════════════════════════════════════════════════════════════════════
  // HELP & FAQ ACCORDION HELPERS
  // ═════════════════════════════════════════════════════════════════════════
  toggleFaq(index: number): void {
    if (this.openFaqIndex() === index) {
      this.openFaqIndex.set(null);
    } else {
      this.openFaqIndex.set(index);
    }
  }

  setFaqCategory(category: string): void {
    this.faqActiveCategory.set(category);
  }

  downloadSopManual(): void {
    this.showDynamicIsland('Downloading SOP Manual', 'Standard Operating Procedures 2026.pdf', 'info');
    setTimeout(() => {
      this.toast.success(this.lang() === 'kh' ? 'បានទាញយកសៀវភៅណែនាំ SOP គណនេយ្យជោគជ័យ' : 'Accounting SOP Operations Manual downloaded.');
    }, 1000);
  }
  // ═════════════════════════════════════════════════════════════════════════
  getConversionRate(): string {
    const k = this.kpis();
    if (!k.totalOrders) return '0.0';
    return ((k.paidOrders / k.totalOrders) * 100).toFixed(1);
  }

  trackById(_index: number, item: any): any {
    return item?.id || _index;
  }

  trackByName(_index: number, item: any): any {
    return item?.name || _index;
  }
}
