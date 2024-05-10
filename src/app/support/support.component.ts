import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { UtilsService } from '../service/utils.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

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
  constructor(private utils: UtilsService, public themeService: DataService, private http: HttpClient) {
    this.baseUrl = environment.baseURL;
  }
  ngOnInit(): void {
    this.getMyAccount();
  }
  getMyAccount() {
    this.userId = this.utils.getUserId();
    this.themeService.GetMyAccount(this.userId).subscribe((data: any) => {
      console.log("data", data)
      this.id = data.id;
      this.firstName = data.firstName;
      this.lastName = data.lastName
      this.email = data.email
      this.contactNo = data.contactNo
      this.centerId = data.centerId
      console.log("centerId", this.centerId)
    });
  }
  submitForm() {

    const url = `${this.apiUrl}SubmitQuery`;
    const params = {
      Id: this.id,
      CenterId: this.centerId,
      EmailId: this.email,
      Message: this.message,
      ContactNumber: this.contactNo
    };

    this.http.post(url, null, { params, responseType: 'text' }).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
        if (response.includes('CreatedSuccessfully')) {
          console.log('Data sent successfully');
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
  }
}
