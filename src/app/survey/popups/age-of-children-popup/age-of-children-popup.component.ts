import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Question } from 'src/app/models/question';
import { CryptoService } from 'src/app/service/crypto.service';
import { SurveyService } from 'src/app/service/survey.service';
import { UtilsService } from 'src/app/service/utils.service';
import { responseDTO } from 'src/app/types/responseDTO';
import { responseGenericQuestion } from 'src/app/types/responseGenericQuestion';
import { Option } from 'src/app/models/option';

@Component({
  selector: 'app-age-of-children-popup',
  templateUrl: './age-of-children-popup.component.html',
  styleUrls: ['./age-of-children-popup.component.css']
})
export class AgeOfChildrenPopupComponent {
  @ViewChild('AgeOfChildrenModal', { static: true }) modal!: ModalDirective;

  @Output() onSaveEvent = new EventEmitter();

  questions: Question[] = [];
  questionText: string = '';
  surveyId = 0;
  questionTypeId = 7
  role: string;
  typeid = 10;
  qNo: any;
  quesserialno:any
  constructor(private surveyservice: SurveyService, private route: ActivatedRoute, private crypto: CryptoService, private router: Router, private utility: UtilsService) {
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
      currentQuestion.questionTypeName = 'Single-Select'

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
}
