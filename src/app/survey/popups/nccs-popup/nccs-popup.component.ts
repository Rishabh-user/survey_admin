import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SurveyService } from 'src/app/service/survey.service';
import { responseDTO } from 'src/app/types/responseDTO';
import { responseGenericQuestion } from 'src/app/types/responseGenericQuestion';
import { Question } from 'src/app/models/question';
import { Option } from 'src/app/models/option';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from 'src/app/service/crypto.service';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';
import { N } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-nccs-popup',
  templateUrl: './nccs-popup.component.html',
  styleUrls: ['./nccs-popup.component.css']
})
export class NccsPopupComponent {

  @ViewChild('NccsModal', { static: true }) modal!: ModalDirective;

  @Output() onSaveEvent = new EventEmitter();

  questions: Question[] = [];
  questionText: string = '';
  surveyId = 0;
  qNo:string[] = [];
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
    this.modal.show();
    this.getQuestions();
    this.getSerialNumber();
  }

  close() {
    this.modal.hide();
  }

  role: string;
  typeid = 3;
  questionTypeId = 8;


  nccs: {
    question: string,
    image: string | null,
    options: { id: number, option: string, image: string, selected: boolean }[];
    selectAllChecked: boolean;

  }[] = [];

  selectAllOptions(questionIndex: number) {
    const question = this.questions[questionIndex];
    if (question) {
      const areAllSelected = question.options.every(option => option.selected);

      question.options.forEach(option => {
        option.selected = !areAllSelected;
      });
    }
  }
  trackByFn(index: number, question: Question): number {
    return question.id;
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

          question.options = item.options.map((optionItem: { id: number, option: string, image: string }) => {
            const option = new Option();
            option.id = optionItem.id;
            option.option = optionItem.option;
            option.image = optionItem.image || '';
            return option;
          });

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
  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }

  isAtLeastOneOptionSelected(): boolean {
    return this.questions.some(question => question.options.some(option => option.selected));
  }
  continueClicked() {

    const currentDateTime = this.getCurrentDateTime();

    // if (!this.questions.every(question => question.options.some(option => option.selected))) {
    //   this.utility.showError("Please select at least one option for each question");
    //   return;
    // }

    if (!this.questions.every(question => 
      question.id === 56 || (question.options && question.options.some(option => option.isSelected))
    )) {
        console.log("no option req");
    } else {
        console.log("options req");
    }
  

    // const questionsWithSelectedOptions = this.questions.filter(question =>
    //   question.options.some(option => option.selected)
    // );

    // if (!questionsWithSelectedOptions.every(question => question.qNo && question.qNo.trim() !== '')) {
    //   this.utility.showError("Please enter a valid question number (qNo) for all questions with selected options");
    //   return;
    // }

    let successfulAPICalls = 0;
    let delayCounter = 0;
    for (let i = 0; i < this.questions.length; i++) {

      const currentQuestion = this.questions[i];
      if (i === 1) {
        currentQuestion.questionTypeId = 7;

      } else {
        currentQuestion.questionTypeId = this.questionTypeId
      }
      
      if( i == this.questions.length -1){
        currentQuestion.isRequired = false;
        currentQuestion.openEndedType = "text";
      }
      
      currentQuestion.surveyTypeId = this.surveyId
      // currentQuestion.qNo = this.qNo
      currentQuestion.createdDate = this.getCurrentDateTime()
      currentQuestion.modifiedDate = this.getCurrentDateTime();
      currentQuestion.genericTypeId = this.typeid
      currentQuestion.genericKey = i + 1

      currentQuestion.qNo = currentQuestion.qNo || (i + 1).toString();

      console.log("currentQuestion.qNo",currentQuestion.qNo)



      currentQuestion.options = currentQuestion.options.filter(option => option.selected);
      currentQuestion.options.forEach(option => {
        option.createdDate = currentDateTime;
        option.modifiedDate = currentDateTime;

      });
      // if (!currentQuestion.options.some(option => option.selected)) {
      //   continue;
      // }
      currentQuestion.options = currentQuestion.options?.filter(option => option.selected) || [];


  

      setTimeout(() => {
        this.surveyservice.CreateGeneralQuestion(currentQuestion).subscribe({
          next: (resp: any) => {
            successfulAPICalls++;

            if (successfulAPICalls === this.questions.length) {
              this.utility.showSuccess('Question Generated Successfully.');
              this.close();
              this.onSaveEvent.emit();
            }
          },
          error: (err: any) => {
            console.error(`Error in API call ${i + 1}:`, err);
          }
        });
      }, delayCounter * 1000);
      delayCounter++;
    }
   
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

  

  showTooltip: { [key: number]: boolean } = {};
  currentTooltip: number | null = null;

  toggleTooltip(identifier: number) {
    if (this.currentTooltip !== null && this.currentTooltip !== identifier) {
      this.showTooltip[this.currentTooltip] = false;
    }

    this.showTooltip[identifier] = !this.showTooltip[identifier];

    if (this.showTooltip[identifier]) {
      this.currentTooltip = identifier;
    } else {
      this.currentTooltip = null;
    }
  }

  hideTooltip(identifier: number) {
    this.showTooltip[identifier] = false;

    if (this.currentTooltip === identifier) {
      this.currentTooltip = null;
    }
  }

  
}


