import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Home, LayoutTemplate, FileText, MoreHorizontal, Info, Mail } from 'lucide-angular';

@Component({
  selector: 'app-mobile-bottom-nav', standalone: true, imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav class="mobile-nav" aria-label="Mobile navigation">
      @if (moreOpen()) {<div class="more-sheet"><a routerLink="/about" (click)="moreOpen.set(false)"><lucide-icon [img]="Info"/>About</a><a routerLink="/contact" (click)="moreOpen.set(false)"><lucide-icon [img]="Mail"/>Contact</a></div>}
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-item" aria-label="Home"><lucide-icon [img]="Home"/><span>Home</span></a>
      <a routerLink="/templates" routerLinkActive="active" class="nav-item" aria-label="Templates"><lucide-icon [img]="LayoutTemplate"/><span>Templates</span></a>
      <a routerLink="/my-cv" routerLinkActive="active" class="nav-item" aria-label="My CV"><lucide-icon [img]="FileText"/><span>My CV</span></a>
      <button type="button" class="nav-item" [class.active]="moreOpen()" (click)="moreOpen.set(!moreOpen())" [attr.aria-expanded]="moreOpen()" aria-label="More navigation"><lucide-icon [img]="MoreHorizontal"/><span>More</span></button>
    </nav>
  `,
  styles: [`:host{display:none}@media(max-width:720px){:host{display:block}.mobile-nav{position:fixed;z-index:55;left:50%;bottom:max(20px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(calc(100% - 48px),248px);height:64px;display:grid;grid-template-columns:repeat(4,1fr);align-items:center;padding:7px;box-sizing:border-box;border:1px solid #ffffff1a;border-radius:999px;background:#171719f2;box-shadow:0 14px 30px #1118274a;backdrop-filter:blur(18px);font-family:Inter,system-ui,sans-serif}.nav-item{justify-self:center;width:50px;height:50px;display:grid;place-items:center;border:0;border-radius:50%;background:transparent;color:#aeb1b8;text-decoration:none;cursor:pointer;transition:transform .22s cubic-bezier(.32,.72,0,1),background .22s,color .22s,box-shadow .22s}.nav-item span{display:none}.nav-item lucide-icon{width:21px;height:21px;stroke-width:2.25}.nav-item.active{background:#fff;color:#171719;box-shadow:0 4px 13px #0005;animation:dockPop .3s cubic-bezier(.32,.72,0,1)}.nav-item:hover{color:#fff;transform:translateY(-2px)}.nav-item.active:hover{color:#171719}.nav-item:active{transform:scale(.9)}.nav-item:focus-visible{outline:3px solid #a895ff;outline-offset:3px}.more-sheet{position:absolute;right:2px;bottom:75px;min-width:142px;padding:6px;border:1px solid #ffffff18;border-radius:17px;background:#171719f7;box-shadow:0 14px 30px #11182755;backdrop-filter:blur(18px);transform-origin:bottom right;animation:rise .22s cubic-bezier(.32,.72,0,1)}.more-sheet a{display:flex;align-items:center;gap:9px;padding:11px;color:#f2f3f6;text-decoration:none;font-size:.78rem;font-weight:700;border-radius:11px;transition:background .18s,transform .18s}.more-sheet a:hover{background:#ffffff12}.more-sheet a:active{transform:scale(.97)}.more-sheet lucide-icon{width:17px;height:17px;color:#c5b9ff}@keyframes dockPop{from{opacity:.45;transform:scale(.78)}to{opacity:1;transform:scale(1)}}@keyframes rise{from{opacity:0;transform:translateY(10px) scale(.92)}to{opacity:1;transform:translateY(0) scale(1)}}}@media(prefers-reduced-motion:reduce){.nav-item,.more-sheet,.more-sheet a{animation:none!important;transition:none!important}}`],
})
export class MobileBottomNavComponent {
  readonly Home = Home; readonly LayoutTemplate = LayoutTemplate; readonly FileText = FileText; readonly MoreHorizontal = MoreHorizontal; readonly Info = Info; readonly Mail = Mail;
  moreOpen = signal(false);
}
