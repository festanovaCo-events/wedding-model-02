import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'expired',
    loadComponent: () =>
      import('./features/shared/pages/wedding-expired-page/wedding-expired-page.component').then(
        (m) => m.WeddingExpiredPageComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./features/shared/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/model-02/pages/model-02-page/model-02-page.component').then(
            (m) => m.Model02PageComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
