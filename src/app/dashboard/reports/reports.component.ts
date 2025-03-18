import { ChangeDetectorRef, Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SurveyService } from 'src/app/service/survey.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/service/utils.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

  showTooltip: { [key: string]: boolean } = {};
  userId: any;
  pageSize: number = 10;
  pageNumber: number = 1
  currentPage: number = 1;
  totalItemsCount: number = 10
  reportSurvey: any;
  surveyId: any;
  imageurl:any
  filteredSurveys: any = [];
  surveyControl = new FormControl();

  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }
  // Tooltip

  baseUrl = '';
  constructor(public themeService: SurveyService, private cdr: ChangeDetectorRef,private utils:UtilsService) {
    this.baseUrl = environment.baseURL;
    this.imageurl = environment.apiUrl

  }
  ngOnInit(): void {
    if(this.utils.getRoleId() === 4){
        this.getClientSurvey(this.pageNumber, this.pageSize)
    }else{
      this.getSurveyReportBySurvey(this.pageNumber, this.pageSize);
    }
    
  }

  getSurveyReportBySurvey(pageNumber: number, pageSize: number) {
    this.themeService.getSurveyReportBySurvey(pageNumber, pageSize).subscribe((data: any) => {

      this.reportSurvey = data.surveyType;
      this.totalItemsCount = data.totalCount;

      setTimeout(() => {
        this.surveyControl.valueChanges
          .pipe(
            debounceTime(300),
            distinctUntilChanged()
          )
          .subscribe((value: string) => {
            this.filterSurveys(value);
          });
      }, 500);

      this.cdr.detectChanges();
    });
  }

  getClientSurvey(pageNumber: number, pageSize: number) {
    this.themeService.getClientList(pageNumber, pageSize).subscribe((data: any) => {

      this.reportSurvey = data.surveyType;
      this.totalItemsCount = data.totalCount;

      this.cdr.detectChanges();
    });
  }

  onPageChange(pageNumber: number) {

    this.pageNumber = pageNumber;
    this.getSurveyReportBySurvey(this.pageNumber, this.pageSize)
    this.currentPage = this.pageNumber
  }

  onPageSizeChange() {
    this.currentPage = 1; // Reset to first page when page size changes
    this.getSurveyReportBySurvey(this.currentPage, this.pageSize);
  }

  jumpToPage() {
    if (this.currentPage > 0 && this.currentPage <= Math.ceil(this.totalItemsCount / this.pageSize)) {
      this.getSurveyReportBySurvey(this.currentPage, this.pageSize);
    }
  }
  refresh() {
    this.getSurveyReportBySurvey(this.pageSize, 1);
  }

  filterSurveys(value: string) {
    debugger
    console.log("value",value)
    if (!value || value.trim() == "") {
      this.getSurveyReportBySurvey(this.pageNumber, this.pageSize);
      return;
    }

    const surveyId = /^[0-9]*$/.test(value) ? parseInt(value) : null;
    
    this.themeService.getReportSearch(surveyId ? value : undefined, !surveyId ? value : undefined)
    .subscribe((data: any) => {
      console.log("data",data)
        this.reportSurvey = data.surveyType;
    });
    debugger
  }

  onSurveySelected(event: any) {
    const selectedSurveyName = event.option.value;
    const selectedSurvey = this.reportSurvey.find((survey: any) => survey.name === selectedSurveyName);
    console.log("reportSurvey filter",selectedSurvey)
    if (selectedSurvey) {
       const selectedSurvey = this.reportSurvey.find((survey: any) => survey.name === selectedSurveyName);
        this.reportSurvey = [selectedSurvey]; 
    }
    
  }
}
