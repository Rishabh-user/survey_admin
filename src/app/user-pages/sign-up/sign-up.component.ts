import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
declare var Razorpay: any;
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  baseUrl = '';
  mainURL = ''
  showTooltip: { [key: string]: boolean } = {};
  userId: any;
  location: any;

  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }


  formSubmitted: boolean = false;
  showCompanyDetails: boolean = true;
  showUserDetails: boolean = false;
  themeService: any;
  signupForm: FormGroup;
  verificationForm: FormGroup;
  email:any
  purchaseprice: any;
  verifyemail: any;
  constructor(private util: UtilsService, private httpClient: HttpClient, private visibilityService: DataService, private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute, private utility: UtilsService) {
    visibilityService.articleVisible.next(false);
    this.baseUrl = environment.baseURL;
    this.mainURL = environment.mainURL;
  }
  organizationId: any

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

  ngOnInit() {
    this.hideHeader();
    this.hideSideBar();
    this.hideBreadcrumb();
    this.signupForm = this.fb.group({
      organizationName: ['', [Validators.required]],
      fullName: ['', Validators.required],
      zipCode: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      agree: ['', Validators.required],
      privacy: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
    this.verificationForm = this.fb.group({
      email_otp: ['', Validators.required],
      captchertoken: ['', Validators.required],
    });


    this.route.queryParams.subscribe((data) => {
      this.purchaseprice = data['price'];
      this.amount = this.purchaseprice;
    });
    this.route.queryParams.subscribe((data) => {
      if (data['email']) {
        this.signupForm.patchValue({ email: data['email'] });
        console.log("email", data['email']);
      }
    });
    this.userId = this.util.getUserId();

  }

  LoginSlider: OwlOptions = {
    loop: true,
    items: 1,
    nav: false,
    dots: true
  };

  token: string | undefined;
  selectedImage: string | ArrayBuffer | null = null;
  defaultImage: string = './assets/images/profile/pic.png';
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
    } else {
      this.selectedImage = null;
    }
  }
  generateOTP() {
    Object.keys(this.signupForm.controls).forEach(field => {
      const control = this.signupForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
    this.formSubmitted = true;
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;


      this.authService.registerOrganization(formData).subscribe(
        (response) => {
          if (response.message === 'AlreadyExists') {
            this.utility.showError("This Organisation Already Registered");

          } else if (response.message === 'EmailAlreadyExits') {
            this.utility.showError("This Email Id Already Registered");

          } else {
            this.organizationId = response.centerId
            this.userId = response.userId
            this.showUserDetails = true;
          }
        },
        (error) => {
          console.error('Registration failed:', error);
          this.utility.showError(error);
        }
      );
    }
  }

  verifyEmail(skipClicked: boolean = false) {

    Object.keys(this.verificationForm.controls).forEach(field => {
      const control = this.verificationForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    const otp = this.verificationForm.get('email_otp')?.value;
    const captchertoken = this.verificationForm.get('captchertoken')?.value



    if (this.verificationForm.valid) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
      const dataToSend = {
        oId: this.organizationId,
        otp: otp,
        captcha: captchertoken
      }


      this.authService.verifyEmail(dataToSend).subscribe(
        (response) => {

          const token = response;
          localStorage.setItem('authToken', token);
          if (skipClicked) {
            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
            this.router.navigateByUrl(returnUrl).then(() => {
              window.location.reload()
              this.suurveypurchaseprice = false;
            });
          } else {

            this.suurveypurchaseprice = true;
          }
        },
        (error) => {
          console.error('Email verification failed:', error);
          this.utility.showError("Please enter correct OTP ");

        }
      );

    }

  }


  suurveypurchaseprice: boolean = false
  emailopt: boolean = false

  purchasepriceplan() {
    this.verifyEmail();
    if (this.verifyemail) {
      this.suurveypurchaseprice = true;
    }

  }


  redirectDashboard() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
    this.router.navigateByUrl(returnUrl).then(() => {
      window.location.reload();
    })

  }


  subscriptionPlans = [
    { id: 'basic', name: 'Basic', price: '500' },
    { id: 'standard', name: 'Standard', price: '1200' },
    { id: 'premium', name: 'Premium', price: '2500' }
  ];

  razorpayOptions: any = {};
  amount: any;
  apiUrl = environment.apiUrl;

  submitForm(): void {

    const formData = {
      amount: this.amount,
      organizationId: this.organizationId,
      planId: this.amount
    };
    this.postAmount(formData).subscribe((response: any) => {

      this.payNow(response, response.orderId);
    }, error => {
      console.error('Error occurred:', error);
    });
  }

  postAmount(formData: any) {

    return this.httpClient.post(`${this.apiUrl}api/admin/${this.userId}/Payment/ProcessRequestOrder`, formData);
  }

  payNow(orderData: any, orderId: string): void {
    const razorpayOptions = {
      description: 'Razorpay',
      currency: 'INR',
      amount: orderData.amount * 100,
      name: 'Scrip8',
      key: 'rzp_live_MCaO8pF7KZUV9F',
      prefill: {
        name: 'Testing',
        email: 'test@gmail.com',
        phone: '9898989898'
      },
      theme: {
        color: '#f05e16'
      },
      modal: {
        ondismiss: () => {

        }
      },
      handler: (response: any) => {

        this.sendPaymentDetails(response.razorpay_payment_id, orderId);
      }
    };

    const razorpayInstance = new Razorpay(razorpayOptions);
    razorpayInstance.open();
  }
  sendPaymentDetails(paymentId: string, orderId: string): void {
    const requestData = {
      organizationId: this.organizationId,
      paymentId: paymentId,
      orderid: orderId
    };
    const apiUrl = `${environment.apiUrl}api/admin/${this.userId}/Payment/CompleteOrderProcess`;
    this.httpClient.post(apiUrl, requestData).subscribe(
      (response: any) => {

        if (response.message === "Success") {


          const token = response.token;
          localStorage.setItem('authToken', token);
          this.router.navigate(["/"]).then(() => {
            window.location.reload();
          })

        } else {
          console.error('Error in response:', response);
        }
      },
      (error: any) => {
        console.error('HTTP Error:', error);
        console.error('Server Error:', error);
      }
    );
  }



}

