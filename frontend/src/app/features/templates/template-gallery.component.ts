import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  LucideAngularModule, 
  Search, 
  Filter, 
  X, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowUpRight, 
  Send, 
  Camera, 
  Layers, 
  Zap 
} from 'lucide-angular';
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
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { HttpClient } from '@angular/common/http';
import { DEMO_CV } from '../../shared/demo-cv-data';

interface CvTemplate {
  id: string;
  name: string;
  category: string;
  accent: string;
  colors: string[];
  hasPhoto: boolean;
  description?: string;
  price_cents?: number;
  layout: 'professional' | 'modern-split' | 'clean-sidebar' | 'elegant-frame' | 'classic-dark' | 'formal-classic' | 'cover-letter' | 'framed-cover-letter' | 'sidebar-cover-letter' | 'minimalist-cover-letter' | 'navy-badge' | 'warm-taupe-timeline' | 'slate-rounded-panels' | 'navy-sidebar-profile' | 'graphite-banner-timeline' | 'minimalist-framed';
}

@Component({
  selector: 'app-template-gallery',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProfessionalCvComponent, ModernSplitCvComponent, CleanSidebarCvComponent, ElegantFrameCvComponent, ClassicDarkCvComponent, FormalClassicCvComponent, CoverLetterCvComponent, FramedCoverLetterCvComponent, SidebarCoverLetterCvComponent, MinimalistCoverLetterCvComponent, NavyBadgeCvComponent, WarmTaupeTimelineCvComponent, SlateRoundedPanelsCvComponent, NavySidebarProfileCvComponent, GraphiteBannerTimelineCvComponent, MinimalistFramedCvComponent, A4FitDirective],
  template: `
    <section class="gallery-page-container">
      <!-- Ambient Glow Orbs -->
      <div class="glow glow-one" aria-hidden="true"></div>
      <div class="glow glow-two" aria-hidden="true"></div>
      <div class="glow glow-three" aria-hidden="true"></div>

      <!-- Header -->
      <header class="gallery-header">
        <div class="badge-pill mb-3">
          <span class="pulse-dot"></span>
          <span class="badge-text">{{ i18n.t('galleryBadge') }}</span>
          <span class="badge-sparkle">✦</span>
        </div>

        <h1 class="gallery-title">
          {{ i18n.t('galleryTitlePrefix') }} <span class="gradient-text">{{ i18n.t('galleryTitleHighlight') }}</span>
        </h1>
        <p class="gallery-subtitle">
          {{ i18n.t('gallerySubtitle') }}
        </p>
      </header>

      <!-- Search & Filters Toolbar -->
      <div class="filter-toolbar">
        <div class="search-and-photo-row">
          <!-- Search Box -->
          <label class="search-box">
            <lucide-icon [img]="Search" class="search-icon" />
            <input
              type="text"
              class="search-input"
              [placeholder]="i18n.t('gallerySearchPlaceholder')"
              [value]="search()"
              (input)="search.set($any($event.target).value)"
            />
            @if (search()) {
              <button type="button" class="clear-search-btn" (click)="search.set('')" title="Clear search">
                <lucide-icon [img]="X" class="w-3.5 h-3.5" />
              </button>
            }
          </label>

          <!-- Photo Filter Toggle -->
          <div class="photo-filters">
            <button 
              type="button" 
              class="chip-filter" 
              (click)="photoFilter.set('all')" 
              [class.active]="photoFilter() === 'all'"
            >
              {{ i18n.t('galleryFilterAll') }}
            </button>
            <button 
              type="button" 
              class="chip-filter" 
              (click)="photoFilter.set('photo')" 
              [class.active]="photoFilter() === 'photo'"
            >
              {{ i18n.t('galleryFilterPhoto') }}
            </button>
            <button 
              type="button" 
              class="chip-filter" 
              (click)="photoFilter.set('none')" 
              [class.active]="photoFilter() === 'none'"
            >
              {{ i18n.t('galleryFilterNone') }}
            </button>
          </div>
        </div>

        <!-- Categories Row (Horizontal scrollable on mobile) -->
        <div class="categories-bar">
          <div class="categories-scroll">
            @for (item of categories; track item) {
              <button 
                type="button" 
                class="category-pill" 
                (click)="category.set(item)" 
                [class.active]="category() === item"
              >
                <span>{{ getCategoryLabel(item) }}</span>
                <span class="cat-count">{{ categoryCount(item) }}</span>
              </button>
            }
          </div>
          <div class="results-meta">
            <span class="results-text">
              {{ i18n.t('galleryShowing') }} <b>{{ filtered().length }}</b> {{ i18n.t('galleryOf') }} <b>{{ templates().length }}</b>
            </span>
          </div>
        </div>
      </div>

      <!-- Templates Grid -->
      <div class="gallery-grid">
        @for (t of filtered(); track t.id) {
          <article class="template-card-item">
            <!-- Fixed A4 Frame: aspect ratio 210 / 297 locks the CV frame -->
            <div 
              appA4Fit 
              class="cv-card" 
              (click)="select(t)" 
              role="button" 
              tabindex="0" 
              (keydown.enter)="select(t)" 
              [attr.aria-label]="'Open full preview of ' + t.name"
            >
              <!-- Floating Top Badges -->
              <div class="card-badge-left">
                <span>{{ getCategoryLabel(t.category) }}</span>
              </div>
              <div class="card-badge-right" [class.price-cl]="t.category === 'Cover Letter' || t.layout.includes('cover-letter')">
                <span>{{ getPrice(t) }}</span>
              </div>

              <!-- Full Scaled A4 Content -->
              <div class="cv-thumb pointer-events-none" aria-hidden="true">
                @if (t.layout === 'modern-split') {
                  <app-modern-split-cv
                    [accent]="accentFor(t)"
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
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'clean-sidebar') {
                  <app-clean-sidebar-cv
                    [accent]="accentFor(t)"
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
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'elegant-frame') {
                  <app-elegant-frame-cv
                    [accent]="accentFor(t)"
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
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'classic-dark') {
                  <app-classic-dark-cv
                    [accent]="accentFor(t)"
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
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'formal-classic') {
                  <app-formal-classic-cv
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
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'graphite-banner-timeline') {
                  <app-graphite-banner-timeline-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl"
                    [education]="demo.education" [experience]="demo.experience" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies"
                    [fontSize]="9" [fontWeight]="400" [lineHeight]="1.5"
                  />
                } @else if (t.layout === 'navy-sidebar-profile') {
                  <app-navy-sidebar-profile-cv
                    [accent]="accentFor(t)"
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
                } @else if (t.layout === 'slate-rounded-panels') {
                  <app-slate-rounded-panels-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl"
                    [education]="demo.education" [experience]="demo.experience" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies"
                    [fontSize]="9" [fontWeight]="400" [lineHeight]="1.45"
                  />
                } @else if (t.layout === 'warm-taupe-timeline') {
                  <app-warm-taupe-timeline-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name" [jobTitle]="demo.jobTitle" [email]="demo.email" [phone]="demo.phone" [location]="demo.location" [linkedin]="demo.linkedin" [summary]="demo.summary" [photoUrl]="demo.photoUrl"
                    [education]="demo.education" [experience]="demo.experience" [skills]="demo.skills" [languages]="demo.languages" [certifications]="demo.certifications" [projects]="demo.projects" [references]="demo.references" [hobbies]="demo.hobbies"
                    [fontSize]="9" [fontWeight]="400" [lineHeight]="1.35"
                  />
                } @else if (t.layout === 'framed-cover-letter') {
                  <app-framed-cover-letter-cv
                    [accent]="accentFor(t)"
                    [name]="'Felicity Kendwell'"
                    [jobTitle]="'Internship'"
                    [location]="'20 Park Street, London Bridge, London, SE1 9EL'"
                    [phone]="'020 7950 5505'"
                    [email]="'FelicityK@yahoo.com'"
                    [recipientName]="'Gabriel Vince'"
                    [recipientDept]="'London Bridge Support Services'"
                    [greeting]="'Dear Mr. Vince,'"
                    [closing]="'Regards'"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.5"
                  />
                } @else if (t.layout === 'sidebar-cover-letter') {
                  <app-sidebar-cover-letter-cv
                    [accent]="accentFor(t)"
                    [name]="'Daniel Murray'"
                    [jobTitle]="'ADMINISTRATIVE ASSISTANT'"
                    [location]="'2400 President Ave, Los Angeles, CA 90710, United States'"
                    [phone]="'(469) 732-9961'"
                    [email]="'murray.dani3@gmail.com'"
                    [recipientName]="'Ms Woods'"
                    [recipientDept]="'Spike'"
                    [greeting]="'Dear Ms. Woods,'"
                    [closing]="'Sincerely,'"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.5"
                  />
                } @else if (t.layout === 'minimalist-cover-letter') {
                  <app-minimalist-cover-letter-cv
                    [accent]="accentFor(t)"
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
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.5"
                  />
                } @else if (t.layout === 'minimalist-framed') {
                  <app-minimalist-framed-cv
                    [accent]="accentFor(t)"
                    [name]="'LORNA ALVARADO'"
                    [jobTitle]="'Sales Representative'"
                    [phone]="'+123-456-7890'"
                    [email]="'hello@reallygreatsite.com'"
                    [location]="'123 Anywhere St., Any City'"
                    [summary]="'I am a Sales Representative is a professional who initializes and manages relationships with customers. They serve as their point of contact and lead from initial outreach through the making of the final purchase by them or someone in their household.'"
                    [fontSize]="9.5"
                    [fontWeight]="400"
                    [lineHeight]="1.45"
                  />
                } @else if (t.layout === 'navy-badge') {
                  <app-navy-badge-cv
                    [accent]="accentFor(t)"
                    [name]="'SAING SOKAIYA'"
                    [jobTitle]="'ACCOUNTING ASSISTANT'"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.4"
                  />
                } @else if (t.layout === 'cover-letter') {
                  <app-cover-letter-cv
                    [accent]="accentFor(t)"
                    [name]="demo.name"
                    [phone]="demo.phone"
                    [email]="demo.email"
                    [location]="demo.location"
                    [fontSize]="9"
                    [fontWeight]="400"
                    [lineHeight]="1.5"
                  />
                } @else {
                  <app-professional-cv
                    [accent]="accentFor(t)"
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
                    [fontWeight]="400"
                    [lineHeight]="1.35"
                    [sectionLines]="true"
                  />
                }
              </div>

              <!-- Hover Glass Overlay with Button -->
              <div class="cv-card-overlay">
                <button type="button" class="use-template-cta" (click)="select(t)">
                  {{ i18n.t('useTemplate') }}
                  <lucide-icon [img]="ArrowUpRight" class="w-4 h-4 ml-1 inline" />
                </button>
              </div>
            </div>

            <!-- Card Footer: Name, Colors & Quick Action -->
            <div class="card-footer-wrap">
              <div class="title-and-action">
                <h2 class="template-name" [title]="t.name">{{ t.name }}</h2>
                <button type="button" class="mini-use-btn" (click)="select(t)" [title]="i18n.currentLang() === 'kh' ? 'មើលគំរូ & ជ្រើសរើស' : 'Preview & Customize'">
                  <span>{{ i18n.t('galleryUse') }}</span>
                  <lucide-icon [img]="ArrowRight" class="w-3.5 h-3.5 ml-0.5 inline" />
                </button>
              </div>

              <div class="swatches-and-meta">
                <div class="swatches-row">
                  @for (c of t.colors; track c) {
                    <button
                      type="button"
                      class="swatch"
                      [style.background]="c"
                      [class.selected]="accentFor(t) === c"
                      [title]="'Select color ' + c"
                      (click)="setColor(t, c, $event)"
                    ></button>
                  }
                  <span class="swatches-count">{{ t.colors.length }} {{ i18n.t('galleryThemes') }}</span>
                </div>

                @if (t.hasPhoto) {
                  <span class="format-badge" [title]="i18n.currentLang() === 'kh' ? 'មានរូបថត' : 'Includes photo portrait'">{{ i18n.t('galleryBadgePhoto') }}</span>
                } @else {
                  <span class="format-badge text-only" [title]="i18n.currentLang() === 'kh' ? 'ទម្រង់អត្ថបទសុទ្ធ' : 'Text-only format'">{{ i18n.t('galleryBadgeTextOnly') }}</span>
                }
              </div>
            </div>
          </article>
        }
      </div>

      <!-- Empty State -->
      @if (filtered().length === 0) {
        <div class="empty-state-card">
          <div class="empty-icon-wrap">
            <lucide-icon [img]="Search" class="w-8 h-8 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 class="empty-title">{{ i18n.t('galleryEmptyTitle') }}</h3>
          <p class="empty-desc">{{ i18n.t('galleryEmptyDesc') }}</p>
          <button type="button" class="btn-reset-filters" (click)="resetFilters()">
            {{ i18n.t('galleryResetFilters') }}
          </button>
        </div>
      }

      <!-- Bottom Telegram & Retouch Support Banner -->
      <div class="bottom-support-strip">
        <div class="support-content-left">
          <div class="support-icon-wrap">
            <lucide-icon [img]="Camera" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h4 class="support-heading">{{ i18n.t('galleryRetouchHeading') }}</h4>
            <p class="support-sub">{{ i18n.t('galleryRetouchSub') }}</p>
          </div>
        </div>
        <a 
          href="https://t.me/cvresumecqprofessional" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn-support-telegram"
        >
          <lucide-icon [img]="Send" class="w-4 h-4 mr-2" />
          {{ i18n.t('galleryTelegramContact') }}
        </a>
      </div>
    </section>
  `,
  styles: [
    `
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

      /* Container */
      .gallery-page-container {
        max-width: 1320px;
        margin: 0 auto;
        padding: 110px 24px 80px;
        position: relative;
        min-height: 100vh;
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

      .gallery-header, .filter-toolbar, .templates-grid, .bottom-support-strip {
        position: relative;
        z-index: 1;
      }

      /* Header */
      .gallery-header {
        text-align: center;
        max-width: 720px;
        margin: 0 auto 36px;
      }
      .gallery-title {
        font-size: clamp(2.2rem, 4vw, 3.4rem);
        font-weight: 800;
        letter-spacing: -0.04em;
        color: #0f172a;
        line-height: 1.15;
        margin: 14px 0 16px;
      }
      .gradient-text {
        background: linear-gradient(135deg, #0284c7 0%, #6366f1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .gallery-subtitle {
        font-size: 1.02rem;
        color: #64748b;
        line-height: 1.65;
        margin: 0;
      }

      /* Badge Pill */
      .badge-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid #e0e7ff;
        color: #4f46e5;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
        backdrop-filter: blur(8px);
      }
      .pulse-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
      }
      .badge-sparkle {
        font-size: 0.85rem;
        color: #818cf8;
      }

      /* Filter Toolbar */
      .filter-toolbar {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(14px);
        border: 1px solid #e2e8f0;
        border-radius: 24px;
        padding: 18px 22px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
        margin-bottom: 36px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .search-and-photo-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        flex-wrap: wrap;
      }

      .search-box {
        flex: 1 1 320px;
        position: relative;
        display: flex;
        align-items: center;
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 9999px;
        padding: 9px 16px 9px 40px;
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
        left: 14px;
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
        font-size: 0.88rem;
        color: #0f172a;
      }
      .search-input::placeholder {
        color: #94a3b8;
      }
      .clear-search-btn {
        background: transparent;
        border: none;
        padding: 4px;
        color: #94a3b8;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .clear-search-btn:hover {
        color: #0f172a;
        background: #e2e8f0;
      }

      .photo-filters {
        display: flex;
        align-items: center;
        gap: 6px;
        background: #f1f5f9;
        padding: 4px;
        border-radius: 9999px;
      }
      .chip-filter {
        padding: 6px 14px;
        border-radius: 9999px;
        border: none;
        background: transparent;
        font-size: 0.78rem;
        font-weight: 700;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      .chip-filter:hover {
        color: #0f172a;
      }
      .chip-filter.active {
        background: #ffffff;
        color: #0284c7;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .categories-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        border-top: 1px solid #f1f5f9;
        padding-top: 14px;
      }
      .categories-scroll {
        display: flex;
        align-items: center;
        gap: 8px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        padding-bottom: 2px;
      }
      .categories-scroll::-webkit-scrollbar {
        display: none;
      }
      .category-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 9999px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        font-size: 0.8rem;
        font-weight: 700;
        color: #475569;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
      }
      .category-pill:hover {
        background: #f1f5f9;
        color: #0f172a;
      }
      .category-pill.active {
        background: #0284c7;
        border-color: #0284c7;
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.28);
      }
      .cat-count {
        font-size: 0.68rem;
        padding: 2px 6px;
        border-radius: 9999px;
        background: rgba(0, 0, 0, 0.08);
        font-weight: 800;
      }
      .category-pill.active .cat-count {
        background: rgba(255, 255, 255, 0.25);
        color: #ffffff;
      }
      .results-meta {
        flex-shrink: 0;
      }
      .results-text {
        font-size: 0.78rem;
        color: #64748b;
        white-space: nowrap;
      }
      .results-text b {
        color: #0f172a;
      }

      /* Gallery Grid */
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 28px;
      }

      .template-card-item {
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
      .template-card-item:hover {
        transform: translateY(-6px);
        box-shadow: 0 20px 45px -8px rgba(15, 23, 42, 0.16);
        border-color: #cbd5e1;
      }

      /* CV Card Frame */
      .cv-card {
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

      .card-badge-left {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 10;
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

      .card-badge-right {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 10;
        background: #0284c7;
        color: #ffffff;
        border-radius: 8px;
        padding: 3px 8px;
        font-size: 0.74rem;
        font-weight: 900;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);
      }
      .card-badge-right.price-cl {
        background: #059669;
        box-shadow: 0 2px 8px rgba(5, 150, 105, 0.35);
      }

      .cv-thumb {
        position: absolute;
        top: 0;
        left: 0;
        width: 210mm;
        height: 297mm;
        overflow: hidden;
        transform-origin: top left;
        transform: scale(var(--a4-scale, 0.33));
      }

      .cv-card-overlay {
        position: absolute;
        inset: 0;
        z-index: 15;
        background: rgba(15, 23, 42, 0.42);
        backdrop-filter: blur(3px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.22s ease;
        pointer-events: none;
      }
      .template-card-item:hover .cv-card-overlay,
      .cv-card:focus-visible .cv-card-overlay {
        opacity: 1;
        pointer-events: auto;
      }

      .use-template-cta {
        background: #ffffff;
        color: #0f172a;
        border: none;
        font-weight: 700;
        font-size: 0.88rem;
        padding: 10px 20px;
        border-radius: 9999px;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transform: translateY(8px);
        transition: transform 0.22s ease, background 0.2s ease, color 0.2s ease;
      }
      .template-card-item:hover .use-template-cta {
        transform: translateY(0);
      }
      .use-template-cta:hover {
        background: #0284c7;
        color: #ffffff;
      }

      /* Card Footer */
      .card-footer-wrap {
        padding: 12px 6px 2px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .title-and-action {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .template-name {
        font-size: 0.95rem;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 72%;
      }
      .mini-use-btn {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 0.76rem;
        font-weight: 700;
        color: #0284c7;
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 9999px;
        padding: 4px 10px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .mini-use-btn:hover {
        background: #0284c7;
        color: #ffffff;
        border-color: #0284c7;
        transform: translateX(2px);
      }

      .swatches-and-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .swatches-row {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .swatch {
        width: 17px;
        height: 17px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 0 1px #cbd5e1;
        cursor: pointer;
        padding: 0;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .swatch:hover {
        transform: scale(1.22);
      }
      .swatch.selected {
        transform: scale(1.22);
        box-shadow: 0 0 0 2px #0284c7, 0 2px 6px rgba(2, 132, 199, 0.4);
      }
      .swatches-count {
        font-size: 0.68rem;
        color: #94a3b8;
        margin-left: 2px;
      }
      .format-badge {
        font-size: 0.72rem;
        font-weight: 600;
        color: #475569;
        background: #f1f5f9;
        padding: 3px 8px;
        border-radius: 6px;
        white-space: nowrap;
      }
      .format-badge.text-only {
        background: #f8fafc;
        color: #64748b;
        border: 1px dashed #cbd5e1;
      }

      /* Empty State */
      .empty-state-card {
        text-align: center;
        padding: 60px 24px;
        background: #ffffff;
        border: 1px dashed #cbd5e1;
        border-radius: 24px;
        margin: 20px 0 40px;
      }
      .empty-icon-wrap {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #f1f5f9;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
      }
      .empty-title {
        font-size: 1.25rem;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 8px;
      }
      .empty-desc {
        font-size: 0.92rem;
        color: #64748b;
        max-width: 440px;
        margin: 0 auto 20px;
        line-height: 1.5;
      }
      .btn-reset-filters {
        background: #0284c7;
        color: #ffffff;
        border: none;
        font-weight: 700;
        font-size: 0.85rem;
        padding: 10px 22px;
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
      }
      .btn-reset-filters:hover {
        background: #0369a1;
        transform: translateY(-2px);
      }

      /* Bottom Support Banner */
      .bottom-support-strip {
        margin-top: 50px;
        background: linear-gradient(135deg, rgba(245, 243, 255, 0.85) 0%, rgba(238, 242, 255, 0.85) 100%);
        border: 1px solid #e0e7ff;
        border-radius: 22px;
        padding: 22px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.06);
      }
      .support-content-left {
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .support-icon-wrap {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: #ede9fe;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .support-heading {
        font-size: 1.05rem;
        font-weight: 800;
        color: #1e1b4b;
        margin: 0 0 4px;
      }
      .support-sub {
        font-size: 0.86rem;
        color: #6366f1;
        margin: 0;
        line-height: 1.45;
      }
      .btn-support-telegram {
        display: inline-flex;
        align-items: center;
        background: #6366f1;
        color: #ffffff;
        font-size: 0.88rem;
        font-weight: 700;
        padding: 12px 22px;
        border-radius: 14px;
        text-decoration: none;
        white-space: nowrap;
        transition: all 0.2s ease;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
        flex-shrink: 0;
      }
      .btn-support-telegram:hover {
        background: #4f46e5;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
      }

      /* Dark mode styles */
      :host-context(.dark) .glow-one { background: #4d3f9866; }
      :host-context(.dark) .glow-two { background: #1d5b8d55; }
      :host-context(.dark) .glow-three { background: #5d388f44; }
      :host-context(.dark) .gallery-title { color: #f8fafc; }
      :host-context(.dark) .gallery-subtitle { color: #94a3b8; }
      :host-context(.dark) .badge-pill {
        background: rgba(30, 41, 59, 0.8);
        border-color: #334155;
        color: #818cf8;
      }
      :host-context(.dark) .filter-toolbar {
        background: rgba(30, 41, 59, 0.85);
        border-color: #334155;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }
      :host-context(.dark) .search-box {
        background: #0f172a;
        border-color: #334155;
      }
      :host-context(.dark) .search-input { color: #f8fafc; }
      :host-context(.dark) .search-input::placeholder { color: #64748b; }
      :host-context(.dark) .photo-filters { background: #0f172a; }
      :host-context(.dark) .chip-filter { color: #94a3b8; }
      :host-context(.dark) .chip-filter.active {
        background: #1e293b;
        color: #38bdf8;
      }
      :host-context(.dark) .categories-bar { border-top-color: #334155; }
      :host-context(.dark) .category-pill {
        background: #0f172a;
        border-color: #334155;
        color: #94a3b8;
      }
      :host-context(.dark) .category-pill:hover { background: #1e293b; color: #f8fafc; }
      :host-context(.dark) .category-pill.active {
        background: #0284c7;
        border-color: #0284c7;
        color: #ffffff;
      }
      :host-context(.dark) .template-card-item {
        background: #1e293b;
        border-color: #334155;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      }
      :host-context(.dark) .template-card-item:hover {
        border-color: #475569;
      }
      :host-context(.dark) .cv-card {
        border-color: #334155;
        background: #0f172a;
      }
      :host-context(.dark) .template-name { color: #f8fafc; }
      :host-context(.dark) .mini-use-btn {
        background: rgba(2, 132, 199, 0.15);
        border-color: rgba(2, 132, 199, 0.4);
        color: #38bdf8;
      }
      :host-context(.dark) .format-badge {
        background: #334155;
        color: #cbd5e1;
      }
      :host-context(.dark) .format-badge.text-only {
        background: #0f172a;
        border-color: #475569;
        color: #94a3b8;
      }
      :host-context(.dark) .empty-state-card {
        background: #1e293b;
        border-color: #334155;
      }
      :host-context(.dark) .empty-icon-wrap { background: #0f172a; }
      :host-context(.dark) .empty-title { color: #f8fafc; }
      :host-context(.dark) .empty-desc { color: #94a3b8; }
      :host-context(.dark) .bottom-support-strip {
        background: linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(49, 46, 129, 0.5) 100%);
        border-color: #4338ca;
      }
      :host-context(.dark) .support-icon-wrap { background: #312e81; }
      :host-context(.dark) .support-heading { color: #e0e7ff; }
      :host-context(.dark) .support-sub { color: #a5b4fc; }

      /* Responsive Media Queries */
      @media (max-width: 1080px) {
        .gallery-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
        }
      }

      @media (max-width: 768px) {
        .gallery-page-container {
          padding: 96px 16px 60px;
        }
        .search-and-photo-row {
          flex-direction: column;
          align-items: stretch;
        }
        .search-box {
          flex: 1 1 auto;
          width: 100%;
        }
        .photo-filters {
          justify-content: center;
        }
        .bottom-support-strip {
          flex-direction: column;
          align-items: flex-start;
          padding: 20px;
        }
        .btn-support-telegram {
          width: 100%;
          justify-content: center;
        }
      }

      @media (max-width: 640px) {
        .gallery-page-container {
          padding: 88px 14px 48px;
        }
        .gallery-header {
          margin-bottom: 24px;
        }
        .gallery-title {
          font-size: 1.95rem;
        }
        .gallery-subtitle {
          font-size: 0.92rem;
        }
        .filter-toolbar {
          padding: 14px 14px;
          margin-bottom: 24px;
          border-radius: 18px;
        }
        .gallery-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        .template-card-item {
          max-width: 440px;
          width: 100%;
          margin: 0 auto;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .template-card-item, .category-pill, .cv-card, .btn-support-telegram {
          transition: none !important;
        }
      }
    `,
  ],
})
export class TemplateGalleryComponent implements OnInit {
  readonly Search = Search;
  readonly Filter = Filter;
  readonly X = X;
  readonly Sparkles = Sparkles;
  readonly Check = Check;
  readonly ArrowRight = ArrowRight;
  readonly ArrowUpRight = ArrowUpRight;
  readonly Send = Send;
  readonly Camera = Camera;
  readonly Layers = Layers;
  readonly Zap = Zap;
  readonly demo = DEMO_CV;
  readonly i18n = inject(TranslationService);

  categories = ['All Templates', 'Modern', 'Minimal', 'Professional', 'Creative', 'Classic', 'Cover Letter'];
  search = signal('');
  category = signal('All Templates');
  photoFilter = signal<'all' | 'photo' | 'none'>('all');
  templates = signal<CvTemplate[]>([]);
  /** Per-template selected accent */
  colorPick = signal<Record<string, string>>({});

  getCategoryLabel(cat: string): string {
    if (this.i18n.currentLang() !== 'kh') return cat;
    switch (cat) {
      case 'All Templates': return this.i18n.t('galleryCatAll');
      case 'Modern': return this.i18n.t('galleryCatModern');
      case 'Minimal': return this.i18n.t('galleryCatMinimal');
      case 'Professional': return this.i18n.t('galleryCatProfessional');
      case 'Creative': return this.i18n.t('galleryCatCreative');
      case 'Classic': return this.i18n.t('galleryCatClassic');
      case 'Cover Letter': return this.i18n.t('galleryCatCoverLetter');
      default: return cat;
    }
  }

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    return this.templates().filter(
      (t) =>
        (!q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || this.getCategoryLabel(t.category).toLowerCase().includes(q)) &&
        (this.category() === 'All Templates' || t.category === this.category() || (this.category() === 'Cover Letter' && t.layout.includes('cover-letter'))) &&
        (this.photoFilter() === 'all' || (this.photoFilter() === 'photo') === t.hasPhoto),
    );
  });

  constructor(
    private router: Router,
    private auth: AuthService,
    private http: HttpClient,
  ) {}

  categoryCount(cat: string): number {
    if (cat === 'All Templates') return this.templates().length;
    if (cat === 'Cover Letter') {
      return this.templates().filter((t) => t.category === 'Cover Letter' || t.layout.includes('cover-letter')).length;
    }
    return this.templates().filter((t) => t.category === cat).length;
  }

  getPrice(t: CvTemplate): string {
    if (t.price_cents !== undefined && t.price_cents !== null) {
      const dollars = t.price_cents / 100;
      return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
    }
    return t.category === 'Cover Letter' || t.layout.includes('cover-letter') ? '$1' : '$4';
  }

  resetFilters(): void {
    this.search.set('');
    this.category.set('All Templates');
    this.photoFilter.set('all');
  }

  ngOnInit() {
    this.http.get<{ templates: any[] }>('/api/v1/templates').subscribe(({ templates }) => {
      this.templates.set(
        (templates || []).map((t) => {
          let colors: string[] = ['#667B97', '#163E63', '#0284C7', '#334155'];
          try {
            const parsed = typeof t.default_colors === 'string' ? JSON.parse(t.default_colors) : t.default_colors;
            if (Array.isArray(parsed) && parsed.length) colors = parsed;
          } catch {
            /* keep defaults */
          }
          const name = (t.name as string).toLowerCase();
          const layout = name.includes('graphite')
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
          return {
            id: String(t.id),
            name: t.name,
            category: t.category || 'Professional',
            accent: colors[0],
            colors,
            hasPhoto: !layout.includes('cover-letter'),
            description: t.description,
            price_cents: t.price_cents !== undefined && t.price_cents !== null ? Number(t.price_cents) : (t.category === 'Cover Letter' || layout.includes('cover-letter') ? 100 : 400),
            layout: layout as CvTemplate['layout'],
          };
        }),
      );
    });
  }

  accentFor(t: CvTemplate): string {
    return this.colorPick()[t.id] || t.accent;
  }

  setColor(t: CvTemplate, color: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.colorPick.update((m) => ({ ...m, [t.id]: color }));
  }

  select(t: CvTemplate) {
    const color = encodeURIComponent(this.accentFor(t));
    const url = `/templates/preview/${t.id}?color=${color}`;
    if (this.auth.requireLoginOrRedirect(url)) {
      this.router.navigate(['/templates/preview', t.id], {
        queryParams: { color: this.accentFor(t) },
      });
    }
  }
}
