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
import { DataService } from 'src/app/service/data.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { serveyOption } from 'src/app/models/serveyOption';

@Component({
  selector: 'app-description-screen',
  templateUrl: './description-screen.component.html',
  styleUrls: ['./description-screen.component.css']
})
export class DescriptionScreenComponent {

  @ViewChild('DescriptionScreenModal', { static: true }) modal!: ModalDirective;


  @Output() onSaveEvent = new EventEmitter();
  public Editor = ClassicEditor;
  questions: Question = new Question();
  descques: any
  descdescription: any
  descbutton: any
  surveyId: any
  questionTypeId = 21
  questionId: any;
  allOptions: any[] = [];
  descriptiondetails: any;


  constructor(private surveyservice: SurveyService, private dataservice: DataService, private route: ActivatedRoute, private crypto: CryptoService, private router: Router, private utility: UtilsService) {
    this.route.paramMap.subscribe(params => {
      let _surveyId = params.get('param1');
      if (_surveyId) {
        this.surveyId = parseInt(this.crypto.decryptQueryParam(_surveyId));
      }
    });

  }

  ngOnInit(): void {
    this.dataservice.currentQuestionId.subscribe(questionId => {
      this.questionId = questionId;
      console.log("DESCP", this.questionId)
      
    });

  }

  getQuestionDetails() {
    if (this.questionId) {
      this.surveyservice.getQuestionDetailsById(this.questionId).subscribe((data: any) => {

        this.descriptiondetails = data;
        this.descques = data.question;
        this.descdescription = data.description

        if (data.options && Array.isArray(data.options)) {
          data.options.forEach((option: any) => {
            this.descbutton = option.option;
          });
        }

      });
    }
    else{
      this.resetForm();
    }

  }

  resetForm(){
      this.descriptiondetails = "";
      this.descques = "";
      this.descdescription = "";
      this.descbutton = "";
  }

  show() {

    this.modal.show();
    this.getQuestionDetails()
 
  }

  close() {
    this.modal.hide();
  }

  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }

  continueClicked() {
    const currentQuestion = this.questions;
    currentQuestion.question = this.descques;
    currentQuestion.description = this.descdescription;
    currentQuestion.surveyTypeId = this.surveyId;
    currentQuestion.questionTypeId = this.questionTypeId;
    currentQuestion.isRequired = false;
    currentQuestion.createdDate = this.getCurrentDateTime();
    currentQuestion.modifiedDate = this.getCurrentDateTime();
    currentQuestion.status = 'ACT';
    currentQuestion.options = [{
      id: 0,
      option: this.descbutton,
      image: '',
      createdDate: this.getCurrentDateTime(),
      modifiedDate: this.getCurrentDateTime(),
      keyword: '',
      status: 'ACT',
      isRandomize: true,
      isExcluded: true,
      group: 0,
      sort: 0,
      isFixed: true,
      isVisible: true,
      isSelected: true,
      selected: false
    }];

    this.surveyservice.CreateGeneralQuestion(currentQuestion).subscribe({
      next: (resp: any) => {
        if (resp === '"QuestionAlreadyExits"') {
          this.utility.showError("This Question Already Created");
        }else if (resp == '"QuestionCreateFailed"') {
          this.utility.showError("Failed to Create Question");
        } else {
          this.utility.showSuccess('Question Generated Successfully.');
          this.close();
          this.onSaveEvent.emit();
        }
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }


}
