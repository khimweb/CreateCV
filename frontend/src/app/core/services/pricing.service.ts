import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomepagePricingConfig, DEFAULT_HOMEPAGE_PRICING } from '../models/pricing.model';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PricingService {
  private http = inject(HttpClient);

  // Active pricing signal initialized with default config
  pricing = signal<HomepagePricingConfig>(DEFAULT_HOMEPAGE_PRICING);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  constructor() {
    this.loadPricing();
  }

  loadPricing() {
    this.isLoading.set(true);
    return this.http.get<{ pricing: HomepagePricingConfig }>('/api/v1/pricing')
      .pipe(
        tap((res) => {
          if (res && res.pricing) {
            this.pricing.set(this.mergeWithDefaults(res.pricing));
          }
          this.isLoading.set(false);
        }),
        catchError((err) => {
          console.warn('Could not fetch remote pricing, using defaults:', err);
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }

  updatePricing(config: HomepagePricingConfig) {
    this.isSaving.set(true);
    return this.http.put<{ ok: boolean; pricing: HomepagePricingConfig }>('/api/v1/admin/pricing', { pricing: config })
      .pipe(
        tap((res) => {
          if (res && res.pricing) {
            this.pricing.set(this.mergeWithDefaults(res.pricing));
          } else {
            this.pricing.set(config);
          }
          this.isSaving.set(false);
        }),
        catchError((err) => {
          this.isSaving.set(false);
          throw err;
        })
      );
  }

  formatKhr(usdPrice: number, exchangeRate?: number): string {
    const rate = exchangeRate ?? this.pricing().exchangeRateKhr ?? 4100;
    const khr = Math.round((usdPrice || 0) * rate);
    return `៛${khr.toLocaleString()} KHR`;
  }

  private mergeWithDefaults(incoming: Partial<HomepagePricingConfig>): HomepagePricingConfig {
    return {
      exchangeRateKhr: incoming.exchangeRateKhr ?? DEFAULT_HOMEPAGE_PRICING.exchangeRateKhr,
      telegramLink: incoming.telegramLink || DEFAULT_HOMEPAGE_PRICING.telegramLink,
      plans: {
        coverLetter: {
          ...DEFAULT_HOMEPAGE_PRICING.plans.coverLetter,
          ...(incoming.plans?.coverLetter || {}),
        },
        professionalCv: {
          ...DEFAULT_HOMEPAGE_PRICING.plans.professionalCv,
          ...(incoming.plans?.professionalCv || {}),
        },
        editPic: {
          ...DEFAULT_HOMEPAGE_PRICING.plans.editPic,
          ...(incoming.plans?.editPic || {}),
        },
      },
      bundle: {
        ...DEFAULT_HOMEPAGE_PRICING.bundle,
        ...(incoming.bundle || {}),
      },
    };
  }
}
