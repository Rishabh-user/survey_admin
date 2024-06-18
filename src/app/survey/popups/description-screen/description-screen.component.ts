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
  selector: 'app-description-screen',
  templateUrl: './description-screen.component.html',
  styleUrls: ['./description-screen.component.css']
})
export class DescriptionScreenComponent {

  @ViewChild('DescriptionScreenModal', { static: true }) modal!: ModalDirective;
  

  @Output() onSaveEvent = new EventEmitter();
  questions: Question = new Question();
  descques:any
  descdescription:any
  descbutton:any


  constructor(private surveyservice: SurveyService, private route: ActivatedRoute, private crypto: CryptoService, private router: Router, private utility: UtilsService) {
    
  }

  show() {
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }

  continueClicked(){
    const currentQuestion = this.questions;
    currentQuestion.question = this.descques
    currentQuestion.description = this.descdescription
    currentQuestion.isRequired = true
    currentQuestion.createdDate = this.getCurrentDateTime()
    currentQuestion.modifiedDate = this.getCurrentDateTime();

    this.surveyservice.CreateGeneralQuestion(currentQuestion).subscribe({
      next: (resp: any) => {

          if (resp == '"QuestionAlreadyExits"') {
            this.utility.showError("This Question Already Created ");
          } else {
            this.utility.showSuccess('Question Generated Successfully.');
            this.close();
            this.onSaveEvent.emit();
          }
        
      },
      error: (err: any) => {
        console.error( err);
      }
    });
  }

}
