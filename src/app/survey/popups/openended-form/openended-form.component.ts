import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-openended-form',
  templateUrl: './openended-form.component.html',
  styleUrls: ['./openended-form.component.css']
})
export class OpenendedFormComponent {
  @ViewChild('opendendedformModal', { static: true }) modal!: ModalDirective;

  @Output() onSaveEvent = new EventEmitter();

  show(surveyId: any) {
    this.modal.show();
    
  }

  close() {
    this.modal.hide();
  }


  addFormFiled(){

  }

  removeFormField(){

  }

  
}
