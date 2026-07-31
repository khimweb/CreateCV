import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
}

const TOKEN_KEY = 'cv_creator_token';
const USER_KEY = 'cv_creator_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Reactive signal the whole app (navbar, guards, template cards) can read */
  currentUser = signal<AuthUser | null>(this.readStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  isLoggedIn(): boolean {
    return !!this.currentUser() && !!localStorage.getItem(TOKEN_KEY);
  }

  login(email: string, password: string, returnUrl = '/') {
    return this.http.post<{ token: string; user: AuthUser }>('/api/v1/auth/login', { email, password }).pipe(
      tap(({ token, user }) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
        this.router.navigateByUrl(returnUrl);
      })
    );
  }

  register(fullName: string, email: string, password: string) {
    return this.http.post<{ token: string; user: AuthUser }>('/api/v1/auth/register', { fullName, email, password }).pipe(
      tap(({ token, user }) => {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
        // On successful registration, you typically want to take the user to the main part of the app
        this.router.navigate(['/my-cv']);
      })
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /**
   * Central "must be logged in to proceed" helper. Used by the Template
   * Gallery and Template Preview screens: if not logged in, sends the
   * user straight to /login and remembers where to send them back.
   */
  requireLoginOrRedirect(intendedUrl: string): boolean {
    if (this.isLoggedIn()) return true;
    this.router.navigate(['/login'], { queryParams: { returnUrl: intendedUrl } });
    return false;
  }
}
