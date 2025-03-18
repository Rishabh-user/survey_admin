import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/service/data.service';
import { SurveyService } from 'src/app/service/survey.service';
import { FormControl } from '@angular/forms';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';
import { EncryptPipe } from 'src/app/pipes/encrypt.pipe';
import { CryptoService } from 'src/app/service/crypto.service';


@Component({
  selector: 'app-survey-listing',
  templateUrl: './survey-listing.component.html',
  styleUrls: ['./survey-listing.component.css']
})
export class SurveyListingComponent {
  filteredSurveys: any = [];
  surveyData: any = "";
  categoryList: any;
  selectedCategory: string = 'All Categories';
  imageurl:any;
  surveyControl = new FormControl();

  showTooltip: { [key: string]: boolean } = {};
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }

  constructor(private visibilityService: DataService, private util: UtilsService, private modalService: NgbModal, public themeService: SurveyService, private utility: UtilsService,private router: Router, private crypto: CryptoService,private cdr: ChangeDetectorRef) {
    this.baseUrl = environment.baseURL;
    this.imageurl = environment.apiUrl
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
  ngOnInit(): void {

    this.visibilityService.closeSideBar();
    this.visibilityService.isSidebarVisibleSubject.next(false);

    this.role = this.util.getRole();
    this.role = this.role.toLowerCase()

    if (this.role == 'admin' || this.role == 'superadmin') {
      this.isadminsuperadmin = true;
    }
    this.getAllSurveyList(this.pageNumber, this.pageSize)
    this.getNames()

    this.visibilityService.getSearchQuery().subscribe((searchQuery) => {

      this.applyFilter(searchQuery);
    });
    this.surveyControl.valueChanges
          .pipe(
            debounceTime(300),
            distinctUntilChanged()
          )
          .subscribe((value: string) => {
            this.filterSurveys(value);
      });
  }

  filteredSurveyData: any[] = [];
  searchQuery: any
  applyFilter(searchQuery: string): void {

    if (!searchQuery) {
      this.filteredSurveyData = [];
    } else {
      this.filteredSurveyData = this.surveyData.filter((item: { name: string; userName: string; email: string; }) =>
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.userName && item.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  }

  getAllSurveyList(pageNumber: number, pageSize: number) {
    this.themeService.getSurveyListWithPage(pageNumber, pageSize).subscribe((data: any) => {
      this.surveyData = data.surveyType;
      this.totalItemsCount = data.totalCount;

      this.cdr.detectChanges();
    });
  }
  models: { id: number, name: string }[] = [];

  // Add this method in your component
  getCountryImageArray(countryImage: string): string[] {
    if (!countryImage) return []; // Handle empty or null cases
    return countryImage.split(',').map(flag => flag.trim());
  }


  getNames() {
    this.themeService.GetCategories().subscribe((data: any) => {

      this.categoryList = data
    });
  }
  toggleSlider(event: Event, itemId: number, item: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const selectedStatus = (event.target as HTMLSelectElement).value;
    const originalStatus = item.status;
    if (this.role === 'admin' || this.role === 'superadmin') {
      let surveyStatus = isChecked ? 'ACT' : 'DEL';

      const dataToSend = {
        surveyId: itemId,
        surveyStatus: originalStatus
      };

      this.themeService.updateSurveyStatus(dataToSend).subscribe(
        response => {
          this.utility.showSuccess('Updated.');

        },
        error => {
          console.error('Error occurred while sending POST request:', error);
          this.utility.showError('error');
          item.status = originalStatus;
        }
      );
    } else {

      this.utility.showError('You have no permissions');
      if (item.status !== originalStatus) {
        item.status = originalStatus;
      }
    }
  }
  onPageChange(pageNumber: number) {

    this.pageNumber = pageNumber;
    this.getAllSurveyList(this.pageNumber, this.pageSize)
    this.currentPage = this.pageNumber
  }
  jumpToPage() {
    if (this.currentPage > 0 && this.currentPage <= Math.ceil(this.totalItemsCount / this.pageSize)) {
      this.onPageChange(this.currentPage);
    }
  }
  onPageSizeChange() {
    this.onPageChange(this.pageNumber)
  }


  itemId: 5;

  opensidecontent() {
    const modalRef = this.modalService.open(this.opensidecontent, { /* modal options */ });
  }

  deletesurveyname: any
  openLg(sidecontent: any, itemId: any, name: any) {
    this.itemId = itemId;
    this.deletesurveyname = name

    this.modalService.open(sidecontent, { centered: true });
  }


  deleteSurvey(itemId: any) {
    this.userId = this.utility.getUserId();

    this.themeService.deleteSurvey(itemId).subscribe({
      next: (resp: any) => {
        this.utility.showSuccess('Question Deleted Sucessfully');
        window.location.reload()
      },
      error: (err: any) => {
      }
    });
  }

  cloneSurvey(surveyid:any){
    this.themeService.cloneSurvey(surveyid).subscribe({
      next: (resp:any) => {
        this.utility.showSuccess("Survey Cloned Successfully");
        window.location.reload()
      },
      error: (err:any) =>{
        this.utility.showError("Failed to clone survey");
      }
    })

  }


  onSurveySelected(event: any) {
    const selectedSurveyName = event.option.value;
    const selectedSurvey = this.surveyData.find((survey: any) => survey.name === selectedSurveyName);

    if (selectedSurvey) {
      for (const key in selectedSurvey) {
        if (Object.prototype.hasOwnProperty.call(selectedSurvey, key)) {
        }
      }
      const encryptedId = this.encryptId(selectedSurvey.surveyId);
      this.router.navigate(['/survey/manage-survey/', encryptedId]);
    }
  }

  filterSurveys(value: string) {
    debugger
    console.log("value",value)
    if (!value || value == '') {
      this.getAllSurveyList(this.pageNumber, this.pageSize)
      return;
    }
    debugger
    this.themeService.getSurveyNameSearch(value).subscribe((data:any) => {
      console.log(data)
      this.surveyData =data
   
    })
  
  }

  encryptId(id: number): string {
      const encryptPipe = new EncryptPipe(this.crypto);
      return encryptPipe.transform(id);
    }



}
