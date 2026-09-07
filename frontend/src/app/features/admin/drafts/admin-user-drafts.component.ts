import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  FileText,
  Search,
  Users,
  Download,
  CheckCircle2,
  Clock,
  Eye,
  Sparkles,
  Trash2,
  X,
  Layers,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  ExternalLink,
  ChevronRight,
  Filter,
  Grid,
  List,
  CreditCard,
  Archive,
  RefreshCw,
} from 'lucide-angular';
import { ToastService } from '../../../shared/components/toast/toast.service';

export interface CvDraftItem {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_avatar: string | null;
  user_role: string;
  template_id: number;
  template_name: string;
  template_category: string;
  thumbnail_url: string | null;
  price_cents: number;
  title: string;
  selected_color: string;
  content: any;
  pdf_url: string | null;
  is_finalized: boolean;
  is_paid: boolean;
  order_id?: number | null;
  order_status?: string | null;
  payment_provider?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatorItem {
  id: number;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  total_drafts: number;
  paid_drafts: number;
  unpaid_drafts: number;
}

export interface DraftStats {
  totalDrafts: number;
  totalPaid: number;
  totalUnpaid: number;
  totalUsersWithDrafts: number;
  totalFinalized: number;
}

@Component({
  selector: 'app-admin-user-drafts',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './admin-user-drafts.component.html',
  styleUrls: ['./admin-user-drafts.component.css'],
})
export class AdminUserDraftsComponent implements OnInit {
  // Lucide Icons
  readonly FileText = FileText;
  readonly Search = Search;
  readonly Users = Users;
  readonly Download = Download;
  readonly CheckCircle2 = CheckCircle2;
  readonly Clock = Clock;
  readonly Eye = Eye;
  readonly Sparkles = Sparkles;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly Layers = Layers;
  readonly AlertCircle = AlertCircle;
  readonly ArrowRight = ArrowRight;
  readonly ArrowUpRight = ArrowUpRight;
  readonly Check = Check;
  readonly ExternalLink = ExternalLink;
  readonly ChevronRight = ChevronRight;
  readonly Filter = Filter;
  readonly Grid = Grid;
  readonly List = List;
  readonly CreditCard = CreditCard;
  readonly Archive = Archive;
  readonly RefreshCw = RefreshCw;

  // State Signals
  drafts = signal<CvDraftItem[]>([]);
  creators = signal<CreatorItem[]>([]);
  selectedUser = signal<CreatorItem | null>(null);
  selectedPreviewCv = signal<CvDraftItem | null>(null);
  stats = signal<DraftStats>({
    totalDrafts: 0,
    totalPaid: 0,
    totalUnpaid: 0,
    totalUsersWithDrafts: 0,
    totalFinalized: 0,
  });

  // Filter & View State
  viewMode = signal<'all' | 'user'>('all');
  displayMode = signal<'grid' | 'table'>('grid');
  searchQuery = '';
  creatorSearch = '';
  paymentFilter = signal<'all' | 'paid' | 'unpaid'>('all');
  statusFilter = signal<'all' | 'draft' | 'finalized'>('all');
  selectedTemplate = signal<string>('all');

  // Loading & Action states
  loading = signal<boolean>(false);
  isZipping = signal<boolean>(false);
  zipProgress = signal<string>('');

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadDrafts();
  }

  loadDrafts() {
    this.loading.set(true);
    const params: any = {
      page: 1,
      pageSize: 100,
      search: this.searchQuery.trim(),
      paymentStatus: this.paymentFilter(),
      draftStatus: this.statusFilter(),
    };

    if (this.viewMode() === 'user' && this.selectedUser()) {
      params.userId = this.selectedUser()!.id;
    }

    this.http.get<{
      drafts: CvDraftItem[];
      stats: DraftStats;
      creators: CreatorItem[];
    }>('/api/v1/admin/drafts', { params }).subscribe({
      next: (res) => {
        this.drafts.set(res.drafts || []);
        if (res.stats) this.stats.set(res.stats);
        if (res.creators) this.creators.set(res.creators);
        this.loading.set(false);

        // Auto-select requested user from query param if available
        const queryUser = this.route.snapshot.queryParamMap.get('user');
        if (queryUser && !this.selectedUser() && res.creators) {
          const found = res.creators.find(c => String(c.id) === queryUser);
          if (found) {
            this.selectCreator(found);
          }
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.toast.error('Failed to load CV drafts: ' + (err?.error?.message || 'Server error'));
      },
    });
  }

  // Filtered Creators for the left sidebar in "By Creator" mode
  filteredCreators = computed(() => {
    const q = this.creatorSearch.trim().toLowerCase();
    const list = this.creators();
    if (!q) return list;
    return list.filter(
      c => c.full_name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
    );
  });

  // Unique templates for dropdown filter
  availableTemplates = computed(() => {
    const set = new Set<string>();
    this.drafts().forEach(d => {
      if (d.template_name) set.add(d.template_name);
    });
    return Array.from(set).sort();
  });

  // Client-filtered drafts (accounting for local template filter)
  filteredDrafts = computed(() => {
    let list = this.drafts();
    const t = this.selectedTemplate();
    if (t !== 'all') {
      list = list.filter(d => d.template_name === t);
    }
    return list;
  });

  onSearchChange() {
    this.loadDrafts();
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadDrafts();
  }

  setPaymentFilter(val: 'all' | 'paid' | 'unpaid') {
    this.paymentFilter.set(val);
    this.loadDrafts();
  }

  setStatusFilter(val: 'all' | 'draft' | 'finalized') {
    this.statusFilter.set(val);
    this.loadDrafts();
  }

  setViewMode(mode: 'all' | 'user') {
    this.viewMode.set(mode);
    if (mode === 'user' && !this.selectedUser() && this.creators().length > 0) {
      this.selectCreator(this.creators()[0]);
    } else {
      this.loadDrafts();
    }
  }

  selectCreator(creator: CreatorItem) {
    this.selectedUser.set(creator);
    this.viewMode.set('user');
    this.loadDrafts();
  }

  // Open full preview matching /my-cv/:id page
  previewCv(cv: CvDraftItem) {
    window.open(`/my-cv/${cv.id}`, '_blank');
  }

  closePreview() {
    this.selectedPreviewCv.set(null);
  }

  // Toggle Paid status via Admin API
  togglePaid(cv: CvDraftItem, event?: Event) {
    if (event) event.stopPropagation();
    const targetStatus = !cv.is_paid;
    this.http.patch(`/api/v1/admin/drafts/${cv.id}/toggle-paid`, { isPaid: targetStatus }).subscribe({
      next: () => {
        cv.is_paid = targetStatus;
        this.stats.update(s => ({
          ...s,
          totalPaid: targetStatus ? s.totalPaid + 1 : Math.max(0, s.totalPaid - 1),
          totalUnpaid: targetStatus ? Math.max(0, s.totalUnpaid - 1) : s.totalUnpaid + 1,
        }));
        this.toast.success(`CV #${cv.id} marked as ${targetStatus ? 'Paid' : 'Unpaid'}`);
      },
      error: () => this.toast.error('Failed to update payment status.'),
    });
  }

  // Delete draft
  deleteDraft(cv: CvDraftItem, event?: Event) {
    if (event) event.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${cv.title}" created by ${cv.user_name}?`)) return;

    this.http.delete(`/api/v1/admin/drafts/${cv.id}`).subscribe({
      next: () => {
        this.drafts.update(list => list.filter(d => d.id !== cv.id));
        this.stats.update(s => ({
          ...s,
          totalDrafts: Math.max(0, s.totalDrafts - 1),
          totalPaid: cv.is_paid ? Math.max(0, s.totalPaid - 1) : s.totalPaid,
          totalUnpaid: !cv.is_paid ? Math.max(0, s.totalUnpaid - 1) : s.totalUnpaid,
        }));
        if (this.selectedPreviewCv()?.id === cv.id) {
          this.closePreview();
        }
        this.toast.success('CV draft deleted successfully.');
      },
      error: () => this.toast.error('Failed to delete draft.'),
    });
  }

  // Single CV Download as PDF (Print-to-PDF)
  downloadPdf(cv: CvDraftItem, event?: Event) {
    if (event) event.stopPropagation();
    const html = this.generateStandaloneCvHtml(cv, true);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      this.toast.success('Print dialog opened. Select "Save as PDF" to download.');
    } else {
      this.toast.error('Pop-up was blocked. Please allow pop-ups for this site.');
    }
  }

  // Single CV Download as Word (.doc)
  downloadDoc(cv: CvDraftItem, event?: Event) {
    if (event) event.stopPropagation();
    const docHtml = this.generateDocContent(cv);
    const blob = new Blob(['\ufeff' + docHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `${this.sanitizeFileName(cv.content?.fullName || cv.title || 'CV')}.doc`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.toast.success(`Downloaded: ${fileName}`);
  }

  // Single CV Download as JSON
  downloadJson(cv: CvDraftItem, event?: Event) {
    if (event) event.stopPropagation();
    const jsonStr = JSON.stringify(cv.content || {}, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `${this.sanitizeFileName(cv.content?.fullName || cv.title || 'CV')}_data.json`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.toast.success(`Downloaded JSON data: ${fileName}`);
  }

  // Batch Download All CVs as ZIP (for selected user or all filtered CVs)
  async downloadAllZip(userTarget?: CreatorItem | null) {
    const targetUser = userTarget || (this.viewMode() === 'user' ? this.selectedUser() : null);
    const userName = targetUser ? targetUser.full_name : 'All_Creators';
    const fileName = `${this.sanitizeFileName(userName)}_CV_Drafts_${new Date().toISOString().slice(0, 10)}.zip`;

    this.isZipping.set(true);
    this.zipProgress.set('Preparing CV documents...');

    try {
      let cvsToExport: CvDraftItem[] = [];
      if (targetUser) {
        this.zipProgress.set(`Fetching all CVs for ${targetUser.full_name}...`);
        const res = await this.http.get<{ drafts: CvDraftItem[] }>('/api/v1/admin/drafts', {
          params: { userId: targetUser.id, all: 'true' }
        }).toPromise();
        cvsToExport = res?.drafts || [];
      } else {
        cvsToExport = this.filteredDrafts();
      }

      if (!cvsToExport.length) {
        this.toast.info('No CV drafts found to export.');
        this.isZipping.set(false);
        return;
      }

      this.zipProgress.set(`Packaging ${cvsToExport.length} CVs...`);
      const JSZipModule = await import('jszip');
      const JSZip = (JSZipModule as any).default || JSZipModule;
      const zip = new JSZip();

      const htmlFolder = zip.folder('HTML_Printable_PDF');
      const docFolder = zip.folder('Word_Documents');
      const jsonFolder = zip.folder('Raw_Data_JSON');

      let manifestText = `=======================================================\n`;
      manifestText += `CV CREATOR — ADMIN CV BATCH EXPORT\n`;
      manifestText += `Export Date: ${new Date().toLocaleString()}\n`;
      manifestText += `Scope: ${targetUser ? `${targetUser.full_name} (${targetUser.email})` : 'All Filtered CVs'}\n`;
      manifestText += `Total CVs: ${cvsToExport.length}\n`;
      manifestText += `Paid CVs: ${cvsToExport.filter(c => c.is_paid).length}\n`;
      manifestText += `Not Yet Paid CVs: ${cvsToExport.filter(c => !c.is_paid).length}\n`;
      manifestText += `=======================================================\n\n`;

      for (let i = 0; i < cvsToExport.length; i++) {
        const cv = cvsToExport[i];
        const safeTitle = this.sanitizeFileName(cv.title || cv.content?.fullName || 'CV');
        const baseName = `${String(i + 1).padStart(2, '0')}_${safeTitle}_#${cv.id}`;

        // 1. HTML Printable (which can be printed to PDF directly)
        const htmlContent = this.generateStandaloneCvHtml(cv, false);
        htmlFolder?.file(`${baseName}.html`, htmlContent);

        // 2. Word .doc
        const docContent = this.generateDocContent(cv);
        docFolder?.file(`${baseName}.doc`, docContent);

        // 3. JSON Data
        jsonFolder?.file(`${baseName}.json`, JSON.stringify(cv.content || {}, null, 2));

        manifestText += `[#${i + 1}] Title: ${cv.title || 'Untitled'}\n`;
        manifestText += `     Creator: ${cv.user_name} (${cv.user_email})\n`;
        manifestText += `     Template: ${cv.template_name} (${cv.template_category})\n`;
        manifestText += `     Payment Status: ${cv.is_paid ? 'PAID' : 'NOT YET PAID'}\n`;
        manifestText += `     Draft Status: ${cv.is_finalized ? 'Finalized' : 'Draft'}\n`;
        manifestText += `     Last Updated: ${cv.updated_at}\n\n`;
      }

      zip.file('SUMMARY_MANIFEST.txt', manifestText);

      this.zipProgress.set('Compressing files into ZIP archive...');
      const blob = await zip.generateAsync({ type: 'blob' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.toast.success(`Successfully exported ${cvsToExport.length} CVs in ${fileName}!`);
    } catch (err: any) {
      console.error('ZIP export error:', err);
      this.toast.error('Failed to generate ZIP export: ' + (err?.message || 'Unknown error'));
    } finally {
      this.isZipping.set(false);
      this.zipProgress.set('');
    }
  }

  // Helpers
  asArray(val: any): any[] {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return Object.values(val);
  }

  sanitizeFileName(str: string): string {
    return (str || 'CV').replace(/[\\/:*?"<>| ]+/g, '_').trim();
  }

  // Generate self-contained standalone HTML document for high-fidelity viewing & printing
  generateStandaloneCvHtml(cv: CvDraftItem, autoPrint = false): string {
    const c = cv.content || {};
    const name = c.fullName || cv.title || 'Curriculum Vitae';
    const jobTitle = c.jobTitle || '';
    const email = c.email || cv.user_email || '';
    const phone = c.phone || '';
    const location = c.location || '';
    const linkedin = c.linkedin || '';
    const website = c.website || '';
    const summary = c.summary || '';
    const accent = cv.selected_color || '#2563eb';

    const experience = this.asArray(c.experience);
    const education = this.asArray(c.education);
    const skills = this.asArray(c.skills);
    const languages = this.asArray(c.languages);
    const certifications = this.asArray(c.certifications);
    const projects = this.asArray(c.projects);

    const expHtml = experience.map((e: any) => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${this.escape(e.title || e.role || '')}</span>
          <span class="item-date">${this.escape(e.period || e.startDate || '')}</span>
        </div>
        <div class="item-sub">${this.escape(e.company || '')} ${e.location ? '• ' + this.escape(e.location) : ''}</div>
        ${e.description ? `<div class="item-desc">${this.escape(e.description).replace(/\n/g, '<br/>')}</div>` : ''}
      </div>
    `).join('');

    const eduHtml = education.map((ed: any) => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${this.escape(ed.degree || '')}</span>
          <span class="item-date">${this.escape(ed.year || ed.period || '')}</span>
        </div>
        <div class="item-sub">${this.escape(ed.institution || ed.school || '')}</div>
        ${ed.description ? `<div class="item-desc">${this.escape(ed.description)}</div>` : ''}
      </div>
    `).join('');

    const skillsHtml = skills.map((s: any) => {
      const label = typeof s === 'string' ? s : (s.name || '');
      return label ? `<span class="skill-tag">${this.escape(label)}</span>` : '';
    }).join('');

    const projectsHtml = projects.map((p: any) => `
      <div class="item">
        <div class="item-header">
          <span class="item-title">${this.escape(p.title || p.name || '')}</span>
          ${p.link ? `<span class="item-date">${this.escape(p.link)}</span>` : ''}
        </div>
        ${p.description ? `<div class="item-desc">${this.escape(p.description)}</div>` : ''}
      </div>
    `).join('');

    const certHtml = certifications.map((cr: any) => {
      const label = typeof cr === 'string' ? cr : (cr.name || '');
      const issuer = cr.issuer ? ` (${cr.issuer})` : '';
      return label ? `<li class="bullet-item">${this.escape(label)}${this.escape(issuer)}</li>` : '';
    }).join('');

    const langHtml = languages.map((l: any) => {
      const label = typeof l === 'string' ? l : (l.language ? `${l.language} - ${l.proficiency || 'Fluent'}` : '');
      return label ? `<span class="lang-tag">${this.escape(label)}</span>` : '';
    }).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${this.escape(name)} — CV</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    :root {
      --accent: ${accent};
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --bg: #ffffff;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--text);
      background-color: #f1f5f9;
      line-height: 1.5;
      padding: 24px;
    }

    .toolbar {
      max-width: 800px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .toolbar button {
      background: var(--accent);
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .toolbar button:hover { opacity: 0.9; }

    .a4-page {
      max-width: 800px;
      min-height: 1120px;
      margin: 0 auto;
      background: white;
      padding: 44px 50px;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      position: relative;
    }

    .accent-bar {
      height: 6px;
      background: var(--accent);
      border-radius: 4px;
      margin-bottom: 24px;
    }

    .header {
      margin-bottom: 24px;
    }
    .name {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
    }
    .job-title {
      font-size: 16px;
      font-weight: 500;
      color: var(--accent);
      margin-top: 4px;
      margin-bottom: 12px;
    }
    .contact-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .section {
      margin-top: 24px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      border-bottom: 1.5px solid var(--border);
      padding-bottom: 4px;
      margin-bottom: 12px;
    }

    .summary-text {
      font-size: 13px;
      color: #334155;
      line-height: 1.6;
    }

    .item {
      margin-bottom: 14px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .item-title {
      font-size: 14px;
      font-weight: 600;
      color: #0f172a;
    }
    .item-date {
      font-size: 11.5px;
      font-weight: 500;
      color: var(--text-muted);
    }
    .item-sub {
      font-size: 12.5px;
      color: var(--accent);
      font-weight: 500;
      margin-top: 2px;
    }
    .item-desc {
      font-size: 12px;
      color: #475569;
      margin-top: 4px;
      line-height: 1.5;
    }

    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .skill-tag, .lang-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 500;
      background: #f1f5f9;
      color: #334155;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .bullet-list {
      list-style-type: square;
      padding-left: 18px;
      font-size: 12px;
      color: #334155;
    }
    .bullet-item {
      margin-bottom: 4px;
    }

    .footer-watermark {
      margin-top: 40px;
      padding-top: 12px;
      border-top: 1px dashed var(--border);
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: var(--text-muted);
    }

    @media print {
      body {
        background: white !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .toolbar, .no-print { display: none !important; }
      .a4-page {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
      @page {
        size: A4 portrait;
        margin: 14mm 16mm;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <div>
      <strong style="font-size: 14px; color: #0f172a;">${this.escape(name)}</strong>
      <span style="font-size: 12px; color: #64748b; margin-left: 8px;">• Template: ${this.escape(cv.template_name)} (${cv.is_paid ? 'Paid' : 'Unpaid'})</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()">🖨️ Print / Save as PDF</button>
      <button onclick="window.close()" style="background: #e2e8f0; color: #334155;">✕ Close</button>
    </div>
  </div>

  <div class="a4-page">
    <div class="accent-bar"></div>

    <div class="header">
      <h1 class="name">${this.escape(name)}</h1>
      ${jobTitle ? `<div class="job-title">${this.escape(jobTitle)}</div>` : ''}
      <div class="contact-bar">
        ${email ? `<span class="contact-item">✉ ${this.escape(email)}</span>` : ''}
        ${phone ? `<span class="contact-item">📞 ${this.escape(phone)}</span>` : ''}
        ${location ? `<span class="contact-item">📍 ${this.escape(location)}</span>` : ''}
        ${linkedin ? `<span class="contact-item">🔗 ${this.escape(linkedin)}</span>` : ''}
        ${website ? `<span class="contact-item">🌐 ${this.escape(website)}</span>` : ''}
      </div>
    </div>

    ${summary ? `
      <div class="section">
        <h2 class="section-title">Professional Summary</h2>
        <p class="summary-text">${this.escape(summary).replace(/\n/g, '<br/>')}</p>
      </div>
    ` : ''}

    ${expHtml ? `
      <div class="section">
        <h2 class="section-title">Work Experience</h2>
        ${expHtml}
      </div>
    ` : ''}

    ${eduHtml ? `
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${eduHtml}
      </div>
    ` : ''}

    ${skillsHtml ? `
      <div class="section">
        <h2 class="section-title">Skills & Competencies</h2>
        <div class="skills-grid">${skillsHtml}</div>
      </div>
    ` : ''}

    ${projectsHtml ? `
      <div class="section">
        <h2 class="section-title">Key Projects</h2>
        ${projectsHtml}
      </div>
    ` : ''}

    ${certHtml ? `
      <div class="section">
        <h2 class="section-title">Certifications</h2>
        <ul class="bullet-list">${certHtml}</ul>
      </div>
    ` : ''}

    ${langHtml ? `
      <div class="section">
        <h2 class="section-title">Languages</h2>
        <div class="skills-grid">${langHtml}</div>
      </div>
    ` : ''}

    <div class="footer-watermark">
      <span>CV Creator • Created by ${this.escape(cv.user_name)}</span>
      <span>Status: ${cv.is_paid ? 'Verified Paid' : 'Draft / Unpaid'}</span>
    </div>
  </div>

  ${autoPrint ? `
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
  ` : ''}
</body>
</html>`;
  }

  // Generate Word Document (.doc) content
  generateDocContent(cv: CvDraftItem): string {
    const c = cv.content || {};
    const name = c.fullName || cv.title || 'Curriculum Vitae';
    const jobTitle = c.jobTitle || '';
    const email = c.email || cv.user_email || '';
    const phone = c.phone || '';
    const location = c.location || '';
    const summary = c.summary || '';
    const accent = cv.selected_color || '#1e40af';

    const expHtml = this.asArray(c.experience).map((e: any) => `
      <div style="margin-bottom: 12pt;">
        <p style="margin: 0; font-size: 11pt; font-weight: bold; color: #0f172a;">${this.escape(e.title || e.role || '')} <span style="font-weight: normal; color: #64748b;">— ${this.escape(e.company || '')}</span></p>
        <p style="margin: 2pt 0 4pt 0; font-size: 9.5pt; color: #64748b; font-style: italic;">${this.escape(e.period || e.startDate || '')} ${e.location ? ' | ' + this.escape(e.location) : ''}</p>
        <p style="margin: 0; font-size: 10pt; color: #334155;">${this.escape(e.description || '').replace(/\n/g, '<br/>')}</p>
      </div>
    `).join('');

    const eduHtml = this.asArray(c.education).map((ed: any) => `
      <div style="margin-bottom: 10pt;">
        <p style="margin: 0; font-size: 11pt; font-weight: bold; color: #0f172a;">${this.escape(ed.degree || '')} <span style="font-weight: normal; color: #64748b;">— ${this.escape(ed.institution || ed.school || '')}</span></p>
        <p style="margin: 2pt 0 2pt 0; font-size: 9.5pt; color: #64748b;">${this.escape(ed.year || ed.period || '')}</p>
        ${ed.description ? `<p style="margin: 0; font-size: 10pt; color: #334155;">${this.escape(ed.description)}</p>` : ''}
      </div>
    `).join('');

    const skillsHtml = this.asArray(c.skills)
      .map((s: any) => typeof s === 'string' ? s : (s.name || ''))
      .filter(Boolean)
      .join(' • ');

    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${this.escape(name)}</title>
      <!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
      <style>
        @page { size: A4 portrait; margin: 20mm; }
        body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; line-height: 1.5; color: #1e293b; }
        h1 { font-size: 22pt; color: ${accent}; margin: 0 0 4pt 0; }
        h2 { font-size: 13pt; text-transform: uppercase; letter-spacing: 1px; color: ${accent}; border-bottom: 1.5pt solid ${accent}; padding-bottom: 4pt; margin-top: 16pt; margin-bottom: 8pt; }
        .meta { color: #64748b; font-size: 10pt; margin-bottom: 16pt; }
      </style>
    </head>
    <body>
      <h1>${this.escape(name)}</h1>
      <p style="font-size: 13pt; color: #475569; margin: 0 0 6pt 0;">${this.escape(jobTitle)}</p>
      <p class="meta">${[email, phone, location].filter(Boolean).map(x => this.escape(x)).join(' | ')}</p>
      ${summary ? `<h2>Professional Summary</h2><p style="font-size: 10.5pt; color: #334155;">${this.escape(summary)}</p>` : ''}
      ${expHtml ? `<h2>Experience</h2>${expHtml}` : ''}
      ${eduHtml ? `<h2>Education</h2>${eduHtml}` : ''}
      ${skillsHtml ? `<h2>Skills</h2><p style="font-size: 10pt; color: #334155;">${this.escape(skillsHtml)}</p>` : ''}
    </body>
    </html>`;
  }

  escape(str: string): string {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
