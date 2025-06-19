import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { reverseAuthGuard } from './core/guards/reverse-auth.guard';
import { authGuard } from './core/guards/auth.guard';
import { EntryRedirectComponent } from './core/entry-redirect/entry-redirect.component';
import { roleGuard } from './core/guards/role.guard';
import { UserLayoutComponent } from './layout/user-layout/user-layout.component';

export const routes: Routes = [
  { path: '', component: EntryRedirectComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [reverseAuthGuard],
  },
  {
    path: 'forgot-password',
    canActivate: [reverseAuthGuard],
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    canActivate: [reverseAuthGuard],
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [roleGuard, authGuard],
    data: { roles: ['User', 'Admin'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboards/dashboard/dashboard.component').then(
            (d) => d.DashboardComponent
          ),
      },
      {
        path: 'transaction',
        loadComponent: () =>
          import(
            './features/transactions/transaction-page/transaction-page.component'
          ).then((t) => t.TransactionPageComponent),
      },
      {
        path: 'report',
        loadComponent: () =>
          import('./features/report/report-page/report-page.component').then(
            (r) => r.ReportPageComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile-page/profile-page.component').then(
            (p) => p.ProfilePageComponent
          ),
      },
      {
        path: 'category',
        loadComponent: () =>
          import(
            './features/category/category-page/category-page.component'
          ).then((c) => c.CategoryPageComponent),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./features/account/account-page/account-page.component').then(
            (a) => a.AccountPageComponent
          ),
      },
      {
        path: 'budget',
        loadComponent: () =>
          import('./features/budget/budget-page/budget-page.component').then(
            (b) => b.BudgetPageComponent
          ),
      }
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./core/un-authorized/un-authorized.component').then(
        (m) => m.UnAuthorizedComponent
      ),
  },
];
