import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';

/** Refreshes the approval status before allowing access to CV data. */
export const approvalGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  return auth.refreshCurrentUser().pipe(
    map(({ user }) => {
      if (user.role === 'admin' || user.isApproved) return true;
      toast.error('Your account is awaiting admin approval before you can use CV templates.');
      router.navigate(['/templates']);
      return false;
    }),
    catchError(() => of(false)),
  );
};
