import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { 
  LucideAngularModule, 
  Trash2, 
  Pencil, 
  Eye, 
  Download, 
  Search, 
  Plus, 
  Sparkles, 
  Lock, 
  Unlock, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowUpRight, 
  X, 
  Layers, 
  AlertCircle 
} from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { PptxExportService } from '../../shared/services/pptx-export.service';
import { WatermarkComponent } from '../../shared/components/watermark/watermark.component';
import { KhqrPaymentModalComponent } from '../../shared/components/khqr-payment-modal/khqr-payment-modal.component';
import { ToastService } from '../../shared/components/toast/toast.service';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';
import { ModernSplitCvComponent } from '../../shared/components/modern-split-cv/modern-split-cv.component';
import { CleanSidebarCvComponent } from '../../shared/components/clean-sidebar-cv/clean-sidebar-cv.component';
import { ElegantFrameCvComponent } from '../../shared/components/elegant-frame-cv/elegant-frame-cv.component';
import { ClassicDarkCvComponent } from '../../shared/components/classic-dark-cv/classic-dark-cv.component';
import { FormalClassicCvComponent } from '../../shared/components/formal-classic-cv/formal-classic-cv.component';
import { CoverLetterCvComponent } from '../../shared/components/cover-letter-cv/cover-letter-cv.component';
import { FramedCoverLetterCvComponent } from '../../shared/components/framed-cover-letter-cv/framed-cover-letter-cv.component';
import { SidebarCoverLetterCvComponent } from '../../shared/components/sidebar-cover-letter-cv/sidebar-cover-letter-cv.component';
import { MinimalistCoverLetterCvComponent } from '../../shared/components/minimalist-cover-letter-cv/minimalist-cover-letter-cv.component';
import { WarmTaupeTimelineCvComponent } from '../../shared/components/warm-taupe-timeline-cv/warm-taupe-timeline-cv.component';
import { SlateRoundedPanelsCvComponent } from '../../shared/components/slate-rounded-panels-cv/slate-rounded-panels-cv.component';
import { NavySidebarProfileCvComponent } from '../../shared/components/navy-sidebar-profile-cv/navy-sidebar-profile-cv.component';
import { NavyBadgeCvComponent } from '../../shared/components/navy-badge-cv/navy-badge-cv.component';
import { GraphiteBannerTimelineCvComponent } from '../../shared/components/graphite-banner-timeline-cv/graphite-banner-timeline-cv.component';
import { MinimalistFramedCvComponent } from '../../shared/components/minimalist-framed-cv/minimalist-framed-cv.component';
import { A4FitDirective } from '../../shared/directives/a4-fit.directive';

interface SavedCv {
  id: string;
  template_id?: number | string;
  title: string;
  template_name: string;
  thumbnail_url: string;
  updated_at: string;
  content?: any;
  selected_color?: string;
  is_paid?: number;
}

@Component({
  selector: 'app-my-cv-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProfessionalCvComponent,
    ModernSplitCvComponent,
    CleanSidebarCvComponent,
    ElegantFrameCvComponent,
    ClassicDarkCvComponent,
    FormalClassicCvComponent,
    CoverLetterCvComponent,
    FramedCoverLetterCvComponent,
    SidebarCoverLetterCvComponent,
    MinimalistCoverLetterCvComponent,
    NavyBadgeCvComponent,
    WarmTaupeTimelineCvComponent,
    SlateRoundedPanelsCvComponent,
    NavySidebarProfileCvComponent,
    GraphiteBannerTimelineCvComponent,
    MinimalistFramedCvComponent,
    A4FitDirective,
    LucideAngularModule,
    WatermarkComponent,
    KhqrPaymentModalComponent
  ],
  template: `
    <section class="cv-library-container">
      <!-- Ambient Background Glows -->
      <div class="glow glow-one" aria-hidden="true"></div>
      <div class="glow glow-two" aria-hidden="true"></div>
      <div class="glow glow-three" aria-hidden="true"></div>

      <!-- Header Section -->
      <header class="library-header">
        <div class="header-content">
          <div class="badge-pill">
            <span class="pulse-dot"></span>
            <lucide-icon [img]="Sparkles" class="badge-sparkle" />
            <span>{{ i18n.t('myCvBadge') }}</span>
          </div>
          <h1 class="library-title">{{ i18n.t('myCvTitlePrefix') }} <span class="gradient-text">{{ i18n.t('myCvTitleHighlight') }}</span></h1>
          <p class="library-subtitle">{{ i18n.t('myCvSubtitle') }}</p>
        </div>

        <div class="header-actions">
          <a routerLink="/templates" class="btn-new-cv">
            <lucide-icon [img]="Plus" class="w-4 h-4 mr-1.5 inline" />
            <span>{{ i18n.t('myCvCreateNew') }}</span>
          </a>
        </div>
      </header>

      <!-- Stats Summary Strip (Shown when documents exist) -->
      @if (cvs().length > 0) {
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon-wrap bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <lucide-icon [img]="FileText" class="w-5 h-5" />
            </div>
            <div>
              <span class="stat-label">{{ i18n.t('myCvTotalDocs') }}</span>
              <div class="stat-val">{{ cvs().length }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrap bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <lucide-icon [img]="Unlock" class="w-5 h-5" />
            </div>
            <div>
              <span class="stat-label">{{ i18n.t('myCvUnlockedExport') }}</span>
              <div class="stat-val text-emerald-600 dark:text-emerald-400">{{ unlockedCount() }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrap bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <lucide-icon [img]="Pencil" class="w-5 h-5" />
            </div>
            <div>
              <span class="stat-label">{{ i18n.t('myCvDraftsProgress') }}</span>
              <div class="stat-val text-amber-600 dark:text-amber-400">{{ draftCount() }}</div>
            </div>
          </div>
        </div>
      }

      <!-- Filter & Search Toolbar -->
      <div class="library-toolbar">
        <label class="search-box">
          <lucide-icon [img]="Search" class="search-icon" />
          <input 
            type="text" 
            class="search-input"
            [placeholder]="i18n.t('myCvSearchPlaceholder')" 
            [value]="searchQuery()" 
            (input)="searchQuery.set($any($event.target).value)" 
          />
          @if (searchQuery()) {
            <button type="button" class="clear-btn" (click)="searchQuery.set('')" title="Clear search">
              <lucide-icon [img]="X" class="w-3.5 h-3.5" />
            </button>
          }
        </label>

        <div class="filter-pills-row">
          <button 
            type="button" 
            class="filter-pill"
            [class.active]="statusFilter() === 'all'"
            (click)="statusFilter.set('all')"
          >
            <span>{{ i18n.t('myCvAllDocs') }}</span>
            <span class="pill-count">{{ cvs().length }}</span>
          </button>

          <button 
            type="button" 
            class="filter-pill"
            [class.active]="statusFilter() === 'unlocked'"
            (click)="statusFilter.set('unlocked')"
          >
            <span class="pill-dot bg-emerald-500"></span>
            <span>{{ i18n.t('myCvUnlocked') }}</span>
            <span class="pill-count">{{ unlockedCount() }}</span>
          </button>

          <button 
            type="button" 
            class="filter-pill"
            [class.active]="statusFilter() === 'draft'"
            (click)="statusFilter.set('draft')"
          >
            <span class="pill-dot bg-amber-500"></span>
            <span>{{ i18n.t('myCvDraft') }}</span>
            <span class="pill-count">{{ draftCount() }}</span>
          </button>
        </div>
      </div>

      <!-- Empty State: No Saved CVs at all -->
      @if (cvs().length === 0) {
        <div class="empty-state-card">
          <div class="empty-icon-halo">
            <lucide-icon [img]="FileText" class="w-10 h-10 text-indigo-500" />
          </div>
          <h3 class="empty-title">{{ i18n.t('myCvEmptyTitle') }}</h3>
          <p class="empty-desc">
            {{ i18n.t('myCvEmptyDesc') }}
          </p>
          <a routerLink="/templates" class="btn-empty-action">
            <lucide-icon [img]="Sparkles" class="w-4 h-4 mr-2" />
            <span>{{ i18n.t('myCvEmptyBtn') }}</span>
            <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-2" />
          </a>
        </div>
      }

      <!-- Empty State: Filter Search yielded 0 results -->
      @if (cvs().length > 0 && filteredCvs().length === 0) {
        <div class="empty-state-card">
          <div class="empty-icon-halo">
            <lucide-icon [img]="Search" class="w-10 h-10 text-slate-400" />
          </div>
          <h3 class="empty-title">{{ i18n.t('myCvNoMatchesTitle') }}</h3>
          <p class="empty-desc">
            {{ i18n.t('myCvNoMatchesDesc') }}
          </p>
          <button type="button" class="btn-empty-action" (click)="resetFilters()">
            <lucide-icon [img]="X" class="w-4 h-4 mr-2" />
            <span>{{ i18n.t('myCvResetFilters') }}</span>
          </button>
        </div>
      }

      <!-- Documents Grid -->
      <div class="cv-grid">
        @for (cv of filteredCvs(); track cv.id) {
          <article class="cv-card-item">
            <!-- Full A4 Frame -->
            <div 
              appA4Fit 
              class="cv-card-frame" 
              [attr.id]="'cv-card-' + cv.id"
              (click)="onCardClick(cv)"
              role="button"
              tabindex="0"
              (keydown.enter)="onCardClick(cv)"
              [attr.aria-label]="'Open ' + cv.title"
            >
              <!-- Floating Left Category Badge -->
              <div class="badge-tag-left">
                <span>{{ isCoverLetter(cv) ? i18n.t('myCvBadgeCl') : i18n.t('myCvBadgeCv') }}</span>
              </div>

              <!-- Floating Right Lock/Unlocked Status Badge -->
              @if (isCvUnlocked(cv)) {
                <div class="badge-status-right status-unlocked">
                  <lucide-icon [img]="Unlock" class="w-3 h-3" />
                  <span>{{ i18n.t('myCvUnlocked') }}</span>
                </div>
              } @else {
                <div class="badge-status-right status-locked">
                  <lucide-icon [img]="Lock" class="w-3 h-3" />
                  <span>{{ i18n.t('myCvDraft') }}</span>
                </div>
              }

              <!-- Scaled A4 Content -->
              <div class="cv-thumb pointer-events-none" aria-hidden="true">
                @if (layoutOf(cv) === 'modern-split') {
                  <app-modern-split-cv
                    [accent]="cv.selected_color || '#1b3a5c'"
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)"
                    [experience]="asArray(contentOf(cv).experience)"
                    [skills]="asArray(contentOf(cv).skills)"
                    [languages]="asArray(contentOf(cv).languages)"
                    [references]="asArray(contentOf(cv).references)"
                    [hobbies]="asArray(contentOf(cv).hobbies)"
                  />
                } @else if (layoutOf(cv) === 'clean-sidebar') {
                  <app-clean-sidebar-cv
                    [accent]="cv.selected_color || '#5a6a7a'"
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)"
                    [experience]="asArray(contentOf(cv).experience)"
                    [skills]="asArray(contentOf(cv).skills)"
                    [languages]="asArray(contentOf(cv).languages)"
                    [references]="asArray(contentOf(cv).references)"
                  />
                } @else if (layoutOf(cv) === 'elegant-frame') {
                  <app-elegant-frame-cv
                    [accent]="cv.selected_color || '#2c3e50'"
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [linkedin]="contentOf(cv).linkedin || ''"
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)"
                    [experience]="asArray(contentOf(cv).experience)"
                    [skills]="asArray(contentOf(cv).skills)"
                    [languages]="asArray(contentOf(cv).languages)"
                    [certifications]="asArray(contentOf(cv).certifications)"
                    [hobbies]="asArray(contentOf(cv).hobbies)"
                    [references]="asArray(contentOf(cv).references)"
                  />
                } @else if (layoutOf(cv) === 'graphite-banner-timeline') {
                  <app-graphite-banner-timeline-cv
                    [accent]="contentOf(cv).accent || cv.selected_color || '#323E4D'" 
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title" 
                    [jobTitle]="contentOf(cv).jobTitle || ''" 
                    [email]="contentOf(cv).email || ''" 
                    [phone]="contentOf(cv).phone || ''" 
                    [location]="contentOf(cv).location || ''" 
                    [linkedin]="contentOf(cv).linkedin || ''" 
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)" 
                    [experience]="asArray(contentOf(cv).experience)" 
                    [skills]="asArray(contentOf(cv).skills)" 
                    [languages]="asArray(contentOf(cv).languages)" 
                    [certifications]="asArray(contentOf(cv).certifications)" 
                    [projects]="asArray(contentOf(cv).projects)" 
                    [references]="asArray(contentOf(cv).references)" 
                    [hobbies]="asArray(contentOf(cv).hobbies)"
                  />
                } @else if (layoutOf(cv) === 'navy-sidebar-profile') {
                  <app-navy-sidebar-profile-cv
                    [accent]="contentOf(cv).accent || cv.selected_color || '#1E3A52'" 
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title" 
                    [jobTitle]="contentOf(cv).jobTitle || ''" 
                    [email]="contentOf(cv).email || ''" 
                    [phone]="contentOf(cv).phone || ''" 
                    [location]="contentOf(cv).location || ''" 
                    [linkedin]="contentOf(cv).linkedin || ''" 
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)" 
                    [experience]="asArray(contentOf(cv).experience)" 
                    [skills]="asArray(contentOf(cv).skills)" 
                    [languages]="asArray(contentOf(cv).languages)" 
                    [certifications]="asArray(contentOf(cv).certifications)" 
                    [projects]="asArray(contentOf(cv).projects)" 
                    [references]="asArray(contentOf(cv).references)" 
                    [hobbies]="asArray(contentOf(cv).hobbies)"
                  />
                } @else if (layoutOf(cv) === 'navy-badge') {
                  <app-navy-badge-cv
                    [accent]="cv.selected_color || '#1B2838'" 
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title" 
                    [jobTitle]="contentOf(cv).jobTitle || ''" 
                    [email]="contentOf(cv).email || ''" 
                    [phone]="contentOf(cv).phone || ''" 
                    [location]="contentOf(cv).location || ''" 
                    [linkedin]="contentOf(cv).linkedin || ''" 
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)" 
                    [experience]="asArray(contentOf(cv).experience)" 
                    [skills]="asArray(contentOf(cv).skills)" 
                    [languages]="asArray(contentOf(cv).languages)" 
                    [certifications]="asArray(contentOf(cv).certifications)" 
                    [projects]="asArray(contentOf(cv).projects)" 
                    [references]="asArray(contentOf(cv).references)" 
                    [hobbies]="asArray(contentOf(cv).hobbies)"
                    [fontSize]="contentOf(cv).typography?.fontSize || 9" 
                    [fontWeight]="contentOf(cv).typography?.fontWeight || 400" 
                    [lineHeight]="contentOf(cv).typography?.lineHeight || 1.4" 
                    [fontFamily]="contentOf(cv).typography?.fontFamily || undefined"
                    [sectionLabels]="contentOf(cv).sectionLabels || {}" 
                    [sectionOrder]="contentOf(cv).sectionOrder || []"
                  />
                } @else if (layoutOf(cv) === 'slate-rounded-panels') {
                  <app-slate-rounded-panels-cv
                    [accent]="contentOf(cv).accent || cv.selected_color || '#364152'" 
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title" 
                    [jobTitle]="contentOf(cv).jobTitle || ''" 
                    [email]="contentOf(cv).email || ''" 
                    [phone]="contentOf(cv).phone || ''" 
                    [location]="contentOf(cv).location || ''" 
                    [linkedin]="contentOf(cv).linkedin || ''" 
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)" 
                    [experience]="asArray(contentOf(cv).experience)" 
                    [skills]="asArray(contentOf(cv).skills)" 
                    [languages]="asArray(contentOf(cv).languages)" 
                    [certifications]="asArray(contentOf(cv).certifications)" 
                    [projects]="asArray(contentOf(cv).projects)" 
                    [references]="asArray(contentOf(cv).references)" 
                    [hobbies]="asArray(contentOf(cv).hobbies)"
                  />
                } @else if (layoutOf(cv) === 'warm-taupe-timeline') {
                  <app-warm-taupe-timeline-cv
                    [accent]="contentOf(cv).accent || cv.selected_color || '#A87C64'" 
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title" 
                    [jobTitle]="contentOf(cv).jobTitle || ''" 
                    [email]="contentOf(cv).email || ''" 
                    [phone]="contentOf(cv).phone || ''" 
                    [location]="contentOf(cv).location || ''" 
                    [linkedin]="contentOf(cv).linkedin || ''" 
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)" 
                    [experience]="asArray(contentOf(cv).experience)" 
                    [skills]="asArray(contentOf(cv).skills)" 
                    [languages]="asArray(contentOf(cv).languages)" 
                    [certifications]="asArray(contentOf(cv).certifications)" 
                    [projects]="asArray(contentOf(cv).projects)" 
                    [references]="asArray(contentOf(cv).references)" 
                    [hobbies]="asArray(contentOf(cv).hobbies)"
                    [fontSize]="contentOf(cv).typography?.fontSize || 10" 
                    [fontWeight]="contentOf(cv).typography?.fontWeight || 400" 
                    [lineHeight]="contentOf(cv).typography?.lineHeight || 1.42" 
                    [fontFamily]="contentOf(cv).typography?.fontFamily || undefined"
                  />
                } @else if (layoutOf(cv) === 'classic-dark') {
                  <app-classic-dark-cv
                    [accent]="cv.selected_color || '#2c3e50'"
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [linkedin]="contentOf(cv).linkedin || ''"
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)"
                    [experience]="asArray(contentOf(cv).experience)"
                    [skills]="asArray(contentOf(cv).skills)"
                    [languages]="asArray(contentOf(cv).languages)"
                    [references]="asArray(contentOf(cv).references)"
                    [hobbies]="asArray(contentOf(cv).hobbies)"
                    [certifications]="asArray(contentOf(cv).certifications)"
                  />
                } @else if (layoutOf(cv) === 'formal-classic') {
                  <app-formal-classic-cv
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [linkedin]="contentOf(cv).linkedin || ''"
                    [summary]="contentOf(cv).summary || ''"
                    [experience]="asArray(contentOf(cv).experience)"
                    [education]="asArray(contentOf(cv).education)"
                    [skills]="asArray(contentOf(cv).skills)"
                    [languages]="asArray(contentOf(cv).languages)"
                    [references]="asArray(contentOf(cv).references)"
                    [projects]="asArray(contentOf(cv).projects)"
                  />
                } @else if (layoutOf(cv) === 'minimalist-framed') {
                  <app-minimalist-framed-cv
                    [accent]="contentOf(cv).accent || cv.selected_color || '#2C3E50'"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [email]="contentOf(cv).email || ''"
                    [location]="contentOf(cv).location || ''"
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)"
                    [experience]="asArray(contentOf(cv).experience)"
                    [skills]="asArray(contentOf(cv).skills)"
                    [languages]="asArray(contentOf(cv).languages)"
                    [certifications]="asArray(contentOf(cv).certifications)"
                    [projects]="asArray(contentOf(cv).projects)"
                    [references]="asArray(contentOf(cv).references)"
                    [hobbies]="asArray(contentOf(cv).hobbies)"
                  />
                } @else if (layoutOf(cv) === 'framed-cover-letter') {
                  <app-framed-cover-letter-cv
                    [accent]="contentOf(cv).accent || cv.selected_color || '#1a2b5a'"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [recipientName]="contentOf(cv).recipientName || ''"
                    [recipientDept]="contentOf(cv).recipientDept || ''"
                    [greeting]="contentOf(cv).greeting || ''"
                    [closing]="contentOf(cv).closing || ''"
                    [subject]="contentOf(cv).subject || ''"
                    [bodyText]="contentOf(cv).summary || ''"
                    [fontSize]="contentOf(cv).typography?.fontSize || 9"
                    [fontWeight]="contentOf(cv).typography?.fontWeight || 400"
                    [lineHeight]="contentOf(cv).typography?.lineHeight || 1.5"
                    [fontFamily]="contentOf(cv).typography?.fontFamily || undefined"
                  />
                } @else if (layoutOf(cv) === 'sidebar-cover-letter') {
                  <app-sidebar-cover-letter-cv
                    [accent]="contentOf(cv).accent || cv.selected_color || '#163E63'"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [recipientName]="contentOf(cv).recipientName || ''"
                    [recipientDept]="contentOf(cv).recipientDept || ''"
                    [greeting]="contentOf(cv).greeting || ''"
                    [closing]="contentOf(cv).closing || ''"
                    [subject]="contentOf(cv).subject || ''"
                    [bodyText]="contentOf(cv).summary || ''"
                  />
                } @else if (layoutOf(cv) === 'minimalist-cover-letter') {
                  <app-minimalist-cover-letter-cv
                    [accent]="contentOf(cv).accent || cv.selected_color || '#C59B58'"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [recipientName]="contentOf(cv).recipientName || ''"
                    [recipientDept]="contentOf(cv).recipientDept || ''"
                    [greeting]="contentOf(cv).greeting || ''"
                    [closing]="contentOf(cv).closing || ''"
                    [subject]="contentOf(cv).subject || ''"
                    [bodyText]="contentOf(cv).summary || ''"
                    [fontSize]="contentOf(cv).typography?.fontSize || 9"
                    [fontWeight]="contentOf(cv).typography?.fontWeight || 400"
                    [lineHeight]="contentOf(cv).typography?.lineHeight || 1.5"
                    [fontFamily]="contentOf(cv).typography?.fontFamily || undefined"
                  />
                } @else if (layoutOf(cv) === 'cover-letter') {
                  <app-cover-letter-cv
                    [accent]="contentOf(cv).accent || cv.selected_color || '#1a5276'"
                    [name]="contentOf(cv).fullName || cv.title"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [recipientDept]="contentOf(cv).recipientDept || ''"
                    [greeting]="contentOf(cv).greeting || ''"
                    [closing]="contentOf(cv).closing || ''"
                    [subject]="contentOf(cv).subject || ''"
                    [bodyText]="contentOf(cv).summary || ''"
                    [fontSize]="contentOf(cv).typography?.fontSize || 9"
                    [fontWeight]="contentOf(cv).typography?.fontWeight || 400"
                    [lineHeight]="contentOf(cv).typography?.lineHeight || 1.5"
                    [fontFamily]="contentOf(cv).typography?.fontFamily || undefined"
                  />
                } @else {
                  <app-professional-cv
                    [accent]="cv.selected_color || '#667b97'"
                    [photoUrl]="contentOf(cv).photoUrl || null"
                    [name]="contentOf(cv).fullName || cv.title"
                    [jobTitle]="contentOf(cv).jobTitle || ''"
                    [email]="contentOf(cv).email || ''"
                    [phone]="contentOf(cv).phone || ''"
                    [location]="contentOf(cv).location || ''"
                    [linkedin]="contentOf(cv).linkedin || ''"
                    [summary]="contentOf(cv).summary || ''"
                    [education]="asArray(contentOf(cv).education)"
                    [experience]="asArray(contentOf(cv).experience)"
                    [skills]="asArray(contentOf(cv).skills)"
                    [languages]="asArray(contentOf(cv).languages)"
                    [certifications]="asArray(contentOf(cv).certifications)"
                    [projects]="asArray(contentOf(cv).projects)"
                  />
                }
              </div>

              <!-- Watermark Overlay if Draft / Unpaid -->
              @if (!isCvUnlocked(cv)) {
                <app-watermark text="CQ Professional" />
              }

              <!-- Glass Hover Overlay (Desktop) -->
              <div class="cv-card-overlay">
                @if (isCvUnlocked(cv)) {
                  @if (auth.isAdmin() || auth.isStaffOrAdmin()) {
                    <button 
                      type="button" 
                      class="overlay-btn btn-sky"
                      (click)="edit(cv); $event.stopPropagation()"
                      [title]="i18n.t('myCvBtnEdit')"
                    >
                      <lucide-icon [img]="Pencil" class="w-3.5 h-3.5" />
                      <span>{{ i18n.t('myCvBtnEdit') }}</span>
                    </button>
                  }
                  <button 
                    type="button" 
                    class="overlay-btn btn-indigo"
                    (click)="previewCv(cv); $event.stopPropagation()"
                    [title]="i18n.t('myCvBtnPreview')"
                  >
                    <lucide-icon [img]="Eye" class="w-3.5 h-3.5" />
                    <span>{{ i18n.t('myCvBtnPreview') }}</span>
                  </button>
                  <button 
                    type="button" 
                    class="overlay-btn btn-emerald"
                    (click)="openDownload(cv); $event.stopPropagation()"
                    [title]="i18n.t('myCvBtnDownload')"
                  >
                    <lucide-icon [img]="Download" class="w-3.5 h-3.5" />
                    <span>{{ i18n.t('myCvBtnDownload') }}</span>
                  </button>
                } @else {
                  <button 
                    type="button" 
                    class="overlay-btn btn-sky"
                    (click)="edit(cv); $event.stopPropagation()"
                    [title]="i18n.t('myCvBtnEditCv')"
                  >
                    <lucide-icon [img]="Pencil" class="w-3.5 h-3.5" />
                    <span>{{ i18n.t('myCvBtnEditCv') }}</span>
                  </button>
                  <button 
                    type="button" 
                    class="overlay-btn btn-emerald"
                    (click)="openDownload(cv); $event.stopPropagation()"
                    [title]="i18n.t('myCvBtnGetCv')"
                  >
                    <lucide-icon [img]="Download" class="w-3.5 h-3.5" />
                    <span>{{ i18n.t('myCvBtnDownload') }}</span>
                  </button>
                }

                <button 
                  type="button" 
                  class="overlay-btn btn-danger"
                  (click)="remove(cv, $event)"
                  [title]="i18n.t('myCvBtnDeleteTooltip')"
                >
                  <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Card Footer & Direct Mobile Actions -->
            <div class="card-footer-info">
              <div class="card-title-row">
                <h2 class="doc-title" [title]="cv.title">{{ cv.title }}</h2>
                <span class="doc-template-name">{{ cv.template_name }}</span>
              </div>

              <div class="card-action-bar">
                <div class="action-buttons-group">
                  @if (isCvUnlocked(cv)) {
                    <button type="button" class="footer-btn btn-secondary" (click)="previewCv(cv)">
                      <lucide-icon [img]="Eye" class="w-3.5 h-3.5 mr-1 inline" />
                      <span>{{ i18n.t('myCvBtnPreview') }}</span>
                    </button>
                    <button type="button" class="footer-btn btn-primary" (click)="openDownload(cv)">
                      <lucide-icon [img]="Download" class="w-3.5 h-3.5 mr-1 inline" />
                      <span>{{ i18n.t('myCvBtnDownload') }}</span>
                    </button>
                  } @else {
                    <button type="button" class="footer-btn btn-secondary" (click)="edit(cv)">
                      <lucide-icon [img]="Pencil" class="w-3.5 h-3.5 mr-1 inline" />
                      <span>{{ i18n.t('myCvBtnEdit') }}</span>
                    </button>
                    <button type="button" class="footer-btn btn-primary" (click)="openDownload(cv)">
                      <lucide-icon [img]="Download" class="w-3.5 h-3.5 mr-1 inline" />
                      <span>{{ i18n.t('myCvBtnGetCv') }}</span>
                    </button>
                  }
                </div>

                <button type="button" class="btn-delete-icon" (click)="remove(cv, $event)" [title]="i18n.t('myCvBtnDeleteTooltip')">
                  <lucide-icon [img]="Trash2" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>
        }
      </div>

      <!-- DOWNLOAD FORMAT CHOOSER MODAL (FOR UNLOCKED CVS) -->
      @if (downloadModalCv(); as activeCv) {
        <div 
          class="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in"
          (click)="downloadModalCv.set(null)"
        >
          <div 
            class="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 shadow-2xl p-6 border border-slate-200 dark:border-slate-800 animate-scale-up"
            (click)="$event.stopPropagation()"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <lucide-icon [img]="Download" class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-sm font-black text-slate-800 dark:text-white">{{ i18n.t('myCvExportTitle') }}</h3>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[190px]">{{ activeCv.title }}</p>
                </div>
              </div>
              <button 
                type="button" 
                class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                (click)="downloadModalCv.set(null)"
              >
                <lucide-icon [img]="X" class="w-4 h-4" />
              </button>
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">{{ i18n.t('myCvExportSubtitle') }}</p>

            <div class="grid grid-cols-3 gap-2.5 mb-5">
              <!-- PDF -->
              <button 
                type="button" 
                (click)="triggerExport('pdf', activeCv)"
                class="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span class="text-xs font-black text-slate-800 dark:text-slate-200">PDF</span>
                <span class="text-[9px] text-slate-400">{{ i18n.t('myCvHighQuality') }}</span>
              </button>

              <!-- PPTX -->
              <button 
                type="button" 
                (click)="triggerExport('pptx', activeCv)"
                class="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M7 12h10M12 7v10"/>
                </svg>
                <span class="text-xs font-black text-slate-800 dark:text-slate-200">PPTX</span>
                <span class="text-[9px] text-slate-400">PowerPoint</span>
              </button>

              <!-- DOCX -->
              <button 
                type="button" 
                (click)="triggerExport('docx', activeCv)"
                class="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                </svg>
                <span class="text-xs font-black text-slate-800 dark:text-slate-200">DOCX</span>
                <span class="text-[9px] text-slate-400">Word</span>
              </button>
            </div>

            <button 
              type="button" 
              (click)="downloadModalCv.set(null)"
              class="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition"
            >
              {{ i18n.t('myCvCancel') }}
            </button>
          </div>
        </div>
      }

      <!-- KHQR PAYMENT MODAL (FOR UNPAID DRAFTS) -->
      @if (paymentModalCv(); as pCv) {
        <app-khqr-payment-modal
          [userCvId]="pCv.id"
          [templateId]="pCv.template_id"
          [templateName]="pCv.template_name"
          (paymentSuccess)="onPaymentSuccess(pCv, $event)"
          (downloadFormat)="onModalDownloadFormat(pCv, $event)"
          (close)="paymentModalCv.set(null)"
        />
      }
    </section>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      background: linear-gradient(150deg, #f8faff 0%, #eef3ff 45%, #f4f8ff 100%);
      color: #1a233b;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    :host-context(.dark) {
      background: linear-gradient(145deg, #0d1527 0%, #111b32 50%, #111a2c 100%);
      color: #eef3fc;
    }

    /* Layout Container */
    .cv-library-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 110px 24px 80px;
      position: relative;
      min-height: 100vh;
      box-sizing: border-box;
    }

    /* Ambient background glows (matching home page) */
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
      top: 1400px;
      background: rgba(168, 85, 247, 0.14);
    }

    .library-header, .stats-strip, .library-toolbar, .cv-grid, .empty-state-card {
      position: relative;
      z-index: 1;
    }

    /* Header */
    .library-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 28px;
    }
    .header-content {
      max-width: 720px;
    }
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid #e0e7ff;
      color: #4f46e5;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
      backdrop-filter: blur(8px);
      margin-bottom: 12px;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
    }
    .badge-sparkle {
      width: 14px;
      height: 14px;
      color: #818cf8;
    }
    .library-title {
      font-size: clamp(2.2rem, 3.8vw, 3.2rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #0f172a;
      line-height: 1.15;
      margin: 0 0 10px;
    }
    .gradient-text {
      background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .library-subtitle {
      font-size: 0.98rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    .btn-new-cv {
      display: inline-flex;
      align-items: center;
      padding: 12px 22px;
      border-radius: 14px;
      background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%);
      color: #ffffff;
      text-decoration: none;
      font-size: 0.86rem;
      font-weight: 800;
      box-shadow: 0 8px 20px rgba(2, 132, 199, 0.3);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .btn-new-cv:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(2, 132, 199, 0.4);
    }

    /* Stats Strip */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
      backdrop-filter: blur(10px);
    }
    .stat-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 2px;
    }
    .stat-val {
      font-size: 1.4rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }

    /* Toolbar */
    .library-toolbar {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(14px);
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 14px 20px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1 1 280px;
      position: relative;
      display: flex;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 9999px;
      padding: 8px 14px 8px 38px;
      transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .search-box:focus-within {
      background: #ffffff;
      border-color: #0284c7;
      box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.18), 0 8px 20px -4px rgba(2, 132, 199, 0.12);
      transform: scale(1.015);
    }
    .search-box:focus-within .search-icon {
      animation: searchSpin 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      color: #0284c7;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      width: 16px;
      height: 16px;
      color: #94a3b8;
      pointer-events: none;
      transition: color 0.25s ease;
    }
    .search-input {
      width: 100%;
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.86rem;
      color: #0f172a;
    }
    .search-input::placeholder {
      color: #94a3b8;
    }
    .clear-btn {
      background: transparent;
      border: none;
      padding: 3px;
      color: #94a3b8;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .clear-btn:hover {
      color: #0f172a;
      background: #e2e8f0;
    }

    .filter-pills-row {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .filter-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      font-size: 0.78rem;
      font-weight: 700;
      color: #475569;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .filter-pill:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .filter-pill.active {
      background: #0284c7;
      border-color: #0284c7;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
    }
    .pill-count {
      font-size: 0.68rem;
      padding: 2px 6px;
      border-radius: 9999px;
      background: rgba(0, 0, 0, 0.08);
      font-weight: 800;
    }
    .filter-pill.active .pill-count {
      background: rgba(255, 255, 255, 0.25);
      color: #ffffff;
    }
    .pill-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    /* Documents Grid */
    .cv-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 28px;
    }

    .cv-card-item {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 22px;
      padding: 13px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .cv-card-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 42px -8px rgba(15, 23, 42, 0.15);
      border-color: #cbd5e1;
    }

    /* Fixed A4 Frame */
    .cv-card-frame {
      position: relative;
      width: 100%;
      aspect-ratio: 210 / 297;
      overflow: hidden;
      border-radius: 14px;
      border: 1px solid #edf2f7;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      cursor: pointer;
      container-type: size;
    }

    .badge-tag-left {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 25;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(6px);
      color: #ffffff;
      border-radius: 9999px;
      padding: 4px 10px;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .badge-status-right {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 25;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 9px;
      border-radius: 9999px;
      font-size: 0.72rem;
      font-weight: 800;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    .status-unlocked {
      background: #059669;
      color: #ffffff;
    }
    .status-locked {
      background: rgba(15, 23, 42, 0.88);
      color: #fbbf24;
      border: 1px solid rgba(251, 191, 36, 0.3);
    }

    .cv-thumb {
      position: absolute;
      top: 0;
      left: 0;
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      transform-origin: top left;
      transform: scale(var(--a4-scale, 0.28));
    }

    /* Glass Hover Overlay */
    .cv-card-overlay {
      position: absolute;
      inset: 0;
      z-index: 30;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(3px);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      opacity: 0;
      transition: opacity 0.22s ease;
      pointer-events: none;
    }
    .cv-card-item:hover .cv-card-overlay,
    .cv-card-frame:focus-visible .cv-card-overlay {
      opacity: 1;
      pointer-events: auto;
    }

    .overlay-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 800;
      border: none;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
      transition: all 0.2s ease;
    }
    .overlay-btn:hover {
      transform: translateY(-2px);
    }
    .btn-sky {
      background: #0284c7;
      color: #ffffff;
    }
    .btn-sky:hover {
      background: #0369a1;
    }
    .btn-indigo {
      background: #4f46e5;
      color: #ffffff;
    }
    .btn-indigo:hover {
      background: #4338ca;
    }
    .btn-emerald {
      background: #059669;
      color: #ffffff;
    }
    .btn-emerald:hover {
      background: #047857;
    }
    .btn-danger {
      background: #ef4444;
      color: #ffffff;
      padding: 8px 10px;
    }
    .btn-danger:hover {
      background: #dc2626;
    }

    /* Card Footer Info */
    .card-footer-info {
      padding: 12px 4px 2px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .card-title-row {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .doc-title {
      font-size: 0.96rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .doc-template-name {
      font-size: 0.76rem;
      color: #64748b;
      font-weight: 600;
    }

    .card-action-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .action-buttons-group {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
    }
    .footer-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 12px;
      border-radius: 10px;
      font-size: 0.76rem;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .btn-primary {
      background: #0284c7;
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.2);
    }
    .btn-primary:hover {
      background: #0369a1;
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border-color: #e2e8f0;
    }
    .btn-secondary:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .btn-delete-icon {
      padding: 6px;
      border-radius: 10px;
      background: transparent;
      border: 1px solid #fee2e2;
      color: #ef4444;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-delete-icon:hover {
      background: #fee2e2;
      color: #b91c1c;
      transform: scale(1.08);
    }

    /* Empty States */
    .empty-state-card {
      text-align: center;
      padding: 70px 24px;
      background: rgba(255, 255, 255, 0.85);
      border: 1px dashed #cbd5e1;
      border-radius: 28px;
      margin: 24px 0 40px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
    }
    .empty-icon-halo {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #eff6ff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
    }
    .empty-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 8px;
    }
    .empty-desc {
      font-size: 0.94rem;
      color: #64748b;
      max-width: 480px;
      margin: 0 auto 24px;
      line-height: 1.6;
    }
    .btn-empty-action {
      display: inline-flex;
      align-items: center;
      padding: 12px 26px;
      border-radius: 9999px;
      background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%);
      color: #ffffff;
      font-size: 0.88rem;
      font-weight: 800;
      text-decoration: none;
      border: none;
      cursor: pointer;
      box-shadow: 0 8px 22px rgba(2, 132, 199, 0.3);
      transition: all 0.2s ease;
    }
    .btn-empty-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(2, 132, 199, 0.4);
    }

    /* Modal Animation */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
    .animate-scale-up { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    /* Dark Mode */
    :host-context(.dark) .glow-one { background: #4d3f9866; }
    :host-context(.dark) .glow-two { background: #1d5b8d55; }
    :host-context(.dark) .glow-three { background: #5d388f44; }
    :host-context(.dark) .library-title { color: #f8fafc; }
    :host-context(.dark) .library-subtitle { color: #94a3b8; }
    :host-context(.dark) .badge-pill {
      background: rgba(30, 41, 59, 0.8);
      border-color: #334155;
      color: #818cf8;
    }
    :host-context(.dark) .stat-card {
      background: rgba(30, 41, 59, 0.85);
      border-color: #334155;
    }
    :host-context(.dark) .stat-label { color: #94a3b8; }
    :host-context(.dark) .stat-val { color: #f8fafc; }
    :host-context(.dark) .library-toolbar {
      background: rgba(30, 41, 59, 0.85);
      border-color: #334155;
    }
    :host-context(.dark) .search-box {
      background: #0f172a;
      border-color: #334155;
    }
    :host-context(.dark) .search-input { color: #f8fafc; }
    :host-context(.dark) .filter-pill {
      background: #0f172a;
      border-color: #334155;
      color: #94a3b8;
    }
    :host-context(.dark) .filter-pill:hover { background: #1e293b; color: #f8fafc; }
    :host-context(.dark) .filter-pill.active {
      background: #0284c7;
      border-color: #0284c7;
      color: #ffffff;
    }
    :host-context(.dark) .cv-card-item {
      background: #1e293b;
      border-color: #334155;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    :host-context(.dark) .cv-card-frame {
      border-color: #334155;
      background: #0f172a;
    }
    :host-context(.dark) .doc-title { color: #f8fafc; }
    :host-context(.dark) .doc-template-name { color: #94a3b8; }
    :host-context(.dark) .btn-secondary {
      background: #0f172a;
      color: #cbd5e1;
      border-color: #334155;
    }
    :host-context(.dark) .btn-secondary:hover {
      background: #1e293b;
      color: #f8fafc;
    }
    :host-context(.dark) .btn-delete-icon {
      border-color: #7f1d1d;
      color: #f87171;
    }
    :host-context(.dark) .btn-delete-icon:hover {
      background: #7f1d1d;
      color: #fecaca;
    }
    :host-context(.dark) .empty-state-card {
      background: #1e293b;
      border-color: #334155;
    }
    :host-context(.dark) .empty-icon-halo { background: #0f172a; }
    :host-context(.dark) .empty-title { color: #f8fafc; }
    :host-context(.dark) .empty-desc { color: #94a3b8; }

    /* Responsive Queries */
    @media (max-width: 960px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
      .stat-card {
        padding: 12px 14px;
        gap: 10px;
      }
      .stat-val {
        font-size: 1.2rem;
      }
    }

    @media (max-width: 768px) {
      .cv-library-container {
        padding: 96px 16px 60px;
      }
      .library-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 18px;
        margin-bottom: 22px;
      }
      .header-actions {
        width: 100%;
      }
      .btn-new-cv {
        width: 100%;
        justify-content: center;
      }
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      .library-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      .search-box {
        flex: 1 1 auto;
        width: 100%;
      }
      .filter-pills-row {
        justify-content: flex-start;
      }
    }

    @media (max-width: 640px) {
      .cv-library-container {
        padding: 88px 14px 48px;
      }
      .library-title {
        font-size: 2rem;
      }
      .cv-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .cv-card-item {
        max-width: 420px;
        width: 100%;
        margin: 0 auto;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .cv-card-item, .btn-new-cv, .filter-pill, .footer-btn, .btn-empty-action {
        transition: none !important;
      }
    }
  `],
})
export class MyCvDashboardComponent implements OnInit {
  // Lucide Icons
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Eye = Eye;
  readonly Download = Download;
  readonly Search = Search;
  readonly Plus = Plus;
  readonly Sparkles = Sparkles;
  readonly Lock = Lock;
  readonly Unlock = Unlock;
  readonly Clock = Clock;
  readonly FileText = FileText;
  readonly CheckCircle2 = CheckCircle2;
  readonly ArrowRight = ArrowRight;
  readonly ArrowUpRight = ArrowUpRight;
  readonly X = X;
  readonly Layers = Layers;
  readonly i18n = inject(TranslationService);
  private toast = inject(ToastService);

  cvs = signal<SavedCv[]>([]);
  searchQuery = signal('');
  statusFilter = signal<'all' | 'unlocked' | 'draft'>('all');
  downloadModalCv = signal<SavedCv | null>(null);
  paymentModalCv = signal<SavedCv | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    public auth: AuthService,
    private pptx: PptxExportService
  ) {}

  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.http.get<{ cvs: SavedCv[] }>('/api/v1/cvs').subscribe({
      next: ({ cvs }) => {
        this.cvs.set(
          (cvs || []).map((c) => ({ ...c, content: this.parseContent(c.content) }))
        );
      },
      error: (err) => console.error('Error fetching saved CVs:', err)
    });
  }

  parseContent(content: any) {
    if (!content) return {};
    if (typeof content === 'string') {
      try { return JSON.parse(content); } catch { return {}; }
    }
    return content;
  }

  contentOf(cv: SavedCv) { 
    return this.parseContent(cv.content); 
  }

  filteredCvs() {
    const query = this.searchQuery().trim().toLowerCase();
    const filter = this.statusFilter();
    return this.cvs().filter((cv) => {
      const matchesQuery = !query || `${cv.title} ${cv.template_name}`.toLowerCase().includes(query);
      if (!matchesQuery) return false;
      if (filter === 'unlocked') return this.isCvUnlocked(cv);
      if (filter === 'draft') return !this.isCvUnlocked(cv);
      return true;
    });
  }

  unlockedCount(): number {
    return this.cvs().filter((c) => this.isCvUnlocked(c)).length;
  }

  draftCount(): number {
    return this.cvs().filter((c) => !this.isCvUnlocked(c)).length;
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('all');
  }

  isCvUnlocked(cv: SavedCv): boolean {
    return !!cv.is_paid || this.auth.isStaffOrAdmin();
  }

  isCoverLetter(cv: SavedCv): boolean {
    const layout = this.layoutOf(cv);
    return layout.includes('cover-letter') || (cv.template_name || '').toLowerCase().includes('cover');
  }

  asArray(v: any): any[] { 
    return Array.isArray(v) ? v : []; 
  }

  layoutOf(cv: SavedCv): string {
    const content = this.contentOf(cv);
    if (content.layout) return content.layout;
    const name = (cv.template_name || '').toLowerCase();
    if (name.includes('graphite')) return 'graphite-banner-timeline';
    if (name.includes('minimalist framed')) return 'minimalist-framed';
    if (name.includes('navy badge') || name.includes('sokaiya')) return 'navy-badge';
    if (name.includes('navy sidebar')) return 'navy-sidebar-profile';
    if (name.includes('slate rounded')) return 'slate-rounded-panels';
    if (name.includes('warm taupe')) return 'warm-taupe-timeline';
    if (name.includes('modern accent') || name.includes('sidebar cover')) return 'sidebar-cover-letter';
    if (name.includes('minimalist') || name.includes('to-from')) return 'minimalist-cover-letter';
    if (name.includes('border') || name.includes('framed')) return 'framed-cover-letter';
    if (name.includes('cover')) return 'cover-letter';
    if (name.includes('formal')) return 'formal-classic';
    if (name.includes('classic')) return 'classic-dark';
    if (name.includes('geometric')) return 'classic-dark';
    if (name.includes('elegant')) return 'elegant-frame';
    if (name.includes('clean')) return 'clean-sidebar';
    if (name.includes('modern')) return 'modern-split';
    return 'professional';
  }

  onCardClick(cv: SavedCv) {
    if (this.isCvUnlocked(cv)) {
      this.previewCv(cv);
    } else {
      this.edit(cv);
    }
  }

  edit(cv: SavedCv) {
    const content = this.contentOf(cv);
    this.router.navigate(['/make-cv'], {
      queryParams: { cvId: cv.id, layout: content.layout || this.layoutOf(cv) },
    });
  }

  previewCv(cv: SavedCv) {
    this.router.navigate(['/my-cv', cv.id]);
  }

  openDownload(cv: SavedCv) {
    if (this.isCvUnlocked(cv)) {
      this.downloadModalCv.set(cv);
    } else {
      this.paymentModalCv.set(cv);
    }
  }

  onPaymentSuccess(cv: SavedCv, evt: { orderId: number; format?: 'pdf' | 'docx' | 'pptx' }) {
    // Update local state to unlocked immediately
    this.cvs.update((list) =>
      list.map((item) => (item.id === cv.id ? { ...item, is_paid: 1 } : item))
    );
    cv.is_paid = 1;

    this.paymentModalCv.set(null);
    if (evt.format) {
      this.triggerExport(evt.format, cv);
    } else {
      this.downloadModalCv.set(cv);
    }
  }

  onModalDownloadFormat(cv: SavedCv, format: 'pdf' | 'docx' | 'pptx') {
    this.paymentModalCv.set(null);
    this.triggerExport(format, cv);
  }

  async triggerExport(format: 'pdf' | 'docx' | 'pptx', cv: SavedCv) {
    this.downloadModalCv.set(null);

    if (format === 'pdf') {
      // Navigate to CV detail with print trigger for optimal pixel-perfect A4 printing
      this.router.navigate(['/my-cv', cv.id], { queryParams: { print: 'true' } });
      return;
    }

    const cardEl = document.getElementById(`cv-card-${cv.id}`);
    const cvRootSelector = '.cv-paper, .cv, .nb-container, .cl, .framed-cl-container, .mcl-container, .mf-page, .scl-container';
    let previewEl = cardEl?.querySelector(cvRootSelector) as HTMLElement | null;
    if (!previewEl) {
      previewEl = cardEl?.querySelector('.cv-thumb')?.firstElementChild as HTMLElement | null;
      if (previewEl && previewEl.tagName.toLowerCase() === 'app-watermark') {
        previewEl = previewEl.nextElementSibling as HTMLElement | null;
      }
    }

    if (format === 'pptx') {
      if (previewEl) {
        try {
          const safeName = (cv.title || 'CV').replace(/[\\/:*?"<>|]+/g, '_');
          await this.pptx.export(previewEl, `${safeName}.pptx`);
        } catch (e) {
          console.error('PPTX export error', e);
          this.toast.warning('Could not export to PPTX. Please try PDF.');
        }
      } else {
        this.router.navigate(['/my-cv', cv.id]);
      }
      return;
    }

    if (format === 'docx') {
      if (previewEl) {
        this.exportDocx(previewEl, cv.title || 'CV');
      } else {
        this.router.navigate(['/my-cv', cv.id]);
      }
    }
  }

  private exportDocx(previewEl: HTMLElement, fileName: string) {
    const cvHtml = previewEl.innerHTML;
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${fileName}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page { size: 210mm 297mm; margin: 0mm; }
    body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; }
  </style>
</head>
<body>
  ${cvHtml}
</body>
</html>`;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/[\\/:*?"<>|]+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  remove(cv: SavedCv, event: Event) {
    event.stopPropagation();
    if (!confirm(`Delete "${cv.title}"? This cannot be undone.`)) return;
    this.http.delete(`/api/v1/cvs/${cv.id}`).subscribe({
      next: () => this.cvs.update((list) => list.filter((c) => c.id !== cv.id)),
      error: () => this.toast.error('Could not delete this CV.'),
    });
  }
}
