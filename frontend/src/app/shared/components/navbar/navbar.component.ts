import { Component, signal, inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import gsap from 'gsap';
import {
  LucideAngularModule,
  ArrowRight,
  ChevronDown,
  CircleUserRound,
  Info,
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
  Receipt,
  HelpCircle,
  Globe,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../toast/toast.service';
import { TranslationService, Language } from '../../../core/services/translation.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <header class="site-header">
      <nav class="nav-bar" aria-label="Main navigation">
        
        <!-- BRAND LOGO -->
        <a routerLink="/" class="brand-link" aria-label="CQ Professional home">
          <div class="brand-badge">
            <span>CV</span>
          </div>
          <div class="brand-text">
            <div class="brand-title-row">
              <strong>CQ Professional</strong>
              <span class="pro-tag">PRO</span>
            </div>
            <small>{{ i18n.currentLang() === 'kh' ? 'កម្មវិធីបង្កើត CV អាជីព' : 'Creative CV Builder' }}</small>
          </div>
        </a>

        <!-- CENTER NAVIGATION LINKS (DESKTOP) -->
        <div class="nav-links">
          <a routerLink="/" (click)="onNavClick($event)" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            {{ i18n.t('navHome') }}
          </a>
          <a routerLink="/templates" (click)="onNavClick($event)" routerLinkActive="active">
            {{ i18n.t('navTemplates') }}
          </a>
          <a routerLink="/my-cv" (click)="onNavClick($event)" routerLinkActive="active">
            {{ i18n.t('navMyCv') }}
          </a>

          <!-- MORE DROPDOWN -->
          <div class="more-wrap">
            <button
              type="button"
              class="more-trigger"
              [class.active]="showMore()"
              (click)="toggleMore($event)"
              [attr.aria-expanded]="showMore()">
              <span>{{ i18n.t('navMore') }}</span>
              <lucide-icon [img]="ChevronDown" class="chevron-icon" />
            </button>

            @if (showMore()) {
              <div class="nav-popover">
                <a routerLink="/about" (click)="closeMenus()">
                  <lucide-icon [img]="Info" />
                  <span>{{ i18n.t('navAbout') }}</span>
                </a>
                <a routerLink="/contact" (click)="closeMenus()">
                  <lucide-icon [img]="Mail" />
                  <span>{{ i18n.t('navContact') }}</span>
                </a>
                <a routerLink="/help" (click)="closeMenus()">
                  <lucide-icon [img]="HelpCircle" />
                  <span>{{ i18n.t('navHelp') }}</span>
                </a>
                <a routerLink="/payments" (click)="closeMenus()">
                  <lucide-icon [img]="Receipt" />
                  <span>{{ i18n.t('navPayments') }}</span>
                </a>
              </div>
            }
          </div>
        </div>

        <!-- RIGHT SECTION: LANGUAGE SWITCHER + USER / GUEST -->
        <div class="nav-right">

          <!-- MODERN SEGMENTED LANGUAGE SWITCHER (KH / EN) -->
          <div class="lang-switcher" role="group" aria-label="Language selector">
            <button
              type="button"
              class="lang-pill"
              [class.active]="i18n.currentLang() === 'kh'"
              (click)="setLang('kh', $event)"
              title="ភាសាខ្មែរ (Khmer)">
              <span class="flag">🇰🇭</span>
              <span class="lang-code">KH</span>
            </button>
            <button
              type="button"
              class="lang-pill"
              [class.active]="i18n.currentLang() === 'en'"
              (click)="setLang('en', $event)"
              title="English">
              <span class="flag">🇬🇧</span>
              <span class="lang-code">EN</span>
            </button>
          </div>

          <!-- LOGGED IN USER -->
          @if (auth.currentUser(); as user) {
            <div class="profile-wrap">
              <button
                type="button"
                class="profile-trigger"
                [class.open]="showProfile()"
                (click)="toggleProfile($event)">
                <div class="profile-avatar-wrap">
                  @if (user.avatarUrl) {
                    <img [src]="user.avatarUrl" alt="Profile photo" class="profile-photo" />
                  } @else {
                    <span class="profile-initial">{{ (user.fullName || 'U')[0].toUpperCase() }}</span>
                  }
                  <span class="status-dot"></span>
                </div>
                <div class="profile-copy">
                  <b>{{ user.fullName }}</b>
                  <small>{{ user.role === 'admin' ? i18n.t('navAdmin') : i18n.t('navMyAccount') }}</small>
                </div>
                <lucide-icon [img]="ChevronDown" class="profile-chevron" />
              </button>

              @if (showProfile()) {
                <div class="profile-popover">
                  <div class="profile-summary">
                    <div class="summary-avatar">
                      @if (user.avatarUrl) {
                        <img [src]="user.avatarUrl" alt="" />
                      } @else {
                        <span class="summary-initial">{{ (user.fullName || 'U')[0].toUpperCase() }}</span>
                      }
                    </div>
                    <div class="summary-info">
                      <b>{{ user.fullName }}</b>
                      <small>{{ user.email }}</small>
                    </div>
                  </div>

                  @if (user.role === 'admin') {
                    <a routerLink="/admin" (click)="closeMenus()" class="admin-link">
                      <lucide-icon [img]="LayoutDashboard" />
                      <span>{{ i18n.t('navAdminPanel') }}</span>
                    </a>
                  }

                  <a routerLink="/payments" (click)="closeMenus()">
                    <lucide-icon [img]="Receipt" />
                    <span>{{ i18n.t('navReceipts') }}</span>
                  </a>
                  <a routerLink="/help" (click)="closeMenus()">
                    <lucide-icon [img]="HelpCircle" />
                    <span>{{ i18n.t('navHelp') }}</span>
                  </a>
                  <a routerLink="/settings" (click)="closeMenus()">
                    <lucide-icon [img]="Settings" />
                    <span>{{ i18n.t('navSettings') }}</span>
                  </a>

                  <div class="divider"></div>

                  <button type="button" class="logout" (click)="logout()">
                    <lucide-icon [img]="LogOut" />
                    <span>{{ i18n.t('navLogOut') }}</span>
                  </button>
                </div>
              }
            </div>
          } @else {
            <!-- GUEST ACTIONS -->
            <div class="guest-actions">
              <a routerLink="/login" class="login-link">
                {{ i18n.t('navSignIn') }}
              </a>
              <a routerLink="/register" class="signup-link">
                <span>{{ i18n.t('navCreateCv') }}</span>
                <lucide-icon [img]="ArrowRight" class="w-3.5 h-3.5" />
              </a>
            </div>
          }

        </div>

      </nav>
    </header>
  `,
  styles: [`
    .site-header {
      position: fixed;
      z-index: 50;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: min(calc(100% - 28px), 1340px);
      font-family: 'Manrope', 'Inter', system-ui, -apple-system, sans-serif;
    }

    .nav-bar {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 12px;
      border: 1px solid rgba(226, 232, 240, 0.85);
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 12px 34px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* BRAND LOGO */
    .brand-link {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #0f172a;
      padding: 6px 12px 6px 6px;
      border-radius: 9999px;
      transition: opacity 0.2s ease;
    }
    .brand-link:hover {
      opacity: 0.9;
    }

    .brand-badge {
      width: 38px;
      height: 38px;
      border-radius: 14px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-weight: 900;
      font-size: 0.9rem;
      letter-spacing: -0.02em;
      box-shadow: 0 6px 16px -2px rgba(99, 102, 241, 0.4);
      ring: 2px solid rgba(165, 180, 252, 0.3);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .brand-title-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .brand-title-row strong {
      font-size: 0.94rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f172a;
    }
    .pro-tag {
      font-size: 0.58rem;
      font-weight: 900;
      padding: 1px 5px;
      border-radius: 5px;
      background: #eef2ff;
      color: #4f46e5;
      border: 1px solid rgba(199, 210, 254, 0.7);
      letter-spacing: 0.04em;
    }
    .brand-text small {
      font-size: 0.64rem;
      font-weight: 600;
      color: #64748b;
    }

    /* CENTER NAVIGATION LINKS */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(241, 245, 249, 0.6);
      padding: 4px 6px;
      border-radius: 9999px;
      border: 1px solid rgba(226, 232, 240, 0.7);
    }

    .nav-links > a,
    .more-trigger {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 7px 14px;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #475569;
      text-decoration: none;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
    }

    .nav-links > a:hover,
    .more-trigger:hover {
      color: #4f46e5;
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-1px);
    }

    .nav-links > a.active,
    .more-trigger.active {
      background: #ffffff;
      color: #4f46e5;
      font-weight: 800;
      box-shadow: 0 3px 10px rgba(79, 70, 229, 0.12), 0 1px 2px rgba(0, 0, 0, 0.04);
    }

    .chevron-icon {
      width: 13px;
      height: 13px;
      transition: transform 0.25s ease;
    }
    .more-trigger.active .chevron-icon {
      transform: rotate(180deg);
    }

    /* RIGHT SECTION */
    .nav-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* MODERN SEGMENTED LANGUAGE SWITCHER */
    .lang-switcher {
      display: inline-flex;
      align-items: center;
      background: rgba(241, 245, 249, 0.85);
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 9999px;
      padding: 3px;
      gap: 2px;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
    }

    .lang-pill {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 4px 9px;
      border-radius: 9999px;
      border: none;
      background: transparent;
      color: #64748b;
      font-size: 0.72rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      line-height: 1;
    }

    .lang-pill .flag {
      font-size: 0.85rem;
      line-height: 1;
      display: inline-block;
      transform: translateY(-0.5px);
    }

    .lang-pill .lang-code {
      letter-spacing: 0.04em;
    }

    .lang-pill:hover {
      color: #1e293b;
      background: rgba(255, 255, 255, 0.6);
    }

    .lang-pill.active {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      box-shadow: 0 2px 8px -1px rgba(79, 70, 229, 0.4);
      transform: scale(1.02);
    }

    .lang-pill.active:hover {
      color: #ffffff;
      background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
    }

    /* MORE POPOVER & PROFILE POPOVER */
    .more-wrap,
    .profile-wrap {
      position: relative;
    }

    .nav-popover,
    .profile-popover {
      position: absolute;
      top: calc(100% + 12px);
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 18px;
      padding: 6px;
      box-shadow: 0 16px 36px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06);
      z-index: 60;
    }

    .nav-popover {
      left: 0;
      width: 175px;
    }

    .profile-popover {
      right: 0;
      width: 235px;
    }

    .nav-popover a,
    .profile-popover a,
    .profile-popover button {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      box-sizing: border-box;
      padding: 9px 12px;
      border-radius: 12px;
      color: #475569;
      background: transparent;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.18s ease;
      text-align: left;
    }

    .nav-popover a:hover,
    .profile-popover a:hover,
    .profile-popover button:hover {
      background: #f1f5f9;
      color: #4f46e5;
      transform: translateX(2px);
    }

    .nav-popover lucide-icon,
    .profile-popover lucide-icon {
      width: 16px;
      height: 16px;
      color: #64748b;
      transition: color 0.18s ease;
    }
    .nav-popover a:hover lucide-icon,
    .profile-popover a:hover lucide-icon {
      color: #4f46e5;
    }

    .admin-link {
      background: #eef2ff !important;
      color: #4f46e5 !important;
      font-weight: 800 !important;
    }

    .profile-summary {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px 12px;
      border-bottom: 1px solid #f1f5f9;
      margin-bottom: 4px;
    }

    .summary-avatar {
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 800;
      font-size: 0.85rem;
      shrink: 0;
      overflow: hidden;
    }
    .summary-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .summary-info {
      min-width: 0;
      flex: 1;
    }
    .summary-info b {
      display: block;
      font-size: 0.78rem;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .summary-info small {
      display: block;
      font-size: 0.65rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .divider {
      height: 1px;
      background: #f1f5f9;
      margin: 4px 0;
    }

    .profile-popover .logout {
      color: #ef4444;
    }
    .profile-popover .logout lucide-icon {
      color: #ef4444;
    }
    .profile-popover .logout:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    /* USER PROFILE TRIGGER PILL */
    .profile-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ffffff;
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 9999px;
      padding: 4px 10px 4px 4px;
      cursor: pointer;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
    }
    .profile-trigger:hover,
    .profile-trigger.open {
      border-color: #c7d2fe;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.12);
      transform: translateY(-1px);
    }

    .profile-avatar-wrap {
      position: relative;
    }
    .profile-photo,
    .profile-initial {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.78rem;
      background: linear-gradient(135deg, #e0e7ff, #ede9fe);
      color: #4f46e5;
    }
    .status-dot {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #10b981;
      border: 2px solid #ffffff;
    }

    .profile-copy {
      display: flex;
      flex-direction: column;
      text-align: left;
      line-height: 1.15;
      max-width: 100px;
    }
    .profile-copy b {
      font-size: 0.74rem;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .profile-copy small {
      font-size: 0.6rem;
      color: #64748b;
      font-weight: 600;
    }

    .profile-chevron {
      width: 13px;
      height: 13px;
      color: #94a3b8;
      transition: transform 0.25s ease;
    }
    .profile-trigger.open .profile-chevron {
      transform: rotate(180deg);
    }

    /* GUEST ACTIONS */
    .guest-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .login-link {
      padding: 7px 13px;
      font-size: 0.78rem;
      font-weight: 700;
      color: #475569;
      text-decoration: none;
      border-radius: 9999px;
      transition: color 0.18s ease;
    }
    .login-link:hover {
      color: #4f46e5;
    }

    .signup-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      font-size: 0.78rem;
      font-weight: 800;
      text-decoration: none;
      border-radius: 9999px;
      box-shadow: 0 4px 14px -2px rgba(79, 70, 229, 0.4);
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .signup-link:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px -1px rgba(79, 70, 229, 0.5);
    }
    .signup-link:active {
      transform: scale(0.97);
    }


    /* DARK MODE STYLING */
    :host-context(html.dark) .nav-bar {
      background: rgba(15, 23, 42, 0.88);
      border-color: rgba(51, 65, 85, 0.8);
      box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.5);
    }
    :host-context(html.dark) .brand-title-row strong {
      color: #f8fafc;
    }
    :host-context(html.dark) .brand-text small {
      color: #94a3b8;
    }
    :host-context(html.dark) .pro-tag {
      background: rgba(99, 102, 241, 0.2);
      border-color: rgba(99, 102, 241, 0.4);
      color: #a5b4fc;
    }
    :host-context(html.dark) .nav-links {
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(51, 65, 85, 0.7);
    }
    :host-context(html.dark) .nav-links > a,
    :host-context(html.dark) .more-trigger {
      color: #94a3b8;
    }
    :host-context(html.dark) .nav-links > a:hover,
    :host-context(html.dark) .more-trigger:hover {
      color: #e0e7ff;
      background: rgba(51, 65, 85, 0.8);
    }
    :host-context(html.dark) .nav-links > a.active,
    :host-context(html.dark) .more-trigger.active {
      background: #1e293b;
      color: #818cf8;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
    }
    :host-context(html.dark) .lang-switcher {
      background: rgba(30, 41, 59, 0.85);
      border-color: rgba(51, 65, 85, 0.9);
    }
    :host-context(html.dark) .lang-pill {
      color: #94a3b8;
    }
    :host-context(html.dark) .lang-pill:hover {
      color: #f8fafc;
      background: rgba(51, 65, 85, 0.6);
    }
    :host-context(html.dark) .profile-trigger {
      background: #1e293b;
      border-color: rgba(51, 65, 85, 0.8);
      color: #f1f5f9;
    }
    :host-context(html.dark) .profile-copy b {
      color: #f8fafc;
    }
    :host-context(html.dark) .status-dot {
      border-color: #1e293b;
    }
    :host-context(html.dark) .nav-popover,
    :host-context(html.dark) .profile-popover {
      background: rgba(15, 23, 42, 0.96);
      border-color: rgba(51, 65, 85, 0.9);
      box-shadow: 0 16px 40px -4px rgba(0, 0, 0, 0.6);
    }
    :host-context(html.dark) .nav-popover a,
    :host-context(html.dark) .profile-popover a,
    :host-context(html.dark) .profile-popover button {
      color: #cbd5e1;
    }
    :host-context(html.dark) .nav-popover a:hover,
    :host-context(html.dark) .profile-popover a:hover,
    :host-context(html.dark) .profile-popover button:hover {
      background: #1e293b;
      color: #a5b4fc;
    }
    :host-context(html.dark) .summary-info b {
      color: #f8fafc;
    }
    :host-context(html.dark) .profile-summary,
    :host-context(html.dark) .divider {
      border-color: rgba(51, 65, 85, 0.8);
    }
    :host-context(html.dark) .admin-link {
      background: rgba(99, 102, 241, 0.15) !important;
      color: #a5b4fc !important;
    }
    :host-context(html.dark) .login-link {
      color: #94a3b8;
    }
    :host-context(html.dark) .login-link:hover {
      color: #a5b4fc;
    }

    /* RESPONSIVE BREAKPOINTS */
    @media (max-width: 960px) {
      .brand-text small {
        display: none;
      }
      .nav-links {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .site-header {
        top: 0;
        left: 0;
        right: 0;
        transform: none;
        width: 100%;
        padding: max(8px, env(safe-area-inset-top, 8px)) 12px 8px;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(24px) saturate(180%);
        -webkit-backdrop-filter: blur(24px) saturate(180%);
        border-bottom: 1px solid rgba(226, 232, 240, 0.85);
        box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
      }
      .nav-bar {
        height: 50px;
        padding: 0 2px;
        border: none;
        border-radius: 0;
        background: transparent;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        box-shadow: none;
      }
      :host-context(html.dark) .site-header {
        background: rgba(15, 23, 42, 0.92);
        border-bottom-color: rgba(51, 65, 85, 0.8);
        box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
      }
      .brand-link {
        padding: 4px 6px;
        gap: 7px;
      }
      .brand-badge {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        font-size: 0.78rem;
      }
      .brand-title-row strong {
        font-size: 0.82rem;
        white-space: nowrap;
      }
      .pro-tag {
        font-size: 0.52rem;
        padding: 1px 4px;
      }
      .nav-right {
        gap: 6px;
      }
      .lang-switcher {
        padding: 2px;
        gap: 2px;
      }
      .lang-pill {
        padding: 3px 6px;
        font-size: 0.68rem;
        gap: 3px;
      }
      .lang-pill .flag {
        font-size: 0.76rem;
      }
      .profile-trigger {
        padding: 3px 6px 3px 3px;
        gap: 4px;
      }
      .profile-photo,
      .profile-initial {
        width: 28px;
        height: 28px;
        font-size: 0.72rem;
      }
      .profile-chevron {
        width: 11px;
        height: 11px;
      }
      .profile-copy {
        display: none;
      }
      .login-link {
        display: none;
      }
      .signup-link {
        padding: 6px 11px;
        font-size: 0.72rem;
      }
      .profile-popover {
        width: min(235px, calc(100vw - 32px));
        right: 0;
      }
    }
  `]
})
export class NavbarComponent {
  private hostEl = inject(ElementRef);

  readonly ArrowRight = ArrowRight;
  readonly ChevronDown = ChevronDown;
  readonly CircleUserRound = CircleUserRound;
  readonly Info = Info;
  readonly LogOut = LogOut;
  readonly Mail = Mail;
  readonly Settings = Settings;
  readonly ShieldCheck = ShieldCheck;
  readonly Receipt = Receipt;
  readonly HelpCircle = HelpCircle;
  readonly Globe = Globe;
  readonly Menu = Menu;
  readonly X = X;
  readonly LayoutDashboard = LayoutDashboard;

  showProfile = signal(false);
  showMore = signal(false);
  mobileMenuOpen = signal(false);

  constructor(
    public auth: AuthService,
    public i18n: TranslationService,
    private toast: ToastService
  ) {}

  animatePress(target: EventTarget | null) {
    if (!target) return;
    const el = target as HTMLElement;
    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { scale: 0.93 },
      { scale: 1, duration: 0.35, ease: 'back.out(2)' }
    );
  }

  toggleMore(event?: MouseEvent) {
    if (event) this.animatePress(event.currentTarget);
    const next = !this.showMore();
    this.showMore.set(next);
    this.showProfile.set(false);
    if (next) {
      requestAnimationFrame(() => {
        const pop = this.hostEl.nativeElement.querySelector('.nav-popover');
        if (pop) {
          gsap.killTweensOf(pop);
          gsap.fromTo(
            pop,
            { opacity: 0, y: -8, scale: 0.95, transformOrigin: 'top left' },
            { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'back.out(1.7)' }
          );
          const links = pop.querySelectorAll('a');
          if (links.length) {
            gsap.fromTo(
              links,
              { opacity: 0, x: -6 },
              { opacity: 1, x: 0, duration: 0.2, stagger: 0.03, ease: 'power2.out', delay: 0.04 }
            );
          }
        }
      });
    }
  }

  toggleProfile(event?: MouseEvent) {
    if (event) this.animatePress(event.currentTarget);
    const next = !this.showProfile();
    this.showProfile.set(next);
    this.showMore.set(false);
    if (next) {
      requestAnimationFrame(() => {
        const pop = this.hostEl.nativeElement.querySelector('.profile-popover');
        if (pop) {
          gsap.killTweensOf(pop);
          gsap.fromTo(
            pop,
            { opacity: 0, y: -8, scale: 0.95, transformOrigin: 'top right' },
            { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: 'back.out(1.7)' }
          );
          const links = pop.querySelectorAll('a, button');
          if (links.length) {
            gsap.fromTo(
              links,
              { opacity: 0, x: -6 },
              { opacity: 1, x: 0, duration: 0.2, stagger: 0.03, ease: 'power2.out', delay: 0.04 }
            );
          }
        }
      });
    }
  }

  onNavClick(event: MouseEvent) {
    this.animatePress(event.currentTarget);
    this.closeMenus();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
    this.showMore.set(false);
    this.showProfile.set(false);
  }

  closeMenus() {
    this.showMore.set(false);
    this.showProfile.set(false);
    this.mobileMenuOpen.set(false);
  }

  setLang(lang: Language, event?: MouseEvent) {
    if (event) this.animatePress(event.currentTarget);
    this.i18n.setLanguage(lang);
    const msg = lang === 'kh' ? 'បានប្តូរទៅជាភាសាខ្មែរ' : 'Switched to English';
    this.toast.success(msg);
  }

  logout() {
    this.closeMenus();
    const msg = this.i18n.currentLang() === 'kh' ? 'អ្នកបានចាកចេញដោយជោគជ័យ។' : 'You have logged out successfully.';
    this.toast.success(msg);
    this.auth.logout();
  }
}
