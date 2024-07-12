import { Component, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SurveyService } from 'src/app/service/survey.service';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/service/crypto.service';
import { AuthService } from 'src/app/service/auth.service';
import { User } from 'src/app/models/user';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create-survey-popup',
  templateUrl: './create-survey-popup.component.html',
  styleUrls: ['./create-survey-popup.component.css']
})
export class CreateSurveyPopupComponent {

  @ViewChild('CreateSurveyModal', { static: true }) modal!: ModalDirective;
  baseUrl = '';
  planid:any

  categoryName: any = "";
  surveyName: any;
  categoryId: number;
  newsurveyId: number;
  selectedOption: any;
  isQNumberRequired: boolean = false
  searchControl = new FormControl();
  options: { id: number, name: string }[] = [];
  country: { id: string, name: string, images: string }[] = [];
  filteredOptions: Observable<{ id: number, name: string }[]> | undefined;
  selectedCategory: { id: number, name: string } | null = null;
  selectedCountry: { id: string, name: string, images: string } | null = null;
  selectedCountryId: string | null = null;


  userId = 0;
  surveyNameCheck: boolean = true
  countryNameCheck: boolean = true
  categoryNameCheck: boolean = true
  otherCategoryCheck: boolean = true
  isValidSurvey: boolean = false
  constructor(private surveyservice: SurveyService,
    private router: Router,
    private crypto: CryptoService,
    private auth: AuthService,
    private utility: UtilsService) {
    this.baseUrl = environment.baseURL;


  }

  ngOnInit() {
    this.planid = this.utility.getPlanId()
  }

  show() {
    this.modal.show();
    this.getNames();
    this.getCountries();
  }

  close() {
    this.modal.hide();
  }

  onCheckboxChange(event: any) {
    this.isQNumberRequired = event.target.checked;
    console.log("isQNumberRequired",this.isQNumberRequired)
  }

  getNames() {
    this.surveyservice.GetCategories().subscribe(response => {

      const result = Object.keys(response).map((key) => response[key]);

      const models: { id: number; name: string }[] = result.map((value: any) => ({
        id: value['id'],
        name: value['name']
      }));

      this.options = models;
    });
  }

  getCountries() {
    this.surveyservice.getCountries().subscribe(response => {

      const result = Object.keys(response).map((key) => response[key]);

      const countries: { id: string; name: string; images: string }[] = result.map((value: any) => ({
        id: value['countryId'],
        name: value['name'],
        images: value['images']

      }));

      this.country = countries;
    });

  }



  _filter(value: string): { id: number, name: string }[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.name.toLowerCase().includes(filterValue) || option.id.toString().includes(filterValue)
    );
  }

  filterOptions(e: MatAutocompleteSelectedEvent) {
    this.categoryId = e.option.value;
    this.selectedOption = e.option.viewValue;

  }
  validateSurvey() {
    this.surveyNameCheck = !!this.surveyName && this.surveyName.length >= 3;
    this.categoryNameCheck = !!this.categoryId && this.categoryId !== 0;
    this.otherCategoryCheck = this.categoryId !== 10 || (!!this.categoryName && this.categoryName.length >= 3);
    this.selectedCountryId = this.selectedCountry ? this.selectedCountry.id : null;
    this.countryNameCheck = !!this.selectedCountryId;

    this.isValidSurvey = this.surveyNameCheck && this.categoryNameCheck && this.otherCategoryCheck && this.countryNameCheck;
  }

  createSurvey() {

    this.validateSurvey()
    if (this.isValidSurvey) {
      const dataToSend = {
        name: this.surveyName,
        categoryId: this.categoryId,
        otherCategory: this.categoryName,
        countryId: this.selectedCountryId,
        isQNumberRequired: this.isQNumberRequired
      };


      this.surveyservice.createSurvey(dataToSend).subscribe(
        response => {
          if (this.removeQuotes(response) == 'AlreadyExits') {
            this.utility.showError("This Survey Already Created")
            return
          }
          const result = this.convertStringToNumber(this.removeQuotes(response));

          if (result !== null) {
            this.newsurveyId = result
            const encryptedId = this.crypto.encryptParam(`${this.newsurveyId}`);
            const url = `/survey/manage-survey/${encryptedId}`;
            this.modal.hide();
            this.router.navigateByUrl(url);
            if (this.router.url.includes('/manage-survey')) {
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }
          }
        },
        error => {
          console.error('Error occurred while sending POST request:', error);
          this.utility.showError(error);
        }
      );
    }
  }
  convertStringToNumber(str: string): number | null {
    const converted = +str;
    return isNaN(converted) ? null : converted;
  }
  removeQuotes(str: string): string {
    return str.replace(/"/g, '');
  }
}
