import { COMMA, ENTER, L } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, inject, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DataService } from 'src/app/service/data.service'; // Import your DataService
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SurveyService } from 'src/app/service/survey.service';
import { responseDTO } from 'src/app/types/responseDTO';
import { CryptoService } from 'src/app/service/crypto.service';
import { Question } from 'src/app/models/question';
import { MatrixHeader, Option } from 'src/app/models/option';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { UtilsService } from 'src/app/service/utils.service';
import { serveyOption } from 'src/app/models/serveyOption';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MatixHeaderLogics } from 'src/app/models/logic';
import { QuestionLogic } from 'src/app/models/question-logic';

@Component({
  selector: 'app-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.css'],

})
export class EditSurveyComponent {
  // Tooltip
  showTooltip: { [key: string]: boolean } = {};
  currentTooltip: string | null = null;
  // toggleTooltip(identifier: string) {
  //   this.showTooltip[identifier] = !this.showTooltip[identifier];
  // }
  // hideTooltip(identifier: string) {
  //   this.showTooltip[identifier] = false;
  // }
  // Tooltip
  toggleTooltip(identifier: string) {

    if (this.currentTooltip && this.currentTooltip !== identifier) {
      this.showTooltip[this.currentTooltip] = false;
    }

    this.showTooltip[identifier] = !this.showTooltip[identifier];

    if (this.showTooltip[identifier]) {
      this.currentTooltip = identifier;
    } else {
      this.currentTooltip = null;
    }

  }

  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;

    if (this.currentTooltip === identifier) {
      this.currentTooltip = null;
    }

  }
  @Output() onSaveEvent = new EventEmitter();
  
  public Editor = ClassicEditor;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  optionlogicifexpectedid:any;
  surveyId: any;
  questionTypeId: any;
  question: Question = new Question();
  mode: any
  questionId: any

  optionsArr1: any[] = [];
  optionsArr2: any[] = [];
  optionsArr3: any[]=[]
  matrixOptions: any[]=[];
  filteredOptions: any[] = [];
  allOptions: any[] = [];

  matrixFilteredOptions: any[] = [];
  matrixAllOptions: any[] = [];

  groups: any[] = [];
  questionImage: any
  filesImage: File[] = [];
  questionfilesImage: File[] = []
  filesVideo: File[] = [];
  logicQuestionList: any
  pipeQuestionList: any
  isLogicShow: boolean = false
  logicValuesList: any
  optionLogicValuesList: any
  optionListByQuestionId: any
  selectedOptions: Option[][] = [];
  getquestionTypeName: any
  questionsort: any
  screeningRedirectUrl: any
  optionimagennew: any[] = []
  surveystatus: any
  baseUrl = '';
  optionImage: String;
  imageUpdated: boolean = false;
  videoupload: any
  questionSummery: any
  selectedifexpected:any[]=[];
  colorCode:any
  qNo:any
  imageurl:any
  showCaption = false
  showCaptionvideo = false
  showiframeCaption = false
  numeric: boolean = false;
  alphabet: boolean = false; 
  isQNumberRequired:any;
  quesserialno:any;
  planid:any;
  matrixheaderlogics: MatixHeaderLogics = new MatixHeaderLogics();
  logicEntries: any[] = [];
  description:any;
  questionToolTip:any;
  descriptionadded:boolean= false;
  descaddededitor: boolean = false;
  optiondescpadded: boolean = false;
  optiondescp:boolean = false;
  optionmatricadded:boolean = false;
  optionmatrixdesc: boolean = false;
  matrixdescpisChecked:boolean = false;
  optiondescpisChecked:boolean = false;
  optionaloption:boolean = true;
  showCreateAnswerLogic:boolean = false;
  openendedquesreq:boolean = true;
  minLimit:any;
  textlimit: any;
  muiltiselectanslimit:number;
  multiselectlimitifid:number;
  answergroupid:any;
  multiselctanslogicid:any;

  

  constructor(public themeService: DataService, private router: Router,
    private route: ActivatedRoute, private surveyservice: SurveyService, private modalService: NgbModal,
    private crypto: CryptoService, private utility: UtilsService,private sanitizer: DomSanitizer) {
    this.baseUrl = environment.baseURL;
    this.imageurl = environment.apiUrl
    this.route.paramMap.subscribe(params => {
      let _queryData = params.get('param1');
      if (_queryData) {
        let _queryDecodedData = this.crypto.decryptQueryParam(_queryData);
        let _data = _queryDecodedData.split('_');
        this.surveyId = _data[0];
        this.questionTypeId = _data[1];
        this.mode = _data[2];
        this.questionId = _data[3]

        if (this.questionId > 1)
          this.isLogicShow = true
        if (this.mode == 'modify') {
          this.getQuestionDetails();
          this.getLogicQuestionList(this.questionId);
          this.getLogicValues()
          this.getOptionsLogicValues()
        } else {
          this.getquestionTypeName = _data[4]
          this.getLogicQuestionList(this.questionId);
        }
      }
    });
  }
  //groupedOptions: { [key: number]: { options: Option[], isRandomize: boolean, isExcluded: boolean, isFlipNumber:boolean, isRotate:boolean } } = {};
  groupedOptions: { 
    [key: number]: { 
      options: Option[], 
      isRandomize: boolean, 
      isExcluded: boolean, 
      isFlipNumber: boolean, 
      isRotate: boolean,
      optionType: string
    } 
  } = {};
  
  getQuestionDetails() {
    this.surveyservice.getQuestionDetailsById(this.questionId).subscribe((data: any) => {

      this.questionTypeId = data.questionTypeId
      this.surveyId = data.surveyTypeId
      this.question.questionTypeId = parseInt(data.questionTypeId);
      this.question.surveyTypeId = parseInt(data.surveyTypeId);
      this.question.question = data.question;
      this.question.createdDate = data.createdDate;
      this.question.modifiedDate = this.getCurrentDateTime();
      this.question.sort = data.sort
      this.question.questionTypeName = data.questionTypeName
      this.youtubeUrl = data.youtubeUrl
      this.question.image = data.image
      this.question.video = data.video
      this.question.piping = data.piping
      this.question.isGrouping = data.isGrouping
      this.textlimit = data.textLimit
      this.numeric = data.isNumeric
      this.alphabet = data.isAlphabet
      this.questionSummery = data.questionSummery
      this.screeningRedirectUrl = data.screeningRedirectUrl
      this.colorCode = data.colorCode
      this.question.isRequired = data.isRequired
      this.qNo = data.qNo
      this.isQNumberRequired = data.isQNumberRequired;
      this.description = data.description
      this.questionToolTip = data.questionToolTip;
      this.openendedquesreq = this.question.isRequired;
      this.question.openEndedType = data.openEndedType
      this.minLimit = data.minLimit;

      if(this.questionSummery){
        this.descriptionadded = true
        this.descaddededitor = true
      }else{
        this.descaddededitor = false
      }
      

      data.options.forEach((opt: any) => {

        let newOption = new serveyOption();
        newOption.id = opt.id;
        newOption.option = opt.option;
        newOption.image = opt.image;
        newOption.createdDate = opt.createdDate;
        newOption.modifiedDate = opt.modifiedDate;
        newOption.keyword = opt.keyword;
        newOption.status = opt.status;
        newOption.isFixed = opt.isFixed
        newOption.isRandomize = opt.isRandomize;
        newOption.isExcluded = opt.isExcluded;
        newOption.isFlipNumber = opt.isFlipNumber
        newOption.group = opt.group;
        newOption.sort = opt.sort;
        newOption.optionToolTip = opt.optionToolTip;
        newOption.optionDescription = opt.optionDescription;
        newOption.imageAdded = false;

        if(opt.optionDescription){
          this.optiondescpisChecked = true;
          this.optiondescp = true;
        }

        this.optionimagennew.push(opt.image)

        if (opt.status == 'ACT') {
          if (opt.isFixed)
            this.optionsArr2.push(newOption);
          else
            this.optionsArr1.push(newOption);

        }

         // Assuming newOption and opt are defined and of correct types
        console.log("opt", opt.group);  // 1
        console.log("opt grp1", this.groupedOptions[opt.group]);  // undefined
        console.log("opt grp", this.groupedOptions);  // {}

        if (opt.group > 0) {
          if (!this.groupedOptions[opt.group]) {
            if(opt.isRandomize){
              opt.optionType = 'randomize';
            }
            else if(opt.isExcluded){
              opt.optionType = 'excluded';
            }
            else if(opt.isFlipNumber){
              opt.optionType = 'flipNumber';
            }
            else if(opt.isRotate){
              opt.optionType = 'rotate';
            }
            console.log("init options", opt);
            this.groupedOptions[opt.group] = {
              options: [],  // Initialize array for the options
              isRandomize: opt.isRandomize || false,  // Set isRandomize for the group
              isExcluded: opt.isExcluded || false,
              isFlipNumber: opt.isFlipNumber || false,
              isRotate: opt.isRotate || false,  // Ensure correct property name
              optionType: opt.optionType || ''
            };
            console.log("New group created:", this.groupedOptions[opt.group]);
          }
          this.groupedOptions[opt.group].options.push(newOption);
          console.log("Updated group:", this.groupedOptions[opt.group]);
        }


      });
      data.matrixHeader.forEach((opt: any) => {
        let headerOption = new MatrixHeader();
        headerOption.id = opt.id;
        headerOption.header = opt.header
        headerOption.createdDate = opt.createdDate;
        headerOption.modifiedDate = opt.modifiedDate;
        headerOption.status = opt.status;
        headerOption.sort = opt.sort;
        headerOption.headerToolTip = opt.headerToolTip;
        headerOption.headerDescription = opt.headerDescription;

        if( opt.headerDescription){
          this.matrixdescpisChecked = true;
          this.optionmatrixdesc = true;
        }

        this.matrixOptions.push(headerOption)

      });
      this.logicquestionid = 190

      // const selectedQuestionsort = this.logicQuestionListById.find((item: { sort: any; }) => item.sort === this.question.piping);
      // if (selectedQuestionsort) {
      //   console.log("Selected Question ID:", selectedQuestionsort.id);
      //   console.log("Selected Question Name:", selectedQuestionsort.item);
      //   this.logicquestionid = selectedQuestionsort.id
      // }

      // Find the question ID based on piping value


      //console.log('Grouped Options:', this.groupedOptions);
      //console.log('length:', Object.keys(this.groupedOptions).length);
      this.filteredOptions.push(...this.optionsArr1, ...this.optionsArr2);
      this.allOptions.push(...this.optionsArr1, ...this.optionsArr2);
      this.matrixAllOptions.push(...this.matrixOptions,...this.optionsArr3)
      this.getGroupValue();
      console.log("get opt1",this.optionsArr1)
      console.log("get opt2",this.optionsArr2)
    });

  }

  getGroupValue() {
    if (this.groupedOptions && Object.keys(this.groupedOptions).length > 0) {
      for (const groupKey in this.groupedOptions) {
        if (this.groupedOptions.hasOwnProperty(groupKey)) {
          const groupOptions = this.groupedOptions[groupKey];
          const isRandomize = groupOptions.isRandomize || false;
          const isExcluded = groupOptions.isExcluded || false;
          const isFlipNumber = groupOptions.isFlipNumber || false;
          const isRotate = groupOptions.isRotate || false;

          let newGroup = {
            id: +groupKey, // Convert groupKey to number if needed
            isRandomize: isRandomize,
            isExcluded: isExcluded,
            isFlipNumber: isFlipNumber,
            isRotate: isRotate,
            options: groupOptions.options // Assign options for this group
          };

          this.groups.push(newGroup); // Push newGroup to groups array
        }
      }
    } 
    
    else {
    }
  }

  ngOnInit() {
    
    this.planid = this.utility.getPlanId();
    this.themeService.closeSideBar();
    this.getQuestionListBySurveyId();
    this.getSerialNumber();
    this.getQuestionTypes();
    this.getAllSurveyList();
    this.getMultiSelectAnsLogic();
    // this.getOptionLogics();
    this.openEndedValue();
    // this.getMatrixLogic();
    if(this.questionId > 1){
      this.getOptionLogics();
      this.getMatrixLogic();
    }

    if (this.mode != 'modify') {
      this.intializeDefaultValue();
      if (this.question.questionTypeName !== 'Rating Scale' && this.question.questionTypeName !== 'Boolean' && this.question.questionTypeName !== 'Image Selection' && this.question.questionTypeName !== 'NPS' && this.question.questionTypeName !== 'Open Ended' && this.question.questionTypeName !== 'Slider Scale') {
        this.hanldeAddOptionClick();
        this.hanldeAddOptionClick();
        this.hanldeAddOptionClick();
        this.hanldeAddOptionClickMatrix();
        this.hanldeAddOptionClickMatrix();
        this.hanldeAddOptionClickMatrix();

      }
      if(this.question.questionTypeName === 'Maxdiff'){
         this.hanldeAddOptionDiffQues();
      }
      
      if (this.question.questionTypeName === 'Rating Scale') {
        this.addStarRating();
      }
      if (this.question.questionTypeName === 'NPS') {
        this.addStarRating();
      }
      if (this.question.questionTypeName === 'Boolean') {
        this.addBoolean();
      }
      if (this.question.questionTypeName === 'Slider Scale') {
        this.addsliderscale();
      }
     

    }
    this.logicEntries.push({
      optionlogicquesid: null,
      optionlogicifid: null,
      optionlogicifexpectedid: [],
      optionlogicthanid: null,
      optionlogicthanexpectedid: null,
      optionlogicelseid: null,
      optionlogicelseexpected: null
    });
    
    this.getMultiAnsLimitValues();
    
    
  }

  onQuestionTypeClick(id: any) {
    this.questionTypeId = id;
  }

  files: File[] = [];

  optionImages: File[][] = [];
  newoptionImages: File[][] = [];

  onSelect(event: any) { // Use 'any' as the event type

    this.files.push(...event.addedFiles);
  }

  onSelectOptionImage(event: any, index: number, qid: number, oid: number): void {

    if (!this.optionImages[index]) {
      this.optionImages[index] = [];
    }

    this.optionImages[index].push(...event.addedFiles);

    this.optionsArr1[index].images = [...event.addedFiles];


    const filesForIndex = this.optionImages[index];

    if (filesForIndex && filesForIndex.length > 0) {
      const file = filesForIndex[filesForIndex.length - 1];


      if (file) {
        this.filesImage.push(file);
        this.uploadOptionImage(file, this.questionId, oid);
      } else {

      }
    } else {

    }

  }

  onSelectNewOptionImage(event: any, index: number, qid: number, oid: number): void {

    if (!this.newoptionImages[index]) {
      this.newoptionImages[index] = [];
    }

    this.newoptionImages[index].push(...event.addedFiles);


    this.optionsArr1[index].images = [...event.addedFiles];


    const filesForIndex = this.newoptionImages[index];

    if (filesForIndex && filesForIndex.length > 0) {
      const file = filesForIndex[filesForIndex.length - 1];


      if (file) {
        this.filesImage.push(file); // Store the selected file
        this.uploadOptionImage(file, this.questionId, oid); // Trigger upload after selecting the file
      } else {
        console.error("File is null or undefined.");

      }
    } else {
      console.error("No files found for the specified index.");
    }
  }


  uploadOptionImage(fileoption: File, qid: number, oid: number): void {


    this.surveyservice.uploadOptionImage(fileoption, qid, oid).subscribe(
      (response: string) => {

        // const optionIndex = this.optionsArr1.findIndex(option => option.index === oid);

        if (oid !== -1) {

          this.optionsArr1[oid].image = response.replace(/"/g, "");
          this.optionsArr1[oid].imageAdded = true;
          this.utility.showSuccess("Image Uploaded Successfully")


        } else {
          console.error('Option not found for ID:', oid);
          
        }
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
        this.utility.showError("Image not Uploaded")
      }
    );
  }






  onRemoveSelectOptionImage(event: any, index: number): void {
    if (this.optionImages[index]) {
      // Remove the image at the specified index from the array
      this.optionImages[index].splice(event, 1);
    }
  }
  onRemoveSelectNewOptionImage(event: any, index: number): void {
    if (this.newoptionImages[index]) {
      // Remove the image at the specified index from the array
      this.newoptionImages[index].splice(event, 1);
    }
  }




  categoryId: number;

  selected(event: MatAutocompleteSelectedEvent, groupIndex: number) {

    this.categoryId = event.option.value;
    let option = event.option.value;
    let optionValue = option.option;

    this.groups[groupIndex].options.push(option);


    if (option) {
      const indexToRemove = this.filteredOptions.findIndex(option => option.option === optionValue);

      if (indexToRemove !== -1) {
        this.filteredOptions.splice(indexToRemove, 1);
      } else {

      }
    }

    let groupDetail = this.groups[groupIndex];

    let indexToModify = this.allOptions.findIndex((option: any) => option.option === optionValue);
  
    if (indexToModify !== -1) {
      this.allOptions[indexToModify].group = groupDetail.id;
      this.allOptions[indexToModify].isRandomize = groupDetail.isRandomize;
      this.allOptions[indexToModify].isExcluded = groupDetail.isExcluded;
      this.allOptions[indexToModify].isFlipNumber = groupDetail.isFlipNumber;
    } else {

    }
    this.validateSurvey();

  }

  Remove(data: any, groupIndex: number) {
    let optionValue = data.option;
    const indexToRemove = this.groups[groupIndex].options.findIndex((option: any) => option.option === optionValue);

    if (indexToRemove !== -1) {
      this.groups[groupIndex].options.splice(indexToRemove, 1);

    } else {

    }
    

    this.filteredOptions.push(data);

    let indexToModify = this.allOptions.findIndex((option: any) => option.option === optionValue);
    if (indexToModify !== -1) {
      this.allOptions[indexToModify].group = 0;
      this.allOptions[indexToModify].isRandomize = false;
      this.allOptions[indexToModify].isExcluded = false;
      this.allOptions[indexToModify].isFlipNumber= false;
      this.allOptions[indexToModify].isRotate = false;
    } else {

    }
    this.validateSurvey()

  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }




  userId: any
  questionTypes: any[] = [];
  createquestionType: any[] = [];

  getQuestionTypes() {
    this.surveyservice.GetQuestionTypes().subscribe({
      next: (resp: any) => {

        this.questionTypes = resp;
        this.createquestionType = resp.type
        this.questionTypeNameGet = this.getTypeById(this.questionTypeId);
       
      },
      error: (err) => { }
    });
  }
  questionTypeNameGet: any
  getTypeById(targetId: number): string | null {

    const questionType = this.questionTypes.find(item => item.id === targetId);
    if (questionType) {

      return questionType.type;
    } else {

      return null;
    }
  }

  intializeDefaultValue() {

    this.question.questionTypeId = parseInt(this.questionTypeId);
    this.question.surveyTypeId = parseInt(this.surveyId);
    this.question.question = '';
    this.question.createdDate = this.getCurrentDateTime();
    this.question.modifiedDate = this.getCurrentDateTime();
    this.question.questionTypeName = this.getquestionTypeName

    this.filteredOptions.push(...this.optionsArr1, ...this.optionsArr2);
    this.allOptions.push(...this.optionsArr1, ...this.optionsArr2);



  }

  hanldeAddOptionClick(type: string | null = null) {

    let newOption = new serveyOption();

    newOption.createdDate = this.getCurrentDateTime();
    newOption.modifiedDate = this.getCurrentDateTime();
    this.optionaloption = false;
    

    if (type == 'other') {
      newOption.option = "Other";
      newOption.isFixed = true;
    }
    else if (type == 'noneOfAbove') {
      newOption.option = "None of above";
      newOption.isFixed = true;
    }
    else if (type == 'dontKnow') {
      newOption.option = "Don't know /Can't say";
      newOption.isFixed = true
    }
    else if (type == 'Optional') {
      newOption.option = "Other (Please specify)";
      newOption.isFixed = true
      this.question.openEndedType = "text"
    } else if (type == 'prefernottoanswer') {
      newOption.option = "Prefer not to Answer";
      newOption.isFixed = true
      this.question.openEndedType = "text"
    }
    else {
      newOption.option = "";
      newOption.status = 'ACT'
    }

    // if(type == 'Optional' || type == 'prefernottoanswer'){
    //   this.optiondescp = false
    // }

    let sort = 0;

    if (this.optionsArr1.length > 0) {
      // Find the maximum sort value in optionsArr1
      const maxSortValue1 = Math.max(...this.optionsArr1.map(option => option.sort));
      const maxSortValue2 = Math.max(...this.optionsArr2.map(option => option.sort));
      sort = (maxSortValue2 > maxSortValue1 ? maxSortValue2 : maxSortValue1) + 1;
    }

    newOption.sort = sort;


    // if (type != null) {
    //   this.optionsArr2.push(newOption);
    // } else {
    //   this.optionsArr1.push(newOption);
    // }
    this.optionsArr1.push(newOption);

    console.log("hal1",this.optionsArr1)
    console.log("hal2",this.optionsArr2)

    this.newoptionImages = [];

    this.filteredOptions = [];
    this.filteredOptions.push(...this.optionsArr1, ...this.optionsArr2);



    this.allOptions = [];
    this.allOptions.push(...this.optionsArr1, ...this.optionsArr2);

    console.log("add fixed",this.allOptions)

    // this.question.options.push(newOption);
  }

  questions: any[] = [];
  categoryNameChecks: boolean[] = [];
  categoryNameChecksRadio:boolean[]=[]
  initializeCategoryNameChecks() {
    this.categoryNameChecks = new Array(this.groups.length).fill(false);
    this.categoryNameChecksRadio = new Array(this.groups.length).fill(false);
   
  }

  optionFieldIsValid: boolean = true
  surveySubmitted: boolean = false;
  textlimitation: boolean = false
  matrixoptionvalidate: boolean = false
  validateSurvey(): boolean {
    this.initializeCategoryNameChecks();
    // Validate each field individually
    this.questionadded = !!this.question && !!this.question.question && this.question.question.trim().length > 0;
    this.qusstionaddednext = !!this.question && !!this.question.questionTypeName && this.question.questionTypeName.trim().length > 0;
    this.questionadded = !!this.question && !!this.question.question && this.question.question.trim().length > 0;
    


    // Check if categoryNameCheck validation is needed (only if a group exists)
    const atLeastOneGroupExists = this.groups.length > 0;
    if (atLeastOneGroupExists) {
      for (let i = 0; i < this.groups.length; i++) {
        const group = this.groups[i];
        if (!group.options || group.options.length === 0 ) {
          this.categoryNameChecks[i] = false;
          
          continue; // Skip to the next iteration if group.options is undefined or empty
        }
        let hasBlankOption = false;
        for (const option of group.options) {
          if (!option.option || option.option.trim() === '') {
            hasBlankOption = true;
            break; // Exit the loop once a blank or undefined value is found
          }
        }
        this.categoryNameChecks[i] = !hasBlankOption; 
        console.log("this.categoryNameChecks[i]",this.categoryNameChecks[i])
        console.log("group.isRandomize",group.isRandomize)

        
        // If no blank or undefined value found, set it to true
      }
    } else {
      // this.categoryNameCheck = true;
      this.categoryNameChecks.fill(true); // Skip validation if no groups exist
    }

    // Check if the answer input field is empty

    const isAnyOptionEmpty = this.allOptions.some(option => !option.option || option.option.trim() === '');
 
    this.isValidSurvey = this.questionadded && this.qusstionaddednext && this.categoryNameChecks.every(check => check) && !isAnyOptionEmpty ;

    return this.isValidSurvey; // Return the validation result

    
    
  }

 
  optionExists(optionText: string): boolean {
    // Check if the option already exists in optionsArr1 or optionsArr2
    return this.optionsArr1.some(option => option.option === optionText) ||
           this.optionsArr2.some(option => option.option === optionText);
  }

  onSave() {

    // Validate the survey

    if (!this.validateSurveySno() && this.quesserialno === 'true') {
      this.utility.showError('Please fill required fields.');
      return;
    }
    
    
    const isSurveyValid = this.validateSurvey();
    const isHeaderValid = this.validateHeaders()

    if (!isSurveyValid ) {
      this.utility.showError('Please fill all required fields.');
      return;
    }

    
    if(this.question.questionTypeName === 'Matrix Choice' || this.question.questionTypeName === 'Continous Sum'){
      if (!this.validateHeaders()) {
        this.utility.showError('Please fill all header fields.');
        return;
      }
    }

   

    const isAnyOptionNonUnique = (new Set(this.allOptions.map(option => option.option.trim()))).size !== this.allOptions.length;
    if (isAnyOptionNonUnique) {
      this.utility.showError('Duplicate option value.');
      return;
    }

    for (let i = 0; i < this.groups.length; i++) {
      if (this.categoryNameChecks[i] === true) {
        const group = this.groups[i];
        if (!(group.isRandomize || group.isExcluded || group.isFlipNumber || group.isRotate)) {
          // this.categoryNameChecks[i] = false;
            this.utility.showError("Select at least one radio button for group " + group.id);
            return;
          
        }
      }
    }
    

    if (this.optionExists("Other (Please specify)") || this.optionExists("Prefer not to Answer")) {
      this.question.openEndedType = "text";
    }

    // Prepare data to send
    const dataToSend = {
      name: this.question.question,
      categoryId: this.categoryId,
      countryId: this.question.questionTypeName
    };

    // Update the question properties if necessary
    if (this.groups.length > 0) {
      this.question.isGrouping = true;
    }
    if (this.questionId > 0) {
      this.question.id = this.questionId;
    }
    if (this.question.questionTypeName === 'Open Ended' && (this.question.openEndedType === '' || this.question.openEndedType === 'textarea')) {

      this.allOptions = []

      this.question.openEndedType = "textarea"

      if(this.textlimit === ''){
        this.question.textLimit = null;
      } else{
        this.question.textLimit = this.textlimit;
      }
      // this.question.textLimit = this.textlimit
    }
    if (this.question.questionTypeName === 'Auto Continues Sum') {
      this.question.textLimit = this.textlimit
    }
    // else{
    //   this.question.openEndedType = 'text'
    // }
    
  


    this.question.image = this.questionImage;
    this.question.video = this.videoupload;
    this.question.youtubeUrl = this.youtubeUrl;
    this.question.colorCode = this.colorCode
    this.question.qNo = this.qNo
    this.question.isNumeric =  this.numeric
    this.question.isAlphabet = this.alphabet;
    this.question.description = this.description;
    this.question.questionToolTip = this.questionToolTip;
    this.question.isRequired = this.openendedquesreq;
    this.question.minLimit = this.minLimit;
    

    let modifiedoptions: serveyOption[] = [];
    let matrixoption: MatrixHeader[]=[]

    this.matrixAllOptions.forEach((option: any) => {

      let headerOption = new MatrixHeader();
      headerOption.id = option.id;
      headerOption.header = option.header
      headerOption.createdDate = option.createdDate;
      headerOption.modifiedDate = option.modifiedDate;
      headerOption.status = option.status;
      headerOption.sort = option.sort;
      headerOption.headerToolTip = option.headerToolTip;
      headerOption.headerDescription = option.headerDescription;
      

      matrixoption.push(headerOption)

    });
    
    
    
    if(this.question.questionTypeName === 'Slider Scale' && this.questionId == 0) {
      this.allOptions.forEach((option,index) => {
        let modifiedOption = new serveyOption();

        modifiedOption.createdDate = option.createdDate;
        modifiedOption.group = option.group;
        modifiedOption.id = option.id;
        modifiedOption.imageAdded = option.imageAdded;
        modifiedOption.isExcluded = option.isExcluded;
        modifiedOption.isFixed = option.isFixed;
        modifiedOption.isRandomize = option.isRandomize;
        modifiedOption.isFlipNumber = option.isFlipNumber;
        modifiedOption.isRotate = option.isRotate;
        modifiedOption.isSelected = option.isSelected;
        modifiedOption.isVisible = option.isVisible;

        modifiedOption.keyword = option.keyword;
        modifiedOption.modifiedDate = option.modifiedDate;
        modifiedOption.option = option.option;
        modifiedOption.selected = option.selected;
        modifiedOption.sort = option.sort;
        modifiedOption.status = option.status;
        modifiedOption.optionToolTip = option.optionToolTip;
        // modifiedOption.optionDescription = option.optionDescription;
        if (index === 0) {
          modifiedOption.optionDescription = 'Not at all likely';
        } else if (index === this.allOptions.length - 1) {
          modifiedOption.optionDescription = 'Extremely likely';
        } else {
          modifiedOption.optionDescription = option.optionDescription;
        }
        modifiedOption.image = option.imageAdded ? option.image : null;
        modifiedoptions.push(modifiedOption);
      });
    } else if(this.question.questionTypeName === 'Slider Scale' && this.questionId >0){
      
      this.allOptions.forEach((option,index) => {
        let modifiedOption = new serveyOption();

        modifiedOption.createdDate = option.createdDate;
        modifiedOption.group = option.group;
        modifiedOption.id = option.id;
        modifiedOption.imageAdded = option.imageAdded;
        modifiedOption.isExcluded = option.isExcluded;
        modifiedOption.isFixed = option.isFixed;
        modifiedOption.isRandomize = option.isRandomize;
        modifiedOption.isFlipNumber = option.isFlipNumber;
        modifiedOption.isRotate = option.isRotate;
        modifiedOption.isSelected = option.isSelected;
        modifiedOption.isVisible = option.isVisible;

        modifiedOption.keyword = option.keyword;
        modifiedOption.modifiedDate = option.modifiedDate;
        modifiedOption.option = option.option;
        modifiedOption.selected = option.selected;
        modifiedOption.sort = option.sort;
        modifiedOption.status = option.status;
        modifiedOption.optionToolTip = option.optionToolTip;
        modifiedOption.optionDescription = option.optionDescription;
        // if (index === 0) {
        //   modifiedOption.optionDescription = 'Not at all likely';
        // } else if (index === this.allOptions.length - 1) {
        //   modifiedOption.optionDescription = 'Extremely likely';
        // } else {
        //   modifiedOption.optionDescription = option.optionDescription;
        // }
        modifiedOption.image = option.imageAdded ? option.image : null;
        modifiedoptions.push(modifiedOption);
      });
      
    } else {
      this.allOptions.forEach((option) => {
        let modifiedOption = new serveyOption();
  
        modifiedOption.createdDate = option.createdDate;
        modifiedOption.group = option.group;
        modifiedOption.id = option.id;
        modifiedOption.imageAdded = option.imageAdded;
        modifiedOption.isExcluded = option.isExcluded;
        modifiedOption.isFixed = option.isFixed;
        modifiedOption.isRandomize = option.isRandomize;
        modifiedOption.isFlipNumber = option.isFlipNumber;
        modifiedOption.isRotate = option.isRotate;
        modifiedOption.isSelected = option.isSelected;
        modifiedOption.isVisible = option.isVisible;
  
        modifiedOption.keyword = option.keyword;
        modifiedOption.modifiedDate = option.modifiedDate;
        modifiedOption.option = option.option;
        modifiedOption.selected = option.selected;
        modifiedOption.sort = option.sort;
        modifiedOption.status = option.status;
        modifiedOption.optionToolTip = option.optionToolTip;
        modifiedOption.optionDescription = option.optionDescription;
        modifiedOption.image = option.imageAdded ? option.image : null;
        modifiedoptions.push(modifiedOption);
      });
    }
    

    this.question.options = modifiedoptions;
    this.question.matrixHeader= matrixoption;
    this.question.piping = this.questionsortvalue
    this.question.questionSummery = this.questionSummery

    // Send the request based on whether it's an update or creation
    if (parseFloat(this.questionId) > 0) {
      // Update existing question
      this.surveyservice.updateGeneralQuestion(this.question).subscribe({
        next: (resp: any) => {
          this.categoryNameCheck = false;
          if(resp === '"QuestionCreateFailed"') {
            this.utility.showError('Question Created Failed')
          } else  if (resp === '"QuestionSuccessfullyUpdated"') {
            this.utility.showSuccess('Question Updated Successfully.');
            window.location.reload();
            // let url = `/survey/manage-survey/${this.crypto.encryptParam(this.surveyId)}`;
            // this.router.navigateByUrl(url);
            //  window.location.reload();
            
          } 
        },
        error: (err: any) => {
          this.utility.showError('error');
        }
      });
    } else {
      this.surveyservice.CreateGeneralQuestion(this.question).subscribe({
        next: (resp: any) => {
          this.categoryNameCheck = false;
          // this.utility.showSuccess('Question Generated Successfully.');
          // let url = `/survey/manage-survey/${this.crypto.encryptParam(this.surveyId)}`;
          // this.router.navigateByUrl(url);
          // this.onSaveEvent.emit();
          if (resp == '"QuestionCreateFailed"') {
            this.utility.showError('Failed to Create Question');
          } else if('"QuestionSuccessfullyCreated"') {
            this.utility.showSuccess('Question Generated Successfully.');
            let url = `/survey/manage-survey/${this.crypto.encryptParam(this.surveyId)}`;
            this.router.navigateByUrl(url);
            this.onSaveEvent.emit();
          }
           else {
            this.utility.showError(resp)
          }
        },
        error: (err: any) => {
          this.utility.showError('error');
        }
      });
    }


  }





  onGroupValueChange(type: string,  groupId: number) {
    debugger
    // Update the specified group directly
    let groupoption = new serveyOption();

    const groupToUpdate = this.groups.find(group => group.id === groupId);

    groupToUpdate.isRandomize = false;
    groupToUpdate.isExcluded = false;
    groupToUpdate.isFlipNumber = false;
    groupToUpdate.isRotate = false;


    console.log("groupToUpdate",groupToUpdate)

    
    if (!groupToUpdate) {
      console.error('Group not found with ID:', groupId);
      return;
    }

  

    if (type === 'randomize') {
      groupToUpdate.isRandomize = true;
      groupToUpdate.isExcluded = false;
      groupToUpdate.isFlipNumber = false;
      groupToUpdate.isRotate = false;

      this.allOptions.forEach(option => {
        if (option.group === groupId) {
          option.isRandomize = true;
          option.isExcluded = false;
          option.isFlipNumber = false;
          option.isRotate = false;
        }
      });
    } else if (type === 'excluded') {
      // groupToUpdate.isExcluded = true;
      groupToUpdate.isRandomize = false;
      groupToUpdate.isExcluded = true;
      groupToUpdate.isFlipNumber = false;
      groupToUpdate.isRotate = false;
      this.allOptions.forEach(option => {
        if (option.group === groupId) {
          // option.isExcluded = true;
          option.isRandomize = false;
          option.isExcluded = true;
          option.isFlipNumber = false;
          option.isRotate = false;
        }
      });
    } else if (type === 'flipNumber') {
      // groupToUpdate.isFlipNumber = true;
      groupToUpdate.isRandomize = false;
      groupToUpdate.isExcluded = false;
      groupToUpdate.isFlipNumber = true;
      groupToUpdate.isRotate = false;
      this.allOptions.forEach(option => {
        if (option.group === groupId) {
          // option.isFlipNumber = true;
          option.isRandomize = false;
          option.isExcluded = false;
          option.isFlipNumber = true;
          option.isRotate = false;
        }
      });
    } else if (type === 'rotate') {
      // groupToUpdate.isRotate = true;
      groupToUpdate.isRandomize = false;
      groupToUpdate.isExcluded = false;
      groupToUpdate.isFlipNumber = false;
      groupToUpdate.isRotate = true;
      this.allOptions.forEach(option => {
        if (option.group === groupId) {
          // option.isRotate = true;
          option.isRandomize = false;
          option.isExcluded = false;
          option.isFlipNumber = false;
          option.isRotate = true;
        }
      });
    }

    groupToUpdate.optionType = type;

    console.log("groupToUpdate update",groupToUpdate)

    
    this.allOptions = [...this.optionsArr1, ...this.optionsArr2];

    console.log("groupToUpdate option",this.allOptions)
    
    debugger
  }


  // onGroupValueChange(type: string, value: boolean, groupId: number) {
  //   // Update the specified group directly
  //   let groupoption = new serveyOption();

  //   const groupToUpdate = this.groups.find(group => group.id === groupId);
  //   if (!groupToUpdate) {
  //     console.error('Group not found with ID:', groupId);
  //     return;
  //   }

    


  //   if (type === 'randomize') {
  //     groupToUpdate.isRandomize = value;

  //     this.allOptions.forEach(option => {
  //       if (option.group === groupId) {
  //         option.isRandomize = true;
  //       }
  //     });
  //   } else if (type === 'excluded') {
  //     groupToUpdate.isExcluded = true;
  //     this.allOptions.forEach(option => {
  //       if (option.group === groupId) {
  //         option.isExcluded = true;
  //       }
  //     });
  //   } else if (type === 'flip') {
  //     groupToUpdate.isFlipNumber = true;
  //     this.allOptions.forEach(option => {
  //       if (option.group === groupId) {
  //         option.isFlipNumber = true;
  //       }
  //     });
  //   } else if (type === 'rotate') {
  //     groupToUpdate.isExcluded = true;
  //     this.allOptions.forEach(option => {
  //       if (option.group === groupId) {
  //         option.isExcluded = true;
  //       }
  //     });
  //   }

  //   this.allOptions = [...this.optionsArr1, ...this.optionsArr2];

  // }


  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }

  onDropOption(e: CdkDragDrop<string[]>) {
    moveItemInArray(this.optionsArr1, e.previousIndex, e.currentIndex);
    moveItemInArray(this.optionImages, e.previousIndex, e.currentIndex);


    this.optionsArr1.forEach((option, index) => {
      option.sort = index;
    });


    this.allOptions = [];
    this.allOptions.push(...this.optionsArr1, ...this.optionsArr2);
  }

  onDeleteOption(type: string, index: any) {

    if (type == 'optionArr1') {

      this.optionImages.splice(index, 1)

      this.optionsArr1.splice(index, 1);

      console.log("delete opt1",this.optionsArr1)

    } else {

      this.newoptionImages.splice(index, 1)
      this.optionsArr2.splice(index, 1);
      
      console.log("delete opt2",this.optionsArr2)

      // this.optionsArr2 = [];

    }
    this.allOptions = [];

    this.allOptions.push(...this.optionsArr1, ...this.optionsArr2);
  }


  onCreateGroup() {
    let id = 1;
    if (this.groups.length > 0) {
      let lastIndex = this.groups.length - 1;
      let lastItem = this.groups[lastIndex];
      id = ((lastItem?.id || 1) + 1);
    }
    let newGroup = {
      id: id,
      isRandomize: false,
      isExcluded: false,
      isFlipNumber: false,
      isRotate:false,
      
      options: []
    }

    this.groups.push(newGroup);

  }

  onDeleteGroup(index: number,groupid:any) {
    this.groups.splice(index, 1);
    this.categoryNameCheck = false;
 
    this.surveyservice.deleteAnwerGroup(groupid,this.questionId).subscribe({
      next: (resp:any)=> {
        if(resp === 'DeletedSuccessfully'){
            this.utility.showSuccess("Group Deleted");
            window.location.reload();
          }
        else
          this.utility.showError("Group not Deleted")
      },
      error: (err:any) => {
        this.utility.showError(err)
      }
    });
  }

 

  uploadImage(file: File): void {

    let queryParams = null;
    if (this.questionId != 0) {
      queryParams = {
        qid: this.questionId
      };
    }

    this.surveyservice.uploadImageQuestion(file, queryParams).subscribe(
      (response: String) => {

        this.questionImage = response
        this.questionImage = response.replace(/"/g, '');
        this.utility.showSuccess("uploaded succesfully");

      },
      (error) => {
        this.utility.showError("Image should in png and jpeg")
        console.error('Error occurred while uploading:', error);
        // Handle error
      }
    );
  }

  filesImageoption: File[] = [];
  onSelectOptionImageUpload(event: any) {
    const fileoption = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (fileoption) {
      this.filesImageoption.push(fileoption); // Store the selected file
      this.uploadImageOption(fileoption);

    }
  }


  uploadImageOption(fileoption: File): void {

    let queryParams = null;
    if (this.questionId != 0) {
      queryParams = {
        qid: this.questionId
      };
    }

    this.surveyservice.uploadImageQuestion(fileoption, queryParams).subscribe(
      (response: String) => {
        this.utility.showSuccess("Image Uploaded Successfully")
        this.questionImage = response
       
        //  response from the image upload
        // You may want to retrieve the URL or any other relevant information from the response
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
        // Handle error
      }
    );
  }


  // onRemoveImage(event: any) { // Use 'any' as the event type

  //   this.questionfilesImage.splice(this.files.indexOf(event), 1);
  // }

  onSelectImage(event: any) {
    const file = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (file) {
      // this.questionfilesImage.push(file);
      this.questionfilesImage = [file];
      this.uploadImage(file);
      console.log(this.questionfilesImage)
    }
  }

  onRemoveImage(event: any) {
    const index = this.questionfilesImage.indexOf(event);
    if (index > -1) {
      this.questionfilesImage.splice(index, 1);
    }
    console.log("eee",this.questionfilesImage)
    this.questionImage = ''
  }
  


  onSelectVideo(event: any) {
    const file = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (file) {
      this.filesVideo.push(file); 
      this.uploadVideo(file); 
    }
  }
  onRemoveVideo(event: any) { // Use 'any' as the event type

    this.filesVideo.splice(this.files.indexOf(event), 1);
    this.videoupload =''
  }
  uploadVideo(file: File): void {

    let queryParams = null;
    if (this.questionId != 0) {
      queryParams = {
        qid: this.questionId
      };
    }
    this.surveyservice.uploadVideoQuestion(file, queryParams).subscribe(
      (response: String) => {

        this.videoupload = response
        this.videoupload = response.replace(/"/g, '');
        this.utility.showSuccess("Uploaded Succesfully")
      },
      (error) => {
        this.utility.showError("Video not uploaded")
        console.error('Error occurred while uploading:', error);
        // Handle error
      }
    );
  }
  getLogicQuestionList(questionId: any) {
    this.logicQuestionList = '';
    const dataToSend = {
      surveyId: this.surveyId,
      questionId: questionId
    };
    this.surveyservice.getLogicQuestionList(dataToSend).subscribe((response: responseDTO) => {

      this.questionsort = this.question.sort
      this.pipeQuestionList = response
      //this.logicQuestionList = response.filter((item: Question) => item.sort < this.question.sort);
      this.logicQuestionList = this.pipeQuestionList
      console.log("logicQuestionList",this.logicQuestionList)
      if (this.logicQuestionList.length > 0) {
        this.getOptionsByQuestionId(this.logicQuestionList[0].id);
      }
    });
  }
  getLogicValues() {
    this.surveyservice.getLogicValues().subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);

      this.logicValuesList = response
    });
  }
  getOptionsLogicValues() {
    this.surveyservice.getOptionsLogicValues().subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);

      this.optionLogicValuesList = response
    });
  }

  optionselectedvalue:any
  getOptionsByQuestionId(selectedQuestion: any) {
  

    // this.selectedOptions = [];
    this.optionListByQuestionId = ''

    const selectedValue = selectedQuestion;
    this.optionselectedvalue = selectedQuestion
    console.log("qwerty",selectedQuestion)
    let queryParams = {
      qid: selectedValue
    }
    this.surveyservice.getOptionsByQuestionId(queryParams).subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);

      this.optionListByQuestionId = response
      this.optionListByQuestionId = JSON.parse(this.optionListByQuestionId)
      console.log("fff",this.optionListByQuestionId)
      // this.logicEntries.forEach((entry, index) => {
      //   this.autoSelectQuestions(entry.optionlogicifexpectedid, index);
      // });
      
    });

  }
  

  openLg(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  openLgUrl(youtubeUrl: any) {
    this.modalService.open(youtubeUrl, { size: 'lg', centered: true });
  }
  openLgImage(questionimage: any) {
    this.modalService.open(questionimage, { size: 'lg', centered: true });
  }
  openLgVideo(questionvideo: any) {
    this.modalService.open(questionvideo, { size: 'lg', centered: true });
  }
  // onLogicSave(): void {

  // }


  //validation

  questionadded: boolean = true
  qusstionaddednext: boolean = true
  answer: boolean = true
  addquestion: string;
  categoryNameCheck: boolean = true
  questionTypeName: { questionTypeName: string } = { questionTypeName: '' };
  option = {
    option: '' // Initialize option.option with an empty string
  };
  isValidSurvey: boolean = false






  onQuestionTypeClickchoice(ques: any) {
    // this.question.question = `${ques.type}`;

    this.question.questionTypeName = `${ques.type}`;
    this.questionTypeId = ques.id;
    this.question.questionTypeId = ques.id
    this.optionsArr1 = [];
    this.optionsArr2 = [];
    this.textlimit ='';
    this.minLimit ='';
    this.numeric = false;
    this.alphabet = false;


    if (this.question.questionTypeName !== 'Rating Scale' && this.question.questionTypeName !== 'Boolean' && this.question.questionTypeName !== 'Image Selection' && this.question.questionTypeName !== 'NPS' && this.question.questionTypeName !== 'Open Ended' && this.question.questionTypeName !== 'Slider Scale') {
      this.hanldeAddOptionClick();
      this.hanldeAddOptionClick();
      this.hanldeAddOptionClick();
    }
    if (this.question.questionTypeName === 'Rating Scale') {
      this.addStarRating();
    }
    if (this.question.questionTypeName === 'NPS') {
      this.addStarRating();
    }
    if (this.question.questionTypeName === 'Boolean') {
      this.addBoolean();
    }
    if (this.question.questionTypeName === 'Slider Scale') {
      this.addsliderscale();
    }
    if (this.question.questionTypeName === 'Open Ended'){
      this.openEndedValue();
    }
    this.question.isNumeric = this.numeric;
    this.question.isAlphabet = this.alphabet;

  }

  onSelectChange(event: MatSelectChange, questionSortValue: any, questionId: any) {

    //const target = event.target as HTMLSelectElement;
    const selectedValue = event.value;
    // Use selectedValue as needed

    let queryParams = null;
    // if (questionId != 0) {
    queryParams = {
      // qid: questionId,
      qid: this.questionId,
      sid: this.surveyId,
      // sordId: selectedValue,
      sordId: selectedValue,
      curntId: questionSortValue
    };

    // }

    this.surveyservice.changeQuestionPosition(queryParams).subscribe(
      (response: String) => {
        window.location.reload();
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
        // Handle error
      }
    );
  }

  idIsEqual(a: any, b: any): boolean {
    return a === b;
  }





  inputText: string = '';
  dataArray: string[] = [];

  processInputText(): void {
    // Split the input text by newline characters
    let lines = this.inputText.split('\n');

    // Remove empty elements and trim each line
    lines = lines.filter(line => line.trim() !== '');


    // Join the lines back into a single string with newline characters
    this.inputText = lines.join('\n');
  }

  getFilteredOptions() {
    
    this.filteredOptions = [];
    this.filteredOptions.push(...this.optionsArr1, ...this.optionsArr2);
    return this.filteredOptions.filter(option => option.option.trim() !== '');
  }

  addButtonClicked(): void {
    // Split the input text by newline characters and assign it to dataArray
    this.dataArray = this.inputText.split('\n').map(line => line.trim()).filter(line => line !== '');


    this.inputText = '';

    this.optionsArr1 = [];

    this.dataArray.forEach((line: string) => {
      // Check if line is not empty
      if (line) {
        let newOption = new serveyOption();
        newOption.option = line.trim();
        newOption.createdDate = this.getCurrentDateTime()

        
        this.optionsArr1.push(newOption);
        
        this.optionsArr1.forEach((option,index) => {
          option.sort = index
        })
      }
    });


    // this.allOptions.push(...this.optionsArr1, ...this.optionsArr2);
    this.allOptions = [...this.optionsArr1, ...this.optionsArr2];
  }


  // answer logic

  visibleanslogic = false
  VisibilityAnsLogic() {
    this.isLogicShow = true
    this.visibleanslogic = !this.visibleanslogic;
    console.log("this.visibleanslogic",this.visibleanslogic)
    this.getLogicQuestionList(this.questionId)
  }



  youtubeUrl: any
  addyoutubevideourl() {
    const youtubeUrl = this.youtubeUrl;
  }

  //addthen

  thenSection = false

  matrixHeaderHideThen() {
    this.thenSection = !this.thenSection;
    this.optionlogicelseid ='';
    this.optionlogicelseexpected ='';
  }

  matrixHeadeeAddThen() {
    this.thenSection = true
    
  }


  createanswerthenSection: boolean[]= []

  createanswershidethen(index:any):void {
    this.createanswerthenSection[index] = !this.createanswerthenSection[index];
    this.logicEntries[index].optionlogicelseid ='';
    this.logicEntries[index].optionlogicelseexpected ='';
  }

  createansweraddthen(index:any):void {
    this.createanswerthenSection[index] = true
    
  }

  //select all

  // selectAllOptions(groupIndex: number) {
  //   for (const option of this.filteredOptions) {
  //     this.groups[groupIndex].options.push(option);
  //   }

  //   this.filteredOptions = [];

  //   for (const option of this.groups[groupIndex].options) {
  //     const indexToModify = this.allOptions.findIndex((opt: any) => opt.option === option.option);
  //     if (indexToModify !== -1) {
  //       this.allOptions[indexToModify].group = this.groups[groupIndex].id;
  //       this.allOptions[indexToModify].isRandomize = this.groups[groupIndex].isRandomize;
  //       this.allOptions[indexToModify].isExcluded = this.groups[groupIndex].isExcluded;
  //     }
  //   }
  //   this.validateSurvey();
  // }
  selectAllOptions(groupIndex: number) {
    for (const option of this.filteredOptions) {
      // Check if the option is already in the group
      if (!this.groups[groupIndex].options.some((opt: any) => opt.option === option.option)) {
        this.groups[groupIndex].options.push(option);
      }
    }

    this.filteredOptions = [];

    for (const option of this.groups[groupIndex].options) {
      const indexToModify = this.allOptions.findIndex((opt: any) => opt.option === option.option);
      if (indexToModify !== -1) {
        this.allOptions[indexToModify].group = this.groups[groupIndex].id;
        this.allOptions[indexToModify].isRandomize = this.groups[groupIndex].isRandomize;
        this.allOptions[indexToModify].isExcluded = this.groups[groupIndex].isExcluded;
        this.allOptions[indexToModify].isFlipNumber = this.groups[groupIndex].isFlipNumber;
      }
    }
    this.validateSurvey();
  }



  //list in dropdown

  logicQuestionListById: any
  pipeQuestionListById: any
  questionsortvalue: any
  logicquestionname: any
  logicquestionid: any

  onSelectChangeByID(event: MatSelectChange): void {
    const selectedQuestionId = event.value;
    const selectedQuestion = this.logicQuestionListById.find((item: { id: any; }) => item.id === selectedQuestionId);
    if (selectedQuestion) {
    }
    this.questionsortvalue = selectedQuestion.sort
    this.logicquestionname = selectedQuestion.item

    const selectedQuestionsort = this.logicQuestionListById.find((item: { sort: any; }) => item.sort === selectedQuestion.sort);
    if (selectedQuestionsort) {
    }
    this.logicquestionid = selectedQuestionsort.id


  }


  filteredQuestionList:any[]=[]

  getQuestionListBySurveyId() {
    this.logicQuestionListById = []; // Assuming logicQuestionListById is of type responseDTO[]
    this.surveyservice.GetQuestionListBySurveyId(this.surveyId).subscribe((response: responseDTO[]) => {
      this.logicQuestionListById = response;
      this.filterQuestionsBeforeId(this.questionId);

    });
  }

  filterQuestionsBeforeId(id: number): void {
    for (let item of this.logicQuestionListById) {
      console.log("qw",this.filteredQuestionList.length)
      if (item.id == id) break;
      this.filteredQuestionList.push(item);
      
    }
  }

  starRating: any[] = [];
  addStarRating() {
    for (let i = 1; i <= 10; i++) {
      let startOption = new serveyOption();
      startOption.option = i.toString();
      startOption.id = i;
      startOption.createdDate = this.getCurrentDateTime()
      this.optionsArr1.push(startOption);
    }

    this.allOptions = [...this.optionsArr1, ...this.optionsArr2];
  }

  addBoolean() {
    const booleanValues = ['True', 'False'];

    for (let i = 0; i < booleanValues.length; i++) {
      let booleanOption = new serveyOption();
      booleanOption.option = booleanValues[i];
      booleanOption.id = i + 1;
      booleanOption.createdDate = this.getCurrentDateTime();
      this.optionsArr1.push(booleanOption);
    }

    this.allOptions = [...this.optionsArr1, ...this.optionsArr2];
  }

  sliderscale: any[] = [];
  addsliderscale() {
    for (let i = -10; i <= 10; i++) {
      let startOption = new serveyOption();
      startOption.option = i.toString();
      startOption.id = i;
      
      startOption.createdDate = this.getCurrentDateTime()
      this.optionsArr1.push(startOption);
    }

    this.allOptions = [...this.optionsArr1, ...this.optionsArr2];
  }

  openendedtype: any
  pattern: any
  openEndedValue() {
    if (this.numeric && this.alphabet) {
      this.openendedtype = 'text';
    }
    else if (this.numeric) {
      this.openendedtype = 'number';
    }
    else {
      this.openendedtype = 'text';
    }
    this.question.isNumeric = this.numeric;
    this.question.isAlphabet = this.alphabet;
  }


  getInputPattern(): string {
    return this.numeric ? '[0-9]*' : (this.alphabet ? '[a-zA-Z]*' : '');
  }


  surveyData: any[] = []
  surveyname: any[] = []
  filteredSurveyNames: any
  filteredCountryNames: any
  filteredcategoryName: any

  getAllSurveyList() {
    this.surveyservice.GetSurveyList().subscribe((data: any) => {
      this.surveyData = data.surveyType;


      const filteredSurveys = this.surveyData.filter(survey => survey.surveyId == this.surveyId);

      console.log("filteredSurveys",filteredSurveys)

      filteredSurveys.forEach((survey) => {
        this.isQNumberRequired = survey.isQNumberRequired;
      });
      

      this.filteredSurveyNames = filteredSurveys.map(survey => survey.name);


      this.filteredCountryNames = filteredSurveys.map(survey => survey.countryImage);

      this.filteredcategoryName = filteredSurveys.map(survey => survey.categoryName);

      this.surveystatus = filteredSurveys.map(survey => survey.status)

      console.log(this.filteredCountryNames,this.filteredSurveyNames,this.filteredCountryNames,this.filteredCountryNames)
    });
  }
  hanldeAddOptionClickMatrix(type: string | null = null) {
  
    let newOption = new MatrixHeader();

    newOption.createdDate = this.getCurrentDateTime();
    newOption.modifiedDate = this.getCurrentDateTime();


    if (type == 'other') {
      newOption.header = "Other";
    

    }
    else if (type == 'NoOpinion') {
      newOption.header = "No Opinion";
    
    }  else {
      newOption.header = "";
    }

    let sort = 0;

    if (this.matrixOptions.length > 0) {
      // Find the maximum sort value in optionsArr1
      const maxSortValue1 = Math.max(...this.matrixOptions.map(option => option.sort));
      const maxSortValue2 = Math.max(...this.matrixOptions.map(option => option.sort));
      sort = (maxSortValue2 > maxSortValue1 ? maxSortValue2 : maxSortValue1) + 1;
    }

    newOption.sort = sort;


    // if (type != null) {
    //   this.optionsArr1.push(newOption);
    // } else {
    //   this.optionsArr1.push(newOption);
    // }
    this.matrixOptions.push(newOption);


    this.newoptionImages = [];

    this.matrixFilteredOptions = [];
    this.matrixFilteredOptions.push(...this.matrixOptions, ...this.optionsArr3);



    this.matrixAllOptions = [];
    this.matrixAllOptions.push(...this.matrixOptions, ...this.optionsArr3);
    console.log("matrixAllOptions",this.matrixAllOptions)

    // this.question.options.push(newOption);
  }

  onDeleteMatrixOption(type: string, index: any) {

    if (type == 'optionmatrix') {


      this.matrixOptions.splice(index, 1);

    } else {
      this.optionsArr3.splice(index, 1);
      // this.optionsArr2 = [];

    }
    this.matrixAllOptions = [];

    this.matrixAllOptions.push(...this.matrixOptions, ...this.optionsArr3);
  }

  headervalidation: boolean[] = [];

  validateHeaders():boolean {

  
    this.headervalidation = [];
    
    this.matrixAllOptions.forEach((option: any,index:number) => {

      let headerOption = new MatrixHeader();
      headerOption.id = option.id;
      headerOption.header = option.header
      headerOption.createdDate = option.createdDate;
      headerOption.modifiedDate = option.modifiedDate;
      headerOption.status = option.status;
      headerOption.sort = option.sort;
      headerOption.headerToolTip = option.headerToolTip;
      headerOption.headerDescription = option.headerDescription;
      
      this.headervalidation[index] = headerOption.header === '';
      console.log("D",headerOption.header === '')
      console.log("Dd",this.headervalidation[index])

    });

    return !this.headervalidation.includes(true);
  }

  onAddLogic(){
    this.logicEntries.push({
      optionlogicquesid: null,
      optionlogicifid: null,
      optionlogicifexpectedid: [],
      optionlogicthanid: null,
      optionlogicthanexpectedid: null,
      optionlogicelseid: null,
      optionlogicelseexpected: null
    });
    //this.selectedifexpected = new Array(this.logicEntries.length).fill('');

  }


  onOptionLogicEntry(index:number) {

    if(this.logicEntries[index]?.optionlogicid) {
      this.selectedOptions[index] = [];
      this.logicEntries[index].optionlogicifexpectedid = []
     
    }
  
  }
 
  optionlogicquesid:any;
  optionlogicifid:any;
  optionlogicid:any;
  optionlogicthanid:any;
  optionlogicthanexpectedid:any;
  optionlogicelseid:any;
  optionlogicelseexpected:any;
  createanslogic:any


  onLogicSave(): void {
    this.logicEntries.forEach((entry, index) => {
     if(this.logicEntries[index].optionlogicid){
      this.createanslogic = this.logicEntries[index].optionlogicid
     }else{
      this.createanslogic = 0
     }
     console.log("value saving 3",this.logicEntries[index].optionlogicifexpectedid)
      const datatosend = {
        id: this.createanslogic,
        questionId: entry.optionlogicquesid,
        ifId: entry.optionlogicifid,
        ifExpected: entry.optionlogicifexpectedid,
        thanId: entry.optionlogicthanid,
        thanExpected: entry.optionlogicthanexpectedid,
        elseId: entry.optionlogicelseid,
        elseExpected: entry.optionlogicelseexpected,
        sort: index,  
        onLogicQuestionId: this.questionId,
        surveyId: this.surveyId
      };
  
      this.surveyservice.optionLogics(datatosend).subscribe({
        next: (resp: any) => {
          if (resp === '"UpdatedSuccessfully"') {
            this.utility.showSuccess('Updated Successfully');
            if (index === this.logicEntries.length - 1) {
              // window.location.reload();
            }
          }
        },
        error: (err: any) => {
          this.utility.showError("Not created");
        }
      });
    });
  }
  
  
  

  getoptionlogic:any[]=[]
  getOptionLogics(): void {
    
    this.surveyservice.GetOptionLogic(this.questionId, this.surveyId).subscribe((data: any[]) => {
      if (data && data.length > 0) {
        this.getoptionlogic = data[0];
        this.visibleanslogic = true
        
        console.log("datamk", data.length);
  
        this.logicEntries = data.map((response) => ({
          optionlogicid: response.id,
          optionlogicquesid: response.questionId,
          optionlogicifid: response.ifId,
          optionlogicifexpectedid: response.ifExpected,
          optionlogicthanid: response.thanId,
          optionlogicthanexpectedid: response.thanExpected,
          optionlogicelseid: response.elseId,
          optionlogicelseexpected: response.elseExpected,
          

        }));

        
  
        // Initialize createanswerthenSection and selectedOptions arrays
      
        this.createanswerthenSection = new Array(this.logicEntries.length).fill(false);
        this.selectedOptions = new Array(this.logicEntries.length).fill([]);
  
      
        this.logicEntries.forEach((entry, index) => {
          setTimeout(() => {
            this.getOptionsByQuestion(entry.optionlogicquesid, index);
          }, index * 1000);
          // Adding delay to avoid overwhelming the server
        });

        console.log("values list",this.optionListByQuestionId)
        
       
        this.logicEntries.forEach((entry, index) => {
          
          if(this.logicEntries[index].optionlogicelseid && this.logicEntries[index].optionlogicelseexpected){
            this.createanswerthenSection[index] = true;
          }
            
        });
      } else {
        // Handle empty response or error
      }
     
    });
  }
  
  getOptionsByQuestion(selectedQuestion: any, logicEntryIndex: number): void {
    debugger
    const selectedValue = selectedQuestion;
    this.optionselectedvalue = selectedQuestion;
    console.log("qwerty", selectedQuestion);
  
    let queryParams = {
      qid: selectedValue
    };
  
    this.surveyservice.getOptionsByQuestionId(queryParams).subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);
  
      this.optionListByQuestionId = response
      this.optionListByQuestionId = JSON.parse(this.optionListByQuestionId)
      console.log("fffhhh", this.optionListByQuestionId);
  
      // Use logicEntryIndex to ensure correct entry is used
      
      this.autoSelectQuestions(this.logicEntries[logicEntryIndex].optionlogicifexpectedid, logicEntryIndex);
    });
    debugger
  }
  
  autoSelectQuestions(ifExpected: any, index: number): void {
    
    console.log("optionListByQuestionIdsdd", ifExpected);
    console.log("optionListByQuestionIdsdd", index);
    console.log('optionListByQuestionIdsdd', this.optionListByQuestionId);
  
    // const selectedQuestions = this.optionListByQuestionId.filter((question: { id: any; }) =>
    //   ifExpected.includes(question.id)
    // );
    if (Array.isArray(this.optionListByQuestionId) && this.optionListByQuestionId.length > 0) {
      this.selectedOptions[index] = []
      const filteredOptions = this.optionListByQuestionId.filter((item: { id: number }) => ifExpected.includes(item.id));

      this.selectedOptions[index].push(...filteredOptions);
    }
  
    // Update selectedOptions for the correct index
    // this.selectedOptions[index] = selectedQuestions;
    console.log("optionListByQuestionIdsdd this.selectedOptions[index]", index, this.selectedOptions[index]);
   
  }

  selectOptionOneValue(event:any,index:any,optionlogicifid:any){

    
    const selectedOption = event.option.value;
  
   
    console.log('optionListByQuestionId',this.optionListByQuestionId)
  
    if (optionlogicifid == 1 || optionlogicifid == 2) {
      // Clear previous selections
      this.selectedOptions[index] = [];
      console.log("this.optionListByQuestionId[index]", this.optionListByQuestionId[index]);
      console.log("selectedOption", selectedOption);
      this.optionListByQuestionId[index].option;
      selectedOption.isSelected = true;
      
      this.logicEntries[index].optionlogicifexpectedid = selectedOption.id.toString();
    } else {
      
      this.logicEntries[index].optionlogicifexpectedid = selectedOption.id.toString();
      selectedOption.isSelected = true;
      console.log("value saving",this.logicEntries[index].optionlogicifexpectedid)
    }
    
    // Update the selection
    this.selectedOption(event, index);
  }
  
  selectedOption(event: MatAutocompleteSelectedEvent, index: number): void {
   
    const selectedOption = event.option.value;

    this.logicEntries[index].optionlogicifexpectedid=''
  
    if (!this.selectedOptions[index]) {
      this.selectedOptions[index] = [];
    }
  
    if (!this.selectedOptions[index].includes(selectedOption)) {
      this.selectedOptions[index].push(selectedOption);
      const selectedOptionsArray = this.selectedOptions[index];
      const selectedOptionsString = selectedOptionsArray.map((option: { id: any; }) => option.id).join(', ');

      this.logicEntries[index].optionlogicifexpectedid = selectedOptionsString;
      console.log("value saving 2",this.logicEntries[index].optionlogicifexpectedid)
    }

  }

  addOption(event: MatChipInputEvent, index: number): void {
    const input = event.input;
    const value = event.value.trim();

    // Ensure selectedOptions[index] is initialized
    if (!this.selectedOptions[index]) {
      this.selectedOptions[index] = [];
    }

    const matchingOption = this.optionListByQuestionId.find((option: any) => option.option === value);

    if (matchingOption && !this.selectedOptions[index].includes(matchingOption)) {
      this.selectedOptions[index].push(matchingOption);
    }

    if (input) {
      input.value = '';
    }

    // Ensure logicEntries[index] is initialized
    if (!this.logicEntries[index]) {
      this.logicEntries[index] = {};
    }

    this.logicEntries[index].optionlogicifexpectedid = this.selectedOptions[index].map(option => option.option).join(', ');
  
  }



  removeOption(option: any, index: number): void {
    console.log("option is:", option);
    console.log("selected options is:", this.selectedOptions[index]);
   
    //const indexno= this.selectedOptions[index].indexOf(option);
    //console.log("aa",indexno)

    if (index >= 0) {
      this.selectedOptions[index] = this.selectedOptions[index].filter(selectoption => selectoption.id !== option.id)

    }
    this.logicEntries[index].optionlogicifexpectedid = this.selectedOptions[index].map(selectoption =>selectoption.id).join(',')
    
    console.log("selec",this.logicEntries[index].optionlogicifexpectedid)
  
  }
  

  
  
  
  deleteOptionLogics(index:number): void {
    const id = this.logicEntries[index].optionlogicid
    console.log("id",id)
    this.surveyservice.deleteOptionLogicById(id).subscribe({
      next: (resp:any) => {

        if(resp === '"DeletedSuccessfully"'){
          this.utility.showSuccess("Deleted Successfully");
          window.location.reload();
        }

      },
      error:(err:any) => {
        this.utility.showError("Error")
      }
      
    });
  }

 

  removeAttachImage(){
    this.question.image = ''
    this.questionImage = ''
  }


  getSerialNumberreq: boolean = true

  validateSurveySno(): boolean {
    this.getSerialNumberreq = !!this.qNo && this.qNo.trim().length > 0;
    return this.getSerialNumberreq;
  }

  getSerialNumber(){
    this.surveyservice.getQuesNumberRequired(this.surveyId).subscribe({
      next: (resp: any) => {
        if(resp){
          console.log("ww",resp)
          this.quesserialno = resp
        }
      },
      error: (err:any) =>{
        
      }
    })
  }

  matrixlogicquesid:any;
  matriclogicifId:any;
  matrixlogicifexpectedid=[]
  matrixheaderthenid:any;
  matrixlogicthanexpected:any;
  matrixlogicifexpected:any
  matrixlogicelseid:any;
  matrixlogicelseexpected:any;
  selectedMatricHeaderOptions: any[] = [];

  addMatrixHeaderOption(event: MatChipInputEvent): void {

    const input = event.input;
    const value = event.value.trim();

    const matchingOption = this.matrixAllOptions.find((option: MatrixHeader) => option.header === value);

    if (matchingOption && !this.selectedMatricHeaderOptions.includes(matchingOption)) {
      this.selectedMatricHeaderOptions.push(matchingOption);
    }

    if (input) {
      input.value = '';
    }
    this.matrixlogicifexpectedid = [];
    console.log("matrix selected option",this.selectedMatricHeaderOptions);
    console.log("matrix add option",matchingOption);
    console.log("marix all",this.matrixAllOptions)

  }
  
  removeMatrixHeaderOption(option: any): void {
    const index = this.selectedMatricHeaderOptions.indexOf(option);
    if (index >= 0) {
      this.selectedMatricHeaderOptions.splice(index, 1);
    }
  }

  selectedMatrixHeaderOption(event: MatAutocompleteSelectedEvent): void {
    const selectedOption = event.option.value;

    this.matrixlogicifexpected = '';
    if (!this.selectedMatricHeaderOptions.includes(selectedOption)) {
      this.selectedMatricHeaderOptions.push(selectedOption);

      const selectedMatrixArray = this.selectedMatricHeaderOptions;
      const selectedMatrixString = selectedMatrixArray.map((option: { id: any; }) => option.id).join(', ');

      this.matrixlogicifexpected = selectedMatrixString;
    }
    // console.log("selectedMatricHeaderOptions",this.selectedMatricHeaderOptions)
    // this.matrixlogicifexpected = this.selectedMatricHeaderOptions.map((option: { id: any }) => option.id).join(', ');
    // this.matrixlogicifexpectedid = selectedOption.option;


  }

  onOptionMatrixEntry(){
    if(this.matrixlogicquesid) {

      this.selectedMatricHeaderOptions = []

    } 
  }

  createMatixLogic(): void {
    let matrixid;

    if(this.matrixlogicquesid){
       matrixid = this.matrixlogicquesid
    }else{
      matrixid = 0
    }

    

    const matrixLogics: MatixHeaderLogics = {
      id: matrixid,
      surveyId: this.surveyId,
      questionId: Number(this.questionId),
      ifId: Number(this.matriclogicifId),
      ifExpected: this.matrixlogicifexpected,
      thanId: Number(this.matrixheaderthenid),
      thanExpected: Number(this.matrixlogicthanexpected),
      elseId: Number(this.matrixlogicelseid),
      elseExpected: Number(this.matrixlogicelseexpected),
      sort: 0,
      status: 'ACT'
    };
    
    const matrixLogicsArray: MatixHeaderLogics[] = [matrixLogics];
    
    console.log(JSON.stringify(matrixLogicsArray));


    if(matrixid > 0){
      this.surveyservice.updateMatrixHeaderLogics(matrixLogicsArray).subscribe({
        next: (resp: any) => {
          if(resp == '"UpdatedSuccessfully"'){
          this.utility.showSuccess('Updated Sucessfully');
          window.location.reload()
          }
        },
        error: (err: any) => {
          this.utility.showError("Not created")
        }
      });

    }else{
      this.surveyservice.createMatrixHeaderLogics(matrixLogicsArray).subscribe({
        next: (resp: any) => {
          if(resp == '"createdSuccessfully"'){
          this.utility.showSuccess('Created Sucessfully');
          window.location.reload()
          }
        },
        error: (err: any) => {
          this.utility.showError("Not created")
        }
      });
    }
  }


  getMatrixLogic(){
    this.surveyservice.getMatrixHeaderLogics(this.surveyId,this.questionId).subscribe((data: any[]) => {
      if (data && data.length > 0) {
        console.log("data matrix",data)
        // this.visibleanslogic = true;

        console.log("data",data.length)

        this.matrixlogicquesid = data[0]?.id,
        this.matriclogicifId = data[0]?.ifId,
        this.matrixlogicifexpectedid = data[0]?.ifExpected,
        this.matrixheaderthenid=data[0]?.thanId,
        this.matrixlogicthanexpected=data[0]?.thanExpected,
        this.matrixlogicelseid=data[0]?.elseId,
        this.matrixlogicelseexpected=data[0]?.elseExpected

        if(this.matrixlogicquesid){
          this.visibleanslogic = true;
        }

        if (Array.isArray(this.matrixAllOptions) && this.matrixAllOptions.length > 0) {
          this.selectedMatricHeaderOptions = []
          const filteredOptions = this.matrixAllOptions.filter((item: { id: number }) => data[0]?.ifExpected.includes(item.id));

          this.selectedMatricHeaderOptions.push(...filteredOptions);
        }
        if(this.matrixlogicelseid && this.matrixlogicelseexpected){
          this.thenSection=true;
        }else{
          this.thenSection= false;
        }


      } else {
        // Handle empty response or error
      }
    });

  }

  deleteMatrxiOptionLogics(): void {
    this.surveyservice.deleteMartixLogic(this.matrixlogicquesid, this.questionId).subscribe({
      next: (resp:any) => {

        if(resp === '"LogicDeleteSuccessfully"'){
          this.utility.showSuccess("Deleted Successfully");
          window.location.reload();
        }

      },
      error:(err:any) => {
        this.utility.showError("Error")
      }
      
    });
  }


  
  questiontooltipadded:boolean = false;
  optiontooltipadded:boolean[] = [];
  matrixoptiontooltip:boolean[]=[];
  isOptionBlurred: boolean[] = [];

  addQuestionTooltip(){
    this.questiontooltipadded = true;

  }

  removeQuestionTooltip(){
    this.questiontooltipadded = false;
  }

  addOptionTooltip(index:any): void{
    this.optiontooltipadded[index]= true
  }
  removeOptionTooltip(index: number): void {
    this.optiontooltipadded[index] = false;
  }

  addOptionMatrixTooltip(index:any): void{
    this.matrixoptiontooltip[index]= true
  }
  removeOptionMatrixTooltip(index: number): void {
    this.matrixoptiontooltip[index] = false;
  }

  onBlurOption(index: number): void {
    this.isOptionBlurred[index] = true;
  }

  onCheckboxChange(event: any) {
    this.descriptionadded = event.target.checked;
    if(this.descriptionadded){
      this.descaddededitor = true;
    }else{
      this.descaddededitor = false;
    }
  }

  onCheckboxOptionDescp(event: any){
    this.optiondescpadded = event.target.checked;
    if(this.optiondescpadded){
      this.optiondescp = true;
    }else{
      this.optiondescp = false;
    }

  }

  onCheckboxOptionMatrix(event: any){
    this.optionmatricadded = event.target.checked;
    if(this.optionmatricadded){
      this.optionmatrixdesc = true;
    }else{
      this.optionmatrixdesc = false;
    }

  }

  onCheckboxQuesReq(event: any){
    this.openendedquesreq = event.target.checked;
    console.log("openendedquesreq",this.openendedquesreq)

  }


  hanldeAddOptionDiffQues(type: string | null = null) {
  
    // let newOption = new MatrixHeader();

    // newOption.createdDate = this.getCurrentDateTime();
    // newOption.modifiedDate = this.getCurrentDateTime();

    const qwert = [
      { header: "least appealing" ,sort: 0, createdDate: this.getCurrentDateTime(), modifiedDate: this.getCurrentDateTime(),status: 'ACT'},
      { header: "most appealing" ,sort: 1, createdDate: this.getCurrentDateTime(), modifiedDate: this.getCurrentDateTime(),status: 'ACT'}
    ];

    this.matrixOptions=[...qwert]
    
    

    let sort = 0;

    if (this.matrixOptions.length > 0) {
      // Find the maximum sort value in optionsArr1
      const maxSortValue1 = Math.max(...this.matrixOptions.map(option => option.sort));
      const maxSortValue2 = Math.max(...this.matrixOptions.map(option => option.sort));
      sort = (maxSortValue2 > maxSortValue1 ? maxSortValue2 : maxSortValue1) + 1;
    }

    // newOption.sort = sort;

    // this.matrixOptions.push(newOption);


    this.newoptionImages = [];

    this.matrixFilteredOptions = [];
    this.matrixFilteredOptions.push(...this.matrixOptions, ...this.optionsArr3);



    this.matrixAllOptions = [];
    this.matrixAllOptions.push(...this.matrixOptions, ...this.optionsArr3);
    console.log("matrixAllOptions",this.matrixAllOptions)
   
  }

  anslimit:boolean=true;
  anslimitvalues:any[]=[]

  getMultiAnsLimitValues(){
    this.surveyservice.getMultiSelectValues(false).subscribe((data:any[]) => {
      if(data && data.length > 0){
        
        this.anslimitvalues = data;
        console.log("qqqq",this.anslimitvalues);
      }
    })
  }

  validateAnsLimit(): boolean {

    return this.anslimit = Boolean(this.muiltiselectanslimit?.toString().trim());
  }

  multiSelectAnsLimit(){

    if(!this.validateAnsLimit()){
      this.utility.showError("Fill the required field")
      return
    }

    let multiselectans = new QuestionLogic();

    multiselectans.surveyId = this.surveyId;
    multiselectans.questionId = this.questionId;
    multiselectans.ifId = this.multiselectlimitifid;
    multiselectans.ifExpected = this.muiltiselectanslimit.toString();
    if(this.multiselctanslogicid>0){
      multiselectans.id = this.multiselctanslogicid
      this.surveyservice.updateLogic(multiselectans).subscribe({
        next: (resp:any) =>{
          if(resp == '"UpdatedSuccessfully"'){
            this.utility.showSuccess("Logic Updated Successfully");
            setTimeout(() => {
              window.location.reload();
            }, 500);
            
          }else{
            this.utility.showError("Logic not Updated Successfully")
          }
          
        },
        error: (err:any) =>{
          this.utility.showError(err)
        }
      })

    }else{
      this.surveyservice.createLogic(multiselectans).subscribe({
        next: (resp:any) =>{
          if(resp === '"CreatedSuccessfully"'){
            this.utility.showSuccess("Logic Created Successfully")
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }else{
            this.utility.showError("Logic not created")
          }
        },
        error: (err:any) =>{
          this.utility.showError(err)
        }
      })

    }
    
  }

  getMultiSelectAnsLogic(){
    this.surveyservice.getQuestionLogics(this.questionId,this.surveyId).subscribe((data:any[])=>{
      if(data && data.length > 0){
        this.visibleanslogic = true
        this.multiselectlimitifid = data[0].ifId;
        this.muiltiselectanslimit = data[0].ifExpected
        this.multiselctanslogicid = data[0].id;

      }
     
    })
  }


  deleteSelectAnsLimit(){
    this.surveyservice.deleteQuestionLogicById(this.multiselctanslogicid).subscribe({
      next: (resp)=> {
          this.utility.showSuccess("Logic Deleted Successfully");
          setTimeout(() => {
            window.location.reload();
          }, 500);
      },
      error: (err)=>{
        this.utility.showError(err);
      }
    })
    
  }



}
