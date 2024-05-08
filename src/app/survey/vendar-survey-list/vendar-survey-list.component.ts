import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/service/data.service';
import { SurveyService } from 'src/app/service/survey.service';
import { FormControl } from '@angular/forms';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendar-survey-list',
  templateUrl: './vendar-survey-list.component.html',
  styleUrls: ['./vendar-survey-list.component.css']
})
export class VendarSurveyListComponent {

  showTooltip: { [key: string]: boolean } = {};
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }
  //ToolTip
  surveyData: any = "";
  categoryList: any;
  selectedCategory: string = 'All Categories';
  constructor(private visibilityService: DataService, private util: UtilsService, private modalService: NgbModal, public themeService: SurveyService, private utility: UtilsService, private cdr: ChangeDetectorRef) {
    this.baseUrl = environment.baseURL;
    visibilityService.closeSideBar();
  }
  files: File[] = [];
  role: any;
  id: number = 0;
  name: any;
  status: any;
  categoryId: any;
  categoryName: any;
  userId: any;
  userName: any;
  image: any;
  isadminsuperadmin: boolean = false
  isActive: boolean = false;
  pageSize: number = 10;
  pageNumber: number = 1
  totalItemsCount: number = 20
  currentPage: number = 1;
  baseUrl = '';
  vendor: any;
  ngOnInit(): void {
    //debugger;
    this.visibilityService.closeSideBar();
    this.visibilityService.isSidebarVisibleSubject.next(false);

    this.role = this.util.getRole();
    console.log("role", this.role)
    this.role = this.role.toLowerCase()

    if (this.role == 'admin' || this.role == 'superadmin') {
      this.isadminsuperadmin = true;
    }
    this.getVendarSurveyList(this.pageNumber, this.pageSize)
    this.getNames()

    this.visibilityService.getSearchQuery().subscribe((searchQuery) => {
      // Use the search query to filter the list
      this.applyFilter(searchQuery);
      console.log("applyfilter", searchQuery)
    });
  }
  // surveyData: any[] = []; 
  filteredSurveyData: any[] = [];
  searchQuery: any
  applyFilter(searchQuery: string): void {
    console.log('Search query:', searchQuery);

    if (!searchQuery) {
      // If searchQuery is undefined or empty, display the entire list
      this.filteredSurveyData = [];
    } else {
      // Filter the list based on the search query
      this.filteredSurveyData = this.surveyData.filter((item: { name: string; userName: string; email: string; }) =>
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.userName && item.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      console.log("filterdata", this.filteredSurveyData)
    }
  }


  getVendarSurveyList(pageNumber: number, pageSize: number) {
    this.themeService.getVendarSurveyList(pageNumber, pageSize).subscribe((data: any) => {
      this.surveyData = data.surveyType;
      this.totalItemsCount = data.totalCount;
      console.log("totalCount", this.totalItemsCount)
      // alert(this.totalItemsCount);
      this.cdr.detectChanges();
    });
  }
  models: { id: number, name: string }[] = []; // Assuming 'id' is a number

  getNames() {
    this.themeService.GetCategories().subscribe((data: any) => {
      console.log("categoryList", data)
      this.categoryList = data
    });
  }
  toggleSlider(event: Event, itemId: number, item: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const selectedStatus = (event.target as HTMLSelectElement).value;
    const originalStatus = item.status;
    console.log("Selected status:", selectedStatus);
    console.log("show status", originalStatus)
    if (this.role === 'admin' || this.role === 'superadmin') {
      let surveyStatus = isChecked ? 'ACT' : 'DEL';

      const dataToSend = {
        surveyId: itemId,
        surveyStatus: originalStatus
      };
      console.log("dataToSend", dataToSend)
      this.themeService.updateSurveyStatus(dataToSend).subscribe(
        response => {
          this.utility.showSuccess('Updated.');
          console.log('Response from server:', response);
        },
        error => {
          console.error('Error occurred while sending POST request:', error);
          // Swal.fire('', error, 'error');
          this.utility.showError('error');
          item.status = originalStatus;
        }
      );
    } else {
      // User doesn't have sufficient permissions
      console.log('Insufficient permissions to toggle');
      // Swal.fire('', 'You have no permissions', 'error');
      this.utility.showError('You have no permissions');
      if (item.status !== originalStatus) {
        item.status = originalStatus;
      }
      // Additional action or feedback for insufficient permissions
    }
  }
  onPageChange(pageNumber: number) {
    console.log(pageNumber);
    // Handle page change event
    this.pageNumber = pageNumber;
    this.getVendarSurveyList(this.pageNumber, this.pageSize)
    this.currentPage = this.pageNumber
    // You can also fetch data for the selected page here based on the pageNumber
  }
  jumpToPage() {
    // Add any necessary validation logic before emitting the pageChange event
    if (this.currentPage > 0 && this.currentPage <= Math.ceil(this.totalItemsCount / this.pageSize)) {
      this.onPageChange(this.currentPage);
    }
  }
  onPageSizeChange() {
    this.onPageChange(this.pageNumber)
  }

  //delete
  // openLg(content: any) {
  //   this.modalService.open(content, { size: 'lg', centered: true });
  // }


  itemId: 5;

  opensidecontent() {
    const modalRef = this.modalService.open(this.opensidecontent, { /* modal options */ });
  }

  // Function to open modal and set itemId
  deletesurveyname: any
  openLg(sidecontent: any, itemId: any, name: any) {
    this.itemId = itemId;
    console.log("itemid", this.itemId)
    console.log("survey name", name);
    this.deletesurveyname = name
    console.log("qwertyu", this.deletesurveyname)

    this.modalService.open(sidecontent, { centered: true });
  }

  // Function to delete survey
  deleteSurvey(itemId: any) {
    this.userId = this.utility.getUserId();

    this.themeService.deleteSurvey(itemId).subscribe({
      next: (resp: any) => {
        console.log("response", resp);
        this.utility.showSuccess('Question Deleted Sucessfully');
        window.location.reload()
      },
      error: (err: any) => {
      }
    });
  }
}
