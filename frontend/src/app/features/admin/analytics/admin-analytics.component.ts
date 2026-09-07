import { Component, OnInit, OnDestroy, signal, computed, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Sun,
  Sunset,
  Moon,
  Users,
  User,
  DollarSign,
  CreditCard,
  Sparkles,
  RefreshCw,
  Check,
  Copy,
  X,
  Filter,
  Download,
  ShieldCheck,
  FileText,
  Activity,
  Layers,
  CircleAlert,
  CircleCheck,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpRight
} from 'lucide-angular';
import { ToastService } from '../../../shared/components/toast/toast.service';

export interface AnalyticsKpis {
  totalRevenueCents: number;
  totalRevenueDollars: number;
  paidOrders: number;
  totalOrders: number;
  payingUsers: number;
  unpaidPotentialCents: number;
  unpaidPotentialDollars: number;
  avgOrderCents: number;
  avgOrderDollars: number;
}

export interface TimeOfDayBucket {
  orders: number;
  revenue_cents: number;
  percent: number;
}

export interface TimeOfDayReport {
  morning: TimeOfDayBucket;
  afternoon: TimeOfDayBucket;
  evening: TimeOfDayBucket;
  night: TimeOfDayBucket;
}

export interface TrendPoint {
  label: string;
  date: string;
  fullLabel?: string;
  orders: number;
  revenueCents: number;
  revenueDollars: number;
}

export interface TopPayingUser {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  ordersCount: number;
  totalPaidCents: number;
  totalPaidDollars: number;
  lastPaymentAt?: string;
}

export interface TransactionItem {
  id: number;
  user_id: number;
  amount_cents: number;
  currency: string;
  status: string;
  payment_provider?: string;
  payment_ref?: string;
  purchased_at: string;
  full_name?: string;
  email?: string;
  template_name?: string;
}

interface SvgPoint {
  x: number;
  y: number;
  data: TrendPoint;
}

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css'],
})
export class AdminAnalyticsComponent implements OnInit, OnDestroy {
  // Lucide icon handles
  readonly TrendingUp = TrendingUp;
  readonly BarChart3 = BarChart3;
  readonly Calendar = Calendar;
  readonly Clock = Clock;
  readonly Sun = Sun;
  readonly Sunset = Sunset;
  readonly Moon = Moon;
  readonly Users = Users;
  readonly User = User;
  readonly DollarSign = DollarSign;
  readonly CreditCard = CreditCard;
  readonly Sparkles = Sparkles;
  readonly RefreshCw = RefreshCw;
  readonly Check = Check;
  readonly Copy = Copy;
  readonly X = X;
  readonly Filter = Filter;
  readonly Download = Download;
  readonly ShieldCheck = ShieldCheck;
  readonly FileText = FileText;
  readonly Activity = Activity;
  readonly Layers = Layers;
  readonly CircleAlert = CircleAlert;
  readonly CircleCheck = CircleCheck;
  readonly ChevronRight = ChevronRight;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly ArrowUpRight = ArrowUpRight;
  readonly Math = Math;

  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private autoRefreshTimer: any = null;

  @ViewChild('chartSvg') chartSvgRef!: ElementRef<SVGSVGElement>;

  // Filter state
  period = signal<'today' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('weekly');
  fromDate = signal<string>('');
  toDate = signal<string>('');
  selectedUserId = signal<number | null>(null);
  selectedUserObj = signal<any | null>(null);

  // Real-time state
  autoRefresh = signal<boolean>(true);
  loading = signal<boolean>(false);
  lastRefreshedAt = signal<Date>(new Date());

  // Data signals
  kpis = signal<AnalyticsKpis>({
    totalRevenueCents: 0,
    totalRevenueDollars: 0,
    paidOrders: 0,
    totalOrders: 0,
    payingUsers: 0,
    unpaidPotentialCents: 0,
    unpaidPotentialDollars: 0,
    avgOrderCents: 0,
    avgOrderDollars: 0,
  });

  timeOfDay = signal<TimeOfDayReport>({
    morning: { orders: 0, revenue_cents: 0, percent: 0 },
    afternoon: { orders: 0, revenue_cents: 0, percent: 0 },
    evening: { orders: 0, revenue_cents: 0, percent: 0 },
    night: { orders: 0, revenue_cents: 0, percent: 0 },
  });

  trend = signal<TrendPoint[]>([]);
  topPayingUsers = signal<TopPayingUser[]>([]);
  recentTransactions = signal<TransactionItem[]>([]);

  // Chart interactivity state
  hoveredIndex = signal<number | null>(null);
  hoveredPoint = signal<SvgPoint | null>(null);

  // Computed: SVG Chart Dimensions
  readonly chartWidth = 800;
  readonly chartHeight = 220;
  readonly paddingX = 30;
  readonly paddingY = 30;

  chartPoints = computed<SvgPoint[]>(() => {
    const list = this.trend();
    if (list.length === 0) return [];

    const width = this.chartWidth;
    const height = this.chartHeight;
    const padX = this.paddingX;
    const padY = this.paddingY;

    const maxVal = Math.max(...list.map((p) => p.revenueDollars), 10);
    const stepX = (width - padX * 2) / Math.max(list.length - 1, 1);

    return list.map((item, idx) => {
      const x = padX + idx * stepX;
      const normalizedY = item.revenueDollars / maxVal;
      const y = height - padY - normalizedY * (height - padY * 2);
      return { x, y, data: item };
    });
  });

  chartPath = computed<string>(() => {
    const points = this.chartPoints();
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(i + 2, points.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  });

  chartAreaPath = computed<string>(() => {
    const stroke = this.chartPath();
    const points = this.chartPoints();
    if (!stroke || points.length === 0) return '';
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = this.chartHeight - this.paddingY;
    return `${stroke} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  });

  maxTrendValue = computed<number>(() => {
    const list = this.trend();
    if (list.length === 0) return 10;
    return Math.max(...list.map((p) => p.revenueDollars), 10);
  });

  peakTimeOfDay = computed<string>(() => {
    const tod = this.timeOfDay();
    const buckets = [
      { name: 'Morning (05:00 - 12:00)', rev: tod.morning.revenue_cents, key: 'Morning' },
      { name: 'Afternoon (12:00 - 17:00)', rev: tod.afternoon.revenue_cents, key: 'Afternoon' },
      { name: 'Evening (17:00 - 22:00)', rev: tod.evening.revenue_cents, key: 'Evening' },
      { name: 'Night (22:00 - 05:00)', rev: tod.night.revenue_cents, key: 'Night' },
    ];
    buckets.sort((a, b) => b.rev - a.rev);
    return buckets[0].key;
  });

  ngOnInit() {
    this.loadData();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  loadData(isSilent = false) {
    if (!isSilent) this.loading.set(true);

    const params: any = {
      period: this.period(),
    };

    if (this.period() === 'custom') {
      if (this.fromDate()) params.from = this.fromDate();
      if (this.toDate()) params.to = this.toDate();
    }

    if (this.selectedUserId()) {
      params.userId = this.selectedUserId()!;
    }

    this.http.get<{
      kpis: AnalyticsKpis;
      timeOfDay: TimeOfDayReport;
      trend: TrendPoint[];
      topPayingUsers: TopPayingUser[];
      recentTransactions: TransactionItem[];
      selectedUser?: any;
    }>('/api/v1/admin/analytics', { params }).subscribe({
      next: (res) => {
        if (res.kpis) this.kpis.set(res.kpis);
        if (res.timeOfDay) this.timeOfDay.set(res.timeOfDay);
        if (res.trend) this.trend.set(res.trend);
        if (res.topPayingUsers) this.topPayingUsers.set(res.topPayingUsers);
        if (res.recentTransactions) this.recentTransactions.set(res.recentTransactions);
        if (res.selectedUser) this.selectedUserObj.set(res.selectedUser);
        else this.selectedUserObj.set(null);

        this.lastRefreshedAt.set(new Date());
        if (!isSilent) this.loading.set(false);
      },
      error: (err) => {
        console.error('Analytics load error:', err);
        if (!isSilent) this.loading.set(false);
        this.toast.error('Failed to load financial analytics.');
      }
    });
  }

  startAutoRefresh() {
    this.stopAutoRefresh();
    if (this.autoRefresh()) {
      this.autoRefreshTimer = setInterval(() => {
        this.loadData(true);
      }, 15000);
    }
  }

  stopAutoRefresh() {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
    }
  }

  toggleAutoRefresh() {
    const next = !this.autoRefresh();
    this.autoRefresh.set(next);
    if (next) {
      this.startAutoRefresh();
      this.toast.info('Live real-time monitoring enabled (15s updates)');
    } else {
      this.stopAutoRefresh();
      this.toast.info('Live updates paused.');
    }
  }

  // Filter actions
  setPeriod(p: 'today' | 'weekly' | 'monthly' | 'yearly') {
    this.period.set(p);
    this.loadData();
  }

  applyCustomRange() {
    this.period.set('custom');
    this.loadData();
  }

  filterByUser(u: TopPayingUser) {
    if (this.selectedUserId() === u.id) {
      this.clearUserFilter();
    } else {
      this.selectedUserId.set(u.id);
      this.toast.info(`Drilling down to ${u.fullName || u.email}'s payments`);
      this.loadData();
    }
  }

  clearUserFilter() {
    this.selectedUserId.set(null);
    this.selectedUserObj.set(null);
    this.loadData();
  }

  // SVG Chart Mouse Interaction
  onChartMouseMove(event: MouseEvent) {
    if (!this.chartSvgRef?.nativeElement) return;
    const svg = this.chartSvgRef.nativeElement;
    const rect = svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const svgX = (mouseX / rect.width) * this.chartWidth;

    const points = this.chartPoints();
    if (points.length === 0) return;

    let nearestIndex = 0;
    let minDiff = Infinity;
    points.forEach((p, idx) => {
      const diff = Math.abs(p.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = idx;
      }
    });

    this.hoveredIndex.set(nearestIndex);
    this.hoveredPoint.set(points[nearestIndex]);
  }

  onChartMouseLeave() {
    this.hoveredIndex.set(null);
    this.hoveredPoint.set(null);
  }

  copyRef(ref: string) {
    if (!ref) return;
    navigator.clipboard.writeText(ref).then(() => {
      this.toast.success('Payment reference copied!');
    });
  }

  exportCsv() {
    const tx = this.recentTransactions();
    if (tx.length === 0) {
      this.toast.error('No transactions to export.');
      return;
    }

    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Template', 'Amount (USD)', 'Status', 'Payment Method', 'Reference', 'Purchased At'];
    const rows = tx.map((t) => [
      t.id,
      `"${(t.full_name || '').replace(/"/g, '""')}"`,
      `"${(t.email || '').replace(/"/g, '""')}"`,
      `"${(t.template_name || '').replace(/"/g, '""')}"`,
      (t.amount_cents / 100).toFixed(2),
      t.status,
      t.payment_provider || 'Bakong KHQR',
      `"${t.payment_ref || ''}"`,
      `"${t.purchased_at || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `financial-analytics-${this.period()}-${new Date().toISOString().slice(0, 10)}.csv`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    this.toast.success(`Exported ${tx.length} transactions as CSV`);
  }

  formatRelativeTime(dateStr?: string): string {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr.replace(' ', 'T') + 'Z');
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0 || isNaN(diffMs)) return dateStr;

    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'Just now';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
}
