import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Question } from 'src/app/models/question';
import { CryptoService } from 'src/app/service/crypto.service';
import { SurveyService } from 'src/app/service/survey.service';
import { Option } from 'src/app/models/option';
import { responseGenericQuestion } from 'src/app/types/responseGenericQuestion';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';

interface State {
  stateId: string;
  name: string;
  isPanIndia: boolean
  selected: boolean;
}
export interface City {
  id: number;
  name: string;
  stateId: string;
  selected: boolean;
}

export interface StateCity {
  stateId: string;
  name: string;
  abbreviation: string;
  countryId: string;
  cities: City[];
}

@Component({
  selector: 'app-city-popup',
  templateUrl: './city-popup.component.html',
  styleUrls: ['./city-popup.component.css']
})
export class CityPopupComponent {
  @ViewChild('CityModal', { static: true }) modal!: ModalDirective;

  @Output() onSaveEvent = new EventEmitter();


  locations: State[] = [];
  locationsPanIndia: State[] = [];
  state: StateCity[] = [];
  isPanIndiaShow: boolean = false;
  questions: Question[] = [];
  questionTypeId = 7;
  typeid = 9
  surveyId: any
  questionText: any
  countryId: any
  qNo: any;
  quesserialno:any;
  baseUrl = '';
  constructor(private surveyservice: SurveyService, private route: ActivatedRoute, private crypto: CryptoService, private router: Router, private utility: UtilsService) {
    this.baseUrl = environment.baseURL;
    this.route.paramMap.subscribe(params => {
      let _surveyId = params.get('param1');
      if (_surveyId) {
        this.surveyId = parseInt(this.crypto.decryptQueryParam(_surveyId));
      }
    });
  }

  show() {
    this.surveyservice.getSurveyDetailsById(1, 1, this.surveyId).subscribe((data: any) => {

      this.countryId = data.countryId
      if (this.countryId == "IN")
        this.isPanIndiaShow = true
      this.surveyservice.GetStateByCountryID(this.countryId).subscribe((data) => {
        this.countries = data;
        this.locations = data[0]?.states || [];
        if (this.countryId == "IN")
          this.filterPanIndiaLocations();
      });
      this.surveyservice.GetListOfCountry(this.countryId).subscribe((data) => {
        this.state = data[0]?.states || [];

      });

      this.getQuestions();
    });
    this.modal.show();
    this.getSerialNumber()
    this.qNo =''

  }
  filterPanIndiaLocations() {
    this.locationsPanIndia = this.locations.filter(location => location.isPanIndia === true);
  }
  close() {
    this.modal.hide();
  }




  countries: any[];

  selectAllOptions() {
    const areAllSelected = this.locations.every(state => state.selected);

    this.locations.forEach(state => {
      state.selected = !areAllSelected;
    });
  }
  selectAllCityOptions(state: StateCity) {
    state.cities.forEach(city => {
      city.selected = !city.selected;
    });
  }
  getSelectedStates(): State[] {
    return this.locations.filter(state => state.selected);
  }

  getSelectedCities(): City[] {
    const selectedCities: City[] = [];
    this.state.forEach(state => {
      state.cities.forEach(city => {
        if (city.selected) {
          selectedCities.push(city);
        }
      });
    });
    return selectedCities;
  }
  getSelectedPanIndiaStates(): State[] {
    return this.locationsPanIndia.filter(state => state.selected);
  }
  isAtLeastOneOptionSelected(): boolean {
    return this.questions.some(question => question.options.some(option => option.selected));
  }

  onConfirmSelection() {


    if (!this.validateSurvey() && this.quesserialno === 'true') {
      this.utility.showError('Please fill required fields.');
      return;
    }

    const selectedStates = this.getSelectedStates();
    const selectedCities = this.getSelectedCities();
    const selectedPanIndiaStates = this.getSelectedPanIndiaStates();



    if ((selectedStates.length === 0 && selectedCities.length === 0) || (selectedStates.length > 0 && selectedCities.length > 0)) {
      this.utility.showError("Please select either state or city");
      return;
    }

    if (selectedStates.length > 0 && selectedCities.length > 0) {

      this.utility.showError('Please Select Either State Or City');
    } else if (selectedStates.length > 0 || selectedCities.length) {
      const currentDateTime = this.getCurrentDateTime();
      const currentQuestion = this.questions.length > 0 ? this.questions[0] : new Question();
      currentQuestion.qNo = this.qNo
      currentQuestion.questionTypeId = this.questionTypeId
      currentQuestion.surveyTypeId = this.surveyId
      currentQuestion.createdDate = this.getCurrentDateTime()
      currentQuestion.modifiedDate = this.getCurrentDateTime();
      currentQuestion.genericTypeId = this.typeid;
      currentQuestion.question = this.questionText;

      currentQuestion.options = currentQuestion.options.filter(option => option.selected);
      currentQuestion.options.forEach(option => {
        option.createdDate = currentDateTime;
        option.modifiedDate = currentDateTime;
      });
      if (selectedCities.length > 0) {
        const selectedCityOptions: Option[] = selectedCities.map(city => ({
          id: 0,
          option: city.name,
          image: '',
          createdDate: currentDateTime,
          modifiedDate: currentDateTime,
          keyword: '',
          status: '',
          isRandomize: false,
          isExcluded: false,
          group: null,
          sort: 0,
          selected: false,
          isVisible: false,
          isSelected: false,
          isFixed: false
        }));
        currentQuestion.options = selectedCityOptions
      } else {
        const selectedStateOptions: Option[] = selectedStates.map(city => ({
          id: 0,
          option: city.name,
          image: '',
          createdDate: currentDateTime,
          modifiedDate: currentDateTime,
          keyword: '',
          status: '',
          isRandomize: false,
          isExcluded: false,
          group: null,
          sort: 0,
          selected: false,
          isVisible: false,
          isSelected: false,
          isFixed: false
        }));
        currentQuestion.options = selectedStateOptions
      }

      this.surveyservice.CreateGeneralQuestion(currentQuestion).subscribe({
        next: (resp: any) => {
          if (resp == '"QuestionAlreadyExits"') {
            this.utility.showError("This Question Already Created ");
          }else if (resp == '"QuestionCreateFailed"') {
            this.utility.showError("Failed to Create Question");
          } else {
            this.utility.showSuccess('Question Generated Successfully.');
            this.close();
            this.onSaveEvent.emit();
          }
        },
        error: (err: any) => {

        }
      });
    } else {
      this.utility.showError('Please Select State Or City');
    }

  }
  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }
  getQuestions() {
    this.surveyservice.getGenericQuestionType1(this.typeid).subscribe({
      next: (resp: responseGenericQuestion[]) => {
        this.modal.show();

        this.questions = resp.map(item => {
          const question = new Question();
          question.id = item.questionId;
          question.question = item.question;
          question.image = item.image || '';
          return question;
        });

        if (this.questions && this.questions.length > 0) {
          this.questionText = this.questions[0].question;
        }
      },
      error: (err) => {
      }
    });
  }

  getSerialNumber(){
    this.surveyservice.getQuesNumberRequired(this.surveyId).subscribe({
      next: (resp: any) => {
        if(resp){
          console.log("ww",resp)
          this.quesserialno = resp
        }
      },
      error: (err:any) =>{
        
      }
    })
  }

  getSerialNumberreq: boolean = true
  validateSurvey(): boolean {
    this.getSerialNumberreq = !!this.qNo && this.qNo.trim().length > 0;
    return this.getSerialNumberreq;
  }


  showTooltip: { [key: string]: boolean } = {};
  currentTooltip: string | null = null;
  

  toggleTooltip(identifier: string) {

    if (this.currentTooltip && this.currentTooltip !== identifier) {
      this.showTooltip[this.currentTooltip] = false;
    }

    this.showTooltip[identifier] = !this.showTooltip[identifier];

    if (this.showTooltip[identifier]) {
      this.currentTooltip = identifier;
    } else {
      this.currentTooltip = null;
    }

  }

  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;

    if (this.currentTooltip === identifier) {
      this.currentTooltip = null;
    }

  }
}
