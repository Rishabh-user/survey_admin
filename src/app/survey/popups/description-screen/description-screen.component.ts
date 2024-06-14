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


  constructor(private surveyservice: SurveyService, private route: ActivatedRoute, private crypto: CryptoService, private router: Router, private utility: UtilsService) {
    
  }

  show() {
    this.modal.show();
  }

  close() {
    this.modal.hide();
  }

}
