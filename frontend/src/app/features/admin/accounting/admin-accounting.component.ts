import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/components/toast/toast.service';
import {
  LucideAngularModule,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Edit3,
  UserPlus,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  X,
  KeyRound,
  Sparkles,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  Send,
  Users
} from 'lucide-angular';

export interface AccountantUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  isApproved: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  magicToken?: string;
  magicLink?: string;
}

export interface TransactionRecord {
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

export interface Kpis {
  totalRevenue: number;
  totalIncome: number;
  totalExpense: number;
  grossRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  refundedOrders: number;
  failedOrders: number;
  todayRevenue: number;
  todayIncome: number;
  todayExpense: number;
  todayOrders: number;
}

@Component({
  selector: 'app-admin-accounting',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule],
  templateUrl: './admin-accounting.component.html',
  styleUrls: ['./admin-accounting.component.css']
})
export class AdminAccountingComponent implements OnInit {
  // Lucide Icons
  readonly DollarSign = DollarSign;
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly Plus = Plus;
  readonly Minus = Minus;
  readonly Copy = Copy;
  readonly Check = Check;
  readonly ExternalLink = ExternalLink;
  readonly Trash2 = Trash2;
  readonly Edit3 = Edit3;
  readonly UserPlus = UserPlus;
  readonly FileSpreadsheet = FileSpreadsheet;
  readonly Download = Download;
  readonly Search = Search;
  readonly Filter = Filter;
  readonly RefreshCw = RefreshCw;
  readonly AlertCircle = AlertCircle;
  readonly X = X;
  readonly KeyRound = KeyRound;
  readonly Sparkles = Sparkles;
  readonly Clock = Clock;
  readonly ArrowUpRight = ArrowUpRight;
  readonly ArrowDownRight = ArrowDownRight;
  readonly ShieldCheck = ShieldCheck;
  readonly CheckCircle2 = CheckCircle2;
  readonly Wallet = Wallet;
  readonly Send = Send;
  readonly Users = Users;

  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private router = inject(Router);

  // State Signals
  loading = signal(true);
  kpis = signal<Kpis>({
    totalRevenue: 0,
    totalIncome: 0,
    totalExpense: 0,
    grossRevenue: 0,
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    refundedOrders: 0,
    failedOrders: 0,
    todayRevenue: 0,
    todayIncome: 0,
    todayExpense: 0,
    todayOrders: 0,
  });

  transactions = signal<TransactionRecord[]>([]);
  accountants = signal<AccountantUser[]>([]);

  // Filter & Search Signals
  searchQuery = signal('');
  selectedStatus = signal<string>('all'); // 'all' | 'paid' | 'pending' | 'refunded'
  selectedType = signal<string>('all'); // 'all' | 'income' | 'expense'

  // Modals visibility
  showAddAccountantModal = signal(false);
  showMagicLinkReadyModal = signal(false);
  showAddMoneyModal = signal(false);
  showDeductMoneyModal = signal(false);
  showEditTransactionModal = signal(false);
  showDeleteConfirmModal = signal(false);

  // Add Accountant Form
  newAccountantForm = {
    fullName: '',
    email: '',
    password: ''
  };
  isSubmittingAccountant = signal(false);

  // Newly Created Accountant Result for Magic Link Modal
  createdAccountantInfo = signal<{
    user: any;
    rawPassword?: string;
    magicLink: string;
    copied: boolean;
  } | null>(null);

  // Add/Deduct Money Form
  moneyForm = {
    amount: null as number | null,
    customerName: '',
    customerEmail: '',
    paymentProvider: 'ABA Pay',
    status: 'paid' as 'paid' | 'pending',
    notes: '',
    entryType: 'income' as 'income' | 'expense'
  };
  isSubmittingMoney = signal(false);

  // Edit Transaction Form
  editingTransaction = signal<TransactionRecord | null>(null);
  editForm = {
    amount: 0,
    customerName: '',
    customerEmail: '',
    paymentProvider: 'ABA Pay',
    status: 'paid' as 'paid' | 'pending' | 'refunded' | 'failed',
    notes: '',
    entryType: 'income' as 'income' | 'expense'
  };
  isSubmittingEdit = signal(false);

  // Delete Target
  deletingTransaction = signal<TransactionRecord | null>(null);
  isDeleting = signal(false);

  // Copied link animation tracking
  copiedLinkIds = signal<Set<number>>(new Set());

  // Filtered transactions computation
  filteredTransactions = computed(() => {
    const list = this.transactions();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();
    const type = this.selectedType();

    return list.filter((t) => {
      // Status filter
      if (status !== 'all' && t.status !== status) return false;

      // Type filter
      if (type === 'income' && (t.entry_type === 'expense' || t.amount < 0)) return false;
      if (type === 'expense' && t.entry_type !== 'expense' && t.amount >= 0) return false;

      // Query filter
      if (!query) return true;
      const customer = (t.customer_name || '').toLowerCase();
      const email = (t.customer_email || '').toLowerCase();
      const provider = (t.payment_provider || '').toLowerCase();
      const notes = (t.notes || '').toLowerCase();
      const ref = (t.payment_ref || '').toLowerCase();
      const idStr = String(t.id);

      return (
        customer.includes(query) ||
        email.includes(query) ||
        provider.includes(query) ||
        notes.includes(query) ||
        ref.includes(query) ||
        idStr.includes(query)
      );
    });
  });

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading.set(true);
    Promise.all([this.loadOverview(), this.loadTransactions(), this.loadAccountants()]).finally(() => {
      this.loading.set(false);
    });
  }

  loadOverview(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<any>('/api/v1/accountant/overview').subscribe({
        next: (res) => {
          if (res?.kpis) {
            this.kpis.set(res.kpis);
          }
          resolve();
        },
        error: (err) => {
          console.error('Failed to load accounting overview:', err);
          resolve();
        }
      });
    });
  }

  loadTransactions(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<{ transactions: TransactionRecord[] }>('/api/v1/accountant/transactions?limit=250').subscribe({
        next: (res) => {
          this.transactions.set(res.transactions || []);
          resolve();
        },
        error: (err) => {
          console.error('Failed to load transactions:', err);
          resolve();
        }
      });
    });
  }

  loadAccountants(): Promise<void> {
    return new Promise((resolve) => {
      this.http.get<{ accountants: AccountantUser[] }>('/api/v1/admin/accountants').subscribe({
        next: (res) => {
          this.accountants.set(res.accountants || []);
          resolve();
        },
        error: (err) => {
          console.error('Failed to load accountants:', err);
          resolve();
        }
      });
    });
  }

  // -------------------------------------------------------------
  // Accountant & Magic Link Management
  // -------------------------------------------------------------
  openAddAccountantModal() {
    this.newAccountantForm = {
      fullName: '',
      email: '',
      password: this.generateRandomPassword()
    };
    this.showAddAccountantModal.set(true);
  }

  generateRandomPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pwd = 'Acc';
    for (let i = 0; i < 7; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd + '!';
  }

  submitNewAccountant() {
    if (!this.newAccountantForm.fullName || !this.newAccountantForm.email) {
      this.toast.error('Please fill in both Full Name and Email address.');
      return;
    }

    this.isSubmittingAccountant.set(true);
    this.http.post<any>('/api/v1/admin/accountants', this.newAccountantForm).subscribe({
      next: (res) => {
        this.isSubmittingAccountant.set(false);
        this.showAddAccountantModal.set(false);
        this.toast.success('Accountant user created and Magic Link generated!');

        // Display Magic Link Ready Modal with instant copy option
        this.createdAccountantInfo.set({
          user: res.user,
          rawPassword: res.rawPassword,
          magicLink: res.magicLink,
          copied: false
        });
        this.showMagicLinkReadyModal.set(true);

        this.loadAccountants();
      },
      error: (err) => {
        this.isSubmittingAccountant.set(false);
        this.toast.error(err?.error?.message || 'Failed to create accountant.');
      }
    });
  }

  copyCreatedMagicLink() {
    const info = this.createdAccountantInfo();
    if (!info?.magicLink) return;

    navigator.clipboard.writeText(info.magicLink).then(() => {
      this.createdAccountantInfo.update((val) => (val ? { ...val, copied: true } : null));
      this.toast.success('Magic Auto-Login Link copied to clipboard!');
      setTimeout(() => {
        this.createdAccountantInfo.update((val) => (val ? { ...val, copied: false } : null));
      }, 3000);
    });
  }

  copyAccountantLink(accountant: AccountantUser) {
    if (!accountant.magicLink) {
      this.regenerateLink(accountant, true);
      return;
    }

    navigator.clipboard.writeText(accountant.magicLink).then(() => {
      this.copiedLinkIds.update((set) => {
        const next = new Set(set);
        next.add(accountant.id);
        return next;
      });
      this.toast.success(`Magic Link for ${accountant.fullName} copied!`);
      setTimeout(() => {
        this.copiedLinkIds.update((set) => {
          const next = new Set(set);
          next.delete(accountant.id);
          return next;
        });
      }, 3000);
    });
  }

  regenerateLink(accountant: AccountantUser, copyAfter = false) {
    this.http.post<any>(`/api/v1/admin/accountants/${accountant.id}/magic-link`, {}).subscribe({
      next: (res) => {
        this.accountants.update((list) =>
          list.map((a) => (a.id === accountant.id ? { ...a, magicLink: res.magicLink, magicToken: res.magicToken } : a))
        );
        if (copyAfter && res.magicLink) {
          navigator.clipboard.writeText(res.magicLink);
          this.toast.success(`Magic Link re-generated and copied for ${accountant.fullName}!`);
        } else {
          this.toast.success(`Fresh Magic Link generated for ${accountant.fullName}!`);
        }
      },
      error: (err) => {
        this.toast.error('Failed to regenerate magic link.');
      }
    });
  }

  deleteAccountant(accountant: AccountantUser) {
    if (!confirm(`Are you sure you want to remove accountant "${accountant.fullName}"?`)) return;

    this.http.delete(`/api/v1/admin/accountants/${accountant.id}`).subscribe({
      next: () => {
        this.toast.success(`Accountant ${accountant.fullName} removed.`);
        this.loadAccountants();
      },
      error: (err) => {
        this.toast.error('Failed to delete accountant.');
      }
    });
  }

  // -------------------------------------------------------------
  // Add Money (+) & Deduct Money (-)
  // -------------------------------------------------------------
  openAddMoneyModal() {
    this.moneyForm = {
      amount: null,
      customerName: '',
      customerEmail: '',
      paymentProvider: 'ABA Pay',
      status: 'paid',
      notes: '',
      entryType: 'income'
    };
    this.showAddMoneyModal.set(true);
  }

  openDeductMoneyModal() {
    this.moneyForm = {
      amount: null,
      customerName: '',
      customerEmail: '',
      paymentProvider: 'Operational Expense',
      status: 'paid',
      notes: '',
      entryType: 'expense'
    };
    this.showDeductMoneyModal.set(true);
  }

  submitMoneyForm(isDeduction = false) {
    if (!this.moneyForm.amount || this.moneyForm.amount <= 0) {
      this.toast.error('Please enter a valid positive dollar amount.');
      return;
    }

    this.isSubmittingMoney.set(true);

    const payload = {
      amount: Number(this.moneyForm.amount),
      customerName: this.moneyForm.customerName || (isDeduction ? 'Expense / Deduction' : 'Cash Credit'),
      customerEmail: this.moneyForm.customerEmail || undefined,
      paymentProvider: this.moneyForm.paymentProvider || (isDeduction ? 'Operational Deduction' : 'Admin Manual Deposit'),
      status: this.moneyForm.status,
      notes: this.moneyForm.notes,
      entryType: isDeduction ? 'expense' : 'income'
    };

    this.http.post<any>('/api/v1/accountant/transactions', payload).subscribe({
      next: (res) => {
        this.isSubmittingMoney.set(false);
        this.showAddMoneyModal.set(false);
        this.showDeductMoneyModal.set(false);
        this.toast.success(isDeduction ? 'Deduction (-) recorded successfully!' : 'Income (+) added successfully!');
        this.loadOverview();
        this.loadTransactions();
      },
      error: (err) => {
        this.isSubmittingMoney.set(false);
        this.toast.error(err?.error?.message || 'Failed to save transaction.');
      }
    });
  }

  // -------------------------------------------------------------
  // Edit Transaction
  // -------------------------------------------------------------
  openEditModal(transaction: TransactionRecord) {
    this.editingTransaction.set(transaction);
    this.editForm = {
      amount: Math.abs(transaction.amount),
      customerName: transaction.customer_name || '',
      customerEmail: transaction.customer_email || '',
      paymentProvider: transaction.payment_provider || 'ABA Pay',
      status: transaction.status,
      notes: transaction.notes || '',
      entryType: (transaction.entry_type || (transaction.amount < 0 ? 'expense' : 'income')) as 'income' | 'expense'
    };
    this.showEditTransactionModal.set(true);
  }

  submitEditTransaction() {
    const t = this.editingTransaction();
    if (!t) return;

    if (this.editForm.amount <= 0) {
      this.toast.error('Please enter a valid positive amount.');
      return;
    }

    this.isSubmittingEdit.set(true);

    const payload = {
      amount: Number(this.editForm.amount),
      customerName: this.editForm.customerName,
      customerEmail: this.editForm.customerEmail,
      paymentProvider: this.editForm.paymentProvider,
      status: this.editForm.status,
      notes: this.editForm.notes,
      entryType: this.editForm.entryType
    };

    this.http.put<any>(`/api/v1/accountant/transactions/${t.id}`, payload).subscribe({
      next: () => {
        this.isSubmittingEdit.set(false);
        this.showEditTransactionModal.set(false);
        this.toast.success(`Transaction #${t.id} updated!`);
        this.loadOverview();
        this.loadTransactions();
      },
      error: (err) => {
        this.isSubmittingEdit.set(false);
        this.toast.error(err?.error?.message || 'Failed to update transaction.');
      }
    });
  }

  // -------------------------------------------------------------
  // Delete Transaction
  // -------------------------------------------------------------
  confirmDelete(transaction: TransactionRecord) {
    this.deletingTransaction.set(transaction);
    this.showDeleteConfirmModal.set(true);
  }

  executeDelete() {
    const t = this.deletingTransaction();
    if (!t) return;

    this.isDeleting.set(true);
    this.http.delete(`/api/v1/accountant/transactions/${t.id}`).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.showDeleteConfirmModal.set(false);
        this.toast.success(`Transaction #${t.id} permanently removed.`);
        this.loadOverview();
        this.loadTransactions();
      },
      error: (err) => {
        this.isDeleting.set(false);
        this.toast.error(err?.error?.message || 'Failed to delete transaction.');
      }
    });
  }

  // -------------------------------------------------------------
  // Export Report to CSV
  // -------------------------------------------------------------
  exportTransactionsCsv() {
    const rows = this.filteredTransactions();
    if (rows.length === 0) {
      this.toast.error('No transactions available to export.');
      return;
    }

    let csvContent = 'ID,Date,Time,Type,Customer,Email,Service,Provider,Status,Amount,Currency,Notes\n';

    rows.forEach((r) => {
      const dt = new Date(r.purchased_at);
      const dateStr = dt.toISOString().split('T')[0];
      const timeStr = dt.toTimeString().split(' ')[0];
      const type = r.amount < 0 ? 'Deduction/Expense' : 'Income';
      const customer = (r.customer_name || 'N/A').replace(/,/g, ' ');
      const email = (r.customer_email || 'N/A').replace(/,/g, ' ');
      const service = (r.template_name || 'Service').replace(/,/g, ' ');
      const provider = (r.payment_provider || 'Direct').replace(/,/g, ' ');
      const notes = (r.notes || '').replace(/,/g, ' ').replace(/\n/g, ' ');

      csvContent += `${r.id},${dateStr},${timeStr},${type},"${customer}","${email}","${service}","${provider}",${r.status},${r.amount},${r.currency},"${notes}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.toast.success(`Exported ${rows.length} transactions to CSV.`);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  }
}
