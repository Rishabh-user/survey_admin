import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SurveyService } from 'src/app/service/survey.service';
import { responseDTO } from 'src/app/types/responseDTO';

@Component({
  selector: 'app-gender-popup',
  templateUrl: './gender-popup.component.html',
  styleUrls: ['./gender-popup.component.css']
})
export class GenderPopupComponent {
  @ViewChild('GenderModal', { static: true }) modal!: ModalDirective;

  constructor(private surveyservice: SurveyService) {
  }

  show(surveyId:any) {
    this.getQuestions();
  }

  close() {
    this.modal.hide();
  }

  role: string;
  typeid = 1;

  questions: any[] = [];


  getQuestions() {
    this.surveyservice.GetGenericQuestionType(this.typeid).subscribe({
      next: (resp: responseDTO[]) => {
        this.modal.show();

        console.log('Response:', resp);
        this.questions = resp.map(item => ({
          question: item.question,
          image: item.image,
          options: item.options.map((option: { id: number, option: string, image: string }) => ({
            id: option.id,
            option: option.option,
            image: option.image
          }))
        }));
      },
      error: (err) => console.log("An Error occur while fetching questions", err)
    });
  }

  selectedOptions: Set<number> = new Set<number>();


  selectAllOptions() {
    if (this.questions && this.questions.length > 0) {
      const options = this.questions[0].options;

      // Check if all options are currently selected
      const allSelected = options.every((option: { selected: any; }) => option.selected);

      // Toggle the selection based on the current state
      for (const option of options) {
        option.selected = !allSelected;
      }
    }
  }

  onContinue(){
    
  }


}
