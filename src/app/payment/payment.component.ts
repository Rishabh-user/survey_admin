import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';
import { UtilsService } from '../service/utils.service';
import { SurveyService } from '../service/survey.service';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  baseUrl = '';
  firstName: string = '';
  id: string = '';
  email: string = '';
  contactNo: string = '';
  centerId: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  country: string;
  zip: string = '';
  gstNumber: string = '';
  planId: string = '';

  constructor(private surveyservice: SurveyService, public themeService: DataService, private util: UtilsService, private httpClient: HttpClient, private router: Router, private visibilityService: DataService) {

  }


  hideBreadcrumb() {
    this.visibilityService.toggleBreadcrumbVisibility(false);
  }

  userId: any;
  getMyAccount() {
    this.userId = this.util.getUserId();
    this.themeService.GetMyAccount(this.userId).subscribe((data: any) => {

      this.firstName = data.firstName;
      this.id = data.id
      this.email = data.email
      this.contactNo = data.contactNo
      this.centerId = data.centerId
    });
  }

  selectedPlan: string = '';
  selectedPlanName: string = '';

  subscriptionPlans: any[] = [
    { id: 'basic', name: 'Basic', price: 500 },
    { id: 'standard', name: 'Standard', price: 1200 },
    { id: 'premium', name: 'Premium', price: 2500 }
  ];

  ngOnInit() {
    this.hideBreadcrumb();
    this.userId = this.util.getUserId();
    this.getMyAccount();
  }

  information: any[] = [];
  firstname: boolean = true
  amount: string
  lastname: boolean = true
  Contact: boolean = true
  emailaddress: boolean = true
  amountSelected: boolean = false;
  amountError: boolean = false;

  validateSurvey(): boolean {
    this.firstname = !!this.firstName && this.firstName.trim().length > 0;
    this.amountSelected = !!this.amount;
    this.amountError = !this.amountSelected;
    this.Contact = !!this.contactNo && this.contactNo.toString().trim().length > 0;
    this.emailaddress = !!this.email && this.email.trim().length > 0;

    return (
      this.firstname &&
      this.amountSelected &&
      this.Contact &&
      this.emailaddress
    );
  }
  razorpayOptions: any = {};
  apiUrl = environment.apiUrl;

  submitForm(): void {

    if (!this.validateSurvey()) {
      this.util.showError('Please fill all required fields.');
      return;
    }
    const formData = {
      fullName: this.firstName,
      address: this.address,
      city: this.city,
      state: this.state,
      country: this.country,
      zip: this.zip,
      phone: this.contactNo,
      gstNumber: this.gstNumber,
      email: this.email,
      amount: this.amount,
      organizationId: this.centerId,
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
      // key: 'rzp_test_Ncll0VDPCO6Ffq',
      prefill: {
        // name: 'testing',
        // email: 'test@gmail.com',
        // phone: '9898989898'
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
      organizationId: this.centerId,
      paymentId: paymentId,
      orderid: orderId,

    };
    const apiUrl = `${environment.apiUrl}api/admin/${this.userId}/Payment/CompleteOrderProcess`;
    this.httpClient.post(apiUrl, requestData).subscribe(
      (response: any) => {
        if (response.message === "Success") {
          const token = response.token;
          localStorage.setItem('authToken', token);

          this.router.navigate(['/thankyou']);
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
