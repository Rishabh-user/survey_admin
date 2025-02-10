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
  imageurl:any

  constructor(public themeService: DataService, private cdr: ChangeDetectorRef, private utility: UtilsService, private modalService: NgbModal, private surveyservice: SurveyService,) {
    this.baseUrl = environment.baseURL;
    this.imageurl = environment.apiUrl
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
    { id: 1, name: 'SuperAdmin'},
    { id: 2, name: 'Admin' },
    { id: 3, name: 'User' },
    { id: 4, name: 'Client' },
    { id: 5, name: 'Vendor' }
  ];

  

  userroles: string[] = ['SuperAdmin', 'Admin', 'User'];

  isSuperAdmin = false;
  isAdmin = false;
  isUser = false;
  isClient = false;

  ngOnInit(): void {
    this.role = this.utility.getRole()
    this.getAllUser()
    this.userstring()

    this.roleId = this.utility.getRoleId()
    if (this.role) {
      this.role = this.role.toLowerCase();
    }

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
  userroledata: any
  usercreateddate: any
  userstatus: any;
  filteruserroleid:any

  getUserDetails(userId: any): void {
    
    
    const filteredUser = this.UserData.find((user: any) => user.id === userId);
    
    if (filteredUser) {
      this.firstName = filteredUser.firstName
      this.lastname = filteredUser.lastName
      this.email = filteredUser.email;
      this.contactNo = filteredUser.contactNo;
      this.userroledata = filteredUser.role;
      this.filteruserroleid = filteredUser.roleId
      this.usercreateddate = filteredUser.createdDate;
      this.id = userId;
      this.userstatus = filteredUser.status


      this.isChecked = this.userstatus === 'ACT';

      console.log("userroledata",this.filteruserroleid)


    } else {

    
    }


  }

  isChecked: boolean = false


  onCheckboxChange(event: any) {
    this.isChecked = event.target.checked;
  }

  userrole(event: any){
    this.userroledata = event.target.value
  }


  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }


  updateProfile(Id: any) {

    if (!this.validateSurvey()) {
      this.utility.showError('Please fill all required fields.');
      return;
    }

    let status = this.isChecked ? "ACT" : "DEL";
   
    const dataToSend = {
      id: Id,
      image: "",
      firstName: this.firstName,
      lastName: this.lastname,
      createdDate: this.createdDate,
      modifiedDate: this.getCurrentDateTime(),
      status: status,
      password: "",
      contactNo: this.contactNo,
      email: this.email,
      roleId: 0,
      role: this.userroledata,
      centerId: 0,
      orgCreatedDate: this.getCurrentDateTime(),
      isPaid: true,
      address: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      phone: "",
      gstNumber: "",
      plan: [
        {
          id: 0,
          planId: 0,
          organizationId: 0,
          paidAmount: 0,
          pendingAmount: 0,
          totalAmount: 0,
          startDate: this.getCurrentDateTime(),
          endDate: this.getCurrentDateTime(),
          status: "",
          orderId: ""
        }
      ],
      surveyList: [
        {
          vendarSurveyId: 0
        }
      ]
    }


    // const dataToSend = {
    //   id: Id,
    //   firstName: this.firstName,
    //   lastname: this.lastname,
    //   contactNo: this.contactNo,
    //   createdDate: this.createdDate,
    //   email: this.email,
    //   role: this.userroledata,
    //   status: status
    // };
    console.log("datatoosend",dataToSend)

    this.surveyservice.updateProfile(dataToSend).subscribe({
      next: (resp: any) => {
        this.utility.showSuccess('Updated.');
        // window.location.reload();
      },
      error: (err: any) => {
        this.utility.showError('error');
      }
    });

  }


  selectAll: boolean = false;

  selectAllCheckboxes() {
    for (let item of this.UserData) {
      item.selected = this.selectAll;
    }
  }



  selectedCategory: string = 'All Roles';


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

  userstring(){
    
    for (const name of this.roles){
      console.log("ishu",name.id)
      console.log("ishu",typeof(name.name))
    }
  }

 

  // userstring(){
    
  //   for (const role of this.roles) {
  //     console.log(`ID: ${role.id}, Name: ${role.name}`);
  // }
  // }


}
