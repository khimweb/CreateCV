import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { approvalGuard } from './core/guards/approval.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'templates',
    loadComponent: () =>
      import('./features/templates/template-gallery.component').then(m => m.TemplateGalleryComponent),
    // gallery itself is public — only the "Select" action requires login
  },
  {
    path: 'templates/preview/:id',
    loadComponent: () =>
      import('./features/templates/template-preview.component').then(m => m.TemplatePreviewComponent),
    canActivate: [authGuard], // must be logged in to view/select a specific template
  },
  {
    path: 'make-cv',
    loadComponent: () =>
      import('./features/make-cv/make-cv.component').then(m => m.MakeCvComponent),
    canActivate: [authGuard, approvalGuard],
  },
  {
    path: 'my-cv',
    loadComponent: () =>
      import('./features/my-cv/my-cv-dashboard.component').then(m => m.MyCvDashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'my-cv/:cv_id',
    loadComponent: () =>
      import('./features/my-cv/my-cv-detail.component').then(m => m.MyCvDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
  },
  { path: '**', redirectTo: '' },
];
