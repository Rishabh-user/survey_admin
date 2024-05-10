import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-expert-aid-list',
  templateUrl: './expert-aid-list.component.html',
  styleUrls: ['./expert-aid-list.component.css']
})
export class ExpertAidListComponent {
  showTooltip: { [key: string]: boolean } = {};
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }

  UserData: any;
  baseUrl = '';
  constructor(public themeService: DataService, private cdr: ChangeDetectorRef, private utility: UtilsService) {
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
    this.getAllUser()
  }

  userId: any;


  getAllUser() {
    this.userId = localStorage.getItem("userId");
    this.themeService.getExpertAidById(this.centerId).subscribe((data: any) => {
      this.UserData = data;
      console.log("Rishabh", data);
    });
  }

  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  }

  selectAll: boolean = false;

  selectAllCheckboxes() {
    for (let item of this.UserData) {
      item.selected = this.selectAll;
    }
  }



}
