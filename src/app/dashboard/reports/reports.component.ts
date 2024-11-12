import { ChangeDetectorRef, Component } from '@angular/core';
import { NgModule } from '@angular/core';

import { SurveyService } from 'src/app/service/survey.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/service/utils.service';

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
}
