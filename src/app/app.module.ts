import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

import { NgIconsModule, provideNgIconsConfig } from '@ng-icons/core';

import { heroHome } from '@ng-icons/heroicons/outline';

import { heroUsers } from '@ng-icons/heroicons/outline';
import { heroChevronRight } from '@ng-icons/heroicons/outline';
import { heroStopCircle } from '@ng-icons/heroicons/outline';
import { heroClipboardDocumentList } from '@ng-icons/heroicons/outline';
import { heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';
import { heroClipboardDocumentCheck } from '@ng-icons/heroicons/outline';
import { heroShieldCheck } from '@ng-icons/heroicons/outline';
import { heroUser } from '@ng-icons/heroicons/outline';
import { heroLockClosed } from '@ng-icons/heroicons/outline';
import { heroBell } from '@ng-icons/heroicons/outline';
import { heroArrowLongRight } from '@ng-icons/heroicons/outline';
import { heroBars3 } from '@ng-icons/heroicons/outline';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { heroTrash } from '@ng-icons/heroicons/outline';
import { heroCommandLine } from '@ng-icons/heroicons/outline';
import { heroShoppingBag } from '@ng-icons/heroicons/outline';
import { heroInformationCircle } from '@ng-icons/heroicons/outline';
import { heroLink } from '@ng-icons/heroicons/outline';
import { heroPlus } from '@ng-icons/heroicons/outline';


import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb/breadcrumb.component';
import { LoginComponent } from './user-pages/login/login.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorService } from './service/http-interceptor.service';
import { CaptchaComponent } from './shared/captcha/captcha.component';
import { CreateSurveyPopupComponent } from './survey/popups/create-survey-popup/create-survey-popup.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { environment } from '../environments/environment';
import { NgxPaginationModule } from 'ngx-pagination';
import { SignUpComponent } from './user-pages/sign-up/sign-up.component';
import { ErrorComponent } from './error/error.component';
import { ToastrModule } from 'ngx-toastr';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './user-pages/forgot-password/forgot-password.component';
import { LoaderService } from './service/loader.service';
import { PaymentComponent } from './payment/payment.component';
import { LoginFormComponent } from './user-pages/loginForm/loginForm.component';
import { PaymentThankyouComponent } from './payment-thankyou/payment-thankyou.component';
import { QuotaManagementComponent } from './quota-management/quota-management.component';
import { SupportComponent } from './support/support.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    BreadcrumbComponent,
    LoginComponent,
    CaptchaComponent,
    CreateSurveyPopupComponent,
    SignUpComponent,
    ErrorComponent,
    ForgotPasswordComponent,
    PaymentComponent,
    LoginFormComponent,
    PaymentThankyouComponent,
    QuotaManagementComponent,
    SupportComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CarouselModule,
    AppRoutingModule,
    DragDropModule,
    FormsModule,
    ModalModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatInputModule,
    ReactiveFormsModule,
    MatChipsModule,
    HttpClientModule,
    MatSelectModule,
    NgIconsModule.withIcons({
      heroHome,
      heroCommandLine,
      heroUsers,
      heroChevronRight,
      heroStopCircle,
      heroClipboardDocumentList,
      heroQuestionMarkCircle,
      heroClipboardDocumentCheck,
      heroShieldCheck,
      heroUser,
      heroLockClosed,
      heroBell,
      heroArrowLongRight,
      heroBars3,
      heroXMark,
      heroMagnifyingGlass,
      heroTrash,
      heroShoppingBag,
      heroInformationCircle,
      heroLink,
      heroPlus
    }),
    BrowserAnimationsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    LoaderService,
    provideNgIconsConfig({
      size: '1.8em',
    }),
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
