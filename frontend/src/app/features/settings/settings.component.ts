import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, UserRound, Lock, Camera, Clock, Upload, Palette, Check } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  template: `
    <main class="settings-page">
      <div class="glow glow-one" aria-hidden="true"></div>
      <div class="glow glow-two" aria-hidden="true"></div>
      <div class="glow glow-three" aria-hidden="true"></div>

      <section class="settings-shell">
        <header class="settings-head">
          <div>
            <p class="kicker">{{ i18n.t('settingsKicker') }}</p>
            <h1>{{ i18n.t('settingsTitle') }}</h1>
            <p>{{ i18n.t('settingsSubtitle') }}</p>
          </div>
          <div class="account-pill">
            <span>{{ initials }}</span>
            <div>
              <b>{{ fullName || i18n.t('settingsProfileFallback') }}</b>
              <small>{{ email() }}</small>
            </div>
          </div>
        </header>

        <div class="settings-layout">
          <aside class="settings-nav">
            @for (tab of tabs; track tab.id) {
              <button type="button" [class.active]="activeTab() === tab.id" (click)="activeTab.set(tab.id)">
                <lucide-icon [img]="tab.icon" />
                <span>{{ tab.label }}</span>
              </button>
            }
            <div class="safe-note">
              <span>✓</span>
              <p>
                <b>{{ i18n.t('settingsSafeTitle') }}</b><br>
                {{ i18n.t('settingsSafeDesc') }}
              </p>
            </div>
          </aside>

          <section class="settings-content">
            <!-- PROFILE PANEL -->
            @if (activeTab() === 'profile') {
              <div class="panel-head">
                <div>
                  <p class="kicker">{{ i18n.t('settingsProfileKicker') }}</p>
                  <h2>{{ i18n.t('settingsProfileHead') }}</h2>
                  <p>{{ i18n.t('settingsProfileDesc') }}</p>
                </div>
              </div>

              <div class="cover" [style.background-image]="coverUrl() ? 'url(' + coverUrl() + ')' : ''">
                <label>
                  <lucide-icon [img]="Camera" /> {{ i18n.t('settingsChangeCover') }}
                  <input type="file" accept="image/*" hidden (change)="onCoverChange($event)">
                </label>
              </div>

              <div class="avatar-wrap">
                <div class="avatar">
                  @if (avatarUrl()) {
                    <img [src]="avatarUrl()" alt="Profile photo">
                  } @else {
                    <span>{{ initials }}</span>
                  }
                </div>
                <label class="avatar-upload">
                  <lucide-icon [img]="Upload" />
                  <input type="file" accept="image/*" hidden (change)="onAvatarChange($event)">
                </label>
              </div>

              <div class="form-grid">
                <label>
                  {{ i18n.t('settingsFullNameLabel') }}
                  <input [(ngModel)]="fullName" [placeholder]="i18n.t('settingsFullNamePlaceholder')">
                </label>
                <label>
                  {{ i18n.t('settingsEmailLabel') }}
                  <input [value]="email()" disabled>
                </label>
              </div>

              <div class="save-row">
                <button type="button" class="primary-btn" (click)="saveProfile()">
                  {{ saving() ? i18n.t('settingsBtnSaving') : i18n.t('settingsBtnSaveChanges') }}
                  <span>→</span>
                </button>
                @if (profileMsg()) {
                  <p [class.error]="profileErr()">{{ profileMsg() }}</p>
                }
              </div>
            }

            <!-- SECURITY PANEL -->
            @if (activeTab() === 'security') {
              <div class="panel-head">
                <p class="kicker">{{ i18n.t('settingsSecurityKicker') }}</p>
                <h2>{{ i18n.t('settingsSecurityHead') }}</h2>
                <p>{{ i18n.t('settingsSecurityDesc') }}</p>
              </div>

              <div class="security-card">
                <span class="security-icon"><lucide-icon [img]="Lock" /></span>
                <div>
                  <b>{{ i18n.t('settingsProtectionActive') }}</b>
                  <p>{{ i18n.t('settingsProtectionDesc') }}</p>
                </div>
              </div>

              <div class="password-fields">
                <label>
                  {{ i18n.t('settingsCurrentPwLabel') }}
                  <input type="password" [(ngModel)]="currentPassword" [placeholder]="i18n.t('settingsCurrentPwPlaceholder')">
                </label>
                <label>
                  {{ i18n.t('settingsNewPwLabel') }}
                  <input type="password" [(ngModel)]="newPassword" [placeholder]="i18n.t('settingsNewPwPlaceholder')">
                </label>
                <label>
                  {{ i18n.t('settingsConfirmPwLabel') }}
                  <input type="password" [(ngModel)]="confirmPassword" [placeholder]="i18n.t('settingsConfirmPwPlaceholder')">
                </label>
              </div>

              <div class="save-row">
                <button type="button" class="primary-btn" (click)="changePassword()">
                  {{ saving() ? i18n.t('settingsBtnUpdatingPw') : i18n.t('settingsBtnUpdatePw') }}
                  <span>→</span>
                </button>
                @if (pwMsg()) {
                  <p [class.error]="pwErr()">{{ pwMsg() }}</p>
                }
              </div>
            }

            <!-- APPEARANCE PANEL -->
            @if (activeTab() === 'appearance') {
              <div class="panel-head">
                <p class="kicker">{{ i18n.t('settingsPrefKicker') }}</p>
                <h2>{{ i18n.t('settingsPrefHead') }}</h2>
                <p>{{ i18n.t('settingsPrefDesc') }}</p>
              </div>

              <div class="preference">
                <div>
                  <b>{{ i18n.t('settingsColorMode') }}</b>
                  <p>{{ i18n.t('settingsColorModeDesc') }}</p>
                </div>
                <div class="mode-picker">
                  <button type="button" [class.selected]="theme() === 'light'" (click)="setTheme('light')">
                    {{ i18n.t('settingsModeLight') }}
                  </button>
                  <button type="button" [class.selected]="theme() === 'dark'" (click)="setTheme('dark')">
                    {{ i18n.t('settingsModeDark') }}
                  </button>
                </div>
              </div>

              <div class="preference">
                <div>
                  <b>{{ i18n.t('settingsEditorExp') }}</b>
                  <p>{{ i18n.t('settingsEditorExpDesc') }}</p>
                </div>
                <span class="enabled">
                  <lucide-icon [img]="Check" /> {{ i18n.t('settingsEnabledBadge') }}
                </span>
              </div>
            }

            <!-- ACTIVITY PANEL -->
            @if (activeTab() === 'activity') {
              <div class="panel-head">
                <p class="kicker">{{ i18n.t('settingsHistoryKicker') }}</p>
                <h2>{{ i18n.t('settingsHistoryHead') }}</h2>
                <p>{{ i18n.t('settingsHistoryDesc') }}</p>
              </div>

              <div class="activity">
                <div>
                  <span><lucide-icon [img]="UserRound" /></span>
                  <section>
                    <b>{{ i18n.t('settingsAccountCreated') }}</b>
                    <p>{{ formattedDate(createdAt()) || i18n.t('settingsAccountCreatedFallback') }}</p>
                  </section>
                </div>
                <div>
                  <span><lucide-icon [img]="Clock" /></span>
                  <section>
                    <b>{{ i18n.t('settingsLastSignIn') }}</b>
                    <p>{{ formattedDate(lastLogin()) || i18n.t('settingsLastSignInFallback') }}</p>
                  </section>
                </div>
              </div>
            }
          </section>
        </div>
      </section>
    </main>
  `,
  styles: [`
    .settings-page {
      min-height: 100vh;
      box-sizing: border-box;
      padding: 120px 28px 65px;
      position: relative;
      overflow: hidden;
      background: linear-gradient(150deg, #f8faff 0%, #eef3ff 45%, #f4f8ff 100%);
      font-family: Inter, system-ui, sans-serif;
      color: #1b2e5b;
    }
    .settings-shell {
      max-width: 1120px;
      margin: auto;
      position: relative;
      z-index: 1;
    }
    .settings-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
      margin-bottom: 29px;
    }
    .kicker {
      color: #486dcc;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      margin: 0 0 10px;
    }
    .settings-head h1 {
      font-size: 2.5rem;
      letter-spacing: -0.05em;
      margin: 0 0 7px;
    }
    .settings-head > div > p:last-child,
    .panel-head > div > p:last-child,
    .panel-head > p:last-child {
      color: #74819a;
      font-size: 0.9rem;
      margin: 0;
    }
    .account-pill {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 8px 14px 8px 8px;
      border: 1px solid #dfe7f6;
      border-radius: 13px;
      background: #ffffffbf;
    }
    .account-pill > span,
    .avatar {
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #4167ca;
      color: #fff;
      font-weight: 800;
    }
    .account-pill > span {
      width: 34px;
      height: 34px;
    }
    .account-pill b {
      display: block;
      font-size: 0.77rem;
    }
    .account-pill small {
      font-size: 0.66rem;
      color: #7b889f;
    }
    .settings-layout {
      display: grid;
      grid-template-columns: 230px 1fr;
      gap: 20px;
    }
    .settings-nav,
    .settings-content {
      border: 1px solid #e0e8f6;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 13px 35px #4167ca10;
    }
    .settings-nav {
      padding: 12px;
      align-self: start;
    }
    .settings-nav button {
      display: flex;
      align-items: center;
      gap: 11px;
      width: 100%;
      padding: 13px;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: #65748e;
      font-size: 0.83rem;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
      transition: 0.2s;
    }
    .settings-nav button lucide-icon {
      width: 18px;
      flex-shrink: 0;
    }
    .settings-nav button:hover {
      background: #f0f4ff;
      color: #4167ca;
    }
    .settings-nav button.active {
      background: #eaf0ff;
      color: #4167ca;
    }
    .safe-note {
      margin: 28px 5px 6px;
      padding: 14px 7px 0;
      border-top: 1px solid #edf0f6;
      display: flex;
      gap: 8px;
      color: #748198;
      font-size: 0.67rem;
      line-height: 1.5;
    }
    .safe-note span {
      color: #25a16a;
      font-weight: 900;
    }
    .safe-note p {
      margin: 0;
    }
    .safe-note b {
      color: #405372;
    }
    .settings-content {
      min-height: 520px;
      padding: 39px;
    }
    .panel-head h2 {
      font-size: 1.65rem;
      letter-spacing: -0.04em;
      margin: 0 0 7px;
    }
    .cover {
      height: 134px;
      border-radius: 14px;
      margin: 27px 0 0;
      background: linear-gradient(115deg, #ddd3ff, #d5e5ff);
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 12px;
      box-sizing: border-box;
    }
    .cover label {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 11px;
      background: #ffffffd9;
      border-radius: 8px;
      color: #435572;
      font-size: 0.72rem;
      font-weight: 800;
      cursor: pointer;
    }
    .cover lucide-icon {
      width: 15px;
    }
    .avatar-wrap {
      width: 92px;
      position: relative;
      margin: -46px 0 0 26px;
    }
    .avatar {
      height: 84px;
      width: 84px;
      border: 4px solid #fff;
      background: #4167ca;
      overflow: hidden;
      box-shadow: 0 4px 14px #27478728;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-upload {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #4167ca;
      color: #fff;
      box-shadow: 0 3px 8px #4167ca55;
      cursor: pointer;
    }
    .avatar-upload lucide-icon {
      width: 14px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 30px;
    }
    .form-grid label,
    .password-fields label {
      display: block;
      color: #46536c;
      font-size: 0.75rem;
      font-weight: 800;
    }
    .form-grid input,
    .password-fields input {
      box-sizing: border-box;
      display: block;
      width: 100%;
      margin-top: 7px;
      padding: 12px 13px;
      border: 1px solid #dce4f1;
      border-radius: 9px;
      background: #f9fbff;
      color: #243758;
      font: inherit;
      font-size: 0.84rem;
      outline: none;
    }
    .form-grid input:focus,
    .password-fields input:focus {
      border-color: #4167ca;
      box-shadow: 0 0 0 3px #e3eaff;
    }
    .form-grid input:disabled {
      color: #8994a7;
    }
    .save-row {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 26px;
    }
    .primary-btn {
      border: 0;
      border-radius: 9px;
      padding: 13px 18px;
      background: #4167ca;
      color: #fff;
      font-size: 0.8rem;
      font-weight: 800;
      box-shadow: 0 8px 16px #4167ca3d;
      cursor: pointer;
      transition: 0.2s;
    }
    .primary-btn:hover {
      background: #3158bb;
      transform: translateY(-1px);
    }
    .primary-btn span {
      margin-left: 5px;
    }
    .save-row p {
      font-size: 0.76rem;
      color: #249260;
      margin: 0;
    }
    .save-row p.error {
      color: #bf3a51;
    }
    .security-card {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 16px;
      background: #eef4ff;
      border: 1px solid #dde8ff;
      border-radius: 12px;
      margin: 26px 0;
    }
    .security-icon {
      display: grid;
      place-items: center;
      width: 37px;
      height: 37px;
      flex: none;
      border-radius: 10px;
      background: #4167ca;
      color: #fff;
    }
    .security-icon lucide-icon {
      width: 18px;
    }
    .security-card b {
      font-size: 0.8rem;
    }
    .security-card p {
      font-size: 0.72rem;
      color: #72809a;
      margin: 4px 0 0;
    }
    .password-fields {
      display: grid;
      gap: 16px;
      max-width: 510px;
    }
    .preference {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 20px 0;
      border-bottom: 1px solid #edf0f6;
    }
    .preference b {
      font-size: 0.86rem;
    }
    .preference p {
      color: #78859c;
      font-size: 0.77rem;
      margin: 5px 0 0;
    }
    .mode-picker {
      display: flex;
      padding: 3px;
      border: 1px solid #dfe7f4;
      border-radius: 9px;
    }
    .mode-picker button {
      border: 0;
      background: transparent;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      color: #738098;
      cursor: pointer;
    }
    .mode-picker button.selected {
      background: #4167ca;
      color: #fff;
    }
    .enabled {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #249260;
      font-size: 0.75rem;
      font-weight: 800;
    }
    .enabled lucide-icon {
      width: 15px;
    }
    .activity {
      display: grid;
      gap: 13px;
      margin-top: 27px;
    }
    .activity > div {
      display: flex;
      gap: 13px;
      align-items: center;
      padding: 16px;
      border: 1px solid #e5ebf5;
      border-radius: 12px;
      background: #fbfcff;
    }
    .activity > div > span {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: #eaf0ff;
      color: #4167ca;
    }
    .activity lucide-icon {
      width: 18px;
    }
    .activity b {
      font-size: 0.82rem;
    }
    .activity p {
      font-size: 0.73rem;
      color: #77849b;
      margin: 5px 0 0;
    }
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
      top: 1000px;
      background: rgba(168, 85, 247, 0.14);
    }
    :host-context(.dark) .settings-page {
      background: linear-gradient(145deg, #0d1527 0%, #111b32 50%, #111a2c 100%);
      color: #e4ebfa;
    }
    :host-context(.dark) .glow-one {
      background: #4d3f9866;
    }
    :host-context(.dark) .glow-two {
      background: #1d5b8d55;
    }
    :host-context(.dark) .glow-three {
      background: #5d388f44;
    }
    :host-context(.dark) .settings-nav,
    :host-context(.dark) .settings-content,
    :host-context(.dark) .account-pill {
      background: #142039;
      border-color: #2a3d5b;
    }
    :host-context(.dark) .settings-head > div > p:last-child,
    :host-context(.dark) .panel-head > div > p:last-child,
    :host-context(.dark) .panel-head > p:last-child,
    :host-context(.dark) .preference p,
    :host-context(.dark) .activity p {
      color: #aab8d0;
    }
    :host-context(.dark) .settings-nav button {
      color: #b4c0d6;
    }
    :host-context(.dark) .settings-nav button.active,
    :host-context(.dark) .settings-nav button:hover {
      background: #22345a;
      color: #a8c3ff;
    }
    :host-context(.dark) .form-grid label,
    :host-context(.dark) .password-fields label {
      color: #d2dced;
    }
    :host-context(.dark) .form-grid input,
    :host-context(.dark) .password-fields input,
    :host-context(.dark) .activity > div {
      background: #0e192d;
      border-color: #2b3d5c;
      color: #e7edf9;
    }
    :host-context(.dark) .preference {
      border-color: #283b58;
    }
    :host-context(.dark) .cover label {
      background: #172843e8;
      color: #dbe7fb;
    }
    @media (max-width: 750px) {
      .settings-page {
        padding: 91px 16px 35px;
      }
      .settings-head {
        align-items: flex-start;
        flex-direction: column;
      }
      .settings-head h1 {
        font-size: 2.15rem;
      }
      .settings-layout {
        grid-template-columns: 1fr;
      }
      .settings-nav {
        display: flex;
        overflow: auto;
        padding: 8px;
      }
      .settings-nav button {
        width: auto;
        white-space: nowrap;
      }
      .safe-note {
        display: none;
      }
      .settings-content {
        min-height: 0;
        padding: 27px 22px;
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .cover {
        height: 112px;
      }
      .preference {
        align-items: flex-start;
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  public i18n = inject(TranslationService);
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  UserRound = UserRound;
  Lock = Lock;
  Camera = Camera;
  Clock = Clock;
  Upload = Upload;
  Palette = Palette;
  Check = Check;

  get tabs(): Array<{ id: string; label: string; icon: any }> {
    return [
      { id: 'profile', label: this.i18n.t('settingsTabProfile'), icon: this.UserRound },
      { id: 'security', label: this.i18n.t('settingsTabSecurity'), icon: this.Lock },
      { id: 'appearance', label: this.i18n.t('settingsTabAppearance'), icon: this.Palette },
      { id: 'activity', label: this.i18n.t('settingsTabActivity'), icon: this.Clock }
    ];
  }

  activeTab = signal<string>('profile');
  saving = signal(false);
  fullName = '';
  email = signal('');
  avatarUrl = signal<string | null>(null);
  coverUrl = signal<string | null>(localStorage.getItem('cq_cover'));
  profileMsg = signal('');
  profileErr = signal(false);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  pwMsg = signal('');
  pwErr = signal(false);

  lastLogin = signal('');
  createdAt = signal('');
  theme = signal<'light' | 'dark'>(localStorage.getItem('cv_creator_theme') === 'dark' ? 'dark' : 'light');

  get initials() {
    return (this.fullName || 'CQ').trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase();
  }

  ngOnInit() {
    const u = this.auth.currentUser();
    if (u) {
      this.fullName = u.fullName || '';
      this.email.set(u.email || '');
      this.avatarUrl.set(u.avatarUrl || null);
    }
    this.http.get<{ user: any }>('/api/v1/auth/me').subscribe({
      next: ({ user }) => {
        this.fullName = user.fullName || user.full_name || '';
        this.email.set(user.email || '');
        this.avatarUrl.set(user.avatarUrl || user.avatar_url || null);
        this.lastLogin.set(user.lastLoginAt || user.last_login_at || '');
        this.createdAt.set(user.createdAt || user.created_at || '');
      }
    });
    this.setTheme(this.theme(), false);
  }

  onAvatarChange(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => this.avatarUrl.set(String(r.result));
    r.readAsDataURL(f);
  }

  onCoverChange(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const value = String(r.result);
      this.coverUrl.set(value);
      localStorage.setItem('cq_cover', value);
    };
    r.readAsDataURL(f);
  }

  setTheme(mode: string, notify = true) {
    const resolved = mode === 'dark' ? 'dark' : 'light';
    const changed = this.theme() !== resolved;
    this.theme.set(resolved);
    localStorage.setItem('cv_creator_theme', resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    if (changed && notify) {
      this.toast.success(
        resolved === 'dark'
          ? this.i18n.t('settingsDarkEnabledToast')
          : this.i18n.t('settingsLightEnabledToast')
      );
    }
  }

  saveProfile() {
    this.saving.set(true);
    this.profileMsg.set('');
    this.http.put<{ user: any }>('/api/v1/auth/profile', {
      fullName: this.fullName,
      avatarUrl: this.avatarUrl()
    }).subscribe({
      next: ({ user }) => {
        this.saving.set(false);
        this.profileMsg.set(this.i18n.t('settingsProfileSuccess'));
        this.profileErr.set(false);
        this.toast.success(this.i18n.t('settingsProfileToastSuccess'));
        this.auth.updateUser({ fullName: user.fullName, avatarUrl: user.avatarUrl });
      },
      error: () => {
        this.saving.set(false);
        this.profileMsg.set(this.i18n.t('settingsProfileFailed'));
        this.profileErr.set(true);
        this.toast.error(this.i18n.t('settingsProfileFailed'));
      }
    });
  }

  changePassword() {
    this.pwMsg.set('');
    if (this.newPassword !== this.confirmPassword) {
      this.pwMsg.set(this.i18n.t('settingsPwMismatch'));
      this.pwErr.set(true);
      this.toast.error(this.i18n.t('settingsPwMismatch'));
      return;
    }
    if (this.newPassword.length < 8) {
      this.pwMsg.set(this.i18n.t('settingsPwMinLength'));
      this.pwErr.set(true);
      this.toast.error(this.i18n.t('settingsPwMinLength'));
      return;
    }

    this.saving.set(true);
    this.http.put<{ message: string }>('/api/v1/auth/change-password', {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: ({ message }) => {
        this.saving.set(false);
        this.pwMsg.set(message || this.i18n.t('settingsPwSuccess'));
        this.pwErr.set(false);
        this.toast.success(this.i18n.t('settingsPwSuccess'));
        this.currentPassword = this.newPassword = this.confirmPassword = '';
      },
      error: (e) => {
        this.saving.set(false);
        const errMsg = e.error?.message || this.i18n.t('settingsPwFailed');
        this.pwMsg.set(errMsg);
        this.pwErr.set(true);
        this.toast.error(errMsg);
      }
    });
  }

  formattedDate(dateStr?: string): string {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const locale = this.i18n.currentLang() === 'kh' ? 'km-KH' : 'en-US';
      return d.toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }
}
