import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SurveyService } from 'src/app/service/survey.service';
import { responseDTO } from 'src/app/types/responseDTO';
import { responseGenericQuestion } from 'src/app/types/responseGenericQuestion';
import { Question } from 'src/app/models/question';
import { Option } from 'src/app/models/option';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from 'src/app/service/crypto.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-family-member-popup',
  templateUrl: './family-member-popup.component.html',
  styleUrls: ['./family-member-popup.component.css']
})
export class FamilyMemberPopupComponent {
  @ViewChild('FamilyMemberModal', { static: true }) modal!: ModalDirective;

  @Output() onSaveEvent = new EventEmitter();

  questions: Question[] = [];
  surveyId = 0;
  questionTypeId = 7;
  baseUrl = '';
  qNo: any;
  quesserialno:any;
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
    this.modal.show();
    this.getQuestions();
    this.getSerialNumber();
    this.qNo=''
  }

  close() {
    this.modal.hide();
  }


  role: string;
  typeid = 6;

  familymember: any[] = [];


  getQuestions() {
    this.surveyservice.getGenericQuestionType1(this.typeid).subscribe({
      next: (resp: responseGenericQuestion[]) => {
        this.modal.show();

        this.questions = resp.map(item => {
          const question = new Question();
          question.id = item.questionId;
          question.question = item.question;
          question.image = item.image || '';
          question.options = item.options.map((optionItem: { id: number, option: string, image: string }) => {
            const option = new Option();
            option.id = optionItem.id;
            option.option = optionItem.option;
            option.image = optionItem.image || '';
            return option;
          });

          return question;
        });
      },
      error: (err) => { }
    });
  }
  selectOption(option: Option) {
    option.selected = !option.selected;
  }
  selectedQuestionTypes: number[] = [];

  selectedOptions: Set<number> = new Set<number>();


  selectAllOptions() {
    if (this.questions && this.questions.length > 0) {
      const options = this.questions[0]?.options;
      const allSelected = options.every(option => option.selected);

      for (const option of options) {
        option.selected = !allSelected;
      }
    }
  }
  trackByFn(index: number, question: Question): number {
    return question.id;
  }

  isAtLeastOneOptionSelected(): boolean {
    return this.questions.some(question => question.options.some(option => option.selected));
  }


  continueClicked() {

    if (!this.validateSurvey() && this.quesserialno === 'true') {
      this.utility.showError('Please fill required fields.');
      return;
    }

    if (!this.isAtLeastOneOptionSelected()) {
      this.utility.showError("Please select at least one option");
      return;
    }
    const currentDateTime = this.getCurrentDateTime();

    let successfulAPICalls = 0;
    for (let i = 0; i < this.questions.length; i++) {
      const currentQuestion = this.questions[i];
      currentQuestion.qNo = this.qNo
      currentQuestion.questionTypeId = this.questionTypeId
      currentQuestion.surveyTypeId = this.surveyId
      currentQuestion.createdDate = this.getCurrentDateTime()
      currentQuestion.modifiedDate = this.getCurrentDateTime();
      currentQuestion.genericTypeId = this.typeid


      currentQuestion.options = currentQuestion.options.filter(option => option.selected);
      currentQuestion.options.forEach(option => {
        option.createdDate = currentDateTime;
        option.modifiedDate = currentDateTime;
      });

      this.surveyservice.CreateGeneralQuestion(currentQuestion).subscribe({
        next: (resp: any) => {
          successfulAPICalls++;

          if (successfulAPICalls === this.questions.length) {
            if (resp == '"QuestionAlreadyExits"') {
              this.utility.showError("This Question Already Created ");
            }else if (resp == '"QuestionCreateFailed"') {
              this.utility.showError("Failed to Create Question");
            } else {
              this.utility.showSuccess('Question Generated Successfully.');
              this.close();
              this.onSaveEvent.emit();
            }
          }
        },
        error: (err: any) => {
          console.error(`Error in API call ${i + 1}:`, err);
        }
      });
    }

  }
  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
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
