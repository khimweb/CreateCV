import { Routes } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AdminShellComponent } from './admin-shell.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'customers',
        loadComponent: () => import('./customers/admin-customers.component').then(m => m.AdminCustomersComponent),
      },
      {
        path: 'templates',
        loadComponent: () => import('./templates/admin-templates.component').then(m => m.AdminTemplatesComponent),
      },
      {
        path: 'permission',
        loadComponent: () => import('./permission/admin-permission.component').then(m => m.AdminPermissionComponent),
      },
      {
        path: 'security',
        loadComponent: () => import('./security/admin-security.component').then(m => m.AdminSecurityComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/admin-profile.component').then(m => m.AdminProfileComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/admin-settings.component').then(m => m.AdminSettingsComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/admin-reports.component').then(m => m.AdminReportsComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./about/admin-about.component').then(m => m.AdminAboutComponent),
      },
    ],
  },
];
