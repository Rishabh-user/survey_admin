import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExpertAid } from 'src/app/models/expert-aid';
import { ExpertAidServices } from 'src/app/models/expert-aid-services';
import { SurveyService } from 'src/app/service/survey.service';
import { UtilsService } from 'src/app/service/utils.service';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-expert-aid',
  templateUrl: './expert-aid.component.html',
  styleUrls: ['./expert-aid.component.css']
})
export class ExpertAidComponent {
  baseUrl = '';
  showTooltip: { [key: string]: boolean } = {};
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }

  expertAid: ExpertAid = new ExpertAid();
  expertAidService: ExpertAidServices[] = [];
  validMessageLength: boolean;
  constructor(private modalService: NgbModal, private surveyservice: SurveyService, private utillService: UtilsService, private router: Router,) {
    this.baseUrl = environment.baseURL;
  }

  modalRef: NgbModalRef;

  openLg(form: any) {
    this.modalRef = this.modalService.open(form, { size: 'lg', centered: true });
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
  selectedItems: string[] = [];
  toggleCartItem(item: string): void {
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter(selectedItem => selectedItem !== item);
    } else {
      this.selectedItems.push(item);
      console.log(this.selectedItems)
    }
  }

  isSelected(item: string): boolean {
    return this.selectedItems.includes(item);
  }
  selectedItems1(item: string): boolean {
    console.log("selected one", this.selectedItems)
    return this.selectedItems.includes(item);

  }

  addToCart(item: string) {
    if (!this.selectedItems.includes(item)) {
      this.selectedItems.push(item);
    }
  }

  removeFromCart(item: string) {
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    }
  }


  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }
  selectable: boolean = true;
  removable: boolean = true;
  toggleService(service: string) {
    const index = this.selectedItems.indexOf(service);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(service);
      console.log(this.selectedItems)
    }
  }
  name: string;
  projectType: string
  startDate: string
  endDate: string
  email: string
  mobile: number
  comments: string

  onSaveExpertAid(): void {

    if (!this.validateSurvey()) {
      this.utillService.showError('Please fill all required fields.');
      return;
    }

    this.expertAid.name = this.name
    this.expertAid.projectType = this.projectType
    this.expertAid.startDate = this.startDate
    this.expertAid.endDate = this.endDate
    this.expertAid.email = this.email
    this.expertAid.mobile = this.mobile
    this.expertAid.comments = this.comments
    this.expertAid.centerId = this.utillService.getCenterId();

    this.selectedItems.forEach(item => {
      const expertAidService = new ExpertAidServices();
      expertAidService.name = item;
      expertAidService.createdDate = this.getCurrentDateTime();
      this.expertAidService.push(expertAidService);
    });

    this.expertAid.expertAidServices = this.expertAidService

    this.surveyservice.createExpertAid(this.expertAid).subscribe({
      next: (resp: any) => {
        this.utillService.showSuccess('ExpertAid Generated Sucessfully.');
        this.closeModal()
        let url = '/pages/expert-aid-list';
        this.router.navigateByUrl(url);

      },
      error: (err: any) => {
        this.utillService.showError('error');
      }
    });

  }

  information: any[] = [];
  firstname: boolean = true
  project: boolean = true
  date: boolean = true
  enddate: boolean = true
  emailaddress: boolean = true
  phone: boolean = true
  message: boolean = true
  messageRequired: boolean = false;
  messageLimitExceeded: boolean = false;
  isValidName: boolean = true;
  touched: boolean = false;
  phoneLengthError: boolean = true;


  validateSurvey(): boolean {
    this.firstname = !!this.name && this.name.trim().length > 0;
    this.project = !!this.projectType && this.projectType.trim().length > 0;
    this.date = !!this.startDate && this.startDate.trim().length > 0;
    this.enddate = !!this.endDate && this.endDate.trim().length > 0;
    this.emailaddress = !!this.email && this.email.trim().length > 0;
    this.phone = !!this.mobile && this.mobile.toString().trim().length > 0;
    this.phoneLengthError = !!this.mobile && this.mobile.toString().trim().length < 15;
    this.message = !!this.comments && this.comments.trim().length > 0;
    this.validMessageLength = !!this.comments && this.comments.trim().length > 0;
    const numberControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]);
    this.isValidName = /^[a-zA-Z\s]*$/.test(this.name);
    this.touched = true;

    const wordCount = this.comments.trim().split(/\s+/).length;
    this.validMessageLength = wordCount <= 250;


    return (
      this.firstname &&
      this.project &&
      this.date &&
      this.enddate &&
      this.emailaddress &&
      this.phone &&
      this.phoneLengthError &&
      this.message &&
      this.validMessageLength &&
      this.isValidName &&
      this.selectedItems.length > 0
    );
  }


  onSelectChange(event: MatSelectChange) {
    const selectedValue = event.value;
  }

  idIsEqual(a: any, b: any): boolean {
    return a === b;
  }

  countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }




}
