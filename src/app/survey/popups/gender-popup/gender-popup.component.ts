import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
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
  selector: 'app-gender-popup',
  templateUrl: './gender-popup.component.html',
  styleUrls: ['./gender-popup.component.css']
})
export class GenderPopupComponent {
  @ViewChild('GenderModal', { static: true }) modal!: ModalDirective;

  @Output() onSaveEvent = new EventEmitter();


  question: Question = new Question();
  optionsArr1: any[] = [];
  optionsArr2: any[] = [];
  filteredOptions: any[] = [];
  allOptions: any[] = [];
  groups: any[] = [];
  surveyId = 0;
  questionText: string = '';
  baseUrl = '';
  constructor(private surveyservice: SurveyService, private route: ActivatedRoute, private crypto: CryptoService, private router: Router, private utility: UtilsService) {
    this.baseUrl = environment.baseURL;
    this.route.paramMap.subscribe(params => {
      let _surveyId = params.get('param1');
      console.log("param1 Inside Gender Question", params.get('param1'))
      if (_surveyId) {
        this.surveyId = parseInt(this.crypto.decryptQueryParam(_surveyId));
        console.log("surveyId Inside Gender Question", this.surveyId)
      }
    });
  }

  show(surveyId: any) {
    this.getQuestions();
    this.intializeDefaultValue()
  }

  close() {
    this.modal.hide();
  }

  role: string;
  typeid = 1;

  questions: Question[] = [];

  getQuestions() {
    this.surveyservice.getGenericQuestionType1(this.typeid).subscribe({
      next: (resp: responseGenericQuestion[]) => {
        this.modal.show();

        this.questions = resp.map(item => {
          const question = new Question();
          question.id = item.questionId;
          question.question = item.question;
          question.image = item.image || ''; // Handling null image

          // Assign other properties to the 'question' object from 'ResponseDTO' if needed

          // Assign options
          question.options = item.options.map((optionItem: { id: number, option: string, image: string }) => {
            const option = new Option();
            option.id = optionItem.id;
            option.option = optionItem.option;
            option.image = optionItem.image || ''; // Handling null image for options if required
            // Assign other properties to the 'option' object from 'ResponseDTO' if needed
            return option;
          });

          return question;
        });

        if (this.questions && this.questions.length > 0) {
          console.log('Value of questionText 1:', this.questions[0].question);
          this.questionText = this.questions[0].question;
          // Set other properties here if needed
        }
      },
      error: (err) => console.log("An Error occurred while fetching questions", err)
    });
  }
  selectOption(option: Option) {
    option.selected = !option.selected; // Toggle selection on click
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

  intializeDefaultValue() {
    console.log("Inside IntializeDefaultValue")
    this.question.questionTypeId = 7;
    this.question.surveyTypeId = this.surveyId;
    this.question.question = '';
    this.question.createdDate = this.getCurrentDateTime();
    this.question.modifiedDate = this.getCurrentDateTime();

  }
  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }

  isAtLeastOneOptionSelected(): boolean {
    return this.questions.some(question => question.options.some(option => option.selected));
  }

  onContinue() {
    if (!this.isAtLeastOneOptionSelected()) {
      this.utility.showError("Please select at least one option");
      return;
    }
    console.log('Value of questionText:', this.questionText);
    this.question.question = this.questionText;
    console.log('Value of this.question.question:', this.question.question);

    //this.question.options = this.allOptions;
    this.question.options = this.questions[0]?.options.filter(option => option.selected);
    const currentDateTime = this.getCurrentDateTime();
    this.question.options.forEach(option => {
      option.createdDate = currentDateTime;
      option.modifiedDate = currentDateTime;
    });
    this.question.genericTypeId = this.typeid
    this.surveyservice.CreateGeneralQuestion(this.question).subscribe({
      next: (resp: any) => {
        this.utility.showSuccess('Question Generated Successfully.');
        this.close();
        this.onSaveEvent.emit();
      },
      error: (err: any) => {
        this.utility.showError(err.error);
      }
    });
    console.log(this.question);

    console.log(this.question);
  }

}
