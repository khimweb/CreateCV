import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Mail, Phone, Send, ArrowUpRight } from 'lucide-angular';

@Component({
  selector: 'app-site-footer', standalone: true, imports: [RouterLink, LucideAngularModule],
  template: `
    <footer class="site-footer"><div class="footer-glow glow-one"></div><div class="footer-glow glow-two"></div><div class="footer-wrap">
      <section class="brand-column"><a routerLink="/" class="footer-brand" aria-label="CQ Professional home"><svg viewBox="0 0 56 56" aria-hidden="true"><path d="M44 10C37 4 25 4 16 11 5 20 4 37 14 47l8-8c-6-6-5-16 1-21 6-5 15-4 20 1z" fill="currentColor"/><path d="M17 17h9l7 22 8-22h8L34 51h-8z" fill="#121725"/></svg><span><strong>CQ-Professional</strong><small>Creative CV Builder</small></span></a><p>Create a CV that presents your best work with confidence, clarity, and a professional finish.</p><p class="follow-copy">Follow CV Creator</p><div class="socials"><a href="https://www.facebook.com/share/1DKNpoGtsu/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="CQ Professional Facebook">f</a><a href="https://www.tiktok.com/@cqprofessional1111" target="_blank" rel="noopener noreferrer" aria-label="CQ Professional TikTok">♪</a><a href="https://t.me/phornsokkhim" target="_blank" rel="noopener noreferrer" aria-label="CQ Professional Telegram (@phornsokkhim)"><lucide-icon [img]="Send"/></a><a href="mailto:sokkhim519&#64;gmail.com" aria-label="Email CQ Professional"><lucide-icon [img]="Mail"/></a></div></section>
      <nav class="link-column" aria-label="Product links"><h2>Explore</h2><a routerLink="/">Home</a><a routerLink="/templates">Templates</a><a routerLink="/my-cv">My CV</a><a routerLink="/about">About CQ</a></nav>
      <nav class="link-column" aria-label="Support links"><h2>Support</h2><a routerLink="/help">Help Center & Chatbot</a><a href="https://t.me/cvresumeonline" target="_blank" rel="noopener noreferrer">Official Channel (Telegram)</a><a href="https://t.me/phornsokkhim" target="_blank" rel="noopener noreferrer">Admin Chat (&#64;phornsokkhim)</a><a routerLink="/payments">Payments & Receipts</a><a routerLink="/contact">Contact us</a></nav>
      <section class="contact-column"><h2>Let’s connect</h2><p>Questions about your CV? Reach us directly and we will be happy to help.</p><a href="mailto:sokkhim519&#64;gmail.com"><lucide-icon [img]="Mail"/>sokkhim519&#64;gmail.com</a><a href="tel:+855964910220"><lucide-icon [img]="Phone"/>096 491 0220</a><a class="footer-cta" href="https://t.me/phornsokkhim" target="_blank">Chat on Telegram <lucide-icon [img]="ArrowUpRight"/></a></section>

    </div><div class="footer-bottom"><span>© 2026 CQ-Professional. Built for your next opportunity.</span><div><a routerLink="/about">About</a><a routerLink="/contact">Contact</a></div></div></footer>
  `,
  styles: [`
    .site-footer {
      display: block;
      position: relative;
      overflow: hidden;
      padding: 72px max(5vw, 32px) 24px;
      background: #121521;
      color: #c8cede;
      font-family: 'Manrope', 'Inter', system-ui, sans-serif;
    }
    .footer-wrap, .footer-bottom {
      position: relative;
      z-index: 1;
      max-width: 1240px;
      margin: auto;
    }
    .footer-wrap {
      display: grid;
      grid-template-columns: 1.6fr .7fr .9fr 1.2fr;
      gap: 50px;
    }
    .footer-glow {
      position: absolute;
      border-radius: 48%;
      pointer-events: none;
    }
    .glow-one {
      left: -120px;
      top: -190px;
      width: 500px;
      height: 280px;
      background: #303747;
      transform: rotate(9deg);
    }
    .glow-two {
      right: -100px;
      bottom: -200px;
      width: 470px;
      height: 300px;
      background: #282d3c;
      transform: rotate(-16deg);
    }
    .footer-brand {
      display: flex;
      align-items: center;
      gap: 11px;
      color: #fff;
      text-decoration: none;
      transition: opacity 0.2s ease;
    }
    .footer-brand:hover {
      opacity: 0.92;
    }
    .footer-brand svg {
      width: 43px;
      height: 43px;
      color: #b9ccff;
    }
    .footer-brand span {
      display: grid;
      gap: 3px;
    }
    .footer-brand strong {
      font-size: 1rem;
      letter-spacing: -.035em;
    }
    .footer-brand small {
      color: #9da7bc;
      font-size: .65rem;
      font-weight: 700;
    }
    .brand-column > p {
      max-width: 290px;
      margin: 20px 0;
      color: #9ca6ba;
      font-size: .78rem;
      line-height: 1.7;
    }
    .follow-copy {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #7f899d;
      margin-bottom: 10px;
    }
    .socials {
      display: flex;
      gap: 8px;
    }
    .socials a {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border: 1px solid #343b4d;
      border-radius: 10px;
      color: #cbd4e8;
      font-size: 1rem;
      font-weight: 800;
      text-decoration: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .socials a:hover {
      transform: translateY(-3px) scale(1.05);
      border-color: #818cf8;
      background: #4f46e5;
      color: #fff;
      box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
    }
    .socials a:active {
      transform: scale(0.92);
    }
    .socials lucide-icon {
      width: 15px;
      height: 15px;
    }
    .link-column, .contact-column {
      display: grid;
      align-content: start;
      gap: 11px;
    }
    .link-column h2, .contact-column h2 {
      margin: 2px 0 8px;
      color: #fff;
      font-size: .82rem;
      letter-spacing: .02em;
    }
    .link-column a {
      color: #a8b1c3;
      text-decoration: none;
      font-size: .76rem;
      display: inline-block;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .link-column a:hover {
      color: #ffffff;
      transform: translateX(4px);
    }
    .contact-column > p {
      max-width: 265px;
      margin: 0 0 5px;
      color: #9da6b9;
      font-size: .75rem;
      line-height: 1.65;
    }
    .contact-column > a:not(.footer-cta) {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #c9d2e4;
      text-decoration: none;
      font-size: .75rem;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .contact-column > a:not(.footer-cta):hover {
      color: #fff;
      transform: translateX(3px);
    }
    .contact-column lucide-icon {
      width: 15px;
      height: 15px;
      color: #9f91ef;
      transition: transform 0.2s ease;
    }
    .contact-column > a:not(.footer-cta):hover lucide-icon {
      transform: scale(1.15);
    }
    .footer-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      width: max-content;
      margin-top: 9px;
      padding: 10px 14px;
      border-radius: 12px;
      background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
      color: #4338ca;
      text-decoration: none;
      font-size: .74rem;
      font-weight: 800;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .footer-cta:hover {
      transform: translateY(-2.5px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
      background: #ffffff;
      color: #3730a3;
    }
    .footer-cta:active {
      transform: scale(0.96);
    }
    .footer-cta lucide-icon {
      color: inherit;
      transition: transform 0.2s ease;
    }
    .footer-cta:hover lucide-icon {
      transform: translate(2px, -2px);
    }
    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 56px;
      padding-top: 20px;
      border-top: 1px solid #2a3040;
      color: #7f899d;
      font-size: .67rem;
    }
    .footer-bottom div {
      display: flex;
      gap: 18px;
    }
    .footer-bottom a {
      color: #a8b1c3;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .footer-bottom a:hover {
      color: #fff;
    }
    @media (max-width: 1050px) {
      .footer-wrap {
        grid-template-columns: 1.4fr 1fr 1fr;
        gap: 34px;
      }
      .contact-column {
        grid-column: 1/-1;
        grid-template-columns: 1fr auto auto;
        align-items: center;
      }
      .contact-column h2 {
        grid-column: 1/-1;
      }
      .contact-column > p {
        max-width: 440px;
      }
      .footer-cta {
        margin-top: 0;
      }
    }
    @media (max-width: 760px) {
      .site-footer {
        padding: 56px 24px 106px;
      }
      .footer-wrap {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 34px 24px;
      }
      .brand-column {
        grid-column: 1/-1;
      }
      .brand-column > p {
        max-width: 430px;
      }
      .contact-column {
        grid-column: 1/-1;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .contact-column h2, .contact-column > p, .footer-cta {
        grid-column: 1/-1;
      }
      .contact-column > p {
        max-width: 420px;
      }
      .footer-bottom {
        align-items: flex-start;
        flex-direction: column;
        gap: 12px;
        margin-top: 38px;
      }
      .footer-bottom div {
        gap: 14px;
      }
    }
    @media (max-width: 480px) {
      .site-footer {
        padding: 46px 20px 112px;
      }
      .footer-wrap {
        grid-template-columns: 1fr;
        gap: 30px;
      }
      .brand-column, .contact-column {
        grid-column: auto;
      }
      .contact-column {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      .contact-column h2, .contact-column > p, .footer-cta {
        grid-column: auto;
      }
      .footer-brand svg {
        width: 39px;
        height: 39px;
      }
      .brand-column > p {
        margin: 16px 0;
      }
      .link-column {
        gap: 9px;
      }
      .footer-bottom {
        margin-top: 32px;
        font-size: .64rem;
      }
      .footer-bottom div {
        width: 100%;
        justify-content: space-between;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .socials a, .link-column a, .footer-cta {
        transition: none !important;
      }
    }
  `],
})
export class SiteFooterComponent { readonly Mail = Mail; readonly Phone = Phone; readonly Send = Send; readonly ArrowUpRight = ArrowUpRight; }
