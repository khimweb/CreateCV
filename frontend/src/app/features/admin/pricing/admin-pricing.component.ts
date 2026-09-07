import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  DollarSign,
  Check,
  Sparkles,
  Camera,
  FileText,
  Send,
  Save,
  RotateCcw,
  Eye,
  ExternalLink,
  Plus,
  Trash2,
  HelpCircle,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Tag,
  ArrowRight,
  ArrowUpRight
} from 'lucide-angular';
import { PricingService } from '../../../core/services/pricing.service';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { HomepagePricingConfig, DEFAULT_HOMEPAGE_PRICING } from '../../../core/models/pricing.model';

@Component({
  selector: 'app-admin-pricing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './admin-pricing.component.html',
  styleUrls: ['./admin-pricing.component.css'],
})
export class AdminPricingComponent implements OnInit {
  private pricingService = inject(PricingService);
  private toast = inject(ToastService);

  // Icons
  readonly DollarSign = DollarSign;
  readonly Check = Check;
  readonly Sparkles = Sparkles;
  readonly Camera = Camera;
  readonly FileText = FileText;
  readonly Send = Send;
  readonly Save = Save;
  readonly RotateCcw = RotateCcw;
  readonly Eye = Eye;
  readonly ExternalLink = ExternalLink;
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly HelpCircle = HelpCircle;
  readonly RefreshCw = RefreshCw;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly Layers = Layers;
  readonly Tag = Tag;
  readonly ArrowRight = ArrowRight;
  readonly ArrowUpRight = ArrowUpRight;

  // Active view tab: 'editor' | 'preview'
  activeTab = signal<'editor' | 'preview'>('editor');

  // Working copy of pricing configuration
  pricingData = signal<HomepagePricingConfig>(JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_PRICING)));

  isSaving = signal(false);

  // Computeds for instant calculation
  calculatedBundleSavings = computed(() => {
    const orig = Number(this.pricingData().bundle.originalPriceUsd) || 0;
    const sale = Number(this.pricingData().bundle.priceUsd) || 0;
    const save = Math.max(0, orig - sale);
    const percent = orig > 0 ? Math.round((save / orig) * 100) : 0;
    return { save, percent };
  });

  ngOnInit() {
    // Sync working copy with service pricing
    this.pricingService.loadPricing();
    const current = this.pricingService.pricing();
    this.pricingData.set(JSON.parse(JSON.stringify(current)));
  }

  formatKhr(usd: number): string {
    const rate = Number(this.pricingData().exchangeRateKhr) || 4100;
    const khr = Math.round((usd || 0) * rate);
    return `៛${khr.toLocaleString()} KHR`;
  }

  // Feature list management for plans
  addFeature(planKey: 'coverLetter' | 'professionalCv' | 'editPic') {
    const current = this.pricingData();
    const plan = current.plans[planKey];
    plan.features.push('New included feature item');
    this.pricingData.set({ ...current });
  }

  removeFeature(planKey: 'coverLetter' | 'professionalCv' | 'editPic', index: number) {
    const current = this.pricingData();
    const plan = current.plans[planKey];
    if (plan.features.length > 1) {
      plan.features.splice(index, 1);
      this.pricingData.set({ ...current });
    } else {
      this.toast.info('Plan must have at least one feature item');
    }
  }

  // Bundle included items management
  addBundleItem() {
    const current = this.pricingData();
    current.bundle.items.push({ name: 'New Item', value: '$1 value' });
    this.pricingData.set({ ...current });
  }

  removeBundleItem(index: number) {
    const current = this.pricingData();
    if (current.bundle.items.length > 1) {
      current.bundle.items.splice(index, 1);
      this.pricingData.set({ ...current });
    }
  }

  // Auto-sync bundle pills with current plan prices
  syncBundlePillsWithPlanPrices() {
    const current = this.pricingData();
    const cvPrice = current.plans.professionalCv.priceUsd;
    const clPrice = current.plans.coverLetter.priceUsd;
    const picPrice = current.plans.editPic.priceUsd;

    current.bundle.items = [
      { name: 'Professional CV', value: `\$${cvPrice} value` },
      { name: 'Cover Letter', value: `\$${clPrice} value` },
      { name: 'Studio Photo Edit', value: `\$${picPrice} value` },
      { name: 'Priority Telegram Support', value: '' }
    ];

    const totalVal = cvPrice + clPrice + picPrice;
    current.bundle.originalPriceUsd = totalVal;
    current.bundle.badgeTop = `🔥 BEST VALUE • SAVE \$${totalVal - current.bundle.priceUsd} (ORIGINAL \$${totalVal})`;
    current.bundle.telegramButtonText = `Get Bundle via Telegram (\$${current.bundle.priceUsd})`;

    this.pricingData.set({ ...current });
    this.toast.success('Bundle values synchronized with plan prices');
  }

  // Reset to default prices
  resetToDefaults() {
    if (confirm('Are you sure you want to reset all prices and package configurations to standard defaults ($1 Cover Letter, $4 CV, $5 Photo, $8 Bundle)?')) {
      this.pricingData.set(JSON.parse(JSON.stringify(DEFAULT_HOMEPAGE_PRICING)));
      this.toast.info('Pricing reset to defaults. Click "Save All Changes" to persist.');
    }
  }

  // Save changes to backend
  save() {
    this.isSaving.set(true);
    const data = this.pricingData();

    this.pricingService.updatePricing(data).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.toast.success('Homepage pricing updated and published successfully!');
      },
      error: (err) => {
        console.error('Error saving pricing:', err);
        this.isSaving.set(false);
        this.toast.error('Failed to update pricing');
      }
    });
  }
}
