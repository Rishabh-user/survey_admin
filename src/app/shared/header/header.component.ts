import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { SurveyService } from 'src/app/service/survey.service';
import { UtilsService } from 'src/app/service/utils.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { EncryptPipe } from 'src/app/pipes/encrypt.pipe';
import { CryptoService } from 'src/app/service/crypto.service';
import { Router, NavigationStart } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showNotification: boolean = false;
  baseUrl: any;
  toggleNotification() {
    this.showNotification = !this.showNotification;
  }

  surveyData: any = [];
  filteredSurveys: any = [];
  surveyControl = new FormControl();
  @ViewChild('popupTemplate') popupTemplate: TemplateRef<any>;
  modalRef: NgbModalRef;
  public constructor(private modalService: NgbModal, public themeService: DataService, private auth: AuthService, private util: UtilsService, public surveyService: SurveyService, private crypto: CryptoService, private router: Router) {
    this.baseUrl = environment.baseURL;

  }
  ngOnInit(): void {
    this.getNotification()
    this.getMyAccount()
    this.getAllSurveyList()
    this.surveyControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        this.filterSurveys(value);
      });

  }
  openPopup() {
    this.modalService.open(this.popupTemplate, { centered: true, backdrop: 'static' });
  }
  logOut() {
    this.auth.logout();
    this.modalService.dismissAll();
    this.router.navigate(['/login']);
  }
  userId: any;
  image: any;
  firstName: any;
  lastName: any;

  getMyAccount() {

    this.userId = this.util.getUserId();
    if (this.userId) {
      this.themeService.GetMyAccount(this.userId).subscribe((data: any) => {

        this.image = data.image
        this.firstName = data.firstName
        this.lastName = data.lastName
      })
    }
  }
  getAllSurveyList() {
    this.userId = this.util.getUserId();
    if (this.userId) {
      this.surveyService.GetSurveyList().subscribe((data: any) => {
        if (data) {
          this.surveyData = data.surveyType;
        }
      });
    }
  }
  filterSurveys(value: string) {
    if (!value) {
      this.filteredSurveys = this.surveyData;
      return;
    }
    value = value.toLowerCase();
    this.filteredSurveys = this.surveyData.filter((survey: any) =>
      survey.name.toLowerCase().includes(value)
    );
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
  encryptId(id: number): string {
    const encryptPipe = new EncryptPipe(this.crypto);
    return encryptPipe.transform(id);
  }

  surveyControlform = new FormControl();
  SurveyData: any[] = [];

  search(searchQuery: string): void {
    this.themeService.setSearchQuery(searchQuery);
    this.surveyService.getSurveySearch({ surveyname: searchQuery }).subscribe((response) => {
      // Assuming response contains the survey data
      this.SurveyData = response.filter((item: { name: string; userName: string; email: string; }) => {
        return (
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    });
  }



  notificationdata: any;
  notificationcount: number


  getNotification() {
    this.userId = this.util.getUserId();
    if (this.userId) {
      this.surveyService.getNotification().subscribe({
        next: (resp: any) => {
          this.notificationdata = resp;

          let count = 0;
          this.notificationdata.forEach((entry: { status: string; }) => {
            if (entry.status === 'ACT') {
              count++;
            }
          });
          this.notificationcount = count;
        },
        error: (error) => {
          console.error("An error occurred while fetching notifications:", error);
          if (error.status === 402 && error.error?.message === 'payment-required') {
            this.openPopup();
          } else {
            console.error("Error fetching user account:", error);
          }
        }
      });
    }
  }


}
