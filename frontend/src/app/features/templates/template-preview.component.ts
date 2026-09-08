import { Component, OnInit, OnDestroy, AfterViewInit, signal, computed, inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import gsap from 'gsap';
import { LucideAngularModule, Star, ArrowLeft, Plus, Minus, ArrowRight, Sparkles } from 'lucide-angular';
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
import { DEMO_CV } from '../../shared/demo-cv-data';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

interface CvTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  defaultColors: string[];
  avgRating: number;
  layout: 'professional' | 'modern-split' | 'clean-sidebar' | 'elegant-frame' | 'classic-dark' | 'formal-classic' | 'cover-letter' | 'framed-cover-letter' | 'sidebar-cover-letter' | 'minimalist-cover-letter' | 'navy-badge' | 'warm-taupe-timeline' | 'slate-rounded-panels' | 'navy-sidebar-profile' | 'graphite-banner-timeline' | 'minimalist-framed';
}

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule, 
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
    MinimalistFramedCvComponent
  ],
  template: `
    @if (template(); as t) {
      <section class="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 xl:px-8 pt-20 sm:pt-24 md:pt-28 pb-32 sm:pb-24 transition-all">
        <!-- Top Navigation & Header -->
        <div class="flex items-center justify-between gap-3 mb-4 sm:mb-5">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-all hover:scale-105 active:scale-95"
            (click)="back()"
          >
            <lucide-icon [img]="ArrowLeft" class="w-4 h-4" /> {{ i18n.currentLang() === 'kh' ? 'ត្រឡប់ទៅផ្ទាំងគំរូវិញ' : 'Back to templates' }}
          </button>

          <!-- Mobile Header Badge -->
          <div class="flex items-center gap-2 xl:hidden">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-500/20 shadow-xs">
              <lucide-icon [img]="Sparkles" class="w-3.5 h-3.5 text-amber-500" />
              {{ t.name }}
            </span>
          </div>
        </div>

        <!-- Mobile Controls Card: Palette & Zoom Bar (visible below xl) -->
        <div class="xl:hidden rounded-2xl p-3 sm:p-4 mb-4 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-sky-500/20 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <!-- Color Swatches -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mr-0.5">
              {{ i18n.currentLang() === 'kh' ? 'ពណ៌:' : 'Color:' }}
            </span>
            @for (color of t.defaultColors; track color) {
              <button
                type="button"
                (click)="onColorClick(color, $event)"
                [style.background]="color"
                class="color-swatch-btn h-7 w-7 rounded-full border-2 transition shadow-xs"
                [class.border-slate-900]="selectedColor() === color"
                [class.dark:border-white]="selectedColor() === color"
                [class.ring-2]="selectedColor() === color"
                [class.ring-sky-500]="selectedColor() === color"
                [class.border-transparent]="selectedColor() !== color"
                [attr.aria-label]="'Select color ' + color"
              ></button>
            }
            <button
              type="button"
              (click)="showColorPicker.set(!showColorPicker())"
              class="h-7 px-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition"
            >
              {{ i18n.currentLang() === 'kh' ? 'ពណ៌ផ្សេងៗ' : 'More' }}
            </button>
          </div>

          <div class="flex items-center gap-2.5 ml-auto">
            <!-- Mobile Zoom Controls -->
            <div class="inline-flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <button
                type="button"
                (click)="zoomOut()"
                class="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 active:scale-90 transition disabled:opacity-30"
                [disabled]="isMinZoom()"
                title="Zoom Out"
              >
                <lucide-icon [img]="Minus" class="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                (click)="toggleAutoFit()"
                class="px-2 py-0.5 font-mono font-bold text-[11px] rounded-md transition"
                [class.bg-sky-100]="isAutoFit()"
                [class.dark:bg-sky-950]="isAutoFit()"
                [class.text-sky-600]="isAutoFit()"
                [class.dark:text-sky-400]="isAutoFit()"
                [class.text-slate-600]="!isAutoFit()"
                [class.dark:text-slate-300]="!isAutoFit()"
              >
                {{ fitLabel() }}
              </button>

              @if (!isAutoFit()) {
                <button
                  type="button"
                  (click)="setZoom100()"
                  class="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                >
                  100%
                </button>
              }

              <button
                type="button"
                (click)="zoomIn()"
                class="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 active:scale-90 transition disabled:opacity-30"
                [disabled]="isMaxZoom()"
                title="Zoom In"
              >
                <lucide-icon [img]="Plus" class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Prominent Quick Action Button for Mobile & Tablet -->
            <button
              type="button"
              (click)="onUseTemplateClick(t, $event)"
              [disabled]="isCreating()"
              class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-500 text-white font-black text-xs shadow-md shadow-sky-600/25 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-60"
            >
              @if (isCreating()) {
                <span class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>...</span>
              } @else {
                <span>{{ i18n.currentLang() === 'kh' ? 'ប្រើប្រាស់' : 'Use Template' }}</span>
                <lucide-icon [img]="ArrowRight" class="w-3.5 h-3.5" />
              }
            </button>
          </div>

          <!-- Mobile Color Picker Dropdown -->
          @if (showColorPicker()) {
            <div class="w-full mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 animate-fade-in">
              <div class="grid grid-cols-8 sm:grid-cols-12 gap-1.5 mb-2.5">
                @for (c of moreColors; track c) {
                  <button
                    type="button"
                    (click)="onColorClick(c, $event)"
                    [style.background]="c"
                    class="color-swatch-btn w-6 h-6 rounded-full border transition hover:scale-125 active:scale-90"
                    [class.border-slate-900]="selectedColor() === c"
                    [class.dark:border-white]="selectedColor() === c"
                    [class.ring-2]="selectedColor() === c"
                    [class.ring-sky-500]="selectedColor() === c"
                    [class.border-transparent]="selectedColor() !== c"
                  ></button>
                }
              </div>
              <div class="flex items-center gap-2">
                <label class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{{ i18n.currentLang() === 'kh' ? 'ពណ៌ផ្ទាល់ខ្លួន:' : 'Custom:' }}</label>
                <input
                  type="color"
                  [value]="selectedColor()"
                  (input)="onColorClick($any($event.target).value)"
                  class="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0"
                />
                <span class="text-[11px] text-slate-400 font-mono">{{ selectedColor() }}</span>
              </div>
            </div>
          }
        </div>

        <!-- Main Workspace Grid: Preview Stage + Sidebar -->
        <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 xl:gap-8 items-start">
          <!-- Real Layout Preview Card (Scaled Responsively for All Devices) -->
          <div 
            #previewStage
            class="preview-stage-card rounded-3xl overflow-hidden bg-slate-100/90 dark:bg-slate-900/70 border border-slate-200/80 dark:border-sky-500/20 shadow-lg relative"
          >
            <!-- Desktop Floating Zoom Toolbar -->
            <div class="hidden xl:flex absolute top-4 right-4 z-20 items-center gap-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm text-xs">
              <button
                type="button"
                (click)="zoomOut()"
                class="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90 transition disabled:opacity-30"
                [disabled]="isMinZoom()"
                title="Zoom Out"
              >
                <lucide-icon [img]="Minus" class="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                (click)="toggleAutoFit()"
                class="px-2 py-0.5 font-mono font-bold text-xs rounded-md transition"
                [class.bg-sky-100]="isAutoFit()"
                [class.dark:bg-sky-950]="isAutoFit()"
                [class.text-sky-600]="isAutoFit()"
                [class.dark:text-sky-400]="isAutoFit()"
                [class.text-slate-600]="!isAutoFit()"
                [class.dark:text-slate-300]="!isAutoFit()"
              >
                {{ fitLabel() }}
              </button>

              @if (!isAutoFit()) {
                <button
                  type="button"
                  (click)="setZoom100()"
                  class="px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition"
                >
                  100%
                </button>
              }

              <button
                type="button"
                (click)="zoomIn()"
                class="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90 transition disabled:opacity-30"
                [disabled]="isMaxZoom()"
                title="Zoom In"
              >
                <lucide-icon [img]="Plus" class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Scrollable Viewport with Centered Scaler -->
            <div class="h-[62vh] sm:h-[72vh] xl:h-[calc(100vh-9.5rem)] min-h-[460px] overflow-auto p-2 sm:p-5 lg:p-8 flex flex-col items-center cv-stage-scroll">
              <div 
                class="print-root a4-wrap relative origin-top mx-auto shrink-0"
                [style.--a4-scale]="effectiveScale()"
                [style.zoom]="effectiveScale()"
              >
                @if (t.layout === 'modern-split') {
                  <app-modern-split-cv
                    [accent]="selectedColor()"
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
                  />
                } @else if (t.layout === 'clean-sidebar') {
                  <app-clean-sidebar-cv
                    [accent]="selectedColor()"
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
                  />
                } @else if (t.layout === 'elegant-frame') {
                  <app-elegant-frame-cv
                    [accent]="selectedColor()"
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
                    [hobbies]="demo.hobbies"
                    [references]="demo.references"
                  />
                } @else if (t.layout === 'classic-dark') {
                  <app-classic-dark-cv
                    [accent]="selectedColor()"
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
                    [hobbies]="demo.hobbies"
                    [certifications]="demo.certifications"
                  />
                } @else if (t.layout === 'formal-classic') {
                  <app-formal-classic-cv
                    [accent]="selectedColor()"
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
                    [projects]="demo.projects"
                  />
                } @else if (t.layout === 'graphite-banner-timeline') {
                  <app-graphite-banner-timeline-cv
                    [accent]="selectedColor()"
                    [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl"
                    [education]="demo.education" [experience]="demo.experience" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies"
                  />
                } @else if (t.layout === 'navy-sidebar-profile') {
                  <app-navy-sidebar-profile-cv
                    [accent]="selectedColor()"
                    [name]="'LORNA ALVARADO'"
                    [jobTitle]="'Sales Representative'"
                    [email]="'hello@reallygreatsite.com'"
                    [phone]="'123-456-7890'"
                    [location]="'123 Anywhere St., Any City'"
                    [photoUrl]="'/assets/lorna-alvarado-photo.png'"
                  />
                } @else if (t.layout === 'slate-rounded-panels') {
                  <app-slate-rounded-panels-cv
                    [accent]="selectedColor()"
                    [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl"
                    [education]="demo.education" [experience]="demo.experience" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies"
                  />
                } @else if (t.layout === 'warm-taupe-timeline') {
                  <app-warm-taupe-timeline-cv
                    [accent]="selectedColor()"
                    [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl"
                    [education]="demo.education" [experience]="demo.experience" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies"
                  />
                } @else if (t.layout === 'framed-cover-letter') {
                  <app-framed-cover-letter-cv
                    [accent]="selectedColor()"
                    [name]="'Felicity Kendwell'"
                    [jobTitle]="'Internship'"
                    [location]="'20 Park Street, London Bridge, London, SE1 9EL'"
                    [phone]="'020 7950 5505'"
                    [email]="'FelicityK@yahoo.com'"
                    [recipientName]="'Gabriel Vince'"
                    [recipientDept]="'London Bridge Support Services'"
                    [greeting]="'Dear Mr. Vince,'"
                    [closing]="'Regards'"
                    [fontSize]="10"
                    [fontWeight]="400"
                    [lineHeight]="1.6"
                  />
                } @else if (t.layout === 'sidebar-cover-letter') {
                  <app-sidebar-cover-letter-cv
                    [accent]="selectedColor()"
                    [name]="'Daniel Murray'"
                    [jobTitle]="'ADMINISTRATIVE ASSISTANT'"
                    [location]="'2400 President Ave, Los Angeles, CA 90710, United States'"
                    [phone]="'(469) 732-9961'"
                    [email]="'murray.dani3@gmail.com'"
                    [recipientName]="'Ms Woods'"
                    [recipientDept]="'Spike'"
                    [greeting]="'Dear Ms. Woods,'"
                    [closing]="'Sincerely,'"
                    [fontSize]="10"
                    [fontWeight]="400"
                    [lineHeight]="1.55"
                  />
                } @else if (t.layout === 'minimalist-cover-letter') {
                  <app-minimalist-cover-letter-cv
                    [accent]="selectedColor()"
                    [name]="'Sophie Walton'"
                    [jobTitle]="'Customer Service'"
                    [location]="'1 Ray Hall Lane, Birmingham,\nBirmingham, B43 6GG, United Kingdom'"
                    [phone]="'0121 657 9000'"
                    [email]="'vc@yahoo.co.uk'"
                    [recipientName]="'Mr. Felsted'"
                    [recipientDept]="'Home Depot'"
                    [date]="'06/07/2020'"
                    [greeting]="'Dear Mr. Felsted'"
                    [closing]="'Best regards,'"
                    [fontSize]="10"
                    [fontWeight]="400"
                    [lineHeight]="1.55"
                  />
                } @else if (t.layout === 'minimalist-framed') {
                  <app-minimalist-framed-cv
                    [accent]="selectedColor()"
                    [name]="'LORNA ALVARADO'"
                    [jobTitle]="'Sales Representative'"
                    [phone]="'+123-456-7890'"
                    [email]="'hello@reallygreatsite.com'"
                    [location]="'123 Anywhere St., Any City'"
                    [summary]="'I am a Sales Representative is a professional who initializes and manages relationships with customers. They serve as their point of contact and lead from initial outreach through the making of the final purchase by them or someone in their household.'"
                    [fontSize]="10"
                    [fontWeight]="400"
                    [lineHeight]="1.5"
                  />
                } @else if (t.layout === 'navy-badge') {
                  <app-navy-badge-cv
                    [accent]="selectedColor()"
                    [name]="'SAING SOKAIYA'"
                    [jobTitle]="'ACCOUNTING ASSISTANT'"
                    [fontSize]="9.5"
                    [fontWeight]="400"
                    [lineHeight]="1.42"
                  />
                } @else if (t.layout === 'cover-letter') {
                  <app-cover-letter-cv
                    [accent]="selectedColor()"
                    [name]="demo.name"
                    [phone]="demo.phone"
                    [email]="demo.email"
                    [location]="demo.location"
                  />
                } @else {
                  <app-professional-cv
                    [accent]="selectedColor()"
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
                  />
                }
              </div>
            </div>
          </div>

          <!-- Right Sidebar: Details & Actions -->
          <div class="sidebar-details-card space-y-5 lg:sticky lg:top-28 rounded-3xl p-5 sm:p-6 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/80 dark:border-sky-500/20 shadow-md">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300">
                  {{ isCoverLetter(t) ? 'Cover Letter' : 'Curriculum Vitae' }}
                </span>
                <div class="flex items-center text-amber-500 text-xs font-bold ml-auto">
                  <lucide-icon [img]="Star" class="w-3.5 h-3.5 fill-amber-500 mr-1" />
                  {{ t.avgRating }}
                </div>
              </div>
              <h1 class="text-2xl font-black text-slate-800 dark:text-sky-100">{{ t.name }}</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                {{ t.description || 'A polished professional CV layout.' }}
              </p>
            </div>

            <!-- Desktop Color Scheme Selector -->
            <div class="hidden xl:block">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-sky-400 mb-2.5">
                {{ i18n.currentLang() === 'kh' ? 'ពណ៌ចម្បង' : 'Color Scheme' }}
              </p>
              <div class="flex flex-wrap items-center gap-3">
                @for (color of t.defaultColors; track color) {
                  <button
                    type="button"
                    (click)="onColorClick(color, $event)"
                    [style.background]="color"
                    class="color-swatch-btn h-9 w-9 rounded-full border-2 transition-all shadow-sm"
                    [class.border-slate-900]="selectedColor() === color"
                    [class.dark:border-white]="selectedColor() === color"
                    [class.ring-2]="selectedColor() === color"
                    [class.ring-sky-500]="selectedColor() === color"
                    [class.border-transparent]="selectedColor() !== color"
                    [attr.aria-label]="'Select color ' + color"
                  ></button>
                }
                <button
                  type="button"
                  (click)="showColorPicker.set(!showColorPicker())"
                  class="h-9 px-3 rounded-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition shadow-xs"
                >
                  {{ i18n.currentLang() === 'kh' ? 'ពណ៌បន្ថែម' : 'More colors' }}
                </button>
              </div>

              @if (showColorPicker()) {
                <div class="mt-3 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl animate-fade-in">
                  <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{{ i18n.currentLang() === 'kh' ? 'ជ្រើសរើសពណ៌ណាមួយ' : 'Pick any color' }}</p>
                  <div class="grid grid-cols-8 gap-2 mb-3">
                    @for (c of moreColors; track c) {
                      <button
                        type="button"
                        (click)="onColorClick(c, $event)"
                        [style.background]="c"
                        class="color-swatch-btn w-7 h-7 rounded-full border-2 transition-all duration-150"
                        [class.border-slate-900]="selectedColor() === c"
                        [class.dark:border-white]="selectedColor() === c"
                        [class.ring-2]="selectedColor() === c"
                        [class.ring-sky-500]="selectedColor() === c"
                        [class.border-transparent]="selectedColor() !== c"
                      ></button>
                    }
                  </div>
                  <div class="flex items-center gap-2">
                    <label class="text-xs text-slate-500 dark:text-slate-400 font-medium">{{ i18n.currentLang() === 'kh' ? 'ពណ៌ផ្ទាល់ខ្លួន:' : 'Custom:' }}</label>
                    <input
                      type="color"
                      [value]="selectedColor()"
                      (input)="onColorClick($any($event.target).value)"
                      class="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer p-0"
                    />
                    <span class="text-xs text-slate-400 font-mono">{{ selectedColor() }}</span>
                  </div>
                </div>
              }

              <p class="text-[11px] text-slate-400 mt-2">
                {{ i18n.currentLang() === 'kh' ? 'គំរូនឹងផ្លាស់ប្តូរពណ៌ភ្លាមៗនៅពេលអ្នកជ្រើសរើស។' : 'Preview updates instantly with smooth spring physics.' }}
              </p>
            </div>

            <!-- Rating Section -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-sky-400 mb-2">
                {{ i18n.currentLang() === 'kh' ? 'វាយតម្លៃគំរូនេះ' : 'Rate this template' }}
              </p>
              <div class="flex items-center gap-1.5">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                  <button 
                    type="button" 
                    (click)="onRateClick(star, $event)" 
                    class="star-btn p-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10 transition active:scale-90"
                    [attr.aria-label]="'Rate ' + star + ' stars'"
                  >
                    <lucide-icon
                      [img]="Star"
                      class="w-6 h-6 transition-all"
                      [class.fill-amber-400]="star <= (userRating() ?? 0)"
                      [class.text-amber-400]="star <= (userRating() ?? 0)"
                      [class.text-slate-300]="star > (userRating() ?? 0)"
                      [class.dark:text-slate-600]="star > (userRating() ?? 0)"
                    />
                  </button>
                }
                <span class="ml-2 text-xs font-bold text-slate-500 dark:text-sky-300">{{ t.avgRating }} avg</span>
              </div>
            </div>

            <!-- Primary Action Button -->
            <button
              type="button"
              (click)="onUseTemplateClick(t, $event)"
              [disabled]="isCreating()"
              class="btn-use-template group w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 hover:from-sky-500 hover:via-indigo-500 hover:to-sky-600 text-white font-bold text-sm shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              @if (isCreating()) {
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ i18n.currentLang() === 'kh' ? 'កំពុងបង្កើត...' : 'Creating your CV...' }}</span>
              } @else {
                <span>{{ i18n.currentLang() === 'kh' ? 'ប្រើប្រាស់គំរូនេះ' : 'Use This Template' }}</span>
                <lucide-icon [img]="ArrowRight" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              }
            </button>
          </div>
        </div>

        <!-- Mobile Floating Sticky Action Bar -->
        <div class="xl:hidden fixed bottom-24 sm:bottom-20 inset-x-3 z-[60] pointer-events-auto">
          <div class="max-w-md mx-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-2.5 border border-slate-200/90 dark:border-slate-700/90 shadow-2xl flex items-center justify-between gap-3 animate-scale-up">
            <div class="flex items-center gap-2.5 min-w-0 pl-1">
              <span class="w-3.5 h-3.5 rounded-full border border-white shadow-xs shrink-0 transition-transform hover:scale-125" [style.background]="selectedColor()"></span>
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ t.name }}</p>
                <span class="text-[10px] text-slate-400 dark:text-slate-400 font-medium">{{ i18n.currentLang() === 'kh' ? 'រួចរាល់សម្រាប់កែសម្រួល' : 'Ready to customize' }}</span>
              </div>
            </div>

            <button
              type="button"
              (click)="onUseTemplateClick(t, $event)"
              [disabled]="isCreating()"
              class="btn-use-template group px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs shadow-md shadow-sky-500/25 flex items-center gap-1.5 shrink-0 active:scale-95 transition-all disabled:opacity-60"
            >
              @if (isCreating()) {
                <span class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ i18n.currentLang() === 'kh' ? 'កំពុងបង្កើត...' : 'Creating...' }}</span>
              } @else {
                <span>{{ i18n.currentLang() === 'kh' ? 'ប្រើគំរូនេះ' : 'Use Template' }}</span>
                <lucide-icon [img]="ArrowRight" class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              }
            </button>
          </div>
        </div>
      </section>
    }

    <!-- Not Approved Alert (iOS style) -->
    @if (showNotApprovedAlert()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
           (click)="showNotApprovedAlert.set(false)">
        <div class="w-full max-w-xs rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden animate-scale-up"
             (click)="$event.stopPropagation()">
          <div class="px-6 pt-6 pb-4 text-center">
            <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p class="font-semibold text-slate-800 dark:text-white text-base">
              {{ i18n.currentLang() === 'kh' ? 'ការអនុញ្ញាតមានកម្រិត' : 'Access Restricted' }}
            </p>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {{ i18n.currentLang() === 'kh' ? 'គណនីរបស់អ្នកមិនទាន់ទទួលបានការអនុញ្ញាតនៅឡើយទេ។ សូមរង់ចាំអ្នកគ្រប់គ្រងបើកសិទ្ធិប្រើប្រាស់គំរូ។' : 'Your account is not yet approved. Please wait for the admin to grant you access to use templates.' }}
            </p>
          </div>
          <div class="border-t border-slate-200 dark:border-slate-700">
            <button type="button" (click)="showNotApprovedAlert.set(false)"
                    class="w-full py-3 text-sky-600 dark:text-sky-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              {{ i18n.currentLang() === 'kh' ? 'យល់ព្រម' : 'OK' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .a4-wrap {
        width: 210mm;
        min-width: 210mm;
        box-sizing: border-box;
        box-shadow: 0 16px 48px -12px rgba(15, 23, 42, 0.16), 0 4px 16px -2px rgba(15, 23, 42, 0.06);
        background: #ffffff;
        border-radius: 6px;
        transform-origin: top center;
        transition: zoom 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .cv-stage-scroll {
        -webkit-overflow-scrolling: touch;
      }
      .color-swatch-btn {
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease;
      }
      .color-swatch-btn:hover {
        transform: scale(1.18) translateY(-2px);
        box-shadow: 0 8px 18px -2px rgba(0, 0, 0, 0.25);
      }
      .color-swatch-btn:active {
        transform: scale(0.9);
      }
      .star-btn {
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .star-btn:hover {
        transform: scale(1.22);
      }
      .btn-use-template {
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease;
      }
      .btn-use-template:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 12px 28px -4px rgba(3, 105, 161, 0.35);
      }
      .btn-use-template:active {
        transform: scale(0.96);
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
    `
  ],
})
export class TemplatePreviewComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly Star = Star;
  readonly ArrowLeft = ArrowLeft;
  readonly Plus = Plus;
  readonly Minus = Minus;
  readonly ArrowRight = ArrowRight;
  readonly Sparkles = Sparkles;
  readonly demo = DEMO_CV;
  readonly i18n = inject(TranslationService);

  private _previewStage?: ElementRef<HTMLElement>;
  @ViewChild('previewStage') set previewStage(el: ElementRef<HTMLElement> | undefined) {
    this._previewStage = el;
    if (el?.nativeElement) {
      this.setupResizeObserver(el.nativeElement);
      this.updateContainerWidth();
    }
  }
  get previewStage(): ElementRef<HTMLElement> | undefined {
    return this._previewStage;
  }

  template = signal<CvTemplate | null>(null);
  selectedColor = signal<string>('#667B97');
  userRating = signal<number | null>(null);
  showColorPicker = signal(false);
  showNotApprovedAlert = signal(false);
  isCreating = signal(false);

  // Dynamic A4 responsive scaling signals
  readonly A4_WIDTH_PX = 793.7;
  containerWidth = signal<number>(typeof window !== 'undefined' ? window.innerWidth : 800);
  isAutoFit = signal<boolean>(true);
  zoomLevel = signal<number>(1);

  fitScale = computed(() => {
    let w = this.containerWidth();
    if (typeof window !== 'undefined' && w > window.innerWidth) {
      w = window.innerWidth;
    }
    // Padding inside scroll container
    const pad = w < 480 ? 20 : (w < 768 ? 32 : 56);
    const usable = Math.max(240, w - pad);
    if (usable >= this.A4_WIDTH_PX) return 1;
    return Math.min(1, Math.max(0.28, Number((usable / this.A4_WIDTH_PX).toFixed(3))));
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

  private setupResizeObserver(el: HTMLElement) {
    this.resizeObserver?.disconnect();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          if (width > 0) {
            this.containerWidth.set(width);
          }
        }
      });
      this.resizeObserver.observe(el);
    }
  }

  moreColors = [
    '#1a5f5a', '#0f4c81', '#2c3e50', '#1b3a5c', '#334155', '#0369a1',
    '#7b2d8b', '#6b4c9a', '#4c1d95', '#7c3aed', '#ec4899', '#be185d',
    '#dc2626', '#c0392b', '#ea580c', '#d97706', '#ca8a04', '#65a30d',
    '#16a34a', '#059669', '#0d9488', '#0891b2', '#0284c7', '#1d4ed8',
    '#5a6a7a', '#667B97', '#163E63', '#1e293b', '#374151', '#4b5563',
    '#6b7280', '#78716c', '#8b5e3c', '#92400e', '#713f12', '#365314',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const qColor = this.route.snapshot.queryParamMap.get('color');

    this.http.get<{ template: any }>(`/api/v1/templates/${id}`).subscribe(({ template }) => {
      const colors =
        typeof template.default_colors === 'string'
          ? JSON.parse(template.default_colors || '[]')
          : template.defaultColors || template.default_colors || [];
      const name = (template.name as string).toLowerCase();
      const layout: CvTemplate['layout'] = name.includes('graphite')
        ? 'graphite-banner-timeline'
        : name.includes('minimalist framed')
        ? 'minimalist-framed'
        : name.includes('navy badge') || name.includes('sokaiya')
        ? 'navy-badge'
        : name.includes('navy sidebar')
        ? 'navy-sidebar-profile'
        : name.includes('slate rounded')
        ? 'slate-rounded-panels'
        : name.includes('warm taupe')
        ? 'warm-taupe-timeline'
        : name.includes('modern accent') || name.includes('sidebar cover')
        ? 'sidebar-cover-letter'
        : name.includes('minimalist') || name.includes('to-from')
        ? 'minimalist-cover-letter'
        : name.includes('border') || name.includes('framed')
        ? 'framed-cover-letter'
        : name.includes('cover')
        ? 'cover-letter'
        : name.includes('formal')
        ? 'formal-classic'
        : name.includes('classic')
        ? 'classic-dark'
        : name.includes('elegant')
        ? 'elegant-frame'
        : name.includes('clean')
        ? 'clean-sidebar'
        : name.includes('modern')
        ? 'modern-split'
        : 'professional';

      const normalized: CvTemplate = {
        id: String(template.id),
        name: template.name,
        description: template.description,
        thumbnailUrl: template.thumbnail_url || template.thumbnailUrl,
        defaultColors: Array.isArray(colors) && colors.length ? colors : ['#667B97', '#163E63', '#0284C7', '#334155'],
        avgRating: template.avg_rating ?? template.avgRating ?? 0,
        layout,
      };
      this.template.set(normalized);

      if (qColor && normalized.defaultColors.some((c) => c.toLowerCase() === qColor.toLowerCase())) {
        this.selectedColor.set(qColor);
      } else if (normalized.defaultColors.length) {
        this.selectedColor.set(normalized.defaultColors[0]);
      }
    });
  }

  ngAfterViewInit() {
    this.updateContainerWidth();
    if (typeof ResizeObserver !== 'undefined' && this.previewStage?.nativeElement) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          if (width > 0) {
            this.containerWidth.set(width);
          }
        }
      });
      this.resizeObserver.observe(this.previewStage.nativeElement);
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
    if (this.previewStage?.nativeElement) {
      const width = this.previewStage.nativeElement.clientWidth;
      if (width > 0) {
        this.containerWidth.set(width);
      }
    }
  }

  back() {
    this.router.navigate(['/templates']);
  }

  isCoverLetter(t: CvTemplate): boolean {
    return t.layout.includes('cover') || t.name.toLowerCase().includes('cover');
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

  onColorClick(color: string, event?: MouseEvent) {
    this.selectedColor.set(color);

    // GSAP click pop animation on the clicked swatch
    if (event?.currentTarget) {
      gsap.fromTo(
        event.currentTarget,
        { scale: 0.82 },
        { scale: 1.15, duration: 0.32, ease: 'back.out(2.5)' }
      );
    }

    // Soft feedback pulse on the CV paper
    const paper = this.previewStage?.nativeElement.querySelector('.a4-wrap');
    if (paper) {
      gsap.fromTo(
        paper,
        { filter: 'brightness(1.06)' },
        { filter: 'brightness(1)', duration: 0.3, ease: 'power2.out' }
      );
    }
  }

  onRateClick(stars: number, event?: MouseEvent) {
    this.userRating.set(stars);
    const t = this.template();
    if (!t) return;
    this.http.post(`/api/v1/templates/${t.id}/reviews`, { rating: stars }).subscribe();

    // GSAP bounce trigger on star icon
    if (event?.currentTarget) {
      gsap.fromTo(
        event.currentTarget,
        { scale: 0.7, rotate: -15 },
        { scale: 1.25, rotate: 0, duration: 0.35, ease: 'elastic.out(1.2, 0.4)' }
      );
    }
  }

  onUseTemplateClick(t: CvTemplate, event?: MouseEvent) {
    if (event?.currentTarget) {
      gsap.fromTo(
        event.currentTarget,
        { scale: 0.93 },
        { scale: 1, duration: 0.22, ease: 'back.out(2)' }
      );
    }
    this.useTemplate(t);
  }

  useTemplate(t: CvTemplate) {
    // Check if user is approved (only unapproved staff are restricted)
    const user = this.auth.currentUser();
    if (user && user.role === 'staff' && !user.isApproved) {
      this.showNotApprovedAlert.set(true);
      return;
    }

    const returnUrl = `/templates/preview/${t.id}?color=${encodeURIComponent(this.selectedColor())}`;
    if (!this.auth.currentUser()) {
      if (!this.auth.requireLoginOrRedirect(returnUrl)) {
        return;
      }
    }

    if (this.isCreating()) return;
    this.isCreating.set(true);

    const goToWorkstation = (cvId?: string | number) => {
      this.router.navigate(['/make-cv'], {
        queryParams: {
          templateId: t.id,
          ...(cvId ? { cvId } : {}),
          color: this.selectedColor(),
          layout: t.layout,
        },
      }).finally(() => {
        this.isCreating.set(false);
      });
    };

    this.http
      .post<{ cvId: string; cv?: { id: string | number } }>(`/api/v1/templates/${t.id}/select`, {
        selectedColor: this.selectedColor(),
      })
      .subscribe({
        next: (res) => {
          const cvId = res.cvId ?? res.cv?.id;
          goToWorkstation(cvId);
        },
        error: (err) => {
          if (err.error?.error === 'NOT_APPROVED') {
            this.isCreating.set(false);
            this.showNotApprovedAlert.set(true);
            return;
          }
          if (err.status === 401) {
            this.isCreating.set(false);
            this.auth.requireLoginOrRedirect(returnUrl);
            return;
          }
          this.http.post<{ cv: { id: string | number } }>('/api/v1/cvs', { templateId: t.id }).subscribe({
            next: ({ cv }) => {
              goToWorkstation(cv.id);
            },
            error: (e2) => {
              if (e2.error?.error === 'NOT_APPROVED') {
                this.isCreating.set(false);
                this.showNotApprovedAlert.set(true);
              } else if (e2.status === 401) {
                this.isCreating.set(false);
                this.auth.requireLoginOrRedirect(returnUrl);
              } else {
                // Fail-safe: navigate to /make-cv directly so user is never blocked
                goToWorkstation();
              }
            },
          });
        },
      });
  }
}
