import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { 
  LucideAngularModule, 
  ArrowRight, 
  Send, 
  Check, 
  Sparkles, 
  Star, 
  FileText, 
  Camera, 
  ShieldCheck, 
  ArrowUpRight, 
  Zap, 
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { PricingService } from '../../core/services/pricing.service';
import { TranslationService } from '../../core/services/translation.service';
import { DEMO_CV } from '../../shared/demo-cv-data';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';
import { ModernSplitCvComponent } from '../../shared/components/modern-split-cv/modern-split-cv.component';
import { ElegantFrameCvComponent } from '../../shared/components/elegant-frame-cv/elegant-frame-cv.component';
import { NavySidebarProfileCvComponent } from '../../shared/components/navy-sidebar-profile-cv/navy-sidebar-profile-cv.component';
import { CoverLetterCvComponent } from '../../shared/components/cover-letter-cv/cover-letter-cv.component';
import { SidebarCoverLetterCvComponent } from '../../shared/components/sidebar-cover-letter-cv/sidebar-cover-letter-cv.component';
import { FramedCoverLetterCvComponent } from '../../shared/components/framed-cover-letter-cv/framed-cover-letter-cv.component';
import { MinimalistCoverLetterCvComponent } from '../../shared/components/minimalist-cover-letter-cv/minimalist-cover-letter-cv.component';
import { A4FitDirective } from '../../shared/directives/a4-fit.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    ProfessionalCvComponent,
    ModernSplitCvComponent,
    ElegantFrameCvComponent,
    NavySidebarProfileCvComponent,
    CoverLetterCvComponent,
    SidebarCoverLetterCvComponent,
    FramedCoverLetterCvComponent,
    MinimalistCoverLetterCvComponent,
    A4FitDirective,
  ],
  template: `
    <main class="home-page">
      <!-- Ambient Glow Orbs -->
      <div class="glow glow-one"></div>
      <div class="glow glow-two"></div>
      <div class="glow glow-three"></div>

      <!-- ================= HERO SECTION ================= -->
      <section class="hero">
        <div class="hero-copy">
          <div class="badge-pill">
            <span class="pulse-dot"></span>
            <span class="badge-text">{{ i18n.t('heroBadge') }}</span>
            <span class="badge-sparkle">✦</span>
          </div>

          <h1 class="hero-title">
            @if (i18n.currentLang() === 'kh') {
              ឈានទៅរកការងារក្នុងក្តីស្រមៃជាមួយ
              <span class="gradient-text">CV អាជីព</span> &
              <span class="gradient-text-alt">លិខិតសុំការងារ</span>
            } @else {
              Land Your Dream Job with a
              <span class="gradient-text">Standout CV</span> &
              <span class="gradient-text-alt">Cover Letter</span>
            }
          </h1>

          <p class="lead">
            {{ i18n.t('heroDesc') }}
          </p>

          <div class="hero-actions">
            <a routerLink="/templates" class="btn-primary">
              {{ i18n.t('heroBtnStart') }}
              <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1.5" />
            </a>
            <a href="#pricing" class="btn-secondary">
              {{ i18n.t('heroBtnPricing') }}
            </a>
          </div>

          <div class="trust-pills">
            <div class="trust-item">
              <span class="trust-icon">⚡</span>
              <span>{{ i18n.t('trustKhqr') }}</span>
            </div>
            <div class="trust-dot">•</div>
            <div class="trust-item">
              <span class="trust-icon">📄</span>
              <span>{{ i18n.t('trustA4') }}</span>
            </div>
            <div class="trust-dot">•</div>
            <div class="trust-item">
              <span class="trust-icon">💬</span>
              <span>{{ i18n.t('trustTelegram') }}</span>
            </div>
          </div>
        </div>

        <!-- Hero Preview Showcase -->
        <div class="hero-preview" aria-label="Professional CV example">
          <div class="preview-badge">
            <lucide-icon [img]="Sparkles" class="w-3.5 h-3.5 text-amber-500 mr-1.5" />
            <span>{{ i18n.t('previewApprovedBadge') }}</span>
          </div>

          <div appA4Fit class="cv-frame hero-frame">
            <div class="cv-scaler">
              <app-professional-cv
                [accent]="'#315fbc'"
                [name]="demo.name"
                [jobTitle]="demo.jobTitle"
                [email]="demo.email"
                [phone]="demo.phone"
                [location]="demo.location"
                [linkedin]="demo.linkedin"
                [summary]="demo.summary"
                [photoUrl]="demo.photoUrl"
                [experience]="demo.experience"
                [education]="demo.education"
                [skills]="demo.skills"
                [languages]="demo.languages"
                [certifications]="demo.certifications"
                [projects]="demo.projects"
                [fontSize]="9"
                [lineHeight]="1.35"
              />
            </div>
          </div>

          <div class="floating-stat-card">
            <div class="stat-icon-wrapper">
              <lucide-icon [img]="Star" class="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div class="flex items-center gap-1">
                <span class="font-extrabold text-xs text-slate-800 dark:text-white">4.9 / 5.0</span>
                <span class="text-[10px] text-amber-500 font-bold">★★★★★</span>
              </div>
              <p class="text-[10px] text-slate-500 dark:text-slate-400">{{ i18n.t('previewRatingTrust') }}</p>
            </div>
          </div>

          <div class="ready-card">
            <div class="check-circle">
              <lucide-icon [img]="Check" class="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <b>{{ i18n.t('previewReadyExport') }}</b>
              <small>PDF • DOCX • PPTX</small>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= STATS TICKER STRIP ================= -->
      <section class="ticker-strip">
        <div class="ticker-inner">
          <div class="ticker-stat">
            <strong class="stat-num">19+</strong>
            <span class="stat-label">{{ i18n.t('statTemplates') }}</span>
          </div>
          <div class="ticker-divider"></div>
          <div class="ticker-stat">
            <strong class="stat-num">$1</strong>
            <span class="stat-label">{{ i18n.t('statPrice') }}</span>
          </div>
          <div class="ticker-divider"></div>
          <div class="ticker-stat">
            <strong class="stat-num">100%</strong>
            <span class="stat-label">{{ i18n.t('statA4') }}</span>
          </div>
          <div class="ticker-divider"></div>
          <div class="ticker-stat">
            <strong class="stat-num">5 Mins</strong>
            <span class="stat-label">{{ i18n.t('statTime') }}</span>
          </div>
        </div>
      </section>

      <!-- ================= PRICING & SERVICES SECTION ================= -->
      <section id="pricing" class="pricing-section">
        <div class="section-intro">
          <div class="badge-pill mx-auto mb-3">
            <lucide-icon [img]="Zap" class="w-3.5 h-3.5 text-indigo-500 mr-1" />
            <span class="badge-text">{{ i18n.t('pricingBadge') }}</span>
          </div>
          <h2 class="section-title">{{ i18n.t('pricingTitle') }}</h2>
          <p class="section-subtitle">
            {{ i18n.t('pricingSubtitle') }}
          </p>
        </div>

        <!-- 3 Individual Cards + 1 High-Impact Bundle Card -->
        <div class="pricing-grid">
          
          <!-- Plan 1: Cover Letter -->
          <div class="pricing-card">
            <div class="plan-header">
              <div class="plan-icon-wrap bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <lucide-icon [img]="FileText" class="w-6 h-6" />
              </div>
              <span class="plan-tier-badge">{{ i18n.currentLang() === 'kh' ? i18n.t('planCoverLetterBadge') : pricing().plans.coverLetter.badge }}</span>
            </div>

            <h3 class="plan-name">{{ i18n.currentLang() === 'kh' ? 'លិខិតសុំការងារ' : pricing().plans.coverLetter.name }}</h3>
            <p class="plan-desc">{{ i18n.currentLang() === 'kh' ? i18n.t('planCoverLetterDesc') : pricing().plans.coverLetter.description }}</p>

            <div class="price-tag">
              <span class="currency">$</span>
              <span class="amount">{{ pricing().plans.coverLetter.priceUsd }}</span>
              <span class="period">{{ pricing().plans.coverLetter.period }}</span>
            </div>
            <p class="khr-price">≈ {{ pricingService.formatKhr(pricing().plans.coverLetter.priceUsd) }}</p>

            <ul class="feature-list">
              @for (feature of pricing().plans.coverLetter.features; track $index) {
                <li>
                  <lucide-icon [img]="Check" class="feature-check" />
                  <span>{{ feature }}</span>
                </li>
              }
            </ul>

            <a [routerLink]="pricing().plans.coverLetter.buttonLink || '/templates'" class="plan-btn plan-btn-secondary">
              {{ i18n.currentLang() === 'kh' ? i18n.t('planCoverLetterBtn') : pricing().plans.coverLetter.buttonText }}
              <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1" />
            </a>
          </div>

          <!-- Plan 2: Professional CV (Popular) -->
          <div class="pricing-card card-popular">
            <div class="popular-ribbon">{{ i18n.currentLang() === 'kh' ? i18n.t('planCvRibbon') : (pricing().plans.professionalCv.ribbon || 'Most Popular') }}</div>

            <div class="plan-header">
              <div class="plan-icon-wrap bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <lucide-icon [img]="Sparkles" class="w-6 h-6" />
              </div>
              <span class="plan-tier-badge bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                {{ i18n.currentLang() === 'kh' ? i18n.t('planCvBadge') : pricing().plans.professionalCv.badge }}
              </span>
            </div>

            <h3 class="plan-name">{{ i18n.currentLang() === 'kh' ? 'CV អាជីពស្តង់ដារ' : pricing().plans.professionalCv.name }}</h3>
            <p class="plan-desc">{{ i18n.currentLang() === 'kh' ? i18n.t('planCvDesc') : pricing().plans.professionalCv.description }}</p>

            <div class="price-tag">
              <span class="currency">$</span>
              <span class="amount">{{ pricing().plans.professionalCv.priceUsd }}</span>
              <span class="period">{{ pricing().plans.professionalCv.period }}</span>
            </div>
            <p class="khr-price">≈ {{ pricingService.formatKhr(pricing().plans.professionalCv.priceUsd) }}</p>

            <ul class="feature-list">
              @for (feature of pricing().plans.professionalCv.features; track $index) {
                <li>
                  <lucide-icon [img]="Check" class="feature-check" />
                  <span>{{ feature }}</span>
                </li>
              }
            </ul>

            <a [routerLink]="pricing().plans.professionalCv.buttonLink || '/templates'" class="plan-btn plan-btn-primary">
              {{ i18n.currentLang() === 'kh' ? i18n.t('planCvBtn') : pricing().plans.professionalCv.buttonText }}
              <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1" />
            </a>
          </div>

          <!-- Plan 3: Professional Photo Retouch -->
          <div class="pricing-card">
            <div class="plan-header">
              <div class="plan-icon-wrap bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <lucide-icon [img]="Camera" class="w-6 h-6" />
              </div>
              <span class="plan-tier-badge">{{ i18n.currentLang() === 'kh' ? i18n.t('planPhotoBadge') : pricing().plans.editPic.badge }}</span>
            </div>

            <h3 class="plan-name">{{ i18n.currentLang() === 'kh' ? 'កែសម្រួលរូបថតស្ទូឌីយោ' : pricing().plans.editPic.name }}</h3>
            <p class="plan-desc">{{ i18n.currentLang() === 'kh' ? i18n.t('planPhotoDesc') : pricing().plans.editPic.description }}</p>

            <div class="price-tag">
              <span class="currency">$</span>
              <span class="amount">{{ pricing().plans.editPic.priceUsd }}</span>
              <span class="period">{{ pricing().plans.editPic.period }}</span>
            </div>
            <p class="khr-price">≈ {{ pricingService.formatKhr(pricing().plans.editPic.priceUsd) }}</p>

            <ul class="feature-list">
              @for (feature of pricing().plans.editPic.features; track $index) {
                <li>
                  <lucide-icon [img]="Check" class="feature-check" />
                  <span>{{ feature }}</span>
                </li>
              }
            </ul>

            <a 
              [href]="pricing().plans.editPic.buttonLink || pricing().telegramLink" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="plan-btn plan-btn-telegram"
            >
              <lucide-icon [img]="Send" class="w-4 h-4 mr-1.5" />
              {{ i18n.currentLang() === 'kh' ? i18n.t('planPhotoBtn') : pricing().plans.editPic.buttonText }}
              <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 ml-1" />
            </a>
          </div>

        </div>

        <!-- ================= MEGA COMBO BUNDLE CARD ================= -->
        <div class="bundle-card-container">
          <div class="bundle-card">
            <div class="bundle-badge-top">
              <span>{{ i18n.currentLang() === 'kh' ? i18n.t('bundleBadgeTop') : pricing().bundle.badgeTop }}</span>
            </div>

            <div class="bundle-content">
              <div class="bundle-left">
                <div class="bundle-kicker">{{ i18n.currentLang() === 'kh' ? i18n.t('bundleKicker') : pricing().bundle.kicker }}</div>
                <h3 class="bundle-title">{{ i18n.currentLang() === 'kh' ? i18n.t('bundleTitle') : pricing().bundle.title }}</h3>
                <p class="bundle-desc">
                  {{ i18n.currentLang() === 'kh' ? i18n.t('bundleDesc') : pricing().bundle.description }}
                </p>

                <div class="bundle-items-grid">
                  @if (i18n.currentLang() === 'kh') {
                    <div class="bundle-item-pill">
                      <span class="pill-check">✓</span>
                      <span><b>{{ i18n.t('bundleItemCv') }}</b></span>
                    </div>
                    <div class="bundle-item-pill">
                      <span class="pill-check">✓</span>
                      <span><b>{{ i18n.t('bundleItemCl') }}</b></span>
                    </div>
                    <div class="bundle-item-pill">
                      <span class="pill-check">✓</span>
                      <span><b>{{ i18n.t('bundleItemPhoto') }}</b></span>
                    </div>
                    <div class="bundle-item-pill">
                      <span class="pill-check">✓</span>
                      <span><b>{{ i18n.t('bundleItemFormats') }}</b></span>
                    </div>
                    <div class="bundle-item-pill">
                      <span class="pill-check">✓</span>
                      <span><b>{{ i18n.t('bundleItemSupport') }}</b></span>
                    </div>
                  } @else {
                    @for (item of pricing().bundle.items; track $index) {
                      <div class="bundle-item-pill">
                        <span class="pill-check">✓</span>
                        <span><b>{{ item.name }}</b>@if (item.value) { ({{ item.value }})}</span>
                      </div>
                    }
                  }
                </div>
              </div>

              <div class="bundle-right">
                <div class="bundle-price-box">
                  <span class="old-price">{{ i18n.currentLang() === 'kh' ? 'តម្លៃដើម' : 'Was' }} \${{ pricing().bundle.originalPriceUsd.toFixed(2) }}</span>
                  <div class="bundle-main-price">
                    <span class="dollar">$</span>
                    <span class="num">{{ pricing().bundle.priceUsd }}</span>
                    <span class="period">USD</span>
                  </div>
                  <span class="bundle-khr">{{ pricingService.formatKhr(pricing().bundle.priceUsd) }} • {{ i18n.currentLang() === 'kh' ? 'កញ្ចប់ពេញលេញ' : 'Complete Set' }}</span>

                  <div class="bundle-actions">
                    <a
                      [href]="pricing().telegramLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn-bundle-telegram"
                    >
                      <lucide-icon [img]="Send" class="w-4 h-4 mr-2" />
                      {{ i18n.currentLang() === 'kh' ? i18n.t('bundleOrderTelegram') : pricing().bundle.telegramButtonText }}
                    </a>
                    <a [routerLink]="pricing().bundle.secondaryButtonLink || '/templates'" class="btn-bundle-start">
                      {{ i18n.currentLang() === 'kh' ? i18n.t('bundleBuildOnline') : pricing().bundle.secondaryButtonText }}
                      <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1" />
                    </a>
                  </div>
                  <p class="text-[11px] text-slate-400 dark:text-slate-400 mt-2 text-center">
                    {{ i18n.currentLang() === 'kh' ? i18n.t('bundleSubtext') : pricing().bundle.subtext }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= WHY CHOOSE SECTION ================= -->
      <section class="value-section">
        <div class="section-intro">
          <div class="badge-pill mx-auto mb-3">
            <span class="badge-text">{{ i18n.t('whyBadge') }}</span>
          </div>
          <h2 class="section-title">{{ i18n.t('whyTitle') }}</h2>
          <p class="section-subtitle">
            {{ i18n.t('whySubtitle') }}
          </p>
        </div>

        <div class="value-grid">
          @for (item of localizedBenefits(); track item.title) {
            <article class="benefit-card">
              <div class="benefit-icon">{{ item.icon }}</div>
              <h3 class="benefit-title">{{ item.title }}</h3>
              <p class="benefit-text">{{ item.text }}</p>
            </article>
          }
        </div>
      </section>

      <!-- ================= CV TEMPLATES SHOWCASE ================= -->
      <section class="real-templates">
        <div class="templates-heading">
          <div>
            <div class="badge-pill mb-2">
              <span class="badge-text">{{ i18n.t('templatesBadge') }}</span>
            </div>
            <h2 class="section-title">{{ i18n.t('templatesTitle') }}</h2>
            <p class="section-subtitle">{{ i18n.t('templatesSubtitle') }}</p>
          </div>
          <div class="header-actions">
            <div class="carousel-nav-btns">
              <button 
                type="button" 
                class="carousel-arrow-btn" 
                (click)="scrollSlider('cvSlider', 'left')" 
                title="Scroll Left"
                aria-label="Scroll Left"
              >
                <lucide-icon [img]="ChevronLeft" class="w-4 h-4" />
              </button>
              <button 
                type="button" 
                class="carousel-arrow-btn" 
                (click)="scrollSlider('cvSlider', 'right')" 
                title="Scroll Right"
                aria-label="Scroll Right"
              >
                <lucide-icon [img]="ChevronRight" class="w-4 h-4" />
              </button>
            </div>
            <a routerLink="/templates" class="see-all-link">
              {{ i18n.t('templatesSeeAll') }}
              <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        <!-- Horizontal Smooth Scroll Track for CVs -->
        <div id="cvSlider" class="template-slider-track">
          
          <!-- CV 1: Professional Timeline -->
          <a [routerLink]="['/templates/preview', '1']" [queryParams]="{ color: '#315fbc' }" class="template-slide-card">
            <div appA4Fit class="a4-preview-frame">
              <div class="a4-scaler-thumb">
                <app-professional-cv
                  [accent]="'#315fbc'"
                  [name]="demo.name"
                  [jobTitle]="demo.jobTitle"
                  [email]="demo.email"
                  [phone]="demo.phone"
                  [location]="demo.location"
                  [linkedin]="demo.linkedin"
                  [summary]="demo.summary"
                  [photoUrl]="demo.photoUrl"
                  [experience]="demo.experience"
                  [education]="demo.education"
                  [skills]="demo.skills"
                  [languages]="demo.languages"
                  [certifications]="demo.certifications"
                  [projects]="demo.projects"
                  [fontSize]="9"
                  [lineHeight]="1.35"
                />
              </div>
              <div class="card-hover-action">
                <span class="hover-use-btn">
                  {{ i18n.t('useTemplate') }}
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
            <div class="slide-card-footer">
              <div class="slide-info-left">
                <div class="slide-title-row">
                  <h3 class="slide-title">{{ i18n.currentLang() === 'kh' ? 'កាលប្បវត្តិការងារអាជីព' : 'Professional Timeline' }}</h3>
                  <span class="slide-price-pill price-pill-cv">\${{ pricing().plans.professionalCv.priceUsd }}</span>
                </div>
                <p class="slide-category">{{ i18n.currentLang() === 'kh' ? 'ប្លង់រៀបចំតាមលំដាប់លំដោយយ៉ាងត្រឹមត្រូវ' : 'Clean chronological corporate timeline' }}</p>
              </div>
              <div class="slide-arrow-btn">↗</div>
            </div>
          </a>

          <!-- CV 2: Modern Split -->
          <a [routerLink]="['/templates/preview', '3']" [queryParams]="{ color: '#6e4fa7' }" class="template-slide-card">
            <div appA4Fit class="a4-preview-frame">
              <div class="a4-scaler-thumb">
                <app-modern-split-cv
                  [accent]="'#6e4fa7'"
                  [name]="demo.name"
                  [jobTitle]="demo.jobTitle"
                  [email]="demo.email"
                  [phone]="demo.phone"
                  [location]="demo.location"
                  [summary]="demo.summary"
                  [photoUrl]="demo.photoUrl"
                  [experience]="demo.experience"
                  [education]="demo.education"
                  [skills]="demo.skills"
                  [languages]="demo.languages"
                  [references]="demo.references"
                  [hobbies]="demo.hobbies"
                  [fontSize]="9"
                  [lineHeight]="1.35"
                />
              </div>
              <div class="card-hover-action">
                <span class="hover-use-btn">
                  {{ i18n.t('useTemplate') }}
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
            <div class="slide-card-footer">
              <div class="slide-info-left">
                <div class="slide-title-row">
                  <h3 class="slide-title">{{ i18n.currentLang() === 'kh' ? 'ទម្រង់បែងចែកជួរឈរទំនើប' : 'Modern Split' }}</h3>
                  <span class="slide-price-pill price-pill-cv">\${{ pricing().plans.professionalCv.priceUsd }}</span>
                </div>
                <p class="slide-category">{{ i18n.currentLang() === 'kh' ? 'រចនាបថជួរឈរទ្វេពណ៌រៀបចំយ៉ាងច្បាស់លាស់' : 'Bold dual-tone structured columns' }}</p>
              </div>
              <div class="slide-arrow-btn">↗</div>
            </div>
          </a>

          <!-- CV 3: Elegant Frame -->
          <a [routerLink]="['/templates/preview', '6']" [queryParams]="{ color: '#9a6b3f' }" class="template-slide-card">
            <div appA4Fit class="a4-preview-frame">
              <div class="a4-scaler-thumb">
                <app-elegant-frame-cv
                  [accent]="'#9a6b3f'"
                  [name]="demo.name"
                  [jobTitle]="demo.jobTitle"
                  [email]="demo.email"
                  [phone]="demo.phone"
                  [location]="demo.location"
                  [linkedin]="demo.linkedin"
                  [summary]="demo.summary"
                  [photoUrl]="demo.photoUrl"
                  [experience]="demo.experience"
                  [education]="demo.education"
                  [skills]="demo.skills"
                  [languages]="demo.languages"
                  [references]="demo.references"
                  [fontSize]="9"
                  [lineHeight]="1.35"
                />
              </div>
              <div class="card-hover-action">
                <span class="hover-use-btn">
                  {{ i18n.t('useTemplate') }}
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
            <div class="slide-card-footer">
              <div class="slide-info-left">
                <div class="slide-title-row">
                  <h3 class="slide-title">{{ i18n.currentLang() === 'kh' ? 'ស៊ុមគែមប្រណិតបែបថ្នាក់ដឹកនាំ' : 'Elegant Frame' }}</h3>
                  <span class="slide-price-pill price-pill-cv">\${{ pricing().plans.professionalCv.priceUsd }}</span>
                </div>
                <p class="slide-category">{{ i18n.currentLang() === 'kh' ? 'ប្លង់ស៊ុមគែមដ៏ប្រណិតស័ក្តិសមសម្រាប់កម្រិតគ្រប់គ្រង' : 'Distinguished executive border layout' }}</p>
              </div>
              <div class="slide-arrow-btn">↗</div>
            </div>
          </a>

          <!-- CV 4: Navy Sidebar Profile -->
          <a [routerLink]="['/templates/preview', '13']" [queryParams]="{ color: '#16394F' }" class="template-slide-card">
            <div appA4Fit class="a4-preview-frame">
              <div class="a4-scaler-thumb">
                <app-navy-sidebar-profile-cv
                  [accent]="'#16394F'"
                  [name]="'LORNA ALVARADO'"
                  [jobTitle]="'Sales Representative'"
                  [email]="'hello@reallygreatsite.com'"
                  [phone]="'123-456-7890'"
                  [location]="'123 Anywhere St., Any City'"
                  [photoUrl]="'/assets/lorna-alvarado-photo.png'"
                  [fontSize]="9"
                  [fontWeight]="400"
                  [lineHeight]="1.5"
                />
              </div>
              <div class="card-hover-action">
                <span class="hover-use-btn">
                  {{ i18n.t('useTemplate') }}
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
            <div class="slide-card-footer">
              <div class="slide-info-left">
                <div class="slide-title-row">
                  <h3 class="slide-title">{{ i18n.currentLang() === 'kh' ? 'ជួរចំហៀងពណ៌ខៀវចាស់' : 'Navy Sidebar' }}</h3>
                  <span class="slide-price-pill price-pill-cv">\${{ pricing().plans.professionalCv.priceUsd }}</span>
                </div>
                <p class="slide-category">{{ i18n.currentLang() === 'kh' ? 'រចនាបថឆ្នូតចំហៀងពណ៌ចាស់ និងរូបថតរង្វង់មូល' : 'Executive dark sidebar & circular portrait' }}</p>
              </div>
              <div class="slide-arrow-btn">↗</div>
            </div>
          </a>
        </div>
      </section>

      <!-- ================= COVER LETTERS SHOWCASE ================= -->
      <section class="real-templates cover-letters-section">
        <div class="templates-heading">
          <div>
            <div class="badge-pill mb-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
              <span class="badge-text">{{ i18n.t('clBadge') }} (\${{ pricing().plans.coverLetter.priceUsd }})</span>
            </div>
            <h2 class="section-title">{{ i18n.t('clTitle') }}</h2>
            <p class="section-subtitle">{{ i18n.t('clSubtitle') }}</p>
          </div>
          <div class="header-actions">
            <div class="carousel-nav-btns">
              <button 
                type="button" 
                class="carousel-arrow-btn" 
                (click)="scrollSlider('clSlider', 'left')" 
                title="Scroll Left"
                aria-label="Scroll Left"
              >
                <lucide-icon [img]="ChevronLeft" class="w-4 h-4" />
              </button>
              <button 
                type="button" 
                class="carousel-arrow-btn" 
                (click)="scrollSlider('clSlider', 'right')" 
                title="Scroll Right"
                aria-label="Scroll Right"
              >
                <lucide-icon [img]="ChevronRight" class="w-4 h-4" />
              </button>
            </div>
            <a routerLink="/templates" class="see-all-link">
              {{ i18n.t('templatesSeeAll') }}
              <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        <!-- Horizontal Smooth Scroll Track for Cover Letters -->
        <div id="clSlider" class="template-slider-track">

          <!-- Cover Letter 1: Modern Accent (ID 17) -->
          <a [routerLink]="['/templates/preview', '17']" [queryParams]="{ color: '#0d9488' }" class="template-slide-card">
            <div appA4Fit class="a4-preview-frame">
              <div class="a4-scaler-thumb">
                <app-sidebar-cover-letter-cv
                  [accent]="'#0d9488'"
                  [name]="'Daniel Murray'"
                  [jobTitle]="'ADMINISTRATIVE ASSISTANT'"
                  [location]="'2400 President Ave, Los Angeles, CA'"
                  [phone]="'(469) 732-9961'"
                  [email]="'murray.dani3@gmail.com'"
                  [recipientName]="'Ms. Woods'"
                  [recipientDept]="'Spike Global'"
                  [greeting]="'Dear Ms. Woods,'"
                  [closing]="'Sincerely,'"
                  [fontSize]="9"
                  [fontWeight]="400"
                  [lineHeight]="1.5"
                />
              </div>
              <div class="card-hover-action">
                <span class="hover-use-btn">
                  {{ i18n.t('useLetter') }}
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
            <div class="slide-card-footer">
              <div class="slide-info-left">
                <div class="slide-title-row">
                  <h3 class="slide-title">{{ i18n.currentLang() === 'kh' ? 'ប្លង់ឆ្នូតពណ៌បៃតងខ្ចី' : 'Modern Accent' }}</h3>
                  <span class="slide-price-pill price-pill-cl">\${{ pricing().plans.coverLetter.priceUsd }}</span>
                </div>
                <p class="slide-category">{{ i18n.currentLang() === 'kh' ? 'ក្បាលទំព័រ និងជួរចំហៀងពណ៌បៃតងប្រណិត' : 'Contemporary teal header bar & sidebar' }}</p>
              </div>
              <div class="slide-arrow-btn">↗</div>
            </div>
          </a>

          <!-- Cover Letter 2: Classic Executive (ID 9) -->
          <a [routerLink]="['/templates/preview', '9']" [queryParams]="{ color: '#1a5276' }" class="template-slide-card">
            <div appA4Fit class="a4-preview-frame">
              <div class="a4-scaler-thumb">
                <app-cover-letter-cv
                  [accent]="'#1a5276'"
                  [name]="demo.name"
                  [phone]="demo.phone"
                  [email]="demo.email"
                  [location]="demo.location"
                  [fontSize]="9"
                  [fontWeight]="400"
                  [lineHeight]="1.5"
                />
              </div>
              <div class="card-hover-action">
                <span class="hover-use-btn">
                  {{ i18n.t('useLetter') }}
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
            <div class="slide-card-footer">
              <div class="slide-info-left">
                <div class="slide-title-row">
                  <h3 class="slide-title">{{ i18n.currentLang() === 'kh' ? 'លិខិតបែបថ្នាក់ដឹកនាំបុរាណ' : 'Classic Executive' }}</h3>
                  <span class="slide-price-pill price-pill-cl">\${{ pricing().plans.coverLetter.priceUsd }}</span>
                </div>
                <p class="slide-category">{{ i18n.currentLang() === 'kh' ? 'ទម្រង់ផ្លូវការបុរាណប្រកបដោយទំនុកចិត្ត' : 'Timeless formal serif presentation' }}</p>
              </div>
              <div class="slide-arrow-btn">↗</div>
            </div>
          </a>

          <!-- Cover Letter 3: Classic Border (ID 16) -->
          <a [routerLink]="['/templates/preview', '16']" [queryParams]="{ color: '#854d0e' }" class="template-slide-card">
            <div appA4Fit class="a4-preview-frame">
              <div class="a4-scaler-thumb">
                <app-framed-cover-letter-cv
                  [accent]="'#854d0e'"
                  [name]="'Felicity Kendwell'"
                  [jobTitle]="'Marketing Specialist'"
                  [location]="'20 Park Street, London Bridge'"
                  [phone]="'020 7950 5505'"
                  [email]="'FelicityK@yahoo.com'"
                  [recipientName]="'Gabriel Vince'"
                  [recipientDept]="'London Bridge Support Services'"
                  [greeting]="'Dear Mr. Vince,'"
                  [closing]="'Regards,'"
                  [fontSize]="9"
                  [fontWeight]="400"
                  [lineHeight]="1.5"
                />
              </div>
              <div class="card-hover-action">
                <span class="hover-use-btn">
                  {{ i18n.t('useLetter') }}
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
            <div class="slide-card-footer">
              <div class="slide-info-left">
                <div class="slide-title-row">
                  <h3 class="slide-title">{{ i18n.currentLang() === 'kh' ? 'ស៊ុមគែមបែបបុរាណ' : 'Classic Border' }}</h3>
                  <span class="slide-price-pill price-pill-cl">\${{ pricing().plans.coverLetter.priceUsd }}</span>
                </div>
                <p class="slide-category">{{ i18n.currentLang() === 'kh' ? 'ស៊ុមគែមស្រស់ស្អាតជាមួយចំណងជើងកណ្តាល' : 'Refined framed border with centered title' }}</p>
              </div>
              <div class="slide-arrow-btn">↗</div>
            </div>
          </a>

          <!-- Cover Letter 4: Minimalist Two-Column (ID 18) -->
          <a [routerLink]="['/templates/preview', '18']" [queryParams]="{ color: '#475569' }" class="template-slide-card">
            <div appA4Fit class="a4-preview-frame">
              <div class="a4-scaler-thumb">
                <app-minimalist-cover-letter-cv
                  [accent]="'#475569'"
                  [name]="'Sophie Walton'"
                  [jobTitle]="'Customer Service Specialist'"
                  [location]="'1 Ray Hall Lane, Birmingham, UK'"
                  [phone]="'0121 657 9000'"
                  [email]="'vc@yahoo.co.uk'"
                  [recipientName]="'Mr. Felsted'"
                  [recipientDept]="'Acme Global'"
                  [date]="'15 August 2026'"
                  [greeting]="'Dear Mr. Felsted,'"
                  [closing]="'Best regards,'"
                  [fontSize]="9"
                  [fontWeight]="400"
                  [lineHeight]="1.5"
                />
              </div>
              <div class="card-hover-action">
                <span class="hover-use-btn">
                  {{ i18n.t('useLetter') }}
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
            <div class="slide-card-footer">
              <div class="slide-info-left">
                <div class="slide-title-row">
                  <h3 class="slide-title">{{ i18n.currentLang() === 'kh' ? 'ទម្រង់សាមញ្ញប្រណិត' : 'Minimalist To/From' }}</h3>
                  <span class="slide-price-pill price-pill-cl">\${{ pricing().plans.coverLetter.priceUsd }}</span>
                </div>
                <p class="slide-category">{{ i18n.currentLang() === 'kh' ? 'ព័ត៌មានផ្ញើ-ទទួលរៀបចំយ៉ាងស្អាតបាត' : 'Clean side metadata & crisp formatting' }}</p>
              </div>
              <div class="slide-arrow-btn">↗</div>
            </div>
          </a>

        </div>
      </section>

      <!-- ================= FINAL CTA SECTION ================= -->
      <section class="final-cta">
        <div class="cta-inner">
          <div class="badge-pill mx-auto mb-3 bg-white/20 text-white border-white/20">
            <span class="badge-sparkle">✦</span>
            <span class="badge-text">{{ i18n.t('ctaBadge') }}</span>
          </div>
          <h2>{{ i18n.t('ctaTitle') }}</h2>
          <p>
            {{ i18n.t('ctaDesc') }}
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <a routerLink="/templates" class="cta-btn-white">
              {{ i18n.t('ctaChooseTemplate') }}
              <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1.5 inline" />
            </a>
            <a 
              href="https://t.me/cvresumecqprofessional" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="cta-btn-glass"
            >
              <lucide-icon [img]="Send" class="w-4 h-4 mr-1.5 inline" />
              {{ i18n.t('ctaTelegramSupport') }}
            </a>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
      overflow: hidden;
      padding-top: 106px;
      background: linear-gradient(150deg, #f8faff 0%, #eef3ff 45%, #f4f8ff 100%);
      color: #1a233b;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      position: relative;
    }

    /* Ambient background glows */
    .glow {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
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
      top: 1400px;
      background: rgba(168, 85, 247, 0.14);
    }

    /* Shared layout wrappers */
    .hero, .ticker-strip, .pricing-section, .value-section, .real-templates {
      max-width: 1200px;
      margin: auto;
      position: relative;
      z-index: 1;
    }

    /* Badge Pill */
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid #e0e4f6;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.08);
      font-size: 0.72rem;
      font-weight: 700;
      color: #4f46e5;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    }

    /* ================= HERO ================= */
    .hero {
      padding: 48px 24px 70px;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 50px;
      align-items: center;
    }
    .hero-title {
      margin: 20px 0 16px;
      font-size: clamp(2.5rem, 4.4vw, 3.8rem);
      line-height: 1.12;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #0f172a;
    }
    .gradient-text {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .gradient-text-alt {
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .lead {
      max-width: 540px;
      margin: 0 0 28px;
      color: #556481;
      font-size: 1.05rem;
      line-height: 1.68;
    }
    .hero-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      padding: 14px 24px;
      border-radius: 14px;
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      color: #fff;
      font-weight: 700;
      font-size: 0.92rem;
      text-decoration: none;
      box-shadow: 0 10px 24px rgba(79, 70, 229, 0.35);
      transition: all 0.2s ease;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 28px rgba(79, 70, 229, 0.45);
    }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      padding: 14px 22px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #d5d9ec;
      color: #374151;
      font-weight: 700;
      font-size: 0.92rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      background: #ffffff;
      border-color: #a5b4fc;
      color: #4f46e5;
      transform: translateY(-2px);
    }
    .trust-pills {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      margin-top: 32px;
      font-size: 0.78rem;
      font-weight: 600;
      color: #64748b;
    }
    .trust-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .trust-dot {
      color: #cbd5e1;
    }

    /* Hero CV preview frame */
    .hero-preview {
      position: relative;
      height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cv-frame {
      position: relative;
      container-type: size;
      width: 100%;
      aspect-ratio: 210/297;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      background: #fff;
      box-shadow: 0 20px 45px rgba(30, 41, 59, 0.14);
    }
    .hero-frame {
      width: min(100%, 320px);
      aspect-ratio: 210 / 297;
      height: auto;
      transform: rotate(2.5deg);
      box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.25);
      transition: transform 0.3s ease;
    }
    .hero-frame:hover {
      transform: rotate(0deg) scale(1.02);
    }
    .cv-scaler {
      position: absolute;
      top: 0;
      left: 0;
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      transform-origin: top left;
      transform: scale(var(--a4-scale, 0.403));
      pointer-events: none;
    }
    .preview-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 10;
      display: flex;
      align-items: center;
      padding: 7px 13px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #e2e8f0;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.1);
      font-size: 0.7rem;
      font-weight: 700;
      color: #1e293b;
    }
    .floating-stat-card {
      position: absolute;
      top: 100px;
      right: -10px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid #e2e8f0;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
    }
    .stat-icon-wrapper {
      width: 30px;
      height: 30px;
      border-radius: 10px;
      background: #fef3c7;
      display: grid;
      place-items: center;
    }
    .ready-card {
      position: absolute;
      bottom: 20px;
      left: -10px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid #e2e8f0;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
    }
    .check-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #d1fae5;
      display: grid;
      place-items: center;
    }
    .ready-card b {
      display: block;
      font-size: 0.74rem;
      color: #0f172a;
    }
    .ready-card small {
      font-size: 0.62rem;
      color: #64748b;
    }

    /* ================= STATS TICKER STRIP ================= */
    .ticker-strip {
      padding: 0 24px 60px;
    }
    .ticker-inner {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      padding: 24px 32px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px rgba(30, 41, 59, 0.05);
    }
    .ticker-stat {
      text-align: center;
    }
    .stat-num {
      display: block;
      font-size: 1.8rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #4f46e5;
    }
    .stat-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
    }
    .ticker-divider {
      width: 1px;
      height: 36px;
      background: #e2e8f0;
    }

    /* ================= PRICING SECTION ================= */
    .pricing-section {
      padding: 20px 24px 80px;
    }
    .section-intro {
      max-width: 650px;
      margin: 0 auto 44px;
      text-align: center;
    }
    .section-title {
      font-size: clamp(2rem, 3.4vw, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #0f172a;
      margin: 0 0 12px;
    }
    .section-subtitle {
      color: #64748b;
      font-size: 0.98rem;
      line-height: 1.6;
      margin: 0;
    }
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 30px;
    }
    .pricing-card {
      position: relative;
      padding: 32px 26px 28px;
      border-radius: 24px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 12px 30px rgba(30, 41, 59, 0.06);
      display: flex;
      flex-direction: column;
      transition: all 0.25s ease;
    }
    .pricing-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(30, 41, 59, 0.12);
      border-color: #cbd5e1;
    }
    .card-popular {
      border: 2px solid #6366f1;
      box-shadow: 0 18px 45px rgba(99, 102, 241, 0.16);
      transform: scale(1.02);
    }
    .card-popular:hover {
      transform: scale(1.02) translateY(-5px);
    }
    .popular-ribbon {
      position: absolute;
      top: -13px;
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 16px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: #fff;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
    }
    .plan-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .plan-icon-wrap {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      display: grid;
      place-items: center;
    }
    .plan-tier-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      background: #f1f5f9;
      color: #475569;
    }
    .plan-name {
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px;
      letter-spacing: -0.02em;
    }
    .plan-desc {
      font-size: 0.82rem;
      color: #64748b;
      line-height: 1.5;
      margin: 0 0 20px;
      min-height: 42px;
    }
    .price-tag {
      display: flex;
      align-items: baseline;
      gap: 3px;
      margin-bottom: 2px;
    }
    .price-tag .currency {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
    }
    .price-tag .amount {
      font-size: 3rem;
      font-weight: 900;
      letter-spacing: -0.04em;
      color: #0f172a;
      line-height: 1;
    }
    .price-tag .period {
      font-size: 0.82rem;
      font-weight: 600;
      color: #94a3b8;
    }
    .khr-price {
      font-size: 0.75rem;
      font-weight: 700;
      color: #6366f1;
      margin: 0 0 22px;
    }
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0 0 28px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .feature-list li {
      display: flex;
      align-items: flex-start;
      gap: 9px;
      font-size: 0.82rem;
      color: #334155;
      line-height: 1.45;
    }
    .feature-check {
      width: 16px;
      height: 16px;
      color: #10b981;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .plan-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 12px 18px;
      border-radius: 12px;
      font-size: 0.88rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .plan-btn-primary {
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      color: #fff;
      box-shadow: 0 6px 18px rgba(79, 70, 229, 0.3);
    }
    .plan-btn-primary:hover {
      box-shadow: 0 10px 24px rgba(79, 70, 229, 0.45);
      transform: translateY(-2px);
    }
    .plan-btn-secondary {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #1e293b;
    }
    .plan-btn-secondary:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
      transform: translateY(-2px);
    }
    .plan-btn-telegram {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: #fff;
      box-shadow: 0 6px 18px rgba(2, 132, 199, 0.3);
    }
    .plan-btn-telegram:hover {
      box-shadow: 0 10px 24px rgba(2, 132, 199, 0.45);
      transform: translateY(-2px);
    }

    /* ================= BUNDLE CARD ($8) ================= */
    .bundle-card-container {
      margin-top: 24px;
    }
    .bundle-card {
      position: relative;
      border-radius: 28px;
      background: linear-gradient(135deg, #ffffff 0%, #f9faff 100%);
      border: 2px solid #818cf8;
      box-shadow: 0 20px 50px rgba(99, 102, 241, 0.2);
      overflow: hidden;
      padding: 36px 36px 32px;
    }
    .bundle-badge-top {
      position: absolute;
      top: 0;
      right: 40px;
      padding: 6px 20px;
      border-bottom-left-radius: 14px;
      border-bottom-right-radius: 14px;
      background: linear-gradient(135deg, #f59e0b, #ea580c);
      color: #fff;
      font-size: 0.72rem;
      font-weight: 900;
      letter-spacing: 0.05em;
      box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35);
    }
    .bundle-content {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 36px;
      align-items: center;
    }
    .bundle-kicker {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #4f46e5;
      margin-bottom: 6px;
    }
    .bundle-title {
      font-size: 1.85rem;
      font-weight: 900;
      letter-spacing: -0.03em;
      color: #0f172a;
      margin: 0 0 10px;
    }
    .bundle-desc {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 24px;
    }
    .bundle-items-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .bundle-item-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 12px;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      font-size: 0.8rem;
      color: #1e293b;
    }
    .pill-check {
      color: #10b981;
      font-weight: 900;
    }
    .bundle-price-box {
      background: #ffffff;
      border: 1px solid #e0e7ff;
      border-radius: 22px;
      padding: 26px 22px;
      box-shadow: 0 10px 30px rgba(79, 70, 229, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .old-price {
      font-size: 0.88rem;
      font-weight: 700;
      color: #94a3b8;
      text-decoration: line-through;
      margin-bottom: 2px;
    }
    .bundle-main-price {
      display: flex;
      align-items: baseline;
      gap: 4px;
      line-height: 1;
    }
    .bundle-main-price .dollar {
      font-size: 1.8rem;
      font-weight: 800;
      color: #4f46e5;
    }
    .bundle-main-price .num {
      font-size: 3.8rem;
      font-weight: 900;
      letter-spacing: -0.04em;
      color: #4f46e5;
    }
    .bundle-main-price .period {
      font-size: 0.9rem;
      font-weight: 700;
      color: #64748b;
    }
    .bundle-khr {
      font-size: 0.78rem;
      font-weight: 700;
      color: #059669;
      margin-top: 4px;
      margin-bottom: 18px;
    }
    .bundle-actions {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .btn-bundle-telegram {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 13px 18px;
      border-radius: 12px;
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: #fff;
      font-size: 0.88rem;
      font-weight: 800;
      text-decoration: none;
      box-shadow: 0 8px 20px rgba(2, 132, 199, 0.35);
      transition: all 0.2s ease;
    }
    .btn-bundle-telegram:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 26px rgba(2, 132, 199, 0.45);
    }
    .btn-bundle-start {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 10px 18px;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      color: #334155;
      font-size: 0.82rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-bundle-start:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    /* ================= VALUE SECTION ================= */
    .value-section {
      padding: 50px 24px 80px;
    }
    .value-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .benefit-card {
      padding: 28px 24px;
      border-radius: 20px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 25px rgba(30, 41, 59, 0.05);
      transition: transform 0.2s ease;
    }
    .benefit-card:hover {
      transform: translateY(-4px);
    }
    .benefit-icon {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: #ede9fe;
      color: #6366f1;
      font-size: 1.3rem;
      margin-bottom: 16px;
    }
    .benefit-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 8px;
    }
    .benefit-text {
      font-size: 0.86rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* ================= TEMPLATES SHOWCASE ================= */
    .real-templates {
      padding: 30px 24px 70px;
      max-width: 1320px;
      margin: 0 auto;
    }
    .cover-letters-section {
      padding-top: 10px;
      padding-bottom: 90px;
    }
    .templates-heading {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 24px;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .carousel-nav-btns {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .carousel-arrow-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #1e293b;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
      transition: all 0.2s ease;
    }
    .carousel-arrow-btn:hover {
      background: #0284c7;
      color: #ffffff;
      border-color: #0284c7;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
    }
    .carousel-arrow-btn:active {
      transform: translateY(0);
    }
    .see-all-link {
      display: inline-flex;
      align-items: center;
      color: #0284c7;
      font-weight: 700;
      font-size: 0.88rem;
      text-decoration: none;
      transition: color 0.15s;
      white-space: nowrap;
    }
    .see-all-link:hover {
      color: #0369a1;
      text-decoration: underline;
    }

    /* Slider Track */
    .template-slider-track {
      display: flex;
      gap: 24px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      padding: 10px 4px 22px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
    }
    .template-slider-track::-webkit-scrollbar {
      height: 6px;
    }
    .template-slider-track::-webkit-scrollbar-track {
      background: transparent;
    }
    .template-slider-track::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.35);
      border-radius: 9999px;
    }
    .template-slider-track::-webkit-scrollbar-thumb:hover {
      background: rgba(100, 116, 139, 0.6);
    }

    /* Individual Slide Card */
    .template-slide-card {
      flex: 0 0 285px;
      width: 285px;
      max-width: 295px;
      scroll-snap-align: start;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
      padding: 12px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .template-slide-card:hover {
      transform: translateY(-6px);
      border-color: #cbd5e1;
      box-shadow: 0 20px 40px -8px rgba(15, 23, 42, 0.16);
    }

    /* Full A4 Frame inside Card */
    .a4-preview-frame {
      position: relative;
      width: 100%;
      aspect-ratio: 210 / 297;
      overflow: hidden;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #edf2f7;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      container-type: size;
    }
    .a4-scaler-thumb {
      position: absolute;
      top: 0;
      left: 0;
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      transform-origin: top left;
      /* Measured precisely by A4FitDirective */
      transform: scale(var(--a4-scale, 0.329));
      pointer-events: none;
    }

    /* Hover Action Overlay */
    .card-hover-action {
      position: absolute;
      inset: 0;
      z-index: 10;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(2px);
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.25s ease;
      border-radius: 12px;
    }
    .template-slide-card:hover .card-hover-action {
      opacity: 1;
    }
    .hover-use-btn {
      background: #0284c7;
      color: #ffffff;
      padding: 9px 18px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.84rem;
      box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
      display: inline-flex;
      align-items: center;
      transform: scale(0.92);
      transition: transform 0.2s ease;
    }
    .template-slide-card:hover .hover-use-btn {
      transform: scale(1);
    }

    /* Card Metadata */
    .slide-card-footer {
      margin-top: 12px;
      padding: 4px 6px 2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .slide-info-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
    }
    .slide-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .slide-title {
      font-size: 0.94rem;
      font-weight: 800;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }
    .slide-category {
      font-size: 0.74rem;
      color: #64748b;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .slide-price-pill {
      font-size: 0.75rem;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 8px;
      white-space: nowrap;
    }
    .price-pill-cv {
      background: #e0f2fe;
      color: #0369a1;
    }
    .price-pill-cl {
      background: #ecfdf5;
      color: #047857;
    }
    .slide-arrow-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #f1f5f9;
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    .template-slide-card:hover .slide-arrow-btn {
      background: #0284c7;
      color: #ffffff;
      transform: translateX(2px) translateY(-2px);
    }

    /* ================= FINAL CTA ================= */
    .final-cta {
      padding: 0 24px 80px;
    }
    .cta-inner {
      padding: 64px 32px;
      border-radius: 32px;
      text-align: center;
      background: linear-gradient(135deg, #4338ca 0%, #312e81 60%, #1e1b4b 100%);
      color: #fff;
      box-shadow: 0 24px 60px rgba(67, 56, 202, 0.35);
      position: relative;
      overflow: hidden;
    }
    .cta-inner h2 {
      font-size: clamp(2rem, 3.6vw, 2.8rem);
      font-weight: 900;
      letter-spacing: -0.04em;
      margin: 0 auto 16px;
      max-width: 650px;
    }
    .cta-inner p {
      max-width: 550px;
      margin: 0 auto 30px;
      color: #c7d2fe;
      font-size: 0.98rem;
      line-height: 1.65;
    }
    .cta-btn-white {
      display: inline-flex;
      align-items: center;
      padding: 14px 28px;
      border-radius: 14px;
      background: #ffffff;
      color: #3730a3;
      font-weight: 800;
      font-size: 0.92rem;
      text-decoration: none;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
    }
    .cta-btn-white:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.25);
    }
    .cta-btn-glass {
      display: inline-flex;
      align-items: center;
      padding: 14px 26px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      font-weight: 800;
      font-size: 0.92rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .cta-btn-glass:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }

    /* ================= RESPONSIVE ================= */
    @media (max-width: 1024px) {
      .hero {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 40px;
        padding-top: 20px;
      }
      .lead {
        margin-left: auto;
        margin-right: auto;
      }
      .hero-actions, .trust-pills {
        justify-content: center;
      }
      .pricing-grid {
        grid-template-columns: 1fr;
        max-width: 480px;
        margin: 0 auto 30px;
      }
      .card-popular {
        transform: none;
      }
      .card-popular:hover {
        transform: translateY(-5px);
      }
      .bundle-content {
        grid-template-columns: 1fr;
      }
      .bundle-badge-top {
        right: 50%;
        transform: translateX(50%);
        border-radius: 0 0 14px 14px;
      }
      .value-grid {
        grid-template-columns: 1fr;
        max-width: 460px;
        margin: 0 auto;
      }
      .templates-heading {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (max-width: 640px) {
      .home-page {
        padding-top: calc(76px + env(safe-area-inset-top, 0px));
        overflow-x: hidden;
      }
      .hero {
        gap: 18px;
        padding-top: 8px;
        padding-left: 12px;
        padding-right: 12px;
      }
      .badge-pill {
        margin-bottom: 10px;
        padding: 5px 12px;
      }
      .badge-pill .badge-text {
        font-size: 0.72rem;
      }
      .hero-title {
        font-size: clamp(1.55rem, 5.8vw, 1.85rem);
        line-height: 1.22;
        letter-spacing: -0.03em;
        margin-bottom: 12px;
      }
      .lead {
        font-size: 0.85rem;
        line-height: 1.55;
        margin: 0 auto 16px;
        max-width: 370px;
      }
      .hero-actions {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 310px;
        margin: 0 auto;
        gap: 9px;
      }
      .btn-primary, .btn-secondary {
        width: 100%;
        justify-content: center;
        padding: 12px 18px;
        font-size: 0.86rem;
        border-radius: 12px;
      }
      .trust-pills {
        margin-top: 14px;
        gap: 6px 10px;
        font-size: 0.72rem;
        justify-content: center;
      }
      .hero-preview {
        height: 380px;
        width: 100%;
        max-width: 370px;
        margin: 6px auto 0;
      }
      .preview-badge {
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.66rem;
        padding: 4px 11px;
        white-space: nowrap;
      }
      .hero-frame {
        width: min(240px, 64vw);
        height: auto;
        aspect-ratio: 210 / 297;
        transform: rotate(1.2deg);
        border-radius: 14px;
      }
      .floating-stat-card {
        right: 4px;
        top: 28px;
        padding: 6px 10px;
        gap: 6px;
        border-radius: 12px;
      }
      .floating-stat-card .stat-icon-wrapper {
        width: 24px;
        height: 24px;
        border-radius: 8px;
      }
      .floating-stat-card .stat-icon-wrapper lucide-icon {
        width: 12px;
        height: 12px;
      }
      .ready-card {
        left: 4px;
        bottom: 24px;
        padding: 6px 10px;
        gap: 6px;
        border-radius: 12px;
      }
      .ready-card .check-circle {
        width: 24px;
        height: 24px;
      }
      .ready-card .check-circle lucide-icon {
        width: 12px;
        height: 12px;
      }
      .ready-card b {
        font-size: 0.7rem;
      }
      .ready-card small {
        font-size: 0.58rem;
      }
      .ticker-strip {
        padding: 0 14px 36px;
      }
      .ticker-inner {
        padding: 16px 10px;
        gap: 12px;
        border-radius: 16px;
      }
      .ticker-divider {
        display: none;
      }
      .ticker-stat {
        width: 44%;
        text-align: center;
      }
      .stat-num {
        font-size: 1.35rem;
      }
      .stat-label {
        font-size: 0.72rem;
      }
      .pricing-section {
        padding: 24px 14px 44px;
      }
      .pricing-grid {
        grid-template-columns: 1fr;
        max-width: 100%;
        gap: 18px;
        margin: 0 auto 20px;
      }
      .pricing-card {
        padding: 22px 16px 20px;
        border-radius: 20px;
      }
      .plan-name {
        font-size: 1.2rem;
      }
      .plan-desc {
        min-height: auto;
        margin-bottom: 14px;
      }
      .price-tag .amount {
        font-size: 2.5rem;
      }
      .bundle-card {
        padding: 24px 16px 20px;
        border-radius: 22px;
      }
      .bundle-title {
        font-size: 1.4rem;
      }
      .bundle-desc {
        font-size: 0.82rem;
        margin-bottom: 16px;
      }
      .bundle-items-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .bundle-price-box {
        padding: 18px 14px;
        border-radius: 18px;
      }
      .bundle-main-price .num {
        font-size: 2.8rem;
      }
      .value-section {
        padding: 24px 14px 44px;
      }
      .value-grid {
        gap: 14px;
      }
      .benefit-card {
        padding: 18px 16px;
        border-radius: 16px;
      }
      .benefit-title {
        font-size: 0.95rem;
      }
      .benefit-text {
        font-size: 0.82rem;
      }
      .real-templates {
        padding: 20px 14px 40px;
      }
      .cover-letters-section {
        padding-bottom: 50px;
      }
      .templates-heading {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        margin-bottom: 16px;
      }
      .cta-inner {
        padding: 36px 16px;
        border-radius: 22px;
      }
      .cta-inner h2 {
        font-size: 1.55rem;
      }
      .cta-inner p {
        font-size: 0.85rem;
        margin-bottom: 22px;
      }
      .cta-btn-white,
      .cta-btn-glass {
        width: 100%;
        justify-content: center;
        padding: 12px 18px;
        font-size: 0.86rem;
      }
      .template-slider-track {
        gap: 14px;
        padding-bottom: 14px;
      }
      .template-slide-card {
        flex: 0 0 235px;
        width: 235px;
        padding: 10px;
        border-radius: 16px;
      }
    }
  `],
})
export class HomeComponent {
  readonly demo = DEMO_CV;
  readonly pricingService = inject(PricingService);
  readonly i18n = inject(TranslationService);
  get pricing() { return this.pricingService.pricing; }

  readonly ArrowRight = ArrowRight;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Send = Send;
  readonly Check = Check;
  readonly Sparkles = Sparkles;
  readonly Star = Star;
  readonly FileText = FileText;
  readonly Camera = Camera;
  readonly ShieldCheck = ShieldCheck;
  readonly ArrowUpRight = ArrowUpRight;
  readonly Zap = Zap;
  readonly Download = Download;

  readonly benefits = [
    {
      icon: '✦',
      title: 'Pixel-Perfect Real A4 Layouts',
      text: 'What you see is exactly what you get. Engineered specifically to print on standard A4 paper without awkward breaks or misalignment.'
    },
    {
      icon: '⚡',
      title: 'Instant NBC Bakong KHQR Payment',
      text: 'Scan with ABA Mobile, ACLEDA, Wing, or Bakong to instantly unlock and remove watermarks within seconds.'
    },
    {
      icon: '💬',
      title: 'Direct Telegram Photo & Care Support',
      text: 'Need your photo retouched in a professional formal suit or custom design tweaks? Connect directly with our team on Telegram.'
    }
  ];

  readonly localizedBenefits = computed(() => [
    {
      icon: '✦',
      title: this.i18n.t('benefit1Title'),
      text: this.i18n.t('benefit1Text')
    },
    {
      icon: '⚡',
      title: this.i18n.t('benefit3Title'),
      text: this.i18n.t('benefit3Text')
    },
    {
      icon: '💬',
      title: this.i18n.t('benefitSupportTitle'),
      text: this.i18n.t('benefitSupportText')
    }
  ]);

  constructor(private auth: AuthService) {}

  scrollSlider(sliderId: string, direction: 'left' | 'right') {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    const scrollStep = Math.max(slider.clientWidth * 0.75, 300);
    slider.scrollBy({
      left: direction === 'left' ? -scrollStep : scrollStep,
      behavior: 'smooth'
    });
  }

  greeting() {
    const user = this.auth.currentUser();
    return user ? `Good to see you, ${user.fullName.split(' ')[0]}.` : 'Welcome to CQ Professional';
  }
}
