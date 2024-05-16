import { COMMA, ENTER } from '@angular/cdk/keycodes';
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
import { Option } from 'src/app/models/option';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { UtilsService } from 'src/app/service/utils.service';
import { serveyOption } from 'src/app/models/serveyOption';

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

  separatorKeysCodes: number[] = [ENTER, COMMA];

  surveyId: any;
  questionTypeId: any;
  question: Question = new Question();
  mode: any
  questionId: any

  optionsArr1: any[] = [];
  optionsArr2: any[] = [];
  filteredOptions: any[] = [];
  allOptions: any[] = [];
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
  selectedOptions: any[] = [];
  getquestionTypeName: any
  questionsort: any
  screeningRedirectUrl: any
  optionimagennew: any[] = []
  surveystatus: any
  baseUrl = '';
  optionImage: String;
  imageUpdated: boolean = false;
  videoupload: any

  constructor(public themeService: DataService, private router: Router,
    private route: ActivatedRoute, private surveyservice: SurveyService, private modalService: NgbModal,
    private crypto: CryptoService, private utility: UtilsService) {
    this.baseUrl = environment.baseURL;
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
  groupedOptions: { [key: number]: { options: Option[], isRandomize: boolean, isExcluded: boolean } } = {};
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
      this.screeningRedirectUrl = data.screeningRedirectUrl


      data.options.forEach((opt: any) => {

        let newOption = new serveyOption();
        newOption.id = opt.id;
        newOption.option = opt.option;
        newOption.image = opt.image;
        newOption.createdDate = opt.createdDate;
        newOption.modifiedDate = opt.modifiedDate;
        newOption.keyword = opt.keyword;
        newOption.status = opt.status;
        newOption.isRandomize = opt.isRandomize;
        newOption.isExcluded = opt.isExcluded;
        newOption.group = opt.group;
        newOption.sort = opt.sort;
        newOption.imageAdded = false;

        this.optionimagennew.push(opt.image)

        if (opt.status == 'ACT') {
          if (opt.isFixed)
            this.optionsArr2.push(newOption);
          else
            this.optionsArr1.push(newOption);

        }


        if (opt.group > 0) {
          if (!this.groupedOptions[opt.group]) {
            this.groupedOptions[opt.group] = {
              options: [], // Initialize array for the options
              isRandomize: opt.isRandomize || false, // Set isRandomize for the group
              isExcluded: opt.isExcluded || false, // Set isExcluded for the group
            };
          }
          this.groupedOptions[opt.group].options.push(newOption);
        }

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
      this.getGroupValue();


    });

  }

  getGroupValue() {
    if (this.groupedOptions && Object.keys(this.groupedOptions).length > 0) {
      for (const groupKey in this.groupedOptions) {
        if (this.groupedOptions.hasOwnProperty(groupKey)) {
          const groupOptions = this.groupedOptions[groupKey];
          const isRandomize = groupOptions.isRandomize || false;
          const isExcluded = groupOptions.isExcluded || false;

          let newGroup = {
            id: +groupKey, // Convert groupKey to number if needed
            isRandomize: isRandomize,
            isExcluded: isExcluded,
            options: groupOptions.options // Assign options for this group
          };

          this.groups.push(newGroup); // Push newGroup to groups array
        }
      }

    } else {
    }
  }

  ngOnInit() {

    this.themeService.closeSideBar();
    this.getQuestionListBySurveyId();
    this.getQuestionTypes();

    if (this.mode != 'modify') {
      this.intializeDefaultValue();
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

    }
    this.getAllSurveyList();



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
    debugger
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
    debugger


    this.surveyservice.uploadOptionImage(fileoption, qid, oid).subscribe(
      (response: string) => {

        // const optionIndex = this.optionsArr1.findIndex(option => option.index === oid);

        if (oid !== -1) {

          this.optionsArr1[oid].image = response.replace(/"/g, "");
          this.optionsArr1[oid].imageAdded = true;


        } else {
          console.error('Option not found for ID:', oid);
        }
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
      }
    );
    debugger
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
    } else {

    }

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
    } else {

    }

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


    if (type == 'other') {
      newOption.option = "Other";
      newOption.isFixed = true

    }
    else if (type == 'noneOfAbove') {
      newOption.option = "None of above";
      newOption.isFixed = true
    }
    else if (type == 'dontKnow') {
      newOption.option = "Don't know /Can't say";
      newOption.isFixed = true
    }
    else if (type == 'Optional') {
      newOption.option = "Other (Please specify)";
      newOption.isFixed = true
      this.question.openEndedType = "text"
    }
    else {
      newOption.option = "";
      newOption.status = 'ACT'
    }

    let sort = 0;

    if (this.optionsArr1.length > 0) {
      // Find the maximum sort value in optionsArr1
      const maxSortValue1 = Math.max(...this.optionsArr1.map(option => option.sort));
      const maxSortValue2 = Math.max(...this.optionsArr2.map(option => option.sort));
      sort = (maxSortValue2 > maxSortValue1 ? maxSortValue2 : maxSortValue1) + 1;
    }

    newOption.sort = sort;


    // if (type != null) {
    //   this.optionsArr1.push(newOption);
    // } else {
    //   this.optionsArr1.push(newOption);
    // }
    this.optionsArr1.push(newOption);


    this.newoptionImages = [];

    this.filteredOptions = [];
    this.filteredOptions.push(...this.optionsArr1, ...this.optionsArr2);



    this.allOptions = [];
    this.allOptions.push(...this.optionsArr1, ...this.optionsArr2);


    // this.question.options.push(newOption);
  }

  questions: any[] = [];
  categoryNameChecks: boolean[] = [];
  initializeCategoryNameChecks() {
    this.categoryNameChecks = new Array(this.groups.length).fill(false);
  }

  optionFieldIsValid: boolean = true
  surveySubmitted: boolean = false;
  textlimitation: boolean = false
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
        if (!group.options || group.options.length === 0) {
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
        this.categoryNameChecks[i] = !hasBlankOption; // If no blank or undefined value found, set it to true
      }
    } else {
      this.categoryNameCheck = true; // Skip validation if no groups exist
    }

    // Check if the answer input field is empty

    const isAnyOptionEmpty = this.allOptions.some(option => !option.option || option.option.trim() === '');
    // const isAnyOptionNonUnique = (new Set(this.allOptions.map(option => option.option.trim()))).size !== this.allOptions.length;
    // if (isAnyOptionNonUnique) {
    //   this.utility.showError('Duplicate option value.');
    // }


    // if (atLeastOneGroupExists) {
    //   this.categoryNameCheck = !!this.categoryId && this.categoryId !== 0;
    // } else {
    //   this.categoryNameCheck = true; // Skip validation if no groups exist
    // }

    // Update the validity state of the survey
    this.isValidSurvey = this.questionadded && this.qusstionaddednext && this.categoryNameCheck && !isAnyOptionEmpty;

    return this.isValidSurvey; // Return the validation result
  }

  textlimit: any
  numeric: boolean
  alphabet: boolean

  onSave() {

    // Validate the survey

    const isAnyOptionNonUnique = (new Set(this.allOptions.map(option => option.option.trim()))).size !== this.allOptions.length;
    if (isAnyOptionNonUnique) {
      this.utility.showError('Duplicate option value.');
      return;
    }
    const isSurveyValid = this.validateSurvey();

    if (!isSurveyValid) {
      // Show error message if fields are empty
      this.utility.showError('Please fill all required fields.');
      return;
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
    if (this.question.questionTypeName === 'Open Ended') {
      this.question.openEndedType = "textarea"
      this.question.textLimit = this.textlimit

    }

    this.question.image = this.questionImage;
    this.question.video = this.videoupload;
    this.question.youtubeUrl = this.youtubeUrl;

    let modifiedoptions: serveyOption[] = [];

    this.allOptions.forEach((option) => {
      let modifiedOption = new serveyOption();

      modifiedOption.createdDate = option.createdDate;
      modifiedOption.group = option.group;
      modifiedOption.id = option.id;
      modifiedOption.imageAdded = option.imageAdded;
      modifiedOption.isExcluded = option.isExcluded;
      modifiedOption.isFixed = option.isFixed;
      modifiedOption.isRandomize = option.isRandomize;
      modifiedOption.isSelected = option.isSelected;
      modifiedOption.isVisible = option.isVisible;

      modifiedOption.keyword = option.keyword;
      modifiedOption.modifiedDate = option.modifiedDate;
      modifiedOption.option = option.option;
      modifiedOption.selected = option.selected;
      modifiedOption.sort = option.sort;
      modifiedOption.status = option.status;
      modifiedOption.image = option.imageAdded ? option.image : null;
      modifiedoptions.push(modifiedOption);
    });

    this.question.options = modifiedoptions;
    this.question.piping = this.questionsortvalue

    // Send the request based on whether it's an update or creation
    if (parseFloat(this.questionId) > 0) {
      // Update existing question
      this.surveyservice.updateGeneralQuestion(this.question).subscribe({
        next: (resp: any) => {
          this.categoryNameCheck = false;
          if (resp == '"QuestionSuccessfullyUpdated"') {
            this.utility.showSuccess('Question Updated Successfully.');
            let url = `/survey/manage-survey/${this.crypto.encryptParam(this.surveyId)}`;
            this.router.navigateByUrl(url);
          } else {
            this.utility.showError(resp)
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
          this.utility.showSuccess('Question Generated Successfully.');
          let url = `/survey/manage-survey/${this.crypto.encryptParam(this.surveyId)}`;
          this.router.navigateByUrl(url);
          this.onSaveEvent.emit();
        },
        error: (err: any) => {
          this.utility.showError('error');
        }
      });
    }


  }





  onGroupValueChange(type: string, value: boolean, groupId: number) {
    // Update the specified group directly
    let groupoption = new serveyOption();

    const groupToUpdate = this.groups.find(group => group.id === groupId);
    if (!groupToUpdate) {
      console.error('Group not found with ID:', groupId);
      return;
    }


    if (type === 'randomize') {
      groupToUpdate.isRandomize = value;

      this.allOptions.forEach(option => {
        if (option.group === groupId) {
          option.isRandomize = true;
        }
      });
    } else if (type === 'excluded') {
      groupToUpdate.isExcluded = true;
      this.allOptions.forEach(option => {
        if (option.group === groupId) {
          option.isExcluded = true;
        }
      });
    }

    this.allOptions = [...this.optionsArr1, ...this.optionsArr2];

  }


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

    } else {

      this.newoptionImages.splice(index, 1)
      this.optionsArr2.splice(index, 1);
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
      options: []
    }

    this.groups.push(newGroup);

  }

  onDeleteGroup(index: number) {
    this.groups.splice(index, 1);
    this.categoryNameCheck = false;
  }

  onSelectImage(event: any) {
    const file = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (file) {
      this.questionfilesImage.push(file);
      this.uploadImage(file);
    }
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
      },
      (error) => {
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


  onRemoveImage(event: any) { // Use 'any' as the event type

    this.filesImage.splice(this.files.indexOf(event), 1);
  }


  onSelectVideo(event: any) {
    const file = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (file) {
      this.filesVideo.push(file); // Store the selected file
      this.uploadVideo(file); // Trigger upload after selecting the file
    }
  }
  onRemoveVideo(event: any) { // Use 'any' as the event type

    this.filesVideo.splice(this.files.indexOf(event), 1);
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
      },
      (error) => {
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
  getOptionsByQuestionId(selectedQuestion: any) {
    this.selectedOptions = [];
    this.optionListByQuestionId = ''

    const selectedValue = selectedQuestion;
    let queryParams = {
      qid: selectedValue
    }
    this.surveyservice.getOptionsByQuestionId(queryParams).subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);

      this.optionListByQuestionId = response
      this.optionListByQuestionId = JSON.parse(this.optionListByQuestionId)
    });
  }
  addOption(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    // Check if the entered value is in the available options
    const matchingOption = this.optionListByQuestionId.find((option: Option) => option.option === value);

    if (matchingOption && !this.selectedOptions.includes(matchingOption)) {
      this.selectedOptions.push(matchingOption);
    }

    if (input) {
      input.value = '';
    }
  }
  removeOption(option: any): void {
    const index = this.selectedOptions.indexOf(option);
    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
    }
  }

  selectedOption(event: MatAutocompleteSelectedEvent): void {
    const selectedOption = event.option.value;
    if (!this.selectedOptions.includes(selectedOption)) {
      this.selectedOptions.push(selectedOption);
    }
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
  onLogicSave(): void {

  }


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
    this.optionsArr1 = [];

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
        // window.location.reload();
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
    this.getLogicQuestionList(this.questionId)
  }



  youtubeUrl: any
  addyoutubevideourl() {
    const youtubeUrl = this.youtubeUrl;
  }

  //createanswerthen

  thenSection = false

  createanswershidethen() {
    this.thenSection = !this.thenSection;
  }

  createansweraddthen() {
    this.thenSection = true
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




  getQuestionListBySurveyId() {
    this.logicQuestionListById = []; // Assuming logicQuestionListById is of type responseDTO[]
    this.surveyservice.GetQuestionListBySurveyId(this.surveyId).subscribe((response: responseDTO[]) => {
      this.logicQuestionListById = response;

    });
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

      const specificSurveyId = this.surveyId


      const filteredSurveys = this.surveyData.filter(survey => survey.surveyId === specificSurveyId);

      this.filteredSurveyNames = filteredSurveys.map(survey => survey.name);

      this.filteredCountryNames = filteredSurveys.map(survey => survey.countryImage);

      this.filteredcategoryName = filteredSurveys.map(survey => survey.categoryName);

      this.surveystatus = filteredSurveys.map(survey => survey.status)
    });
  }




}
