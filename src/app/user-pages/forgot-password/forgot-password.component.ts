import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  errorMessage: string = '';
  submitted: boolean = false;
  loading: boolean = false;
  loginForm: FormGroup;
  resetForm: FormGroup;
  userId: any
  showUserDetails: boolean = false
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService,
    private utility: UtilsService, private visibilityService: DataService, private route: ActivatedRoute) {
    visibilityService.articleVisible.next(false);
  }


  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  hideHeader() {
    this.visibilityService.toggleHeaderVisibility(false);
  }
  showHeader() {
    this.visibilityService.toggleHeaderVisibility(true);
  }
  hideSideBar() {
    this.visibilityService.toggleNavbarVisibility(false);
  }
  showSideBar() {
    this.visibilityService.toggleNavbarVisibility(true);
  }

  hideBreadcrumb() {
    this.visibilityService.toggleBreadcrumbVisibility(false);
  }

  ShowBreadcrumb() {
    this.visibilityService.toggleBreadcrumbVisibility(true);
  }

  ngOnInit(): void {
    this.hideHeader();
    this.hideSideBar();
    this.hideBreadcrumb();
    this.createForm();
    this.resetForm = this.fb.group({
      otp: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.errorMessage = '';
      this.loading = true;
      const email = this.loginForm.get('email')?.value;
      this.authService.resetPassword(email)
        .subscribe(
          response => {
            this.userId = response
            this.showUserDetails = true
            console.log('Password reset request successful:', response);
            this.loading = false;
          },
          error => {
            console.error('Error resetting password:', error);
            this.errorMessage = 'Failed to reset password. Please try again later.';
            this.loading = false;
          }
        );
    }
  }
  generateOTP() {
    Object.keys(this.resetForm.controls).forEach(field => {
      const control = this.resetForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    console.log('Form data:', this.resetForm.value);
    console.log('Valid Form :', this.resetForm.valid);
    if (this.resetForm.valid) {
      const formData = {
        ...this.resetForm.value,
        oId: this.userId
      };
      this.authService.verifyEmailAndResetPassword(formData)
        .subscribe(
          response => {

            console.log('Email verification and password reset successful:', response);
            this.loading = false;
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/login';
            this.router.navigateByUrl(returnUrl).then(() => {
              window.location.reload();
            });
          },
          error => {
            console.error('Error verifying email and resetting password:', error);
            this.errorMessage = 'Failed to verify email and reset password. Please try again later.';
            this.loading = false;
          }
        );
    }
  }
  LoginSlider: OwlOptions = {
    loop: true,
    items: 1,
    nav: false,
    dots: true
  };
}
