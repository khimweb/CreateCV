import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  private readonly BASE_URL = 'https://cv-builder.store';
  private readonly DEFAULT_KEYWORDS = 'CQ-Professional, CQ Professional, CQ CV, CV, Resume, CV Maker, Resume Builder, Free CV Maker Online, Professional CV Templates, Create CV Online, Khmer CV, Make CV, Curriculum Vitae, Job Application CV';

  private routeMetaMap: Record<string, SeoConfig> = {
    '/': {
      title: 'CQ-Professional CV Builder | Free Resume & CV Maker Online',
      description: 'Build and customize recruiter-approved resumes and CVs with CQ-Professional. Choose modern templates, live preview, and download high-quality PDF/PPTX instantly. Free online CV maker.',
    },
    '/templates': {
      title: 'Professional CV & Resume Templates | CQ-Professional',
      description: 'Explore modern, professional, and recruiter-tested CV and Cover Letter templates. Customize layouts, colors, and download in PDF and PPTX.',
    },
    '/edit-image': {
      title: 'AI Portrait & Profile Photo Retouching | CQ-Professional',
      description: 'Enhance and customize your professional CV photo. Switch outfits to professional suits, crop, and retouch seamlessly.',
    },
    '/about': {
      title: 'About CQ-Professional | Creative CV Builder Platform',
      description: 'Learn about CQ-Professional - empowering job seekers with modern career tools, professional CV templates, and instant PDF/PPTX exports.',
    },
    '/contact': {
      title: 'Contact CQ-Professional Support | CV & Resume Assistance',
      description: 'Need help building your CV? Reach out to CQ-Professional support via Telegram, Facebook, TikTok, or email for instant assistance.',
    },
    '/help': {
      title: 'Help Center & FAQ | CQ-Professional CV Builder',
      description: 'Find answers to frequently asked questions about creating CVs, KHQR payments, PDF downloads, and account settings.',
    },
    '/login': {
      title: 'Sign In | CQ-Professional CV Builder',
      description: 'Log in to your CQ-Professional account to access your saved CV drafts, purchased templates, and payment receipts.',
    },
    '/register': {
      title: 'Create an Account | CQ-Professional CV Builder',
      description: 'Sign up for CQ-Professional to create, edit, and download professional resumes and CVs.',
    },
    '/make-cv': {
      title: 'Edit Your CV Online | CQ-Professional Live Editor',
      description: 'Use the CQ-Professional split-screen editor with instant live A4 preview to craft your job-winning resume.',
    },
    '/my-cv': {
      title: 'My CVs & Resumes Dashboard | CQ-Professional',
      description: 'Manage, edit, duplicate, and download your created CVs and cover letters on CQ-Professional.',
    },
  };

  /**
   * Update SEO tags based on current URL path
   */
  updateForUrl(rawUrl: string): void {
    const cleanPath = rawUrl.split('?')[0].split('#')[0] || '/';
    const config = this.routeMetaMap[cleanPath] || this.routeMetaMap['/'];

    this.updateTags({
      ...config,
      canonicalUrl: `${this.BASE_URL}${cleanPath === '/' ? '' : cleanPath}`
    });
  }

  /**
   * Update page title, meta description, OG tags, and canonical link
   */
  updateTags(config: SeoConfig): void {
    // 1. Update Title
    this.titleService.setTitle(config.title);

    // 2. Update Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: config.description });
    this.metaService.updateTag({
      name: 'keywords',
      content: config.keywords || this.DEFAULT_KEYWORDS
    });

    // 3. Update Open Graph Tags
    this.metaService.updateTag({ property: 'og:title', content: config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    if (config.canonicalUrl) {
      this.metaService.updateTag({ property: 'og:url', content: config.canonicalUrl });
    }

    // 4. Update Twitter Card Tags
    this.metaService.updateTag({ name: 'twitter:title', content: config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });

    // 5. Update Canonical Link in <head>
    if (config.canonicalUrl) {
      this.updateCanonicalLink(config.canonicalUrl);
    }
  }

  private updateCanonicalLink(url: string): void {
    try {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    } catch {}
  }
}
