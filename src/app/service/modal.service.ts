import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private openModalSubject = new BehaviorSubject<boolean>(false);

  openModal$ = this.openModalSubject.asObservable();

  constructor() { }

  triggerModal(open: boolean) {
    this.openModalSubject.next(open);
  }
  
  isModalOpen(): boolean {
    return this.openModalSubject.getValue();
  }

  closeModal() {
    this.openModalSubject.next(false); 
  }

}
