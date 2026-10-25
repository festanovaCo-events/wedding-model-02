import { Routes } from '@angular/router';
import { APP_ROUTE_PATHS } from './shared/constants/app-routes';

export const routes: Routes = [
  {
    path: APP_ROUTE_PATHS.expired,
    loadComponent: () =>
      import('./shared/pages/wedding-expired-page/wedding-expired-page.component').then(
        (m) => m.WeddingExpiredPageComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/model-page/m02-page.component').then(
            (m) => m.M02PageComponent
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
