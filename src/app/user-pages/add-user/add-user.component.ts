import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/service/utils.service';
import { SurveyService } from 'src/app/service/survey.service';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  showTooltip: { [key: string]: boolean } = {};
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }

  baseUrl = '';
  constructor(public themeService: DataService, private utility: UtilsService, private surveyservice: SurveyService) {
    this.baseUrl = environment.baseURL;
  }
  files: File[] = [];
  role: any;
  id: number;
  firstName: any;
  lastName: any;
  status: "ACT";
  contactNo: Number;
  email: any;
  roleId: number = 0;
  centerId: number = this.utility.getCenterId();
  image: any;

  password: string = '';

  generatePassword(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    return password;
  }

  onGeneratePassword() {
    this.password = this.generatePassword(10);
  }

  onSelect(event: any) {

    this.files.push(...event.addedFiles);
  }

  onRemove(event: any) {

    this.files.splice(this.files.indexOf(event), 1);
  }
  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }

  AddUser() {

    if (!this.validateSurvey()) {
      this.utility.showError('Please fill all required fields.');
      return;
    }

    const dataToSend = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password,
      status: this.status,
      contactNo: this.contactNo,
      createdDate: this.getCurrentDateTime(),
      modifiedDate: '',
      email: this.email,
      roleId: this.roleId,
      centerId: this.centerId,
      image: this.image,
      role: this.role,
      isPaid: true,
      address: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      phone: 0,
      gstNumber: '',
      plan: [
        {
          id: 0,
          planId: 0,
          organizationId: 0,
          paidAmount: 0,
          pendingAmount: 0,
          totalAmount: 0,
          startDate: this.getCurrentDateTime(),
          endDate: '',
          status: '',
          orderId: ''
        }
      ],
      surveyList: [] as { vendarSurveyId: number }[]

    };
    for (const surveyId of this.selectedSurveyIds) {
      const surveyObject = { vendarSurveyId: surveyId };
      dataToSend.surveyList.push(surveyObject);
    }


    this.themeService.AddNewUser(dataToSend).subscribe(
      response => {
        if (response == '"UserAlreadyExits"') {
          this.utility.showError("User Already Exist");
        } else if (response == '"Failed"') {
          this.utility.showError("User not created");
        }
        else {
          this.utility.showSuccess('New User Created Successfully');

        }
      },
      error => {
        this.utility.showError(error);
        console.error('Error occurred while sending POST request:', error);
      }
    );
  }

  information: any[] = [];
  firstNamerequired: boolean = true
  lastNamerequired: boolean = true
  phone: boolean = true
  roletype: boolean = true
  emailaddress: boolean = true
  passwordtype: boolean = true
  phoneLengthError: boolean = true;
  touched: boolean = false;

  validateSurvey(): boolean {
    this.firstNamerequired = !!this.firstName && this.firstName.trim().length > 0;
    this.lastNamerequired = !!this.lastName && this.lastName.trim().length > 0;
    this.phone = !!this.contactNo && this.contactNo.toString().trim().length > 0;
    this.phoneLengthError = !!this.contactNo && this.contactNo.toString().trim().length < 11;
    this.roletype = !!this.roleId && this.roleId.toString().trim().length > 0;
    this.emailaddress = !!this.email && this.email.trim().length > 0;
    this.passwordtype = !!this.password && this.password.trim().length > 0;
    this.touched = true;

    return (
      this.firstNamerequired &&
      this.lastNamerequired &&
      this.phone &&
      this.phoneLengthError &&
      this.roletype &&
      this.emailaddress &&
      this.passwordtype
    );
  }


  isSuperAdmin = false;
  isAdmin = false;
  isUser = false;

  ngOnInit() {
    this.role = this.utility.getRole();
    this.getAllSurveyList()
    if (this.role) {
      this.role = this.role.toLowerCase();
    }

    if (this.role === 'superadmin') {
      this.isSuperAdmin = false;
      this.isAdmin = true;
      this.isUser = true;
    } else if (this.role === 'admin') {
      this.isAdmin = false;
      this.isUser = true;
    } else if (this.role === 'user') {
      this.isUser = true;
    }

  }


  surveyData: any[] = []
  totalItemsCount: any
  toppings = new FormControl('');

  getAllSurveyList() {
    this.surveyservice.GetSurveyList().subscribe((data: any) => {
      this.surveyData = data.surveyType;
      this.totalItemsCount = data.totalCount;

    });
  }


  selectedSurveyIds: any[] = []
  onSelectionChange(event: MatSelectChange): void {
    this.selectedSurveyIds = event.value;

  }


}
