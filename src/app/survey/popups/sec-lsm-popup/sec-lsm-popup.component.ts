import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SurveyService } from 'src/app/service/survey.service';
import { responseDTO } from 'src/app/types/responseDTO';
import { responseGenericQuestion } from 'src/app/types/responseGenericQuestion';
import { Question } from 'src/app/models/question';
import { Option } from 'src/app/models/option';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from 'src/app/service/crypto.service';
import jsonData from '../../../../assets/seclsmQuestion.json';
import { UtilsService } from 'src/app/service/utils.service';


@Component({
  selector: 'app-sec-lsm-popup',
  templateUrl: './sec-lsm-popup.component.html',
  styleUrls: ['./sec-lsm-popup.component.css']
})
export class SecLsmPopupComponent {

  @ViewChild('SecLsmModal', { static: true }) modal!: ModalDirective;

  @Output() onSaveEvent = new EventEmitter();

  questions: Question[] = [];
  questionText: string = '';
  surveyId = 0;
  newOptionValue: string = '';
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
    this.getQuestionsFromFile();
  }

  close() {
    this.modal.hide();
  }

  role: string;
  typeid = 0;
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
  getQuestionsFromFile() {
    this.questions = jsonData.map((item: any) => {
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
      currentQuestion.surveyTypeId = this.surveyId;
      currentQuestion.createdDate = this.getCurrentDateTime();
      currentQuestion.modifiedDate = this.getCurrentDateTime();
      currentQuestion.genericTypeId = this.typeid;

      currentQuestion.options = currentQuestion.options.filter(option => option.selected);
      currentQuestion.options.forEach(option => {
        option.createdDate = currentDateTime;
        option.modifiedDate = currentDateTime;
      });

      const selectedOptions = currentQuestion.options.filter(option => option.selected);

      if (selectedOptions.length === 0) {
        successfulAPICalls++;

        if (successfulAPICalls === this.questions.length) {
          this.utility.showSuccess('Question Generated Successfully');
          window.location.reload()
        }

        continue;
      }

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
            this.utility.showError('Error');
          }
        });
      }, 1000 * i);
    }



  }


  addQuestion() {
    if (this.questions.length > 0) {
      const previousQuestion = this.questions[this.questions.length - 1];
      if (previousQuestion.shouldAddOption && this.newOptionValue.trim() !== '') {
        const newOption = new Option();
        newOption.id = previousQuestion.options.length + 1;
        newOption.option = this.newOptionValue;
        newOption.selected = true;

        previousQuestion.options.push(newOption);

        this.newOptionValue = '';
      }
    }

    const newQuestion = new Question();
    newQuestion.id = this.questions.length + 1;
    newQuestion.question = '';
    newQuestion.shouldAddOption = true;

    const defaultOption = new Option();
    defaultOption.id = 1;
    defaultOption.option = '';
    defaultOption.selected = true;

    newQuestion.options = [defaultOption];

    this.questions.push(newQuestion);
  }

  addOption(questionIndex: number) {

    const question = this.questions[questionIndex];

    if (question && question.shouldAddOption) {
      const newOption = new Option();
      newOption.id = question.options.length + 1;
      newOption.option = this.newOptionValue;
      newOption.selected = false;

      question.options.push(newOption);

      const previousOptionIndex = question.options.length - 2;
      if (previousOptionIndex >= 0) {
        question.options[previousOptionIndex].option = this.newOptionValue;
      }
      this.newOptionValue = '';
    }

  }
  updateNewOptionValue(event: any) {

    this.newOptionValue = (event.target as HTMLInputElement)?.value;
  }



  addNewOption(questionIndex: number) {

    const question = this.questions[questionIndex];

    if (question && question.shouldAddOption) {
      const newOption = new Option();
      newOption.id = question.options.length + 1;
      // newOption.selected = false;
      newOption.selected = true;
      question.options.push(newOption);
    }

  }
  updateOptionValue(event: any, qidx: any, oidx: any) {

    this.questions[qidx].options[oidx].option = (event.target as HTMLInputElement)?.value;
  }
}
