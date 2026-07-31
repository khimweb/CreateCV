import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guards routes that require a logged-in user:
 *   /templates/preview/:id  (selecting/using a template)
 *   /make-cv
 *   /my-cv
 *
 * If the user isn't authenticated, they're bounced to /login with a
 * returnUrl so they land back where they intended to go after signing in.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
