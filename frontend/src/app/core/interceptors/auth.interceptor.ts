import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

function getApiBase(): string {
  if (typeof window !== 'undefined') {
    // 1. Check for runtime injected API URL (e.g., window.__API_URL__)
    if ((window as any).__API_URL__) {
      return (window as any).__API_URL__.replace(/\/+$/, '');
    }
    // 2. Check localStorage override (convenient for testing on mobile or custom domains)
    try {
      const stored = localStorage.getItem('API_URL');
      if (stored) return stored.replace(/\/+$/, '');
    } catch {}

    // 3. Localhost dev environment (Angular dev server on 4200 -> Express on 4000)
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0') {
      return 'http://localhost:4000';
    }
    // 4. Production hosting (VPS with Nginx proxy, cloud domain, or same-origin)
    return '';
  }
  return 'http://localhost:4000';
}

/**
 * 1. Rewrites relative /api/* requests to API base URL (handles dev & prod hosting).
 * 2. Attaches the bearer token to every request.
 * 3. Globally catches 401s and redirects to /login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getToken();

  // Rewrite relative /api paths → configured backend URL
  let apiReq = req;
  if (req.url.startsWith('/api')) {
    const base = getApiBase();
    apiReq = req.clone({ url: base ? `${base}${req.url}` : req.url });
  }

  const authedReq = token
    ? apiReq.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : apiReq;

  return next(authedReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        auth.logout();
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => err);
    })
  );
};
