import { ChangeDetectorRef, Component } from '@angular/core';
import { NgModule } from '@angular/core';

import { SurveyService } from 'src/app/service/survey.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  // Tooltip
  showTooltip: { [key: string]: boolean } = {};
  userId: any;
  pageSize: number = 10;
  pageNumber: number = 1
  currentPage: number = 1;
  totalItemsCount: number = 100
  reportSurvey: any;
  surveyId: any;
  
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
      this.showTooltip[identifier] = false;
  }
// Tooltip

  baseUrl = '';
  constructor(  public themeService: SurveyService,private cdr: ChangeDetectorRef,) {
    this.baseUrl = environment.baseURL;
  
  }
  ngOnInit(): void {
    this.getSurveyReportBySurvey(this.pageNumber, this.pageSize);
  }

  getSurveyReportBySurvey(pageNumber: number, pageSize: number) {
    this.themeService.getSurveyReportBySurvey(pageNumber, pageSize).subscribe((data: any) => {
      console.log("reports", data)
      this.reportSurvey = data.surveyType;
      this.totalItemsCount = data.totalCount;
      
      console.log("totalCount", this.totalItemsCount)
      console.log("reportSurvey", this.reportSurvey)
      console.log("surveyId", this.surveyId)
      this.cdr.detectChanges();
    });
  }
  
  onPageChange(event: any) {
    const pageNumber = event.page;
    this.currentPage = pageNumber;
    this.getSurveyReportBySurvey(this.currentPage, this.pageSize);
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
