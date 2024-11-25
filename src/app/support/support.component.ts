import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { UtilsService } from '../service/utils.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SurveyService } from '../service/survey.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent {
  userId: any;
  firstName: any;
  lastName: any;
  email: any;
  contactNo: any;
  message: any;
  baseUrl: string;
  apiUrl = environment.apiUrl;
  centerId: any;
  id: any;
  constructor(private utils: UtilsService, public themeService: DataService, private http: HttpClient,private surveyservice: SurveyService) {
    this.baseUrl = environment.baseURL;
  }
  ngOnInit(): void {
    this.getMyAccount();
  }
  getMyAccount() {
    this.userId = this.utils.getUserId();
    this.themeService.GetMyAccount(this.userId).subscribe((data: any) => {

      this.id = data.id;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.email = data.email
      this.contactNo = data.contactNo
      this.centerId = data.centerId
    });
  }

  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }
  submitForm() {

    //const url = `${this.apiUrl}SubmitQuery`;
    
    const params = {
      id: this.id,
      centerId: this.centerId,
      emailId: this.email,
      message: this.message,
      contactNumber: this.contactNo,
      createdDate: this.getCurrentDateTime(),
      status:'ACT',
      firstName: this.firstName,
      lastName: this.lastName
    };

    this.surveyservice.SubmitQuery(params).subscribe({
      next: (response: any) => {
        if (response.includes('CreatedSuccessfully')) {
          this.utils.showSuccess('Data sent successfully');
        } else {
          console.error('Unexpected response:', response);
          this.utils.showError('Unexpected response');
        }
      },
      error: (err: any) => {
        console.error('Error occurred while sending form data:', err);
        this.utils.showError(err);
      }
    });

    // this.http.post(url, null, { params, responseType: 'text' }).subscribe({
    //   next: (response: any) => {
    //     if (response.includes('CreatedSuccessfully')) {
    //       this.utils.showSuccess('Data sent successfully');
    //     } else {
    //       console.error('Unexpected response:', response);
    //       this.utils.showError('Unexpected response');
    //     }
    //   },
    //   error: (err: any) => {
    //     console.error('Error occurred while sending form data:', err);
    //     this.utils.showError(err);
    //   }
    // });
  }
}
