import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Home, LayoutTemplate, FileText, MoreHorizontal, Info, Mail } from 'lucide-angular';

@Component({
  selector: 'app-mobile-bottom-nav', standalone: true, imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav class="mobile-nav" aria-label="Mobile navigation">
      @if (moreOpen()) {<div class="more-sheet"><a routerLink="/about" (click)="moreOpen.set(false)"><lucide-icon [img]="Info"/>About</a><a routerLink="/contact" (click)="moreOpen.set(false)"><lucide-icon [img]="Mail"/>Contact</a></div>}
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-item"><lucide-icon [img]="Home"/><span>Home</span></a>
      <a routerLink="/templates" routerLinkActive="active" class="nav-item"><lucide-icon [img]="LayoutTemplate"/><span>Templates</span></a>
      <a routerLink="/my-cv" routerLinkActive="active" class="nav-item"><lucide-icon [img]="FileText"/><span>My CV</span></a>
      <button type="button" class="nav-item" [class.active]="moreOpen()" (click)="moreOpen.set(!moreOpen())" [attr.aria-expanded]="moreOpen()"><lucide-icon [img]="MoreHorizontal"/><span>More</span></button>
    </nav>
  `,
  styles: [`:host{display:none}@media(max-width:720px){:host{display:block}.mobile-nav{position:fixed;z-index:55;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(calc(100% - 32px),390px);height:68px;display:grid;grid-template-columns:repeat(4,1fr);align-items:center;padding:0 7px;box-sizing:border-box;border:1px solid #28354d;border-radius:24px;background:#101827;box-shadow:0 14px 32px #15213d55;font-family:Inter,system-ui,sans-serif}.nav-item{height:54px;display:grid;place-items:center;align-content:center;gap:3px;border:0;border-radius:18px;background:transparent;color:#97a7c1;text-decoration:none;font-size:.61rem;font-weight:800;cursor:pointer;transition:.2s}.nav-item lucide-icon{width:20px;height:20px}.nav-item.active{background:#fff;color:#17233a;box-shadow:0 4px 14px #0002}.more-sheet{position:absolute;right:7px;bottom:77px;min-width:145px;padding:7px;border:1px solid #2c3a53;border-radius:16px;background:#101827;box-shadow:0 14px 30px #15213d55}.more-sheet a{display:flex;align-items:center;gap:9px;padding:11px;color:#e5ecfa;text-decoration:none;font-size:.78rem;font-weight:700}.more-sheet lucide-icon{width:17px;height:17px;color:#9bb5ff}}`],
})
export class MobileBottomNavComponent {
  readonly Home = Home; readonly LayoutTemplate = LayoutTemplate; readonly FileText = FileText; readonly MoreHorizontal = MoreHorizontal; readonly Info = Info; readonly Mail = Mail;
  moreOpen = signal(false);
}
