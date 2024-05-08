import { ChangeDetectorRef, Component } from '@angular/core';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/service/data.service';
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
  totalItemsCount: number = 20
  resportSurvey: any;
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
      this.showTooltip[identifier] = false;
  }
// Tooltip

  baseUrl = '';
  constructor( public themeService: SurveyService, private cdr: ChangeDetectorRef) {
    this.baseUrl = environment.baseURL;
  }
  ngOnInit(): void {
    this.getSurveyReportBySurvey(this.pageNumber, this.pageSize);
  }
  getSurveyReportBySurvey(pageNumber: number, pageSize: number) {
    this.themeService.getSurveyReportBySurvey(pageNumber, pageSize).subscribe((data: any) => {
      console.log("reports", data)
      this.resportSurvey = data.surveyType;
      this.resportSurvey = data.surveyType;
      this.totalItemsCount = data.totalCount;
      console.log("totalCount", this.totalItemsCount)
      console.log("resportSurvey", this.resportSurvey)
      this.cdr.detectChanges();
    });
  }
  
  onPageChange(pageNumber: number) {
    console.log(pageNumber);
    // Handle page change event
    this.pageNumber = pageNumber;
    this.getSurveyReportBySurvey(this.pageNumber, this.pageSize)
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

}
