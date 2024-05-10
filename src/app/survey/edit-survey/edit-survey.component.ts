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

@Component({
  selector: 'app-edit-survey',
  templateUrl: './edit-survey.component.html',
  styleUrls: ['./edit-survey.component.css'],

})
export class EditSurveyComponent {
  // Tooltip
  showTooltip: { [key: string]: boolean } = {};
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }
  // Tooltip
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

        console.log("surveyId", this.surveyId)
        console.log("questionTypeId", this.questionTypeId)
        console.log("mode", this.mode)
        console.log("questionId", this.questionId)
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
      console.log("data", data)
      console.log("questionTypeId", data.questionTypeId)
      console.log("questionTypeName", data.questionTypeName)
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
      this.question.piping = data.piping
      this.question.isGrouping = data.isGrouping
      this.textlimit = data.textLimit
      this.numeric = data.isNumeric
      this.alphabet = data.isAlphabet
      this.screeningRedirectUrl = data.screeningRedirectUrl

      console.log("piping", this.question.piping)

      data.options.forEach((opt: any) => {

        let newOption = new Option();
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

        this.optionimagennew.push(opt.image)
        console.log("qwertyuertyui", this.optionimagennew);

        if (opt.status == 'ACT') {
          if (opt.isFixed)
            this.optionsArr2.push(newOption);
          else
            this.optionsArr1.push(newOption);

        }

        console.log("see", this.optionsArr1)
        console.log("see2", this.optionsArr2)
        console.log("option id", newOption.id)
        console.log("image", newOption.image)


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
      console.log('Groups:', this.groups);
    } else {
      console.log('groupedOptions is empty or does not have keys.');
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
    console.log("optionarr2 check", this.optionsArr2)


  }

  onQuestionTypeClick(id: any) {
    this.questionTypeId = id;
  }

  files: File[] = [];

  optionImages: File[][] = [];
  newoptionImages: File[][] = [];

  onSelect(event: any) { // Use 'any' as the event type
    console.log(event);
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
      console.log("file:", file);
      console.log("qid:", qid);

      if (file) {
        this.filesImage.push(file);
        this.uploadOptionImage(file, this.questionId, oid);
      } else {
        console.error("File is null or undefined.");
        console.log("newoptionImages:", this.optionImages);
      }
    } else {
      console.error("No files found for the specified index.");
    }
    debugger
  }

  onSelectNewOptionImage(event: any, index: number, qid: number, oid: number): void {

    if (!this.newoptionImages[index]) {
      this.newoptionImages[index] = [];
    }

    this.newoptionImages[index].push(...event.addedFiles);
    console.log("newoptionImages:", this.newoptionImages);

    this.optionsArr1[index].images = [...event.addedFiles];

    console.log("opppindex", this.optionsArr1)
    const filesForIndex = this.newoptionImages[index];

    if (filesForIndex && filesForIndex.length > 0) {
      const file = filesForIndex[filesForIndex.length - 1];
      console.log("file:", file);
      console.log("qid:", qid);

      if (file) {
        this.filesImage.push(file); // Store the selected file
        this.uploadOptionImage(file, this.questionId, oid); // Trigger upload after selecting the file
      } else {
        console.error("File is null or undefined.");
        console.log("newoptionImages:", this.newoptionImages);
      }
    } else {
      console.error("No files found for the specified index.");
    }
  }


  uploadOptionImage(fileoption: File, qid: number, oid: number): void {
    debugger
    console.log("oid", oid);

    this.surveyservice.uploadOptionImage(fileoption, qid, oid).subscribe(
      (response: string) => {
        console.log('Upload successful:', response);
        const optionIndex = this.optionsArr1.findIndex(option => option.id === oid);
        console.log("optionIndex", optionIndex)
        if (optionIndex !== -1) {

          this.optionsArr1[optionIndex].image = response.replace(/"/g, "");

          console.log("optionarr", this.optionsArr1);
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
        console.log(`Item with option '${optionValue}' not found in filtered Options.`);
      }
    }

    let groupDetail = this.groups[groupIndex];

    let indexToModify = this.allOptions.findIndex((option: any) => option.option === optionValue);
    if (indexToModify !== -1) {
      this.allOptions[indexToModify].group = groupDetail.id;
      this.allOptions[indexToModify].isRandomize = groupDetail.isRandomize;
      this.allOptions[indexToModify].isExcluded = groupDetail.isExcluded;
    } else {
      console.log(`Item with option '${optionValue}' not found in all Options.`);
    }

  }

  Remove(data: any, groupIndex: number) {
    let optionValue = data.option;
    const indexToRemove = this.groups[groupIndex].options.findIndex((option: any) => option.option === optionValue);

    if (indexToRemove !== -1) {
      this.groups[groupIndex].options.splice(indexToRemove, 1);

    } else {
      console.log(`Item with option '${optionValue}' not found.`);
    }

    this.filteredOptions.push(data);

    let indexToModify = this.allOptions.findIndex((option: any) => option.option === optionValue);
    if (indexToModify !== -1) {
      this.allOptions[indexToModify].group = 0;
      this.allOptions[indexToModify].isRandomize = false;
      this.allOptions[indexToModify].isExcluded = false;
    } else {
      console.log(`Item with option '${optionValue}' not found in all Options.`);
    }

  }

  onRemove(event: any) { // Use 'any' as the event type
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  // onRemove(file: File, index: number): void {
  //   console.log(file); // Log the file being removed
  //   console.log(index); // Log the index of the file being removed
  //   this.files.splice(index, 1); // Remove the file at the specified index from the files array
  // }


  userId: any
  questionTypes: any[] = [];
  createquestionType: any[] = [];

  getQuestionTypes() {
    this.surveyservice.GetQuestionTypes().subscribe({
      next: (resp: any) => {
        this.questionTypes = resp;
        this.createquestionType = resp.type
        console.log("this.questionTypes", this.questionTypes)
        // alert(this.questionTypeId)
        this.questionTypeNameGet = this.getTypeById(this.questionTypeId);
        // alert(this.questionTypeNameGet)
      },
      error: (err) => console.log("An Error occurred while fetching question types", err)
    });
  }
  questionTypeNameGet: any
  getTypeById(targetId: number): string | null {
    console.log("Searching for ID:", targetId);
    const questionType = this.questionTypes.find(item => item.id === targetId);
    if (questionType) {
      console.log("Found type:", questionType.type);
      return questionType.type;
    } else {
      console.log("Type not found for ID:", targetId);
      return null;
    }
  }

  intializeDefaultValue() {
    console.log("Inside IntializeDefaultValue")
    this.question.questionTypeId = parseInt(this.questionTypeId);
    this.question.surveyTypeId = parseInt(this.surveyId);
    this.question.question = '';
    this.question.createdDate = this.getCurrentDateTime();
    this.question.modifiedDate = this.getCurrentDateTime();
    this.question.questionTypeName = this.getquestionTypeName

    this.filteredOptions.push(...this.optionsArr1, ...this.optionsArr2);
    this.allOptions.push(...this.optionsArr1, ...this.optionsArr2);
    console.log("createquesttype", this.question.questionTypeName)



  }

  hanldeAddOptionClick(type: string | null = null) {
    let newOption = new Option();

    newOption.createdDate = this.getCurrentDateTime();
    newOption.modifiedDate = this.getCurrentDateTime();


    if (type == 'other') {
      newOption.option = "Other";
      newOption.isFixed = true
      console.log("others")
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

    // if (type != null) {
    //   this.optionsArr1.push(newOption);
    // } else {
    //   this.optionsArr1.push(newOption);
    // }
    this.optionsArr1.push(newOption);


    this.newoptionImages = [];

    this.filteredOptions = [];
    this.filteredOptions.push(...this.optionsArr1, ...this.optionsArr2);

    console.log("filteroption", this.filteredOptions)

    this.allOptions = [];
    this.allOptions.push(...this.optionsArr1, ...this.optionsArr2);

    console.log("add option", this.allOptions)
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
    this.question.youtubeUrl = this.youtubeUrl;
    console.log("url", this.question.youtubeUrl)
    this.question.options = this.allOptions;
    this.question.piping = this.questionsortvalue
    console.log("checking", this.question.options)

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

    console.log(this.question); // Log the question
  }




  // validateSurvey() function






  onGroupValueChange(type: string, value: boolean, groupId: number) {
    // Update the specified group directly
    let groupoption = new Option();
    console.log("groupId", groupId)
    const groupToUpdate = this.groups.find(group => group.id === groupId);
    if (!groupToUpdate) {
      console.error('Group not found with ID:', groupId);
      return;
    }
    console.log(groupToUpdate);

    if (type === 'randomize') {
      groupToUpdate.isRandomize = value;
      console.log("isRandomize", groupToUpdate)
      this.allOptions.forEach(option => {
        if (option.group === groupId) {
          option.isRandomize = true;
          console.log("isRandomize option", option)
        }
      });
    } else if (type === 'excluded') {
      groupToUpdate.isExcluded = true;
      console.log("isExcluded", groupToUpdate.isExcluded)
      this.allOptions.forEach(option => {
        if (option.group === groupId) {
          option.isExcluded = true;
          console.log("isExcluded option", option)
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
    console.log("previous", e.previousIndex)
    console.log("current", e.currentIndex)

    this.optionsArr1.forEach((option, index) => {
      option.sort = index;
    });



    this.allOptions = [];
    this.allOptions.push(...this.optionsArr1, ...this.optionsArr2);
  }

  onDeleteOption(type: string, index: any) {

    if (type == 'optionArr1') {

      console.log(this.optionImages)

      this.optionImages.splice(index, 1)

      this.optionsArr1.splice(index, 1);
      console.log("deleted", this.optionsArr1)
    } else {

      this.newoptionImages.splice(index, 1)
      this.optionsArr2.splice(index, 1);
      console.log("newoptionarr", this.newoptionImages)
      console.log("deleted 2", this.optionsArr2)
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
      this.questionfilesImage.push(file); // Store the selected file
      this.uploadImage(file); // Trigger upload after selecting the file
    }
  }

  filesImageoption: File[] = [];
  onSelectOptionImageUpload(event: any) {
    const fileoption = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (fileoption) {
      this.filesImageoption.push(fileoption); // Store the selected file
      this.uploadImageOption(fileoption);
      console.log("check", fileoption); // Trigger upload after selecting the file
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
        console.log('Upload successful:', response);
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
    console.log(event);
    this.filesImage.splice(this.files.indexOf(event), 1);
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
        console.log('Upload successful:', response);
        this.questionImage = response
        // Handle response from the image upload
        // You may want to retrieve the URL or any other relevant information from the response
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
        // Handle error
      }
    );
  }

  onSelectVideo(event: any) {
    const file = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (file) {
      this.filesVideo.push(file); // Store the selected file
      this.uploadVideo(file); // Trigger upload after selecting the file
    }
  }
  onRemoveVideo(event: any) { // Use 'any' as the event type
    console.log(event);
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
        console.log('Upload successful:', response);
        this.questionImage = response
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
      console.log("logicQuestionList", response);
      console.log("Question Sort Value", this.question.sort);
      this.questionsort = this.question.sort
      console.log("questionsort", this.questionsort)
      this.pipeQuestionList = response
      console.log("pipe", this.pipeQuestionList)
      //this.logicQuestionList = response.filter((item: Question) => item.sort < this.question.sort);
      this.logicQuestionList = this.pipeQuestionList
      if (this.logicQuestionList.length > 0) {
        this.getOptionsByQuestionId(this.logicQuestionList[0].id);
      }
      console.log("Filtered logicQuestionList", this.logicQuestionList);
    });
  }
  getLogicValues() {
    this.surveyservice.getLogicValues().subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);
      console.log("logicValues", response)
      this.logicValuesList = response
    });
  }
  getOptionsLogicValues() {
    this.surveyservice.getOptionsLogicValues().subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);
      console.log("optionLogicValues", response)
      this.optionLogicValuesList = response
    });
  }
  getOptionsByQuestionId(selectedQuestion: any) {
    this.selectedOptions = [];
    this.optionListByQuestionId = ''
    console.log("selectedQuestion", selectedQuestion);
    const selectedValue = selectedQuestion;
    let queryParams = {
      qid: selectedValue
    }
    this.surveyservice.getOptionsByQuestionId(queryParams).subscribe((response: { [x: string]: any; }) => {
      var result = Object.keys(response).map(e => response[e]);

      this.optionListByQuestionId = response
      console.log("optionListByQuestionId", this.optionListByQuestionId)
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




  // validateSurvey() {
  //   this.questionadded = !!this.question && !!this.question.question && this.question.question.length >= 0;
  //   this.qusstionaddednext = !!this.question && !!this.question.questionTypeName && this.question.questionTypeName.trim().length > 0;

  //   if (!this.option.option.trim()) {
  //     // Display error message or perform any other action
  //     console.log("Option is required.");
  //   }
  // }

  // validateSurvey(): boolean {
  //   // Validate each field individually
  //   this.questionadded = !!this.question && !!this.question.question && this.question.question.trim().length > 0;
  //   this.categoryNameCheck = !!this.categoryId && this.categoryId !== 0;
  //   this.qusstionaddednext = !!this.question && !!this.question.questionTypeName && this.question.questionTypeName.trim().length > 0;

  //   const questionadded = !!this.question && !!this.question.question && this.question.question.trim().length > 0;
  //   const categoryNameCheck = !!this.categoryId && this.categoryId !== 0;
  //   const qusstionaddednext = !!this.question && !!this.question.questionTypeName && this.question.questionTypeName.trim().length > 0;

  //   // Update the validity state of the survey
  //   this.isValidSurvey = questionadded && categoryNameCheck && qusstionaddednext;

  //   return this.isValidSurvey; // Return the validation result
  // }

  onQuestionTypeClickchoice(ques: any) {
    // this.question.question = `${ques.type}`;
    this.question.questionTypeName = `${ques.type}`;
    this.questionTypeId = ques.id;
    console.log("questionTypeNameqwerty", this.question.questionTypeName)
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
    console.log('Selected value:', selectedValue);
    console.log('Question Sort value:', questionSortValue);
    console.log('sid', this.surveyId)
    console.log("question", this.questionId)

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
        console.log('Update successful:', response);
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


  //preview

  // inputText: string = '';

  // dataArray: string[] = [];

  // addButtonClicked() {
  //   // Remove all whitespace from inputText and assign it to dataArray
  //   this.dataArray = this.inputText.replace(/\s+/g, '').split('\n').filter(item => item.trim() !== '');
  //   console.log(this.dataArray);

  //   this.inputText = '';
  // }

  // lines: string[]
  // processInputText(): void {
  //   this.inputText = this.inputText.replace(/\n+/g, '\n');

  //   console.log(this.lines); // You can use this array as needed
  // }



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
    console.log(this.dataArray);

    this.inputText = '';

    this.optionsArr1 = [];

    this.dataArray.forEach((line: string) => {
      // Check if line is not empty
      if (line) {
        let newOption = new Option();
        newOption.option = line.trim();
        newOption.createdDate = this.getCurrentDateTime()

        this.optionsArr1.push(newOption);
        // Push the new Option object to optionsArr1
        console.log("see", this.optionsArr1);
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

  // addButtonClicked(): void {
  //   // Split the input text by newline characters and assign it to dataArray
  //   this.dataArray = this.inputText.split('\n').map(line => line.trim()).filter(line => line !== '');
  //   console.log(this.dataArray);

  //   // Clear the input field
  //   this.inputText = '';

  //   this.dataArray.forEach((line: string) => {
  //     // Check if line is not empty
  //     if (line) {
  //       let newOption = new Option();
  //       newOption.option = line.trim();
  //       newOption.createdDate = this.getCurrentDateTime();

  //       this.optionsArr1.push(newOption);
  //       console.log("see", this.optionsArr1);
  //     }
  //   });

  //   this.allOptions = [...this.optionsArr1, ...this.optionsArr2]; // Update allOptions array
  // }


  // selectedIndex: any
  // imageoption: any;

  // openModal(index: number) {
  //   this.selectedIndex = index;
  //   console.log(this.selectedIndex)
  //   this.imageoption = this.selectedIndex;
  //   console.log(this.imageoption)
  // }

  youtubeUrl: any
  addyoutubevideourl() {
    const youtubeUrl = this.youtubeUrl;
    console.log('youtube url:', youtubeUrl);
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
      console.log("group push option", this.groups)
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
      console.log("selected question", selectedQuestion.item)
      console.log('question Sort Value:', selectedQuestion.sort);
    }
    this.questionsortvalue = selectedQuestion.sort
    this.logicquestionname = selectedQuestion.item
    console.log("questionsortvalue", this.questionsortvalue)
    console.log("logicquestionname", this.logicquestionname)

    const selectedQuestionsort = this.logicQuestionListById.find((item: { sort: any; }) => item.sort === selectedQuestion.sort);
    if (selectedQuestionsort) {
      console.log("Selected Question ID:", selectedQuestionsort.id);
      console.log("Selected Question Name:", selectedQuestionsort.item);
    }
    this.logicquestionid = selectedQuestionsort.id


  }




  getQuestionListBySurveyId() {
    this.logicQuestionListById = []; // Assuming logicQuestionListById is of type responseDTO[]
    this.surveyservice.GetQuestionListBySurveyId(this.surveyId).subscribe((response: responseDTO[]) => {
      this.logicQuestionListById = response;
      console.log("qwertyu", this.logicQuestionListById);
    });
  }
  starRating: any[] = [];
  addStarRating() {
    for (let i = 1; i <= 10; i++) {
      let startOption = new Option();
      startOption.option = i.toString();
      startOption.id = i;
      startOption.createdDate = this.getCurrentDateTime()
      this.optionsArr1.push(startOption);
      console.log("star rating", this.optionsArr1)
    }

    this.allOptions = [...this.optionsArr1, ...this.optionsArr2];
  }

  addBoolean() {
    const booleanValues = ['True', 'False'];

    for (let i = 0; i < booleanValues.length; i++) {
      let booleanOption = new Option();
      booleanOption.option = booleanValues[i];
      booleanOption.id = i + 1;
      booleanOption.createdDate = this.getCurrentDateTime();
      this.optionsArr1.push(booleanOption);
      console.log("boolean options", this.optionsArr1);
    }

    this.allOptions = [...this.optionsArr1, ...this.optionsArr2];
  }

  sliderscale: any[] = [];
  addsliderscale() {
    for (let i = -10; i <= 10; i++) {
      let startOption = new Option();
      startOption.option = i.toString();
      startOption.id = i;
      startOption.createdDate = this.getCurrentDateTime()
      this.optionsArr1.push(startOption);
      console.log("star rating", this.optionsArr1)
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
    console.log("nc", this.question.isAlphabet);
    console.log("nca", this.question.isNumeric);
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
      // Log filtered survey names
      console.log("Filtered Survey Names:", this.filteredSurveyNames);
      console.log("Filtered Survey Names:", this.filteredCountryNames);
      console.log("Filtered Survey Names:", this.filteredcategoryName);
      console.log("Filtered surveystatus :", this.surveystatus);
    });
  }




}
