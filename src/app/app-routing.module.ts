import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user-pages/login/login.component';
import { SignUpComponent } from './user-pages/sign-up/sign-up.component';
import { ErrorComponent } from './error/error.component';
import { ForgotPasswordComponent } from './user-pages/forgot-password/forgot-password.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentThankyouComponent } from './payment-thankyou/payment-thankyou.component';
import { QuotaManagementComponent } from './quota-management/quota-management.component';
import { SupportComponent } from './support/support.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { layout: 'auth' } },
  { path: 'signup', component: SignUpComponent, data: {} },
  { path: 'forgot-password', component: ForgotPasswordComponent, data: {} },
  { path: 'payment', component: PaymentComponent, data: {} },
  { path: 'thankyou', component: PaymentThankyouComponent, data: {} },
  { path: 'support', component: SupportComponent, data: {} },
  { path: 'survey/quota-management/manage-survey/:param1', component: QuotaManagementComponent, data: {} },
  { path: 'error', component: ErrorComponent, data: {} },
  { path: 'user-pages', loadChildren: () => import('./user-pages/user-pages.module').then(m => m.UserPagesModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'survey', loadChildren: () => import('./survey/survey.module').then(m => m.SurveyModule) },
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
