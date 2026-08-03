import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-google-sign-in',
  standalone: true,
  template: '<div #button aria-label="Continue with Google"></div>',
  styles: [':host{display:flex;justify-content:center;min-height:44px}'],
})
export class GoogleSignInComponent implements AfterViewInit {
  @Output() credential = new EventEmitter<string>();
  @ViewChild('button', { static: true }) button!: ElementRef<HTMLDivElement>;

  async ngAfterViewInit() {
    const clientId = document.querySelector<HTMLMetaElement>('meta[name="google-client-id"]')?.content;
    if (!clientId) return console.error('Google Client ID is not configured.');

    try {
      const google = await this.waitForGoogle();
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential?: string }) => {
          if (response.credential) this.credential.emit(response.credential);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      google.accounts.id.renderButton(this.button.nativeElement, {
        type: 'standard', theme: 'outline', size: 'large', text: 'continue_with',
        shape: 'pill', logo_alignment: 'left', width: 280,
      });
    } catch (error) {
      console.error('Unable to load Google Sign-In.', error);
    }
  }

  private waitForGoogle(): Promise<any> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const timer = window.setInterval(() => {
        const google = (window as Window & { google?: any }).google;
        if (google?.accounts?.id) { window.clearInterval(timer); resolve(google); }
        else if (++attempts === 50) { window.clearInterval(timer); reject(new Error('Google Identity Services did not load.')); }
      }, 100);
    });
  }
}
