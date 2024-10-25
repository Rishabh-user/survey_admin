import { ChangeDetectorRef, Component } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent {
  UserData: any;
  image: any;
  baseUrl = '';
  imageurl:any
  constructor(public themeService: DataService, private cdr: ChangeDetectorRef, private utility: UtilsService) {
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
    { id: 1, name: 'SuperAdmin' },
    { id: 2, name: 'Admin' },
    { id: 3, name: 'User' },
    { id: 4, name: 'Client' },
    { id: 5, name: 'Vendor' },
  ];

  ngOnInit(): void {
    this.role = this.utility.getRole()
    this.getAllUser()


    this.themeService.getSearchQuery().subscribe((searchQuery) => {

      this.applyFilter(searchQuery);
    });
  }

  filteredSurveyData: any[] = [];
  searchQuery: any
  applyFilter(searchQuery: string): void {

    if (!searchQuery) {
      this.filteredSurveyData = [];
    } else {
      this.filteredSurveyData = this.UserData.filter((item: { name: string; userName: string; email: string; }) =>
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.userName && item.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  }

  userId: any;


  getAllUser() {

    this.userId = localStorage.getItem("userId");
    this.themeService.GetAllUser(this.userId).subscribe((data: any) => {
      this.UserData = data;

      this.cdr.detectChanges();
    });
  }
  getRoleName(roleId: number): string {
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  }




  selectedCategory: string = 'All Roles';


  selectAll: boolean = false;

  selectAllCheckboxes() {
    for (let item of this.UserData) {
      item.selected = this.selectAll;
    }
  }

  


}
