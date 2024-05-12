import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {

  public num1: number;
  public num2: number;
  public operator: string;
  public userInput: string;

  ngOnInit() {
    this.generateCaptcha();
  }

  generateCaptcha() {
    this.num1 = Math.floor(Math.random() * 10) + 1;
    this.num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    this.operator = operators[Math.floor(Math.random() * operators.length)];
  }
  isValid: boolean = true;

  validateCaptcha() {
    const result = eval(`${this.num1} ${this.operator} ${this.num2}`);
    const userResult = parseInt(this.userInput, 10);

    if (result === userResult) {
      this.isValid = true;
    } else {
      this.isValid = false;
      this.generateCaptcha();
    }

    return this.isValid;
  }

}
