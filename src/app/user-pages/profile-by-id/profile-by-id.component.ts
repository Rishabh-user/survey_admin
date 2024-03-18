import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileIdPopupComponent } from 'src/app/survey/popups/profile-id-popup/profile-id-popup.component';
import { SurveyService } from 'src/app/service/survey.service';

@Component({
  selector: 'app-profile-by-id',
  templateUrl: './profile-by-id.component.html',
  styleUrls: ['./profile-by-id.component.css']
})
export class ProfileByIdComponent {

  @ViewChild('ProfileId', { static: true }) ProfileId!: ProfileIdPopupComponent;

  UserData: any[] = [];
  image: any;
  baseUrl = '';

  constructor(public themeService: DataService, private cdr: ChangeDetectorRef, private utility: UtilsService, private modalService: NgbModal, private surveyservice: SurveyService,) {
    this.baseUrl = environment.baseURL;
  }
  files: File[] = [];
  role: any;
  id: number = 0;
  firstName: any;
  lastName: any;
  email: any;
  contactNo: number;
  createdDate: any;
  roleId: number = 0;
  centerId: number = this.utility.getCenterId();


  roles: any[] = [
    { id: 1, name: 'SuperAdmin' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'User' }
  ];

  isSuperAdmin = false;
  isAdmin = false;
  isUser = false;
  isClient = false;

  ngOnInit(): void {
    this.role = this.utility.getRole()
    this.getAllUser()

    this.roleId = this.utility.getRoleId()
    if (this.role) {
      this.role = this.role.toLowerCase();
    }
    console.log("profile id Role", this.role)
    if (this.role == 'client')
      this.isClient = true;
    else if (this.role == 'superadmin')
      this.isSuperAdmin = true
    else if (this.role == 'admin')
      this.isAdmin = true
    else if (this.role == 'user')
      this.isUser = true

  }

  userId: any;


  getAllUser() {
    this.userId = this.utility.getUserId()

    this.themeService.GetAllUserProfileById(this.userId, this.centerId).subscribe((data: any) => {
      this.UserData = data;

      console.log("qwerty", this.firstName)
      console.log("data", data)

      this.cdr.detectChanges();
    });
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  }

  onAddNewSurveyClick() {
    this.ProfileId.show();
  }

  userName: any
  lastname: any
  // contactNo: any
  userroledata: any
  usercreateddate: any
  userstatus: any

  getUserDetails(userId: any): void {
    console.log("userId", userId)
    const filteredUser = this.UserData.find((user: any) => user.id === userId);
    if (filteredUser) {
      this.firstName = filteredUser.firstName
      this.lastname = filteredUser.lastName
      this.email = filteredUser.email;
      this.contactNo = filteredUser.contactNo;
      this.userroledata = filteredUser.role;
      this.usercreateddate = filteredUser.createdDate;
      this.id = userId;
      this.userstatus = filteredUser.status


      // You can access other properties in a similar manner

      console.log("User Name:", this.userName);
      console.log("User Name:", this.lastname);
      console.log("User Email:", this.email);
      console.log("user contact", this.contactNo)
      console.log("status", this.userstatus)
      // Output other details as needed
      this.isChecked = this.userstatus === 'ACT';
      console.log(this.isChecked)

    } else {
      console.log("User not found with ID:", userId);
    }

    console.log("Filtered User:", filteredUser);
  }

  isChecked: boolean = false


  onCheckboxChange(event: any) {
    this.isChecked = event.target.checked;
    console.log("on click checked", this.isChecked)
  }



  updateProfile(Id: any) {

    if (!this.validateSurvey()) {
      this.utility.showError('Please fill all required fields.');
      return;
    }

    let status = this.isChecked ? "ACT" : "DEL";

    console.log(this.firstName);
    const dataToSend = {
      id: Id,
      firstName: this.firstName,
      lastname: this.lastname,
      contactNo: this.contactNo,
      createdDate: this.createdDate,
      email: this.email,
      role: this.role,
      status: status
    };

    this.surveyservice.updateProfile(dataToSend).subscribe({
      next: (resp: any) => {
        this.utility.showSuccess('Updated.');
        window.location.reload();
      },
      error: (err: any) => {
        this.utility.showError('error');
      }
    });

  }

  // checkbox
  selectAll: boolean = false;

  selectAllCheckboxes() {
    for (let item of this.UserData) {
      item.selected = this.selectAll;
    }
  }

  // filtering

  selectedCategory: string = 'All Roles';

  //validate

  firstNamerequired: boolean = true
  lastNamerequired: boolean = true
  phone: boolean = true
  roletype: boolean = true
  emailaddress: boolean = true
  phoneLengthError: boolean = true
  touched: boolean = false;

  validateSurvey(): boolean {
    this.firstNamerequired = !!this.firstName && this.firstName.trim().length > 0;
    this.lastNamerequired = !!this.lastname && this.lastname.trim().length > 0;
    this.phone = !!this.contactNo && this.contactNo.toString().trim().length > 0;
    this.phoneLengthError = !!this.contactNo && this.contactNo.toString().trim().length < 11;
    this.emailaddress = !!this.email && this.email.trim().length > 0;
    this.roletype = !!this.userroledata && this.userroledata.toString().trim().length > 0;
    this.touched = true;


    return (
      this.firstNamerequired &&
      this.lastNamerequired &&
      this.phone &&
      this.emailaddress &&
      this.roletype &&
      this.phoneLengthError
    );
  }


}
