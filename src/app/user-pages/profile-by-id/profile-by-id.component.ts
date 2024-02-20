import { Component, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-by-id',
  templateUrl: './profile-by-id.component.html',
  styleUrls: ['./profile-by-id.component.css']
})
export class ProfileByIdComponent {
  UserData: any;
  image: any;
  baseUrl = '';
  constructor(public themeService: DataService, private cdr: ChangeDetectorRef, private utility: UtilsService) {
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

  ngOnInit(): void {
    this.role = this.utility.getRole()
    this.getAllUser()
  }

  userId: any;


  getAllUser() {
    this.userId = localStorage.getItem("userId");


    this.userId = localStorage.getItem("userId");
    this.themeService.GetAllUserProfileById(this.userId, this.centerId).subscribe((data: any) => {
      this.UserData = data;
      console.log("data", data)

      this.cdr.detectChanges();
    });
  }
  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  }

}
