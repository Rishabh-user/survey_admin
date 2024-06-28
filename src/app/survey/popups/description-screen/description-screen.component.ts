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
  qNo: any;
  quesserialno:any;
  files: File[] = [];
  image:any
  userid:any
  baseUrl:any
  descid:any
  imageUpdated: boolean = false;
  imageName:any;
  buttonid:any
  btnid: any;
  imageurl:any

  constructor(private surveyservice: SurveyService, private dataservice: DataService, private route: ActivatedRoute, private crypto: CryptoService, private router: Router, private utility: UtilsService) {
    this.route.paramMap.subscribe(params => {
      let _surveyId = params.get('param1');
      if (_surveyId) {
        this.surveyId = parseInt(this.crypto.decryptQueryParam(_surveyId));
      }
    });
    this.baseUrl = environment.baseURL;
    this.imageurl = environment.apiUrl
  }

  ngOnInit(): void {
    this.dataservice.currentQuestionId.subscribe(questionId => {
      this.questionId = questionId;
      
    });
    this.userid = this.utility.getUserId();

  }

  

  getQuestionDetails() {
    if (this.questionId) {
      this.surveyservice.getQuestionDetailsById(this.questionId).subscribe((data: any) => {
        this.descid = data.id;
        this.descriptiondetails = data;
        this.descques = data.question;
        this.descdescription = data.description
        this.image = data.image
        this.qNo = data.qNo

        if (data.options && Array.isArray(data.options)) {
          data.options.forEach((option: any) => {
            this.buttonid = option.id
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
      this.image ="";
      this.qNo ='';
      this.image =''
  }

  show() {

    this.modal.show();
    this.getQuestionDetails()
    this.getSerialNumber();
 
  }

  close() {
    this.modal.hide();
  }

  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }

  // continueClicked() {
  //   if (!this.validateSurvey() && this.quesserialno === 'true') {
  //     this.utility.showError('Please fill required fields.');
  //     return;
  //   }

  //   if(!this.validateSurveyDesc()){
  //     this.utility.showError("Please fill required fields.")
  //     return
  //   }
    
  //   const currentQuestion = this.questions;
  //   currentQuestion.qNo = this.qNo
  //   currentQuestion.question = this.descques;
  //   currentQuestion.description = this.descdescription;
  //   currentQuestion.surveyTypeId = this.surveyId;
  //   currentQuestion.questionTypeId = this.questionTypeId;
  //   if (this.imageUpdated) {
  //     this.imageName = this.image.split('\\').pop() || this.image;
  //   }
  //   else {
  //     this.imageName = '';
  //   }
  //   currentQuestion.image = this.imageName;
  //   currentQuestion.isRequired = false;
  //   currentQuestion.createdDate = this.getCurrentDateTime();
  //   currentQuestion.modifiedDate = this.getCurrentDateTime();
  //   currentQuestion.status = 'ACT';
  //   currentQuestion.options = [{
  //     id: 0,
  //     option: this.descbutton,
  //     image: '',
  //     createdDate: this.getCurrentDateTime(),
  //     modifiedDate: this.getCurrentDateTime(),
  //     keyword: '',
  //     status: 'ACT',
  //     isRandomize: true,
  //     isExcluded: true,
  //     group: 0,
  //     sort: 0,
  //     isFixed: true,
  //     isVisible: true,
  //     isSelected: true,
  //     selected: false
  //   }];

  //   if(this.descid > 0){
  //     this.surveyservice.updateGeneralQuestion(currentQuestion).subscribe({
  //       next: (resp: any) => {
  //         if (resp == '"QuestionSuccessfullyUpdated"') {
  //           this.utility.showSuccess('Question Updated Successfully.');
  //           this.close();
  //           this.onSaveEvent.emit();
  //         } else {
  //           this.utility.showError(resp)
  //         }
  //       },
  //       error: (err: any) => {
  //         this.utility.showError('error');
  //       }
  //     });
  //   }else{
  //     this.surveyservice.CreateGeneralQuestion(currentQuestion).subscribe({
  //       next: (resp: any) => {
  //         if (resp === '"QuestionAlreadyExits"') {
  //           this.utility.showError("This Question Already Created");
  //         }else if (resp == '"QuestionCreateFailed"') {
  //           this.utility.showError("Failed to Create Question");
  //         } else {
  //           this.utility.showSuccess('Question Generated Successfully.');
  //           this.close();
  //           this.onSaveEvent.emit();
  //         }
  //       },
  //       error: (err: any) => {
  //         console.error(err);
  //       }
  //     });
  //   }  
  // }
  continueClicked() {
    if (!this.validateSurvey() && this.quesserialno === 'true') {
      this.utility.showError('Please fill required fields.');
      return;
    }
  
    if (!this.validateSurveyDesc()) {
      this.utility.showError('Please fill required fields.');
      return;
    }
    
    const currentQuestion = this.questions;
    if(this.descid > 0){
       currentQuestion.id = this.descid
    }
    currentQuestion.qNo = this.qNo;
    currentQuestion.question = this.descques;
    currentQuestion.description = this.descdescription;
    currentQuestion.surveyTypeId = this.surveyId;
    currentQuestion.questionTypeId = this.questionTypeId;
  
    if (this.imageUpdated) {
      this.imageName = this.image.split('\\').pop() || this.image;
    } else {
      this.imageName = null;
    }
  
    currentQuestion.image = this.imageName;
    currentQuestion.isRequired = false;
    currentQuestion.createdDate = this.getCurrentDateTime();
    currentQuestion.modifiedDate = this.getCurrentDateTime();
    currentQuestion.status = 'ACT';
    if(this.buttonid > 0){
      this.btnid=this.buttonid
    }else {
      this.btnid = 0
    }
  
    // Ensure the options array is properly initialized
    currentQuestion.options = [{
      id: this.btnid,
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
  
    if (this.descid > 0) {
      this.surveyservice.updateGeneralQuestion(currentQuestion).subscribe({
        next: (resp: any) => {
          if (resp === '"QuestionSuccessfullyUpdated"') {
            this.utility.showSuccess('Question Updated Successfully.');
            this.close();
            this.onSaveEvent.emit();
          } else {
            this.utility.showError(resp);
          }
        },
        error: (err: any) => {
          console.error(err);
          this.utility.showError('Error updating question.');
        }
      });
    } else {
      this.surveyservice.CreateGeneralQuestion(currentQuestion).subscribe({
        next: (resp: any) => {
          if (resp === '"QuestionAlreadyExits"') {
            this.utility.showError("This Question Already Created");
          } else if (resp === '"QuestionCreateFailed"') {
            this.utility.showError("Failed to Create Question");
          } else {
            this.utility.showSuccess('Question Generated Successfully.');
            this.close();
            this.onSaveEvent.emit();
          }
        },
        error: (err: any) => {
          console.error(err);
          this.utility.showError('Error creating question.');
        }
      });
    }
  }
  

  getSerialNumber(){
    this.surveyservice.getQuesNumberRequired(this.surveyId).subscribe({
      next: (resp: any) => {
        if(resp){
          this.quesserialno = resp
        }
      },
      error: (err:any) =>{
        
      }
    })
  }

  getSerialNumberreq: boolean = true
  validateSurvey(): boolean {
    this.getSerialNumberreq = !!this.qNo && this.qNo.trim().length > 0;
    return this.getSerialNumberreq;
  }
 
  serialbuttonreq:boolean = true
  serialtitlereq:boolean = true
  validateSurveyDesc(): boolean {
    this.serialtitlereq = !!this.descques && this.descques.trim().length > 0;
    this.serialbuttonreq = !!this.descbutton && this.descbutton.trim().length > 0;

    return this.serialtitlereq && this.serialbuttonreq

  }

  onSelect(event: any) {
    const file = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (file) {
      this.files.push(file);
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    this.dataservice.uploadImageAboutUs(file, this.userid).subscribe(
      (response: string) => {
        this.image = response.replace(/"/g, '');
        this.imageUpdated = true;
        this.utility.showSuccess("Image Uploded Successfully");
      },
      (error) => {
        this.utility.showError("Not uploaded")
        console.error('Error occurred while uploading:', error);
      }
    );
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }



}
