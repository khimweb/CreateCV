import { Component, OnInit, OnDestroy, AfterViewInit, signal, computed, inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Save, Download, Pencil, Trash2, ArrowLeft, Plus, Minus } from 'lucide-angular';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';
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
import { ModernSplitCvComponent } from '../../shared/components/modern-split-cv/modern-split-cv.component';
import { CleanSidebarCvComponent } from '../../shared/components/clean-sidebar-cv/clean-sidebar-cv.component';
import { ElegantFrameCvComponent } from '../../shared/components/elegant-frame-cv/elegant-frame-cv.component';
import { ClassicDarkCvComponent } from '../../shared/components/classic-dark-cv/classic-dark-cv.component';
import { FormalClassicCvComponent } from '../../shared/components/formal-classic-cv/formal-classic-cv.component';

import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { PptxExportService } from '../../shared/services/pptx-export.service';
import { WatermarkComponent } from '../../shared/components/watermark/watermark.component';
import { KhqrPaymentModalComponent } from '../../shared/components/khqr-payment-modal/khqr-payment-modal.component';
import { ToastService } from '../../shared/components/toast/toast.service';

interface CvDetail {
  id: string;
  template_id?: number | string;
  title: string;
  template_name: string;
  selected_color: string;
  default_colors: string[];
  content: any;
  pdf_url: string | null;
  is_paid?: number;
}

@Component({
  selector: 'app-my-cv-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    LucideAngularModule, 
    ProfessionalCvComponent, 
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
    ModernSplitCvComponent,
    CleanSidebarCvComponent,
    ElegantFrameCvComponent,
    ClassicDarkCvComponent,
    FormalClassicCvComponent,
    WatermarkComponent,
    KhqrPaymentModalComponent
  ],
  template: `
    @if (cv(); as c) {
      <section class="max-w-5xl mx-auto px-2 sm:px-4 md:px-6 pt-20 sm:pt-28 md:pt-32 pb-28 sm:pb-20 transition-all">
        <!-- Navigation Bar -->
        <div class="mb-3 sm:mb-4 flex items-center justify-between gap-2">
          <a routerLink="/my-cv" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-xs">
            <lucide-icon [img]="ArrowLeft" class="w-3.5 h-3.5" /> {{ i18n.currentLang() === 'kh' ? 'ត្រឡប់ទៅ CV របស់ខ្ញុំ' : 'Back to My CVs' }}
          </a>
          @if (auth.isAdmin()) {
            <a routerLink="/admin/drafts" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition shadow-xs">
              {{ i18n.currentLang() === 'kh' ? 'Admin Drafts' : 'Admin Drafts' }}
            </a>
          }
        </div>

        <!-- Header Row: Title & Action Buttons -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-sky-100 truncate max-w-[240px] sm:max-w-md">
              {{ c.title }}
            </h1>
            @if (isUnlocked(c)) {
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs shrink-0">
                <span>🔓</span> {{ i18n.currentLang() === 'kh' ? 'បានដោះសោ' : 'Unlocked' }}
              </span>
            } @else {
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-slate-900 text-amber-300 shadow-xs border border-amber-400/30 shrink-0">
                <span>🔒</span> {{ i18n.currentLang() === 'kh' ? 'មិនទាន់ដោះសោ' : 'Locked' }}
              </span>
            }
          </div>

          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            @if (!c.is_paid || auth.isStaffOrAdmin()) {
              <button
                type="button"
                (click)="editInWorkstation(c)"
                class="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-sky-100 hover:scale-105 active:scale-95 transition shadow-xs"
              >
                <lucide-icon [img]="Pencil" class="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {{ i18n.currentLang() === 'kh' ? 'កែសម្រួល' : 'Edit' }}
              </button>
              <button
                type="button"
                (click)="save(c)"
                class="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-sky-100/80 dark:bg-sky-500/20 text-sky-700 dark:text-sky-100 hover:scale-105 active:scale-95 transition shadow-xs"
              >
                <lucide-icon [img]="Save" class="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {{ i18n.currentLang() === 'kh' ? 'រក្សាទុក' : 'Save' }}
              </button>
            }
            <button
              type="button"
              (click)="onDownloadClick(c)"
              class="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:scale-105 active:scale-95 transition"
            >
              <lucide-icon [img]="Download" class="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {{ i18n.currentLang() === 'kh' ? 'ទាញយក CV' : 'Download CV' }}
            </button>
            <button
              type="button"
              (click)="remove(c)"
              class="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-red-50 text-red-700 hover:scale-105 active:scale-95 transition shadow-xs"
            >
              <lucide-icon [img]="Trash2" class="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {{ i18n.currentLang() === 'kh' ? 'លុប' : 'Delete' }}
            </button>
          </div>
        </div>

        <!-- Controls Row: Color Swatches + Responsive Zoom Controller -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
          <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
              {{ i18n.currentLang() === 'kh' ? 'ពណ៌:' : 'Color:' }}
            </span>
            @for (color of c.default_colors; track color) {
              <button
                type="button"
                (click)="setColor(c, color)"
                [style.background]="color"
                class="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-2 transition hover:scale-110 active:scale-95 shadow-xs"
                [class.border-slate-800]="c.selected_color === color"
                [class.dark:border-white]="c.selected_color === color"
                [class.border-transparent]="c.selected_color !== color"
                [attr.aria-label]="'Select color ' + color"
              ></button>
            }
          </div>

          <!-- Interactive Responsive Zoom Controls -->
          <div class="inline-flex items-center gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs text-xs">
            <button
              type="button"
              (click)="zoomOut()"
              class="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90 transition disabled:opacity-30"
              [disabled]="isMinZoom()"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <lucide-icon [img]="Minus" class="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              (click)="toggleAutoFit()"
              class="px-2 py-0.5 font-mono font-bold text-[11px] sm:text-xs rounded-md transition"
              [class.bg-sky-100]="isAutoFit()"
              [class.dark:bg-sky-950]="isAutoFit()"
              [class.text-sky-600]="isAutoFit()"
              [class.dark:text-sky-400]="isAutoFit()"
              [class.text-slate-600]="!isAutoFit()"
              [class.dark:text-slate-300]="!isAutoFit()"
              title="Fit Screen"
            >
              {{ fitLabel() }}
            </button>

            @if (!isAutoFit()) {
              <button
                type="button"
                (click)="setZoom100()"
                class="px-1.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                title="100% Size"
              >
                100%
              </button>
            }

            <button
              type="button"
              (click)="zoomIn()"
              class="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90 transition disabled:opacity-30"
              [disabled]="isMaxZoom()"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <lucide-icon [img]="Plus" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Document Viewer Container with Responsive Scaling -->
        <div
          #stageContainer
          class="cv-stage-container rounded-2xl p-2 sm:p-5 md:p-8 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-sky-500/20 shadow-md overflow-x-auto overflow-y-visible transition-all"
          [style.borderTop]="'6px solid ' + c.selected_color"
        >
          <div class="cv-stage-scaler mx-auto flex justify-center items-start">
            <div 
              class="print-root a4-wrap relative origin-top"
              [style.--a4-scale]="effectiveScale()"
              [style.zoom]="effectiveScale()"
            >
              @if (!isUnlocked(c)) {
                <app-watermark text="CQ Professional" />
              }
              @if (layoutOf(c) === 'graphite-banner-timeline') {
                <app-graphite-banner-timeline-cv
                  [accent]="c.content?.accent || c.selected_color || '#323E4D'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title" [jobTitle]="c.content?.jobTitle || ''" [email]="c.content?.email || ''" [phone]="c.content?.phone || ''" [location]="c.content?.location || ''" [linkedin]="c.content?.linkedin || ''" [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)" [experience]="arr(c.content?.experience)" [skills]="arr(c.content?.skills)" [languages]="arr(c.content?.languages)" [certifications]="arr(c.content?.certifications)" [projects]="arr(c.content?.projects)" [references]="arr(c.content?.references)" [hobbies]="arr(c.content?.hobbies)"
                  [sectionLabels]="c.content?.sectionLabels || {}"
                  [sectionOrder]="c.content?.sectionOrder || []"/>
              } @else if (layoutOf(c) === 'navy-sidebar-profile') {
                <app-navy-sidebar-profile-cv
                  [accent]="c.content?.accent || c.selected_color || '#1E3A52'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title" [jobTitle]="c.content?.jobTitle || ''" [email]="c.content?.email || ''" [phone]="c.content?.phone || ''" [location]="c.content?.location || ''" [linkedin]="c.content?.linkedin || ''" [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)" [experience]="arr(c.content?.experience)" [skills]="arr(c.content?.skills)" [languages]="arr(c.content?.languages)" [certifications]="arr(c.content?.certifications)" [projects]="arr(c.content?.projects)" [references]="arr(c.content?.references)" [hobbies]="arr(c.content?.hobbies)"
                  [sectionLabels]="c.content?.sectionLabels || {}"
                  [sectionOrder]="c.content?.sectionOrder || []"/>
              } @else if (layoutOf(c) === 'navy-badge') {
                <app-navy-badge-cv
                  [accent]="c.content?.accent || c.selected_color || '#1B2838'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title" [jobTitle]="c.content?.jobTitle || ''" [email]="c.content?.email || ''" [phone]="c.content?.phone || ''" [location]="c.content?.location || ''" [linkedin]="c.content?.linkedin || ''" [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)" [experience]="arr(c.content?.experience)" [skills]="arr(c.content?.skills)" [languages]="arr(c.content?.languages)" [certifications]="arr(c.content?.certifications)" [projects]="arr(c.content?.projects)" [references]="arr(c.content?.references)" [hobbies]="arr(c.content?.hobbies)"
                  [fontSize]="c.content?.typography?.fontSize || 9.5" [fontWeight]="c.content?.typography?.fontWeight || 400" [lineHeight]="c.content?.typography?.lineHeight || 1.42" [fontFamily]="c.content?.typography?.fontFamily || undefined"
                  [sectionLabels]="c.content?.sectionLabels || {}"
                  [sectionOrder]="c.content?.sectionOrder || []"/>
              } @else if (layoutOf(c) === 'minimalist-framed') {
                <app-minimalist-framed-cv
                  [accent]="c.content?.accent || c.selected_color || '#1F2937'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title" [jobTitle]="c.content?.jobTitle || ''" [email]="c.content?.email || ''" [phone]="c.content?.phone || ''" [location]="c.content?.location || ''" [linkedin]="c.content?.linkedin || ''" [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)" [experience]="arr(c.content?.experience)" [skills]="arr(c.content?.skills)" [languages]="arr(c.content?.languages)" [certifications]="arr(c.content?.certifications)" [projects]="arr(c.content?.projects)" [references]="arr(c.content?.references)" [hobbies]="arr(c.content?.hobbies)"
                  [fontSize]="c.content?.typography?.fontSize || 10" [fontWeight]="c.content?.typography?.fontWeight || 400" [lineHeight]="c.content?.typography?.lineHeight || 1.55" [fontFamily]="c.content?.typography?.fontFamily || undefined"
                  [sectionLabels]="c.content?.sectionLabels || {}"
                  [sectionOrder]="c.content?.sectionOrder || []"/>
              } @else if (layoutOf(c) === 'slate-rounded-panels') {
                <app-slate-rounded-panels-cv
                  [accent]="c.content?.accent || c.selected_color || '#364152'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title" [jobTitle]="c.content?.jobTitle || ''" [email]="c.content?.email || ''" [phone]="c.content?.phone || ''" [location]="c.content?.location || ''" [linkedin]="c.content?.linkedin || ''" [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)" [experience]="arr(c.content?.experience)" [skills]="arr(c.content?.skills)" [languages]="arr(c.content?.languages)" [certifications]="arr(c.content?.certifications)" [projects]="arr(c.content?.projects)" [references]="arr(c.content?.references)" [hobbies]="arr(c.content?.hobbies)"
                  [sectionLabels]="c.content?.sectionLabels || {}"
                  [sectionOrder]="c.content?.sectionOrder || []"/>
              } @else if (layoutOf(c) === 'warm-taupe-timeline') {
                <app-warm-taupe-timeline-cv
                  [accent]="c.content?.accent || c.selected_color || '#A87C64'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title" [jobTitle]="c.content?.jobTitle || ''" [email]="c.content?.email || ''" [phone]="c.content?.phone || ''" [location]="c.content?.location || ''" [linkedin]="c.content?.linkedin || ''" [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)" [experience]="arr(c.content?.experience)" [skills]="arr(c.content?.skills)" [languages]="arr(c.content?.languages)" [certifications]="arr(c.content?.certifications)" [projects]="arr(c.content?.projects)" [references]="arr(c.content?.references)" [hobbies]="arr(c.content?.hobbies)"
                  [fontSize]="c.content?.typography?.fontSize || 10" [fontWeight]="c.content?.typography?.fontWeight || 400" [lineHeight]="c.content?.typography?.lineHeight || 1.42" [fontFamily]="c.content?.typography?.fontFamily || undefined"
                  [sectionLabels]="c.content?.sectionLabels || {}"
                  [sectionOrder]="c.content?.sectionOrder || []"/>
              } @else if (layoutOf(c) === 'framed-cover-letter') {
                <app-framed-cover-letter-cv
                  [accent]="c.content?.accent || c.selected_color || '#1a2b5a'"
                  [name]="c.content?.fullName || c.title"
                  [jobTitle]="c.content?.jobTitle || ''"
                  [email]="c.content?.email || ''"
                  [phone]="c.content?.phone || ''"
                  [location]="c.content?.location || ''"
                  [recipientName]="c.content?.recipientName || ''"
                  [recipientDept]="c.content?.recipientDept || ''"
                  [greeting]="c.content?.greeting || ''"
                  [closing]="c.content?.closing || ''"
                  [subject]="c.content?.subject || ''"
                  [bodyText]="c.content?.summary || ''"
                  [fontSize]="c.content?.typography?.fontSize || 11"
                  [fontWeight]="c.content?.typography?.fontWeight || 400"
                  [lineHeight]="c.content?.typography?.lineHeight || 1.65"
                  [fontFamily]="c.content?.typography?.fontFamily || undefined"
                />
              } @else if (layoutOf(c) === 'sidebar-cover-letter') {
                <app-sidebar-cover-letter-cv
                  [accent]="c.content?.accent || c.selected_color || '#B91C1C'"
                  [name]="c.content?.fullName || c.title"
                  [jobTitle]="c.content?.jobTitle || ''"
                  [email]="c.content?.email || ''"
                  [phone]="c.content?.phone || ''"
                  [location]="c.content?.location || ''"
                  [recipientName]="c.content?.recipientName || ''"
                  [recipientDept]="c.content?.recipientDept || ''"
                  [greeting]="c.content?.greeting || ''"
                  [closing]="c.content?.closing || ''"
                  [subject]="c.content?.subject || ''"
                  [bodyText]="c.content?.summary || ''"
                  [fontSize]="c.content?.typography?.fontSize || 10.5"
                  [fontWeight]="c.content?.typography?.fontWeight || 400"
                  [lineHeight]="c.content?.typography?.lineHeight || 1.6"
                  [fontFamily]="c.content?.typography?.fontFamily || undefined"
                />
              } @else if (layoutOf(c) === 'minimalist-cover-letter') {
                <app-minimalist-cover-letter-cv
                  [accent]="c.content?.accent || c.selected_color || '#C59B58'"
                  [name]="c.content?.fullName || c.title"
                  [jobTitle]="c.content?.jobTitle || ''"
                  [email]="c.content?.email || ''"
                  [phone]="c.content?.phone || ''"
                  [location]="c.content?.location || ''"
                  [recipientName]="c.content?.recipientName || ''"
                  [recipientDept]="c.content?.recipientDept || ''"
                  [greeting]="c.content?.greeting || ''"
                  [closing]="c.content?.closing || ''"
                  [subject]="c.content?.subject || ''"
                  [bodyText]="c.content?.summary || ''"
                  [fontSize]="c.content?.typography?.fontSize || 10"
                  [fontWeight]="c.content?.typography?.fontWeight || 400"
                  [lineHeight]="c.content?.typography?.lineHeight || 1.6"
                  [fontFamily]="c.content?.typography?.fontFamily || undefined"
                />
              } @else if (layoutOf(c) === 'cover-letter') {
                <app-cover-letter-cv
                  [accent]="c.content?.accent || c.selected_color || '#1a5276'"
                  [name]="c.content?.fullName || c.title"
                  [email]="c.content?.email || ''"
                  [phone]="c.content?.phone || ''"
                  [location]="c.content?.location || ''"
                  [recipientDept]="c.content?.recipientDept || ''"
                  [greeting]="c.content?.greeting || ''"
                  [closing]="c.content?.closing || ''"
                  [subject]="c.content?.subject || ''"
                  [bodyText]="c.content?.summary || ''"
                  [fontSize]="c.content?.typography?.fontSize || 11"
                  [fontWeight]="c.content?.typography?.fontWeight || 400"
                  [lineHeight]="c.content?.typography?.lineHeight || 1.6"
                  [fontFamily]="c.content?.typography?.fontFamily || undefined"
                />
              } @else if (layoutOf(c) === 'modern-split') {
                <app-modern-split-cv
                  [accent]="c.content?.accent || c.selected_color || '#1b3a5c'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title"
                  [jobTitle]="c.content?.jobTitle || ''"
                  [email]="c.content?.email || ''"
                  [phone]="c.content?.phone || ''"
                  [location]="c.content?.location || ''"
                  [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)"
                  [experience]="arr(c.content?.experience)"
                  [skills]="arr(c.content?.skills)"
                  [languages]="arr(c.content?.languages)"
                  [references]="arr(c.content?.references)"
                  [hobbies]="arr(c.content?.hobbies)"
                />
              } @else if (layoutOf(c) === 'clean-sidebar') {
                <app-clean-sidebar-cv
                  [accent]="c.content?.accent || c.selected_color || '#5a6a7a'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title"
                  [jobTitle]="c.content?.jobTitle || ''"
                  [email]="c.content?.email || ''"
                  [phone]="c.content?.phone || ''"
                  [location]="c.content?.location || ''"
                  [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)"
                  [experience]="arr(c.content?.experience)"
                  [skills]="arr(c.content?.skills)"
                  [languages]="arr(c.content?.languages)"
                  [references]="arr(c.content?.references)"
                />
              } @else if (layoutOf(c) === 'elegant-frame') {
                <app-elegant-frame-cv
                  [accent]="c.content?.accent || c.selected_color || '#2c3e50'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title"
                  [jobTitle]="c.content?.jobTitle || ''"
                  [email]="c.content?.email || ''"
                  [phone]="c.content?.phone || ''"
                  [location]="c.content?.location || ''"
                  [linkedin]="c.content?.linkedin || ''"
                  [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)"
                  [experience]="arr(c.content?.experience)"
                  [skills]="arr(c.content?.skills)"
                  [languages]="arr(c.content?.languages)"
                  [certifications]="arr(c.content?.certifications)"
                />
              } @else if (layoutOf(c) === 'classic-dark') {
                <app-classic-dark-cv
                  [accent]="c.content?.accent || c.selected_color || '#1e293b'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title"
                  [jobTitle]="c.content?.jobTitle || ''"
                  [email]="c.content?.email || ''"
                  [phone]="c.content?.phone || ''"
                  [location]="c.content?.location || ''"
                  [linkedin]="c.content?.linkedin || ''"
                  [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)"
                  [experience]="arr(c.content?.experience)"
                  [skills]="arr(c.content?.skills)"
                  [languages]="arr(c.content?.languages)"
                />
              } @else if (layoutOf(c) === 'formal-classic') {
                <app-formal-classic-cv
                  [accent]="c.content?.accent || c.selected_color || '#1e3a8a'"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title"
                  [jobTitle]="c.content?.jobTitle || ''"
                  [email]="c.content?.email || ''"
                  [phone]="c.content?.phone || ''"
                  [location]="c.content?.location || ''"
                  [linkedin]="c.content?.linkedin || ''"
                  [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)"
                  [experience]="arr(c.content?.experience)"
                  [skills]="arr(c.content?.skills)"
                  [languages]="arr(c.content?.languages)"
                />
              } @else {
                <app-professional-cv
                  [accent]="c.selected_color"
                  [photoUrl]="c.content?.photoUrl || null"
                  [name]="c.content?.fullName || c.title"
                  [jobTitle]="c.content?.jobTitle || ''"
                  [email]="c.content?.email || ''"
                  [phone]="c.content?.phone || ''"
                  [location]="c.content?.location || ''"
                  [linkedin]="c.content?.linkedin || ''"
                  [summary]="c.content?.summary || ''"
                  [education]="arr(c.content?.education)"
                  [experience]="arr(c.content?.experience)"
                  [skills]="arr(c.content?.skills)"
                  [languages]="arr(c.content?.languages)"
                  [certifications]="arr(c.content?.certifications)"
                  [projects]="arr(c.content?.projects)"
                  [sectionLabels]="c.content?.sectionLabels || {}"
                  [sectionOrder]="c.content?.sectionOrder || []"/>
              }
            </div>
          </div>
        </div>

        @if (showPaymentModal()) {
          <app-khqr-payment-modal
            [userCvId]="c.id"
            [templateId]="c.template_id"
            [templateName]="c.template_name"
            (paymentSuccess)="onPaymentSuccess($event)"
            (downloadFormat)="onModalDownloadFormat($event)"
            (close)="showPaymentModal.set(false)"
          />
        }

        @if (showDownloadModal()) {
          <div class="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in"
               (click)="showDownloadModal.set(false)">
            <div class="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 shadow-2xl p-6 border border-slate-200 dark:border-slate-800 animate-scale-up"
                 (click)="$event.stopPropagation()">
              <div class="text-center mb-6">
                <h3 class="text-lg font-black text-slate-800 dark:text-white">{{ i18n.currentLang() === 'kh' ? 'ទាញយក CV' : 'Download CV' }}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ i18n.currentLang() === 'kh' ? 'សូមជ្រើសរើសទម្រង់ឯកសារដែលអ្នកចង់ទាញយក' : 'Select your preferred export format' }}</p>
              </div>
              <div class="grid grid-cols-3 gap-3 mb-6">
                <button type="button" (click)="downloadAs('pdf')" class="flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all hover:scale-105 active:scale-95 shadow-sm">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span class="text-xs font-black text-slate-800 dark:text-slate-200">PDF</span>
                  <span class="text-[9px] text-slate-400">{{ i18n.currentLang() === 'kh' ? 'គុណភាពខ្ពស់' : 'High Quality' }}</span>
                </button>
                <button type="button" (click)="downloadAs('pptx')" class="flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all hover:scale-105 active:scale-95 shadow-sm">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 12h10M12 7v10"/></svg>
                  <span class="text-xs font-black text-slate-800 dark:text-slate-200">PPTX</span>
                  <span class="text-[9px] text-slate-400">PowerPoint</span>
                </button>
                <button type="button" (click)="downloadAs('docx')" class="flex flex-col items-center gap-2 p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all hover:scale-105 active:scale-95 shadow-sm">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
                  <span class="text-xs font-black text-slate-800 dark:text-slate-200">DOCX</span>
                  <span class="text-[9px] text-slate-400">Word</span>
                </button>
              </div>
              <button type="button" (click)="showDownloadModal.set(false)" class="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition">
                {{ i18n.currentLang() === 'kh' ? 'បិទ' : 'Close' }}
              </button>
            </div>
          </div>
        }
      </section>
    }
  `,
  styles: [
    `
      .a4-wrap {
        width: 210mm;
        min-width: 210mm;
        box-sizing: border-box;
        box-shadow: 0 12px 36px -8px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
        background: #ffffff;
        border-radius: 4px;
        transform-origin: top center;
      }
      .cv-stage-container {
        -webkit-overflow-scrolling: touch;
      }
      @supports not (zoom: 1) {
        .a4-wrap {
          transform: scale(var(--a4-scale, 1));
          margin-bottom: calc(297mm * (var(--a4-scale, 1) - 1));
        }
      }
      @supports (zoom: 1) {
        .a4-wrap {
          transform: none !important;
        }
      }
      @media print {
        .a4-wrap {
          zoom: 1 !important;
          transform: none !important;
          width: 210mm !important;
          min-width: 210mm !important;
          margin: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
      }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      .animate-scale-up { animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    `,
  ],
})
export class MyCvDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly Save = Save;
  readonly Download = Download;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly ArrowLeft = ArrowLeft;
  readonly Plus = Plus;
  readonly Minus = Minus;
  readonly i18n = inject(TranslationService);
  private toast = inject(ToastService);

  @ViewChild('stageContainer') stageContainer?: ElementRef<HTMLElement>;

  cv = signal<CvDetail | null>(null);
  showPaymentModal = signal<boolean>(false);
  showDownloadModal = signal<boolean>(false);

  // Responsive scaling signals
  readonly A4_WIDTH_PX = 793.7;
  containerWidth = signal<number>(800);
  isAutoFit = signal<boolean>(true);
  zoomLevel = signal<number>(1);

  fitScale = computed(() => {
    const w = this.containerWidth();
    if (!w) return 1;
    // Account for padding inside container based on viewport width
    const pad = w < 640 ? 20 : (w < 768 ? 44 : 68);
    const usable = Math.max(260, w - pad);
    if (usable >= this.A4_WIDTH_PX) return 1;
    return Number((usable / this.A4_WIDTH_PX).toFixed(3));
  });

  effectiveScale = computed(() => {
    if (this.isAutoFit()) {
      return this.fitScale();
    }
    return this.zoomLevel();
  });

  scalePercentage = computed(() => Math.round(this.effectiveScale() * 100));

  isMinZoom = computed(() => this.effectiveScale() <= 0.25);
  isMaxZoom = computed(() => this.effectiveScale() >= 2.0);

  fitLabel = computed(() => {
    if (this.isAutoFit()) {
      return this.i18n.currentLang() === 'kh' ? 'សមអេក្រង់' : 'Fit';
    }
    return `${this.scalePercentage()}%`;
  });

  private resizeObserver?: ResizeObserver;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public auth: AuthService,
    private pptx: PptxExportService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('cv_id')!;
    this.http.get<{ cv: any }>(`/api/v1/cvs/${id}`).subscribe(({ cv }) => {
      const parsed = {
        ...cv,
        content: typeof cv.content === 'string' ? JSON.parse(cv.content || '{}') : cv.content || {},
        default_colors:
          typeof cv.default_colors === 'string' ? JSON.parse(cv.default_colors) : cv.default_colors || [],
      };
      this.cv.set(parsed);

      if (this.route.snapshot.queryParamMap.get('print') === 'true' && this.isUnlocked(parsed)) {
        setTimeout(() => window.print(), 600);
      }
    });
  }

  ngAfterViewInit() {
    this.updateContainerWidth();
    if (typeof ResizeObserver !== 'undefined' && this.stageContainer?.nativeElement) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          if (width > 0) {
            this.containerWidth.set(width);
          }
        }
      });
      this.resizeObserver.observe(this.stageContainer.nativeElement);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateContainerWidth();
  }

  private updateContainerWidth() {
    if (this.stageContainer?.nativeElement) {
      const width = this.stageContainer.nativeElement.clientWidth;
      if (width > 0) {
        this.containerWidth.set(width);
      }
    }
  }

  zoomIn() {
    this.isAutoFit.set(false);
    this.zoomLevel.update((z) => Math.min(2.0, +(z + 0.1).toFixed(2)));
  }

  zoomOut() {
    this.isAutoFit.set(false);
    this.zoomLevel.update((z) => Math.max(0.25, +(z - 0.1).toFixed(2)));
  }

  setZoom100() {
    this.isAutoFit.set(false);
    this.zoomLevel.set(1);
  }

  toggleAutoFit() {
    this.isAutoFit.set(true);
    this.zoomLevel.set(this.fitScale());
  }

  isUnlocked(c: CvDetail): boolean {
    return !!c.is_paid || this.auth.isStaffOrAdmin();
  }

  layoutOf(c: CvDetail): string {
    const layout = c.content?.layout;
    if (layout) return layout;
    const name = (c.template_name || '').toLowerCase();
    if (name.includes('modern split') || name.includes('split')) return 'modern-split';
    if (name.includes('clean sidebar') || name.includes('clean')) return 'clean-sidebar';
    if (name.includes('elegant frame') || name.includes('elegant')) return 'elegant-frame';
    if (name.includes('classic dark') || name.includes('dark')) return 'classic-dark';
    if (name.includes('formal classic') || name.includes('formal')) return 'formal-classic';
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
    return 'professional';
  }

  arr(v: any): any[] {
    return Array.isArray(v) ? v : [];
  }

  setColor(c: CvDetail, color: string) {
    this.http.put(`/api/v1/cvs/${c.id}/color`, { color }).subscribe(() => {
      this.cv.set({ ...c, selected_color: color });
    });
  }

  save(c: CvDetail) {
    this.http.put(`/api/v1/cvs/${c.id}`, { content: c.content, title: c.title }).subscribe({
      next: () => this.toast.success(this.i18n.currentLang() === 'kh' ? 'បានរក្សាទុកដោយជោគជ័យ។' : 'Saved.'),
      error: () => this.toast.error(this.i18n.currentLang() === 'kh' ? 'មិនអាចរក្សាទុកបានទេ។' : 'Could not save.'),
    });
  }

  onDownloadClick(c: CvDetail) {
    if (this.isUnlocked(c)) {
      this.showDownloadModal.set(true);
    } else {
      this.showPaymentModal.set(true);
    }
  }

  onPaymentSuccess(evt: { orderId: number; format?: 'pdf' | 'docx' | 'pptx' }) {
    const cur = this.cv();
    if (cur) {
      this.cv.set({ ...cur, is_paid: 1 });
    }
    this.showPaymentModal.set(false);
    if (evt.format) {
      this.downloadAs(evt.format);
    } else {
      this.showDownloadModal.set(true);
    }
  }

  onModalDownloadFormat(format: 'pdf' | 'docx' | 'pptx') {
    this.showPaymentModal.set(false);
    this.downloadAs(format);
  }

  async downloadAs(format: 'pdf' | 'docx' | 'pptx') {
    this.showDownloadModal.set(false);
    const c = this.cv();
    if (!c) return;

    if (format === 'pdf') {
      const prevAutoFit = this.isAutoFit();
      const prevZoom = this.zoomLevel();
      this.isAutoFit.set(false);
      this.zoomLevel.set(1);

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          this.isAutoFit.set(prevAutoFit);
          this.zoomLevel.set(prevZoom);
        }, 1000);
      }, 150);
      return;
    }

    const cvRootSelector = '.cv-paper, .cv, .nb-container, .cl, .framed-cl-container, .mcl-container, .mf-page, .scl-container';
    let previewEl = (document.querySelector(`.print-root ${cvRootSelector.split(', ').join(', .print-root ')}`) ||
                     document.querySelector(cvRootSelector)) as HTMLElement | null;
    if (!previewEl) {
      const root = document.querySelector('.print-root');
      let el = root?.firstElementChild as HTMLElement | null;
      if (el && el.tagName.toLowerCase() === 'app-watermark') el = el.nextElementSibling as HTMLElement | null;
      previewEl = el;
    }
    const fileName = (c.title || 'My_CV').replace(/[\\/:*?"<>|]+/g, '_');

    if (format === 'pptx') {
      if (previewEl) {
        try {
          await this.pptx.export(previewEl, `${fileName}.pptx`);
        } catch {
          this.toast.warning(this.i18n.currentLang() === 'kh' ? 'មិនអាចទាញយកជា PowerPoint បានទេ។ កំពុងប្តូរទៅ PDF...' : 'Could not export PowerPoint. Trying PDF.');
          window.print();
        }
      }
      return;
    }

    if (format === 'docx') {
      if (previewEl) {
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
        a.download = `${fileName}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }
  }

  remove(c: CvDetail) {
    const confirmMsg = this.i18n.currentLang() === 'kh' ? `តើអ្នកពិតជាចង់លុបឯកសារ “${c.title}” នេះមែនទេ?` : `Delete “${c.title}”?`;
    if (!confirm(confirmMsg)) return;
    this.http.delete(`/api/v1/cvs/${c.id}`).subscribe({
      next: () => this.router.navigate(['/my-cv']),
      error: () => this.toast.error(this.i18n.currentLang() === 'kh' ? 'មិនអាចលុបឯកសារបានទេ។' : 'Could not delete.'),
    });
  }

  editInWorkstation(c: CvDetail) {
    this.router.navigate(['/make-cv'], { queryParams: { cvId: c.id } });
  }
}
