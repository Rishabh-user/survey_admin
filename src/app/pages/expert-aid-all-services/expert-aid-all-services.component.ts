import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';
import { SurveyService } from 'src/app/service/survey.service';

@Component({
  selector: 'app-expert-aid-all-services',
  templateUrl: './expert-aid-all-services.component.html',
  styleUrls: ['./expert-aid-all-services.component.css']
})
export class ExpertAidAllServicesComponent {
  showTooltip: { [key: string]: boolean } = {};
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }

  UserData: any;
  baseUrl = '';
  constructor(public themeService: DataService, private cdr: ChangeDetectorRef, private utility: UtilsService, private surveyservice: SurveyService) {
    this.baseUrl = environment.baseURL;
  }
  files: File[] = [];
  role: any;
  id: number = 0;
  name: any;
  projectType: any;
  email: any;
  mobile: number;
  comments: any;
  roleId: number = 0;
  expertAidServices: any[];
  centerId: number = this.utility.getCenterId();


  roles: any[] = [
    { id: 1, name: 'SuperAdmin' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'User' }
  ];




  ngOnInit(): void {
    this.role = this.utility.getRole()
    console.log("Center Id :", this.centerId)
    this.getAllUser()
  }

  userId: any;


  getAllUser() {
    this.userId = this.utility.getUserId();
    this.themeService.getAllExpertAidList(this.userId).subscribe((data: any) => {
      this.UserData = data;
      console.log("Rishabh", data);
    });
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  }

  userName: any
  userprojectType: any
  contact: any
  userroledata: any
  createdDate: any;
  userstatus: any



  getUserDetails(userId: any): void {
    console.log("userId", userId)
    const filteredUser = this.UserData.find((user: any) => user.id === userId);
    if (filteredUser) {
      this.userName = filteredUser.name;
      this.userprojectType = filteredUser.projectType;
      this.email = filteredUser.email;
      this.contact = filteredUser.mobile;
      this.createdDate = filteredUser.startDate;
      this.userstatus = filteredUser.status;

      console.log("User Name:", this.userName);
      console.log("User Email:", this.email);
      console.log("Status:", this.userstatus);
    } else {
      console.log("User not found with ID:", userId);
    }
  }

  isChecked: boolean = false;


  updateStatus(id: any, status: any) {

    const filteredUser = this.UserData.find((user: any) => user.id === id);


    console.log("Id : ", id)
    console.log("status : ", status)

    const dataToSend = {
      id: filteredUser.id,
      centerId: filteredUser.centerId,
      status: status === 'ACT' ? 'ACT' : 'DEL'
    };
    console.log(filteredUser)

    this.surveyservice.updateExpertAidProfile(dataToSend).subscribe({
      next: (resp: any) => {
        this.utility.showSuccess('Updated.');
        window.location.reload();
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

}
