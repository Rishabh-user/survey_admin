import { Component, OnInit, Renderer2, ElementRef, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DataService } from 'src/app/service/data.service'; // Import your DataService
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SurveyService } from 'src/app/service/survey.service';
import { responseDTO } from 'src/app/types/responseDTO';
import { CryptoService } from 'src/app/service/crypto.service';
import { UtilsService } from 'src/app/service/utils.service';
import { isArray } from 'chart.js/dist/helpers/helpers.core';
import { GenderPopupComponent } from '../popups/gender-popup/gender-popup.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { QuestionLogic } from 'src/app/models/question-logic';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { SecLsmPopupComponent } from '../popups/sec-lsm-popup/sec-lsm-popup.component';
import { Question } from 'src/app/models/question';
import { QuestionItem } from 'src/app/models/question-items';
import { environment } from 'src/environments/environment';

interface LogicQuestion {
  id: number;
  term: string;
  item: string;
  sort: number;
}

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css'],
})
export class CreateSurveyComponent implements OnInit, AfterViewInit {
  @ViewChild('logicSection') logicSection: ElementRef;
  @ViewChild('GenderModal', { static: true }) genderModal!: GenderPopupComponent;
  @ViewChild('AgeModal', { static: true }) ageModal!: ModalDirective;
  @ViewChild('NccsModal', { static: true }) nccsModal!: ModalDirective;
  @ViewChild('MonthlyIncomeModal', { static: true }) monthlyincomeModal!: ModalDirective;
  @ViewChild('HouseholdModal', { static: true }) householdModal!: ModalDirective;
  @ViewChild('FamilyMemberModal', { static: true }) familymenberModal!: ModalDirective;
  @ViewChild('NumberOfChildModal', { static: true }) numberofchildModal!: ModalDirective;
  @ViewChild('WorkingStatusModal', { static: true }) workingstatusModal!: ModalDirective;
  @ViewChild('CityModal', { static: true }) cityModal!: ModalDirective;
  @ViewChild('AgeOfChildrenModal', { static: true }) ageofchildrenModal!: ModalDirective;
  @ViewChild('OldSecModal', { static: true }) oldsecModal!: ModalDirective;
  @ViewChild('IndustryModal', { static: true }) industryModal!: ModalDirective;
  @ViewChild('NewFLsmModal', { static: true }) newflsmModal!: ModalDirective;
  @ViewChild('MSlmModal', { static: true }) mslmModal!: ModalDirective;
  @ViewChild('SLsmModal', { static: true }) slsmModal!: ModalDirective;
  @ViewChild('LanguageModal', { static: true }) languageModal!: ModalDirective;
  @ViewChild('GeoLocationModal', { static: true }) geolocationModal!: ModalDirective;
  @ViewChild('MartialStatusModal', { static: true }) martialStatusModal!: ModalDirective;
  @ViewChild('IndustryRespondantModal', { static: true }) industryrespondantModal!: ModalDirective;
  @ViewChild('IndustryHouseholdModal', { static: true }) industryhouseholdModal!: ModalDirective;
  @ViewChild('LocalityModal', { static: true }) localityModal!: ModalDirective;
  @ViewChild('ForeignCountryTravelledModal', { static: true }) foreigncountrytravelledModal!: ModalDirective;
  @ViewChild('LanguageYouKnowModel', { static: true }) languageyouknowModal!: ModalDirective;
  @ViewChild('HomeAreaTypeModal', { static: true }) homeareatypeModal!: ModalDirective;
  @ViewChild('KidsCountModal', { static: true }) kidscountModal!: ModalDirective;
  @ViewChild('OldFLsmModal', { static: true }) oldflsmModal!: ModalDirective;
  @ViewChild('SecBnSlNpl', { static: true }) secbnslnplModal!: ModalDirective;
  @ViewChild('StoreModal', { static: true }) storeModal!: ModalDirective;
  @ViewChild('SelfieModal', { static: true }) selfieModal!: ModalDirective;
  @ViewChild('AccomodationTypeModal', { static: true }) accomodationtypeModal!: ModalDirective;
  @ViewChild('HomeAccessoriesModal', { static: true }) homeaccessoriesModal!: ModalDirective;
  @ViewChild('NameModal', { static: true }) nameModal!: ModalDirective;
  @ViewChild('EmailAddressModal', { static: true }) emailaddressModal!: ModalDirective;
  @ViewChild('PinCodeModal', { static: true }) pincodeModal!: ModalDirective;
  @ViewChild('AudioGenderDetectionModal', { static: true }) audiogenderdetectionModal!: ModalDirective;
  @ViewChild('StateModal', { static: true }) stateModal!: ModalDirective;
  @ViewChild('selectElement') selectElement!: MatSelect;
  @ViewChild('FlsmModal', { static: true }) flsmModal!: ModalDirective;
  @ViewChild('ifIdSelect') ifIdSelect: ElementRef;
  @ViewChild('ifExpectedSelect') ifExpectedSelect: ElementRef;
  @ViewChild('thanIdSelect') thanIdSelect: ElementRef;
  @ViewChild('thanExpectedSelect') thanExpectedSelect: ElementRef;
  @ViewChild('SecLsmModal', { static: true }) secLsmModal!: ModalDirective;
  @ViewChild('OccupationModal', { static: true }) occupationModal!: ModalDirective;


  @Output() onSaveEvent = new EventEmitter();
  isActive: boolean = false;
  isActivescreen: boolean = false;
  isActivesec: boolean = false
  role: string;
  userId: number;
  name: string;
  type: string[] = [];
  subType: string[] = [];
  readSurveyName: any
  readCategoryId: any
  readCategoryName: any
  categoryList: any;
  names: { name: string, image: string }[] = [];
  questions: any;
  selectedQuestionType: any;
  selectedQuestionTypeName: any;
  categoryId: number;
  selectedOption: any;
  isLogicShow: boolean = false
  logicValuesList: any
  logicThensList: any
  logicQuestionList: LogicQuestion[] = [];
  selectedValue: any;
  defaultSelectedValue: any = null;
  questionLogic: QuestionLogic = new QuestionLogic();
  questionCalculation: QuestionLogic = new QuestionLogic();
  pageSize: number = 10;
  pageNumber: number = 1
  countryId: any
  // selectedCountry: string = "IN";
  selectedCountry: { id: string, name: string, images: string } | null = null;
  selectedCountryId: string | null = null;
  country: { id: string, name: string, images: string }[] = [];
  logicEntriesPerQuestion: any[] = [];
  currentPage: number = 1
  files: File[] = [];
  filesImage: any;
  baseUrl = '';
  isRadomizeAndOr: boolean = false
  randormizeEntries: any[] = [];
  questionId: any
  constructor(
    private visibilityService: DataService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private renderer: Renderer2,
    private el: ElementRef,
    public themeService: DataService,
    private surveyservice: SurveyService,
    private crypto: CryptoService,
    private utils: UtilsService
  ) {
    this.baseUrl = environment.baseURL;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const shouldTriggerToggle = this.route.snapshot.data['triggerToggle'];
        if (shouldTriggerToggle) {
          // Trigger the toggle action when the user lands on this page
          this.dataService.toggle();
        }
      }
    });

    this.route.paramMap.subscribe(params => {
      let _surveyId = params.get('param1');
      if (_surveyId) {
        this.reloadIfAlreadyOnManageSurvey(_surveyId);
        console.log("_surveyId : ", this.crypto.decryptQueryParam(_surveyId))
        this.surveyId = parseInt(this.crypto.decryptQueryParam(_surveyId));
      }
    });


  }

  toggleClass: boolean = false;

  toggle() {
    this.toggleClass = !this.toggleClass;
  }

  hideBreadcrumb() {
    this.visibilityService.toggleBreadcrumbVisibility(false);
  }

  ShowBreadcrumb() {
    this.visibilityService.toggleBreadcrumbVisibility(true);
  }

  surveyId = 0;

  ngOnInit() {
    console.log('ngOnInit called');
    this.visibilityService.closeSideBar();
    this.userId = this.utils.getUserId();

    this.getCategoryNames();
    this.hideBreadcrumb();
    this.getCountries();
    this.getQuestion();
    this.GetSurveyDetails(this.pageSize, this.pageNumber)
    this.getLogicValues();
    this.getLogicThens();
    this.getLogicQuestionList(0)
    this.defaultSelectedValue = null;

    //this.defaultRandomValueEnter();
    this.getAgeOptionsLogicValues();
    this.getRandomization()

    //this.getSurveyLooping();
  }
  ngAfterViewInit() {
    // Set the default value after the view initialization
    this.selectElement.value = null; // Set the default value to null or any desired default value
  }
  onGenericQuestionClick(type: any): void {
    if (type === "Gender") {
      this.genderModal.show(this.surveyId);
    } else if (type === "Age") {
      this.ageModal.show();
    } else if (type === "NCCS") {
      this.nccsModal.show();
    } else if (type === "Monthly Income") {
      this.monthlyincomeModal.show();
    } else if (type === "Household Income") {
      this.householdModal.show();
    } else if (type === "Family Member") {
      this.familymenberModal.show();
    } else if (type === "No. of Child") {
      this.numberofchildModal.show();
    } else if (type === "Working Status") {
      this.workingstatusModal.show();
    } else if (type === "City") {
      this.cityModal.show();
    } else if (type === "Age of Childern") {
      this.ageofchildrenModal.show();
    } else if (type === "Old SEC") {
      this.oldsecModal.show();
    } else if (type === "Industry") {
      this.industryModal.show();
    } else if (type === "New F-LSM") {
      this.newflsmModal.show();
    } else if (type === "M-SLM") {
      this.mslmModal.show();
    } else if (type === "S-SLM") {
      this.slsmModal.show();
    } else if (type === "Language") {
      this.languageModal.show();
    } else if (type === "Geo Location") {
      this.geolocationModal.show();
    } else if (type === "Marital Status New") {
      this.martialStatusModal.show();
    } else if (type === "Industry Respondant") {
      this.industryrespondantModal.show();
    } else if (type === "Industry Household") {
      this.industryhouseholdModal.show();
    } else if (type === "Locality") {
      this.localityModal.show();
    } else if (type === "Foreign Country Travelled") {
      this.foreigncountrytravelledModal.show();
    } else if (type === "Language You Know") {
      this.languageyouknowModal.show();
    } else if (type === "Home Area Type") {
      this.homeareatypeModal.show();
    } else if (type === "Kids + Count") {
      this.kidscountModal.show();
    } else if (type === "Old F-LSM") {
      this.oldflsmModal.show();
    } else if (type === "Sec (BN/SL/NPL)") {
      this.secbnslnplModal.show();
    } else if (type === "Store") {
      this.storeModal.show();
    } else if (type === "Selfie") {
      this.selfieModal.show();
    } else if (type === "Accomodation Type") {
      this.accomodationtypeModal.show();
    } else if (type === "Home Accessories") {
      this.homeaccessoriesModal.show();
    } else if (type === "Name") {
      this.nameModal.show();
    } else if (type === "Email Address") {
      this.emailaddressModal.show();
    } else if (type === "Pincode / Zip Code") {
      this.pincodeModal.show();
    } else if (type === "Audio Gender Detection") {
      this.audiogenderdetectionModal.show();
    } else if (type === "State") {
      this.stateModal.show();
    } else if (type === "FLSM") {
      this.flsmModal.show();
    } else if (type === "SECLSM") {
      this.secLsmModal.show();
      this.isActivesec = !this.isActivesec;
    } else if (type === "Occupation") {
      this.occupationModal.show();
    }

  }



  openFullscreen(content: any) {
    this.modalService.open(content, { fullscreen: true, windowClass: 'right-aligned-modal' });
  }

  open(Editsurvey: any) {
    this.modalService.open(Editsurvey, { size: 'lg', centered: true });
  }

  items = [
    'Item 1',
    'Item 2',
    'Item 3',
    // Add more items as needed
  ];

  // cloneLi() {
  //   const liToClone = this.el.nativeElement.querySelector('li.cdkDrag');

  //   if (liToClone) {
  //     const clonedLi = liToClone.cloneNode(true);
  //     this.renderer.appendChild(liToClone.parentElement, clonedLi);
  //   }
  // }

  onItemDrop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  onDragStarted(): void {
    // You can add code here if needed
  }

  searchControl = new FormControl();
  // options: string[] = ['Automotive', 'Beverages - Alcholic',
  //   'Beverages - Alcholic',
  //   'Cosmetic, Personal Care, Toiletries', 'Education', 'Electronics', 'Entertaiment', 'Fashion, Clothing'];
  options: { id: number, name: string }[] = [];
  filteredOptions: Observable<string[]> | undefined;


  _filter(value: string): { id: number, name: string }[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.name.toLowerCase().includes(filterValue) || option.id.toString().includes(filterValue)
    );
  }

  filterOptions(e: MatAutocompleteSelectedEvent) {
    this.categoryId = e.option.value;
    this.categoryName = e.option.viewValue;
  }

  onDragEnded(): void {
    // You can add code here if needed
  }

  openLg(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  openGenric(genricQuestion: any) {
    this.modalService.open(genricQuestion, { size: 'lg', centered: true });
  }
  opennccs(nccsQuestion: any) {
    this.modalService.open(nccsQuestion, { size: 'lg', centered: true });
  }

  opensidecontent() {
    const modalRef = this.modalService.open(this.opensidecontent, { /* modal options */ });
  }
  openAddScreen(AddScreen: any) {
    this.modalService.open(AddScreen, { size: 'xl', centered: true });
    this.isActivescreen = !this.isActivescreen;
  }

  getNames() {
    //this.countryId="IN"
    this.surveyservice.GetGenericQuestion(this.countryId).subscribe({
      next: (resp: responseDTO[]) => {
        console.log('Response:', resp);
        this.names = resp.map(item => ({ name: item.name, image: item.image }));
      },
      error: (err) => console.log("An Error occur while fetching categories", err)
    });
  }

  question: any[] = [];

  getQuestion() {
    this.surveyservice.GetQuestionTypes().subscribe({
      next: (resp: any) => {
        console.log('Response:', resp);
        // Map the response to the desired format
        this.question = resp;
      },
      error: (err) => console.log("An Error occurred while fetching question types", err)
    });
  }

  surveyName: any;
  categoryName: any
  otherCategoryName: any
  surveyStatus: any
  countryName: any
  totalItemsCount: number
  surveycreateddate: any
  GetSurveyDetails(pageSize: number, pageNumber: number) {

    this.surveyservice.getSurveyDetailsById(pageNumber, pageSize, this.surveyId).subscribe((data: any) => {


      if (Array.isArray(data)) {
        this.surveyName = data[0]?.surveyName;
        this.categoryName = data[0]?.categoryName;
        this.otherCategoryName = data[0]?.otherCategory;
        this.questions = data[0]?.questions;
        this.surveyStatus = data[0]?.status;
        this.countryName = data[0]?.countryName;
        this.countryId = data[0]?.countryId
        this.totalItemsCount = data[0]?.totalQuestionCount
        // this.selectedCountry = this.countryId
        this.selectedCountry = this.country.find(country => country.id === this.countryId) || null;
        this.categoryId = data[0]?.categoryId
      } else {
        this.surveyName = data.surveyName;
        this.categoryName = data.categoryName;
        this.questions = data.questions;
        this.otherCategoryName = data.otherCategory;
        this.surveyStatus = data.status;
        this.countryName = data.countryName;
        this.countryId = data.countryId
        this.totalItemsCount = data.totalQuestionCount
        this.categoryId = data.categoryId
        // this.selectedCountry = this.countryId
        console.log("countryId : ", this.countryId)
        console.log("country : ", this.country)
        this.selectedCountry = this.country.find(country => country.id === this.countryId) || null;
        console.log("selectedCountry : ", this.selectedCountry)
        this.surveycreateddate = data.createdDate
      }

      this.getNames();
      console.log("data", data)

    });
  }


  getCategoryNames() {
    this.surveyservice.GetCategories().subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);
      console.log("categoryList", response)
      this.categoryList = response
      console.log("update", result);
      result.forEach((value: any, index: any) => {
        if (value['id'] == this.readCategoryId)
          this.readCategoryName = value['name']
      });
      const models: { id: number; name: string }[] = result.map((value: any) => ({
        id: value['id'],
        name: value['name']
      }));
      this.options = models;
    });
  }

  onQuestionTypeClick(id: any, name: any) {
    this.selectedQuestionType = id;
    this.selectedQuestionTypeName = name;
  }
  onCreateQuesClick() {
    let _data = `${this.surveyId}_${this.selectedQuestionType}_add_0_${this.selectedQuestionTypeName}`;
    let encryptedText = this.crypto.encryptParam(_data);
    let url = `/survey/manage-question/${encryptedText}`;
    this.router.navigateByUrl(url);
  }
  //onEditQuestionClick
  onEditQuestionClick(questionId: any) {
    console.log("modifyQuestionId", questionId)
    let _data = `${this.surveyId}_${this.selectedQuestionType}_modify_${questionId}_${this.selectedQuestionTypeName}`;
    let encryptedText = this.crypto.encryptParam(_data);
    let url = `/survey/manage-question/${encryptedText}`;
    this.router.navigateByUrl(url);
  }
  updateSurvey() {
    this.selectedCountryId = this.selectedCountry ? this.selectedCountry.id : null;
    const dataToSend = {
      surveyId: this.surveyId,
      name: this.surveyName,
      categoryId: this.categoryId,
      otherCategory: this.otherCategoryName,
      countryId: this.selectedCountryId
    };
    console.log("dataToSend", dataToSend)
    console.log("country", this.countryId);
    this.surveyservice.updateSurvey(dataToSend).subscribe(
      response => {
        console.log('Response from server:', response);
        //this.surveyId = response;
        this.countryName = this.selectedCountry ? this.selectedCountry.name : null;
        if (this.surveyId) {
          const encryptedId = this.crypto.encryptParam(`${this.surveyId}`);
          const url = `/survey/manage-survey/${encryptedId}`;
          //this.modal.hide();

          this.router.navigateByUrl(url);
          /*if(this.router.url.includes('/manage-survey')){
            location.reload();
          }*/
        }
      },
      error => {
        console.error('Error occurred while sending POST request:', error);
        Swal.fire('', error, 'error');
      }
    );


  }

  logicIndex: number;
  toggleLogic(index: number, questionId: any) {

    //this.logicEntriesPerQuestion = [];
    this.addNewLogicEntry(index)
    this.questions[index].isLogicShow = !this.questions[index].isLogicShow;
    this.getLogicQuestionList(questionId)
    this.logicSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

  }

  getLogicValues() {
    this.surveyservice.getLogicValues().subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);
      console.log("logicValues", response)
      this.logicValuesList = response
    });
  }
  getLogicThens() {
    this.surveyservice.getLogicThens().subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);
      console.log("logicThens", response)
      this.logicThensList = response
    });
  }
  getLogicQuestionList(questionId: any) {
    this.logicQuestionList = [];
    const dataToSend = {
      surveyId: this.surveyId,
      surveyStatus: questionId
    };
    this.surveyservice.getLogicQuestionList(dataToSend).subscribe(
      (response: LogicQuestion[]) => {
        console.log("logicQuestionList", response);
        this.logicQuestionList = response;
      },
      error => {
        console.error('Error fetching logic questions', error);
      }
    );

  }

  onSelectChange(event: MatSelectChange, questionSortValue: any, questionId: number) {

    //const target = event.target as HTMLSelectElement;
    const selectedValue = event.value;
    // Use selectedValue as needed
    console.log('Selected value:', selectedValue);
    console.log('Question Sort value:', questionSortValue);

    let queryParams = null;
    if (questionId != 0) {
      queryParams = {
        qid: questionId,
        sid: this.surveyId,
        sordId: selectedValue,
        curntId: questionSortValue

      };
    }
    this.surveyservice.changeQuestionPosition(queryParams).subscribe(
      (response: String) => {
        console.log('Update successful:', response);
        window.location.reload();
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
        // Handle error
      }
    );
  }
  idIsEqual(a: any, b: any): boolean {
    return a === b;
  }
  reloadIfAlreadyOnManageSurvey(encryptedId: string) {
    console.log("reloadIfAlreadyOnManageSurvey")
    if (this.router.url.includes('/survey/manage-survey')) {
      const navigationExtras = {
        relativeTo: this.route,
        queryParams: { id: encryptedId },
        queryParamsHandling: 'merge' as const,
      };

      // Navigate with the updated query parameter without full page reload
      this.router.navigate([], navigationExtras);
    }
  }
  onPageChange(pageNumber: number) {
    console.log(pageNumber);
    // Handle page change event
    this.pageNumber = pageNumber;
    this.GetSurveyDetails(this.pageSize, this.pageNumber)
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
  getCountries() {
    this.surveyservice.getCountries().subscribe(response => {

      const result = Object.keys(response).map((key) => response[key]);
      console.log(result)
      const countries: { id: string; name: string, images: string }[] = result.map((value: any) => ({
        id: value['countryId'],
        name: value['name'],
        images: value['images']
      }));

      this.country = countries;
      console.log("country", this.country)
    });

  }
  isDivVisible = false;
  toggleDivVisibility() {
    this.isDivVisible = !this.isDivVisible;
    this.isActive = !this.isActive;
  }

  addNewLogicEntry(index: number): void {
    // Initialize an array for the question if not already done
    if (!this.logicEntriesPerQuestion[index]) {
      this.logicEntriesPerQuestion[index] = [];
    }

    // Add an empty logic entry for the question
    //this.logicEntriesPerQuestion[index].push({});
    const newLogicEntry = {
      ifId: null,
      ifExpected: null,
      thanId: null,
      thanExpected: null
      // Add other properties as needed
    };

    // Add the new logic entry to the array for the specific question
    this.logicEntriesPerQuestion[index].push(newLogicEntry);
  }
  removeLogicEntry(index: number): void {
    this.logicEntriesPerQuestion.splice(index, 1);
  }

  // Function to save all logic entries
  saveLogicEntries(): void {
    // Implement logic to save all entries
    console.log("logics", this.logicEntriesPerQuestion);
  }
  getQuestionLogic(index: number, questionId: number): void {


    this.surveyservice.getQuestionLogics(questionId, this.surveyId).subscribe(
      (response) => {
        if (response && response.length > 0) {
          // Initialize an array for the question if not already done
          if (!this.logicEntriesPerQuestion[index]) {
            this.logicEntriesPerQuestion[index] = [];
          }

          // Clear existing logic entries for the question
          this.logicEntriesPerQuestion[index] = [];

          // Add the new logic entries to the corresponding array
          this.logicEntriesPerQuestion[index] = response.map((logic: any) => {
            // Set the values of the select elements
            if (this.ifIdSelect && this.ifIdSelect.nativeElement) {
              this.ifIdSelect.nativeElement.value = logic.ifId.toString();
            }

            if (this.ifExpectedSelect && this.ifExpectedSelect.nativeElement) {
              this.ifExpectedSelect.nativeElement.value = logic.ifExpected;
            }

            if (this.thanIdSelect && this.thanIdSelect.nativeElement) {
              this.thanIdSelect.nativeElement.value = logic.thanId.toString();
            }

            if (this.thanExpectedSelect && this.thanExpectedSelect.nativeElement) {
              this.thanExpectedSelect.nativeElement.value = logic.thanExpected.toString();
            }

            return logic;
          });
          this.questions[index].isLogicShow = !this.questions[index].isLogicShow;
          console.log("this.logicEntriesPerQuestion", this.logicEntriesPerQuestion);
        }
      },
      (error) => {
        // Handle errors
        console.error(error);
      }
    );
  }
  createLogic(questionId: any, logicEntries: any[]): void {
    // You may need to adjust this logic based on your actual implementation
    for (const logicEntry of logicEntries) {
      const id = logicEntry.id
      const ifIdValue = logicEntry.ifId;
      const ifExpectedValue = logicEntry.ifExpected;
      const thanIdValue = logicEntry.thanId;
      const thanExpectedValue = logicEntry.thanExpected;

      this.questionLogic.id = id
      this.questionLogic.surveyId = this.surveyId;
      this.questionLogic.questionId = questionId;
      this.questionLogic.ifId = ifIdValue;
      this.questionLogic.ifExpected = ifExpectedValue;
      this.questionLogic.thanId = thanIdValue;
      this.questionLogic.thanExpected = thanExpectedValue;

      console.log("dataToSend", this.questionLogic);

      this.surveyservice.createLogic(this.questionLogic).subscribe(
        response => {
          console.log('Response from server:', response);
          this.utils.showSuccess('Logic Created Successfully.');
          // Swal.fire('', 'Logic Created Successfully.', 'success');
        },
        error => {
          console.error('Error occurred while sending POST request:', error);
          // Swal.fire('', error, 'error');
          this.utils.showError(error);

        }
      );
    }
  }

  isRandomizationChecked: boolean = false;
  addNewRandomization(): void {
    const newRandomEntry = { id: this.randormizeEntries.length + 1, selectedOption: 'null' };
    this.randormizeEntries.push(newRandomEntry);
  }



  // defaultRandomValueEnter(): void {
  //   const defaultEntry1 = { id: 1, selectedOption: 'null' };
  //   const defaultEntry2 = { id: 2, selectedOption: 'null' };
  //   this.randormizeEntries.push(defaultEntry1, defaultEntry2);
  // }
  addRandomizationSection() {
    this.randormizeEntries.push({
      fromQuestion: null,
      toQuestion: null,
    });
  }

  removeRandomizationSection(index: number) {



    this.randormizeEntries.splice(index, 1);
  }
  saveRandomization(): void {
    if (!this.validateSurvey()) {
      this.utils.showError('Please checked');
      return;
    }

    console.log(this.randormizeEntries);
    console.log(this.isRandomizationChecked);

    if (this.isRandomizationChecked) {
      const formattedData = [];

      for (let i = 0; i < this.randormizeEntries.length; i++) {
        const randomization = this.randormizeEntries[i];
        const fromQuestionId = randomization.fromQuestion;
        const toQuestionId = randomization.toQuestion;

        if (fromQuestionId && toQuestionId) {
          const filteredQuestions = this.logicQuestionList.filter(question => question.id >= fromQuestionId && question.id <= toQuestionId);

          const formattedQuestions = filteredQuestions.map(question => {
            return {
              surveyId: this.surveyId,
              questionId: (question.id),
              isRandomize: true,
              groupNumber: i + 1, // Add groupNumber based on the index of randormizeEntries
            };
          });

          formattedData.push(...formattedQuestions);
        } else {
          console.warn('From Question and To Question must be selected for each randomization entry.');
        }
      }

      if (formattedData.length > 0) {
        // Call the service to post the formatted data
        this.surveyservice.postRandomizedQuestions(formattedData).subscribe(
          response => {
            // Handle the response if needed
            console.log('POST request successful', response);
            // Swal.fire('', 'Randomization Created Successfully.', 'success');
            this.utils.showSuccess('Randomization Created Successfully.');
          },
          error => {
            // Handle errors
            console.error('Error in POST request', error);
            // Swal.fire('', 'Please confirm you want to randomization these question ', 'error');
            this.utils.showError('Please confirm you want to randomization these question');
          }
        );
      } else {
        console.warn('No valid range found for randomization.');
      }
    } else {
      // Handle the case when randomization is not checked
    }
  }
  surveylist: {
    surveyId: number | null,
    name: string,
    status: string | number | null,
    categoryName: string,
    userName: string,
    createdDate: any
  }[] = [];

  selectedAutoCodeOption: number = 0;

  getAllSurveyList() {
    this.getSurveyLooping();
    console.log("AutoCode Option", this.selectedAutoCodeOption)
    this.surveyservice.GetSurveyList().subscribe((data: any) => {
      const surveyType: any[] = data.surveyType;

      if (this.selectedAutoCodeOption == 0) {
        const defaultOption = {
          surveyId: 0,
          name: 'Select Survey',
          status: null,
          categoryName: '',
          userName: '',
          createdDate: null
        };

        this.surveylist = [defaultOption, ...surveyType.map(item => ({
          surveyId: item.surveyId,
          name: item.name,
          status: item.status !== null ? String(item.status) : null,
          categoryName: item.categoryName,
          userName: item.userName,
          createdDate: new Date(item.createdDate)
        }))];
      } else {
        this.surveylist = [...surveyType.map(item => ({
          surveyId: item.surveyId,
          name: item.name,
          status: item.status !== null ? String(item.status) : null,
          categoryName: item.categoryName,
          userName: item.userName,
          createdDate: new Date(item.createdDate)
        }))];
      }
      console.log("surveyData In Header", this.surveylist);
    });
  }
  saveAutoCode(): void {
    const surveyId = this.surveyId;
    const dummySurveyId = this.selectedAutoCodeOption;

    this.surveyservice.surveyLooping(surveyId, dummySurveyId).subscribe(
      response => {
        // Handle the response here
        // Swal.fire('', 'Auto Code Created Successfully.', 'success');
        this.utils.showSuccess('Auto Code Created Successfully.');

        console.log('Survey Looping Response:', response);
      },
      error => {
        // Handle errors here
        this.utils.showError(error);
        console.error('Survey Looping Error:', error);
      }
    );
  }
  ageOptionLogicValuesList: any
  getAgeOptionsLogicValues() {
    this.surveyservice.getAgeOptionsLogicValues().subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);
      console.log("Age OptionLogicValues", response)
      this.ageOptionLogicValuesList = response
    });
  }
  isCalulationElseShow: boolean = false
  showCalculationElse() {
    this.isCalulationElseShow = true
  }
  hideCalculationElse() {
    this.isCalulationElseShow = false
  }
  calulationPerformOperationOption: any = null
  calulationPerformOperationValue: any = 0
  calulationThenOption: any = null
  calulationThenValue: any = null
  calulationElseOption: any = null
  calulationElseValue: any = null

  saveCalculation(questionId: any) {
    //alert(questionId)
    this.questionCalculation.surveyId = this.surveyId;
    this.questionCalculation.questionId = questionId;
    this.questionCalculation.ifId = this.calulationPerformOperationOption;
    this.questionCalculation.ifExpected = this.calulationPerformOperationValue;
    this.questionCalculation.thanId = this.calulationThenOption;
    this.questionCalculation.thanExpected = this.calulationThenValue;
    this.questionCalculation.elseId = this.calulationElseOption
    this.questionCalculation.elseExpected = this.calulationElseValue
    console.log("dataToSend", this.questionCalculation);

    this.surveyservice.createCalculation(this.questionCalculation).subscribe(
      response => {
        console.log('Response from server:', response);
        // Swal.fire('', 'Calculation Created Successfully.', 'success');
        this.utils.showSuccess('Calculation Created Successfully.');
      },
      error => {
        console.error('Error occurred while sending POST request:', error);
        // Swal.fire('', error, 'error');
        this.utils.showError(error);
      }
    );
  }
  logicQuestionListForCalculation: any
  pipeQuestionList: any
  getLogicQuestionListForCalculation(questionId: any, sort: number) {
    this.logicQuestionListForCalculation = '';
    const dataToSend = {
      surveyId: this.surveyId,
      surveyStatus: questionId
    };
    this.surveyservice.getLogicQuestionList(dataToSend).subscribe((response: responseDTO) => {
      console.log("logicQuestionListForCalculation", response);
      console.log("Question Sort Value", sort);
      this.pipeQuestionList = response
      this.logicQuestionListForCalculation = response.filter((item: Question) => item.sort > sort);

      console.log("Filtered logicQuestionList", this.logicQuestionList);
    });
  }
  questionListBranching: QuestionItem[] = [];
  getQuestionListBranching(questionId: number): void {
    this.surveyservice.getQuestionListBranching(questionId, this.surveyId).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.questionListBranching = response
        }
      },
      (error) => {
        // Handle errors
        console.error(error);
      }
    );
  }
  isBranchingElseShow: boolean = false
  showBranchingElse() {
    this.isBranchingElseShow = true
  }
  hideBranchingElse() {
    this.isBranchingElseShow = false
  }
  //getQuestionListRandomization
  apiResponseRandomization: any[] = [];
  groupedDataRandomization: { [key: string]: any[] } = {};

  getRandomization(): void {

    this.surveyservice.getRandomizedQuestions(this.surveyId).subscribe(
      (response: any[]) => {
        // Store the API response
        this.apiResponseRandomization = response;

        // Handle the response from the API
        this.handleApiData();
      },
      error => {
        // Handle errors
        console.error('Error in GET request', error);
      }
    );
  }
  handleApiData() {
    // Group data by groupNumber
    this.groupedDataRandomization = this.groupDataByGroupNumber();

    // Transform data for each groupNumber
    const transformedData = this.transformData();

    console.log('Transformed Data:', transformedData);
    this.randormizeEntries = transformedData
    if (this.randormizeEntries.length == 0) {
      this.randormizeEntries.push({
        fromQuestion: null,
        toQuestion: null,
      });
    } else {
      this.isDivVisible = true;
      //alert(this.isDivVisible)
    }
  }
  groupDataByGroupNumber() {
    const groupedData: { [key: string]: any[] } = {};

    this.apiResponseRandomization.forEach(item => {
      const groupNumber = item.groupNumber;

      if (!groupedData[groupNumber]) {
        groupedData[groupNumber] = [];
      }

      groupedData[groupNumber].push(item);
    });

    return groupedData;
  }
  transformData() {
    const transformedData: any[] = [];

    Object.keys(this.groupedDataRandomization).forEach(groupNumber => {
      const group = this.groupedDataRandomization[groupNumber];

      if (group && group.length > 0) {
        const numericValues: number[] = group.map(item => {
          if (typeof item.questionId !== 'undefined') {
            const value = +item.questionId;
            if (!isNaN(value)) {
              return value;
            } else {
              console.warn(`Non-numeric value found for groupNumber ${groupNumber}:`, item.questionId);
            }
          } else {
            console.warn(`'questionId' is undefined for groupNumber ${groupNumber}`, item);
          }
          return NaN; // or handle this case as needed
        }).filter(value => !isNaN(value));

        if (numericValues.length > 0) {
          const fromQuestion = Math.min(...numericValues);
          const toQuestion = Math.max(...numericValues);

          transformedData.push({
            fromQuestion,
            toQuestion,
          });
        } else {
          console.warn('No valid numeric values found for groupNumber:', groupNumber);
        }
      }
    });

    return transformedData;
  }
  getSurveyLooping(): void {
    this.surveyservice.getSurveyLooping(this.surveyId).subscribe(
      (response) => {
        if (response != '' && response != undefined)
          this.selectedAutoCodeOption = response
      },
      (error) => {
        // Handle errors
        console.error(error);
      }
    );
  }


  onSelect(event: any) {
    const selectedFiles: FileList = event.addedFiles;
    for (let i = 0; i < selectedFiles.length; i++) {
      this.files.push(selectedFiles[i]);
      this.uploadImage(selectedFiles[i])
    }
  }

  onRemove(file: File) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
  screenImage: any
  uploadImage(file: File): void {

    this.themeService.uploadImageAboutUs(file, this.userId).subscribe(
      (response: String) => {
        console.log('Upload successful:', response);
        this.screenImage = response
        // Handle response from the image upload
        // You may want to retrieve the URL or any other relevant information from the response
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
        // Handle error
      }
    );
  }
  getPreview(file: File): string {
    return URL.createObjectURL(file);
  }
  getQuestionListAgeCalculation(questionId: number): void {
    this.surveyservice.getQuestionListAgeCalculation(questionId, this.surveyId).subscribe(
      (response) => {
        if (response) {
          this.calulationPerformOperationOption = response.ifId
          this.calulationPerformOperationValue = response.ifExpected
          this.calulationThenOption = response.thanId
          this.calulationThenValue = response.thanExpected
          this.calulationElseOption = response.elseId
          this.calulationElseValue = response.elseExpected
          if (this.calulationElseOption > 0)
            this.isCalulationElseShow = true
        }
      },
      (error) => {
        // Handle errors
        console.error(error);
      }
    );
  }
  screenQuestion: any
  screenRedirectUser: boolean
  screenRedirectURL: any
  screenQuestionObj: Question = new Question();
  saveScreenImage(): void {
    this.screenQuestionObj.question = this.screenQuestion
    this.screenQuestionObj.image = this.screenImage
    this.screenQuestionObj.isScreening = this.screenRedirectUser
    this.screenQuestionObj.screeningRedirectUrl = this.screenRedirectURL
    this.screenQuestionObj.surveyTypeId = this.surveyId

    this.surveyservice.CreateGeneralQuestion(this.screenQuestionObj).subscribe({
      next: (resp: any) => {
        Swal.fire('', 'Question Generated Sucessfully.', 'success');

        let url = `/survey/manage-survey/${this.crypto.encryptParam("" + this.surveyId)}`;

        //this.router.navigateByUrl(url);
      },
      error: (err: any) => {
        Swal.fire('', err.error, 'error');
      }
    });
  }

  refresh() {
    this.GetSurveyDetails(this.pageSize, 1);
  }



  //new 

  checkrequired: boolean = false; // Initialize the flag

  validateSurvey(): boolean {
    // Check if the checkbox is not checked
    this.checkrequired = !!this.isRandomizationChecked;
    return this.checkrequired;
  }

  cloneQuestion: Question = new Question();
  cloning(clonQuestionId: any) {
    this.surveyservice.cloneQuestion(clonQuestionId, this.surveyId).subscribe((data: any) => {
      //console.log("data", data)
      this.cloneQuestion = data
      this.cloneQuestion.id = 0
      this.cloneQuestion.question = this.cloneQuestion.question + "-1"
      this.cloneQuestion.createdDate = this.getCurrentDateTime()
      console.log(this.cloneQuestion)

      this.surveyservice.CreateGeneralQuestion(this.cloneQuestion).subscribe({
        next: (resp: any) => {
          this.utils.showSuccess('Question Generated Successfully.');
          // let url = `/survey/manage-survey/${this.crypto.encryptParam("" + this.surveyId)}`;
          // this.router.navigateByUrl(url);
          window.location.reload()
        },
        error: (err: any) => {
          this.utils.showError('error');
        }
      });
    });
  }
  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }

  deleteQuestion(questionId: any, isdelete: boolean) {
    if (!isdelete) {
      // Show error message
      console.log("Associated logic entries found. Cannot delete question.");
      this.utils.showError('Cannot delete question because it has associated logic entries.');
      return; // Exit the method
    }
    const dataToSend = {
      sId: this.surveyId,
      qId: questionId
    };
    this.surveyservice.deleteQuestion(dataToSend).subscribe(
      (data: any) => {
        this.utils.showSuccess('Question Deleted.');
        // window.location.reload();
      },
      (error: any) => {
        this.utils.showError('Error deleting question.');
      }
    );
  }







}
