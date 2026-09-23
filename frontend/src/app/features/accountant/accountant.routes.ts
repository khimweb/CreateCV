import { Routes } from '@angular/router';
import { accountantGuard } from '../../core/guards/accountant.guard';

export const accountantRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./accountant-portal.component').then(m => m.AccountantPortalComponent),
    canActivate: [accountantGuard],
  },
  {
    path: ':tab',
    loadComponent: () => import('./accountant-portal.component').then(m => m.AccountantPortalComponent),
    canActivate: [accountantGuard],
  }
];
