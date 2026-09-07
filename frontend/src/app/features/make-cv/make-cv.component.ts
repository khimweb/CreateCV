import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener, inject, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import gsap from 'gsap';
import {
  LucideAngularModule,
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  Star,
  Languages,
  Award,
  FolderKanban,
  Palette,
  Download,
  Save,
  Eye,
  Upload,
  X,
  Trash2,
  Plus,
  Type,
  Bold,
  Minus,
  AlignJustify,
  Pencil,
} from 'lucide-angular';
import { TranslationService } from '../../core/services/translation.service';
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
import { ToastService } from '../../shared/components/toast/toast.service';
import { PREVIEW_PLACEHOLDER } from '../../shared/preview-placeholders';
import { PptxExportService } from '../../shared/services/pptx-export.service';
import { AuthService } from '../../core/services/auth.service';
import { WatermarkComponent } from '../../shared/components/watermark/watermark.component';
import { KhqrPaymentModalComponent } from '../../shared/components/khqr-payment-modal/khqr-payment-modal.component';
import {
  DEGREES,
  FIELDS_OF_STUDY,
  FONT_FAMILIES,
  FONT_WEIGHTS,
  INSTITUTIONS,
  JOB_TITLES,
  LANGUAGE_OPTIONS,
  LINE_HEIGHTS,
  LOCATIONS,
  MONTHS,
  SKILL_SUGGESTIONS,
  yearOptions,
} from '../../shared/cv-field-options';

const SKILL_LEVELS = ['Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'] as const;
const LANG_LEVELS = ['Beginner', 'Intermediate', 'Fluent', 'Native'] as const;
const ACCENT_PALETTE = [
  { label: 'Navy', value: '#0F3D64' },
  { label: 'Royal blue', value: '#2563EB' },
  { label: 'Teal', value: '#0F766E' },
  { label: 'Emerald', value: '#15803D' },
  { label: 'Burgundy', value: '#9F1239' },
  { label: 'Terracotta', value: '#C2410C' },
  { label: 'Plum', value: '#7E22CE' },
  { label: 'Charcoal', value: '#374151' },
];

@Component({
  selector: 'app-make-cv',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
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
    MinimalistFramedCvComponent,
    WatermarkComponent,
    KhqrPaymentModalComponent
  ],
  template: `
    <main class="min-h-screen bg-transparent pt-24 sm:pt-28 md:pt-32 pb-28 px-2.5 sm:px-6">
      <!-- Mobile & Tablet View Mode Bar (Edit Form vs Live Preview) -->
      <div class="xl:hidden max-w-4xl mx-auto flex items-center justify-between gap-3 mb-4">
        <a class="text-xs font-semibold text-slate-500 hover:text-sky-600 transition flex items-center gap-1" href="/templates">
          ← {{ i18n.currentLang() === 'kh' ? 'ត្រឡប់ទៅផ្ទាំងគំរូ' : 'Back to Templates' }}
        </a>
        
        <div class="inline-flex items-center p-1 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 shadow-sm">
          <button
            type="button"
            (click)="viewMode.set('edit')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            [class.bg-sky-600]="viewMode() === 'edit'"
            [class.text-white]="viewMode() === 'edit'"
            [class.shadow-xs]="viewMode() === 'edit'"
            [class.text-slate-600]="viewMode() !== 'edit'"
            [class.dark:text-slate-300]="viewMode() !== 'edit'"
          >
            <lucide-icon [img]="Pencil" class="w-3.5 h-3.5" />
            <span>{{ i18n.currentLang() === 'kh' ? 'កែសម្រួល' : 'Edit Form' }}</span>
          </button>
          <button
            type="button"
            (click)="viewMode.set('preview'); onPreviewModeEnter()"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            [class.bg-emerald-600]="viewMode() === 'preview'"
            [class.text-white]="viewMode() === 'preview'"
            [class.shadow-xs]="viewMode() === 'preview'"
            [class.text-slate-600]="viewMode() !== 'preview'"
            [class.dark:text-slate-300]="viewMode() !== 'preview'"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <lucide-icon [img]="Eye" class="w-3.5 h-3.5" />
            <span>{{ i18n.currentLang() === 'kh' ? 'មើលផ្ទាល់' : 'Live Preview' }}</span>
          </button>
        </div>
      </div>

      <div class="max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-[100px_minmax(0,1fr)_420px] gap-5 xl:gap-7">
        <!-- Desktop Left Sidebar (Only visible on XL screens >= 1280px) -->
        <aside class="hidden xl:flex flex-col gap-2 sticky top-28 h-fit">
          @for (item of steps; track item.key) {
            @if (!item.coverOnly || isCoverLetter()) {
            <button type="button" (click)="active.set(item.key)" class="step" [class.selected]="active() === item.key"
              title="Click to navigate · Double-click label to rename">
              <lucide-icon [img]="item.icon" />
              @if (editingLabelKey() === item.key) {
                <input #labelInput class="step-label-input"
                  [value]="labelFor(item.key)"
                  (blur)="finishEditLabel(item.key, labelInput)"
                  (keydown.enter)="finishEditLabel(item.key, labelInput)"
                  (keydown.escape)="editingLabelKey.set(null)"
                  (click)="$event.stopPropagation()"
                  autofocus />
              } @else {
                <span class="step-label-wrap">
                  <span class="step-label-text">{{ labelFor(item.key) }}</span>
                  <span class="step-edit-icon" (click)="startEditLabel(item.key, $event)" title="Rename section">✎</span>
                </span>
              }
              <div class="flex items-center gap-1 mt-0.5 opacity-60 hover:opacity-100 transition" (click)="$event.stopPropagation()">
                <button type="button" class="step-arrow-btn" [disabled]="!canMoveUp(item.key)" (click)="moveSection(item.key, -1)" title="Move section up">▲</button>
                <button type="button" class="step-arrow-btn" [disabled]="!canMoveDown(item.key)" (click)="moveSection(item.key, 1)" title="Move section down">▼</button>
              </div>
            </button>
            }
          }
        </aside>

        <section class="min-w-0" [class.hidden]="viewMode() === 'preview'" [class.xl:block]="true">
        <!-- Modern Single Responsive Steps Navigation (Only on screens < xl) -->
        <div class="xl:hidden sticky top-16 sm:top-20 z-30 mb-5 -mx-1 sm:mx-0">
          <div class="p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-md shadow-slate-900/5 flex gap-1.5 overflow-x-auto scrollbar-none scroll-smooth py-1.5 px-2">
            @for (item of steps; track item.key) {
              @if (!item.coverOnly || isCoverLetter()) {
                <button
                  type="button"
                  (click)="onStepClick(item.key, $event)"
                  class="step-chip-btn flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer select-none"
                  [class.active-chip]="active() === item.key"
                  [class.inactive-chip]="active() !== item.key">
                  @if (active() === item.key) {
                    <span class="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>
                  }
                  <lucide-icon [img]="item.icon" class="w-3.5 h-3.5" />
                  <span>{{ labelFor(item.key) }}</span>
                </button>
              }
            }
          </div>
        </div>
          <a class="hidden xl:inline text-sm text-slate-500 hover:text-sky-600 transition" href="/templates">← Back to Templates</a>
          <div class="flex justify-between items-center mt-2 mb-6">
            <h1 class="text-2xl sm:text-3xl font-bold dark:text-white">Build Your CV</h1>
            <span class="hidden sm:block text-sm font-bold text-emerald-600">Live form · Save Draft stores everything</span>
          </div>

          <form [formGroup]="form" class="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
            @if (active() === 'Personal Information') {
              <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white shrink-0"><lucide-icon [img]="UserRound" /></span>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      class="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded px-1.5 py-0.5 outline-none transition w-full max-w-md"
                      [value]="labelFor('Personal Information')"
                      (input)="onLabelInput('Personal Information', $event)"
                      placeholder="Personal Information"
                      title="Click to rename this section"
                    />
                    
                    <span class="text-xs text-slate-400 font-normal shrink-0 hidden sm:inline">✎ Rename</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button type="button"
                          [disabled]="!canMoveUp('Personal Information')"
                          (click)="moveSection('Personal Information', -1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section up in the CV">
                    ▲ Move Up
                  </button>
                  <button type="button"
                          [disabled]="!canMoveDown('Personal Information')"
                          (click)="moveSection('Personal Information', 1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section down in the CV">
                    ▼ Move Down
                  </button>
                </div>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)" title="Decrease font size">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)" title="Increase font size">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" [ngModelOptions]="{ standalone: true }" title="Font family">
                  @for (f of fontFamilies; track f.value) {
                    <option [value]="f.value">{{ f.label }}</option>
                  }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" [ngModelOptions]="{ standalone: true }" title="Weight">
                  @for (w of fontWeights; track w.value) {
                    <option [value]="w.value">{{ w.label }}</option>
                  }
                </select>
              </div>
              <div class="flex items-center gap-4 mb-4">
                <div class="h-20 w-20 rounded-full overflow-hidden bg-slate-100 grid place-items-center border-2 border-sky-900 shrink-0">
                  @if (photoUrl()) {
                    <img [src]="photoUrl()!" class="h-full w-full object-cover" alt="Photo" />
                  } @else {
                    <lucide-icon [img]="UserRound" />
                  }
                </div>
                <label class="upload">
                  <lucide-icon [img]="Upload" /> Choose profile photo
                  <input type="file" accept="image/png,image/jpeg,image/webp" (change)="selectPhoto($event)" hidden />
                </label>
                @if (photoUrl()) {
                  <button type="button" class="text-sm text-red-600 font-medium" (click)="photoUrl.set(null)">Remove</button>
                }
              </div>
              <div class="grid sm:grid-cols-2 gap-5">
                <label>Full name *<input formControlName="fullName" placeholder="Your name" list="name-hints" /></label>
                <label
                  >Job title
                  <input formControlName="jobTitle" placeholder="Select or type…" list="job-titles" />
                </label>
                <label>Email address<input formControlName="email" type="email" placeholder="you@example.com" /></label>
                <label>Phone number<input formControlName="phone" placeholder="+855 12 345 678" /></label>
                <label
                  >Location
                  <input formControlName="location" placeholder="Select or type…" list="locations" />
                </label>
                <label>LinkedIn / GitHub (optional)<input formControlName="linkedin" placeholder="linkedin.com/in/you" /></label>
                @if (layout() === 'navy-badge') {
                  <label>Date of Birth (DOB)<input formControlName="dob" placeholder="January 06, 2005" /></label>
                  <label>Height<input formControlName="height" placeholder="1.60m" /></label>
                  <label>Marital Status<input formControlName="maritalStatus" placeholder="Single" /></label>
                }
              </div>
              <label class="block">Professional summary<textarea formControlName="summary" rows="5" placeholder="Write a short professional summary..."></textarea></label>
            }

            @if (active() === 'Cover Letter') {
              <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white shrink-0"><lucide-icon [img]="Award" /></span>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      class="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded px-1.5 py-0.5 outline-none transition w-full max-w-md"
                      [value]="labelFor('Cover Letter')"
                      (input)="onLabelInput('Cover Letter', $event)"
                      placeholder="Cover Letter"
                      title="Click to rename this section"
                    />
                    
                    <span class="text-xs text-slate-400 font-normal shrink-0 hidden sm:inline">✎ Rename</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button type="button"
                          [disabled]="!canMoveUp('Cover Letter')"
                          (click)="moveSection('Cover Letter', -1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section up in the CV">
                    ▲ Move Up
                  </button>
                  <button type="button"
                          [disabled]="!canMoveDown('Cover Letter')"
                          (click)="moveSection('Cover Letter', 1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section down in the CV">
                    ▼ Move Down
                  </button>
                </div>
              </div>
              <p class="text-sm text-slate-500 mb-4">These fields apply to Cover Letter templates.</p>
              <div class="grid sm:grid-cols-2 gap-5">
                <label>Recipient Name<input formControlName="recipientName" placeholder="Gabriel Vince" /></label>
                <label>Recipient Company / Department<input formControlName="recipientDept" placeholder="London Bridge Support Services" /></label>
              </div>
              <div class="grid sm:grid-cols-2 gap-5 mt-4">
                <label>Greeting<input formControlName="greeting" placeholder="Dear Mr. Vince," /></label>
                <label>Closing<input formControlName="closing" placeholder="Regards" /></label>
              </div>
              <div class="mt-4">
                <label>Subject (optional)<input formControlName="subject" placeholder="Application for Internship position" /></label>
              </div>
              <label class="block mt-4">Cover Letter Body<textarea formControlName="summary" rows="12" placeholder="Write your cover letter body text here. Use blank lines to separate paragraphs."></textarea></label>
            }

            @if (active() === 'Education') {
              <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white shrink-0"><lucide-icon [img]="GraduationCap" /></span>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      class="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded px-1.5 py-0.5 outline-none transition w-full max-w-md"
                      [value]="labelFor('Education')"
                      (input)="onLabelInput('Education', $event)"
                      placeholder="Education"
                      title="Click to rename this section"
                    />
                    
                    <span class="text-xs text-slate-400 font-normal shrink-0 hidden sm:inline">✎ Rename</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button type="button"
                          [disabled]="!canMoveUp('Education')"
                          (click)="moveSection('Education', -1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section up in the CV">
                    ▲ Move Up
                  </button>
                  <button type="button"
                          [disabled]="!canMoveDown('Education')"
                          (click)="moveSection('Education', 1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section down in the CV">
                    ▼ Move Down
                  </button>
                </div>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" [ngModelOptions]="{ standalone: true }">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" [ngModelOptions]="{ standalone: true }">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="space-y-3">
                @if (education.length > 0) {
                  <div class="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-sm transition">
                    <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
                      <input type="checkbox"
                        [checked]="isAllSelected('education', education.length)"
                        (change)="toggleSelectAll('education', education.length)"
                        class="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer" />
                      <span>Select All ({{ education.length }})</span>
                    </label>

                    @if (selectedCount('education') > 0) {
                      <button type="button"
                        (click)="deleteSelected('education')"
                        class="flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg font-medium text-xs transition active:scale-95 shadow-sm">
                        <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" />
                        <span>Delete Selected ({{ selectedCount('education') }})</span>
                      </button>
                    }
                  </div>
                }

                <div formArrayName="education" class="space-y-4">
                  @for (ed of education.controls; track ed; let i = $index) {
                    <div [formGroupName]="i"
                         class="card-block group transition-all duration-200 hover:shadow-md hover:border-sky-300"
                         draggable="true"
                         (dragstart)="onDragStart($event, 'edu', 0, i)"
                         (dragover)="onDragOver($event)"
                         (drop)="onDrop($event, 'edu', 0, i)"
                         (dragend)="onDragEnd($event)">
                      <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                          <input type="checkbox"
                                 [checked]="isSelected('education', i)"
                                 (change)="toggleSelect('education', i)"
                                 class="w-4 h-4 rounded border-slate-300 text-sky-600 cursor-pointer" />
                          <div class="flex flex-col gap-0.5 items-center">
                            <span class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 px-0.5 text-xs select-none" title="Hold & drag to reorder">⋮⋮</span>
                            <button type="button" class="reorder-btn" [disabled]="i === 0" (click)="moveEducation(i, -1)" title="Move up">↑</button>
                            <button type="button" class="reorder-btn" [disabled]="i === education.length - 1" (click)="moveEducation(i, 1)" title="Move down">↓</button>
                          </div>
                          <h3 class="font-bold text-lg">Education {{ i + 1 }}<span class="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1.5" *ngIf="ed.value.institution || ed.value.degree">— {{ ed.value.institution || ed.value.degree }}</span></h3>
                        </div>
                        <button type="button" class="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition active:scale-95" (click)="removeEducation(i)">
                          <lucide-icon [img]="Trash2" class="w-4 h-4" />
                        </button>
                      </div>
                    <div class="grid sm:grid-cols-2 gap-4">
                      <label
                        >Institution / School *
                        <input formControlName="institution" list="institutions" placeholder="Select or type…" />
                      </label>
                      <label
                        >Degree *
                        <input formControlName="degree" list="degree-options" placeholder="Select or type…" />
                      </label>
                    </div>
                    <label class="block mt-3"
                      >Field of Study
                      <input formControlName="field" list="fields-of-study" placeholder="Select or type a field…" />
                    </label>
                    <div class="grid sm:grid-cols-2 gap-4 mt-3">
                      <label
                        >Start Year *
                        <input formControlName="startYear" list="year-options" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="Select or type year…" />
                      </label>
                      <label
                        >End Year
                        <input formControlName="endYear" list="year-options" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="Select or type year…" [disabled]="ed.get('current')?.value" />
                      </label>
                    </div>
                    <label class="check mt-3">
                      <input type="checkbox" formControlName="current" (change)="onCurrentEdu(i)" /> Currently studying here
                    </label>
                    <label class="block mt-3">GPA (Optional)<input formControlName="gpa" placeholder="3.5 / 4.0" /></label>
                    <label class="block mt-3"
                      >Description (Optional)<textarea formControlName="description" rows="3" placeholder="Coursework, honors…"></textarea
                    ></label>
                  </div>
                }
              </div>
              </div>
              <button type="button" class="add-dashed" (click)="addEducation()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Education</button>
            }

            @if (active() === 'Work Experience') {
              <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white shrink-0"><lucide-icon [img]="BriefcaseBusiness" /></span>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      class="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded px-1.5 py-0.5 outline-none transition w-full max-w-md"
                      [value]="labelFor('Work Experience')"
                      (input)="onLabelInput('Work Experience', $event)"
                      placeholder="Work Experience"
                      title="Click to rename this section"
                    />
                    
                    <span class="text-xs text-slate-400 font-normal shrink-0 hidden sm:inline">✎ Rename</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button type="button"
                          [disabled]="!canMoveUp('Work Experience')"
                          (click)="moveSection('Work Experience', -1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section up in the CV">
                    ▲ Move Up
                  </button>
                  <button type="button"
                          [disabled]="!canMoveDown('Work Experience')"
                          (click)="moveSection('Work Experience', 1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section down in the CV">
                    ▼ Move Down
                  </button>
                </div>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" [ngModelOptions]="{ standalone: true }">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" [ngModelOptions]="{ standalone: true }">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="space-y-3">
                @if (experience.length > 0) {
                  <div class="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-sm transition">
                    <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
                      <input type="checkbox"
                        [checked]="isAllSelected('experience', experience.length)"
                        (change)="toggleSelectAll('experience', experience.length)"
                        class="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer" />
                      <span>Select All ({{ experience.length }})</span>
                    </label>

                    @if (selectedCount('experience') > 0) {
                      <button type="button"
                        (click)="deleteSelected('experience')"
                        class="flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg font-medium text-xs transition active:scale-95 shadow-sm">
                        <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" />
                        <span>Delete Selected ({{ selectedCount('experience') }})</span>
                      </button>
                    }
                  </div>
                }

                <div formArrayName="experience" class="space-y-4">
                  @for (job of experience.controls; track job; let i = $index) {
                    <div [formGroupName]="i"
                         class="card-block group transition-all duration-200 hover:shadow-md hover:border-sky-300"
                         draggable="true"
                         (dragstart)="onDragStart($event, 'exp', 0, i)"
                         (dragover)="onDragOver($event)"
                         (drop)="onDrop($event, 'exp', 0, i)"
                         (dragend)="onDragEnd($event)">
                      <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2">
                          <input type="checkbox"
                                 [checked]="isSelected('experience', i)"
                                 (change)="toggleSelect('experience', i)"
                                 class="w-4 h-4 rounded border-slate-300 text-sky-600 cursor-pointer" />
                          <div class="flex flex-col gap-0.5 items-center">
                            <span class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 px-0.5 text-xs select-none" title="Hold & drag to reorder">⋮⋮</span>
                            <button type="button" class="reorder-btn" [disabled]="i === 0" (click)="moveExperience(i, -1)" title="Move up">↑</button>
                            <button type="button" class="reorder-btn" [disabled]="i === experience.length - 1" (click)="moveExperience(i, 1)" title="Move down">↓</button>
                          </div>
                          <h3 class="font-bold text-lg">Work Experience {{ i + 1 }}<span class="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1.5" *ngIf="job.value.company || job.value.position">— {{ job.value.company || job.value.position }}</span></h3>
                        </div>
                        <button type="button" class="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition active:scale-95" (click)="removeExperience(i)">
                          <lucide-icon [img]="Trash2" class="w-4 h-4" />
                        </button>
                      </div>
                    <div class="grid sm:grid-cols-2 gap-4">
                      <label>Company Name *<input formControlName="company" placeholder="Company name" list="companies" /></label>
                      <label
                        >Job Title / Position *
                        <input formControlName="position" list="job-titles" placeholder="Select or type…" />
                      </label>
                    </div>
                    <div class="grid sm:grid-cols-2 gap-4 mt-3">
                      <label
                        >Start Date *
                        <div class="date-row">
                          <select formControlName="startMonth">
                            <option value="">Month</option>
                            @for (m of months; track m) {
                              <option [value]="m">{{ m }}</option>
                            }
                          </select>
                          <input formControlName="startYear" list="year-options" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="Select or type year…" />
                        </div>
                      </label>
                      <label
                        >End Date
                        <div class="date-row">
                          <select formControlName="endMonth" [disabled]="job.get('current')?.value">
                            <option value="">Month</option>
                            @for (m of months; track m) {
                              <option [value]="m">{{ m }}</option>
                            }
                          </select>
                          <input formControlName="endYear" list="year-options" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="Select or type year…" [disabled]="job.get('current')?.value" />
                        </div>
                      </label>
                    </div>
                    <label class="check mt-3">
                      <input type="checkbox" formControlName="current" (change)="onCurrentJob(i)" /> Currently working here
                    </label>
                    <div class="mt-3" formArrayName="responsibilities">
                      <span class="font-semibold text-sm text-slate-700">Responsibilities & Achievements</span>
                      @for (r of responsibilities(i).controls; track r; let ri = $index) {
                        <div class="flex gap-2 mt-2 items-start group transition-all duration-200 rounded-xl p-1 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                             draggable="true"
                             (dragstart)="onDragStart($event, 'resp', i, ri)"
                             (dragover)="onDragOver($event)"
                             (drop)="onDrop($event, 'resp', i, ri)"
                             (dragend)="onDragEnd($event)">
                          <div class="flex flex-col shrink-0 mt-1 gap-0.5 items-center">
                            <span class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 px-0.5 text-xs select-none" title="Hold & drag to reorder">⋮⋮</span>
                            <button type="button" class="reorder-btn" [disabled]="ri === 0" (click)="moveResp(i, ri, -1)" title="Move up">↑</button>
                            <button type="button" class="reorder-btn" [disabled]="ri === responsibilities(i).length - 1" (click)="moveResp(i, ri, 1)" title="Move down">↓</button>
                          </div>
                          <textarea [formControlName]="ri" rows="2" class="flex-1 transition border-slate-200 focus:border-sky-500 rounded-xl" placeholder="Describe a responsibility…"></textarea>
                          <button type="button" class="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 shrink-0 mt-1 transition active:scale-95" (click)="removeResponsibility(i, ri)" title="Delete responsibility">
                            <lucide-icon [img]="Trash2" class="w-4 h-4" />
                          </button>
                        </div>
                      }
                      <button type="button" class="text-sky-800 font-semibold text-sm mt-2" (click)="addResponsibility(i)">+ Add line / responsibility</button>
                    </div>
                  </div>
                }
              </div>
              </div>
              <button type="button" class="add-dashed" (click)="addExperience()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Work Experience</button>
            }

            @if (active() === 'Skills') {
              <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white shrink-0"><lucide-icon [img]="Star" /></span>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      class="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded px-1.5 py-0.5 outline-none transition w-full max-w-md"
                      [value]="labelFor('Skills')"
                      (input)="onLabelInput('Skills', $event)"
                      placeholder="Skills"
                      title="Click to rename this section"
                    />
                    <span class="opt">Optional</span>
                    <span class="text-xs text-slate-400 font-normal shrink-0 hidden sm:inline">✎ Rename</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button type="button"
                          [disabled]="!canMoveUp('Skills')"
                          (click)="moveSection('Skills', -1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section up in the CV">
                    ▲ Move Up
                  </button>
                  <button type="button"
                          [disabled]="!canMoveDown('Skills')"
                          (click)="moveSection('Skills', 1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section down in the CV">
                    ▼ Move Down
                  </button>
                </div>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" [ngModelOptions]="{ standalone: true }">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" [ngModelOptions]="{ standalone: true }">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="card-block">
                <div class="grid sm:grid-cols-2 gap-4 items-start">
                  <label
                    >Skill Name
                    <input [(ngModel)]="skillDraft.name" [ngModelOptions]="{ standalone: true }" list="skills-list" placeholder="Select or type…" />
                  </label>
                  <div>
                    <span class="font-semibold text-sm text-slate-700">Skill Level</span>
                    <div class="flex flex-wrap gap-2 mt-2">
                      @for (lv of skillLevels; track lv) {
                        <button type="button" class="chip" [class.on]="skillDraft.level === lv" (click)="skillDraft.level = lv">{{ lv }}</button>
                      }
                    </div>
                  </div>
                </div>
                <button type="button" class="add-solid mt-4" (click)="addSkill()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Skill</button>
              </div>
              <div class="space-y-3">
                @if (skills.length > 0) {
                  <div class="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-sm transition">
                    <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
                      <input type="checkbox"
                        [checked]="isAllSelected('skills', skills.length)"
                        (change)="toggleSelectAll('skills', skills.length)"
                        class="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer" />
                      <span>Select All ({{ skills.length }})</span>
                    </label>

                    @if (selectedCount('skills') > 0) {
                      <button type="button"
                        (click)="deleteSelected('skills')"
                        class="flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg font-medium text-xs transition active:scale-95 shadow-sm">
                        <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" />
                        <span>Delete Selected ({{ selectedCount('skills') }})</span>
                      </button>
                    }
                  </div>
                }

                <div formArrayName="skills" class="space-y-2">
                  @for (s of skills.controls; track s; let i = $index) {
                    <div [formGroupName]="i"
                         class="card-block flex justify-between items-center group transition-all duration-200 hover:shadow-md hover:border-sky-300"
                         draggable="true"
                         (dragstart)="onDragStart($event, 'skill', 0, i)"
                         (dragover)="onDragOver($event)"
                         (drop)="onDrop($event, 'skill', 0, i)"
                         (dragend)="onDragEnd($event)">
                      <div class="flex items-center gap-3 min-w-0 flex-1">
                        <input type="checkbox"
                               [checked]="isSelected('skills', i)"
                               (change)="toggleSelect('skills', i)"
                               class="w-4 h-4 rounded border-slate-300 text-sky-600 cursor-pointer" />
                        <div class="flex flex-col gap-0.5 items-center">
                          <span class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 px-0.5 text-xs select-none" title="Hold & drag to reorder">⋮⋮</span>
                          <button type="button" class="reorder-btn" [disabled]="i === 0" (click)="moveSkill(i, -1)" title="Move up">↑</button>
                          <button type="button" class="reorder-btn" [disabled]="i === skills.length - 1" (click)="moveSkill(i, 1)" title="Move down">↓</button>
                        </div>
                        <div>
                          <p class="font-bold text-slate-800 dark:text-slate-100">{{ s.value.name }}</p>
                          <p class="text-sm text-slate-500">{{ s.value.level }}</p>
                        </div>
                      </div>
                      <button type="button" class="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition active:scale-95" (click)="removeSkill(i)" title="Delete skill">
                        <lucide-icon [img]="Trash2" class="w-4 h-4" />
                      </button>
                    </div>
                  }
                </div>
              </div>
            }

            @if (active() === 'Languages') {
              <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white shrink-0"><lucide-icon [img]="Languages" /></span>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      class="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded px-1.5 py-0.5 outline-none transition w-full max-w-md"
                      [value]="labelFor('Languages')"
                      (input)="onLabelInput('Languages', $event)"
                      placeholder="Languages"
                      title="Click to rename this section"
                    />
                    <span class="opt">Optional</span>
                    <span class="text-xs text-slate-400 font-normal shrink-0 hidden sm:inline">✎ Rename</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button type="button"
                          [disabled]="!canMoveUp('Languages')"
                          (click)="moveSection('Languages', -1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section up in the CV">
                    ▲ Move Up
                  </button>
                  <button type="button"
                          [disabled]="!canMoveDown('Languages')"
                          (click)="moveSection('Languages', 1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section down in the CV">
                    ▼ Move Down
                  </button>
                </div>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" [ngModelOptions]="{ standalone: true }">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" [ngModelOptions]="{ standalone: true }">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="card-block">
                <div class="grid sm:grid-cols-2 gap-4 items-start">
                  <label
                    >Language
                    <input [(ngModel)]="langDraft.name" [ngModelOptions]="{ standalone: true }" list="languages-list" placeholder="Select or type a language…" />
                  </label>
                  <div>
                    <span class="font-semibold text-sm text-slate-700">Proficiency</span>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                      @for (lv of langLevels; track lv) {
                        <button type="button" class="chip" [class.on]="langDraft.proficiency === lv" (click)="langDraft.proficiency = lv">{{ lv }}</button>
                      }
                    </div>
                  </div>
                </div>
                <button type="button" class="add-solid mt-4" (click)="addLanguage()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Language</button>
              </div>
              <div class="space-y-3">
                @if (languages.length > 0) {
                  <div class="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-sm transition">
                    <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
                      <input type="checkbox"
                        [checked]="isAllSelected('languages', languages.length)"
                        (change)="toggleSelectAll('languages', languages.length)"
                        class="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer" />
                      <span>Select All ({{ languages.length }})</span>
                    </label>

                    @if (selectedCount('languages') > 0) {
                      <button type="button"
                        (click)="deleteSelected('languages')"
                        class="flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg font-medium text-xs transition active:scale-95 shadow-sm">
                        <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" />
                        <span>Delete Selected ({{ selectedCount('languages') }})</span>
                      </button>
                    }
                  </div>
                }

                <div formArrayName="languages" class="space-y-3">
                  @for (l of languages.controls; track l; let i = $index) {
                    <div [formGroupName]="i"
                         class="card-block group transition-all duration-200 hover:shadow-md hover:border-sky-300"
                         draggable="true"
                         (dragstart)="onDragStart($event, 'lang', 0, i)"
                         (dragover)="onDragOver($event)"
                         (drop)="onDrop($event, 'lang', 0, i)"
                         (dragend)="onDragEnd($event)">
                      <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center gap-3 min-w-0 flex-1">
                          <input type="checkbox"
                                 [checked]="isSelected('languages', i)"
                                 (change)="toggleSelect('languages', i)"
                                 class="w-4 h-4 rounded border-slate-300 text-sky-600 cursor-pointer" />
                          <div class="flex flex-col gap-0.5 items-center">
                            <span class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 px-0.5 text-xs select-none" title="Hold & drag to reorder">⋮⋮</span>
                            <button type="button" class="reorder-btn" [disabled]="i === 0" (click)="moveLanguage(i, -1)" title="Move up">↑</button>
                            <button type="button" class="reorder-btn" [disabled]="i === languages.length - 1" (click)="moveLanguage(i, 1)" title="Move down">↓</button>
                          </div>
                          <p class="font-bold text-slate-800 dark:text-slate-100">{{ l.value.name }}</p>
                        </div>
                        <button type="button" class="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition active:scale-95" (click)="removeLanguage(i)" title="Delete language">
                          <lucide-icon [img]="Trash2" class="w-4 h-4" />
                        </button>
                      </div>
                      <div class="grid gap-2">
                        @for (lv of langLevels; track lv) {
                          <button type="button" class="level-bar" [class.on]="l.value.proficiency === lv" (click)="l.patchValue({ proficiency: lv })">{{ lv }}</button>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            @if (active() === 'Certifications') {
              <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white shrink-0"><lucide-icon [img]="Award" /></span>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      class="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded px-1.5 py-0.5 outline-none transition w-full max-w-md"
                      [value]="labelFor('Certifications')"
                      (input)="onLabelInput('Certifications', $event)"
                      placeholder="Certifications"
                      title="Click to rename this section"
                    />
                    <span class="opt">Optional</span>
                    <span class="text-xs text-slate-400 font-normal shrink-0 hidden sm:inline">✎ Rename</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button type="button"
                          [disabled]="!canMoveUp('Certifications')"
                          (click)="moveSection('Certifications', -1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section up in the CV">
                    ▲ Move Up
                  </button>
                  <button type="button"
                          [disabled]="!canMoveDown('Certifications')"
                          (click)="moveSection('Certifications', 1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section down in the CV">
                    ▼ Move Down
                  </button>
                </div>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" [ngModelOptions]="{ standalone: true }">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" [ngModelOptions]="{ standalone: true }">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="space-y-3">
                @if (certifications.length > 0) {
                  <div class="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-sm transition">
                    <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
                      <input type="checkbox"
                        [checked]="isAllSelected('certifications', certifications.length)"
                        (change)="toggleSelectAll('certifications', certifications.length)"
                        class="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer" />
                      <span>Select All ({{ certifications.length }})</span>
                    </label>

                    @if (selectedCount('certifications') > 0) {
                      <button type="button"
                        (click)="deleteSelected('certifications')"
                        class="flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg font-medium text-xs transition active:scale-95 shadow-sm">
                        <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" />
                        <span>Delete Selected ({{ selectedCount('certifications') }})</span>
                      </button>
                    }
                  </div>
                }

                <div formArrayName="certifications" class="space-y-4">
                  @for (c of certifications.controls; track c; let i = $index) {
                    <div [formGroupName]="i"
                         class="card-block group transition-all duration-200 hover:shadow-md hover:border-sky-300"
                         draggable="true"
                         (dragstart)="onDragStart($event, 'cert', 0, i)"
                         (dragover)="onDragOver($event)"
                         (drop)="onDrop($event, 'cert', 0, i)"
                         (dragend)="onDragEnd($event)">
                      <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center gap-2">
                          <input type="checkbox"
                                 [checked]="isSelected('certifications', i)"
                                 (change)="toggleSelect('certifications', i)"
                                 class="w-4 h-4 rounded border-slate-300 text-sky-600 cursor-pointer" />
                          <div class="flex flex-col gap-0.5 items-center">
                            <span class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 px-0.5 text-xs select-none" title="Hold & drag to reorder">⋮⋮</span>
                            <button type="button" class="reorder-btn" [disabled]="i === 0" (click)="moveCertification(i, -1)" title="Move up">↑</button>
                            <button type="button" class="reorder-btn" [disabled]="i === certifications.length - 1" (click)="moveCertification(i, 1)" title="Move down">↓</button>
                          </div>
                          <h3 class="font-bold">Certification {{ i + 1 }}<span class="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1.5" *ngIf="c.value.name">— {{ c.value.name }}</span></h3>
                        </div>
                        <button type="button" class="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition active:scale-95" (click)="removeCertification(i)" title="Delete certification">
                          <lucide-icon [img]="Trash2" class="w-4 h-4" />
                        </button>
                      </div>
                      <label>Name *<input formControlName="name" placeholder="AWS Certified Solutions Architect" list="certs" /></label>
                      <label class="block mt-3">Issuer<input formControlName="issuer" placeholder="Amazon Web Services" /></label>
                      <label class="block mt-3">Date<input formControlName="date" placeholder="May 2023" list="months-years" /></label>
                    </div>
                  }
                </div>
              </div>
              <button type="button" class="add-dashed" (click)="addCertification()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Certification</button>
            }

            @if (active() === 'Projects') {
              <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white shrink-0"><lucide-icon [img]="FolderKanban" /></span>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      class="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded px-1.5 py-0.5 outline-none transition w-full max-w-md"
                      [value]="labelFor('Projects')"
                      (input)="onLabelInput('Projects', $event)"
                      placeholder="Projects"
                      title="Click to rename this section"
                    />
                    <span class="opt">Optional</span>
                    <span class="text-xs text-slate-400 font-normal shrink-0 hidden sm:inline">✎ Rename</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button type="button"
                          [disabled]="!canMoveUp('Projects')"
                          (click)="moveSection('Projects', -1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section up in the CV">
                    ▲ Move Up
                  </button>
                  <button type="button"
                          [disabled]="!canMoveDown('Projects')"
                          (click)="moveSection('Projects', 1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section down in the CV">
                    ▼ Move Down
                  </button>
                </div>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" [ngModelOptions]="{ standalone: true }">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" [ngModelOptions]="{ standalone: true }">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="space-y-3">
                @if (projects.length > 0) {
                  <div class="flex items-center justify-between py-2 px-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-sm transition">
                    <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
                      <input type="checkbox"
                        [checked]="isAllSelected('projects', projects.length)"
                        (change)="toggleSelectAll('projects', projects.length)"
                        class="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer" />
                      <span>Select All ({{ projects.length }})</span>
                    </label>

                    @if (selectedCount('projects') > 0) {
                      <button type="button"
                        (click)="deleteSelected('projects')"
                        class="flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg font-medium text-xs transition active:scale-95 shadow-sm">
                        <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" />
                        <span>Delete Selected ({{ selectedCount('projects') }})</span>
                      </button>
                    }
                  </div>
                }

                <div formArrayName="projects" class="space-y-4">
                  @for (p of projects.controls; track p; let i = $index) {
                    <div [formGroupName]="i"
                         class="card-block group transition-all duration-200 hover:shadow-md hover:border-sky-300"
                         draggable="true"
                         (dragstart)="onDragStart($event, 'proj', 0, i)"
                         (dragover)="onDragOver($event)"
                         (drop)="onDrop($event, 'proj', 0, i)"
                         (dragend)="onDragEnd($event)">
                      <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2.5">
                          <input type="checkbox"
                                 [checked]="isSelected('projects', i)"
                                 (change)="toggleSelect('projects', i)"
                                 class="w-4 h-4 rounded border-slate-300 text-sky-600 cursor-pointer" />
                          <div class="flex flex-col gap-0.5 items-center">
                            <span class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 px-0.5 text-xs select-none" title="Hold & drag to reorder">⋮⋮</span>
                            <button type="button" class="reorder-btn" [disabled]="i === 0" (click)="moveProject(i, -1)" title="Move up">↑</button>
                            <button type="button" class="reorder-btn" [disabled]="i === projects.length - 1" (click)="moveProject(i, 1)" title="Move down">↓</button>
                          </div>
                          <h3 class="font-bold text-lg">
                            Project {{ i + 1 }}
                            @if (p.value.name) {
                              <span class="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1.5">— {{ p.value.name }}</span>
                            }
                          </h3>
                        </div>
                        <button type="button" class="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition active:scale-95" (click)="removeProject(i)">
                          <lucide-icon [img]="Trash2" class="w-4 h-4" />
                        </button>
                      </div>
                      <label>Project Name *<input formControlName="name" placeholder="System HelpDesk" /></label>
                      <label class="block mt-3">Description *<textarea formControlName="description" rows="3" placeholder="Tech stack…"></textarea></label>
                      <label class="block mt-3">Project Link (Optional)<input formControlName="link" placeholder="https://..." /></label>
                    </div>
                  }
                </div>
                <button type="button" class="add-dashed" (click)="addProject()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Project</button>
              </div>
            }

            @if (active() === 'References') {
              <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white shrink-0"><lucide-icon [img]="UserRound" /></span>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      class="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded px-1.5 py-0.5 outline-none transition w-full max-w-md"
                      [value]="labelFor('References')"
                      (input)="onLabelInput('References', $event)"
                      placeholder="References"
                      title="Click to rename this section"
                    />
                    <span class="opt">Optional</span>
                    <span class="text-xs text-slate-400 font-normal shrink-0 hidden sm:inline">✎ Rename</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button type="button"
                          [disabled]="!canMoveUp('References')"
                          (click)="moveSection('References', -1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section up in the CV">
                    ▲ Move Up
                  </button>
                  <button type="button"
                          [disabled]="!canMoveDown('References')"
                          (click)="moveSection('References', 1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section down in the CV">
                    ▼ Move Down
                  </button>
                </div>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" [ngModelOptions]="{ standalone: true }">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" [ngModelOptions]="{ standalone: true }">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="space-y-3">
                @if (references.length > 0) {
                  <div class="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-sm transition">
                    <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
                      <input type="checkbox"
                        [checked]="isAllSelected('references', references.length)"
                        (change)="toggleSelectAll('references', references.length)"
                        class="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer" />
                      <span>Select All ({{ references.length }})</span>
                    </label>

                    @if (selectedCount('references') > 0) {
                      <button type="button"
                        (click)="deleteSelected('references')"
                        class="flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg font-medium text-xs transition active:scale-95 shadow-sm">
                        <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" />
                        <span>Delete Selected ({{ selectedCount('references') }})</span>
                      </button>
                    }
                  </div>
                }

                <div formArrayName="references" class="space-y-4">
                  @for (r of references.controls; track r; let i = $index) {
                    <div [formGroupName]="i"
                         class="card-block group transition-all duration-200 hover:shadow-md hover:border-sky-300"
                         draggable="true"
                         (dragstart)="onDragStart($event, 'ref', 0, i)"
                         (dragover)="onDragOver($event)"
                         (drop)="onDrop($event, 'ref', 0, i)"
                         (dragend)="onDragEnd($event)">
                      <div class="flex justify-between items-center mb-4">
                        <div class="flex items-center gap-2.5">
                          <input type="checkbox"
                                 [checked]="isSelected('references', i)"
                                 (change)="toggleSelect('references', i)"
                                 class="w-4 h-4 rounded border-slate-300 text-sky-600 cursor-pointer" />
                          <div class="flex flex-col gap-0.5 items-center">
                            <span class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 px-0.5 text-xs select-none" title="Hold & drag to reorder">⋮⋮</span>
                            <button type="button" class="reorder-btn" [disabled]="i === 0" (click)="moveReference(i, -1)" title="Move up">↑</button>
                            <button type="button" class="reorder-btn" [disabled]="i === references.length - 1" (click)="moveReference(i, 1)" title="Move down">↓</button>
                          </div>
                          <h3 class="font-bold text-lg">
                            Reference {{ i + 1 }}
                            @if (r.value.name) {
                              <span class="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1.5">— {{ r.value.name }}</span>
                            }
                          </h3>
                        </div>
                        <button type="button" class="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition active:scale-95" (click)="removeReference(i)">
                          <lucide-icon [img]="Trash2" class="w-4 h-4" />
                        </button>
                      </div>
                      <div class="grid sm:grid-cols-2 gap-4">
                        <label>Full Name *<input formControlName="name" placeholder="Reference Full Name" /></label>
                        <label>Position<input formControlName="position" placeholder="Job position" /></label>
                      </div>
                      <label class="block mt-3">Company<input formControlName="company" placeholder="Company name" /></label>
                      <div class="grid sm:grid-cols-2 gap-4 mt-3">
                        <label>Phone<input formControlName="phone" placeholder="00 123 456 789" /></label>
                        <label>Email<input formControlName="email" type="email" placeholder="ref@example.com" /></label>
                      </div>
                    </div>
                  }
                </div>
                <button type="button" class="add-dashed" (click)="addReference()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Reference</button>
              </div>
            }

            @if (active() === 'Hobbies') {
              <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div class="flex items-center gap-3 flex-1 min-w-[200px]">
                  <span class="grid place-items-center h-12 w-12 rounded-xl bg-[#062b50] text-white shrink-0"><lucide-icon [img]="Star" /></span>
                  <div class="flex-1 flex items-center gap-2">
                    <input
                      class="text-2xl font-bold text-slate-800 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 hover:border-sky-500 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-800 rounded px-1.5 py-0.5 outline-none transition w-full max-w-md"
                      [value]="labelFor('Hobbies')"
                      (input)="onLabelInput('Hobbies', $event)"
                      placeholder="Hobbies"
                      title="Click to rename this section"
                    />
                    <span class="opt">Optional</span>
                    <span class="text-xs text-slate-400 font-normal shrink-0 hidden sm:inline">✎ Rename</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button type="button"
                          [disabled]="!canMoveUp('Hobbies')"
                          (click)="moveSection('Hobbies', -1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section up in the CV">
                    ▲ Move Up
                  </button>
                  <button type="button"
                          [disabled]="!canMoveDown('Hobbies')"
                          (click)="moveSection('Hobbies', 1)"
                          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          title="Move this section down in the CV">
                    ▼ Move Down
                  </button>
                </div>
              </div>
              <div class="font-toolbar">
                <button type="button" class="ft-btn" (click)="bumpFont(-1)">A−</button>
                <span class="ft-val">{{ fontSize() }}px</span>
                <button type="button" class="ft-btn" (click)="bumpFont(1)">A+</button>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" [ngModelOptions]="{ standalone: true }">
                  @for (f of fontFamilies; track f.value) { <option [value]="f.value">{{ f.label }}</option> }
                </select>
                <span class="ft-sep"></span>
                <select class="ft-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" [ngModelOptions]="{ standalone: true }">
                  @for (w of fontWeights; track w.value) { <option [value]="w.value">{{ w.label }}</option> }
                </select>
              </div>
              <div class="card-block">
                <label>Hobby Name
                  <input [(ngModel)]="hobbyDraft" [ngModelOptions]="{ standalone: true }" placeholder="e.g. Music, Travel, Reading…" />
                </label>
                <button type="button" class="add-solid mt-4" (click)="addHobby()"><lucide-icon [img]="Plus" class="w-4 h-4" /> Add Hobby</button>
              </div>
              <div class="space-y-3">
                @if (hobbies.length > 0) {
                  <div class="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-sm transition">
                    <label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
                      <input type="checkbox"
                        [checked]="isAllSelected('hobbies', hobbies.length)"
                        (change)="toggleSelectAll('hobbies', hobbies.length)"
                        class="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4 cursor-pointer" />
                      <span>Select All ({{ hobbies.length }})</span>
                    </label>

                    @if (selectedCount('hobbies') > 0) {
                      <button type="button"
                        (click)="deleteSelected('hobbies')"
                        class="flex items-center gap-1.5 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg font-medium text-xs transition active:scale-95 shadow-sm">
                        <lucide-icon [img]="Trash2" class="w-3.5 h-3.5" />
                        <span>Delete Selected ({{ selectedCount('hobbies') }})</span>
                      </button>
                    }
                  </div>
                }

                <div formArrayName="hobbies" class="space-y-2">
                  @for (h of hobbies.controls; track h; let i = $index) {
                    <div [formGroupName]="i"
                         class="card-block flex justify-between items-center group transition-all duration-200 hover:shadow-md hover:border-sky-300"
                         draggable="true"
                         (dragstart)="onDragStart($event, 'hobby', 0, i)"
                         (dragover)="onDragOver($event)"
                         (drop)="onDrop($event, 'hobby', 0, i)"
                         (dragend)="onDragEnd($event)">
                      <div class="flex items-center gap-3 min-w-0 flex-1">
                        <input type="checkbox"
                               [checked]="isSelected('hobbies', i)"
                               (change)="toggleSelect('hobbies', i)"
                               class="w-4 h-4 rounded border-slate-300 text-sky-600 cursor-pointer" />
                        <div class="flex flex-col gap-0.5 items-center">
                          <span class="drag-handle cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 px-0.5 text-xs select-none" title="Hold & drag to reorder">⋮⋮</span>
                          <button type="button" class="reorder-btn" [disabled]="i === 0" (click)="moveHobby(i, -1)" title="Move up">↑</button>
                          <button type="button" class="reorder-btn" [disabled]="i === hobbies.length - 1" (click)="moveHobby(i, 1)" title="Move down">↓</button>
                        </div>
                        <p class="font-bold text-slate-800 dark:text-slate-100">{{ h.value.name }}</p>
                      </div>
                      <button type="button" class="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition active:scale-95" (click)="removeHobby(i)" title="Delete hobby">
                        <lucide-icon [img]="Trash2" class="w-4 h-4" />
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          
            <!-- Bottom Page Navigation (Switch between sections up & down) -->
            <div class="flex items-center justify-between pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
              @if (prevStep(); as prev) {
                <button type="button" (click)="active.set(prev.key)"
                        class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition active:scale-95 shadow-sm">
                  ← Previous: {{ prev.label }}
                </button>
              } @else {
                <div></div>
              }
              @if (nextStep(); as next) {
                <button type="button" (click)="active.set(next.key)"
                        class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#062b50] hover:bg-[#093e73] transition active:scale-95 shadow-md ml-auto">
                  Next: {{ next.label }} →
                </button>
              }
            </div>
          </form>

          <!-- Datalists for selectable suggestions -->
          <datalist id="job-titles">
            @for (j of jobTitles; track j) {
              <option [value]="j"></option>
            }
          </datalist>
          <datalist id="locations">
            @for (l of locations; track l) {
              <option [value]="l"></option>
            }
          </datalist>
          <datalist id="institutions">
            @for (i of institutions; track i) {
              <option [value]="i"></option>
            }
          </datalist>
          <datalist id="degree-options">
            @for (d of degrees; track d) {
              <option [value]="d"></option>
            }
          </datalist>
          <datalist id="fields-of-study">
            @for (field of fields; track field) {
              <option [value]="field"></option>
            }
          </datalist>
          <datalist id="year-options">
            @for (year of years; track year) {
              <option [value]="year"></option>
            }
          </datalist>
          <datalist id="languages-list">
            @for (language of languageOptions; track language) {
              <option [value]="language"></option>
            }
          </datalist>
          <datalist id="skills-list">
            @for (s of skillSuggestions; track s) {
              <option [value]="s"></option>
            }
          </datalist>
          <datalist id="companies">
            <option value="HYUNDAI PACKAGING"></option>
            <option value="Bestway international"></option>
            <option value="ACLED A Bank"></option>
            <option value="Cellcard"></option>
          </datalist>
          <datalist id="certs">
            <option value="AWS Certified Solutions Architect"></option>
            <option value="Professional Scrum Master (PSM I)"></option>
            <option value="Google IT Support"></option>
            <option value="IELTS"></option>
            <option value="TOEFL"></option>
          </datalist>
        </section>

        <!-- Live preview + typography -->
        <aside class="w-full xl:col-start-3 xl:row-start-1 xl:w-[420px]" [class.hidden]="viewMode() === 'edit'" [class.xl:block]="true">
          <div class="sticky top-24 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm space-y-3">
            <div class="flex items-center justify-between font-bold dark:text-white">
              <span class="text-emerald-600 text-sm flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ● LIVE PREVIEW
              </span>
              <div class="flex items-center gap-1.5">
                <button type="button" class="outline sm" (click)="zoomOut()">−</button>
                <button type="button" class="outline sm font-mono text-xs px-2" (click)="toggleAutoFit()">
                  {{ isAutoFit() ? 'Fit' : ((zoom() * 100).toFixed(0) + '%') }}
                </button>
                <button type="button" class="outline sm" (click)="zoomIn()">+</button>
                <button type="button" class="outline sm" (click)="openFullPreview()" title="Full screen">
                  <lucide-icon [img]="Eye" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Professional typography toolbar -->
            <div class="typo-bar" title="Typography — applies to your CV">
              <div class="typo-group">
                <lucide-icon [img]="Type" class="w-3.5 h-3.5 text-slate-400" />
                <button type="button" class="typo-btn" (click)="bumpFont(-1)" title="Decrease font size">A−</button>
                <span class="typo-val">{{ fontSize() }}px</span>
                <button type="button" class="typo-btn" (click)="bumpFont(1)" title="Increase font size">A+</button>
              </div>
              <div class="typo-group">
                <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><text x="3" y="18" font-size="16" font-weight="400" stroke="none" fill="#94a3b8">F</text></svg>
                <select class="typo-select font-sel" [ngModel]="fontFamily()" (ngModelChange)="fontFamily.set($event)" [ngModelOptions]="{ standalone: true }" title="Font family">
                  @for (f of fontFamilies; track f.value) {
                    <option [value]="f.value" [style.font-family]="f.value">{{ f.label }}</option>
                  }
                </select>
              </div>
              <div class="typo-group">
                <lucide-icon [img]="Bold" class="w-3.5 h-3.5 text-slate-400" />
                <select class="typo-select" [ngModel]="fontWeight()" (ngModelChange)="fontWeight.set(+$event)" [ngModelOptions]="{ standalone: true }" title="Font weight">
                  @for (w of fontWeights; track w.value) {
                    <option [value]="w.value">{{ w.label }}</option>
                  }
                </select>
              </div>
              <div class="typo-group">
                <lucide-icon [img]="AlignJustify" class="w-3.5 h-3.5 text-slate-400" />
                <select class="typo-select" [ngModel]="lineHeight()" (ngModelChange)="lineHeight.set(+$event)" [ngModelOptions]="{ standalone: true }" title="Line spacing">
                  @for (lh of lineHeights; track lh.value) {
                    <option [value]="lh.value">{{ lh.label }}</option>
                  }
                </select>
              </div>
              <button
                type="button"
                class="typo-btn line-toggle"
                [class.on]="sectionLines()"
                (click)="sectionLines.set(!sectionLines())"
                title="Section lines / timeline"
              >
                <lucide-icon [img]="Minus" class="w-3.5 h-3.5" />
                Lines
              </button>
              <div class="typo-group accent-picker" aria-label="CV accent color">
                <lucide-icon [img]="Palette" class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div class="accent-swatches" role="group" aria-label="Choose an accent color">
                  @for (tone of accentPalette; track tone.value) {
                    <button type="button" class="accent-swatch" [class.selected]="accentColor() === tone.value" [style.background]="tone.value" (click)="setAccent(tone.value)" [attr.aria-label]="tone.label + ' accent color'" [title]="tone.label"></button>
                  }
                </div>
                <label class="custom-color" title="Choose a custom accent color">
                  <span class="sr-only">Custom accent color</span>
                  <input type="color" [ngModel]="accentColor()" (ngModelChange)="setAccent($event)" aria-label="Custom accent color" />
                </label>
              </div>
            </div>

            @if (usingSampleData()) {
              <p class="sample-hint">Showing sample content so you can see the layout. Your details replace it as you type.</p>
            }

            <div 
              #previewStageEl
              class="h-[62vh] sm:h-[72vh] xl:h-[520px] min-h-[460px] overflow-auto rounded-xl border-2 border-slate-900/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 p-2 sm:p-3 flex justify-center items-start cv-stage-scroll"
            >
              <div [style.zoom]="calculatedScale()" class="origin-top flex justify-center a4-wrap">
                <ng-container *ngTemplateOutlet="cvPreview"></ng-container>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer class="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 shadow-md">
        <div class="max-w-4xl mx-auto flex items-center justify-between gap-2 p-2.5 sm:p-3">
          <!-- Mobile Live Preview Toggle in Footer -->
          <button
            type="button"
            (click)="toggleViewMode()"
            class="xl:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition active:scale-95 shadow-xs"
            [class.bg-emerald-50]="viewMode() === 'edit'"
            [class.text-emerald-700]="viewMode() === 'edit'"
            [class.border-emerald-300]="viewMode() === 'edit'"
            [class.bg-sky-50]="viewMode() === 'preview'"
            [class.text-sky-700]="viewMode() === 'preview'"
            [class.border-sky-300]="viewMode() === 'preview'"
          >
            <lucide-icon [img]="viewMode() === 'edit' ? Eye : Pencil" class="w-3.5 h-3.5" />
            <span>{{ viewMode() === 'edit' ? (i18n.currentLang() === 'kh' ? 'មើលគំរូ' : 'Live Preview') : (i18n.currentLang() === 'kh' ? 'កែសម្រួល' : 'Edit Form') }}</span>
          </button>

          <div class="flex items-center gap-1.5 sm:gap-3 ml-auto">
            <button type="button" class="outline !px-2.5 sm:!px-4 !py-1.5 sm:!py-2.5 !text-xs sm:!text-sm inline-flex items-center gap-1.5" (click)="save()"><lucide-icon [img]="Save" class="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {{ i18n.currentLang() === 'kh' ? 'រក្សាទុក' : 'Save Draft' }}</button>
            <button type="button" class="download !px-2.5 sm:!px-4 !py-1.5 sm:!py-2.5 !text-xs sm:!text-sm inline-flex items-center gap-1.5" (click)="onDownloadClick()"><lucide-icon [img]="Download" class="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {{ i18n.currentLang() === 'kh' ? 'ទាញយក CV' : 'Download CV' }}</button>
          </div>
        </div>
      </footer>

      <!-- Download Format Modal -->
      @if (showDownloadModal()) {
        <div class="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
             (click)="showDownloadModal.set(false)">
          <div class="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden animate-[slideUp_0.25s_ease-out]"
               (click)="$event.stopPropagation()">
            <div class="px-6 pt-6 pb-3 text-center">
              <p class="font-semibold text-slate-800 dark:text-white text-lg">Download CV</p>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose your preferred format</p>
            </div>
            <div class="px-6 pb-4 grid grid-cols-3 gap-3">
              <button type="button" (click)="downloadAs('pdf')"
                      class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                      [class.border-slate-200]="true" [class.dark:border-slate-700]="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/><path d="M9 11h6"/></svg>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">PDF</span>
                <span class="text-[10px] text-slate-400">Best for sharing</span>
              </button>
              <button type="button" (click)="downloadAs('docx')"
                      class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                      [class.border-slate-200]="true" [class.dark:border-slate-700]="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/></svg>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">DOCX</span>
                <span class="text-[10px] text-slate-400">Editable in Word</span>
              </button>
              <button type="button" (click)="downloadAs('pptx')"
                      class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                      [class.border-slate-200]="true" [class.dark:border-slate-700]="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><rect x="8" y="12" width="8" height="5" rx="1"/></svg>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-200">PPTX</span>
                <span class="text-[10px] text-slate-400">Editable, keeps design</span>
              </button>
            </div>
            <div class="border-t border-slate-200 dark:border-slate-700">
              <button type="button" (click)="showDownloadModal.set(false)"
                      class="w-full py-3 text-slate-500 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      }

      <!-- KHQR Payment Modal -->
      @if (showKhqrModal()) {
        <app-khqr-payment-modal
          [templateId]="templateId || undefined"
          [userCvId]="cvId || undefined"
          [templateName]="'CQ Professional CV'"
          (paymentSuccess)="onKhqrPaymentSuccess($event)"
          (downloadFormat)="downloadAs($event)"
          (close)="showKhqrModal.set(false)"
        />
      }
    </main>

    @if (fullPreview()) {
      <div class="fixed top-[80px] sm:top-[88px] inset-x-0 bottom-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col overflow-hidden print-overlay animate-[fadeIn_0.2s_ease-out] border-t border-slate-800 shadow-2xl">
        <!-- Top Navigation & Control Header -->
        <header class="no-print shrink-0 h-14 sm:h-16 px-3 sm:px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-2 text-white shadow-md">
          <!-- Left: Close & Title -->
          <div class="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              (click)="fullPreview.set(false)"
              class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition active:scale-95 flex items-center gap-1.5 text-xs font-semibold shrink-0 border border-slate-700/80 cursor-pointer"
              title="Close Preview (Esc)"
            >
              <lucide-icon [img]="X" class="w-4 h-4" />
              <span class="hidden sm:inline">{{ i18n.currentLang() === 'kh' ? 'បិទ' : 'Close' }}</span>
            </button>

            <div class="min-w-0 hidden md:block">
              <span class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE PREVIEW
              </span>
              <p class="text-xs text-slate-400 truncate max-w-[200px]">{{ form.value.fullName || 'My CV' }}</p>
            </div>
          </div>

          <!-- Center: Zoom Controls & Auto Fit -->
          <div class="flex items-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-inner">
            <button
              type="button"
              (click)="modalZoomOut()"
              class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 active:scale-90 transition font-bold text-xs cursor-pointer"
              title="Zoom Out"
            >
              −
            </button>
            <button
              type="button"
              (click)="modalResetFit()"
              class="px-2.5 py-1 rounded-md font-mono text-[11px] sm:text-xs font-bold transition cursor-pointer"
              [class.bg-sky-600]="modalZoom() === null"
              [class.text-white]="modalZoom() === null"
              [class.text-slate-300]="modalZoom() !== null"
              title="Fit to Screen"
            >
              {{ modalZoom() === null ? (i18n.currentLang() === 'kh' ? 'សម' : 'Fit') : (modalScalePercent() + '%') }}
            </button>
            <button
              type="button"
              (click)="modalZoomIn()"
              class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 active:scale-90 transition font-bold text-xs cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            <button
              type="button"
              (click)="modalSet100()"
              class="hidden sm:inline-block px-2 py-1 rounded text-[10px] font-mono text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="100% Size"
            >
              100%
            </button>
          </div>

          <!-- Right: Typography quick adjustments & Download -->
          <div class="flex items-center gap-2 shrink-0">
            <div class="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <button type="button" class="px-2 py-0.5 rounded hover:bg-slate-700 transition" (click)="bumpFont(-1)">A−</button>
              <span class="font-mono text-[11px] text-sky-300">{{ fontSize() }}px</span>
              <button type="button" class="px-2 py-0.5 rounded hover:bg-slate-700 transition" (click)="bumpFont(1)">A+</button>
              <button type="button" class="px-2 py-0.5 rounded hover:bg-slate-700 transition" [class.text-sky-400]="sectionLines()" (click)="sectionLines.set(!sectionLines())">Lines</button>
            </div>

            <button
              type="button"
              (click)="onDownloadClick()"
              class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <lucide-icon [img]="Download" class="w-3.5 h-3.5" />
              <span>{{ i18n.currentLang() === 'kh' ? 'ទាញយក' : 'Download' }}</span>
            </button>
          </div>
        </header>

        <!-- Scrollable Document Stage (Center-aligned, auto-fit, never clipped) -->
        <div class="flex-1 w-full overflow-auto py-6 px-2 sm:px-4 flex flex-col items-center cv-stage-scroll">
          <div
            class="print-root a4-sheet relative origin-top flex justify-center shadow-2xl transition-[zoom] duration-150"
            [style.zoom]="modalScale()"
            [class.cover-letter-print]="isCoverLetter()"
          >
            <ng-container *ngTemplateOutlet="cvPreview"></ng-container>
          </div>
        </div>
      </div>
    }

    <ng-template #cvPreview>
      <div class="cv-live-root relative">
        @if (!isPaid() && !auth.isStaffOrAdmin()) {
          <app-watermark text="CQ Professional" />
        }
        @if (layout() === 'modern-split') {
        <app-modern-split-cv
          [photoUrl]="photoUrl()"
          [name]="previewName()"
          [jobTitle]="previewJobTitle()"
          [email]="previewEmail()"
          [phone]="previewPhone()"
          [location]="previewLocation()"
          [summary]="previewSummary()"
          [education]="previewEducation()"
          [experience]="previewExperience()"
          [skills]="previewSkills()"
          [languages]="previewLanguages()"
          [references]="previewReferences()"
          [hobbies]="previewHobbies()"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
          [accent]="accentColor()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'clean-sidebar') {
        <app-clean-sidebar-cv
          [photoUrl]="photoUrl()"
          [name]="previewName()"
          [jobTitle]="previewJobTitle()"
          [email]="previewEmail()"
          [phone]="previewPhone()"
          [location]="previewLocation()"
          [summary]="previewSummary()"
          [education]="previewEducation()"
          [experience]="previewExperience()"
          [skills]="previewSkills()"
          [languages]="previewLanguages()"
          [references]="previewReferences()"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
          [accent]="accentColor()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'elegant-frame') {
        <app-elegant-frame-cv
          [photoUrl]="photoUrl()"
          [name]="previewName()"
          [jobTitle]="previewJobTitle()"
          [email]="previewEmail()"
          [phone]="previewPhone()"
          [location]="previewLocation()"
          [linkedin]="previewLinkedin()"
          [summary]="previewSummary()"
          [education]="previewEducation()"
          [experience]="previewExperience()"
          [skills]="previewSkills()"
          [languages]="previewLanguages()"
          [certifications]="previewCertifications()"
          [hobbies]="previewHobbies()"
          [references]="previewReferences()"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
          [accent]="accentColor()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'classic-dark') {
        <app-classic-dark-cv
          [photoUrl]="photoUrl()"
          [name]="previewName()"
          [jobTitle]="previewJobTitle()"
          [email]="previewEmail()"
          [phone]="previewPhone()"
          [location]="previewLocation()"
          [linkedin]="previewLinkedin()"
          [summary]="previewSummary()"
          [education]="previewEducation()"
          [experience]="previewExperience()"
          [skills]="previewSkills()"
          [languages]="previewLanguages()"
          [references]="previewReferences()"
          [hobbies]="previewHobbies()"
          [certifications]="previewCertifications()"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
          [accent]="accentColor()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'graphite-banner-timeline') {
        <app-graphite-banner-timeline-cv
          [accent]="accentColor()" [photoUrl]="photoUrl()"
          [name]="previewName()" [jobTitle]="previewJobTitle()" [email]="previewEmail()" [phone]="previewPhone()" [location]="previewLocation()" [linkedin]="previewLinkedin()" [summary]="previewSummary()"
          [education]="previewEducation()" [experience]="previewExperience()" [skills]="previewSkills()" [languages]="previewLanguages()" [certifications]="previewCertifications()" [projects]="previewProjects()" [references]="previewReferences()" [hobbies]="previewHobbies()"
          [fontSize]="fontSize()" [fontWeight]="fontWeight()" [lineHeight]="lineHeight()" [fontFamily]="fontFamily()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'navy-sidebar-profile') {
        <app-navy-sidebar-profile-cv
          [accent]="accentColor()" [photoUrl]="photoUrl()"
          [name]="previewName()" [jobTitle]="previewJobTitle()" [email]="previewEmail()" [phone]="previewPhone()" [location]="previewLocation()" [linkedin]="previewLinkedin()" [summary]="previewSummary()"
          [education]="previewEducation()" [experience]="previewExperience()" [skills]="previewSkills()" [languages]="previewLanguages()" [certifications]="previewCertifications()" [projects]="previewProjects()" [references]="previewReferences()" [hobbies]="previewHobbies()"
          [fontSize]="fontSize()" [fontWeight]="fontWeight()" [lineHeight]="lineHeight()" [fontFamily]="fontFamily()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'minimalist-framed') {
        <app-minimalist-framed-cv
          [accent]="accentColor()" [photoUrl]="photoUrl()"
          [name]="previewName()" [jobTitle]="previewJobTitle()" [email]="previewEmail()" [phone]="previewPhone()" [location]="previewLocation()" [linkedin]="previewLinkedin()" [summary]="previewSummary()"
          [education]="previewEducation()" [experience]="previewExperience()" [skills]="previewSkills()" [languages]="previewLanguages()" [certifications]="previewCertifications()" [projects]="previewProjects()" [references]="previewReferences()" [hobbies]="previewHobbies()"
          [fontSize]="fontSize()" [fontWeight]="fontWeight()" [lineHeight]="lineHeight()" [fontFamily]="fontFamily()"
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'navy-badge') {
        <app-navy-badge-cv
          [accent]="accentColor()" [photoUrl]="photoUrl()"
          [name]="previewName()" [jobTitle]="previewJobTitle()" [email]="previewEmail()" [phone]="previewPhone()" [location]="previewLocation()" [linkedin]="previewLinkedin()" [summary]="previewSummary()"
          [dob]="form.value.dob" [height]="form.value.height" [maritalStatus]="form.value.maritalStatus"
          [education]="previewEducation()" [experience]="previewExperience()" [skills]="previewSkills()" [languages]="previewLanguages()" [certifications]="previewCertifications()" [projects]="previewProjects()" [references]="previewReferences()" [hobbies]="previewHobbies()"
          [fontSize]="fontSize()" [fontWeight]="fontWeight()" [lineHeight]="lineHeight()" [fontFamily]="fontFamily()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'slate-rounded-panels') {
        <app-slate-rounded-panels-cv
          [accent]="accentColor()" [photoUrl]="photoUrl()"
          [name]="previewName()" [jobTitle]="previewJobTitle()" [email]="previewEmail()" [phone]="previewPhone()" [location]="previewLocation()" [linkedin]="previewLinkedin()" [summary]="previewSummary()"
          [education]="previewEducation()" [experience]="previewExperience()" [skills]="previewSkills()" [languages]="previewLanguages()" [certifications]="previewCertifications()" [projects]="previewProjects()" [references]="previewReferences()" [hobbies]="previewHobbies()"
          [fontSize]="fontSize()" [fontWeight]="fontWeight()" [lineHeight]="lineHeight()" [fontFamily]="fontFamily()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'warm-taupe-timeline') {
        <app-warm-taupe-timeline-cv
          [accent]="accentColor()" [photoUrl]="photoUrl()"
          [name]="previewName()" [jobTitle]="previewJobTitle()" [email]="previewEmail()" [phone]="previewPhone()" [location]="previewLocation()" [linkedin]="previewLinkedin()" [summary]="previewSummary()"
          [education]="previewEducation()" [experience]="previewExperience()" [skills]="previewSkills()" [languages]="previewLanguages()" [certifications]="previewCertifications()" [projects]="previewProjects()" [references]="previewReferences()" [hobbies]="previewHobbies()"
          [fontSize]="fontSize()" [fontWeight]="fontWeight()" [lineHeight]="lineHeight()" [fontFamily]="fontFamily()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'formal-classic') {
        <app-formal-classic-cv
          [accent]="accentColor()"
          [photoUrl]="photoUrl()"
          [name]="previewName()"
          [jobTitle]="previewJobTitle()"
          [email]="previewEmail()"
          [phone]="previewPhone()"
          [location]="previewLocation()"
          [linkedin]="previewLinkedin()"
          [summary]="previewSummary()"
          [education]="previewEducation()"
          [experience]="previewExperience()"
          [skills]="previewSkills()"
          [languages]="previewLanguages()"
          [references]="previewReferences()"
          [projects]="previewProjects()"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      } @else if (layout() === 'framed-cover-letter') {
        <app-framed-cover-letter-cv
          [accent]="accentColor()"
          [name]="previewName()"
          [jobTitle]="previewJobTitle()"
          [phone]="previewPhone()"
          [email]="previewEmail()"
          [location]="previewLocation()"
          [bodyText]="previewSummary()"
          [recipientName]="form.value.recipientName || ''"
          [recipientDept]="form.value.recipientDept || ''"
          [greeting]="form.value.greeting || ''"
          [closing]="form.value.closing || ''"
          [subject]="form.value.subject || ''"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
        />
      } @else if (layout() === 'sidebar-cover-letter') {
        <app-sidebar-cover-letter-cv
          [accent]="accentColor()"
          [name]="previewName()"
          [jobTitle]="previewJobTitle()"
          [phone]="previewPhone()"
          [email]="previewEmail()"
          [location]="previewLocation()"
          [bodyText]="previewSummary()"
          [recipientName]="form.value.recipientName || ''"
          [recipientDept]="form.value.recipientDept || ''"
          [greeting]="form.value.greeting || ''"
          [closing]="form.value.closing || ''"
          [subject]="form.value.subject || ''"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
        />
      } @else if (layout() === 'minimalist-cover-letter') {
        <app-minimalist-cover-letter-cv
          [accent]="accentColor()"
          [name]="previewName()"
          [jobTitle]="previewJobTitle()"
          [phone]="previewPhone()"
          [email]="previewEmail()"
          [location]="previewLocation()"
          [bodyText]="previewSummary()"
          [recipientName]="form.value.recipientName || ''"
          [recipientDept]="form.value.recipientDept || ''"
          [greeting]="form.value.greeting || ''"
          [closing]="form.value.closing || ''"
          [subject]="form.value.subject || ''"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
        />
      } @else if (layout() === 'cover-letter') {
        <app-cover-letter-cv
          [accent]="accentColor()"
          [name]="previewName()"
          [phone]="previewPhone()"
          [email]="previewEmail()"
          [location]="previewLocation()"
          [bodyText]="previewSummary()"
          [recipientDept]="form.value.recipientDept || 'Human Resource Department'"
          [greeting]="form.value.greeting || 'Dear Hiring Manager,'"
          [closing]="form.value.closing || 'Yours sincerely,'"
          [subject]="form.value.subject || ''"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
        />
      } @else {
        <app-professional-cv
          [photoUrl]="photoUrl()"
          [name]="previewName()"
          [jobTitle]="previewJobTitle()"
          [email]="previewEmail()"
          [phone]="previewPhone()"
          [location]="previewLocation()"
          [linkedin]="previewLinkedin()"
          [summary]="previewSummary()"
          [education]="previewEducation()"
          [experience]="previewExperience()"
          [skills]="previewSkills()"
          [languages]="previewLanguages()"
          [certifications]="previewCertifications()"
          [projects]="previewProjects()"
          [fontSize]="fontSize()"
          [fontWeight]="fontWeight()"
          [lineHeight]="lineHeight()"
          [fontFamily]="fontFamily()"
          [sectionLines]="sectionLines()"
          [accent]="accentColor()"
        
          [sectionLabels]="sectionLabels()"
          [sectionOrder]="sectionOrder()"/>
      }
      </div>
    </ng-template>
  `,
  styles: [
    `
      label {
        font-weight: 650;
        font-size: 0.9rem;
        color: #1f2937;
        display: block;
      }
      input:not([type="checkbox"]):not([type="radio"]),
      textarea,
      select {
        display: block;
        width: 100%;
        margin-top: 0.45rem;
        padding: 0.85rem 1rem;
        border: 1px solid #b9c4d4;
        border-radius: 0.9rem;
        background: #f8fafc;
        font: inherit;
        outline: none;
        appearance: auto;
      }
      input[type="checkbox"] {
        width: 1.15rem !important;
        min-width: 1.15rem !important;
        max-width: 1.15rem !important;
        height: 1.15rem !important;
        min-height: 1.15rem !important;
        margin: 0 !important;
        padding: 0 !important;
        display: inline-block !important;
        accent-color: #0284c7;
        cursor: pointer;
        flex-shrink: 0 !important;
        border-radius: 0.25rem !important;
      }
      select {
        cursor: pointer;
      }
      input:focus,
      textarea:focus,
      select:focus {
        border-color: #0284c7;
        box-shadow: 0 0 0 3px #bae6fd;
      }
      .date-row {
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 0.5rem;
        margin-top: 0.45rem;
      }
      .date-row select {
        margin-top: 0;
      }
      .upload {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: #062b50;
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        cursor: pointer;
      }
      /* Modern Responsive Section Bar */
      .step-chip-btn {
        transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, border-color 0.2s ease;
      }
      .step-chip-btn:hover {
        transform: translateY(-1.5px);
      }
      .step-chip-btn:active {
        transform: scale(0.94);
      }
      .active-chip {
        background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%) !important;
        color: #ffffff !important;
        box-shadow: 0 4px 14px rgba(2, 132, 199, 0.38) !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
      }
      .inactive-chip {
        background: rgba(241, 245, 249, 0.85);
        color: #475569;
        border: 1px solid rgba(226, 232, 240, 0.9);
      }
      :host-context(.dark) .inactive-chip {
        background: rgba(30, 41, 59, 0.85);
        color: #cbd5e1;
        border: 1px solid rgba(51, 65, 85, 0.8);
      }
      .inactive-chip:hover {
        background: rgba(224, 242, 254, 0.95);
        color: #0284c7;
        border-color: #93c5fd;
      }
      :host-context(.dark) .inactive-chip:hover {
        background: rgba(14, 116, 144, 0.25);
        color: #38bdf8;
        border-color: #0284c7;
      }

      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        padding: 0.75rem 0.4rem;
        border-radius: 1rem;
        border: 1px solid #dce4ef;
        background: white;
        color: #60718b;
        font-size: 0.68rem;
        font-weight: 600;
        text-align: center;
        width: 100%;
        min-height: 74px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .step:hover {
        border-color: #93c5fd;
        background: #f0f7ff;
        color: #0369a1;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08);
      }
            .step-arrow-btn {
        border: none;
        background: transparent;
        color: currentColor;
        opacity: 0.5;
        font-size: 0.55rem;
        line-height: 1;
        padding: 1px 3px;
        cursor: pointer;
        border-radius: 3px;
        transition: opacity 0.15s, background 0.15s;
      }
      .step-arrow-btn:hover:not(:disabled) {
        opacity: 1;
        background: rgba(2, 132, 199, 0.15);
      }
      .step.selected .step-arrow-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
      }
      .step-arrow-btn:disabled {
        opacity: 0.15;
        cursor: default;
      }
      .step.selected {
        background: #062b50;
        color: #fff;
        border-color: #062b50;
        box-shadow: 0 6px 16px rgba(6, 43, 80, 0.25);
        transform: translateY(-1px);
      }
      .step-label-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
        line-height: 1.2;
        width: 100%;
      }
      .step-label-text {
        word-break: normal;
        overflow-wrap: normal;
        hyphens: none;
        max-width: 100%;
        text-align: center;
        line-height: 1.15;
      }
      .step-edit-icon {
        opacity: 0;
        font-size: 0.75rem;
        cursor: pointer;
        flex-shrink: 0;
        transition: opacity 0.15s;
        line-height: 1;
        padding: 1px;
      }
      .step:hover .step-edit-icon {
        opacity: 0.7;
      }
      .step.selected .step-edit-icon {
        color: #a8cfff;
      }
      .step-label-input {
        width: 80px;
        font-size: 0.62rem;
        text-align: center;
        border: 1px solid #a8cfff;
        border-radius: 4px;
        padding: 2px 3px;
        background: rgba(255,255,255,0.2);
        color: inherit;
        outline: none;
      }
      .download,
      .outline {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.75rem 1.05rem;
        border-radius: 0.8rem;
        font-weight: 700;
      }
      .outline.sm {
        padding: 0.35rem 0.55rem;
        font-size: 0.75rem;
      }
      .download {
        background: #16a34a;
        color: white;
        box-shadow: 0 6px 14px #16a34a44;
      }
      .outline {
        border: 1px solid #062b50;
        color: #062b50;
        background: white;
      }
      .card-block {
        border: 1px solid #e2e8f0;
        border-left: 4px solid #062b50;
        border-radius: 1rem;
        background: #f8fafc;
        padding: 1.25rem;
      }
            .drag-handle {
        cursor: grab;
        user-select: none;
        font-weight: 900;
        font-size: 0.8rem;
        line-height: 1;
        letter-spacing: 1px;
        transition: color 0.15s;
      }
      .drag-handle:active {
        cursor: grabbing;
      }
      .card-block.dragging {
        opacity: 0.45;
        border: 2px dashed #0284c7 !important;
        transform: scale(0.99);
      }
      .card-block {
        transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
      }
      .reorder-btn {
        border: none;
        background: transparent;
        color: #94a3b8;
        font-size: 0.6rem;
        line-height: 1;
        padding: 2px 4px;
        cursor: pointer;
        border-radius: 4px;
        transition: color 0.15s, background 0.15s;
      }
      .reorder-btn:hover:not(:disabled) {
        color: #1e293b;
        background: #e2e8f0;
      }
      .reorder-btn:disabled {
        opacity: 0.25;
        cursor: default;
      }
      .reorder-btn {
        border: none;
        background: #f1f5f9;
        color: #64748b;
        font-size: 0.75rem;
        line-height: 1;
        padding: 4px 6px;
        cursor: pointer;
        border-radius: 5px;
        font-weight: 700;
        transition: color 0.15s, background 0.15s, transform 0.1s;
      }
      .reorder-btn:hover:not(:disabled) {
        color: #1e293b;
        background: #e2e8f0;
        transform: scale(1.1);
      }
      .reorder-btn:active:not(:disabled) {
        background: #cbd5e1;
        transform: scale(0.95);
      }
      .reorder-btn:disabled {
        opacity: 0.3;
        cursor: default;
      }
      .add-dashed {
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        padding: 0.9rem;
        border-radius: 1rem;
        border: 2px dashed #cbd5e1;
        color: #64748b;
        font-weight: 600;
        background: transparent;
      }
      .add-solid {
        width: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        padding: 0.85rem;
        border-radius: 0.9rem;
        background: #6b7c93;
        color: white;
        font-weight: 700;
      }
      .chip {
        border: 1px solid #cbd5e1;
        border-radius: 999px;
        padding: 0.35rem 0.85rem;
        font-size: 0.85rem;
        background: white;
        color: #334155;
      }
      .chip.on {
        background: #062b50;
        color: white;
        border-color: #062b50;
      }
      .level-bar {
        width: 100%;
        padding: 0.55rem;
        border-radius: 0.6rem;
        border: 1px solid #e2e8f0;
        background: white;
        color: #64748b;
        font-weight: 600;
      }
      .level-bar.on {
        background: #062b50;
        color: white;
        border-color: #062b50;
      }
      .check {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        font-size: 0.9rem;
      }
      .check input {
        width: auto;
        margin: 0;
      }
      .opt {
        font-size: 0.7rem;
        font-weight: 600;
        background: #e2e8f0;
        color: #64748b;
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        margin-left: 0.35rem;
      }
      .a4-sheet {
        width: 210mm;
        min-width: 210mm;
      }
      .sample-hint {
        margin: 0 0 8px;
        border-radius: 10px;
        border: 1px dashed #bcd0ee;
        background: #f3f8ff;
        color: #4a6da7;
        padding: 7px 10px;
        font-size: 0.68rem;
        line-height: 1.45;
      }
      .typo-bar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.45rem;
        padding: 0.5rem 0.6rem;
        border-radius: 0.75rem;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
      }
      .typo-group {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
      .typo-btn {
        border: 1px solid #cbd5e1;
        background: #fff;
        border-radius: 0.45rem;
        padding: 0.25rem 0.45rem;
        font-size: 0.75rem;
        font-weight: 700;
        color: #334155;
        display: inline-flex;
        align-items: center;
        gap: 0.2rem;
      }
      .typo-btn:hover {
        border-color: #062b50;
        color: #062b50;
      }
      .typo-btn.on {
        background: #062b50;
        color: #fff;
        border-color: #062b50;
      }
      .typo-val {
        font-size: 0.7rem;
        font-weight: 700;
        color: #64748b;
        min-width: 2rem;
        text-align: center;
      }
      .typo-select {
        margin: 0;
        padding: 0.25rem 0.4rem;
        font-size: 0.7rem;
        border-radius: 0.45rem;
        border: 1px solid #cbd5e1;
        background: #fff;
        width: auto;
        min-width: 0;
      }
      .accent-picker { gap: 0.35rem; }
      .accent-swatches { display: inline-flex; align-items: center; gap: 0.25rem; }
      .accent-swatch {
        width: 16px;
        height: 16px;
        border: 1px solid rgba(15, 23, 42, 0.16);
        border-radius: 999px;
        cursor: pointer;
        transition: transform .16s ease, box-shadow .16s ease;
      }
      .accent-swatch:hover { transform: scale(1.16); }
      .accent-swatch.selected { box-shadow: 0 0 0 2px #fff, 0 0 0 4px #062b50; transform: scale(1.08); }
      .custom-color {
        display: grid;
        width: 22px;
        height: 22px;
        place-items: center;
        overflow: hidden;
        border: 1px solid #cbd5e1;
        border-radius: 0.45rem;
        background: conic-gradient(#f43f5e, #facc15, #22c55e, #38bdf8, #a855f7, #f43f5e);
        cursor: pointer;
      }
      .custom-color input { width: 32px; height: 32px; padding: 0; border: 0; cursor: pointer; opacity: .95; }

      /* ── Per-section font toolbar ── */
      .font-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.35rem;
        padding: 0.55rem 0.9rem;
        margin-bottom: 0.5rem;
        background: #f0f4f9;
        border: 1px solid #dde4ee;
        border-radius: 0.9rem;
      }
      .ft-btn {
        border: 1px solid #c8d4e0;
        background: #fff;
        border-radius: 0.4rem;
        padding: 0.22rem 0.55rem;
        font-size: 0.78rem;
        font-weight: 800;
        color: #334155;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
      }
      .ft-btn:hover { background: #062b50; color: #fff; border-color: #062b50; }
      .ft-val {
        font-size: 0.72rem;
        font-weight: 700;
        color: #475569;
        min-width: 2.2rem;
        text-align: center;
        background: #fff;
        border: 1px solid #c8d4e0;
        border-radius: 0.4rem;
        padding: 0.22rem 0.3rem;
      }
      .ft-select {
        padding: 0.22rem 0.4rem;
        font-size: 0.72rem;
        border-radius: 0.4rem;
        border: 1px solid #c8d4e0;
        background: #fff;
        color: #334155;
        cursor: pointer;
        margin: 0;
        width: auto;
      }
      .ft-sep {
        width: 1px;
        height: 20px;
        background: #c8d4e0;
        flex-shrink: 0;
      }

      /* Workspace controls only — the rendered A4 CV remains template-defined. */
      :host-context(.dark) label { color: #d9e4f4; }
      :host-context(.dark) input,
      :host-context(.dark) textarea,
      :host-context(.dark) select { background: #0e192c; border-color: #364964; color: #edf4fd; }
      :host-context(.dark) input:focus,
      :host-context(.dark) textarea:focus,
      :host-context(.dark) select:focus { border-color: #38bdf8; box-shadow: 0 0 0 3px #0ea5e955; }
      :host-context(.dark) .step,
      :host-context(.dark) .outline,
      :host-context(.dark) .chip,
      :host-context(.dark) .level-bar,
      :host-context(.dark) .typo-btn,
      :host-context(.dark) .typo-select,
      :host-context(.dark) .ft-btn,
      :host-context(.dark) .ft-val,
      :host-context(.dark) .ft-select { background: #15233b; border-color: #354965; color: #dce7f7; }
      :host-context(.dark) .card-block,
      :host-context(.dark) .typo-bar,
      :host-context(.dark) .font-toolbar { background: #13213a; border-color: #314663; }
      :host-context(.dark) .add-dashed { border-color: #415675; color: #b8c6da; }
      :host-context(.dark) .opt { background: #283a55; color: #c3d0e2; }
      :host-context(.dark) .typo-val { color: #b5c3d6; }
      :host-context(.dark) .ft-sep { background: #3a4e6c; }
    `,
  ],
})
export class MakeCvComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly Pencil = Pencil;
  readonly i18n = inject(TranslationService);

  @ViewChild('previewStageEl') previewStageEl?: ElementRef<HTMLDivElement>;
  private previewResizeObserver?: ResizeObserver;

  viewMode = signal<'edit' | 'preview'>('edit');
  isAutoFit = signal<boolean>(true);
  previewStageWidth = signal<number>(400);
  windowWidth = signal<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  windowHeight = signal<number>(typeof window !== 'undefined' ? window.innerHeight : 800);
  modalZoom = signal<number | null>(null);

  calculatedScale = computed(() => {
    if (!this.isAutoFit()) {
      return this.zoom() * 0.48;
    }
    const stageW = this.previewStageWidth();
    if (!stageW || stageW <= 0) {
      const winW = this.windowWidth();
      if (winW >= 1280) return 0.48;
      const padding = winW < 640 ? 32 : 48;
      const avail = Math.max(280, winW - padding);
      return Math.min(1.2, Math.max(0.3, avail / 793.7));
    }
    const availableWidth = Math.max(240, stageW - 16);
    const scale = availableWidth / 793.7;
    return Math.min(1.2, Math.max(0.3, Number(scale.toFixed(3))));
  });

  modalFitScale = computed(() => {
    const winW = this.windowWidth();
    const winH = this.windowHeight();
    const topBarH = winW < 640 ? 80 : 88;
    const modalH = Math.max(300, winH - topBarH);
    const padX = winW < 640 ? 20 : (winW < 1024 ? 36 : 64);
    const padY = winW < 640 ? 80 : 120;
    const availW = Math.max(260, winW - padX);
    const availH = Math.max(320, modalH - padY);

    const scaleW = availW / 793.7;
    const scaleH = availH / 1122.5;

    // On mobile (< 640px), fit to width for clear readable text, scroll vertically
    if (winW < 640) {
      return Math.min(1.0, Math.max(0.32, Number(scaleW.toFixed(3))));
    }
    // On tablet (iPad) & desktop (MacBook Pro), fit by smaller dimension so the entire CV page fits on screen!
    const bestFit = Math.min(scaleW, scaleH);
    return Math.min(1.0, Math.max(0.35, Number(bestFit.toFixed(3))));
  });

  modalScale = computed(() => {
    const custom = this.modalZoom();
    if (custom !== null) return custom;
    return this.modalFitScale();
  });

  modalScalePercent = computed(() => Math.round(this.modalScale() * 100));

  modalZoomIn() {
    const cur = this.modalScale();
    this.modalZoom.set(Math.min(2.0, +(cur + 0.1).toFixed(2)));
  }

  modalZoomOut() {
    const cur = this.modalScale();
    this.modalZoom.set(Math.max(0.25, +(cur - 0.1).toFixed(2)));
  }

  modalResetFit() {
    this.modalZoom.set(null);
  }

  modalSet100() {
    this.modalZoom.set(1.0);
  }

  openFullPreview() {
    this.modalZoom.set(null);
    if (typeof window !== 'undefined') {
      this.windowWidth.set(window.innerWidth);
      this.windowHeight.set(window.innerHeight);
    }
    this.fullPreview.set(true);
  }

  toggleViewMode() {
    const next = this.viewMode() === 'edit' ? 'preview' : 'edit';
    this.viewMode.set(next);
    if (next === 'preview') {
      this.onPreviewModeEnter();
    }
  }

  toggleAutoFit() {
    this.isAutoFit.set(!this.isAutoFit());
    if (this.isAutoFit()) {
      this.zoom.set(1);
      this.updateStageWidth();
    }
  }

  onPreviewModeEnter() {
    setTimeout(() => {
      this.updateStageWidth();
    }, 60);
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (typeof window !== 'undefined') {
      this.windowWidth.set(window.innerWidth);
      this.windowHeight.set(window.innerHeight);
      this.updateStageWidth();
    }
  }

  @HostListener('window:keydown.escape')
  onEscapePress() {
    if (this.fullPreview()) {
      this.fullPreview.set(false);
    }
  }

  updateStageWidth() {
    if (this.previewStageEl?.nativeElement) {
      const width = this.previewStageEl.nativeElement.clientWidth;
      if (width > 0) {
        this.previewStageWidth.set(width);
      }
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.windowWidth.set(window.innerWidth);
      this.windowHeight.set(window.innerHeight);
      if (this.previewStageEl?.nativeElement && typeof ResizeObserver !== 'undefined') {
        this.previewResizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const cr = entry.contentRect;
            if (cr && cr.width > 0) {
              this.previewStageWidth.set(cr.width);
            }
          }
        });
        this.previewResizeObserver.observe(this.previewStageEl.nativeElement);
      }
      this.updateStageWidth();
    }
  }

  UserRound = UserRound;
  Download = Download;
  Save = Save;
  Eye = Eye;
  Upload = Upload;
  X = X;
  Trash2 = Trash2;
  Plus = Plus;
  Type = Type;
  Bold = Bold;
  Minus = Minus;
  AlignJustify = AlignJustify;
  GraduationCap = GraduationCap;
  BriefcaseBusiness = BriefcaseBusiness;
  Star = Star;
  Languages = Languages;
  Award = Award;
  FolderKanban = FolderKanban;
  Palette = Palette;

  jobTitles = JOB_TITLES;
  locations = LOCATIONS;
  institutions = INSTITUTIONS;
  degrees = DEGREES;
  fields = FIELDS_OF_STUDY;
  skillSuggestions = SKILL_SUGGESTIONS;
  languageOptions = LANGUAGE_OPTIONS;
  months = MONTHS;
  years = yearOptions();
  fontWeights = FONT_WEIGHTS;
  lineHeights = LINE_HEIGHTS;
  fontFamilies = FONT_FAMILIES;
  accentPalette = ACCENT_PALETTE;

  skillLevels = SKILL_LEVELS;
  langLevels = LANG_LEVELS;
  skillDraft = { name: '', level: 'Intermediate' as string };
  langDraft = { name: '', proficiency: 'Intermediate' as string };

  active = signal('Personal Information');

  onStepClick(key: string, event?: MouseEvent) {
    this.active.set(key);
    if (event?.currentTarget) {
      const el = event.currentTarget as HTMLElement;
      gsap.fromTo(
        el,
        { scale: 0.88 },
        { scale: 1, duration: 0.35, ease: 'back.out(2.2)', clearProps: 'transform' }
      );
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }
  fullPreview = signal(false);
  photoUrl = signal<string | null>(null);
  zoom = signal(1);
  fontSize = signal(10);
  fontWeight = signal(400);
  lineHeight = signal(1.4);
  fontFamily = signal('Arial, Helvetica, sans-serif');
  sectionLines = signal(true);
  accentColor = signal('#667b97');
  layout = signal<'professional' | 'modern-split' | 'clean-sidebar' | 'elegant-frame' | 'classic-dark' | 'formal-classic' | 'cover-letter' | 'framed-cover-letter' | 'sidebar-cover-letter' | 'minimalist-cover-letter' | 'navy-badge' | 'warm-taupe-timeline' | 'slate-rounded-panels' | 'navy-sidebar-profile' | 'graphite-banner-timeline' | 'minimalist-framed'>('professional');
  cvId: string | null = null;
  templateId: string | null = null;
  hobbyDraft = '';

  isCoverLetter(): boolean {
    return this.layout() === 'cover-letter' || this.layout() === 'framed-cover-letter' || this.layout() === 'sidebar-cover-letter' || this.layout() === 'minimalist-cover-letter';
  }

  defaultSummary = 'Goal-oriented, adaptable, and always striving to learn, grow, and deliver the best results.';

  /** Dynamic list of sections — reorderable by the user */
  stepList = signal<Array<{ key: string; icon: any; coverOnly?: boolean }>>([
    { key: 'Personal Information', icon: UserRound },
    { key: 'Cover Letter',         icon: Award, coverOnly: true },
    { key: 'Education',            icon: GraduationCap },
    { key: 'Work Experience',      icon: BriefcaseBusiness },
    { key: 'Skills',               icon: Star },
    { key: 'Languages',            icon: Languages },
    { key: 'Certifications',       icon: Award },
    { key: 'Projects',             icon: FolderKanban },
    { key: 'References',           icon: UserRound },
    { key: 'Hobbies',              icon: Star },
  ]);

  get steps() {
    return this.stepList();
  }

  sectionOrder = computed(() => this.stepList().map(s => s.key));

  moveSection(key: string, direction: -1 | 1) {
    const list = [...this.stepList()];
    const idx = list.findIndex(s => s.key === key);
    if (idx === -1) return;
    const target = idx + direction;
    if (target < 0 || target >= list.length) return;

    const temp = list[idx];
    list[idx] = list[target];
    list[target] = temp;

    this.stepList.set(list);
    this.scheduleAutoSave();
    this.toast.info(`Moved ${this.labelFor(key)} ${direction < 0 ? 'up ↑' : 'down ↓'}`);
  }

  canMoveUp(key: string): boolean {
    const list = this.stepList();
    const idx = list.findIndex(s => s.key === key);
    return idx > 0;
  }

  canMoveDown(key: string): boolean {
    const list = this.stepList();
    const idx = list.findIndex(s => s.key === key);
    return idx >= 0 && idx < list.length - 1;
  }

  prevStep(): { key: string; label: string } | null {
    const list = this.stepList().filter(s => !s.coverOnly || this.isCoverLetter());
    const idx = list.findIndex(s => s.key === this.active());
    if (idx > 0) return { key: list[idx - 1].key, label: this.labelFor(list[idx - 1].key) };
    return null;
  }

  nextStep(): { key: string; label: string } | null {
    const list = this.stepList().filter(s => !s.coverOnly || this.isCoverLetter());
    const idx = list.findIndex(s => s.key === this.active());
    if (idx >= 0 && idx < list.length - 1) return { key: list[idx + 1].key, label: this.labelFor(list[idx + 1].key) };
    return null;
  }

  /** User-editable display labels — persisted in CV content */
  sectionLabels = signal<Record<string, string>>({
    'Personal Information': 'Personal Information',
    'Cover Letter':         'Cover Letter',
    'Education':            'Education',
    'Work Experience':      'Work Experience',
    'Skills':               'Skills',
    'Languages':            'Languages',
    'Certifications':       'Certifications',
    'Projects':             'Projects',
    'References':           'References',
    'Hobbies':              'Hobbies',
  });

  /** Which sidebar label is currently being inline-edited */
  editingLabelKey = signal<string | null>(null);

  labelFor(key: string): string {
    return this.sectionLabels()[key] ?? key;
  }

  onLabelInput(key: string, event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) this.setLabel(key, input.value);
  }

  setLabel(key: string, value: string) {
    const trimmed = value.trim() || key;
    this.sectionLabels.update(m => ({ ...m, [key]: trimmed }));
  }

  startEditLabel(key: string, event: MouseEvent) {
    event.stopPropagation();
    this.editingLabelKey.set(key);
  }

  finishEditLabel(key: string, input: HTMLInputElement) {
    this.setLabel(key, input.value);
    this.editingLabelKey.set(null);
  }

  isPaid = signal<boolean>(false);
  showKhqrModal = signal<boolean>(false);

  form: FormGroup;
  private presentationChangesReady = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toast: ToastService,
    private pptx: PptxExportService,
    public auth: AuthService,
  ) {
    this.form = this.fb.group({
      fullName: [''],
      jobTitle: [''],
      email: [''],
      phone: [''],
      location: [''],
      linkedin: [''],
      summary: [''],
      dob: [''],
      height: [''],
      maritalStatus: [''],
      recipientName: [''],
      recipientDept: [''],
      greeting: [''],
      closing: [''],
      subject: [''],
      education: this.fb.array([this.newEducation()]),
      experience: this.fb.array([this.newExperience()]),
      skills: this.fb.array([]),
      languages: this.fb.array([]),
      certifications: this.fb.array([]),
      projects: this.fb.array([this.newProject()]),
      references: this.fb.array([]),
      hobbies: this.fb.array([]),
    });
    effect(() => {
      this.fontSize();
      this.fontWeight();
      this.lineHeight();
      this.fontFamily();
      this.sectionLines();
      this.accentColor();
      if (this.presentationChangesReady) this.scheduleAutoSave();
      this.presentationChangesReady = true;
    });
    this.cvId = this.route.snapshot.queryParamMap.get('cvId');
    this.templateId = this.route.snapshot.queryParamMap.get('templateId');
    const color = this.route.snapshot.queryParamMap.get('color');
    if (color) this.setAccent(color, false);
    const layoutParam = this.route.snapshot.queryParamMap.get('layout');
    if (layoutParam === 'modern-split' || this.templateId === '3') this.layout.set('modern-split');
    else if (layoutParam === 'clean-sidebar' || this.templateId === '5') this.layout.set('clean-sidebar');
    else if (layoutParam === 'elegant-frame' || this.templateId === '6') this.layout.set('elegant-frame');
    else if (layoutParam === 'classic-dark' || this.templateId === '7') this.layout.set('classic-dark');
    else if (layoutParam === 'formal-classic' || this.templateId === '8') this.layout.set('formal-classic');
    else if (layoutParam === 'cover-letter' || this.templateId === '9') this.layout.set('cover-letter');
    else if (layoutParam === 'warm-taupe-timeline' || this.templateId === '11') this.layout.set('warm-taupe-timeline');
    else if (layoutParam === 'graphite-banner-timeline' || this.templateId === '12') this.layout.set('graphite-banner-timeline');
    else if (layoutParam === 'navy-sidebar-profile' || this.templateId === '13') this.layout.set('navy-sidebar-profile');
    else if (layoutParam === 'slate-rounded-panels' || this.templateId === '14') this.layout.set('slate-rounded-panels');
    else if (layoutParam === 'framed-cover-letter' || this.templateId === '16') this.layout.set('framed-cover-letter');
    else if (layoutParam === 'sidebar-cover-letter' || this.templateId === '17') this.layout.set('sidebar-cover-letter');
    else if (layoutParam === 'minimalist-cover-letter' || this.templateId === '18') this.layout.set('minimalist-cover-letter');
    else if (layoutParam === 'navy-badge' || this.templateId === '19') this.layout.set('navy-badge');
    else if (layoutParam === 'minimalist-framed' || this.templateId === '20') this.layout.set('minimalist-framed');
  }

  ngOnInit() {
    if (this.auth.isStaffOrAdmin()) {
      this.isPaid.set(true);
    }
    if (this.cvId) {
      this.http.get<{ cv: any }>(`/api/v1/cvs/${this.cvId}`).subscribe({
        next: ({ cv }) => {
          if (cv.is_paid || this.auth.isStaffOrAdmin()) {
            this.isPaid.set(true);
          }
          const content = typeof cv.content === 'string' ? JSON.parse(cv.content || '{}') : cv.content || {};
          const isEmpty = !content.fullName && (!content.experience || !content.experience.length);
          if (isEmpty && (this.layout() === 'minimalist-framed' || cv.template_id === 20 || this.templateId === '20')) {
            this.patchMinimalistFramedDefaults();
          } else if (isEmpty && (this.layout() === 'navy-badge' || cv.template_id === 19 || this.templateId === '19')) {
            this.patchNavyBadgeDefaults();
          } else if (isEmpty && (this.layout() === 'navy-sidebar-profile' || cv.template_id === 13 || this.templateId === '13')) {
            this.patchNavySidebarDefaults();
          } else if (isEmpty && (this.layout() === 'minimalist-cover-letter' || cv.template_id === 18 || this.templateId === '18')) {
            this.patchMinimalistCoverLetterDefaults();
          } else {
            this.patchFromContent(content);
          }
          if (!content.accent && cv.selected_color) this.setAccent(cv.selected_color, false);
        },
        error: () => {},
      });
    } else if (this.layout() === 'minimalist-framed' || this.templateId === '20') {
      this.patchMinimalistFramedDefaults();
    } else if (this.layout() === 'navy-badge' || this.templateId === '19') {
      this.patchNavyBadgeDefaults();
    } else if (this.layout() === 'navy-sidebar-profile' || this.templateId === '13') {
      this.patchNavySidebarDefaults();
    } else if (this.layout() === 'minimalist-cover-letter' || this.templateId === '18') {
      this.patchMinimalistCoverLetterDefaults();
    }

    // Auto-save on any form change (debounced 10 seconds)
    this.form.valueChanges.subscribe(() => this.scheduleAutoSave());
  }

  get education() {
    return this.form.get('education') as FormArray;
  }
  get experience() {
    return this.form.get('experience') as FormArray;
  }
  get skills() {
    return this.form.get('skills') as FormArray;
  }
  get languages() {
    return this.form.get('languages') as FormArray;
  }
  get certifications() {
    return this.form.get('certifications') as FormArray;
  }
  get projects() {
    return this.form.get('projects') as FormArray;
  }
  get references() {
    return this.form.get('references') as FormArray;
  }
  get hobbies() {
    return this.form.get('hobbies') as FormArray;
  }

  responsibilities(jobIndex: number) {
    return this.experience.at(jobIndex).get('responsibilities') as FormArray;
  }

  /** Merge month/year selects into display dates for the CV. */
  mappedExperience() {
    return (this.form.value.experience || []).map((e: any) => ({
      ...e,
      startDate: [e.startMonth, e.startYear].filter(Boolean).join(' ') || e.startDate || '',
      endDate: [e.endMonth, e.endYear].filter(Boolean).join(' ') || e.endDate || '',
    }));
  }

  // ── Live-preview placeholders ────────────────────────────────────────────
  // Empty sections fall back to sample content so the layout stays readable
  // while building. Saving always uses the real form values, so anything the
  // user types immediately replaces the matching placeholder.

  private text(value: any, fallback: string): string {
    return typeof value === 'string' && value.trim() ? value : fallback;
  }

  private rows(list: any[], hasValue: (item: any) => boolean, fallback: any[]): any[] {
    const filled = (list || []).filter(hasValue);
    return filled.length ? filled : fallback;
  }

  /** True while any section is still showing sample content. */
  usingSampleData(): boolean {
    const v = this.form.value;
    const filled = [
      v.fullName, v.jobTitle, v.email, v.phone, v.location, v.linkedin, v.summary,
    ].some((value: any) => typeof value === 'string' && value.trim());
    const lists =
      (v.education || []).some((e: any) => e.institution || e.degree || e.field) ||
      (v.experience || []).some((e: any) => e.company || e.position) ||
      (v.skills || []).some((s: any) => s.name) ||
      (v.languages || []).some((l: any) => l.name);
    return !filled && !lists;
  }

  previewName() { return this.text(this.form.value.fullName, PREVIEW_PLACEHOLDER.name); }
  previewJobTitle() { return this.text(this.form.value.jobTitle, PREVIEW_PLACEHOLDER.jobTitle); }
  previewEmail() { return this.text(this.form.value.email, PREVIEW_PLACEHOLDER.email); }
  previewPhone() { return this.text(this.form.value.phone, PREVIEW_PLACEHOLDER.phone); }
  previewLocation() { return this.text(this.form.value.location, PREVIEW_PLACEHOLDER.location); }
  previewLinkedin() { return this.text(this.form.value.linkedin, PREVIEW_PLACEHOLDER.linkedin); }
  previewSummary() { return this.text(this.form.value.summary, PREVIEW_PLACEHOLDER.summary); }

  previewEducation() {
    return this.rows(this.form.value.education, (e) => e.institution || e.degree || e.field || e.startYear, PREVIEW_PLACEHOLDER.education);
  }
  previewExperience() {
    return this.rows(this.mappedExperience(), (e) => e.company || e.position || (e.responsibilities || []).some((r: string) => r && r.trim()), PREVIEW_PLACEHOLDER.experience);
  }
  previewSkills() { return this.rows(this.form.value.skills, (s) => s.name, PREVIEW_PLACEHOLDER.skills); }
  previewLanguages() { return this.rows(this.form.value.languages, (l) => l.name, PREVIEW_PLACEHOLDER.languages); }
  previewCertifications() { return this.rows(this.form.value.certifications, (c) => c.name, PREVIEW_PLACEHOLDER.certifications); }
  previewProjects() { return this.rows(this.form.value.projects, (p) => p.name || p.description, PREVIEW_PLACEHOLDER.projects); }
  previewReferences() { return this.rows(this.form.value.references, (r) => r.name, PREVIEW_PLACEHOLDER.references); }
  previewHobbies() { return this.rows(this.form.value.hobbies, (h) => h.name, PREVIEW_PLACEHOLDER.hobbies); }

  newEducation() {
    return this.fb.group({
      institution: [''],
      degree: [''],
      field: [''],
      startYear: [''],
      endYear: [''],
      current: [false],
      gpa: [''],
      description: [''],
    });
  }

  newExperience() {
    return this.fb.group({
      company: [''],
      position: [''],
      startMonth: [''],
      startYear: [''],
      endMonth: [''],
      endYear: [''],
      startDate: [''],
      endDate: [''],
      current: [false],
      responsibilities: this.fb.array([this.fb.control('')]),
    });
  }

  newProject() {
    return this.fb.group({ name: [''], description: [''], link: [''] });
  }

  newCertification() {
    return this.fb.group({ name: [''], issuer: [''], date: [''] });
  }

  bumpFont(delta: number) {
    this.fontSize.update((n) => Math.min(16, Math.max(7, n + delta)));
  }

  setAccent(value: string, schedule = true) {
    const normalized = String(value || '').trim();
    if (!/^#[0-9a-f]{6}$/i.test(normalized)) return;
    this.accentColor.set(normalized.toUpperCase());
    if (schedule) this.scheduleAutoSave();
  }

  addEducation() {
    this.education.push(this.newEducation());
  }
  removeEducation(i: number) {
    if (this.education.length > 1) this.education.removeAt(i);
  }
  addExperience() {
    this.experience.push(this.newExperience());
  }
  removeExperience(i: number) {
    if (this.experience.length > 1) this.experience.removeAt(i);
  }


  addResponsibility(jobIndex: number) {
    this.responsibilities(jobIndex).push(this.fb.control(''));
  }
  removeResponsibility(jobIndex: number, ri: number) {
    const arr = this.responsibilities(jobIndex);
    if (arr.length > 1) {
      arr.removeAt(ri);
    } else {
      arr.at(0).setValue('');
    }
    arr.markAsDirty();
    this.form.updateValueAndValidity();
    this.scheduleAutoSave();
  }

  moveResponsibility(jobIndex: number, ri: number, direction: number) {
    const arr = this.responsibilities(jobIndex);
    const target = ri + direction;
    if (target < 0 || target >= arr.length) return;
    const currentValue = arr.at(ri).value;
    const targetValue = arr.at(target).value;
    arr.at(ri).setValue(targetValue);
    arr.at(target).setValue(currentValue);
  }

  // ── Multi-select batch deletion ──
  selectedItems: Record<string, Set<number>> = {
    education: new Set(),
    experience: new Set(),
    skills: new Set(),
    languages: new Set(),
    certifications: new Set(),
    projects: new Set(),
    references: new Set(),
    hobbies: new Set(),
  };

  isSelected(section: string, index: number): boolean {
    return this.selectedItems[section]?.has(index) ?? false;
  }

  toggleSelect(section: string, index: number) {
    if (!this.selectedItems[section]) this.selectedItems[section] = new Set();
    if (this.selectedItems[section].has(index)) {
      this.selectedItems[section].delete(index);
    } else {
      this.selectedItems[section].add(index);
    }
  }

  isAllSelected(section: string, count: number): boolean {
    if (count === 0) return false;
    return (this.selectedItems[section]?.size ?? 0) === count;
  }

  toggleSelectAll(section: string, count: number) {
    if (!this.selectedItems[section]) this.selectedItems[section] = new Set();
    if (this.isAllSelected(section, count)) {
      this.selectedItems[section].clear();
    } else {
      this.selectedItems[section] = new Set(Array.from({ length: count }, (_, i) => i));
    }
  }

  selectedCount(section: string): number {
    return this.selectedItems[section]?.size ?? 0;
  }

  deleteSelected(section: string) {
    const set = this.selectedItems[section];
    if (!set || set.size === 0) return;
    const arr = (this as any)[section] as FormArray;
    if (!arr) return;

    const indices = Array.from(set).sort((a, b) => b - a);
    for (const idx of indices) {
      if (arr.length > 0) {
        arr.removeAt(idx);
      }
    }
    set.clear();
    arr.markAsDirty();
    this.form.updateValueAndValidity();
    this.scheduleAutoSave();
    this.toast.success('Deleted selected items');
  }

  // ── Reorder helpers (Robust FormArray value reordering) ──
  reorderFormArray(arr: FormArray, from: number, to: number, createNewFn?: () => FormGroup) {
    if (from === to || from < 0 || from >= arr.length || to < 0 || to >= arr.length) return;

    const vals = arr.getRawValue();
    const [moved] = vals.splice(from, 1);
    vals.splice(to, 0, moved);

    while (arr.length > 0) {
      arr.removeAt(0);
    }

    vals.forEach((val: any) => {
      if (createNewFn) {
        const group = createNewFn();
        group.patchValue(val);
        if (group.get('responsibilities') && Array.isArray(val.responsibilities)) {
          const respArr = group.get('responsibilities') as FormArray;
          while (respArr.length > 0) respArr.removeAt(0);
          val.responsibilities.forEach((r: string) => respArr.push(this.fb.control(r)));
        }
        arr.push(group);
      } else {
        arr.push(this.fb.group(val));
      }
    });

    arr.markAsDirty();
    this.form.updateValueAndValidity();
    this.scheduleAutoSave();
  }

  moveEducation(i: number, direction: number) {
    const to = i + direction;
    if (to < 0 || to >= this.education.length) return;
    this.reorderFormArray(this.education, i, to, () => this.newEducation());
    this.toast.info(`Moved Education ${direction < 0 ? 'up ↑' : 'down ↓'}`);
  }

  moveExperience(i: number, direction: number) {
    const to = i + direction;
    if (to < 0 || to >= this.experience.length) return;
    this.reorderFormArray(this.experience, i, to, () => this.newExperience());
    this.toast.info(`Moved Work Experience ${direction < 0 ? 'up ↑' : 'down ↓'}`);
  }

  moveSkill(i: number, direction: number) {
    const to = i + direction;
    if (to < 0 || to >= this.skills.length) return;
    this.reorderFormArray(this.skills, i, to, () => this.fb.group({ name: [''], level: ['Intermediate'] }));
    this.toast.info(`Moved Skill ${direction < 0 ? 'up ↑' : 'down ↓'}`);
  }

  moveLanguage(i: number, direction: number) {
    const to = i + direction;
    if (to < 0 || to >= this.languages.length) return;
    this.reorderFormArray(this.languages, i, to, () => this.fb.group({ name: [''], proficiency: ['Intermediate'] }));
    this.toast.info(`Moved Language ${direction < 0 ? 'up ↑' : 'down ↓'}`);
  }

  moveCertification(i: number, direction: number) {
    const to = i + direction;
    if (to < 0 || to >= this.certifications.length) return;
    this.reorderFormArray(this.certifications, i, to, () => this.newCertification());
    this.toast.info(`Moved Certification ${direction < 0 ? 'up ↑' : 'down ↓'}`);
  }

  moveProject(i: number, direction: number) {
    const to = i + direction;
    if (to < 0 || to >= this.projects.length) return;
    this.reorderFormArray(this.projects, i, to, () => this.newProject());
    this.toast.info(`Moved Project ${direction < 0 ? 'up ↑' : 'down ↓'}`);
  }

  moveReference(i: number, direction: number) {
    const to = i + direction;
    if (to < 0 || to >= this.references.length) return;
    this.reorderFormArray(this.references, i, to, () => this.newReference());
    this.toast.info(`Moved Reference ${direction < 0 ? 'up ↑' : 'down ↓'}`);
  }

  moveHobby(i: number, direction: number) {
    const to = i + direction;
    if (to < 0 || to >= this.hobbies.length) return;
    this.reorderFormArray(this.hobbies, i, to, () => this.fb.group({ name: [''] }));
    this.toast.info(`Moved Hobby ${direction < 0 ? 'up ↑' : 'down ↓'}`);
  }

  moveResp(jobIndex: number, from: number, direction: number) {
    const arr = this.responsibilities(jobIndex);
    const to = from + direction;
    if (to < 0 || to >= arr.length) return;
    const vals = arr.getRawValue();
    const [moved] = vals.splice(from, 1);
    vals.splice(to, 0, moved);
    while (arr.length > 0) arr.removeAt(0);
    vals.forEach((v: string) => arr.push(this.fb.control(v)));
    arr.markAsDirty();
    this.form.updateValueAndValidity();
    this.scheduleAutoSave();
  }

  // ── Drag-and-drop reorder ──
  private dragType = '';
  private dragParent = 0;
  private dragIndex = 0;

  onDragStart(event: DragEvent, type: string, parent: number, index: number) {
    this.dragType = type;
    this.dragParent = parent;
    this.dragIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', `${type}:${parent}:${index}`);
    }
    const el = event.currentTarget as HTMLElement;
    if (el) el.classList.add('dragging');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  onDrop(event: DragEvent, type: string, parent: number, targetIndex: number) {
    event.preventDefault();
    if (type !== this.dragType || parent !== this.dragParent || targetIndex === this.dragIndex) return;

    if (type === 'resp') {
      const arr = this.responsibilities(parent);
      const vals = arr.getRawValue();
      const [moved] = vals.splice(this.dragIndex, 1);
      vals.splice(targetIndex, 0, moved);
      while (arr.length > 0) arr.removeAt(0);
      vals.forEach((v: string) => arr.push(this.fb.control(v)));
      arr.markAsDirty();
      this.form.updateValueAndValidity();
      this.scheduleAutoSave();
    } else if (type === 'exp') {
      this.reorderFormArray(this.experience, this.dragIndex, targetIndex, () => this.newExperience());
    } else if (type === 'edu') {
      this.reorderFormArray(this.education, this.dragIndex, targetIndex, () => this.newEducation());
    } else if (type === 'skill') {
      this.reorderFormArray(this.skills, this.dragIndex, targetIndex, () => this.fb.group({ name: [''], level: ['Intermediate'] }));
    } else if (type === 'lang') {
      this.reorderFormArray(this.languages, this.dragIndex, targetIndex, () => this.fb.group({ name: [''], proficiency: ['Intermediate'] }));
    } else if (type === 'cert') {
      this.reorderFormArray(this.certifications, this.dragIndex, targetIndex, () => this.newCertification());
    } else if (type === 'proj') {
      this.reorderFormArray(this.projects, this.dragIndex, targetIndex, () => this.newProject());
    } else if (type === 'ref') {
      this.reorderFormArray(this.references, this.dragIndex, targetIndex, () => this.newReference());
    } else if (type === 'hobby') {
      this.reorderFormArray(this.hobbies, this.dragIndex, targetIndex, () => this.fb.group({ name: [''] }));
    }
  }

  onDragEnd(event: DragEvent) {
    const el = event.currentTarget as HTMLElement;
    if (el) el.classList.remove('dragging');
    const dragEls = document.querySelectorAll('.dragging');
    dragEls.forEach((d) => d.classList.remove('dragging'));
  }
  addSkill() {
    const name = this.skillDraft.name.trim();
    if (!name) {
      this.toast.info(this.i18n.currentLang() === 'kh' ? 'សូមបញ្ចូល ឬជ្រើសរើសជំនាញជាមុនសិន' : 'Enter or select a skill name first.');
      return;
    }
    this.skills.push(this.fb.group({ name: [name], level: [this.skillDraft.level] }));
    this.skillDraft = { name: '', level: 'Intermediate' };
  }
  removeSkill(i: number) {
    this.skills.removeAt(i);
  }
  addLanguage() {
    const name = this.langDraft.name.trim();
    if (!name) {
      this.toast.info(this.i18n.currentLang() === 'kh' ? 'សូមជ្រើសរើសភាសាជាមុនសិន' : 'Select a language first.');
      return;
    }
    this.languages.push(this.fb.group({ name: [name], proficiency: [this.langDraft.proficiency] }));
    this.langDraft = { name: '', proficiency: 'Intermediate' };
  }
  removeLanguage(i: number) {
    this.languages.removeAt(i);
  }
  addCertification() {
    this.certifications.push(this.newCertification());
  }
  removeCertification(i: number) {
    this.certifications.removeAt(i);
  }
  addProject() {
    this.projects.push(this.newProject());
  }
  removeProject(i: number) {
    if (this.projects.length > 1) this.projects.removeAt(i);
  }

  newReference() {
    return this.fb.group({ name: [''], position: [''], company: [''], phone: [''], email: [''] });
  }
  addReference() {
    this.references.push(this.newReference());
  }
  removeReference(i: number) {
    this.references.removeAt(i);
  }

  addHobby() {
    const name = this.hobbyDraft.trim();
    if (!name) return;
    this.hobbies.push(this.fb.group({ name: [name] }));
    this.hobbyDraft = '';
  }
  removeHobby(i: number) {
    this.hobbies.removeAt(i);
  }

  onCurrentEdu(i: number) {
    const g = this.education.at(i);
    if (g.get('current')?.value) g.patchValue({ endYear: '' });
  }
  onCurrentJob(i: number) {
    const g = this.experience.at(i);
    if (g.get('current')?.value) g.patchValue({ endMonth: '', endYear: '', endDate: '' });
  }

  selectPhoto(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.toast.warning(this.i18n.currentLang() === 'kh' ? 'សូមជ្រើសរើសឯកសារជារូបភាព' : 'Please choose an image file.');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      this.toast.warning(this.i18n.currentLang() === 'kh' ? 'សូមជ្រើសរើសរូបថតដែលមានទំហំតូចជាង 1.5 MB' : 'Please use a photo under 1.5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.photoUrl.set(String(reader.result));
    reader.readAsDataURL(file);
  }

  zoomIn() {
    this.isAutoFit.set(false);
    this.zoom.set(Math.min(2, +(this.zoom() + 0.1).toFixed(2)));
  }
  zoomOut() {
    this.isAutoFit.set(false);
    this.zoom.set(Math.max(0.4, +(this.zoom() - 0.1).toFixed(2)));
  }

  buildContent() {
    const raw = this.form.getRawValue();
    const experience = (raw.experience || [])
      .filter((e: any) => e.company || e.position)
      .map((e: any) => ({
        ...e,
        startDate: [e.startMonth, e.startYear].filter(Boolean).join(' ') || e.startDate || '',
        endDate: [e.endMonth, e.endYear].filter(Boolean).join(' ') || e.endDate || '',
        responsibilities: (e.responsibilities || []).filter((r: string) => r && r.trim()),
      }));
    return {
      ...raw,
      photoUrl: this.photoUrl(),
      education: (raw.education || []).filter((e: any) => e.institution || e.degree),
      experience,
      skills: (raw.skills || []).filter((s: any) => s.name),
      languages: (raw.languages || []).filter((l: any) => l.name),
      certifications: (raw.certifications || []).filter((c: any) => c.name),
      projects: (raw.projects || []).filter((p: any) => p.name || p.description),
      references: (raw.references || []).filter((r: any) => r.name),
      hobbies: (raw.hobbies || []).filter((h: any) => h.name),
      typography: {
        fontSize: this.fontSize(),
        fontWeight: this.fontWeight(),
        lineHeight: this.lineHeight(),
        sectionLines: this.sectionLines(),
        fontFamily: this.fontFamily(),
      },
      accent: this.accentColor(),
      layout: this.layout(),
      sectionLabels: this.sectionLabels(),
      sectionOrder: this.sectionOrder(),
    };
  }

  patchFromContent(content: any) {
    if (!content || typeof content !== 'object') return;
    this.form.patchValue({
      fullName: content.fullName || '',
      jobTitle: content.jobTitle || '',
      email: content.email || '',
      phone: content.phone || '',
      location: content.location || '',
      linkedin: content.linkedin || '',
      summary: content.summary || '',
      dob: content.dob || '',
      height: content.height || '',
      maritalStatus: content.maritalStatus || '',
      recipientName: content.recipientName || '',
      recipientDept: content.recipientDept || '',
      greeting: content.greeting || '',
      closing: content.closing || '',
      subject: content.subject || '',
    });
    if (content.photoUrl) this.photoUrl.set(content.photoUrl);
    if (content.accent) this.setAccent(content.accent, false);
    if (content.typography) {
      if (content.typography.fontSize) this.fontSize.set(content.typography.fontSize);
      if (content.typography.fontWeight) this.fontWeight.set(content.typography.fontWeight);
      if (content.typography.lineHeight) this.lineHeight.set(content.typography.lineHeight);
      if (typeof content.typography.sectionLines === 'boolean') this.sectionLines.set(content.typography.sectionLines);
      if (content.typography.fontFamily) this.fontFamily.set(content.typography.fontFamily);
    }

    this.education.clear();
    if (Array.isArray(content.education) && content.education.length) {
      content.education.forEach((e: any) =>
        this.education.push(
          this.fb.group({
            institution: [e.institution || ''],
            degree: [e.degree || ''],
            field: [e.field || ''],
            startYear: [e.startYear || ''],
            endYear: [e.endYear || ''],
            current: [!!e.current],
            gpa: [e.gpa || ''],
            description: [e.description || ''],
          }),
        ),
      );
    } else {
      this.education.push(this.newEducation());
    }

    this.experience.clear();
    if (Array.isArray(content.experience) && content.experience.length) {
      content.experience.forEach((e: any) => {
        const resps = Array.isArray(e.responsibilities) && e.responsibilities.length ? e.responsibilities : [''];
        const { month: sm, year: sy } = this.splitDate(e.startDate || e.startMonth);
        const { month: em, year: ey } = this.splitDate(e.endDate || e.endMonth);
        this.experience.push(
          this.fb.group({
            company: [e.company || ''],
            position: [e.position || ''],
            startMonth: [e.startMonth || sm],
            startYear: [e.startYear || sy],
            endMonth: [e.endMonth || em],
            endYear: [e.endYear || ey],
            startDate: [e.startDate || ''],
            endDate: [e.endDate || ''],
            current: [!!e.current],
            responsibilities: this.fb.array(resps.map((r: string) => this.fb.control(r))),
          }),
        );
      });
    } else {
      this.experience.push(this.newExperience());
    }

    this.skills.clear();
    if (Array.isArray(content.skills)) {
      content.skills.forEach((s: any) => {
        if (typeof s === 'string') this.skills.push(this.fb.group({ name: [s], level: ['Intermediate'] }));
        else this.skills.push(this.fb.group({ name: [s.name || ''], level: [s.level || 'Intermediate'] }));
      });
    }

    this.languages.clear();
    if (Array.isArray(content.languages)) {
      content.languages.forEach((l: any) => {
        if (typeof l === 'string') this.languages.push(this.fb.group({ name: [l], proficiency: ['Intermediate'] }));
        else this.languages.push(this.fb.group({ name: [l.name || ''], proficiency: [l.proficiency || 'Intermediate'] }));
      });
    }

    this.certifications.clear();
    if (Array.isArray(content.certifications)) {
      content.certifications.forEach((c: any) => {
        if (typeof c === 'string') this.certifications.push(this.fb.group({ name: [c], issuer: [''], date: [''] }));
        else this.certifications.push(this.fb.group({ name: [c.name || ''], issuer: [c.issuer || ''], date: [c.date || ''] }));
      });
    }

    this.projects.clear();
    if (Array.isArray(content.projects) && content.projects.length) {
      content.projects.forEach((p: any) =>
        this.projects.push(this.fb.group({ name: [p.name || ''], description: [p.description || ''], link: [p.link || ''] })),
      );
    } else {
      this.projects.push(this.newProject());
    }

    this.references.clear();
    if (Array.isArray(content.references)) {
      content.references.forEach((r: any) =>
        this.references.push(this.fb.group({
          name: [r.name || ''], position: [r.position || ''],
          company: [r.company || ''], phone: [r.phone || ''], email: [r.email || ''],
        })),
      );
    }

    this.hobbies.clear();
    if (Array.isArray(content.hobbies)) {
      content.hobbies.forEach((h: any) => {
        const name = typeof h === 'string' ? h : h.name || '';
        if (name) this.hobbies.push(this.fb.group({ name: [name] }));
      });
    }

    if (content.layout) this.layout.set(content.layout);
    if (content.sectionLabels && typeof content.sectionLabels === 'object') {
      this.sectionLabels.update(defaults => ({ ...defaults, ...content.sectionLabels }));
    }
    if (Array.isArray(content.sectionOrder) && content.sectionOrder.length) {
      const currentList = [...this.stepList()];
      const ordered: any[] = [];
      content.sectionOrder.forEach((k: string) => {
        const found = currentList.find(s => s.key === k);
        if (found) ordered.push(found);
      });
      currentList.forEach(s => {
        if (!ordered.find(o => o.key === s.key)) ordered.push(s);
      });
      this.stepList.set(ordered);
    }
  }

  patchMinimalistFramedDefaults() {
    this.form.patchValue({
      fullName: 'LORNA ALVARADO',
      jobTitle: 'Sales Representative',
      email: 'hello@reallygreatsite.com',
      phone: '+123-456-7890',
      location: '123 Anywhere St., Any City',
      linkedin: '',
      summary: 'I am a Sales Representative is a professional who initializes and manages relationships with customers. They serve as their point of contact and lead from initial outreach through the making of the final purchase by them or someone in their household.',
    });
    this.photoUrl.set(null);
    this.setAccent('#1F2937', false);

    this.skills.clear();
    const skillsList = [
      'Client Acquisition',
      'B2B Sales',
      'Negotiation',
      'Relationship Management',
      'Market Analysis',
      'Sales Strategies',
      'Negotiation Skills',
      'Problem-Solving',
      'Time Management',
      'Presentation Skills',
      'Networking',
    ];
    for (const sk of skillsList) {
      this.skills.push(this.fb.group({ name: [sk], level: ['Advanced'] }));
    }

    this.education.clear();
    this.education.push(
      this.fb.group({
        institution: ['Wardiere University'],
        degree: ['Bachelor of Business Management'],
        field: ['Business Management'],
        startYear: ['2016'],
        endYear: ['2020'],
        current: [false],
        gpa: [''],
        description: '',
      })
    );
    this.education.push(
      this.fb.group({
        institution: ['Wardiere University'],
        degree: ['Bachelor of Business Management'],
        field: ['Business Management'],
        startYear: ['2020'],
        endYear: ['2023'],
        current: [false],
        gpa: [''],
        description: '',
      })
    );

    this.languages.clear();
    this.languages.push(this.fb.group({ name: ['English'], proficiency: ['Fluent'] }));
    this.languages.push(this.fb.group({ name: ['French'], proficiency: ['Fluent'] }));
    this.languages.push(this.fb.group({ name: ['German'], proficiency: ['Basic'] }));
    this.languages.push(this.fb.group({ name: ['Spanish'], proficiency: ['Intermediate'] }));

    this.experience.clear();
    this.experience.push(
      this.fb.group({
        company: ['Timmerman Industries'],
        position: ['Senior Sales Representative'],
        startMonth: ['January'],
        startYear: ['2021'],
        endMonth: [''],
        endYear: ['Present'],
        startDate: ['January 2021'],
        endDate: ['Present'],
        current: [true],
        responsibilities: this.fb.array([
          this.fb.control('Developed and executed sales strategies, resulting in a 25% increase in annual revenue. Managed a portfolio of 50+ clients, achieving a 95% customer retention rate.'),
          this.fb.control('Conducted market research to identify new business opportunities and target prospects.'),
        ]),
      })
    );
    this.experience.push(
      this.fb.group({
        company: ['Timmerman Industries'],
        position: ['FMCG Sales Agent'],
        startMonth: ['June'],
        startYear: ['2018'],
        endMonth: ['December'],
        endYear: ['2020'],
        startDate: ['June 2018'],
        endDate: ['December 2020'],
        current: [false],
        responsibilities: this.fb.array([
          this.fb.control('Prospected and qualified leads through cold calling, email campaigns, and networking events.'),
          this.fb.control('Maintained up-to-date knowledge of product features and benefits to provide accurate information to clients.'),
        ]),
      })
    );
    this.experience.push(
      this.fb.group({
        company: ['Timmerman Industries'],
        position: ['Sales Agent'],
        startMonth: ['June'],
        startYear: ['2017'],
        endMonth: ['December'],
        endYear: ['2018'],
        startDate: ['June 2017'],
        endDate: ['December 2018'],
        current: [false],
        responsibilities: this.fb.array([
          this.fb.control('Prospected and qualified leads through cold calling, email campaigns, and networking events.'),
          this.fb.control('Increased sales by 20% by implementing effective upselling and cross-selling strategies.'),
          this.fb.control('Maintained up-to-date knowledge of product features and benefits to provide accurate information to clients.'),
        ]),
      })
    );
    this.experience.push(
      this.fb.group({
        company: ['Timmerman Industries'],
        position: ['Sales Agent'],
        startMonth: ['June'],
        startYear: ['2015'],
        endMonth: ['December'],
        endYear: ['2017'],
        startDate: ['June 2015'],
        endDate: ['December 2017'],
        current: [false],
        responsibilities: this.fb.array([
          this.fb.control('Prospected and qualified leads through cold calling, email campaigns, and networking events.'),
          this.fb.control('Increased sales by 20% by implementing effective upselling and cross-selling strategies.'),
          this.fb.control('Maintained up-to-date knowledge of product features and benefits to provide accurate information to clients.'),
        ]),
      })
    );
  }

  patchMinimalistCoverLetterDefaults() {
    this.form.patchValue({
      fullName: 'Sophie Walton',
      jobTitle: 'Customer Service',
      location: '1 Ray Hall Lane, Birmingham,\nBirmingham, B43 6GG, United Kingdom',
      phone: '0121 657 9000',
      email: 'vc@yahoo.co.uk',
      recipientName: 'Mr. Felsted',
      recipientDept: 'Home Depot',
      greeting: 'Dear Mr. Felsted',
      closing: 'Best regards,',
    });
    this.setAccent('#C59B58', false);
  }

  patchNavyBadgeDefaults() {
    this.form.patchValue({
      fullName: 'SAING SOKAIYA',
      jobTitle: 'ACCOUNTING ASSISTANT',
      email: 'kaiyabai2626@gmail.com',
      phone: '096 491 0220',
      location: 'Trapeang Sala Village, Sangkat Dangkor, Phom Penh',
      dob: 'January 06, 2005',
      height: '1.60m',
      maritalStatus: 'Single',
      summary: '',
    });
    this.photoUrl.set('/assets/saing-sokaiya-photo.jpg');
    this.setAccent('#232D42', false);

    this.education.clear();
    this.education.push(
      this.fb.group({
        institution: ['Beltei International University'],
        degree: ['Majoring in Accounting at Beltei International University, Year 3 | Foundation Year GPA: 3.72'],
        field: ['Accounting'],
        startYear: ['2025'],
        endYear: ['Present'],
        current: [true],
        gpa: ['3.72'],
        description: '',
      })
    );
    this.education.push(
      this.fb.group({
        institution: ['Chompu Vorn High School'],
        degree: ['Finished High School at Chompu Vorn High School.'],
        field: [''],
        startYear: ['2022'],
        endYear: ['2024'],
        current: [false],
        gpa: [''],
        description: '',
      })
    );
    this.education.push(
      this.fb.group({
        institution: ['Trapeang Sala Secondary School'],
        degree: ['Finished Secondary School at Trapeang Sala Secondary School.'],
        field: [''],
        startYear: ['2019'],
        endYear: ['2022'],
        current: [false],
        gpa: [''],
        description: '',
      })
    );

    this.experience.clear();
    this.experience.push(
      this.fb.group({
        company: ['iKEY International Institute'],
        position: ['ACCOUNTING & ADMINISTRATIVE INTERN'],
        startMonth: [''],
        startYear: [''],
        endMonth: [''],
        endYear: [''],
        startDate: [''],
        endDate: [''],
        current: [false],
        responsibilities: this.fb.array([
          this.fb.control('Assisted with the preparation of financial statements, including Profit & Loss, Balance Sheet, and Cash Flow reports.'),
          this.fb.control('Supported monthly expense tracking, financial documentation, and record organization.'),
          this.fb.control('Assisted with Chart of Accounts analysis and Owner\'s Equity reporting.'),
          this.fb.control('Prepared business documents and supported administrative operations.'),
          this.fb.control('Developed practical knowledge of accounting procedures and financial reporting.'),
        ]),
      })
    );
    this.experience.push(
      this.fb.group({
        company: ['Hyundai Packaging II Co., Ltd.'],
        position: ['CUSTOMER SERVICE STAFF'],
        startMonth: [''],
        startYear: [''],
        endMonth: [''],
        endYear: [''],
        startDate: [''],
        endDate: [''],
        current: [false],
        responsibilities: this.fb.array([
          this.fb.control('Coordinated with production and other departments to support customer orders.'),
          this.fb.control('Maintained organized customer information, order records, and supporting documents.'),
          this.fb.control('Followed up on customer orders and delivery arrangements.'),
          this.fb.control('Assisted in resolving customer concerns professionally and efficiently.'),
          this.fb.control('Developed strong communication, coordination, documentation, and problem-solving skills.'),
        ]),
      })
    );
    this.experience.push(
      this.fb.group({
        company: ['Mak Sor Café'],
        position: ['CASHIER & SHOP ASSISTANT'],
        startMonth: [''],
        startYear: [''],
        endMonth: [''],
        endYear: [''],
        startDate: [''],
        endDate: [''],
        current: [false],
        responsibilities: this.fb.array([
          this.fb.control('Handled daily cash and mobile payment transactions accurately.'),
          this.fb.control('Recorded daily sales and organized basic transaction records.'),
          this.fb.control('Assisted with monitoring inventory and reporting stock shortages.'),
          this.fb.control('Supported daily shop operations and customer service.'),
          this.fb.control('Developed strong time-management and customer service skills.'),
        ]),
      })
    );

    this.projects.clear();
    [
      'Co-founded and led PRUKSA, a career guidance platform for Cambodian students.',
      'Led data collection, customer validation, documentation, and outreach activities.',
      '1st Place – AI Hackathon, First Wave.',
      '2nd Place – UniPreneur Camp, Cluster 4.',
    ].forEach((p) => this.projects.push(this.fb.group({ title: [p], description: [''] })));

    this.skills.clear();
    [
      'QuickBooks Accounting',
      'Contemporary Management',
      'Accounting for Marketing',
      'Psychology',
      'Principles of Accounting I',
      'Principles of Accounting II',
      'English for Business',
      'Business Writing Skills',
      'Business Strategy',
      'Principles of Economics',
      'Marketing Services',
      'Business Start-Ups',
      'Soft Skills',
      'Fundamental Math for Business',
      'Consumer Behavior',
      'Microeconomics',
    ].forEach((s) => this.skills.push(this.fb.group({ name: [s], level: ['Advanced'] })));

    this.languages.clear();
    this.languages.push(this.fb.group({ name: ['ENGLISH'], proficiency: ['Fluent'] }));
    this.languages.push(this.fb.group({ name: ['CHINESE'], proficiency: ['Intermediate'] }));

    this.references.clear();
    this.references.push(
      this.fb.group({
        name: ['Mr. OM DINA'],
        position: ['Lecturer at Beltei International University'],
        company: ['Beltei International University'],
        phone: ['096 207 2076 / 012 99 63 97'],
        email: [''],
      })
    );
    this.references.push(
      this.fb.group({
        name: ['Mr. Chey Khimthy'],
        position: ['Lecturer, BELTEI International University'],
        company: ['BELTEI International University'],
        phone: ['096 612 1951'],
        email: [''],
      })
    );
    this.references.push(
      this.fb.group({
        name: ['Mr. Sok Savuth'],
        position: ['Lecturer, BELTEI International University'],
        company: ['BELTEI International University'],
        phone: ['066 834 169'],
        email: [''],
      })
    );
  }

  patchNavySidebarDefaults() {
    this.form.patchValue({
      fullName: 'LORNA ALVARADO',
      jobTitle: 'Sales Representative',
      email: 'hello@reallygreatsite.com',
      phone: '123-456-7890',
      location: '123 Anywhere St., Any City',
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    });
    this.photoUrl.set('/assets/lorna-alvarado-photo.png');
    this.setAccent('#16394F', false);

    this.education.clear();
    this.education.push(
      this.fb.group({
        institution: ['Borcelle University'],
        degree: ['Bachelor of Business Management'],
        field: ['Business Management'],
        startYear: ['2020'],
        endYear: ['2023'],
        current: [false],
        gpa: [''],
        description: '',
      })
    );
    this.education.push(
      this.fb.group({
        institution: ['Wardiere University'],
        degree: ['Bachelor of Business Management'],
        field: ['Business Management'],
        startYear: ['2016'],
        endYear: ['2020'],
        current: [false],
        gpa: [''],
        description: '',
      })
    );
    this.education.push(
      this.fb.group({
        institution: ['Borcelle University'],
        degree: ['Bachelor of Business Management'],
        field: ['Business Management'],
        startYear: ['2012'],
        endYear: ['2016'],
        current: [false],
        gpa: [''],
        description: '',
      })
    );

    this.experience.clear();
    this.experience.push(
      this.fb.group({
        company: ['Arowwai Industries'],
        position: ['Product Design Manager'],
        startMonth: [''],
        startYear: ['2016'],
        endMonth: [''],
        endYear: ['2020'],
        startDate: ['2016'],
        endDate: ['2020'],
        current: [false],
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.',
        responsibilities: this.fb.array([]),
      })
    );
    this.experience.push(
      this.fb.group({
        company: ['Arowwai Industries'],
        position: ['Marketing Manager'],
        startMonth: [''],
        startYear: ['2019'],
        endMonth: [''],
        endYear: ['2020'],
        startDate: ['2019'],
        endDate: ['2020'],
        current: [false],
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.',
        responsibilities: this.fb.array([]),
      })
    );
    this.experience.push(
      this.fb.group({
        company: ['Arowwai Industries'],
        position: ['Marketing Manager'],
        startMonth: [''],
        startYear: ['2017'],
        endMonth: [''],
        endYear: ['2019'],
        startDate: ['2017'],
        endDate: ['2019'],
        current: [false],
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.',
        responsibilities: this.fb.array([]),
      })
    );
    this.experience.push(
      this.fb.group({
        company: ['Arowwai Industries'],
        position: ['Marketing Manager'],
        startMonth: [''],
        startYear: ['2016'],
        endMonth: [''],
        endYear: ['2017'],
        startDate: ['2016'],
        endDate: ['2017'],
        current: [false],
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec risus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.',
        responsibilities: this.fb.array([]),
      })
    );

    this.skills.clear();
    [
      'Management Skills',
      'Creativity',
      'Digital Marketing',
      'Negotiation',
      'Critical Thinking',
      'Leadership',
    ].forEach((s) => this.skills.push(this.fb.group({ name: [s], level: ['Advanced'] })));

    this.languages.clear();
    this.languages.push(this.fb.group({ name: ['English'], proficiency: ['Fluent'] }));
    this.languages.push(this.fb.group({ name: ['Spain'], proficiency: ['Native'] }));

    this.references.clear();
    this.references.push(
      this.fb.group({
        name: ['Harumi Kobayashi'],
        position: ['CEO'],
        company: ['Wardiere Inc.'],
        phone: ['123-456-7890'],
        email: ['hello@reallygreatsite.com'],
      })
    );
    this.references.push(
      this.fb.group({
        name: ['Bailey Dupont'],
        position: ['CEO'],
        company: ['Wardiere Inc.'],
        phone: ['123-456-7890'],
        email: ['hello@reallygreatsite.com'],
      })
    );
  }

  splitDate(value?: string): { month: string; year: string } {
    if (!value) return { month: '', year: '' };
    const parts = String(value).trim().split(/\s+/);
    if (parts.length >= 2) return { month: parts[0], year: parts[1] };
    if (/^\d{4}$/.test(parts[0])) return { month: '', year: parts[0] };
    return { month: parts[0] || '', year: '' };
  }

  ensureCvId(): Promise<string | null> {
    if (this.cvId) return Promise.resolve(this.cvId);
    if (!this.templateId) return Promise.resolve(null);
    return new Promise((resolve) => {
      this.http.post<{ cv: { id: string | number } }>('/api/v1/cvs', { templateId: this.templateId }).subscribe({
        next: ({ cv }) => {
          this.cvId = String(cv.id);
          resolve(this.cvId);
        },
        error: () => resolve(null),
      });
    });
  }

  private autoSaveTimer: any = null;
  showDownloadModal = signal(false);

  scheduleAutoSave() {
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
    this.autoSaveTimer = setTimeout(() => this.autoSave(), 10000);
  }

  async autoSave() {
    const id = this.cvId || (this.templateId ? await this.ensureCvId() : null);
    if (!id) return;
    const content = this.buildContent();
    this.http.put(`/api/v1/cvs/${id}`, { title: content.fullName || 'My CV', content }).subscribe({
      next: () => this.toast.info('Auto-saved'),
      error: () => {},
    });
  }

  async save() {
    const id = await this.ensureCvId();
    if (!id) {
      this.toast.error('Choose a template first to create your CV.');
      return;
    }
    const content = this.buildContent();
    this.http.put(`/api/v1/cvs/${id}`, { title: content.fullName || 'My CV', content }).subscribe({
      next: () => this.toast.success('Draft saved!'),
      error: () => this.toast.error('Could not save your draft.'),
    });
  }

  onDownloadClick() {
    if (this.isPaid() || this.auth.isStaffOrAdmin()) {
      this.showDownloadModal.set(true);
    } else {
      this.showKhqrModal.set(true);
    }
  }

  onKhqrPaymentSuccess(evt: { orderId: number; format?: 'pdf' | 'docx' | 'pptx' }) {
    this.isPaid.set(true);
    this.toast.success('Payment successful! Watermark removed.');
    this.showKhqrModal.set(false);
    if (evt.format) {
      this.downloadAs(evt.format);
    } else {
      this.showDownloadModal.set(true);
    }
  }

  async downloadAs(format: 'pdf' | 'docx' | 'pptx') {
    this.showDownloadModal.set(false);
    const id = await this.ensureCvId();
    if (id) {
      const content = this.buildContent();
      await new Promise<void>((resolve) => {
        this.http.put(`/api/v1/cvs/${id}`, { title: content.fullName || 'My CV', content }).subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
      });
    }

    if (format === 'pdf') {
      this.fullPreview.set(true);
      setTimeout(() => {
        window.print();
        this.toast.success('PDF downloaded!');
      }, 400);
    } else if (format === 'pptx') {
      await this.generatePptx();
    } else {
      this.generateDocx();
    }
  }

  /** Exports the rendered A4 document as an editable PowerPoint deck. */
  private async generatePptx() {
    const preview = document.querySelector('.cv-live-root')?.firstElementChild as HTMLElement | null;
    if (!preview) {
      this.toast.error('Could not capture CV preview');
      return;
    }

    const name = this.buildContent().fullName || 'My_CV';
    try {
      this.toast.success('Building PowerPoint…');
      await this.pptx.export(preview, `${name.replace(/[\\/:*?"<>|]+/g, '_')}.pptx`);
      this.toast.success('PowerPoint downloaded!');
    } catch {
      this.toast.error('Could not create the PowerPoint file');
    }
  }

  private generateDocx() {
    // Capture the actual rendered CV preview HTML with all its inline styles
    const previewEl = document.querySelector('.cv-live-root');
    if (!previewEl) {
      this.toast.error('Could not capture CV preview');
      return;
    }

    const content = this.buildContent();
    const cvHtml = previewEl.innerHTML;

    // Get computed styles from the preview
    const allStyles = Array.from(document.styleSheets)
      .map(sheet => { try { return Array.from(sheet.cssRules).map(r => r.cssText).join('\n'); } catch { return ''; } })
      .join('\n');

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${content.fullName || 'My CV'}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page { size: A4 portrait; margin: 0; }
body { margin: 0; padding: 0; width: 210mm; min-height: 297mm; }
${allStyles}
</style>
</head>
<body>
<div style="width:210mm;min-height:297mm;margin:0;padding:0;">
${cvHtml}
</div>
</body>
</html>`;

    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.fullName || 'My_CV'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.toast.success('Word file downloaded!');
  }

  async download() {
    this.showDownloadModal.set(true);
  }

  ngOnDestroy() {
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
    this.previewResizeObserver?.disconnect();
  }
}
