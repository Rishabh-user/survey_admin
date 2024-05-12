import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Question } from 'src/app/models/question';
import { CryptoService } from 'src/app/service/crypto.service';
import { SurveyService } from 'src/app/service/survey.service';
import { UtilsService } from 'src/app/service/utils.service';
import { responseDTO } from 'src/app/types/responseDTO';
import { responseGenericQuestion } from 'src/app/types/responseGenericQuestion';

@Component({
  selector: 'app-pin-code-popup',
  templateUrl: './pin-code-popup.component.html',
  styleUrls: ['./pin-code-popup.component.css']
})
export class PinCodePopupComponent {
  @ViewChild('PinCodeModal', { static: true }) modal!: ModalDirective;

  @Output() onSaveEvent = new EventEmitter();

  questions: Question[] = [];
  questionText: string = '';
  surveyId = 0;
  questionTypeId = 21
  role: string;
  typeid = 39;
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
  }

  close() {
    this.modal.hide();
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
  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }
  continueClicked() {

    const currentDateTime = this.getCurrentDateTime();
    let successfulAPICalls = 0;
    for (let i = 0; i < this.questions.length; i++) {
      const currentQuestion = this.questions[i];
      currentQuestion.questionTypeId = this.questionTypeId
      currentQuestion.surveyTypeId = this.surveyId
      currentQuestion.createdDate = this.getCurrentDateTime()
      currentQuestion.modifiedDate = this.getCurrentDateTime();
      currentQuestion.genericTypeId = this.typeid
      currentQuestion.openEndedType = "text"

      this.surveyservice.CreateGeneralQuestion(currentQuestion).subscribe({
        next: (resp: any) => {
          successfulAPICalls++;

          if (successfulAPICalls === this.questions.length) {
            if (resp == '"QuestionAlreadyExits"') {
              this.utility.showError("This Question Already Created ");
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


}
