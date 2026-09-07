import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  FileSpreadsheet,
  Presentation,
  FileDown,
  Printer,
  Download,
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Layers,
  Filter,
  Check,
  FileText,
  Percent,
  ChevronDown,
  RotateCcw,
  CheckCheck,
  CircleAlert
} from 'lucide-angular';
import { ToastService } from '../../../shared/components/toast/toast.service';

export interface ReportKPIs {
  totalPaidCents: number;
  totalPaidDollars: number;
  paidCount: number;
  totalUnpaidCents: number;
  totalUnpaidDollars: number;
  unpaidCount: number;
  totalMoneyCents: number;
  totalMoneyDollars: number;
  totalCount: number;
  paidPercentage: number;
  unpaidPercentage: number;
  avgPaidDollars: number;
}

export interface ReportOrder {
  id: number;
  user_id: number;
  amount_cents: number;
  currency: string;
  status: string; // 'paid' | 'pending' | 'failed'
  payment_provider?: string;
  payment_ref?: string;
  purchased_at: string;
  full_name?: string;
  email?: string;
  template_name?: string;
  cv_title?: string;
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css'],
})
export class AdminReportsComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  // Lucide Icons
  readonly FileSpreadsheet = FileSpreadsheet;
  readonly Presentation = Presentation;
  readonly FileDown = FileDown;
  readonly Printer = Printer;
  readonly Download = Download;
  readonly Search = Search;
  readonly DollarSign = DollarSign;
  readonly CheckCircle2 = CheckCircle2;
  readonly Clock = Clock;
  readonly XCircle = XCircle;
  readonly Calendar = Calendar;
  readonly ArrowUpDown = ArrowUpDown;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly RefreshCw = RefreshCw;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly Sparkles = Sparkles;
  readonly Layers = Layers;
  readonly Filter = Filter;
  readonly Check = Check;
  readonly FileText = FileText;
  readonly Percent = Percent;
  readonly ChevronDown = ChevronDown;
  readonly RotateCcw = RotateCcw;
  readonly CheckCheck = CheckCheck;
  readonly CircleAlert = CircleAlert;

  // State Signals
  kpis = signal<ReportKPIs>({
    totalPaidCents: 0,
    totalPaidDollars: 0,
    paidCount: 0,
    totalUnpaidCents: 0,
    totalUnpaidDollars: 0,
    unpaidCount: 0,
    totalMoneyCents: 0,
    totalMoneyDollars: 0,
    totalCount: 0,
    paidPercentage: 0,
    unpaidPercentage: 0,
    avgPaidDollars: 0,
  });

  orders = signal<ReportOrder[]>([]);
  isLoading = signal(false);
  isExportingPdf = signal(false);
  isExportingPptx = signal(false);
  isExportingExcel = signal(false);

  // Filters
  searchQuery = signal('');
  statusFilter = signal<'all' | 'paid' | 'unpaid'>('all');
  periodFilter = signal<'all' | 'week' | 'month' | 'year' | 'custom'>('all');
  fromDate = signal('');
  toDate = signal('');
  selectedMonth = signal('');
  selectedYear = signal('');

  // Pagination & Sorting
  currentPage = signal(1);
  pageSize = signal(10);
  sortField = signal<'purchased_at' | 'amount_cents' | 'id'>('purchased_at');
  sortAsc = signal(false);

  // Filtered & Sorted orders for local paging
  sortedOrders = computed(() => {
    const list = [...this.orders()];
    const field = this.sortField();
    const asc = this.sortAsc();

    return list.sort((a, b) => {
      let valA: any = a[field];
      let valB: any = b[field];

      if (field === 'purchased_at') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      }

      if (valA < valB) return asc ? -1 : 1;
      if (valA > valB) return asc ? 1 : -1;
      return 0;
    });
  });

  totalPages = computed(() => {
    const total = this.sortedOrders().length;
    const size = this.pageSize();
    return Math.max(1, Math.ceil(total / size));
  });

  paginatedOrders = computed(() => {
    const list = this.sortedOrders();
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return list.slice(start, start + size);
  });

  reportGeneratedAt = computed(() => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.isLoading.set(true);

    const params: Record<string, string> = {
      search: this.searchQuery().trim(),
      status: this.statusFilter(),
      period: this.periodFilter(),
    };

    if (this.fromDate()) params['from'] = this.fromDate();
    if (this.toDate()) params['to'] = this.toDate();
    if (this.selectedMonth()) params['month'] = this.selectedMonth();
    if (this.selectedYear()) params['year'] = this.selectedYear();

    this.http.get<{ kpis: ReportKPIs; orders: ReportOrder[] }>('/api/v1/admin/reports', { params })
      .subscribe({
        next: (res) => {
          this.kpis.set(res.kpis || {
            totalPaidCents: 0,
            totalPaidDollars: 0,
            paidCount: 0,
            totalUnpaidCents: 0,
            totalUnpaidDollars: 0,
            unpaidCount: 0,
            totalMoneyCents: 0,
            totalMoneyDollars: 0,
            totalCount: 0,
            paidPercentage: 0,
            unpaidPercentage: 0,
            avgPaidDollars: 0,
          });
          this.orders.set(res.orders || []);
          this.currentPage.set(1);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load reports', err);
          this.toast.error('Failed to load financial reports');
          this.isLoading.set(false);
        },
      });
  }

  setStatusFilter(status: 'all' | 'paid' | 'unpaid') {
    this.statusFilter.set(status);
    this.loadReports();
  }

  setPeriodFilter(period: 'all' | 'week' | 'month' | 'year' | 'custom') {
    this.periodFilter.set(period);
    if (period !== 'custom') {
      this.fromDate.set('');
      this.toDate.set('');
      this.selectedMonth.set('');
      this.selectedYear.set('');
    }
    this.loadReports();
  }

  onDateFilterChange() {
    this.periodFilter.set('custom');
    this.loadReports();
  }

  resetFilters() {
    this.searchQuery.set('');
    this.statusFilter.set('all');
    this.periodFilter.set('all');
    this.fromDate.set('');
    this.toDate.set('');
    this.selectedMonth.set('');
    this.selectedYear.set('');
    this.currentPage.set(1);
    this.loadReports();
  }

  toggleSort(field: 'purchased_at' | 'amount_cents' | 'id') {
    if (this.sortField() === field) {
      this.sortAsc.set(!this.sortAsc());
    } else {
      this.sortField.set(field);
      this.sortAsc.set(false);
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // ================= EXPORT FUNCTIONS =================

  /**
   * Export as PDF:
   * Uses high-quality styled print sheet triggered via browser print
   */
  exportPdf() {
    this.isExportingPdf.set(true);
    setTimeout(() => {
      try {
        window.print();
        this.toast.success('Print / PDF export triggered successfully');
      } catch (e) {
        console.error('Print failed', e);
        this.toast.error('Could not initiate PDF printing');
      } finally {
        this.isExportingPdf.set(false);
      }
    }, 100);
  }

  /**
   * Export as PPTX (PowerPoint):
   * Generates a sleek, executive deck containing:
   * 1. Cover / Executive Header
   * 2. Financial Metrics Summary & KPIs
   * 3. Full Transaction Ledger Table
   */
  async exportPptx() {
    this.isExportingPptx.set(true);
    try {
      const pptxModule = await import('pptxgenjs');
      const PptxGenJS = (pptxModule as any).default || pptxModule;
      const pres = new PptxGenJS();

      pres.layout = 'LAYOUT_16x9';
      pres.title = 'CV Creator - Financial & Sales Report';
      pres.author = 'CV Creator Admin';
      pres.subject = 'Financial and Transactional Report';

      const currentKpis = this.kpis();
      const currentOrders = this.orders();
      const timeStampStr = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      // --- SLIDE 1: Cover Slide ---
      const slide1 = pres.addSlide();
      slide1.background = { color: '0F172A' }; // Deep dark navy slate

      slide1.addShape(pres.ShapeType.rect, {
        x: 0.8, y: 1.2, w: 0.4, h: 4.8,
        fill: { color: '6366F1' },
        line: { color: '6366F1' }
      });

      slide1.addText('CV CREATOR FINANCIAL INTELLIGENCE', {
        x: 1.5, y: 1.5, w: 10, h: 0.4,
        fontSize: 12, bold: true, color: '818CF8', fontFace: 'Arial'
      });

      slide1.addText('Financial Performance & Transaction Report', {
        x: 1.5, y: 2.0, w: 10.5, h: 1.2,
        fontSize: 32, bold: true, color: 'FFFFFF', fontFace: 'Arial'
      });

      slide1.addText(`Status: ${this.statusFilter().toUpperCase()}  |  Period: ${this.periodFilter().toUpperCase()}  |  Total Orders: ${currentKpis.totalCount}`, {
        x: 1.5, y: 3.4, w: 10, h: 0.5,
        fontSize: 14, color: '94A3B8', fontFace: 'Arial'
      });

      slide1.addText(`Generated on: ${timeStampStr} by Admin Operations`, {
        x: 1.5, y: 4.2, w: 10, h: 0.4,
        fontSize: 12, color: '64748B', fontFace: 'Arial'
      });

      // --- SLIDE 2: KPI Executive Dashboard ---
      const slide2 = pres.addSlide();
      slide2.background = { color: 'F8FAFC' };

      slide2.addText('Executive Financial Summary', {
        x: 0.8, y: 0.5, w: 10, h: 0.5,
        fontSize: 22, bold: true, color: '0F172A', fontFace: 'Arial'
      });
      slide2.addText('Overview of collected revenue, outstanding/unpaid transactions, and gross financial volume', {
        x: 0.8, y: 1.0, w: 11, h: 0.3,
        fontSize: 11, color: '64748B', fontFace: 'Arial'
      });

      // KPI Card 1: Total Paid
      slide2.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: 1.5, w: 3.5, h: 2.0,
        fill: { color: 'FFFFFF' },
        line: { color: 'E2E8F0', width: 1.5 },
        rectRadius: 0.1
      });
      slide2.addText('TOTAL PAID REVENUE', {
        x: 1.0, y: 1.7, w: 3.1, h: 0.3,
        fontSize: 10, bold: true, color: '059669', fontFace: 'Arial'
      });
      slide2.addText(`\$${currentKpis.totalPaidDollars.toFixed(2)}`, {
        x: 1.0, y: 2.0, w: 3.1, h: 0.7,
        fontSize: 28, bold: true, color: '0F172A', fontFace: 'Arial'
      });
      slide2.addText(`${currentKpis.paidCount} Paid Orders (${currentKpis.paidPercentage}% of volume)`, {
        x: 1.0, y: 2.8, w: 3.1, h: 0.4,
        fontSize: 10, color: '64748B', fontFace: 'Arial'
      });

      // KPI Card 2: Total Unpaid
      slide2.addShape(pres.ShapeType.roundRect, {
        x: 4.6, y: 1.5, w: 3.5, h: 2.0,
        fill: { color: 'FFFFFF' },
        line: { color: 'E2E8F0', width: 1.5 },
        rectRadius: 0.1
      });
      slide2.addText('TOTAL UNPAID / POTENTIAL', {
        x: 4.8, y: 1.7, w: 3.1, h: 0.3,
        fontSize: 10, bold: true, color: 'D97706', fontFace: 'Arial'
      });
      slide2.addText(`\$${currentKpis.totalUnpaidDollars.toFixed(2)}`, {
        x: 4.8, y: 2.0, w: 3.1, h: 0.7,
        fontSize: 28, bold: true, color: '0F172A', fontFace: 'Arial'
      });
      slide2.addText(`${currentKpis.unpaidCount} Pending / Failed Orders (${currentKpis.unpaidPercentage}% of volume)`, {
        x: 4.8, y: 2.8, w: 3.1, h: 0.4,
        fontSize: 10, color: '64748B', fontFace: 'Arial'
      });

      // KPI Card 3: Total Money (Gross Sales)
      slide2.addShape(pres.ShapeType.roundRect, {
        x: 8.4, y: 1.5, w: 3.5, h: 2.0,
        fill: { color: 'FFFFFF' },
        line: { color: 'E2E8F0', width: 1.5 },
        rectRadius: 0.1
      });
      slide2.addText('TOTAL GROSS MONEY', {
        x: 8.6, y: 1.7, w: 3.1, h: 0.3,
        fontSize: 10, bold: true, color: '6366F1', fontFace: 'Arial'
      });
      slide2.addText(`\$${currentKpis.totalMoneyDollars.toFixed(2)}`, {
        x: 8.6, y: 2.0, w: 3.1, h: 0.7,
        fontSize: 28, bold: true, color: '0F172A', fontFace: 'Arial'
      });
      slide2.addText(`${currentKpis.totalCount} Total Recorded Transactions`, {
        x: 8.6, y: 2.8, w: 3.1, h: 0.4,
        fontSize: 10, color: '64748B', fontFace: 'Arial'
      });

      // Slide 2 Bottom Breakdown Table
      const summaryTableData: any[][] = [
        [
          { text: 'Financial Metric', options: { bold: true, fill: { color: '4F46E5' }, color: 'FFFFFF' } },
          { text: 'Volume / Value', options: { bold: true, fill: { color: '4F46E5' }, color: 'FFFFFF' } },
          { text: 'Transactions', options: { bold: true, fill: { color: '4F46E5' }, color: 'FFFFFF' } },
          { text: 'Share of Total', options: { bold: true, fill: { color: '4F46E5' }, color: 'FFFFFF' } },
        ],
        ['Paid Revenue', `\$${currentKpis.totalPaidDollars.toFixed(2)}`, `${currentKpis.paidCount} orders`, `${currentKpis.paidPercentage}%`],
        ['Unpaid / Pending Potential', `\$${currentKpis.totalUnpaidDollars.toFixed(2)}`, `${currentKpis.unpaidCount} orders`, `${currentKpis.unpaidPercentage}%`],
        ['Overall Gross Value', `\$${currentKpis.totalMoneyDollars.toFixed(2)}`, `${currentKpis.totalCount} orders`, '100%'],
        ['Average Paid Order Size', `\$${currentKpis.avgPaidDollars.toFixed(2)}`, `${currentKpis.paidCount} paid orders`, '—'],
      ];

      slide2.addTable(summaryTableData, {
        x: 0.8, y: 3.8, w: 11.1,
        fontSize: 10,
        border: { pt: 1, color: 'E2E8F0' },
        fill: { color: 'FFFFFF' }
      });

      // --- SLIDE 3+: Detailed Transactions Table ---
      const chunkSize = 9;
      for (let i = 0; i < currentOrders.length; i += chunkSize) {
        const chunk = currentOrders.slice(i, i + chunkSize);
        const slide = pres.addSlide();
        slide.background = { color: 'F8FAFC' };

        slide.addText(`Transaction Ledger (Page ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(currentOrders.length / chunkSize)})`, {
          x: 0.8, y: 0.4, w: 10, h: 0.4,
          fontSize: 18, bold: true, color: '0F172A', fontFace: 'Arial'
        });

        const tableRows: any[][] = [
          [
            { text: 'Order ID', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
            { text: 'Customer', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
            { text: 'Template', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
            { text: 'Amount', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
            { text: 'Status', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
            { text: 'Provider / Ref', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
            { text: 'Date & Time', options: { bold: true, fill: { color: '1E293B' }, color: 'FFFFFF' } },
          ]
        ];

        for (const ord of chunk) {
          const statusBg = ord.status === 'paid' ? 'DCFCE7' : (ord.status === 'failed' ? 'FEE2E2' : 'FEF3C7');
          const statusText = ord.status === 'paid' ? 'PAID' : (ord.status === 'failed' ? 'FAILED' : 'PENDING');
          const statusColor = ord.status === 'paid' ? '15803D' : (ord.status === 'failed' ? 'B91C1C' : 'B45309');

          tableRows.push([
            `#${ord.id}`,
            `${ord.full_name || 'Anonymous'}\n(${ord.email || 'N/A'})`,
            ord.template_name || 'Standard CV',
            `\$${(ord.amount_cents / 100).toFixed(2)}`,
            { text: statusText, options: { bold: true, fill: { color: statusBg }, color: statusColor } },
            `${ord.payment_provider || 'manual'}\n${ord.payment_ref || '—'}`,
            ord.purchased_at ? ord.purchased_at.replace('T', ' ').slice(0, 19) : '—',
          ]);
        }

        slide.addTable(tableRows, {
          x: 0.8, y: 1.0, w: 11.2,
          fontSize: 9,
          border: { pt: 0.5, color: 'CBD5E1' },
          colW: [1.0, 2.5, 2.0, 1.1, 1.2, 1.8, 1.6]
        });
      }

      const fileName = `CV_Creator_Financial_Report_${new Date().toISOString().slice(0, 10)}.pptx`;
      await pres.writeFile({ fileName });
      this.toast.success(`PowerPoint report downloaded (${fileName})`);
    } catch (err) {
      console.error('PPTX export error:', err);
      this.toast.error('Failed to generate PowerPoint presentation');
    } finally {
      this.isExportingPptx.set(false);
    }
  }

  /**
   * Export as Excel Spreadsheet (.xls XML format):
   * Full fidelity XML spreadsheet containing executive summary & full data ledger.
   * Compatible with Microsoft Excel, Apple Numbers, LibreOffice Calc, and Google Sheets.
   */
  exportExcel() {
    this.isExportingExcel.set(true);
    try {
      const kpis = this.kpis();
      const orders = this.orders();
      const generatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Build XML Spreadsheet 2003 (.xls)
      let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#1E293B"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SubTitleStyle">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Italic="1" ss:Color="#64748B"/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#312E81"/>
   </Borders>
  </Style>
  <Style ss:ID="KpiLabelStyle">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#1E293B"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="CurrencyStyle">
   <NumberFormat ss:Format="&quot;$&quot;#,##0.00"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="PaidBadge">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#15803D"/>
   <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="UnpaidBadge">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#B45309"/>
   <Interior ss:Color="#FEF3C7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="FailedBadge">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#B91C1C"/>
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="TotalRowStyle">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#E2E8F0" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="&quot;$&quot;#,##0.00"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
 </Styles>

 <Worksheet ss:Name="Financial Report">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="70"/>
   <Column ss:Width="160"/>
   <Column ss:Width="180"/>
   <Column ss:Width="160"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="100"/>
   <Column ss:Width="150"/>
   <Column ss:Width="140"/>

   <!-- Title Row -->
   <Row ss:Height="30">
    <Cell ss:MergeAcross="8" ss:StyleID="TitleStyle"><Data ss:Type="String">CV Creator - Financial &amp; Orders Performance Report</Data></Cell>
   </Row>
   <Row ss:Height="20">
    <Cell ss:MergeAcross="8" ss:StyleID="SubTitleStyle"><Data ss:Type="String">Generated: ${generatedAt} | Status: ${this.statusFilter().toUpperCase()} | Period: ${this.periodFilter().toUpperCase()}</Data></Cell>
   </Row>
   <Row ss:Height="10"/>

   <!-- KPI Summary Block -->
   <Row>
    <Cell ss:StyleID="KpiLabelStyle"><Data ss:Type="String">Metric</Data></Cell>
    <Cell ss:StyleID="KpiLabelStyle"><Data ss:Type="String">Total Paid</Data></Cell>
    <Cell ss:StyleID="KpiLabelStyle"><Data ss:Type="String">Total Unpaid</Data></Cell>
    <Cell ss:StyleID="KpiLabelStyle"><Data ss:Type="String">Total Gross Money</Data></Cell>
    <Cell ss:StyleID="KpiLabelStyle"><Data ss:Type="String">Paid Orders</Data></Cell>
    <Cell ss:StyleID="KpiLabelStyle"><Data ss:Type="String">Unpaid Orders</Data></Cell>
    <Cell ss:StyleID="KpiLabelStyle"><Data ss:Type="String">Total Orders</Data></Cell>
    <Cell ss:StyleID="KpiLabelStyle"><Data ss:Type="String">Paid Rate (%)</Data></Cell>
    <Cell ss:StyleID="KpiLabelStyle"><Data ss:Type="String">Avg Paid Order</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Values</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${kpis.totalPaidDollars}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${kpis.totalUnpaidDollars}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${kpis.totalMoneyDollars}</Data></Cell>
    <Cell><Data ss:Type="Number">${kpis.paidCount}</Data></Cell>
    <Cell><Data ss:Type="Number">${kpis.unpaidCount}</Data></Cell>
    <Cell><Data ss:Type="Number">${kpis.totalCount}</Data></Cell>
    <Cell><Data ss:Type="String">${kpis.paidPercentage}%</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${kpis.avgPaidDollars}</Data></Cell>
   </Row>
   <Row ss:Height="15"/>

   <!-- Table Headers -->
   <Row ss:Height="24">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Order ID</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Customer Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Email</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">CV Template</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Amount ($)</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Status</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Provider</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Reference</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Purchased Date</Data></Cell>
   </Row>`;

      // Table Data Rows
      for (const ord of orders) {
        const amount = ord.amount_cents / 100;
        const statusStyle = ord.status === 'paid' ? 'PaidBadge' : (ord.status === 'failed' ? 'FailedBadge' : 'UnpaidBadge');
        const statusText = ord.status.toUpperCase();
        const dateStr = ord.purchased_at ? ord.purchased_at.replace('T', ' ').slice(0, 19) : '';

        xml += `
   <Row>
    <Cell><Data ss:Type="String">#${ord.id}</Data></Cell>
    <Cell><Data ss:Type="String">${this.escapeXml(ord.full_name || 'Anonymous')}</Data></Cell>
    <Cell><Data ss:Type="String">${this.escapeXml(ord.email || '')}</Data></Cell>
    <Cell><Data ss:Type="String">${this.escapeXml(ord.template_name || 'Standard')}</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${amount.toFixed(2)}</Data></Cell>
    <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${statusText}</Data></Cell>
    <Cell><Data ss:Type="String">${this.escapeXml(ord.payment_provider || 'manual')}</Data></Cell>
    <Cell><Data ss:Type="String">${this.escapeXml(ord.payment_ref || '—')}</Data></Cell>
    <Cell><Data ss:Type="String">${dateStr}</Data></Cell>
   </Row>`;
      }

      // Total Summary Row
      xml += `
   <Row ss:Height="22">
    <Cell ss:MergeAcross="3" ss:StyleID="KpiLabelStyle"><Data ss:Type="String">TOTAL AMOUNT (${orders.length} Orders)</Data></Cell>
    <Cell ss:StyleID="TotalRowStyle"><Data ss:Type="Number">${kpis.totalMoneyDollars.toFixed(2)}</Data></Cell>
    <Cell ss:MergeAcross="3"/>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

      const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `CV_Creator_Financial_Report_${new Date().toISOString().slice(0, 10)}.xls`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      this.toast.success(`Excel spreadsheet downloaded (${filename})`);
    } catch (err) {
      console.error('Excel export error:', err);
      this.toast.error('Failed to export Excel spreadsheet');
    } finally {
      this.isExportingExcel.set(false);
    }
  }

  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
