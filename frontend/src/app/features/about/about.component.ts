import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { 
  LucideAngularModule,
  ArrowRight,
  ArrowUpRight,
  Send,
  Check,
  Sparkles,
  Star,
  FileText,
  Camera,
  ShieldCheck,
  Zap,
  Award,
  Target,
  Heart,
  MapPin,
  Layers,
  Printer,
  Clock,
  Users
} from 'lucide-angular';
import { DEMO_CV } from '../../shared/demo-cv-data';
import { ProfessionalCvComponent } from '../../shared/components/professional-cv/professional-cv.component';
import { ModernSplitCvComponent } from '../../shared/components/modern-split-cv/modern-split-cv.component';
import { ElegantFrameCvComponent } from '../../shared/components/elegant-frame-cv/elegant-frame-cv.component';
import { A4FitDirective } from '../../shared/directives/a4-fit.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    LucideAngularModule, 
    ProfessionalCvComponent, 
    ModernSplitCvComponent, 
    ElegantFrameCvComponent,
    A4FitDirective
  ],
  template: `
    <main class="about-page">
      <!-- Ambient Glow Orbs -->
      <div class="ambient ambient-one"></div>
      <div class="ambient ambient-two"></div>
      <div class="ambient ambient-three"></div>

      <!-- ================= HERO SECTION ================= -->
      <section class="about-hero">
        <div class="hero-copy">
          <div class="badge-pill">
            <span class="pulse-dot"></span>
            <span class="badge-text">{{ i18n.t('aboutBadge') }}</span>
            <span class="badge-sparkle">✦</span>
          </div>

          <h1 class="hero-title">
            {{ i18n.t('aboutHeroTitle1') }}
            <span class="gradient-text">{{ i18n.t('aboutHeroTitle2') }}</span>
          </h1>

          <p class="hero-lead">
            {{ i18n.t('aboutHeroLead') }}
          </p>

          <div class="hero-actions">
            <a routerLink="/templates" class="btn-primary">
              {{ i18n.t('aboutBtnExplore') }}
              <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1.5 inline" />
            </a>
            <a routerLink="/make-cv" class="btn-secondary">
              {{ i18n.t('aboutBtnStartFree') }}
            </a>
          </div>

          <div class="trust-strip">
            <div class="trust-item">
              <lucide-icon [img]="Check" class="w-4 h-4 text-emerald-500 mr-1.5" />
              <span>{{ i18n.t('aboutTrustA4') }}</span>
            </div>
            <div class="trust-dot">•</div>
            <div class="trust-item">
              <lucide-icon [img]="Check" class="w-4 h-4 text-emerald-500 mr-1.5" />
              <span>{{ i18n.t('aboutTrustNoSub') }}</span>
            </div>
            <div class="trust-dot">•</div>
            <div class="trust-item">
              <lucide-icon [img]="Check" class="w-4 h-4 text-emerald-500 mr-1.5" />
              <span>{{ i18n.t('aboutTrustKhqr') }}</span>
            </div>
          </div>
        </div>

        <!-- Hero Visual Showcase -->
        <div class="hero-visual">
          <div class="advantage-card">
            <div class="adv-header">
              <div class="adv-badge">
                <lucide-icon [img]="Sparkles" class="w-3.5 h-3.5 text-amber-500 mr-1" />
                <span>{{ i18n.t('aboutAdvStandard') }}</span>
              </div>
              <span class="adv-tag">{{ i18n.t('aboutAdvHonest') }}</span>
            </div>

            <h3 class="adv-title">{{ i18n.t('aboutAdvTitle') }}</h3>

            <div class="comparison-list">
              <div class="comp-row">
                <div class="comp-icon ok">✓</div>
                <div class="comp-info">
                  <strong>{{ i18n.t('aboutAdvItem1Title') }}</strong>
                  <p>{{ i18n.t('aboutAdvItem1Desc') }}</p>
                </div>
              </div>

              <div class="comp-row">
                <div class="comp-icon ok">✓</div>
                <div class="comp-info">
                  <strong>{{ i18n.t('aboutAdvItem2Title') }}</strong>
                  <p>{{ i18n.t('aboutAdvItem2Desc') }}</p>
                </div>
              </div>

              <div class="comp-row">
                <div class="comp-icon ok">✓</div>
                <div class="comp-info">
                  <strong>{{ i18n.t('aboutAdvItem3Title') }}</strong>
                  <p>{{ i18n.t('aboutAdvItem3Desc') }}</p>
                </div>
              </div>

              <div class="comp-row">
                <div class="comp-icon ok">✓</div>
                <div class="comp-info">
                  <strong>{{ i18n.t('aboutAdvItem4Title') }}</strong>
                  <p>{{ i18n.t('aboutAdvItem4Desc') }}</p>
                </div>
              </div>
            </div>

            <div class="rating-strip">
              <div class="flex items-center gap-1.5">
                <div class="flex text-amber-400">
                  <lucide-icon [img]="Star" class="w-4 h-4 fill-amber-400" />
                  <lucide-icon [img]="Star" class="w-4 h-4 fill-amber-400" />
                  <lucide-icon [img]="Star" class="w-4 h-4 fill-amber-400" />
                  <lucide-icon [img]="Star" class="w-4 h-4 fill-amber-400" />
                  <lucide-icon [img]="Star" class="w-4 h-4 fill-amber-400" />
                </div>
                <strong class="text-sm font-extrabold text-slate-800 dark:text-white">4.9 / 5.0</strong>
              </div>
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ i18n.t('aboutAdvRatingTrust') }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= KEY STATS RIBBON ================= -->
      <section class="stats-ribbon">
        <div class="stats-inner">
          <div class="stat-box">
            <strong class="stat-number">19+</strong>
            <span class="stat-desc">{{ i18n.t('aboutStatTemplates') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-box">
            <strong class="stat-number">$1</strong>
            <span class="stat-desc">{{ i18n.t('aboutStatCost') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-box">
            <strong class="stat-number">100%</strong>
            <span class="stat-desc">{{ i18n.t('aboutStatPrintRatio') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-box">
            <strong class="stat-number">&lt; 5 min</strong>
            <span class="stat-desc">{{ i18n.t('aboutStatTime') }}</span>
          </div>
        </div>
      </section>

      <!-- ================= PILLARS & VALUES ================= -->
      <section class="pillars-section">
        <div class="section-intro">
          <div class="badge-pill mx-auto mb-3">
            <lucide-icon [img]="Target" class="w-3.5 h-3.5 text-indigo-500 mr-1" />
            <span class="badge-text">{{ i18n.t('aboutPillarsBadge') }}</span>
          </div>
          <h2 class="section-title">{{ i18n.t('aboutPillarsTitle') }}</h2>
          <p class="section-subtitle">
            {{ i18n.t('aboutPillarsSubtitle') }}
          </p>
        </div>

        <div class="pillars-grid">
          <!-- Pillar 1 -->
          <div class="pillar-card">
            <div class="pillar-icon-wrap text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400">
              <lucide-icon [img]="Layers" class="w-6 h-6" />
            </div>
            <h3 class="pillar-title">{{ i18n.t('aboutPillar1Title') }}</h3>
            <p class="pillar-desc">
              {{ i18n.t('aboutPillar1Desc') }}
            </p>
          </div>

          <!-- Pillar 2 -->
          <div class="pillar-card">
            <div class="pillar-icon-wrap text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400">
              <lucide-icon [img]="ShieldCheck" class="w-6 h-6" />
            </div>
            <h3 class="pillar-title">{{ i18n.t('aboutPillar2Title') }}</h3>
            <p class="pillar-desc">
              {{ i18n.t('aboutPillar2Desc') }}
            </p>
          </div>

          <!-- Pillar 3 -->
          <div class="pillar-card">
            <div class="pillar-icon-wrap text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400">
              <lucide-icon [img]="Zap" class="w-6 h-6" />
            </div>
            <h3 class="pillar-title">{{ i18n.t('aboutPillar3Title') }}</h3>
            <p class="pillar-desc">
              {{ i18n.t('aboutPillar3Desc') }}
            </p>
          </div>

          <!-- Pillar 4 -->
          <div class="pillar-card">
            <div class="pillar-icon-wrap text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400">
              <lucide-icon [img]="Camera" class="w-6 h-6" />
            </div>
            <h3 class="pillar-title">{{ i18n.t('aboutPillar4Title') }}</h3>
            <p class="pillar-desc">
              {{ i18n.t('aboutPillar4Desc') }}
            </p>
          </div>
        </div>
      </section>

      <!-- ================= LIVE A4 SHOWCASE WITH A4FitDirective ================= -->
      <section class="showcase-section">
        <div class="showcase-intro">
          <div>
            <div class="badge-pill mb-2">
              <span class="badge-text">{{ i18n.t('aboutShowcaseBadge') }}</span>
            </div>
            <h2 class="section-title">{{ i18n.t('aboutShowcaseTitle') }}</h2>
            <p class="section-subtitle">
              {{ i18n.t('aboutShowcaseSubtitle') }}
            </p>
          </div>
          <a routerLink="/templates" class="see-templates-btn">
            {{ i18n.t('aboutShowcaseViewAll') }}
            <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1.5 inline" />
          </a>
        </div>

        <div class="showcase-cards-grid">
          <!-- Card 1 -->
          <a routerLink="/templates" class="showcase-card">
            <div appA4Fit class="showcase-a4-frame">
              <div class="showcase-thumb">
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
              <div class="card-overlay">
                <span class="overlay-text">{{ i18n.t('aboutCard1Overlay') }}</span>
              </div>
            </div>
            <div class="showcase-footer">
              <div>
                <h3 class="showcase-name">Professional Timeline</h3>
                <p class="showcase-sub">{{ i18n.t('aboutCard1Sub') }}</p>
              </div>
              <span class="badge-tag">$4</span>
            </div>
          </a>

          <!-- Card 2 -->
          <a routerLink="/templates" class="showcase-card">
            <div appA4Fit class="showcase-a4-frame">
              <div class="showcase-thumb">
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
              <div class="card-overlay">
                <span class="overlay-text">{{ i18n.t('aboutCard2Overlay') }}</span>
              </div>
            </div>
            <div class="showcase-footer">
              <div>
                <h3 class="showcase-name">Modern Split</h3>
                <p class="showcase-sub">{{ i18n.t('aboutCard2Sub') }}</p>
              </div>
              <span class="badge-tag">$4</span>
            </div>
          </a>

          <!-- Card 3 -->
          <a routerLink="/templates" class="showcase-card">
            <div appA4Fit class="showcase-a4-frame">
              <div class="showcase-thumb">
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
              <div class="card-overlay">
                <span class="overlay-text">{{ i18n.t('aboutCard3Overlay') }}</span>
              </div>
            </div>
            <div class="showcase-footer">
              <div>
                <h3 class="showcase-name">Elegant Frame</h3>
                <p class="showcase-sub">{{ i18n.t('aboutCard3Sub') }}</p>
              </div>
              <span class="badge-tag">$4</span>
            </div>
          </a>
        </div>
      </section>

      <!-- ================= 3-STEP PROCESS ================= -->
      <section class="process-section">
        <div class="process-container">
          <div class="process-copy">
            <div class="badge-pill mb-2">
              <span class="badge-text">{{ i18n.t('aboutProcessBadge') }}</span>
            </div>
            <h2 class="section-title">{{ i18n.t('aboutProcessTitle') }}</h2>
            <p class="section-subtitle">
              {{ i18n.t('aboutProcessSubtitle') }}
            </p>
            <a routerLink="/make-cv" class="btn-primary mt-6">
              {{ i18n.t('aboutProcessBtn') }}
              <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1.5 inline" />
            </a>
          </div>

          <div class="steps-flow">
            <div class="step-card">
              <div class="step-badge">01</div>
              <div class="step-info">
                <h3>{{ i18n.t('aboutStep1Title') }}</h3>
                <p>{{ i18n.t('aboutStep1Desc') }}</p>
              </div>
            </div>

            <div class="step-card">
              <div class="step-badge">02</div>
              <div class="step-info">
                <h3>{{ i18n.t('aboutStep2Title') }}</h3>
                <p>{{ i18n.t('aboutStep2Desc') }}</p>
              </div>
            </div>

            <div class="step-card">
              <div class="step-badge">03</div>
              <div class="step-info">
                <h3>{{ i18n.t('aboutStep3Title') }}</h3>
                <p>{{ i18n.t('aboutStep3Desc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= LOCATION & STORY (PREY KEI, CAMBODIA) ================= -->
      <section class="location-section">
        <div class="location-card">
          <div class="location-content">
            <div class="badge-pill mb-3 bg-indigo-100/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              <lucide-icon [img]="MapPin" class="w-3.5 h-3.5 mr-1" />
              <span class="badge-text">{{ i18n.t('aboutLocBadge') }}</span>
            </div>
            <h2 class="location-heading">{{ i18n.t('aboutLocHeadingPrefix') }} <span class="text-indigo-600 dark:text-indigo-400">{{ i18n.t('aboutLocHeadingHighlight') }}</span></h2>
            <p class="location-lead">
              {{ i18n.t('aboutLocLead') }}
            </p>
            <p class="location-sub">
              {{ i18n.t('aboutLocSub') }}
            </p>

            <div class="location-actions">
              <a 
                href="https://maps.app.goo.gl/pCr8AnSM1ykfQQHJ7" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn-maps"
              >
                <lucide-icon [img]="MapPin" class="w-4 h-4 mr-1.5 inline" />
                {{ i18n.t('aboutLocBtnMaps') }}
              </a>
              <a 
                href="https://t.me/cvresumecqprofessional" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn-telegram-loc"
              >
                <lucide-icon [img]="Send" class="w-4 h-4 mr-1.5 inline" />
                {{ i18n.t('aboutLocBtnTelegram') }}
              </a>
            </div>
          </div>

          <div class="map-embed-wrapper">
            <iframe 
              class="map-iframe" 
              title="Map showing Prey Kei, Phnom Penh, Cambodia" 
              src="https://maps.google.com/maps?q=11.4974551,104.8137251&amp;z=15&amp;output=embed" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade" 
              allowfullscreen
            ></iframe>
            <div class="map-tag">
              <span class="pulse-dot"></span>
              <span>{{ i18n.t('aboutLocTag') }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ================= FINAL CTA ================= -->
      <section class="about-final-cta">
        <div class="final-cta-inner">
          <div class="badge-pill mx-auto mb-3 bg-white/20 text-white border-white/20">
            <span class="badge-sparkle">✦</span>
            <span class="badge-text">{{ i18n.t('aboutCtaBadge') }}</span>
          </div>
          <h2>{{ i18n.t('aboutCtaTitle') }}</h2>
          <p>
            {{ i18n.t('aboutCtaDesc') }}
          </p>
          <div class="flex flex-wrap justify-center gap-3">
            <a routerLink="/templates" class="cta-btn-white">
              {{ i18n.t('aboutCtaBtnChoose') }}
              <lucide-icon [img]="ArrowRight" class="w-4 h-4 ml-1.5 inline" />
            </a>
            <a 
              href="https://t.me/cvresumecqprofessional" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="cta-btn-glass"
            >
              <lucide-icon [img]="Send" class="w-4 h-4 mr-1.5 inline" />
              {{ i18n.t('aboutCtaBtnTelegram') }}
            </a>
          </div>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .about-page {
      min-height: 100vh;
      overflow: hidden;
      padding-top: 92px;
      background: linear-gradient(150deg, #f8faff 0%, #eef3ff 45%, #f4f8ff 100%);
      color: #1a233b;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      position: relative;
    }

    /* Ambient background glows */
    .ambient {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
    }
    .ambient-one {
      width: 520px;
      height: 520px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(99, 102, 241, 0) 70%);
      right: -150px;
      top: 50px;
    }
    .ambient-two {
      width: 480px;
      height: 480px;
      background: radial-gradient(circle, rgba(2, 132, 199, 0.18) 0%, rgba(2, 132, 199, 0) 70%);
      left: -150px;
      top: 550px;
    }
    .ambient-three {
      width: 420px;
      height: 420px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 70%);
      right: 15%;
      bottom: 120px;
    }

    /* Badge pill */
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

    /* ================= HERO ================= */
    .about-hero {
      max-width: 1260px;
      margin: 0 auto;
      padding: 40px 24px 70px;
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 48px;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .hero-title {
      font-size: clamp(2.4rem, 4.4vw, 3.8rem);
      line-height: 1.12;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #0f172a;
      margin: 20px 0 20px;
    }
    .gradient-text {
      background: linear-gradient(135deg, #4f46e5 0%, #0284c7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-lead {
      max-width: 580px;
      margin: 0 0 32px;
      color: #475569;
      font-size: 1.05rem;
      line-height: 1.72;
    }
    .hero-lead strong {
      color: #0f172a;
    }
    .hero-actions {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      padding: 14px 24px;
      border-radius: 14px;
      background: linear-gradient(135deg, #4f46e5, #3b82f6);
      color: #fff;
      font-weight: 700;
      font-size: 0.92rem;
      text-decoration: none;
      box-shadow: 0 10px 24px rgba(79, 70, 229, 0.35);
      transition: all 0.2s ease;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(79, 70, 229, 0.45);
    }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      padding: 14px 22px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid #cbd5e1;
      color: #334155;
      font-weight: 700;
      font-size: 0.92rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-secondary:hover {
      background: #ffffff;
      border-color: #94a3b8;
      color: #0284c7;
      transform: translateY(-2px);
    }
    .trust-strip {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      margin-top: 36px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
    }
    .trust-item {
      display: flex;
      align-items: center;
    }
    .trust-dot {
      color: #cbd5e1;
    }

    /* Advantage Card */
    .hero-visual {
      position: relative;
    }
    .advantage-card {
      background: #ffffff;
      border-radius: 28px;
      border: 1px solid #e2e8f0;
      padding: 32px;
      box-shadow: 0 20px 45px rgba(30, 41, 59, 0.08);
      position: relative;
      overflow: hidden;
    }
    .adv-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .adv-badge {
      display: inline-flex;
      align-items: center;
      padding: 5px 12px;
      border-radius: 9999px;
      background: #fef3c7;
      color: #92400e;
      font-size: 0.75rem;
      font-weight: 800;
    }
    .adv-tag {
      font-size: 0.72rem;
      font-weight: 800;
      color: #059669;
      background: #d1fae5;
      padding: 4px 10px;
      border-radius: 8px;
    }
    .adv-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 20px;
    }
    .comparison-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .comp-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }
    .comp-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 900;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .comp-icon.ok {
      background: #e0f2fe;
      color: #0369a1;
    }
    .comp-info strong {
      display: block;
      font-size: 0.88rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .comp-info p {
      font-size: 0.78rem;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
    .rating-strip {
      margin-top: 24px;
      padding-top: 18px;
      border-top: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }

    /* ================= STATS RIBBON ================= */
    .stats-ribbon {
      max-width: 1260px;
      margin: 0 auto 60px;
      padding: 0 24px;
    }
    .stats-inner {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid #e2e8f0;
      border-radius: 22px;
      padding: 24px 32px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
      flex-wrap: wrap;
      gap: 20px;
    }
    .stat-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }
    .stat-desc {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
      margin-top: 4px;
    }
    .stat-divider {
      width: 1px;
      height: 40px;
      background: #e2e8f0;
    }

    /* ================= PILLARS ================= */
    .pillars-section {
      max-width: 1260px;
      margin: 0 auto 80px;
      padding: 0 24px;
    }
    .section-intro {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 48px;
    }
    .section-title {
      font-size: clamp(2rem, 3.5vw, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #0f172a;
      margin: 12px 0 14px;
      line-height: 1.15;
    }
    .section-subtitle {
      font-size: 1rem;
      color: #64748b;
      line-height: 1.65;
      margin: 0;
    }
    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    .pillar-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 22px;
      padding: 28px 24px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
    }
    .pillar-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.1);
      border-color: #cbd5e1;
    }
    .pillar-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .pillar-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 10px;
    }
    .pillar-desc {
      font-size: 0.85rem;
      color: #64748b;
      line-height: 1.62;
      margin: 0;
    }

    /* ================= SHOWCASE ================= */
    .showcase-section {
      max-width: 1260px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }
    .showcase-intro {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 32px;
    }
    .see-templates-btn {
      display: inline-flex;
      align-items: center;
      color: #0284c7;
      font-weight: 800;
      font-size: 0.9rem;
      text-decoration: none;
      white-space: nowrap;
      padding-bottom: 4px;
    }
    .see-templates-btn:hover {
      text-decoration: underline;
    }
    .showcase-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }
    .showcase-card {
      border-radius: 20px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      padding: 14px;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .showcase-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 45px rgba(15, 23, 42, 0.14);
      border-color: #cbd5e1;
    }
    .showcase-a4-frame {
      position: relative;
      width: 100%;
      aspect-ratio: 210 / 297;
      overflow: hidden;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #edf2f7;
      container-type: size;
    }
    .showcase-thumb {
      position: absolute;
      top: 0;
      left: 0;
      width: 210mm;
      height: 297mm;
      overflow: hidden;
      transform-origin: top left;
      transform: scale(var(--a4-scale, 0.33));
      pointer-events: none;
    }
    .card-overlay {
      position: absolute;
      inset: 0;
      z-index: 5;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(2px);
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.25s ease;
      border-radius: 12px;
    }
    .showcase-card:hover .card-overlay {
      opacity: 1;
    }
    .overlay-text {
      background: #0284c7;
      color: #ffffff;
      padding: 10px 20px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.85rem;
      box-shadow: 0 8px 24px rgba(2, 132, 199, 0.4);
    }
    .showcase-footer {
      margin-top: 14px;
      padding: 4px 6px 2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .showcase-name {
      font-size: 0.96rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .showcase-sub {
      font-size: 0.75rem;
      color: #64748b;
      margin: 3px 0 0;
    }
    .badge-tag {
      padding: 4px 10px;
      border-radius: 8px;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.78rem;
      font-weight: 800;
    }

    /* ================= PROCESS ================= */
    .process-section {
      max-width: 1260px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }
    .process-container {
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      border-radius: 32px;
      padding: 60px 48px;
      display: grid;
      grid-template-columns: 0.95fr 1.05fr;
      gap: 50px;
      align-items: center;
      border: 1px solid #dce4f8;
    }
    .process-copy .section-title {
      margin-top: 10px;
      text-align: left;
    }
    .steps-flow {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .step-card {
      background: #ffffff;
      border-radius: 18px;
      padding: 22px 24px;
      display: flex;
      gap: 18px;
      align-items: flex-start;
      border: 1px solid #e2e8f0;
      box-shadow: 0 6px 18px rgba(30, 41, 59, 0.05);
      transition: transform 0.2s ease;
    }
    .step-card:hover {
      transform: translateX(4px);
    }
    .step-badge {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: #4f46e5;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.92rem;
      font-weight: 800;
      flex-shrink: 0;
    }
    .step-info h3 {
      font-size: 1rem;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px;
    }
    .step-info p {
      font-size: 0.84rem;
      color: #64748b;
      line-height: 1.6;
      margin: 0;
    }

    /* ================= LOCATION & STORY ================= */
    .location-section {
      max-width: 1260px;
      margin: 0 auto 90px;
      padding: 0 24px;
    }
    .location-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-radius: 32px;
      overflow: hidden;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
    }
    .location-content {
      padding: 48px;
      background: linear-gradient(145deg, #f8faff 0%, #edf2ff 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .location-heading {
      font-size: clamp(2rem, 3.4vw, 2.7rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1.15;
      color: #0f172a;
      margin: 0 0 18px;
    }
    .location-lead {
      font-size: 0.96rem;
      color: #475569;
      line-height: 1.7;
      margin: 0 0 14px;
    }
    .location-sub {
      font-size: 0.86rem;
      color: #64748b;
      line-height: 1.65;
      margin: 0 0 28px;
    }
    .location-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .btn-maps {
      display: inline-flex;
      align-items: center;
      padding: 12px 20px;
      border-radius: 12px;
      background: #4f46e5;
      color: #ffffff;
      font-weight: 700;
      font-size: 0.88rem;
      text-decoration: none;
      box-shadow: 0 8px 18px rgba(79, 70, 229, 0.28);
      transition: all 0.2s ease;
    }
    .btn-maps:hover {
      background: #4338ca;
      transform: translateY(-2px);
    }
    .btn-telegram-loc {
      display: inline-flex;
      align-items: center;
      padding: 12px 20px;
      border-radius: 12px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #0284c7;
      font-weight: 700;
      font-size: 0.88rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .btn-telegram-loc:hover {
      background: #f0f9ff;
      border-color: #0284c7;
      transform: translateY(-2px);
    }
    .map-embed-wrapper {
      position: relative;
      min-height: 380px;
      background: #e2e8f0;
    }
    .map-iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
    .map-tag {
      position: absolute;
      left: 16px;
      top: 16px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid #e2e8f0;
      color: #4f46e5;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      pointer-events: none;
    }

    /* ================= FINAL CTA ================= */
    .about-final-cta {
      max-width: 1260px;
      margin: 0 auto;
      padding: 0 24px 80px;
    }
    .final-cta-inner {
      padding: 64px 32px;
      border-radius: 32px;
      text-align: center;
      background: linear-gradient(135deg, #4338ca 0%, #312e81 60%, #1e1b4b 100%);
      color: #fff;
      box-shadow: 0 24px 60px rgba(67, 56, 202, 0.35);
      position: relative;
      overflow: hidden;
    }
    .final-cta-inner h2 {
      font-size: clamp(2rem, 3.6vw, 2.8rem);
      font-weight: 900;
      letter-spacing: -0.04em;
      margin: 0 auto 16px;
      max-width: 650px;
    }
    .final-cta-inner p {
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

    /* ================= DARK MODE ================= */
    :host-context(.dark) .about-page {
      background: linear-gradient(145deg, #0d1527 0%, #111b32 50%, #111a2c 100%);
      color: #e2e8f0;
    }
    :host-context(.dark) .hero-title,
    :host-context(.dark) .section-title,
    :host-context(.dark) .adv-title,
    :host-context(.dark) .pillar-title,
    :host-context(.dark) .showcase-name,
    :host-context(.dark) .step-info h3,
    :host-context(.dark) .location-heading,
    :host-context(.dark) .stat-number {
      color: #f8fafc;
    }
    :host-context(.dark) .hero-lead,
    :host-context(.dark) .section-subtitle,
    :host-context(.dark) .pillar-desc,
    :host-context(.dark) .showcase-sub,
    :host-context(.dark) .step-info p,
    :host-context(.dark) .location-lead,
    :host-context(.dark) .location-sub,
    :host-context(.dark) .stat-desc {
      color: #94a3b8;
    }
    :host-context(.dark) .hero-lead strong {
      color: #e2e8f0;
    }
    :host-context(.dark) .badge-pill {
      background: #131d31;
      border-color: #2b3d5b;
      color: #818cf8;
    }
    :host-context(.dark) .btn-secondary {
      background: #152239;
      border-color: #2b3d5b;
      color: #e2e8f0;
    }
    :host-context(.dark) .btn-secondary:hover {
      background: #1c2b48;
      border-color: #38bdf8;
      color: #38bdf8;
    }
    :host-context(.dark) .advantage-card,
    :host-context(.dark) .pillar-card,
    :host-context(.dark) .showcase-card,
    :host-context(.dark) .step-card {
      background: #131f36;
      border-color: #243552;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    }
    :host-context(.dark) .stats-inner {
      background: rgba(19, 31, 54, 0.85);
      border-color: #243552;
    }
    :host-context(.dark) .stat-divider {
      background: #243552;
    }
    :host-context(.dark) .comp-info strong {
      color: #f8fafc;
    }
    :host-context(.dark) .comp-info p {
      color: #94a3b8;
    }
    :host-context(.dark) .comp-icon.ok {
      background: rgba(2, 132, 199, 0.2);
      color: #38bdf8;
    }
    :host-context(.dark) .rating-strip {
      border-top-color: #243552;
    }
    :host-context(.dark) .process-container {
      background: linear-gradient(135deg, #15223c 0%, #111b30 100%);
      border-color: #243552;
    }
    :host-context(.dark) .location-card {
      background: #131f36;
      border-color: #243552;
    }
    :host-context(.dark) .location-content {
      background: linear-gradient(145deg, #15233e 0%, #101a2f 100%);
    }
    :host-context(.dark) .btn-telegram-loc {
      background: #152239;
      border-color: #2b3d5b;
      color: #38bdf8;
    }
    :host-context(.dark) .btn-telegram-loc:hover {
      background: #1e3152;
      border-color: #38bdf8;
    }
    :host-context(.dark) .map-tag {
      background: rgba(19, 31, 54, 0.95);
      border-color: #2b3d5b;
      color: #818cf8;
    }
    :host-context(.dark) .showcase-a4-frame {
      background: #ffffff;
      border-color: #243552;
    }
    :host-context(.dark) .badge-tag {
      background: rgba(2, 132, 199, 0.25);
      color: #38bdf8;
    }

    /* ================= RESPONSIVE ================= */
    @media (max-width: 1024px) {
      .about-hero {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 40px;
      }
      .hero-lead {
        margin-left: auto;
        margin-right: auto;
      }
      .hero-actions, .trust-strip {
        justify-content: center;
      }
      .pillars-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .showcase-cards-grid {
        grid-template-columns: 1fr;
        max-width: 420px;
        margin: 0 auto;
      }
      .process-container {
        grid-template-columns: 1fr;
        padding: 40px 24px;
      }
      .location-card {
        grid-template-columns: 1fr;
      }
      .location-content {
        padding: 32px 24px;
      }
      .map-embed-wrapper {
        min-height: 300px;
      }
    }

    @media (max-width: 640px) {
      .about-page {
        padding-top: 75px;
      }
      .hero-title {
        font-size: 2.2rem;
      }
      .stats-inner {
        padding: 20px 16px;
      }
      .stat-divider {
        display: none;
      }
      .stat-box {
        width: 45%;
      }
      .stat-number {
        font-size: 1.6rem;
      }
      .pillars-grid {
        grid-template-columns: 1fr;
      }
      .showcase-intro {
        flex-direction: column;
        align-items: flex-start;
      }
      .advantage-card {
        padding: 24px 18px;
      }
      .final-cta-inner {
        padding: 44px 20px;
      }
    }
  `]
})
export class AboutComponent {
  readonly i18n = inject(TranslationService);
  readonly demo = DEMO_CV;

  readonly ArrowRight = ArrowRight;
  readonly ArrowUpRight = ArrowUpRight;
  readonly Send = Send;
  readonly Check = Check;
  readonly Sparkles = Sparkles;
  readonly Star = Star;
  readonly FileText = FileText;
  readonly Camera = Camera;
  readonly ShieldCheck = ShieldCheck;
  readonly Zap = Zap;
  readonly Award = Award;
  readonly Target = Target;
  readonly Heart = Heart;
  readonly MapPin = MapPin;
  readonly Layers = Layers;
  readonly Printer = Printer;
  readonly Clock = Clock;
  readonly Users = Users;
}

