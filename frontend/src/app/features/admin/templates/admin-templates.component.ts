import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  Trash2,
  Search,
  Eye,
  Plus,
  RefreshCw,
  Star,
  DollarSign,
  LayoutTemplate,
  CheckCircle2,
  TrendingUp,
  X,
  Sparkles,
  ArrowUpDown,
  ChevronRight,
  Layers,
  ShoppingBag,
  SlidersHorizontal,
  Palette,
  ExternalLink,
  Check
} from 'lucide-angular';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { ProfessionalCvComponent } from '../../../shared/components/professional-cv/professional-cv.component';
import { ModernSplitCvComponent } from '../../../shared/components/modern-split-cv/modern-split-cv.component';
import { CleanSidebarCvComponent } from '../../../shared/components/clean-sidebar-cv/clean-sidebar-cv.component';
import { ElegantFrameCvComponent } from '../../../shared/components/elegant-frame-cv/elegant-frame-cv.component';
import { ClassicDarkCvComponent } from '../../../shared/components/classic-dark-cv/classic-dark-cv.component';
import { FormalClassicCvComponent } from '../../../shared/components/formal-classic-cv/formal-classic-cv.component';
import { CoverLetterCvComponent } from '../../../shared/components/cover-letter-cv/cover-letter-cv.component';
import { FramedCoverLetterCvComponent } from '../../../shared/components/framed-cover-letter-cv/framed-cover-letter-cv.component';
import { SidebarCoverLetterCvComponent } from '../../../shared/components/sidebar-cover-letter-cv/sidebar-cover-letter-cv.component';
import { MinimalistCoverLetterCvComponent } from '../../../shared/components/minimalist-cover-letter-cv/minimalist-cover-letter-cv.component';
import { WarmTaupeTimelineCvComponent } from '../../../shared/components/warm-taupe-timeline-cv/warm-taupe-timeline-cv.component';
import { SlateRoundedPanelsCvComponent } from '../../../shared/components/slate-rounded-panels-cv/slate-rounded-panels-cv.component';
import { NavySidebarProfileCvComponent } from '../../../shared/components/navy-sidebar-profile-cv/navy-sidebar-profile-cv.component';
import { NavyBadgeCvComponent } from '../../../shared/components/navy-badge-cv/navy-badge-cv.component';
import { GraphiteBannerTimelineCvComponent } from '../../../shared/components/graphite-banner-timeline-cv/graphite-banner-timeline-cv.component';
import { A4FitDirective } from '../../../shared/directives/a4-fit.directive';
import { DEMO_CV } from '../../../shared/demo-cv-data';

interface AdminTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail_url: string;
  is_active: boolean;
  sold_count: number;
  avg_rating: number;
  default_colors: string;
  layout: string;
  price_cents?: number;
}

@Component({
  selector: 'app-admin-templates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    A4FitDirective
  ],
  template: `
    <div class="space-y-8 pb-12">
      <!-- Top Executive Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-2xl border border-indigo-500/20">
        <!-- Ambient Glow Orbs -->
        <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>
        <div class="absolute right-1/3 -bottom-20 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md">
              <lucide-icon [img]="LayoutTemplate" class="w-3.5 h-3.5" />
              <span>Template Design Inventory & Pricing</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Template Studio
              <span class="text-sm font-semibold px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {{ templates().length }} layouts
              </span>
            </h1>
            <p class="text-slate-300 text-sm max-w-xl">
              Manage professional resume designs, configure dynamic USD/KHR pricing, preview vector layouts, and publish templates to the public gallery.
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-3">
            <button type="button" (click)="load()" [disabled]="isLoading()"
                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer">
              <lucide-icon [img]="RefreshCw" class="w-4 h-4" [class.animate-spin]="isLoading()" />
              <span>Refresh</span>
            </button>

            <button type="button" (click)="openAddModal()"
                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer">
              <lucide-icon [img]="Plus" class="w-4 h-4" />
              <span>Add New Template</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 1. Total Templates -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
              <lucide-icon [img]="LayoutTemplate" class="w-5 h-5" />
            </div>
            <span class="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 px-2 py-0.5 rounded-full">
              Catalog
            </span>
          </div>
          <p class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {{ templates().length }}
          </p>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Published CV Layouts</p>
        </div>

        <!-- 2. Active in Store -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
              <lucide-icon [img]="CheckCircle2" class="w-5 h-5" />
            </div>
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {{ activePercentage() }}% Live
            </span>
          </div>
          <p class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {{ activeCount() }}
          </p>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Available for Customers</p>
        </div>

        <!-- 3. Total Sales & Downloads -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
              <lucide-icon [img]="ShoppingBag" class="w-5 h-5" />
            </div>
            <span class="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
              Sales Volume
            </span>
          </div>
          <p class="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
            {{ totalSalesVolume() }}
          </p>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Total Template Licenses Sold</p>
        </div>

        <!-- 4. Default License Price Card -->
        <div class="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/80 p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300">
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110 duration-200">
              <lucide-icon [img]="DollarSign" class="w-5 h-5" />
            </div>
            <span class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full">
              Standard
            </span>
          </div>
          <p class="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
            $3.00
          </p>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">≈ ៛12,300 KHR per license</p>
        </div>
      </section>

      <!-- Control Toolbar: Category Tabs, Search & Sort -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <!-- Category Filter Tabs -->
        <div class="inline-flex p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-inner overflow-x-auto">
          <button type="button" (click)="categoryTab.set('')"
                  [ngClass]="categoryTab() === '' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'"
                  class="px-4 py-2 rounded-xl text-xs transition-all duration-200 flex items-center gap-2 active:scale-95 cursor-pointer shrink-0">
            <span>All Designs</span>
            <span class="px-2 py-0.5 rounded-full text-[10px]"
                  [ngClass]="categoryTab() === '' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/30 dark:text-indigo-300 font-bold' : 'bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300'">
              {{ templates().length }}
            </span>
          </button>

          <button type="button" (click)="categoryTab.set('general')"
                  [ngClass]="categoryTab() === 'general' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'"
                  class="px-4 py-2 rounded-xl text-xs transition-all duration-200 active:scale-95 cursor-pointer shrink-0">
            <span>General</span>
          </button>

          <button type="button" (click)="categoryTab.set('modern')"
                  [ngClass]="categoryTab() === 'modern' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'"
                  class="px-4 py-2 rounded-xl text-xs transition-all duration-200 active:scale-95 cursor-pointer shrink-0">
            <span>Modern</span>
          </button>

          <button type="button" (click)="categoryTab.set('creative')"
                  [ngClass]="categoryTab() === 'creative' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'"
                  class="px-4 py-2 rounded-xl text-xs transition-all duration-200 active:scale-95 cursor-pointer shrink-0">
            <span>Creative</span>
          </button>

          <button type="button" (click)="categoryTab.set('executive')"
                  [ngClass]="categoryTab() === 'executive' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'"
                  class="px-4 py-2 rounded-xl text-xs transition-all duration-200 active:scale-95 cursor-pointer shrink-0">
            <span>Executive</span>
          </button>
        </div>

        <!-- Search & Sort Controls -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Search Box -->
          <div class="relative flex-1 sm:w-64 search-wrapper-animated">
            <lucide-icon [img]="Search" class="search-icon-animated absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors pointer-events-none" />
            <input [(ngModel)]="search" placeholder="Search templates..."
                   class="w-full pl-10 pr-9 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs md:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 shadow-sm" />
            @if (search) {
              <button type="button" (click)="search = ''"
                      class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <lucide-icon [img]="X" class="w-3.5 h-3.5" />
              </button>
            }
          </div>

          <!-- Sort Selector -->
          <div class="relative">
            <select [(ngModel)]="sortBy"
                    class="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 shadow-sm cursor-pointer">
              <option value="popular">Most Popular (Sales)</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>
            <lucide-icon [img]="ArrowUpDown" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <!-- Modern Grid of Template Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        @if (filteredTemplates().length === 0) {
          <div class="col-span-full p-16 text-center rounded-3xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
            <div class="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center mb-3">
              <lucide-icon [img]="LayoutTemplate" class="w-7 h-7" />
            </div>
            <p class="font-bold text-slate-900 dark:text-white text-lg">No Templates Found</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              No templates match your selected category or search term.
            </p>
            @if (search || categoryTab()) {
              <button type="button" (click)="search = ''; categoryTab.set('')"
                      class="mt-4 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-all">
                Clear Filters
              </button>
            }
          </div>
        } @else {
          @for (t of filteredTemplates(); track t.id) {
            <div class="group relative rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col">
              <!-- Live Preview Container -->
              <div class="relative overflow-hidden cursor-pointer" (click)="preview.set(t)">
                <!-- Floating Category Badge (Top Left) -->
                <div class="absolute top-3 left-3 z-20">
                  <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/70 text-white backdrop-blur-md shadow-md border border-white/20">
                    {{ t.category }}
                  </span>
                </div>

                <!-- Floating Status Badge (Top Right) -->
                <div class="absolute top-3 right-3 z-20">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-md"
                        [ngClass]="t.is_active ? 'bg-emerald-500/90 text-white border border-emerald-400/40' : 'bg-slate-700/90 text-slate-300 border border-slate-600'">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="t.is_active ? 'bg-white animate-pulse' : 'bg-slate-400'"></span>
                    {{ t.is_active ? 'Active' : 'Disabled' }}
                  </span>
                </div>

                <!-- Live A4 CV Preview -->
                <div appA4Fit class="cv-card">
                  <div class="cv-thumb pointer-events-none">
                    @if (t.layout === 'modern-split') {
                      <app-modern-split-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
                    } @else if (t.layout === 'clean-sidebar') {
                      <app-clean-sidebar-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
                    } @else if (t.layout === 'elegant-frame') {
                      <app-elegant-frame-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
                    } @else if (t.layout === 'classic-dark') {
                      <app-classic-dark-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [hobbies]="demo.hobbies" [certifications]="demo.certifications" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
                    } @else if (t.layout === 'formal-classic') {
                      <app-formal-classic-cv [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [projects]="demo.projects" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
                    } @else if (t.layout === 'graphite-banner-timeline') {
                      <app-graphite-banner-timeline-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5" />
                    } @else if (t.layout === 'navy-sidebar-profile') {
                      <app-navy-sidebar-profile-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5" />
                    } @else if (t.layout === 'navy-badge') {
                      <app-navy-badge-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.4" />
                    } @else if (t.layout === 'slate-rounded-panels') {
                      <app-slate-rounded-panels-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.45" />
                    } @else if (t.layout === 'warm-taupe-timeline') {
                      <app-warm-taupe-timeline-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" />
                    } @else if (t.layout === 'framed-cover-letter') {
                      <app-framed-cover-letter-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [phone]="demo.phone" [email]="demo.email" [location]="demo.location" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5" />
                    } @else if (t.layout === 'sidebar-cover-letter') {
                      <app-sidebar-cover-letter-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [phone]="demo.phone" [email]="demo.email" [location]="demo.location" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5" />
                    } @else if (t.layout === 'minimalist-cover-letter') {
                      <app-minimalist-cover-letter-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [phone]="demo.phone" [email]="demo.email" [location]="demo.location" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5" />
                    } @else if (t.layout === 'cover-letter') {
                      <app-cover-letter-cv [accent]="getAccent(t)" [name]="demo.name" [phone]="demo.phone" [email]="demo.email" [location]="demo.location" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5" />
                    } @else {
                      <app-professional-cv [accent]="getAccent(t)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35" [sectionLines]="true" />
                    }
                  </div>
                </div>

                <!-- Hover Overlay with Smooth Quick Preview Button -->
                <div class="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <lucide-icon [img]="Eye" class="w-4 h-4 text-indigo-600" />
                    <span>Quick Preview</span>
                  </span>
                </div>
              </div>

              <!-- Card Body & Details -->
              <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h3 class="font-extrabold text-slate-900 dark:text-white text-base tracking-tight truncate">
                        {{ t.name }}
                      </h3>
                      <div class="flex items-center gap-2 mt-1">
                        <span class="inline-flex items-center text-xs font-bold text-amber-500">
                          <lucide-icon [img]="Star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                          {{ t.avg_rating || '5.0' }}
                        </span>
                        <span class="text-slate-300 dark:text-slate-600">·</span>
                        <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {{ t.sold_count }} sold
                        </span>
                      </div>
                    </div>

                    <!-- Delete Button -->
                    <button type="button" (click)="confirmRemove(t)" title="Delete template"
                            class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/20 active:scale-95 transition-all duration-200 cursor-pointer">
                      <lucide-icon [img]="Trash2" class="w-4 h-4" />
                    </button>
                  </div>

                  <!-- Dual Currency Price Box with Edit Shortcut -->
                  <div class="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Customer Price</span>
                      <div class="flex items-baseline gap-1.5 mt-0.5">
                        <span class="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                          \${{ ((t.price_cents ?? 299) / 100).toFixed(2) }}
                        </span>
                        <span class="text-xs font-medium text-slate-400">
                          (៛{{ Math.round(((t.price_cents ?? 299) / 100) * 4100).toLocaleString() }})
                        </span>
                      </div>
                    </div>

                    <button type="button" (click)="openEditPrice(t)"
                            class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold active:scale-95 transition-all duration-200 cursor-pointer">
                      Edit Price
                    </button>
                  </div>
                </div>

                <!-- Primary Action Buttons -->
                <div class="pt-2 flex items-center gap-2.5">
                  <button type="button" (click)="useTemplate(t)"
                          class="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all duration-200 cursor-pointer text-center">
                    Use Template
                  </button>

                  <button type="button" (click)="toggleActive(t)"
                          [title]="t.is_active ? 'Click to disable' : 'Click to enable'"
                          class="px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 active:scale-95 cursor-pointer"
                          [ngClass]="t.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'">
                    {{ t.is_active ? 'Active' : 'Disabled' }}
                  </button>
                </div>
              </div>
            </div>
          }
        }
      </div>

      <!-- Modern Modal: Full CV Preview -->
      @if (preview(); as p) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 transition-all"
             (click)="preview.set(null)">
          <div class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-modal-pop"
               style="width: 760px; max-width: 96vw; max-height: 92vh; display: flex; flex-direction: column;"
               (click)="$event.stopPropagation()">
            <!-- Modal Header -->
            <div class="p-4 px-6 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <lucide-icon [img]="LayoutTemplate" class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="font-extrabold text-slate-900 dark:text-white text-base">{{ p.name }}</h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    Category: <span class="uppercase font-bold">{{ p.category }}</span> · \${{ ((p.price_cents ?? 299) / 100).toFixed(2) }}
                  </p>
                </div>
              </div>

              <button type="button" (click)="preview.set(null)"
                      class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <lucide-icon [img]="X" class="w-4 h-4" />
              </button>
            </div>

            <!-- Modal Body (Preview Canvas) -->
            <div class="p-4 overflow-y-auto flex-1 bg-slate-100/50 dark:bg-slate-950/50 flex justify-center">
              <div class="cv-preview-full pointer-events-none shadow-xl rounded-lg overflow-hidden bg-white">
                @if (p.layout === 'modern-split') {
                  <app-modern-split-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
                } @else if (p.layout === 'clean-sidebar') {
                  <app-clean-sidebar-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
                } @else if (p.layout === 'elegant-frame') {
                  <app-elegant-frame-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
                } @else if (p.layout === 'classic-dark') {
                  <app-classic-dark-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [hobbies]="demo.hobbies" [certifications]="demo.certifications" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
                } @else if (p.layout === 'formal-classic') {
                  <app-formal-classic-cv [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [references]="demo.references" [projects]="demo.projects" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
                } @else if (p.layout === 'graphite-banner-timeline') {
                  <app-graphite-banner-timeline-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.55" />
                } @else if (p.layout === 'navy-sidebar-profile') {
                  <app-navy-sidebar-profile-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.55" />
                } @else if (p.layout === 'navy-badge') {
                  <app-navy-badge-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [fontSize]="9.5" [fontWeight]="400" [lineHeight]="1.42" />
                } @else if (p.layout === 'slate-rounded-panels') {
                  <app-slate-rounded-panels-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.5" />
                } @else if (p.layout === 'warm-taupe-timeline') {
                  <app-warm-taupe-timeline-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" />
                } @else if (p.layout === 'framed-cover-letter') {
                  <app-framed-cover-letter-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [phone]="demo.phone" [email]="demo.email" [location]="demo.location" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.5" />
                } @else if (p.layout === 'sidebar-cover-letter') {
                  <app-sidebar-cover-letter-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [phone]="demo.phone" [email]="demo.email" [location]="demo.location" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.5" />
                } @else if (p.layout === 'minimalist-cover-letter') {
                  <app-minimalist-cover-letter-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [phone]="demo.phone" [email]="demo.email" [location]="demo.location" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.5" />
                } @else if (p.layout === 'cover-letter') {
                  <app-cover-letter-cv [accent]="getAccent(p)" [name]="demo.name" [phone]="demo.phone" [email]="demo.email" [location]="demo.location" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.5" />
                } @else {
                  <app-professional-cv [accent]="getAccent(p)" [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl" [experience]="demo.experience" [education]="demo.education" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [fontSize]="10" [fontWeight]="400" [lineHeight]="1.4" [sectionLines]="true" />
                }
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span class="text-xs text-slate-500">
                Official CQ Resume Template Standard
              </span>
              <div class="flex items-center gap-3">
                <button type="button" (click)="preview.set(null)"
                        class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200 cursor-pointer">
                  Close
                </button>
                <button type="button" (click)="useTemplate(p)"
                        class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all duration-200 cursor-pointer">
                  Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Modern Modal: Edit Template Price -->
      @if (editingPriceTemplate(); as ep) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 transition-all"
             (click)="editingPriceTemplate.set(null)">
          <div class="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl p-6 overflow-hidden animate-modal-pop"
               (click)="$event.stopPropagation()">
            <div class="text-center mb-5">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2.5 shadow-inner">
                <lucide-icon [img]="DollarSign" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Edit Template Price</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{{ ep.name }}</p>
            </div>

            <div class="space-y-4 mb-6">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Price in USD ($)
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  <input type="number" step="0.01" min="0" [(ngModel)]="newPriceUsd"
                         class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                </div>
              </div>

              <!-- Khmer Riel Conversion Box -->
              <div class="bg-indigo-50/70 dark:bg-indigo-950/30 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-xs">
                <span class="text-indigo-600 dark:text-indigo-400 font-semibold block">Khmer Riel Equivalent (Bakong KHQR):</span>
                <span class="text-lg font-black text-indigo-900 dark:text-indigo-200 font-mono block mt-0.5">
                  ៛{{ Math.round((newPriceUsd || 0) * 4100).toLocaleString() }}
                </span>
                <span class="text-[10px] text-slate-400 block mt-1">Official conversion standard: 1 USD = 4,100 KHR</span>
              </div>
            </div>

            <div class="flex gap-3">
              <button type="button" (click)="editingPriceTemplate.set(null)"
                      class="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200 cursor-pointer">
                Cancel
              </button>
              <button type="button" (click)="savePrice()"
                      class="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all duration-200 cursor-pointer">
                Save Price
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modern Modal: Add New Template -->
      @if (showAddModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 transition-all"
             (click)="showAddModal.set(false)">
          <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl p-6 overflow-hidden animate-modal-pop"
               (click)="$event.stopPropagation()">
            <div class="text-center mb-5">
              <div class="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2.5 shadow-inner">
                <lucide-icon [img]="Plus" class="w-6 h-6" />
              </div>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Add New Template</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Register a new layout design into the catalog</p>
            </div>

            <div class="space-y-4 mb-6 text-left">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Template Name
                </label>
                <input type="text" [(ngModel)]="newTemplateName" placeholder="e.g. Minimalist Executive Timeline"
                       class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select [(ngModel)]="newTemplateCategory"
                          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                    <option value="general">General</option>
                    <option value="modern">Modern</option>
                    <option value="creative">Creative</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Price (USD)
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                    <input type="number" step="0.01" min="0" [(ngModel)]="newTemplatePriceUsd"
                           class="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              <div class="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 text-xs text-purple-700 dark:text-purple-300">
                ✨ Templates automatically configure high-resolution vector styles and A4 export compatibility.
              </div>
            </div>

            <div class="flex gap-3">
              <button type="button" (click)="showAddModal.set(false)"
                      class="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200 cursor-pointer">
                Cancel
              </button>
              <button type="button" (click)="saveNewTemplate()"
                      class="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all duration-200 cursor-pointer">
                Create Template
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modern Modal: Delete Confirmation Alert -->
      @if (alertTemplate(); as t) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 transition-all"
             (click)="alertTemplate.set(null)">
          <div class="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl p-6 overflow-hidden animate-modal-pop"
               (click)="$event.stopPropagation()">
            <div class="p-2 text-center space-y-3">
              <div class="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-inner">
                <lucide-icon [img]="Trash2" class="w-7 h-7" />
              </div>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">Delete Template</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to permanently remove <strong class="text-slate-800 dark:text-white">{{ t.name }}</strong> from the catalog?
              </p>
            </div>

            <div class="mt-6 flex gap-3">
              <button type="button" (click)="alertTemplate.set(null)"
                      class="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all duration-200 cursor-pointer">
                Cancel
              </button>
              <button type="button" (click)="removeTemplate(t)"
                      class="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition-all duration-200 cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cv-card {
      position: relative; width: 100%; aspect-ratio: 210/297; overflow: hidden;
      border-bottom: 1px solid rgba(226, 232, 240, 0.8); background: #fff; container-type: size;
    }
    .cv-thumb {
      position: absolute; top: 0; left: 0; width: 210mm; height: 297mm; overflow: hidden;
      transform-origin: top left; transform: scale(var(--a4-scale, 0.264));
    }
    .cv-preview-full {
      width: 210mm; min-height: 297mm; transform-origin: top center;
      transform: scale(calc(680px / 793.7));
      margin: 0 auto;
    }
    @keyframes modalPop {
      0% {
        opacity: 0;
        transform: scale(0.95) translateY(12px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    .animate-modal-pop {
      animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class AdminTemplatesComponent implements OnInit {
  // Lucide Icons
  readonly Trash2 = Trash2;
  readonly Search = Search;
  readonly Eye = Eye;
  readonly Plus = Plus;
  readonly RefreshCw = RefreshCw;
  readonly Star = Star;
  readonly DollarSign = DollarSign;
  readonly LayoutTemplate = LayoutTemplate;
  readonly CheckCircle2 = CheckCircle2;
  readonly TrendingUp = TrendingUp;
  readonly X = X;
  readonly Sparkles = Sparkles;
  readonly ArrowUpDown = ArrowUpDown;
  readonly ChevronRight = ChevronRight;
  readonly Layers = Layers;
  readonly ShoppingBag = ShoppingBag;
  readonly SlidersHorizontal = SlidersHorizontal;
  readonly Palette = Palette;
  readonly ExternalLink = ExternalLink;
  readonly Check = Check;

  readonly demo = DEMO_CV;
  readonly Math = Math;

  templates = signal<AdminTemplate[]>([]);
  preview = signal<AdminTemplate | null>(null);
  alertTemplate = signal<AdminTemplate | null>(null);
  editingPriceTemplate = signal<AdminTemplate | null>(null);
  newPriceUsd = 3.00;
  showAddModal = signal<boolean>(false);
  newTemplateName = '';
  newTemplateCategory = 'general';
  newTemplatePriceUsd = 3.00;

  categoryTab = signal<string>('');
  sortBy = signal<'popular' | 'rating' | 'price-asc' | 'price-desc' | 'name'>('popular');
  search = '';
  isLoading = signal(false);

  constructor(private http: HttpClient, private toast: ToastService, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.http.get<{ templates: any[] }>('/api/v1/admin/templates').subscribe({
      next: ({ templates }) => {
        this.templates.set(templates.map(t => ({
          ...t,
          id: String(t.id),
          layout: this.detectLayout(t.name),
        })));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  activeCount = computed(() => {
    return this.templates().filter(t => t.is_active).length;
  });

  activePercentage = computed(() => {
    const tot = this.templates().length;
    if (!tot) return 0;
    return Math.round((this.activeCount() / tot) * 100);
  });

  totalSalesVolume = computed(() => {
    return this.templates().reduce((acc, t) => acc + Number(t.sold_count || 0), 0);
  });

  filteredTemplates = computed(() => {
    let list = [...this.templates()];

    // Category filter
    const cat = this.categoryTab().toLowerCase().trim();
    if (cat) {
      list = list.filter(t => (t.category || '').toLowerCase() === cat);
    }

    // Search filter
    const q = this.search.toLowerCase().trim();
    if (q) {
      list = list.filter(t =>
        (t.name || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q)
      );
    }

    // Sort
    const sort = this.sortBy();
    if (sort === 'popular') {
      list.sort((a, b) => (Number(b.sold_count) || 0) - (Number(a.sold_count) || 0));
    } else if (sort === 'rating') {
      list.sort((a, b) => (Number(b.avg_rating) || 0) - (Number(a.avg_rating) || 0));
    } else if (sort === 'price-asc') {
      list.sort((a, b) => (Number(a.price_cents) || 299) - (Number(b.price_cents) || 299));
    } else if (sort === 'price-desc') {
      list.sort((a, b) => (Number(b.price_cents) || 299) - (Number(a.price_cents) || 299));
    } else if (sort === 'name') {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  });

  detectLayout(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('graphite')) return 'graphite-banner-timeline';
    if (n.includes('navy badge') || n.includes('sokaiya')) return 'navy-badge';
    if (n.includes('navy sidebar')) return 'navy-sidebar-profile';
    if (n.includes('slate rounded')) return 'slate-rounded-panels';
    if (n.includes('warm taupe')) return 'warm-taupe-timeline';
    if (n.includes('modern accent') || n.includes('sidebar cover')) return 'sidebar-cover-letter';
    if (n.includes('minimalist') || n.includes('to-from')) return 'minimalist-cover-letter';
    if (n.includes('border') || n.includes('framed')) return 'framed-cover-letter';
    if (n.includes('cover')) return 'cover-letter';
    if (n.includes('formal')) return 'formal-classic';
    if (n.includes('classic')) return 'classic-dark';
    if (n.includes('elegant')) return 'elegant-frame';
    if (n.includes('clean')) return 'clean-sidebar';
    if (n.includes('modern')) return 'modern-split';
    return 'professional';
  }

  getAccent(t: AdminTemplate): string {
    try {
      const colors = typeof t.default_colors === 'string' ? JSON.parse(t.default_colors) : t.default_colors;
      return Array.isArray(colors) && colors.length ? colors[0] : '#667B97';
    } catch {
      return '#667B97';
    }
  }

  useTemplate(t: AdminTemplate) {
    this.preview.set(null);
    this.http.post<{ cvId: string; cv?: { id: string | number } }>(`/api/v1/templates/${t.id}/select`, {
      selectedColor: this.getAccent(t),
    }).subscribe({
      next: (res) => {
        const cvId = res.cvId ?? res.cv?.id;
        this.router.navigate(['/make-cv'], {
          queryParams: { templateId: t.id, cvId, color: this.getAccent(t), layout: t.layout },
        });
      },
      error: () => {
        this.router.navigate(['/make-cv'], {
          queryParams: { templateId: t.id, color: this.getAccent(t), layout: t.layout },
        });
      }
    });
  }

  toggleActive(t: AdminTemplate) {
    this.http.patch(`/api/v1/admin/templates/${t.id}/toggle-active`, {}).subscribe({
      next: () => {
        this.toast.success(t.is_active ? `Template "${t.name}" disabled` : `Template "${t.name}" enabled`);
        this.load();
      },
      error: () => this.toast.error('Failed to update template')
    });
  }

  confirmRemove(t: AdminTemplate) {
    this.alertTemplate.set(t);
  }

  removeTemplate(t: AdminTemplate) {
    this.http.delete(`/api/v1/admin/templates/${t.id}`).subscribe({
      next: () => {
        this.alertTemplate.set(null);
        this.toast.success('Template deleted successfully');
        this.load();
      },
      error: () => {
        this.alertTemplate.set(null);
        this.toast.error('Failed to delete template');
      }
    });
  }

  openEditPrice(t: AdminTemplate) {
    this.editingPriceTemplate.set(t);
    this.newPriceUsd = Number(((t.price_cents ?? 299) / 100).toFixed(2));
  }

  savePrice() {
    const t = this.editingPriceTemplate();
    if (!t) return;
    const priceCents = Math.round(this.newPriceUsd * 100);
    this.http.patch(`/api/v1/admin/templates/${t.id}/price`, { priceCents }).subscribe({
      next: () => {
        this.toast.success(`Updated price of "${t.name}" to $${this.newPriceUsd.toFixed(2)}`);
        this.editingPriceTemplate.set(null);
        this.load();
      },
      error: () => this.toast.error('Failed to update price')
    });
  }

  openAddModal() {
    this.newTemplateName = '';
    this.newTemplateCategory = 'general';
    this.newTemplatePriceUsd = 3.00;
    this.showAddModal.set(true);
  }

  saveNewTemplate() {
    if (!this.newTemplateName.trim()) {
      this.toast.error('Template name is required');
      return;
    }
    const priceCents = Math.round(this.newTemplatePriceUsd * 100);
    this.http.post('/api/v1/templates', {
      name: this.newTemplateName.trim(),
      category: this.newTemplateCategory,
      priceCents,
      defaultColors: ['#1e3a8a', '#2563eb', '#3b82f6'],
      description: `CQ Professional ${this.newTemplateCategory} resume template`,
      isActive: true,
    }).subscribe({
      next: () => {
        this.toast.success('Template created successfully!');
        this.showAddModal.set(false);
        this.load();
      },
      error: () => this.toast.error('Failed to create template')
    });
  }
}

