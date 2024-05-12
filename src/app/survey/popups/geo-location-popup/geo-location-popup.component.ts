import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SurveyService } from 'src/app/service/survey.service';
import { responseDTO } from 'src/app/types/responseDTO';

@Component({
  selector: 'app-geo-location-popup',
  templateUrl: './geo-location-popup.component.html',
  styleUrls: ['./geo-location-popup.component.css']
})
export class GeoLocationPopupComponent {
  @ViewChild('GeoLocationModal', { static: true }) modal!: ModalDirective;

  constructor(private surveyservice: SurveyService) {

  }

  show() {
    this.modal.show();
    this.getGeoLocation();

  }

  close() {
    this.modal.hide();
  }


  role: string;
  typeid = 17;

  geolocation: any[] = [];


  getGeoLocation() {
    this.surveyservice.GetGenericQuestionType(this.typeid).subscribe({
      next: (resp: responseDTO[]) => {
        this.geolocation = resp.map(item => ({
          question: item.question,
          image: item.image,
          options: item.options.map((option: { id: number, option: string, image: string }) => ({
            id: option.id,
            option: option.option,
            image: option.image
          }))
        }));
      },
      error: (err) => { }
    });
  }

}
