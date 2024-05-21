import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-thankyou',
  templateUrl: './payment-thankyou.component.html',
  styleUrls: ['./payment-thankyou.component.css']
})
export class PaymentThankyouComponent {

  baseUrl = '';

  constructor() {
    this.baseUrl = environment.baseURL
  }

}
