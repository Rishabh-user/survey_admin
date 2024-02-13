import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SurveyService } from 'src/app/service/survey.service';
import { responseGenericQuestion } from 'src/app/types/responseGenericQuestion';
import { Question } from 'src/app/models/question';
import { Option } from 'src/app/models/option';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from 'src/app/service/crypto.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-accomodation-type-popup',
  templateUrl: './accomodation-type-popup.component.html',
  styleUrls: ['./accomodation-type-popup.component.css']
})
export class AccomodationTypePopupComponent {
  @ViewChild('AccomodationTypeModal', { static: true }) modal!: ModalDirective;

  @Output() onSaveEvent = new EventEmitter();

  questions: Question[] = [];
  questionText: string = '';
  surveyId = 0;
  questionTypeId = 8
  constructor(private surveyservice: SurveyService, private route: ActivatedRoute, private crypto: CryptoService, private router: Router, private utility: UtilsService) {
    this.route.paramMap.subscribe(params => {
      let _surveyId = params.get('param1');
      console.log("param1 Inside Gender Question", params.get('param1'))
      if (_surveyId) {
        this.surveyId = parseInt(this.crypto.decryptQueryParam(_surveyId));
        console.log("surveyId Inside Working Status Question", this.surveyId)
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

  role: string;
  typeid = 35;

  accomodationtype: any[] = [];

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
    return question.id; // Assuming 'id' is a unique identifier for each question
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
        console.log("An Error occurred while fetching questions", err);
        // Handle error - show a message or perform any necessary action
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
    // Assuming 'questions' is an array containing multiple instances of the Question class

    let successfulAPICalls = 0;
    for (let i = 0; i < this.questions.length; i++) {
      const currentQuestion = this.questions[i];
      currentQuestion.questionTypeId = this.questionTypeId
      currentQuestion.surveyTypeId = this.surveyId
      currentQuestion.createdDate = this.getCurrentDateTime()
      currentQuestion.modifiedDate = this.getCurrentDateTime();
      currentQuestion.genericTypeId = this.typeid

      // Filter selected options for the current question
      currentQuestion.options = currentQuestion.options.filter(option => option.selected);
      currentQuestion.options.forEach(option => {
        option.createdDate = currentDateTime;
        option.modifiedDate = currentDateTime;
      });

      // Make an API call for each question with its selected options
      this.surveyservice.CreateGeneralQuestion(currentQuestion).subscribe({
        next: (resp: any) => {
          // Handle success response for each question
          console.log(`API call ${i + 1} successful`);
          // Add further logic if needed upon successful creation of each question
          successfulAPICalls++;

          if (successfulAPICalls === this.questions.length) {
            this.utility.showSuccess('Question Generated Successfully.');
            this.close();
            this.onSaveEvent.emit();
          }
        },
        error: (err: any) => {
          // Handle error response for each question
          console.error(`Error in API call ${i + 1}:`, err);
          // Perform any necessary actions upon error for each question
        }
      });
    }
    //window.location.reload()

  }



}
