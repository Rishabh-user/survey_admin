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
import { QuestionLogic } from 'src/app/models/question-logic';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { SecLsmPopupComponent } from '../popups/sec-lsm-popup/sec-lsm-popup.component';
import { Question } from 'src/app/models/question';
import { QuestionItem } from 'src/app/models/question-items';
import { environment } from 'src/environments/environment';
import { MatChipInputEvent } from '@angular/material/chips';
import { Option } from 'src/app/models/option';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
  showTooltip: { [key: string]: boolean } = {};
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }

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
  separatorKeysCodes: number[] = [ENTER, COMMA];
  isAddRandomizationMode: boolean = true;
  initialLength: number;
  showRemoveandlogicArray: boolean[][] = [];
  isAndOrLogic: boolean[][] = [];
  visibleaddandlogic: boolean[][] = [];
  isBranchingElseShow: boolean[][] = [];
  isElseShow: boolean[][] = [];
  status: any

  centerId: number = this.utils.getCenterId();

  token = localStorage.getItem('authToken');

  centername: string = this.utils.getCenterName();


  modal: any;
  genericType: any
  checkgenerictype: any
  logicscount: any
  openendedtype: any

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
    this.getRandomization();
    this.getLogicCount();

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
  countryImage: any
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
        this.surveyId = data.surveyId
        this.status = data.status
        this.surveyName = data.surveyName;
        this.categoryName = data.categoryName;
        this.questions = data.questions;
        this.otherCategoryName = data.otherCategory;
        this.surveyStatus = data.status;
        this.countryName = data.countryName;
        this.countryImage = data.countryImage;
        this.countryId = data.countryId
        this.totalItemsCount = data.totalQuestionCount
        this.categoryId = data.categoryId
        // this.selectedCountry = this.countryId
        console.log("countryId : ", this.countryId)
        console.log("country : ", this.country)
        console.log("surveyId create", this.surveyId)
        console.log("survey status", this.status)
        this.selectedCountry = this.country.find(country => country.id === this.countryId) || null;
        console.log("selectedCountry : ", this.selectedCountry)
        this.surveycreateddate = data.createdDate

        // Iterate over questions to get genericType

        let questionDescriptions: string[] = [];
        let screeningRedirectUrls: string[] = [];
        let screenImages: string[] = [];
        let screenyoutubeurl: string[] = [];
        let screenvideo: string[] = []

        // Iterate over questions
        this.questions.forEach((question: any) => {
          console.log("genericType:", question.genericType);
          console.log("Description:", question.description);

          // Check if the question is for screening
          if (question.isScreening) {
            // Store the description, screeningRedirectUrl, and image for this question
            questionDescriptions.push(question.description);
            screeningRedirectUrls.push(question.screeningRedirectUrl);
            screenImages.push(question.image);
            screenyoutubeurl.push(question.youtubeUrl);
            screenvideo.push(question.video)
          }
        });


        //check

        const hasAgeQuestion = this.questions.some((question: any) => question.genericType === "Age");
        console.log("Has age question:", hasAgeQuestion);
        this.checkgenerictype = hasAgeQuestion
        console.log("checkage", this.checkgenerictype)

        //openended

        const hasOpenEndedQuestion = this.questions.some((question: any) => question.genericType === "openended");
        console.log("Has age question:", hasOpenEndedQuestion);
        this.openendedtype = hasOpenEndedQuestion
        console.log("checkage", this.openendedtype)

        //logics count
        this.questions.forEach((question: any) => {
          console.log("Question:", question.question);
          console.log("Number of Logics:", question.logics.length);
          question.logicscount = question.logics.length
        });

        //screening
        if (Array.isArray(data)) {
          // Handle array data
        } else {
          this.questions = data.questions;
          this.questions.forEach((question: any) => {
            const isScreening = question.isScreening;
            console.log("isScreening value for question:", isScreening);
            // Now you can use the isScreening value as needed
          });
        }

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
    this.validateSurvey()
    this.selectedCountryId = this.selectedCountry ? this.selectedCountry.id : null;
    if (this.isValidSurvey) {
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
            this.utils.showSuccess('Updated');

            this.router.navigateByUrl(url);

            if (this.router.url.includes('/manage-survey')) {
              location.reload();
            }
          }
        },
        error => {
          console.error('Error occurred while sending POST request:', error);
          // Swal.fire('', error, 'error');
          this.utils.showError(error);
        }
      );
    }


  }

  logicIndex: number;

  toggleLogic(index: number, questionId: any,mode:string) {
    //this.logicIndex = index;
    console.log("questionId : ", questionId);
    console.log("index :", index);
    if(mode==="add")
      this.addNewLogicEntry(index);

    this.questions[index].isLogicShow = !this.questions[index].isLogicShow;
    /*setTimeout(() => {
    
  }, 10000);*/
    console.log('this.questions[index].isLogicShow',this.questions[index].isLogicShow)
    this.getLogicQuestionList(questionId);

    
    setTimeout(() => { // Adding a small delay to ensure the section is rendered before scrolling
      const sectionToScroll = this.el.nativeElement.querySelector(`#question-${questionId}`);

      if (sectionToScroll) {
        sectionToScroll.scrollIntoView({ behavior: 'smooth', block: 'start' });
        console.log("section id")
      } else {
        console.warn(`Section with ID "question-${questionId}" not found.`);
      }
    }, 100); // Adjust the delay as needed
    
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
  logicQuestionListById: any
  getLogicQuestionList(questionId: any) {
    //alert(questionId);
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
    this.logicQuestionListById = []; // Assuming logicQuestionListById is of type responseDTO[]
    this.surveyservice.GetQuestionListBySurveyId(this.surveyId).subscribe((response: responseDTO[]) => {
      this.logicQuestionListById = response;
      console.log("logicQuestionListById", this.logicQuestionListById);
    });

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
      console.log("Inside If Condition")
      this.logicEntriesPerQuestion[index] = [];
    }
    let logicIndex = this.logicEntriesPerQuestion.length
    if (logicIndex > 0)
      logicIndex = this.logicEntriesPerQuestion.length + 1
    // Create a new logic entry object
    const newLogicEntry = {
      id: 0,
      ifId: null,
      ifExpected: null,
      questionIdAndOr: null,
      ifIdAndOr: null,
      ifExpectedAndOr: null,
      thanId: null,
      thanExpected: null,
      elseId: null,
      elseExpected: null,
      isAnd: false,
      isOr: false,
      popupText: null,
      isEveryTime: false,
      timesPeriod: 0,
      popupTextElse: null,
      isEveryTimeElse: false,
      timesPeriodElse: 0,
      andOrId: 0
    };

    this.logicEntriesPerQuestion[index].push(newLogicEntry);
    if (!this.showRemoveandlogicArray[index]) {
      this.showRemoveandlogicArray[index] = [];
    }
    this.showRemoveandlogicArray[index][logicIndex] = false;
    if (!this.visibleaddandlogic[index]) {
      this.visibleaddandlogic[index] = [];
    }
    this.visibleaddandlogic[index][logicIndex] = false;
    if (!this.isAndOrLogic[index]) {
      this.isAndOrLogic[index] = [];
    }
    this.isAndOrLogic[index][logicIndex] = false;
    if (!this.isBranchingElseShow[index]) {
      this.isBranchingElseShow[index] = [];
    }
    this.isBranchingElseShow[index][logicIndex] = false;


    //isElseShow
    if (!this.isElseShow[index]) {
      this.isElseShow[index] = [];
    }
    this.isElseShow[index][logicIndex] = true;

    //isElseShowCalculations


    console.log("value of visibleaddandlogic: ", this.visibleaddandlogic)
    console.log('Value of logicEntriesPerQuestion:', this.logicEntriesPerQuestion);

    if (!this.selectedOptionsLogic[index]) {
      this.selectedOptionsLogic[index] = [];
    } if (!this.selectedOptionsLogic[index][logicIndex]) {
      this.selectedOptionsLogic[index][logicIndex] = [];
    }

  }

  removeLogicEntry(questionIndex: number, logicIndex: number): void {
    // Check if the nested array exists for the specified questionIndex
    if (this.logicEntriesPerQuestion[questionIndex]) {
      // Check if the logicIndex is within the bounds of the nested array
      if (logicIndex >= 0 && logicIndex < this.logicEntriesPerQuestion[questionIndex].length) {
        const entryIdToDelete = this.logicEntriesPerQuestion[questionIndex][logicIndex]?.id;

        // Check if entryIdToDelete is defined before proceeding
        if (entryIdToDelete !== undefined) {
          console.log("entryIdToDelete", entryIdToDelete)
          if (entryIdToDelete == 0)
            this.logicEntriesPerQuestion[questionIndex].splice(logicIndex, 1);
          else {

            this.surveyservice.deleteQuestionLogicById(entryIdToDelete).subscribe(
              () => {
                console.log('Logic deleted successfully.');
                this.logicEntriesPerQuestion[questionIndex].splice(logicIndex, 1);
              },
              (error) => {
                console.error('Error deleting logic:', error);
                // Handle error response here
              }
            );

          }

        } else {
          console.error('Entry ID is undefined or null.');
        }
      } else {
        console.error('Invalid logicIndex:', logicIndex);
      }
    } else {
      console.error('No logic entries found for question index:', questionIndex);
    }
  }

  // Function to save all logic entries
  saveLogicEntries(): void {
    // Implement logic to save all entries
    console.log("logics", this.logicEntriesPerQuestion);
  }
  getQuestionLogic(index: number, questionId: number): void {
    //alert('getQuestionLogic')

    this.getOptionsByQuestionIdLogic(questionId);
    this.surveyservice.getQuestionLogics(questionId, this.surveyId).subscribe(
      (response) => {
        if (response && response.length > 0) {
          console.log("response :", response)

          // Iterate through each logic entry in the response
          response.forEach((logic: any, logicIndex: number) => {
            if (!this.selectedOptionsLogic[index]) {
              this.selectedOptionsLogic[index] = [];
            }
            if (!this.selectedOptionsLogic[index][logicIndex]) {
              this.selectedOptionsLogic[index][logicIndex] = [];
            }
            if (!this.selectedOptions[index]) {
              this.selectedOptions[index] = [];
            }
            if (!this.selectedOptions[index][logicIndex]) {
              this.selectedOptions[index][logicIndex] = [];
            }

            if (!this.showRemoveandlogicArray[index]) {
              this.showRemoveandlogicArray[index] = [];
            }

            if (!this.visibleaddandlogic[index]) {
              this.visibleaddandlogic[index] = [];
            }
            if (!this.isAndOrLogic[index]) {
              this.isAndOrLogic[index] = [];
            }
            if (!this.isBranchingElseShow[index]) {
              this.isBranchingElseShow[index] = [];
            }
            if (!this.isElseShow[index]) {
              this.isElseShow[index] = [];
            }




            if (logic.thanTerm && logic.thanTerm.includes("L")) { // Check if thanTerm is not null and contains "L"
              if (logic.thanExpected !== null && logic.thanExpected !== 0) {
                logic.thanExpected = "L-" + logic.thanExpected; // Modify thanExpected accordingly
              }
            }
            if (logic.thanTerm && logic.thanTerm.includes("Q")) { // Check if thanTerm is not null and contains "L"
              if (logic.thanExpected !== null) {
                logic.thanExpected = "Q-" + logic.thanExpected; // Modify thanExpected accordingly
              }
            }

            if (logic.elseTerm && logic.elseTerm.includes("Q")) { // Check if thanTerm is not null and contains "L"
              if (logic.elseExpected !== null && logic.elseExpected !== 0) {
                logic.elseExpected = "Q-" + logic.elseExpected; // Modify thanExpected accordingly
              }
            }

            if (logic.elseTerm && logic.elseTerm.includes("L")) { // Check if thanTerm is not null and contains "L"
              if (logic.elseExpected !== null) {
                logic.elseExpected = "L-" + logic.elseExpected; // Modify thanExpected accordingly
              }
            }

            const newLogicEntry = {
              id: logic.id,
              ifId: logic.ifId,
              ifExpected: logic.ifExpected,
              questionIdAndOr: logic.logicConditions[0].questionId,
              ifIdAndOr: logic.logicConditions[0].ifId, // Assuming there's only one logic condition
              ifExpectedAndOr: logic.logicConditions[0].ifExpected, // Assuming there's only one logic condition
              thanId: logic.thanId,
              thanExpected: logic.thanExpected,
              elseId: logic.elseId,
              elseExpected: logic.elseTerm,
              isAnd: logic.logicConditions[0].isAnd, // Assuming there's only one logic condition
              isOr: logic.logicConditions[0].isOr, // Assuming there's only one logic condition
              popupText: logic.popupText,
              isEveryTime: logic.isEveryTime,
              timesPeriod: logic.timesPeriod,
              popupTextElse: null,
              isEveryTimeElse: false,
              timesPeriodElse: 0,
              andOrId: logic.logicConditions[0].id
            };
            if (newLogicEntry.elseExpected === "null")
              newLogicEntry.elseExpected = 0
            if (newLogicEntry.thanExpected === "null")
              newLogicEntry.thanExpected = 0

            // Initialize an array for the question if not already done
            if (!this.logicEntriesPerQuestion[index]) {
              this.logicEntriesPerQuestion[index] = [];
            }
            console.log("ifExpected : ", logic.ifExpected)
            if (logic.ifExpected != null) {
              let queryParams = {
                qid: questionId
              };

              this.surveyservice.getOptionsByQuestionId(queryParams).subscribe((response: any) => {
                console.log("response logic option", response);

                const optionsArray = JSON.parse(response);
                if (Array.isArray(optionsArray) && optionsArray.length > 0) {
                  this.selectedOptionsLogic[index][logicIndex] = []
                  const filteredOptions = optionsArray.filter((item: { id: number }) => logic.ifExpected.includes(item.id));
                  console.log("filteredOptions : ", filteredOptions);

                  this.selectedOptionsLogic[index][logicIndex].push(...filteredOptions);
                  console.log("selectedOptionsLogic : ", this.selectedOptionsLogic[index][logicIndex]);

                } else {

                  console.error("Response is either not an array or it's empty. Unable to filter options.");
                }

              });
            }
            // And/Or 
            if (newLogicEntry.ifExpectedAndOr != null) {
              let queryParams = {
                qid: newLogicEntry.questionIdAndOr
              };

              this.surveyservice.getOptionsByQuestionId(queryParams).subscribe((response: any) => {
                console.log("response logic option", response);

                const optionsArray = JSON.parse(response);
                if (Array.isArray(optionsArray) && optionsArray.length > 0) {
                  // Assuming the response is an array of objects
                  const filteredOptions = optionsArray.filter((item: { id: number }) => newLogicEntry.ifExpectedAndOr.includes(item.id));
                  console.log("filteredOptions : ", filteredOptions);
                  this.selectedOptions[index][logicIndex] = []
                  this.selectedOptions[index][logicIndex].push(...filteredOptions);
                  console.log("selectedOptions : ", this.selectedOptions[index][logicIndex]);

                } else {

                  console.error("Response is either not an array or it's empty. Unable to filter options.");
                }

              });
            }

            if (newLogicEntry.isAnd || newLogicEntry.isOr) {
              this.visibleaddandlogic[index][logicIndex] = true;
              this.showRemoveandlogicArray[index][logicIndex] = true;
              this.isAndOrLogic[index][logicIndex] = true;
            } else {
              this.visibleaddandlogic[index][logicIndex] = false;
              this.showRemoveandlogicArray[index][logicIndex] = false;
              this.isAndOrLogic[index][logicIndex] = false;
            }
            if (newLogicEntry.elseId && newLogicEntry.elseId > 0)
              this.isBranchingElseShow[index][logicIndex] = true;
            else
              this.isBranchingElseShow[index][logicIndex] = false;
            //calculation


            const ifIdNumber = +newLogicEntry.elseId;
            if (ifIdNumber === 3 || ifIdNumber === 4)
              this.isElseShow[index][logicIndex] = false
            else
              this.isElseShow[index][logicIndex] = true



            if (newLogicEntry.isOr)
              newLogicEntry.isOr = "option2"
            if (newLogicEntry.isAnd)
              newLogicEntry.isAnd = "option1"
            // Push the new logic entry to the array
            this.logicEntriesPerQuestion[index].push(newLogicEntry);
          });
          //alert('First '+this.questions[index].isLogicShow)
          //this.questions[index].isLogicShow = !this.questions[index].isLogicShow;
          //alert('Second '+this.questions[index].isLogicShow)
          console.log("this.logicEntriesPerQuestion", this.logicEntriesPerQuestion);
        }
      },
      (error) => {
        // Handle errors
        console.error(error);
      }
    );
  }
  createLogicCount: number = 0;
  createLogic(questionId: any, logicEntries: any[]): void {

    for (const logicEntry of logicEntries) {
      this.createLogicCount++;
      console.log(logicEntry)
      const thanTermValue = logicEntry.thanExpected;
      var elseTermValue = logicEntry.elseExpected;
      if(elseTermValue === null)
        elseTermValue=0
      if (logicEntry.elseExpected !== null && logicEntry.elseExpected !== 0) {
        logicEntry.elseExpected = logicEntry.elseExpected.replace('Q-', '').replace('L-', '');
      } else {
        logicEntry.elseExpected = 0
        console.log("elseExpected : ", logicEntry.elseExpected)
      }

      if (logicEntry.thanExpected !== null && logicEntry.thanExpected !== 0) {
        logicEntry.thanExpected = logicEntry.thanExpected.replace(/Q-/g, '').replace(/L-/g, '');
      } else {
        logicEntry.thanExpected = 0
        console.log("thanExpected :", logicEntry.thanExpected)
      }


      const id = logicEntry.id
      const ifIdValue = logicEntry.ifId;
      const ifExpectedValue = logicEntry.ifExpected;
      const thanIdValue = logicEntry.thanId;
      const thanExpectedValue = logicEntry.thanExpected;
      const elseIdValue = logicEntry.elseId;
      const elseExpectedValue = logicEntry.elseExpected;
      const nameValue = "Logic " + this.createLogicCount;
      var popupTextValue: string = "", isEveryTimeValue: boolean = false, timesPeriodValue: number = 0;
      if (thanIdValue == 5) {
        popupTextValue = logicEntry.popupText
        isEveryTimeValue = logicEntry.isEveryTime
        timesPeriodValue = logicEntry.timesPeriod
      }
      if (elseIdValue == 5) {
        popupTextValue = logicEntry.popupTextElse
        isEveryTimeValue = logicEntry.isEveryTimeElse
        timesPeriodValue = logicEntry.timesPeriodElse
      }
      this.questionLogic.id = id
      this.questionLogic.surveyId = this.surveyId;
      this.questionLogic.questionId = questionId;
      this.questionLogic.ifId = ifIdValue;
      this.questionLogic.ifExpected = ifExpectedValue;
      this.questionLogic.thanId = thanIdValue;
      this.questionLogic.thanExpected = thanExpectedValue;
      this.questionLogic.thanTerm = thanTermValue
      this.questionLogic.elseId = elseIdValue
      this.questionLogic.elseExpected = elseExpectedValue
      this.questionLogic.elseTerm = elseTermValue
      this.questionLogic.name = nameValue
      this.questionLogic.popupText = popupTextValue
      this.questionLogic.isEveryTime = isEveryTimeValue
      this.questionLogic.timesPeriod = timesPeriodValue
      if (!this.questionLogic.logicConditions[0]) {
        this.questionLogic.logicConditions[0] = {
          id: 0,
          logicId: 0,
          isAnd: false,
          isOr: false,
          questionId: 0,
          ifId: 0,
          ifExpected: ""
        };
      }
      console.log("isAnd : ", logicEntry.isAnd)
      console.log("isAnd : ", logicEntry.isAnd)
      if (!(logicEntry.isAnd === false && logicEntry.isOr === false)) {
        console.log("In Side And Or If")
        if (!logicEntry.isAnd)
          this.questionLogic.logicConditions[0].isAnd = true
        else
          this.questionLogic.logicConditions[0].isOr = true

        this.questionLogic.logicConditions[0].questionId = logicEntry.questionIdAndOr
        this.questionLogic.logicConditions[0].ifId = logicEntry.ifIdAndOr
        this.questionLogic.logicConditions[0].ifExpected = logicEntry.ifExpectedAndOr
      }

      console.log("dataToSend", this.questionLogic);
      if (this.questionLogic.id > 0) {
        this.surveyservice.updateLogic(this.questionLogic).subscribe(
          response => {
            console.log('Response from server:', response);
            this.utils.showSuccess('Logic Created Successfully.');
          },
          error => {
            console.error('Error occurred while sending POST request:', error);
            this.utils.showError(error);
          }
        );
      } else {
        this.surveyservice.createLogic(this.questionLogic).subscribe(
          response => {
            console.log('Response from server:', response);
            this.utils.showSuccess('Logic Created Successfully.');
          },
          error => {
            console.error('Error occurred while sending POST request:', error);
            this.utils.showError(error);
          }
        );
      }
    }
  }

  isRandomizationChecked: boolean = false;
  addNewRandomization(): void {
    const newRandomEntry = { id: this.randormizeEntries.length + 1, selectedOption: 'null' };
    this.randormizeEntries.push(newRandomEntry);
  }

  addRandomizationSection() {
    this.randormizeEntries.push({
      fromQuestion: null,
      toQuestion: null, isRandomizationChecked: false
    });
  }

  removeRandomizationSection(index: number) {
    this.randormizeEntries.splice(index, 1);
  }

  saveRandomization(): void {
    debugger
    console.log("randomize", this.randormizeEntries);
    const anyCheckboxChecked = this.randormizeEntries.some(entry => entry.isRandomizationChecked);
    console.log(anyCheckboxChecked)

    const anyUncheckedNewEntries = this.randormizeEntries.slice(-1 * (this.randormizeEntries.length - this.initialLength))
      .some(entry => !entry.isRandomizationChecked);

    if (!anyCheckboxChecked || anyUncheckedNewEntries) {
      this.utils.showError('Checked Checkbox.');
      return;
    }


    // checking remain checked
    this.randormizeEntries.forEach(entry => {
      if (entry.isRandomizationChecked) {
        entry.isRandomizationChecked = true;
      }
    });

    for (let i = this.initialLength; i < this.randormizeEntries.length; i++) {
      if (this.randormizeEntries[i].isRandomizationChecked === undefined) {
        this.randormizeEntries[i].isRandomizationChecked = true; // or false depending on your logic
      }
    }




    const formattedData: { surveyId: string, questionId: string, isRandomize: boolean, groupNumber: number }[] = [];

    for (let i = 0; i < this.randormizeEntries.length; i++) {
      const randomization = this.randormizeEntries[i];
      const fromQuestionId = randomization.fromQuestion;
      const toQuestionId = randomization.toQuestion;

      console.log("fromQuestionId", fromQuestionId)
      console.log("toQuestionId", toQuestionId)

      if (fromQuestionId && toQuestionId && randomization.isRandomizationChecked) {
        const filteredQuestions = this.logicQuestionListById.filter((question: { id: number; }) => question.id >= fromQuestionId && question.id <= toQuestionId);
        // const filteredQuestions = this.randormizeEntries.filter((question: { id: string; }) => {
        //   const questionId = parseInt(question.id, 10); // Convert question ID to a number
        //   return questionId >= parseInt(fromQuestionId, 10) && questionId <= parseInt(toQuestionId, 10);
        // });

        const formattedQuestions = filteredQuestions.map((question: { id: { toString: () => any; }; }) => {
          return {
            surveyId: this.surveyId.toString(), // Convert surveyId to string
            questionId: question.id.toString(), // Convert questionId to string
            isRandomize: true,
            groupNumber: i + 1 // Add groupNumber based on the index of randormizeEntries
          };
        });

        formattedData.push(...formattedQuestions);
      } else {
        console.warn('From Question and To Question must be selected and checkbox must be checked for each randomization entry.');
      }
    }

    if (formattedData.length > 0) {
      const serviceCall = this.isAddRandomizationMode ? this.surveyservice.postRandomizedQuestions(formattedData) : this.surveyservice.postRandomizedQuestionsUpdate(formattedData);

      serviceCall.subscribe(
        response => {
          console.log('POST request successful', response);
          this.utils.showSuccess('Randomization Created Successfully.');
        },
        error => {
          console.error('Error in POST request', error);
          this.utils.showError('Please confirm you want to randomize these questions');
        }
      );
    } else {
      console.warn('No valid range found for randomization.');
    }
    debugger
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
      questionId: questionId
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
  showBranchingElse(questionIndex: number, logicIndex: number) {
    this.isBranchingElseShow[questionIndex][logicIndex] = true
  }
  hideBranchingElse(questionIndex: number, logicIndex: number) {
    this.isBranchingElseShow[questionIndex][logicIndex] = false
  }
  //getQuestionListRandomization
  apiResponseRandomization: any[] = [];
  groupedDataRandomization: { [key: string]: any[] } = {};

  getRandomization(): void {

    this.surveyservice.getRandomizedQuestions(this.surveyId).subscribe(
      (response: any[]) => {
        // Store the API response
        console.log("randomize", response)
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
      this.isAddRandomizationMode = false
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

    this.surveyservice.uploadImageAddScreen(file, this.userId).subscribe(
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
  description: any
  youtubeUrl: any
  saveScreenImage(tab: string): void {
    if (!this.validateAddScreen(tab)) {
      this.utils.showError('Please fill all required fields.');
      return;
    }
    this.screenQuestionObj.createdDate = this.surveycreateddate
    this.screenQuestionObj.question = this.screenQuestion
    this.screenQuestionObj.description = this.description
    this.screenQuestionObj.youtubeUrl = this.youtubeUrl
    // this.screenQuestionObj.image = this.screenImage.replace(/"/g, "");
    // this.screenQuestionObj.image = this.screenImage;
    if (typeof this.screenImage === 'string') {
      this.screenQuestionObj.image = this.screenImage.replace(/"/g, "");
    } else {
      // If not defined or not a string, set image to an empty string
      this.screenQuestionObj.image = '';
    }
    if (typeof this.screenvideo === 'string') {
      this.screenQuestionObj.video = this.screenvideo.replace(/"/g, "");
    } else {
      // If not defined or not a string, set image to an empty string
      this.screenQuestionObj.video = '';
    }
    console.log("screen image", this.screenQuestionObj.image);
    this.screenQuestionObj.isScreening = this.screenRedirectUser
    this.screenQuestionObj.screeningRedirectUrl = this.screenRedirectURL
    this.screenQuestionObj.surveyTypeId = this.surveyId
    this.screenQuestionObj.questionTypeId = 21

    this.surveyservice.CreateGeneralQuestion(this.screenQuestionObj).subscribe({
      next: (resp: any) => {

        // Swal.fire('', 'Question Generated Sucessfully.', 'success');
        console.log("addscreen resp", resp)
        if (resp == '"QuestionSuccessfullyCreated"') {
          this.utils.showSuccess('Question Generated Sucessfully');

          let url = `/survey/manage-survey/${this.crypto.encryptParam("" + this.surveyId)}`;

          this.router.navigateByUrl(url);

          window.location.reload();
        } else {
          this.utils.showError(resp)
        }

      },
      error: (err: any) => {
        // Swal.fire('', err.error, 'error');
        // this.utils.showError(err);
        this.utils.showError('Error');

      }
    });
  }

  refresh() {
    this.GetSurveyDetails(this.pageSize, 1);
  }



  //new 

  checkrequired: boolean = false; // Initialize the flag
  surveyNameCheck: boolean = true
  countryNameCheck: boolean = true
  categoryNameCheck: boolean = true
  otherCategoryCheck: boolean = true
  isValidSurvey: boolean = false

  validateSurvey() {
    this.surveyNameCheck = !!this.surveyName && this.surveyName.length >= 3;
    this.categoryNameCheck = !!this.categoryId && this.categoryId !== 0;
    this.otherCategoryCheck = this.categoryId !== 10 || (!!this.categoryName && this.categoryName.length >= 3);
    this.selectedCountryId = this.selectedCountry ? this.selectedCountry.id : null;
    this.countryNameCheck = !!this.selectedCountryId;

    this.isValidSurvey = this.surveyNameCheck && this.categoryNameCheck && this.otherCategoryCheck && this.countryNameCheck;
  }

  cloneQuestion: Question = new Question();
  cloning(clonQuestionId: any) {
    this.surveyservice.cloneQuestion(clonQuestionId, this.surveyId).subscribe((data: any) => {
      //console.log("data", data)
      this.utils.showSuccess('Question Clone Successfully.');
      this.ngOnInit()
      console.log(data)

      // this.surveyservice.CreateGeneralQuestion(this.cloneQuestion).subscribe({
      //   next: (resp: any) => {
      //     this.utils.showSuccess('Question Generated Successfully.');
      //     //let url = `/survey/manage-survey/${this.crypto.encryptParam("" + this.surveyId)}`;
      //     //this.router.navigateByUrl(url);
      //     this.ngOnInit()
      //   },
      //   error: (err: any) => {
      //     this.utils.showError('error');
      //   }
      // });
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
        window.location.reload();
      },
      (error: any) => {
        this.utils.showError('Error deleting question.');
      }
    );
  }


  //and or
  isSectionAdded: boolean = false;

  showRemoveandlogic: boolean = false;

  // toggleVisibilityAnd() {
  //   this.visibleaddandlogic = !this.visibleaddandlogic;
  //   this.showRemoveandlogic = !this.showRemoveandlogic;
  //   if (!this.showRemoveandlogic)
  //     this.isAndOrLogic = false
  // }

  // //@ViewChild('cloneSection', { static: false }) cloneSection: ElementRef;
  // andOrDivClone() {
  //   this.isAndOrLogic = true
  //   // if (this.visibleaddandlogic && !this.isSectionAdded) {
  //   //   const clonedSection = this.cloneSection.nativeElement.cloneNode(true); // Clone the element
  //   //   this.cloneSection.nativeElement.parentNode.insertBefore(clonedSection, this.cloneSection.nativeElement.nextSibling); // Insert the cloned element after the original
  //   //   this.isSectionAdded = true;
  //   // }

  // }
  //logicEntryAndOr: { questionId:number | null,ifId: number | null, thanId: number | null } = { questionId:null,ifId: null, thanId: null };
  //logicEntrythenElse: { elseId: number | null, elseExpected: number | null } = { elseId: null, elseExpected: null };
  optionListByQuestionId: any
  //selectedOptions: any[] = [];

  isThanShow: boolean = true
  getOptionsByQuestionId(selectedQuestion: any, questionIndex: number, logicIndex: number) {
    this.optionListByQuestionId = ''
    console.log("selectedQuestion", selectedQuestion);
    const selectedValue = selectedQuestion;
    let queryParams = {
      qid: selectedValue
    }
    this.surveyservice.getOptionsByQuestionId(queryParams).subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);
      console.log("response ", response)

      this.optionListByQuestionId = response
      console.log("optionListByQuestionId", this.optionListByQuestionId)
      this.optionListByQuestionId = JSON.parse(this.optionListByQuestionId)
    });
  }
  addOption(event: MatChipInputEvent, questionIndex: number, logicIndex: number): void {

    const input = event.input;
    const value = event.value.trim();

    // Check if the entered value is in the available options
    const matchingOption = this.optionListByQuestionId.find((option: Option) => option.option === value);

    if (matchingOption && !this.selectedOptionsLogic.includes(matchingOption)) {
      this.selectedOptionsLogic.push(matchingOption);
    }

    if (input) {
      input.value = '';
    }
  }
  removeOption(option: any): void {
    const index = this.selectedOptions.indexOf(option);
    if (index >= 0) {
      this.selectedOptionsLogic.splice(index, 1);
    }
  }
  selectedOptionAndOrd(event: MatAutocompleteSelectedEvent, logicEntryAndOrIfId: any, questionIndex: number, logicIndex: number): void {
    console.log("logicEntryAndOrIfId ", logicEntryAndOrIfId)
    console.log("selectedOptions.length ", this.selectedOptions.length)
    const ifIdNumber = +logicEntryAndOrIfId;

    console.log("inside else")
    const selectedOption = event.option.value;
    console.log("selectedOption : ", selectedOption)
    if (!this.selectedOptions[questionIndex][logicIndex].includes(selectedOption)) {
      this.selectedOptions[questionIndex][logicIndex].push(selectedOption);
    }
    const selectedOptionsArray = this.selectedOptions[questionIndex][logicIndex];
    const selectedOptionsString = selectedOptionsArray.map((option: { id: any; }) => option.id).join(', ');
    console.log("selectedOptionsString:", selectedOptionsString);
    this.logicEntriesPerQuestion[questionIndex][logicIndex].ifExpectedAndOr = selectedOptionsString;

  }
  onLogicEntryOrIdChange(questionIndex: number, logicIndex: number): void {
    //this.selectedOptions = []; // Clear the selectedOptions array
  }
  onLogicEntryOrThanChange(thanIdSelect: any): void {
    const ifIdNumber = +thanIdSelect;
    if (ifIdNumber === 3 || ifIdNumber === 4)
      this.isThanShow = false
    else
      this.isThanShow = true

  }
  onLogicEntryOrElseChange(elseIdSelect: any, questionIndex: number, logicIndex: number): void {
    const ifIdNumber = +elseIdSelect;
    if (ifIdNumber === 3 || ifIdNumber === 4)
      this.isElseShow[questionIndex][logicIndex] = false
    else
      this.isElseShow[questionIndex][logicIndex] = true

  }
  showPopup: boolean = false;

  onSelectChangeoption(selectedValue: any) {
    // Check if the selected value matches the value that should trigger the popup
    if (selectedValue === "Show Popup") {
      this.showPopup = true;
      console.log(this.showPopup)
    } else {
      this.showPopup = false;
    }
  }
  selectedOptionsLogic: any[][] = [];
  selectedOptionsIFLogic(event: MatAutocompleteSelectedEvent, logicEntryIfId: any, questionIndex: number, logicIndex: number): void {
    const ifIdNumber = +logicEntryIfId;
    console.log("inside else")
    const selectedOption = event.option.value;
    if (!this.selectedOptionsLogic[questionIndex][logicIndex].includes(selectedOption)) {
      this.selectedOptionsLogic[questionIndex][logicIndex].push(selectedOption);

      const selectedOptionsArray = this.selectedOptionsLogic[questionIndex][logicIndex];
      const selectedOptionsString = selectedOptionsArray.map((option: { id: any; }) => option.id).join(', ');
      console.log("selectedOptionsString:", selectedOptionsString);
      this.logicEntriesPerQuestion[questionIndex][logicIndex].ifExpected = selectedOptionsString;

    }
  }
  optionListByQuestionIdLogic: any
  getOptionsByQuestionIdLogic(selectedQuestion: any) {
    this.optionListByQuestionIdLogic = ''
    console.log("selectedQuestion", selectedQuestion);
    const selectedValue = selectedQuestion;
    let queryParams = {
      qid: selectedValue
    }
    this.surveyservice.getOptionsByQuestionId(queryParams).subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);
      console.log("response ", response)

      this.optionListByQuestionIdLogic = response
      console.log("optionListByQuestionId", this.optionListByQuestionIdLogic)
      this.optionListByQuestionIdLogic = JSON.parse(this.optionListByQuestionIdLogic)
    });
  }
  removeOptionLogic(option: any, questionIndex: number, logicIndex: number): void {
    const index = this.selectedOptionsLogic[questionIndex][logicIndex].indexOf(option);
    if (index >= 0) {
      this.selectedOptionsLogic[questionIndex][logicIndex].splice(index, 1);

      const selectedOptionsArray = this.selectedOptionsLogic[questionIndex][logicIndex];
      const selectedOptionsString = selectedOptionsArray.map((option: { id: any; }) => option.id).join(', ');
      console.log("selectedOptionsString:", selectedOptionsString);
      this.logicEntriesPerQuestion[questionIndex][logicIndex].ifExpected = selectedOptionsString;

    }
  }
  onLogicEntryChange(questionIndex: number, logicIndex: number): void {
    this.selectedOptionsLogic[questionIndex][logicIndex] = []; // Clear the selectedOptions array
  }

  toggleAndOrVisibility(questionIndex: number, logicIndex: number): void {
    this.visibleaddandlogic[questionIndex][logicIndex] = !this.visibleaddandlogic[questionIndex][logicIndex];
    console.log(this.visibleaddandlogic);
    console.log("Logic Index " + logicIndex);
    this.showRemoveandlogicArray[questionIndex][logicIndex] = !this.showRemoveandlogicArray[questionIndex][logicIndex];

    if (this.showRemoveandlogicArray[questionIndex][logicIndex]) {
      this.isAndOrLogic[questionIndex][logicIndex] = true;
    } else {
      this.isAndOrLogic[questionIndex][logicIndex] = false;
    }
    if (!this.selectedOptions[questionIndex]) {
      this.selectedOptions[questionIndex] = [];
    } if (!this.selectedOptions[questionIndex][logicIndex]) {
      this.selectedOptions[questionIndex][logicIndex] = [];
    }
  }
  selectedOptions: any[][] = [];
  removeOptionAndOr(option: any, questionIndex: number, logicIndex: number): void {
    const index = this.selectedOptions[questionIndex][logicIndex].indexOf(option);
    if (index >= 0) {
      this.selectedOptions[questionIndex][logicIndex].splice(index, 1);

      const selectedOptionsArray = this.selectedOptions[questionIndex][logicIndex];
      const selectedOptionsString = selectedOptionsArray.map((option: { id: any; }) => option.id).join(', ');
      console.log("selectedOptionsString:", selectedOptionsString);
      this.logicEntriesPerQuestion[questionIndex][logicIndex].ifExpectedAndOr = selectedOptionsString;
    }
  }
  addOptionAndOr(event: MatChipInputEvent, questionIndex: number, logicIndex: number): void {
    console.log("selectedOptions Length", this.selectedOptions.length)
    const input = event.input;
    const values = event.value.trim();

    // Check if the entered value is in the available options
    const matchingOption = this.optionListByQuestionId.find((option: Option) => option.option === values);

    if (matchingOption && !this.selectedOptions.includes(matchingOption)) {
      this.selectedOptions[questionIndex][logicIndex].push(matchingOption);
    }

    if (input) {
      input.value = '';
    }
    const value = (event.value || '').trim();
    if (value) {
      if (!this.logicEntriesPerQuestion[questionIndex][logicIndex].ifExpectedAndOr) {
        this.logicEntriesPerQuestion[questionIndex][logicIndex].ifExpectedAndOr = value; // Set as new value
      } else {
        this.logicEntriesPerQuestion[questionIndex][logicIndex].ifExpectedAndOr += ', ' + value; // Append to existing value
      }
      event.input.value = ''; // Reset the input value
    }
  }


  //logic count

  logiccount: any
  getLogicCount() {
    this.userId = this.utils.getUserId();

    this.surveyservice.getLogicCount(this.surveyId).subscribe({
      next: (resp: any) => {
        console.log("logic count", resp)
        this.logiccount = resp
        console.log("check count", this.logiccount)
      },
      error: (err: any) => {
      }

    });


  }


  //add screen validation
  headingrequired: boolean = true
  descriptionrequired: boolean = true
  checkedrequired: boolean = true
  urlrequired: boolean = true
  iframerequired: boolean = true
  touched: boolean = false;


  validateAddScreen(tab: string): boolean {
    let isValid = false;
    this.touched = true;

    switch (tab) {
      case 'text':
        this.headingrequired = !!this.screenQuestion && this.screenQuestion.trim().length > 0;
        this.descriptionrequired = !!this.description && this.description.trim().length > 0;
        this.checkedrequired = !!this.screenRedirectUser;
        this.urlrequired = !!this.screenRedirectURL && this.screenRedirectURL.trim().length > 0;

        isValid = this.headingrequired && this.descriptionrequired && this.checkedrequired && this.urlrequired;
        break;

      case 'image':
        this.headingrequired = !!this.screenQuestion && this.screenQuestion.trim().length > 0;
        this.checkedrequired = !!this.screenRedirectUser;
        this.urlrequired = !!this.screenRedirectURL && this.screenRedirectURL.trim().length > 0;

        isValid = this.headingrequired && this.checkedrequired && this.urlrequired;
        break;

      case 'video':
        this.headingrequired = !!this.screenQuestion && this.screenQuestion.trim().length > 0;
        this.checkedrequired = !!this.screenRedirectUser;
        this.urlrequired = !!this.screenRedirectURL && this.screenRedirectURL.trim().length > 0;

        isValid = this.headingrequired && this.checkedrequired && this.urlrequired;
        break;

      case 'iframe':
        this.headingrequired = !!this.screenQuestion && this.screenQuestion.trim().length > 0;
        this.checkedrequired = !!this.screenRedirectUser;
        this.iframerequired = !!this.youtubeUrl && this.youtubeUrl.trim().length > 0;
        this.urlrequired = !!this.youtubeUrl && this.youtubeUrl.trim().length > 0;

        isValid = this.headingrequired && this.checkedrequired && this.urlrequired;
        break;

      default:

        break;
    }

    return isValid;
  }


  // append http
  addHttpProtocolIfMissing(): void {
    if (this.screenRedirectURL && !/^https?:\/\//i.test(this.screenRedirectURL)) {

      this.screenRedirectURL = 'http://' + this.screenRedirectURL;
    }
  }



  //upload video
  screenvideo: any
  onSelectVideo(event: any) {
    const selectedFiles: FileList = event.addedFiles;
    for (let i = 0; i < selectedFiles.length; i++) {
      this.files.push(selectedFiles[i]);
      this.uploadVideoQuestion(selectedFiles[i])
    }
  }

  uploadVideoQuestion(file: File): void {

    this.surveyservice.uploadAddScreenVideoQuestion(file, 0).subscribe(
      (response: String) => {
        console.log('Upload successful:', response);
        this.screenvideo = response
        console.log("video uploaded", this.screenvideo)
      },
      (error) => {
        console.error('Error occurred while uploading:', error);

      }
    );
  }





}
