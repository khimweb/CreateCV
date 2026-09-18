import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Sparkles,
  UploadCloud,
  Download,
  FileCheck,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  Columns,
  Layers,
  ShieldCheck,
  ArrowRight,
  Info,
  Palette,
  UserCheck,
  Move,
  ZoomIn,
  RotateCcw
} from 'lucide-angular';
import { TranslationService } from '../../core/services/translation.service';
import { ToastService } from '../../shared/components/toast/toast.service';

interface OutfitOption {
  id: string;
  category: 'man' | 'woman';
  name: string;
  nameKh: string;
  badge: string;
  thumbnail: string;
  transparent: string;
  prompt: string;
}

interface BackgroundOption {
  id: string;
  name: string;
  nameKh: string;
  hex: string;
  prompt: string;
}

@Component({
  selector: 'app-edit-image',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  template: `
    <main class="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 pt-28 pb-16 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Ambient Glow Orbs -->
      <div class="glow glow-one" aria-hidden="true"></div>
      <div class="glow glow-two" aria-hidden="true"></div>
      <div class="glow glow-three" aria-hidden="true"></div>

      <div class="max-w-7xl mx-auto space-y-10">
        
        <!-- HERO HEADER -->
        <section class="text-center space-y-4 max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <lucide-icon [img]="Sparkles" class="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>{{ i18n.t('editImageBadge') }}</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {{ i18n.t('editImageTitle') }}
            <span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {{ i18n.t('editImageTitleAccent') }}
            </span>
          </h1>

          <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ i18n.t('editImageSubtitle') }}
          </p>
        </section>

        <!-- MAIN WORKSPACE: 2 COLUMNS -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- LEFT COLUMN: CONTROLS & OUTFIT PICKER (5 Cols) -->
          <div class="lg:col-span-5 space-y-6">
            
            <!-- 1. UPLOAD BOX -->
            <div class="glass-panel p-6 rounded-3xl space-y-5">
              <div class="flex items-center justify-between">
                <h2 class="text-base font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">1</span>
                  <span>{{ i18n.t('editImageUploadTitle') }}</span>
                </h2>
                
                <!-- Quick Demo Sample Button -->
                <button
                  type="button"
                  (click)="loadDemoSample()"
                  class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 transition-all hover:scale-105 active:scale-95 shadow-sm">
                  <lucide-icon [img]="Sparkles" class="w-3.5 h-3.5" />
                  <span>{{ i18n.t('editImageTrySample') }}</span>
                </button>
              </div>

              <!-- Upload Area or Preview -->
              @if (!inputImage()) {
                <div
                  class="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50 group"
                  (dragover)="onDragOver($event)"
                  (dragleave)="onDragLeave($event)"
                  (drop)="onFileDrop($event)"
                  (click)="fileInput.click()">
                  <input
                    #fileInput
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    class="hidden"
                    (change)="onFileSelected($event)" />
                  <div class="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <lucide-icon [img]="UploadCloud" class="w-7 h-7" />
                  </div>
                  <p class="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {{ i18n.currentLang() === 'kh' ? 'ចុចទីនេះ ឬទម្លាក់រូបភាព' : 'Click to browse or drag & drop' }}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {{ i18n.t('editImageUploadSub') }}
                  </p>
                </div>
              } @else {
                <div class="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <img
                    [src]="inputImage()"
                    alt="Input thumbnail"
                    class="w-16 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {{ inputFilename() || (i18n.currentLang() === 'kh' ? 'រូបថតបានបញ្ចូល' : 'Uploaded portrait') }}
                    </p>
                    <p class="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                      <lucide-icon [img]="CheckCircle2" class="w-3.5 h-3.5" />
                      <span>{{ i18n.currentLang() === 'kh' ? 'រួចរាល់សម្រាប់ការកែ' : 'Ready for AI Retouch' }}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    (click)="resetInput()"
                    class="text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    {{ i18n.currentLang() === 'kh' ? 'ប្តូរ' : 'Change' }}
                  </button>
                </div>
              }
            </div>

            <!-- 2. OUTFIT / SUIT SELECTION -->
            <div class="glass-panel p-6 rounded-3xl space-y-5">
              <div class="flex items-center justify-between">
                <h2 class="text-base font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">2</span>
                  <span>{{ i18n.t('editImageStep1') }}</span>
                </h2>
              </div>

              <!-- GENDER / CATEGORY TABS -->
              <div class="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <button
                  type="button"
                  (click)="onManCategoryClick()"
                  class="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  [ngClass]="selectedCategory() === 'man'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'">
                  <span>👨</span>
                  <span>{{ i18n.t('editImageCategoryMan') }}</span>
                  <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-extrabold">5</span>
                </button>
                
                <button
                  type="button"
                  (click)="onWomanCategoryClick()"
                  class="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  [ngClass]="selectedCategory() === 'woman'
                    ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'">
                  <span>👩</span>
                  <span>{{ i18n.t('editImageCategoryWoman') }}</span>
                  <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 font-extrabold">5</span>
                </button>
              </div>

              <!-- SUITS GRID (filtered by category) -->
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                @for (outfit of outfits; track outfit.id) {
                  @if (outfit.category === selectedCategory()) {
                  <button
                    type="button"
                    (click)="selectOutfit(outfit.id)"
                    class="p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group"
                    [ngClass]="selectedOutfit() === outfit.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'">
                    
                    <div class="w-full h-24 bg-blue-500/10 dark:bg-slate-800/80 rounded-xl overflow-hidden flex items-center justify-center p-1 border border-slate-200/60 dark:border-slate-700/60 mb-2 relative group-hover:scale-[1.03] transition-transform">
                      <img [src]="outfit.thumbnail" [alt]="outfit.name" class="h-full w-auto object-contain drop-shadow-sm" />
                      
                      @if (selectedOutfit() === outfit.id) {
                        <span class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow-md">✓</span>
                      }
                    </div>

                    <div>
                      <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-full block w-max mb-1"
                        [ngClass]="selectedOutfit() === outfit.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'">
                        {{ outfit.badge }}
                      </span>
                      <b class="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                        {{ i18n.currentLang() === 'kh' ? outfit.nameKh : outfit.name }}
                      </b>
                    </div>
                  </button>
                  }
                }
              </div>
            </div>

            <!-- 3. STUDIO BACKDROP COLOR -->
            <div class="glass-panel p-6 rounded-3xl space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-base font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black">3</span>
                  <span>{{ i18n.t('editImageStep2') }}</span>
                </h2>

                <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {{ getBackgroundHex() }}
                </span>
              </div>

              <div class="grid grid-cols-5 gap-2.5">
                @for (bg of backgrounds; track bg.id) {
                  <button
                    type="button"
                    (click)="selectBackground(bg.id)"
                    class="p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 text-center transition-all"
                    [ngClass]="selectedBackground() === bg.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                    <span
                      class="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm flex items-center justify-center text-xs"
                      [style.background-color]="bg.hex">
                      @if (selectedBackground() === bg.id) {
                        <span [style.color]="bg.id === 'white' || bg.id === 'grey' ? '#0f172a' : '#ffffff'" class="text-xs font-black">✓</span>
                      }
                    </span>
                    <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">
                      {{ i18n.currentLang() === 'kh' ? bg.nameKh : bg.name }}
                    </span>
                  </button>
                }

                <!-- CUSTOM COLOR PICKER -->
                <label
                  class="p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 text-center transition-all cursor-pointer relative"
                  [ngClass]="selectedBackground() === 'custom'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'">
                  <input
                    type="color"
                    [value]="customColor()"
                    (input)="onCustomColorInput($event)"
                    class="absolute opacity-0 w-0 h-0 pointer-events-none" />
                  <span
                    class="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm flex items-center justify-center text-xs"
                    [style.background-color]="customColor()">
                    @if (selectedBackground() === 'custom') {
                      <span class="text-xs font-black text-white mix-blend-difference">✓</span>
                    } @else {
                      <lucide-icon [img]="Palette" class="w-3.5 h-3.5 text-slate-500" />
                    }
                  </span>
                  <span class="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">
                    {{ i18n.t('editImageCustomColor') }}
                  </span>
                </label>
              </div>
            </div>

            <!-- 4. FINE-TUNE HEAD POSITION & FIT (WHEN IMAGE LOADED) -->
            @if (inputImage()) {
              <div class="glass-panel p-5 rounded-3xl space-y-4 border border-indigo-200/70 dark:border-indigo-800/60 bg-indigo-50/30 dark:bg-indigo-950/20">
                <div class="flex items-center justify-between">
                  <h3 class="text-xs font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                    <lucide-icon [img]="Move" class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{{ i18n.t('editImageAdjustTitle') }}</span>
                  </h3>
                  <button
                    type="button"
                    (click)="resetAlignment()"
                    class="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold">
                    <lucide-icon [img]="RotateCcw" class="w-3 h-3" />
                    <span>{{ i18n.t('editImageResetPos') }}</span>
                  </button>
                </div>

                <div class="space-y-3 text-xs">
                  <!-- Zoom / Scale -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                      <span>{{ i18n.t('editImageZoom') }}</span>
                      <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{{ userZoom() }}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.05"
                      [value]="userZoom()"
                      (input)="onZoomChange($event)"
                      class="w-full accent-indigo-600 cursor-pointer" />
                  </div>

                  <!-- Move Up / Down -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                      <span>{{ i18n.t('editImageMoveY') }}</span>
                      <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{{ userOffsetY() }}px</span>
                    </div>
                    <input
                      type="range"
                      min="-250"
                      max="250"
                      step="2"
                      [value]="userOffsetY()"
                      (input)="onOffsetYChange($event)"
                      class="w-full accent-indigo-600 cursor-pointer" />
                  </div>

                  <!-- Move Left / Right -->
                  <div class="space-y-1">
                    <div class="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                      <span>{{ i18n.t('editImageMoveX') }}</span>
                      <span class="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{{ userOffsetX() }}px</span>
                    </div>
                    <input
                      type="range"
                      min="-200"
                      max="200"
                      step="2"
                      [value]="userOffsetX()"
                      (input)="onOffsetXChange($event)"
                      class="w-full accent-indigo-600 cursor-pointer" />
                  </div>
                </div>
              </div>
            }

            <!-- GENERATE ACTION BUTTON -->
            <button
              type="button"
              [disabled]="isGenerating() || !inputImage()"
              (click)="generatePhoto()"
              class="w-full py-4 px-6 rounded-2xl font-black text-white text-base shadow-xl flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);">
              @if (isGenerating()) {
                <lucide-icon [img]="RefreshCw" class="w-5 h-5 animate-spin" />
                <span>{{ i18n.t('editImageBtnGenerating') }}</span>
              } @else {
                <lucide-icon [img]="Sparkles" class="w-5 h-5" />
                <span>{{ i18n.t('editImageBtnGenerate') }}</span>
              }
            </button>

            <!-- Status Notice -->
            @if (statusMessage()) {
              <div class="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300 flex items-start gap-2.5">
                <lucide-icon [img]="Info" class="w-4 h-4 shrink-0 mt-0.5 text-indigo-600 dark:text-indigo-400" />
                <span>{{ statusMessage() }}</span>
              </div>
            }

          </div>

          <!-- RIGHT COLUMN: INTERACTIVE CANVAS / BEFORE-AFTER VIEW (7 Cols) -->
          <div class="lg:col-span-7">
            <div class="glass-panel p-6 rounded-3xl space-y-6">
              
              <!-- TOP TOOLBAR: VIEW MODES & INFO -->
              <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <lucide-icon [img]="Sliders" class="w-4 h-4 text-indigo-500" />
                    <span>{{ i18n.currentLang() === 'kh' ? 'ទិដ្ឋភាពរូបថតស្ទូឌីយោ' : 'Studio Portrait Studio' }}</span>
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ i18n.t('editImageComparing') }}
                  </p>
                </div>

                <!-- Mode Switcher (Split vs Side-by-Side) -->
                @if (generatedImage()) {
                  <div class="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      (click)="viewMode.set('slider')"
                      class="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      [ngClass]="viewMode() === 'slider'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'">
                      <lucide-icon [img]="Layers" class="w-3.5 h-3.5" />
                      <span>Slider</span>
                    </button>
                    <button
                      type="button"
                      (click)="viewMode.set('side')"
                      class="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      [ngClass]="viewMode() === 'side'
                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'">
                      <lucide-icon [img]="Columns" class="w-3.5 h-3.5" />
                      <span>Side-by-Side</span>
                    </button>
                  </div>
                }
              </div>

              <!-- MAIN DISPLAY AREA -->
              <div class="w-full relative min-h-[460px] flex items-center justify-center bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 p-4">
                
                <!-- EMPTY STATE: DEMO HERO -->
                @if (!inputImage() && !generatedImage()) {
                  <div class="text-center max-w-sm p-6 space-y-4">
                    <div class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                      <lucide-icon [img]="Sparkles" class="w-10 h-10" />
                    </div>
                    <h4 class="text-base font-black text-slate-800 dark:text-slate-200">
                      {{ i18n.currentLang() === 'kh' ? 'មិនទាន់បានបញ្ចូលរូបភាពទេ' : 'No photo uploaded yet' }}
                    </h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      {{ i18n.currentLang() === 'kh' ? 'សូមបញ្ចូលរូបថតរបស់អ្នក ឬចុចប៊ូតុង "សាកល្បងរូបគំរូ" ដើម្បីសាកល្បងមុខងារកាត់តប្តូរអាវធំភ្លាមៗ!' : 'Upload your photo or click "Try Demo Sample" to preview the AI suit transformation instantly!' }}
                    </p>
                    <button
                      type="button"
                      (click)="loadDemoSample()"
                      class="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all hover:scale-105">
                      {{ i18n.t('editImageTrySample') }}
                    </button>
                  </div>
                }

                <!-- ONLY INPUT IMAGE (BEFORE GENERATING) -->
                @if (inputImage() && !generatedImage() && !isGenerating()) {
                  <div class="text-center space-y-4">
                    <div class="relative inline-block rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                      <img [src]="inputImage()" alt="Input preview" class="max-h-[420px] w-auto object-contain rounded-xl" />
                      <span class="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {{ i18n.t('editImageBefore') }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      {{ i18n.currentLang() === 'kh' ? 'ជ្រើសរើសម៉ូដអាវធំ និងចុច "ដំណើរការបង្កើតរូបថតអាជីព"' : 'Choose your suit style and click "Generate Professional Photo"' }}
                    </p>
                  </div>
                }

                <!-- GENERATING / LOADING STATE -->
                @if (isGenerating()) {
                  <div class="text-center space-y-6 p-8">
                    <div class="relative w-32 h-40 mx-auto rounded-2xl overflow-hidden shadow-xl border-2 border-indigo-500">
                      <img [src]="inputImage()" alt="Scanning" class="w-full h-full object-cover filter blur-[1px]" />
                      <div class="absolute inset-0 bg-indigo-600/20"></div>
                      <div class="absolute left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400 shadow-lg shadow-indigo-500/80 scan-line"></div>
                    </div>

                    <div class="space-y-2">
                      <h4 class="text-sm font-black text-slate-800 dark:text-slate-200 animate-pulse">
                        {{ loadingStep() }}
                      </h4>
                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        {{ i18n.currentLang() === 'kh' ? 'បច្ចេកវិទ្យាកំពុងកាត់តអាវធំ និងរៀបចំផ្ទៃស្ទូឌីយោ...' : 'Fitting selected suit template & synthesizing studio lighting...' }}
                      </p>
                    </div>
                  </div>
                }

                <!-- RESULT GENERATED: SLIDER VIEW -->
                @if (generatedImage() && !isGenerating() && viewMode() === 'slider') {
                  <div class="relative max-h-[520px] select-none inline-block rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                    <!-- Background (Generated Suit Image - AFTER) -->
                    <img
                      [src]="generatedImage()"
                      alt="Generated suit"
                      class="max-h-[500px] w-auto object-contain block" />
                    
                    <!-- Foreground (Input Image - BEFORE) clipped by slider -->
                    <div
                      class="absolute inset-0 overflow-hidden"
                      [style.clip-path]="'polygon(0 0, ' + sliderPos() + '% 0, ' + sliderPos() + '% 100%, 0 100%)'">
                      <img
                        [src]="croppedBeforeImage() || inputImage() || sampleBeforeUrl"
                        alt="Input original"
                        class="max-h-[500px] w-full h-full object-cover" />
                    </div>

                    <!-- Slider Handle Line -->
                    <div
                      class="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
                      [style.left]="sliderPos() + '%'">
                      <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-xl border border-slate-200">
                        <lucide-icon [img]="Columns" class="w-4 h-4" />
                      </div>
                    </div>

                    <!-- Range Input Overlay -->
                    <input
                      type="range"
                      min="0"
                      max="100"
                      [value]="sliderPos()"
                      (input)="onSliderChange($event)"
                      class="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20" />

                    <!-- Badges -->
                    <span class="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                      {{ i18n.t('editImageBefore') }}
                    </span>
                    <span class="absolute top-3 right-3 bg-indigo-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-sm z-10 flex items-center gap-1">
                      <lucide-icon [img]="Sparkles" class="w-3 h-3" />
                      <span>{{ i18n.t('editImageAfter') }}</span>
                    </span>
                  </div>
                }

                <!-- RESULT GENERATED: SIDE-BY-SIDE VIEW -->
                @if (generatedImage() && !isGenerating() && viewMode() === 'side') {
                  <div class="grid grid-cols-2 gap-4 w-full max-w-2xl">
                    <!-- Before -->
                    <div class="space-y-2 text-center">
                      <div class="rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <img [src]="croppedBeforeImage() || inputImage() || sampleBeforeUrl" alt="Original" class="w-full h-auto object-cover max-h-[380px]" />
                      </div>
                      <span class="text-xs font-bold text-slate-500">
                        {{ i18n.t('editImageBefore') }}
                      </span>
                    </div>
                    <!-- After -->
                    <div class="space-y-2 text-center">
                      <div class="rounded-2xl overflow-hidden shadow-xl border-2 border-indigo-500 bg-white dark:bg-slate-800 relative">
                        <img [src]="generatedImage()" alt="Generated" class="w-full h-auto object-cover max-h-[380px]" />
                        <span class="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <lucide-icon [img]="Sparkles" class="w-3 h-3" />
                          <span>AI Suit</span>
                        </span>
                      </div>
                      <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {{ i18n.t('editImageAfter') }}
                      </span>
                    </div>
                  </div>
                }

              </div>

              <!-- BOTTOM ACTIONS (WHEN GENERATED) -->
              @if (generatedImage()) {
                <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    (click)="resetAll()"
                    class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
                    <lucide-icon [img]="RefreshCw" class="w-4 h-4" />
                    <span>{{ i18n.t('editImageBtnReset') }}</span>
                  </button>

                  <div class="flex items-center gap-3">
                    <!-- Apply directly to My CV -->
                    <button
                      type="button"
                      (click)="useInMyCv()"
                      class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all hover:scale-105 flex items-center gap-2">
                      <lucide-icon [img]="FileCheck" class="w-4 h-4" />
                      <span>{{ i18n.t('editImageBtnUseInCv') }}</span>
                    </button>

                    <!-- Download High-Res File -->
                    <button
                      type="button"
                      (click)="downloadImage()"
                      class="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 flex items-center gap-2">
                      <lucide-icon [img]="Download" class="w-4 h-4" />
                      <span>{{ i18n.t('editImageBtnDownload') }}</span>
                    </button>
                  </div>
                </div>
              }

            </div>
          </div>

        </div>

      </div>
    </main>
  `,
  styles: [`
    .glass-panel {
      background: rgba(255, 255, 255, 0.78);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(226, 232, 240, 0.85);
      box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.05);
    }
    :host-context(html.dark) .glass-panel {
      background: rgba(15, 23, 42, 0.78);
      border-color: rgba(51, 65, 85, 0.8);
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.4);
    }

    .glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      pointer-events: none;
      z-index: 0;
    }
    .glow-one {
      top: 5%;
      left: 15%;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
    }
    .glow-two {
      top: 30%;
      right: 10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%);
    }
    .glow-three {
      bottom: 10%;
      left: 35%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%);
    }

    .scan-line {
      animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    @keyframes scan {
      0% { top: 0%; opacity: 0.8; }
      50% { top: 96%; opacity: 1; }
      100% { top: 0%; opacity: 0.8; }
    }
  `]
})
export class EditImageComponent implements OnInit {
  public i18n = inject(TranslationService);
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private router = inject(Router);

  readonly Sparkles = Sparkles;
  readonly UploadCloud = UploadCloud;
  readonly Download = Download;
  readonly FileCheck = FileCheck;
  readonly RefreshCw = RefreshCw;
  readonly Sliders = Sliders;
  readonly CheckCircle2 = CheckCircle2;
  readonly AlertCircle = AlertCircle;
  readonly Eye = Eye;
  readonly Columns = Columns;
  readonly Layers = Layers;
  readonly ShieldCheck = ShieldCheck;
  readonly ArrowRight = ArrowRight;
  readonly Info = Info;
  readonly Palette = Palette;
  readonly UserCheck = UserCheck;
  readonly Move = Move;
  readonly ZoomIn = ZoomIn;
  readonly RotateCcw = RotateCcw;

  sampleBeforeUrl = 'assets/edit-image/sample-before.png';
  sampleAfterUrl = 'assets/edit-image/sample-after.png';

  inputImage = signal<string | null>(null);
  croppedBeforeImage = signal<string | null>(null);
  inputFilename = signal<string | null>(null);
  generatedImage = signal<string | null>(null);
  isGenerating = signal<boolean>(false);
  isSampleMode = signal<boolean>(false);
  viewMode = signal<'slider' | 'side'>('slider');
  sliderPos = signal<number>(50);
  statusMessage = signal<string | null>(null);
  loadingStep = signal<string>('Initializing Studio AI Engine...');

  selectedCategory = signal<'man' | 'woman'>('man');
  selectedOutfit = signal<string>('man-suit-5');
  selectedBackground = signal<string>('white');
  customColor = signal<string>('#0066FF');

  // Fine-tuning alignment parameters for custom uploaded photos
  detectedFaceBox = signal<number[] | null>(null); // [ymin, xmin, ymax, xmax] normalized 0-1000
  detectedSvgPath = signal<string | null>(null);
  userZoom = signal<number>(1.0);
  userOffsetY = signal<number>(0);
  userOffsetX = signal<number>(0);
  private recompositeDebounceTimer: any = null;

  outfits: OutfitOption[] = [
    {
      id: 'man-suit-1',
      category: 'man',
      name: 'Black Suit & Dotted Tie',
      nameKh: 'អាវធំពណ៌ខ្មៅ & ក្រវ៉ាត់កអុច',
      badge: 'Classic Black',
      thumbnail: 'assets/edit-image/suits/man/man-suit-1.png',
      transparent: 'assets/edit-image/suits/man/man-suit-1-transparent.png',
      prompt: 'sharp black formal business suit jacket, tailored white dress shirt, black necktie with fine subtle white micro-dots',
    },
    {
      id: 'man-suit-2',
      category: 'man',
      name: 'Black Suit & Silver Silk Tie',
      nameKh: 'អាវធំពណ៌ខ្មៅ & ក្រវ៉ាត់កពណ៌ប្រាក់',
      badge: 'Executive',
      thumbnail: 'assets/edit-image/suits/man/man-suit-2.png',
      transparent: 'assets/edit-image/suits/man/man-suit-2-transparent.png',
      prompt: 'tailored black business suit jacket, crisp white collared dress shirt, lustrous smooth silver grey silk necktie',
    },
    {
      id: 'man-suit-3',
      category: 'man',
      name: 'Black Suit & Yellow-Blue Striped Tie',
      nameKh: 'អាវធំពណ៌ខ្មៅ & ក្រវ៉ាត់កឆ្នូតលឿងខៀវ',
      badge: 'Gold Stripe',
      thumbnail: 'assets/edit-image/suits/man/man-suit-3.png',
      transparent: 'assets/edit-image/suits/man/man-suit-3-transparent.png',
      prompt: 'formal black business suit jacket, white dress shirt, diagonal golden yellow and navy blue striped silk necktie',
    },
    {
      id: 'man-suit-4',
      category: 'man',
      name: 'Navy Suit & Blue-White Striped Tie',
      nameKh: 'អាវធំពណ៌ខៀវ & ក្រវ៉ាត់កឆ្នូតសខៀវ',
      badge: 'Modern Stripe',
      thumbnail: 'assets/edit-image/suits/man/man-suit-4.png',
      transparent: 'assets/edit-image/suits/man/man-suit-4-transparent.png',
      prompt: 'tailored deep navy blue suit jacket, crisp white collared shirt, diagonal blue and white textured striped necktie',
    },
    {
      id: 'man-suit-5',
      category: 'man',
      name: 'Dark Navy Suit & Royal Blue Tie',
      nameKh: 'អាវធំពណ៌ខៀវចាស់ & ក្រវ៉ាត់កខៀវ',
      badge: 'Most Popular ⭐',
      thumbnail: 'assets/edit-image/suits/man/man-suit-5.png',
      transparent: 'assets/edit-image/suits/man/man-suit-5-transparent.png',
      prompt: 'tailored dark navy blue formal business suit jacket, crisp white collared dress shirt, royal blue silk necktie',
    },
    // === WOMAN SUITS ===
    {
      id: 'woman-suit-1',
      category: 'woman',
      name: 'Black Blazer & Red Plaid Tie',
      nameKh: 'អាវប្លេហ្សើខ្មៅ & ក្រវ៉ាត់កក្រហម',
      badge: 'School Style',
      thumbnail: 'assets/edit-image/suits/woman/woman-suit-1.png',
      transparent: 'assets/edit-image/suits/woman/woman-suit-1-transparent.png',
      prompt: 'formal black blazer jacket, white collared shirt, red plaid necktie, professional portrait',
    },
    {
      id: 'woman-suit-2',
      category: 'woman',
      name: 'Black Blazer & Black Tie',
      nameKh: 'អាវប្លេហ្សើខ្មៅ & ក្រវ៉ាត់កខ្មៅ',
      badge: 'Classic Executive',
      thumbnail: 'assets/edit-image/suits/woman/woman-suit-2.png',
      transparent: 'assets/edit-image/suits/woman/woman-suit-2-transparent.png',
      prompt: 'sharp black formal blazer jacket, white dress shirt, black striped necktie, professional CV portrait',
    },
    {
      id: 'woman-suit-3',
      category: 'woman',
      name: 'White Blouse (Open Collar)',
      nameKh: 'អាវសខ្យាក់ (ចំហ collar)',
      badge: 'Elegant White',
      thumbnail: 'assets/edit-image/suits/woman/woman-suit-3.png',
      transparent: 'assets/edit-image/suits/woman/woman-suit-3-transparent.png',
      prompt: 'elegant white collared blouse shirt, open collar, professional women portrait',
    },
    {
      id: 'woman-suit-4',
      category: 'woman',
      name: 'Black Blazer & Grey Plaid Tie',
      nameKh: 'អាវប្លេហ្សើខ្មៅ & ក្រវ៉ាត់កប្រផេះ',
      badge: 'Modern Style',
      thumbnail: 'assets/edit-image/suits/woman/woman-suit-4.png',
      transparent: 'assets/edit-image/suits/woman/woman-suit-4-transparent.png',
      prompt: 'formal black blazer jacket, white shirt, grey plaid checkered necktie, professional studio portrait',
    },
    {
      id: 'woman-suit-5',
      category: 'woman',
      name: 'Black V-neck Blazer',
      nameKh: 'អាវប្លេហ្សើ V-neck ខ្មៅ',
      badge: 'Most Popular ⭐',
      thumbnail: 'assets/edit-image/suits/woman/woman-suit-5.png',
      transparent: 'assets/edit-image/suits/woman/woman-suit-5-transparent.png',
      prompt: 'sleek black V-neck blazer jacket, no tie, open collar, modern women professional portrait',
    },
  ];

  backgrounds: BackgroundOption[] = [
    { id: 'white', name: 'Pure White', nameKh: 'ពណ៌ស (CV/Passport)', hex: '#FFFFFF', prompt: 'white' },
    { id: 'blue', name: 'Studio Blue', nameKh: 'ពណ៌ខៀវ (អត្តសញ្ញាណប័ណ្ណ)', hex: '#0066FF', prompt: 'blue' },
    { id: 'red', name: 'Official Red', nameKh: 'ពណ៌ក្រហមផ្លូវការ', hex: '#DC2626', prompt: 'red' },
    { id: 'grey', name: 'Corporate Grey', nameKh: 'ពណ៌ប្រផេះ', hex: '#E2E8F0', prompt: 'grey' },
  ];

  ngOnInit() {
    this.fetchPresets();
  }

  fetchPresets() {
    this.http.get<any>('/api/v1/image-editor/presets').subscribe({
      next: (res) => {
        if (res.outfits && res.outfits.length) {
          this.outfits = res.outfits;
        }
        if (res.backgrounds && res.backgrounds.length) {
          this.backgrounds = res.backgrounds;
        }
      },
      error: () => {}
    });
  }

  getBackgroundHex(): string {
    if (this.selectedBackground() === 'custom') {
      return this.customColor();
    }
    const found = this.backgrounds.find(b => b.id === this.selectedBackground());
    return found ? found.hex : '#FFFFFF';
  }

  selectOutfit(id: string) {
    this.selectedOutfit.set(id);
    if (this.generatedImage()) {
      this.recompositeCurrent(true);
    }
  }

  selectBackground(id: string) {
    this.selectedBackground.set(id);
    if (this.generatedImage()) {
      this.recompositeCurrent(true);
    }
  }

  onCustomColorInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.customColor.set(val);
    this.selectedBackground.set('custom');
    if (this.generatedImage()) {
      this.recompositeCurrent(true);
    }
  }

  onZoomChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.userZoom.set(val);
    if (this.generatedImage()) {
      this.recompositeCurrent(false);
    }
  }

  onOffsetYChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.userOffsetY.set(val);
    if (this.generatedImage()) {
      this.recompositeCurrent(false);
    }
  }

  onOffsetXChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.userOffsetX.set(val);
    if (this.generatedImage()) {
      this.recompositeCurrent(false);
    }
  }

  resetAlignment() {
    this.userZoom.set(1.0);
    this.userOffsetY.set(0);
    this.userOffsetX.set(0);
    if (this.generatedImage()) {
      this.recompositeCurrent(true);
    }
  }

  onManCategoryClick() {
    this.selectedCategory.set('man');
    // Auto-select first man suit if currently on a woman suit
    const currentOutfit = this.selectedOutfit();
    if (!currentOutfit || currentOutfit.startsWith('woman')) {
      this.selectedOutfit.set('man-suit-5');
      if (this.generatedImage()) {
        this.recompositeCurrent(true);
      }
    }
  }

  onWomanCategoryClick() {
    this.selectedCategory.set('woman');
    // Auto-select first woman suit if none selected from woman category
    const currentOutfit = this.selectedOutfit();
    if (!currentOutfit || !currentOutfit.startsWith('woman')) {
      this.selectedOutfit.set('woman-suit-5');
      if (this.generatedImage()) {
        this.recompositeCurrent(true);
      }
    }
  }

  loadDemoSample() {
    this.inputImage.set(this.sampleBeforeUrl);
    this.croppedBeforeImage.set(this.sampleBeforeUrl);
    this.inputFilename.set('sample-student-portrait.png');
    this.isSampleMode.set(true);
    this.selectedOutfit.set('man-suit-5');
    this.selectedBackground.set('white');
    this.generatedImage.set(null);
    this.resetAlignment();
    this.statusMessage.set(
      this.i18n.currentLang() === 'kh'
        ? 'បានផ្ទុករូបភាពគំរូ។ សូមជ្រើសរើសម៉ូដអាវធំ និងពណ៌ផ្ទៃខាងក្រោយ ហើយចុច "ដំណើរការបង្កើតរូបថតអាជីព"!'
        : 'Demo sample loaded. Choose any of the 5 suits and backdrop colors, then click "Generate Professional Photo"!'
    );
    this.toast.info(this.i18n.currentLang() === 'kh' ? 'បានផ្ទុករូបភាពគំរូ' : 'Loaded demo sample photo');
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.processFile(file);
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  onFileDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) this.processFile(file);
  }

  processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.toast.error(this.i18n.currentLang() === 'kh' ? 'សូមជ្រើសរើសឯកសារជារូបភាព' : 'Please upload a valid image file');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      this.toast.error(this.i18n.currentLang() === 'kh' ? 'ទំហំរូបភាពមិនត្រូវលើសពី 15MB ឡើយ' : 'Image size must be under 15MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.inputImage.set(reader.result as string);
      this.croppedBeforeImage.set(null);
      this.inputFilename.set(file.name);
      this.isSampleMode.set(false);
      this.generatedImage.set(null);
      this.detectedFaceBox.set(null);
      this.detectedSvgPath.set(null);
      this.resetAlignment();
      this.toast.success(this.i18n.currentLang() === 'kh' ? 'បានបញ្ចូលរូបភាពដោយជោគជ័យ' : 'Photo uploaded successfully');
    };
    reader.readAsDataURL(file);
  }

  resetInput() {
    this.inputImage.set(null);
    this.inputFilename.set(null);
    this.generatedImage.set(null);
    this.croppedBeforeImage.set(null);
    this.isSampleMode.set(false);
    this.detectedFaceBox.set(null);
    this.detectedSvgPath.set(null);
    this.resetAlignment();
  }

  resetAll() {
    this.resetInput();
    this.statusMessage.set(null);
  }

  onSliderChange(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.sliderPos.set(val);
  }

  recompositeCurrent(immediate = false) {
    if (!this.inputImage()) return;

    const bgHex = this.getBackgroundHex();
    const outfitId = this.selectedOutfit();

    if (this.isSampleMode()) {
      this.renderComposite(outfitId, bgHex).then(img => this.generatedImage.set(img));
      return;
    }

    // Instant local canvas update for immediate preview
    this.renderComposite(outfitId, bgHex).then(img => {
      this.generatedImage.set(img);
    }).catch(() => {});

    // Backend sharp re-rendering for razor sharp HD quality
    if (this.recompositeDebounceTimer) clearTimeout(this.recompositeDebounceTimer);
    const delay = immediate ? 0 : 250;
    this.recompositeDebounceTimer = setTimeout(() => {
      const payload = {
        imageBase64: this.inputImage(),
        outfit: outfitId,
        background: bgHex,
        isSample: false,
        zoom: this.userZoom(),
        offsetX: this.userOffsetX(),
        offsetY: this.userOffsetY(),
      };
      this.http.post<any>('/api/v1/image-editor/generate', payload).subscribe({
        next: (res) => {
          if (res.imageUrl) this.generatedImage.set(res.imageUrl);
          if (res.beforeUrl) this.croppedBeforeImage.set(res.beforeUrl);
        },
        error: () => {}
      });
    }, delay);
  }

  generatePhoto() {
    if (!this.inputImage()) return;

    this.isGenerating.set(true);
    this.generatedImage.set(null);
    this.sliderPos.set(50);

    const steps = [
      this.i18n.currentLang() === 'kh' ? '១. កំពុងកំណត់ទីតាំងផ្ទៃមុខ និងស្មា...' : '1. Detecting facial landmarks & silhouette...',
      this.i18n.currentLang() === 'kh' ? '២. កំពុងកាត់តប្តូរម៉ូដអាវធំដែលបានជ្រើស...' : '2. Tailoring selected formal suit & necktie...',
      this.i18n.currentLang() === 'kh' ? '៣. កំពុងប្តូរពណ៌ផ្ទៃខាងក្រោយស្ទូឌីយោ...' : '3. Applying chosen studio backdrop color...',
      this.i18n.currentLang() === 'kh' ? '៤. កំពុងបង្កើនកម្រិតច្បាស់ HD...' : '4. Finalizing razor-sharp HD details...',
    ];

    let currentStep = 0;
    this.loadingStep.set(steps[0]);
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        this.loadingStep.set(steps[currentStep]);
      }
    }, 500);

    const bgHex = this.getBackgroundHex();
    const outfitId = this.selectedOutfit();

    const payload = {
      imageBase64: this.inputImage(),
      outfit: outfitId,
      background: bgHex,
      isSample: this.isSampleMode(),
      zoom: this.userZoom(),
      offsetX: this.userOffsetX(),
      offsetY: this.userOffsetY(),
    };

    this.http.post<any>('/api/v1/image-editor/generate', payload).subscribe({
      next: async (res) => {
        clearInterval(interval);
        this.isGenerating.set(false);

        if (res.faceBox) {
          this.detectedFaceBox.set(res.faceBox);
        }
        if (res.svgPath) {
          this.detectedSvgPath.set(res.svgPath);
        }
        if (res.beforeUrl) {
          this.croppedBeforeImage.set(res.beforeUrl);
        }

        if (res.imageUrl) {
          this.generatedImage.set(res.imageUrl);
        } else {
          try {
            const finalImage = await this.renderComposite(outfitId, bgHex);
            this.generatedImage.set(finalImage);
          } catch (e) {
            console.error('Composite failed:', e);
            this.generatedImage.set(this.inputImage());
          }
        }

        this.statusMessage.set(
          this.i18n.currentLang() === 'kh'
            ? 'បានកាត់តប្តូរអាវធំ និងពណ៌ផ្ទៃខាងក្រោយដោយជោគជ័យ! អ្នកអាចប្រើរបារ "កែតម្រូវទីតាំង" ដើម្បីរំកិល ឬពង្រីកក្បាលតាមចិត្ត។'
            : 'Successfully fitted your photo into the suit! Use the sliders on the left to zoom or reposition your head.'
        );
        this.toast.success(this.i18n.t('editImageSuccessMsg'));
      },
      error: async () => {
        clearInterval(interval);
        this.isGenerating.set(false);
        try {
          const finalImage = await this.renderComposite(outfitId, bgHex);
          this.generatedImage.set(finalImage);
        } catch {
          this.generatedImage.set(this.inputImage());
        }
        this.toast.success(this.i18n.t('editImageSuccessMsg'));
      }
    });
  }

  /**
   * High-definition Studio Canvas Compositor
   * Combines: [Layer 1: Background Color] + [Layer 2: User Head/Neck] + [Layer 3: Transparent Suit Overlay]
   */
  async renderComposite(outfitId: string, bgHex: string): Promise<string> {
    const outfit = this.outfits.find(o => o.id === outfitId) || this.outfits[4];
    const canvas = document.createElement('canvas');
    canvas.width = 707;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return this.inputImage() || this.sampleAfterUrl;

    // 1. Draw solid background color
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Select image to draw:
    const imageToUse = this.isSampleMode() ? this.sampleAfterUrl : (this.inputImage() || this.sampleBeforeUrl);
    const userImg = await this.loadImage(imageToUse);

    if (this.isSampleMode()) {
      const scale = canvas.width / userImg.width;
      const drawW = userImg.width * scale;
      const drawH = userImg.height * scale;
      const drawX = (canvas.width - drawW) / 2;
      const drawY = 0;
      ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
    } else {
      const box = this.detectedFaceBox() || [100, 250, 550, 750];
      const ymin = (box[0] / 1000) * userImg.height;
      const xmin = (box[1] / 1000) * userImg.width;
      const ymax = (box[2] / 1000) * userImg.height;
      const xmax = (box[3] / 1000) * userImg.width;

      const faceW = xmax - xmin;
      const faceH = ymax - ymin;
      const faceCenterX = xmin + faceW / 2;
      const faceCenterY = ymin + faceH * 0.45;

      const targetFaceH = 320 * this.userZoom();
      const scale = targetFaceH / (faceH || 300);

      const drawW = userImg.width * scale;
      const drawH = userImg.height * scale;
      const drawX = (353.5 - (faceCenterX * scale)) + this.userOffsetX();
      const drawY = (240 - (faceCenterY * scale)) + this.userOffsetY();

      ctx.save();
      const clipCenterX = 353.5 + this.userOffsetX();
      const clipCenterY = 240 + this.userOffsetY();
      const clipRadiusX = Math.max(100, (faceW * scale * 0.75));
      const clipRadiusY = Math.max(120, (faceH * scale * 0.85));

      ctx.beginPath();
      ctx.ellipse(clipCenterX, clipCenterY, clipRadiusX, clipRadiusY, 0, 0, Math.PI * 2);
      ctx.rect(clipCenterX - clipRadiusX, clipCenterY, clipRadiusX * 2, 400);
      ctx.clip();

      ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
      ctx.restore();
    }

    // 3. Draw the chosen suit transparent PNG on top (Layer 3)
    const suitSrc = outfit.transparent;
    try {
      const suitImg = await this.loadImage(suitSrc);
      ctx.drawImage(suitImg, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      console.warn('Suit overlay draw failed:', e);
    }

    return canvas.toDataURL('image/png');
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      if (src.startsWith('http://') || src.startsWith('https://')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  }

  downloadImage() {
    const imgUrl = this.generatedImage() || this.sampleAfterUrl;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `cq-${this.selectedOutfit()}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.toast.success(this.i18n.currentLang() === 'kh' ? 'បានទាញយករូបថតដោយជោគជ័យ' : 'Photo downloaded successfully');
  }

  useInMyCv() {
    const imgUrl = this.generatedImage() || this.sampleAfterUrl;
    try {
      localStorage.setItem('cq_user_photo', imgUrl);
    } catch {}
    this.toast.success(
      this.i18n.currentLang() === 'kh'
        ? 'បានរក្សាទុករូបថតសម្រាប់ CV របស់អ្នក! កំពុងបើកកម្មវិធីបង្កើត CV...'
        : 'Photo saved for your CV! Redirecting to CV Maker...'
    );
    setTimeout(() => {
      this.router.navigate(['/templates']);
    }, 1200);
  }
}
