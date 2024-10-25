import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SurveyService } from '../service/survey.service';
import { responseDTO } from '../types/responseDTO';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UtilsService } from '../service/utils.service';
import { OptionDto, QuestionDto, QuotaData, QuotaInterlock } from '../types/quota';
import { CryptoService } from 'src/app/service/crypto.service';
import { MatSelect, MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-quota-management',
  templateUrl: './quota-management.component.html',
  styleUrls: ['./quota-management.component.css']
})
export class QuotaManagementComponent {
  
  selectedQuestion: string;
  isQuotasVisible: boolean = false;
  showQuotasDiv: boolean = false;

  surveyData: any;
  baseUrl = '';
  surveyId: any;
  quotasurveyid: any;
  surveyName: any;
  countryName: any;
  countryImage: any;
  categoryName: any;
  centerId: any;
  quotoid: any;
  role: any;
  centername:any

  surveyQuotaJson: QuotaData;
  isEditQuota: boolean = false;
  itemindex: number;
  selectedQuestionIds: number[] = [];
  filteredQuestions:[]
  itemques:any[]=[]
  vendorurl: boolean=false;
  vendorgeneratedurl: string;
  uid: any;
  vendorid:number
  router: any;
  quotainterlock: QuotaInterlock = new QuotaInterlock();
  interlockquesid:any;
  currentinterlockid:any;
  currentinterlockoptionlist:any[]=[];
  currentinterlockoptionid:any[]=[];
  interlockoptionlist:any[]=[];
  interlockoptionid:{ quesId: number; optionId: number }[] = [];
  previousItemIds: any[]=[];
  quotainterlockdata:any[]=[];
  interlockusercount:any;
  //QuotaData: QuotaData;


  constructor(private route: ActivatedRoute, private visibilityService: DataService, private crypto: CryptoService,
    private modalService: NgbModal, private surveyservice: SurveyService, private utils: UtilsService, private utility: UtilsService) {
    this.baseUrl = environment.baseURL;
    this.route.paramMap.subscribe(params => {
      let _queryData = params.get('param1');
      if (_queryData) {
        let _queryDecodedData = this.crypto.decryptQueryParam(_queryData);
        let _data = _queryDecodedData.split('_');
        this.quotoid = _data[0];
        console.log("this.quotoid",this.quotoid)
      }
    })

  }
  initializeQuotaData() {

    this.surveyQuotaJson = new QuotaData();

    this.surveyQuotaJson.createdDate = new Date();
    this.surveyQuotaJson.surveyId = this.surveyId;
    this.surveyQuotaJson.status = this.status;
    this.surveyQuotaJson.vendarId = this.vendorid;
  }



  hideBreadcrumb() {
    this.visibilityService.toggleBreadcrumbVisibility(false);
  }

  status: string;
  ngOnInit() {
    this.centerId = this.utils.getCenterId();
    this.role = this.utils.getRole();
    this.centername = this.utils.getCenterName();
    this.hideBreadcrumb();
    setTimeout(() => {
      this.getAllVendorSurveyList()
    }, 1000);
    // get surveydata
    this.route.paramMap.subscribe(_params => {
      this.surveyData = history.state.surveyData;
      if (this.surveyData) {
        //const { surveyName, countryName, countryImage, categoryName, otherCategoryName, surveyId } = this.surveyData;
        this.surveyId = this.surveyData.surveyId;
        this.surveyName = this.surveyData.surveyName;
        this.countryName = this.surveyData.countryName;
        this.countryImage = this.surveyData.countryImage;
        this.categoryName = this.surveyData.categoryName;
        this.categoryName = this.surveyData.otherCategoryName;
        this.countryImage = this.surveyData.countryImage;
        this.status = this.surveyData.status;
        console.log('Survey Data:', this.surveyData);
        console.log("quota surveyid", this.surveyId)
      } else {
        console.log('Survey data is undefined or null.');
      }
    });
    this.visibilityService.currentQuestionId.subscribe(redirectuid => {
      this.uid = redirectuid;
    });
   

    console.log("step1", this.uid)
    this.GetSurveyDetails();
    console.log("step2", this.questionList)
    this.getQuotaBySurveyId();
    console.log("step3", this.questionList)
    this.quotaById();
    
  }

 
  showCountError: boolean = false;

  showQuotas() {
    if (this.surveyQuotaJson.totalUsers < 0 || isNaN(this.surveyQuotaJson.totalUsers)) {
      this.showCountError = true;
      return;
    }

    this.showCountError = false;
    this.isQuotasVisible = true;
  }
  open(contentInterlock: any, index: number,quesid:number) {
    // this.modalService.open(contentInterlock)
    this.itemindex = index;
    const modalRef = this.modalService.open(contentInterlock);
    console.log("dd",quesid)
    this.toggleActive(index,this.itemindex,quesid)
    modalRef.componentInstance.itemindex = index;
   
    
  }
  // Show add quotas
  quotas: any[] = [{ selectedQuestion: 'Select Question', showQuotasDiv: false }];

  addQuota() {
    if (this.surveyQuotaJson.totalUsers > 0) {
      this.showCountError = false;

      const lastItem = this.surveyQuotaJson.questionDto[this.surveyQuotaJson.questionDto.length - 1];

      if (typeof lastItem == 'undefined' || lastItem?.questionId != 0) {
        const newQuestion = new QuestionDto();
        newQuestion.type = 'none';
        this.surveyQuotaJson.questionDto.push(newQuestion);
      }
      else if (lastItem.questionId == 0) {
        alert("Please select question.");
      }

      this.surveyQuotaJson.questionDto.forEach((question, i) => {
        this.removeselectedques(i, question.questionId);
      });

    }
    else {
      this.showCountError = true;
    }

  }


  showQuestionQptions(index: number, questionId: any) {

    const question = this.questionList.questions.filter((x: any) => x.id == questionId)[0];

    if (question) {
      this.surveyQuotaJson.questionDto[index].optionsDto = [];
      //debugger;

      let _reminder = this.surveyQuotaJson.totalUsers;
      const usercount = Math.floor(this.surveyQuotaJson.totalUsers / (question.options?.length ?? 0));
      question.options?.forEach((item: any) => {
        const option = new OptionDto();

        option.optionId = item.id;
        option.quotaOptionsId = item.id;
        option.quotaQuestionId = questionId;
        option.userCount = usercount;

        if (_reminder < (2 * option.userCount)) {
          option.userCount = _reminder;
        } else {
          _reminder = _reminder - usercount;
        }
        this.surveyQuotaJson.questionDto[index].optionsDto.push(option);
      });

    } else {
      console.log("question not found.");
    }


  }

  // calculateQuotaCount():number{

  //   this.surveyQuotaJson.questionDto[index]
  //   return 0;
  // }


  showCensusDiv: boolean[] = [];
  showCustomDiv: boolean[] = [];
  censusActive: boolean[] = [];
  customActive: boolean[] = [];
  activeValue: string = '';

  toggleCensus(index: number) {
    this.showCensusDiv[index] = true;
    this.showCustomDiv[index] = false;
    this.censusActive[index] = true;
    this.customActive[index] = false;
    this.activeValue = 'census';
    console.log("activewer", this.activeValue)
  }

  toggleCustom(index: number, type: string) {
    // this.showCensusDiv[index] = false;
    // this.showCustomDiv[index] = true;
    // this.censusActive[index] = false;
    // this.customActive[index] = true;
    // this.activeValue = 'custom';
    // console.log("activewer", this.activeValue)

    this.surveyQuotaJson.questionDto[index].type = type;
  }
  getQuestionDetail(quesId: any, questionList: any) {
    return questionList?.filter((ques: any) => ques.id == quesId)[0];
  }

  getOptionDetail(optionId: any, quesId: any, questionList: any) {
    const question = questionList?.filter((ques: any) => ques.id == quesId)[0];

    if (question) {
      const option = question.options.filter((opt: any) => opt.id == optionId)[0];
      if (option) {
        return option;
      }
    }
  }

  getTotalSum(optionList: any) {
    let total = 0;
    optionList?.forEach((item: any) => {
      if (!isNaN(item.userCount)) {
        total += parseInt(item.userCount);
      } else {
        total += 0;
      }
    });

    return total;
  }


  toggleNone(index: number) {
    this.showCensusDiv[index] = false;
    this.showCustomDiv[index] = false;
    this.censusActive[index] = false;
    this.customActive[index] = false;
    this.activeValue = 'none';
    console.log("activewer", this.activeValue)
  }
  // Show and hide Census/Custom dive
  activeIndex: number = 0; // Initially set to 0 for the first item
  items: string[] = [];


// Initialize activeIndices as an object
activeIndices: number[][] = [];
selectedinterlockid:any[][]=[]

toggleActive(index: number, interlockindex: number, itemid: number) {
  const itemId = itemid;
  if(index == interlockindex){
     this.currentinterlockid = itemid
  }
  console.log("itemId khk", itemId);
  console.log("interlockindex",interlockindex)
  console.log("interlockquesid",this.currentinterlockid)
  console.log("index",index)

  // Ensure selectedinterlockid is initialized properly
  if (!this.selectedinterlockid[interlockindex]) {
    this.selectedinterlockid[interlockindex] = [];
  }

  // Push itemId to the specific interlock index array
  this.selectedinterlockid[interlockindex].push(itemId);
  console.log("selectedinterlockid", this.selectedinterlockid);

  if (!this.activeIndices[interlockindex]) {
    this.activeIndices[interlockindex] = [];
  }

  const indices = this.activeIndices[interlockindex];
  const i = indices.indexOf(index);

  if (i > -1) {
    indices.splice(i, 1);
  } else {
    indices.push(index);
  }
  // if (this.selectedinterlockid.some(innerArray => innerArray.length > 1)) {
  //   this.selectedInterlockQues(this.selectedinterlockid);
  // }
  // if(index == interlockindex){
  //   this.getAllOptionId(itemId)
  // }
  this.getCurrentOptionId(this.currentinterlockid)
  
  
}


// Function to get active indices for a given interlockindex
activeIndicesForInterlock(interlockindex: number): number[] {
  return this.activeIndices[interlockindex] || [];
}




  // question api

  questionList: any = '';
  genericlist: any[] = [];
  optionlist: any[] = [];
  questions: any[] = []
  pageSize: number = 100;
  pageNumber: number = 1
  surveycount: number;
  totalsum: number[] = [];
  allquestionList: any



  GetSurveyDetails() {

    this.surveyservice.getSurveyDetailsById(this.pageNumber, this.pageSize, this.quotoid).subscribe((data: any) => {
      this.questionList = data;
      console.log("gg  questionList", this.questionList);

      this.questionList.questions.forEach((question: any) => {
        if (question.genericType) {
          this.genericlist.push(question.genericType);
        }
        console.log("qwerty", this.genericlist)
      });
      this.questionList.questions.forEach((question: any) => {

      });
      if (this.questionList && Array.isArray(this.questionList.questions)) {
        this.questionList.questions.forEach((question: any) => {
          if (question.options && Array.isArray(question.options)) {
            question.options.forEach((option: any) => {
              this.optionlist.push(option.option);
            });
          }
        });
        console.log("optioneee", this.optionlist);
      }
      console.log("qewr",this.quotaid)

      this.getQuotaBySurveyId();
      this.getQuotaInterlock(this.quotaid);

    });
  }


  // selectedoptions: any[] = [];
  // selectedOptionsCount: any
  // selectedgenericType: any
  // selectedquestion: any

  // Initialize arrays to store selected question details
  selectedquestionid: any[] = []
  selectedquestion: any[] = [];
  selectedgenericType: string[] = [];
  selectedoptions: any[] = [];
  selectedOptionsCount: number[] = [];
  selectedoptionid: any[] = []


  // selectedOptionDetails(selectedQuestionId: any,index:number) {

  //   //console.log('question list =', this.questionList.questions)

  //   const selectedQuestion = this.questionList.questions.find((item: { id: any; }) => {
  //     return item.id == selectedQuestionId;
  //   });

  //   console.log("selectedQuestion", selectedQuestion)
  //   console.log("Selected question:", selectedQuestion.question);
  //   console.log("genericType", selectedQuestion.genericType)
  //   this.selectedquestion = selectedQuestion.question
  //   this.selectedgenericType = selectedQuestion.genericType
  //   if (selectedQuestion && Array.isArray(selectedQuestion.options)) {
  //     const selectedOptions = selectedQuestion.options;

  //     console.log("Selected question options:", selectedOptions);
  //     this.selectedoptions = selectedOptions;
  //     this.selectedOptionsCount = this.selectedoptions.length;
  //     console.log("Number of selected options:", this.selectedOptionsCount);
  //     return selectedOptions;
  //   }
  // }

  selectedOptionDetails(selectedQuestionId: any, index: number) {

    const selectedQuestion = this.questionList.questions.find((item: { id: any; }) => {
      return item.id == selectedQuestionId;
    });

    console.log("Selected question at index " + index + ":", selectedQuestion.question);
    console.log("Selected id at index " + index + ":", selectedQuestion.id);
    this.selectedquestionid = selectedQuestion.id
    console.log("GenericType at index " + index + ":", selectedQuestion.genericType);

    // Initialize the arrays if they are not defined
    if (!this.selectedquestion[index]) this.selectedquestion[index] = "";
    if (!this.selectedgenericType[index]) this.selectedgenericType[index] = "";
    if (!this.selectedoptions[index]) this.selectedoptions[index] = [];
    if (!this.selectedOptionsCount[index]) this.selectedOptionsCount[index] = 0;

    // Store selected question details at the corresponding index

    this.selectedquestion[index] = selectedQuestion.question;
    this.selectedgenericType[index] = selectedQuestion.genericType;

    if (selectedQuestion && Array.isArray(selectedQuestion.options)) {
      const selectedOptions = selectedQuestion.options;

      console.log("Selected question options at index " + index + ":", selectedOptions);

      this.selectedoptions[index] = selectedOptions;

      this.selectedoptionid[index] = this.selectedoptions[index].map((option: any) => option.id);

      console.log("qwertyuio", typeof (this.selectedoptionid))
      console.log("qwertyuio", this.selectedoptionid[index])
      console.log("qwerty selectedoptions", this.selectedoptions[index])
      this.selectedOptionsCount[index] = this.selectedoptions[index].length;
      console.log("Number of selected options at index " + index + ":", this.selectedOptionsCount[index]);

      // return selectedOptions;
      this.questionList.questions = this.questionList.questions.filter((question: any) => question.id !== this.selectedquestionid);

      console.log("asdfghj", this.questionList.questions)

      return selectedOptions;
    }

  }



  dividedValue: any
  equallyDividedValue(var_options: any, index: number, opindx: number) {

    console.log("var_options", var_options)
    console.log("var_options", typeof (var_options))

    const last_index = var_options.length - 1;
    // const valuesArray = Object.values(var_options);
    // console.log("valuesArray", valuesArray)
    // const last_index = valuesArray.length - 1;


    if (last_index == opindx) {
      this.dividedValue = this.surveycount - (last_index * Math.floor(this.surveycount / this.selectedOptionsCount[index]));

    }
    else {
      this.dividedValue = Math.floor(this.surveycount / this.selectedOptionsCount[index]);

    }

    console.log("dividedValue", this.dividedValue)
    console.log(opindx);
    console.log(last_index);



    this.totalsum[index] = this.dividedValue * this.selectedOptionsCount[index]



    return this.dividedValue;

  }

  createsurveyId: any

  getCurrentDateTime(): string {
    const currentDateTime = new Date().toISOString();
    return currentDateTime.substring(0, currentDateTime.length - 1) + 'Z';
  }


  // updateQuota(index: number) {
  //   console.log("updating quota", index);

  //   // Retrieve the quota to be updated
  //   const quotaToUpdate = this.quotas[index];

  //   // Construct the data to send for updating the quota
  //   const dataToSend = {
  //     quotaId: quotaToUpdate.quotaId,
  //     surveyId: this.surveyId,
  //     totalUsers: this.surveycount,
  //     centerId: this.centerId,
  //     status: quotaToUpdate.status, // Retain the status from the existing quota
  //     createdDate: quotaToUpdate.createdDate, // Retain the created date from the existing quota
  //     questionDto: {
  //       quotaQuestionsId: quotaToUpdate.questionDto.quotaQuestionsId,
  //       quotaId: quotaToUpdate.questionDto.quotaId,
  //       questionId: quotaToUpdate.questionDto.questionId,
  //       type: quotaToUpdate.questionDto.type,
  //       interlock: quotaToUpdate.questionDto.interlock,
  //       isOpenEnded: quotaToUpdate.questionDto.isOpenEnded,
  //       optionsDto: [] as { quotaOptionsId: number; quotaQuestionId: number; optionId: any; userCount: any }[] // Define the type explicitly
  //     }
  //   };

  //   // Add options for the quota
  //   const options = this.selectedoptionid[index];
  //   options.forEach((optionId: any) => {
  //     const optionsDto = {
  //       quotaOptionsId: 0, // Assuming you don't need to update option IDs
  //       quotaQuestionId: 0, // Assuming you don't need to update quota question IDs
  //       optionId: optionId,
  //       userCount: this.dividedValue
  //     };
  //     dataToSend.questionDto.optionsDto.push(optionsDto);
  //   });

  //   // Call the service to update the quota
  //   this.surveyservice.updateQuota(dataToSend).subscribe(
  //     resp => {
  //       console.log("update quota response", resp);
  //       this.utility.showSuccess('Quota Updated Successfully.');
  //     },
  //     error => {
  //       console.error("error updating quota", error);
  //       this.utility.showError('Error updating quota');
  //     }
  //   );
  // }


  customValue: number[] = [];
  updateTotalSum(index: number) {
    this.totalsum[index] = this.customValue[index] * this.selectedOptionsCount[index];
    console.log("updated", this.totalsum[index])
  }

  totalUsers: any;
  questionDto: any;
  quotaid: any
  allFilteredQuestions = [];
  questionjson: QuestionDto
  selectedques:any[]=[]
  getQuotaBySurveyId() {
    
    console.log("hh", this.questionList);
    this.surveyservice.getQuotaBySurveyId(this.quotoid).subscribe({
      next: (data: any) => {
        this.isQuotasVisible = true;

        this.surveyQuotaJson = data as QuotaData;

        data.questionDto.forEach((quesid: any) => {
          let selectedquesid = new QuestionDto();
          selectedquesid.questionId = quesid.questionId;

          console.log("aa", selectedquesid.questionId)
          this.selectedques.push(selectedquesid.questionId)
          console.log("selectedques",this.selectedques)

          // let filteredQuestions = []

          this.filteredQuestions = this.questionList.questions.filter((question: any) =>
            question.id == selectedquesid.questionId
          );

          console.log("Filtered Questiongg:", this.filteredQuestions);
            

          ///this.itemques=[...new Set(this.filteredQuestions)]
         this.itemques = Array.from(new Set([...this.itemques, ...this.filteredQuestions]));


          console.log("qwertygshd",this.itemques)


          this.filteredQuestions.forEach((filteredQuestion: any) => {

            console.log("Filtered Question:", filteredQuestion.question);
            this.items.push(filteredQuestion.question);
            console.log("items", this.items)
          });
        });

        this.quotaid = data.quotaId

        console.log("Quotas:", this.quotas);
      },
      error: (err: any) => {

        //#region 
        // We are using here as initialization because getting error if quota not exists.

        this.initializeQuotaData();
        //#endregion

        console.log("Error fetching quotas", err);
      }
    });

  }



  showInterlockedQuotas: boolean = false;
  toggleInterlockedQuotas() {
    this.showInterlockedQuotas = !this.showInterlockedQuotas;
  }

  quotaById() {

    this.surveyservice.getQuotaById(this.quotoid).subscribe({
      next: (data: any) => {
        this.isQuotasVisible = true;

        this.surveyQuotaJson = data as QuotaData;
        this.quotaid = data.quotaId
        this.surveycount = data.totalUsers;
        this.vendorid = 390

        console.log("quotabyid json", this.surveyQuotaJson)
        console.log("quotabyid id", this.quotaid)
        console.log("Quotas: quotabyid", this.quotas);
        this.getQuotaInterlock(this.quotaid)
      },
      error: (err: any) => {
        this.initializeQuotaData();
        //#endregion

        console.log("Error fetching quotas quotabyid", err);
      }
    });


  }


  manageQuota() {

    let isEdit = false;
    this.surveyQuotaJson.vendarId = this.vendorid
    if (this.surveyQuotaJson.quotaId > 0) {
      isEdit = true;
    }
    console.log("vendorid",this.vendorid)

    this.surveyservice.manageQuota(this.surveyQuotaJson, isEdit).subscribe({
      next: (response: any) => {
        this.getQuotaBySurveyId();
      },
      error: (error: any) => {
        console.log("Error while submitting quota:", error);
      }
    });
  }


  onDeleteQuestion(index: number) {
    this.surveyQuotaJson.questionDto.splice(index, 1);

    this.manageQuota();
  }

  onDeleteQuota() {
    this.surveyservice.deleteQuota(this.surveyQuotaJson.quotaId).subscribe({
      next: (response: any) => {
        this.getQuotaBySurveyId();
      },
      error: (error: any) => {
        console.log("Error while submitting quota:", error);
      }
    });

  }

  reset() {
    this.surveyQuotaJson.totalUsers = 0
  }

  // removeselectedques(index:number,quesid:number){
  //   this.questionList.questions = this.questionList.questions.filter((question: any) => question.id !== quesid);
  // }

 

  removeselectedques(index: number, quesid: number) {
    const indexInSelected = this.selectedQuestionIds.indexOf(quesid);
    if (indexInSelected === -1) {
        this.selectedQuestionIds.push(quesid);
    } else {
        this.selectedQuestionIds.splice(indexInSelected, 1);
    }
    this.selectedQuestionIds.push(...this.selectedques);
    console.log("selected ques",this.selectedQuestionIds)


  }


  isQuestionSelected(quesid: number): boolean {
      return this.selectedQuestionIds.includes(quesid);
  }

  selectedInterlockQues(interlockid: any[]) {
    debugger
    const matchingQuestions = this.surveyQuotaJson.questionDto.filter((question: any) =>
      interlockid.includes(question.questionId)
    );
  
    matchingQuestions.forEach((question: any) => {
      const options = question.optionsDto;
      // Generate all possible combinations of options
      const combinations = this.getCombinations(options);
      console.log(`Combinations for questionId ${question.questionId}:`, combinations);
    });
    debugger
  }
  
  // Function to generate combinations
  getCombinations(options: any[], k: number = options.length): any[][] {
    alert("work4")
    const combinations: any[][] = [];
  
    const comb = (prefix: any[], options: any[], k: number) => {
      if (k === 0) {
        combinations.push(prefix);
        console.log("combinations",combinations)
        return;
      }
  
      for (let i = 0; i < options.length; i++) {
        comb([...prefix, options[i]], options.slice(i + 1), k - 1);
      }
    };
  
    comb([], options, k);
    console.log("final combinations",combinations)
    return combinations;
  }


  saveCount() {
    alert("sdfghj")
    const dataToSend = {
      quotaId: 0,
      surveyId: this.surveyId,
      totalUsers: this.surveycount,
      centerId: this.centerId,
      status: "ACT",
      vendarId: this.vendorid,
      createdDate: this.getCurrentDateTime(),
      questionDto: {
        quotaQuestionsId: 0,
        quotaId: 0,
        questionId: 0,
        type: '',
        interlock: false,
        isOpenEnded: false,
        optionsDto: [] as { quotaOptionsId: number; quotaQuestionId: number; optionId: any; userCount: number }[]
      }
    };


    const options = this.selectedoptionid;

    options.forEach((optionId: any) => {
      const optionsDto = {
        quotaOptionsId: 0,
        quotaQuestionId: 0,
        optionId: optionId,
        userCount: 0
      }
      dataToSend.questionDto.optionsDto.push(optionsDto);
    });
    if (this.quotaid > 0) {
      this.surveyservice.updateQuota(dataToSend).subscribe(
        resp => {
          console.log("updateQuota ", resp)
          this.utility.showSuccess('Quota updated Successfully.');
        },
        error => {
          console.log("err create", error)
          this.utility.showError('error');
        }
      )
    } else {
      this.surveyservice.createQuota(dataToSend).subscribe(
        resp => {
          console.log("create quota", resp)
          this.utility.showSuccess('Quota Created Successfully.');
        },
        error => {
          console.log("err create", error)
          this.utility.showError('error');
        }
      )
    }

  }

  vendorsurveydata:any[]=[]

  getAllVendorSurveyList() {
    
    this.surveyservice.getVendorList(this.quotoid).subscribe((data: any) => {
      this.vendorsurveydata = data
      console.log("ertyu",this.vendorsurveydata)

    });
   
  }

  generateVendorUrl(){
    this.vendorurl=true
    this.vendorgeneratedurl = `${window.location.host}/survey/landing/live/${this.centername}/${this.centerId}/${this.surveyId}`;

  }

  copyToLink(inputElement: HTMLInputElement) {
    inputElement.select();
    document.execCommand('copy');
    // alert('Link copied to clipboard');
    this.utility.showSuccess('Link copied to clipboard')
  }

  
  vendorSelectId(event:any){
  
    this.surveyQuotaJson.totalUsers=0;
    this.surveyQuotaJson.questionDto=[];
    this.surveyQuotaJson.quotaId=0;
    // this.surveyQuotaJson.status=''
    // this.surveyQuotaJson.createdDate= new Date;
    // this.surveyQuotaJson.surveyId=0;
    this.selectedques=[];
    this.selectedQuestionIds=[];
    console.log("selected ques clear",this.selectedQuestionIds)
   
  }

  getAllOptionId(quesid:any){
    console.log("quesid",quesid)

    this.interlockquesid = quesid;
    //this.interlockoptionid = this.filteredQuestions.filter(item => item === quesid);
    
    this.interlockoptionlist = this.questionList.questions.filter((question: any) =>
      question.id == quesid
    );
    console.log("interlockoptionlist",this.interlockoptionlist[0].options)

    this.interlockoptionlist[0].options.forEach((item: any) => {
      this.interlockoptionid.push({ quesId: quesid, optionId: item.id });
      console.log("interlockoptionid", this.interlockoptionid);
    });
    
  }

  getCurrentOptionId(quesid:any){
    console.log("quesid",quesid)

    //this.interlockoptionid = this.filteredQuestions.filter(item => item === quesid);
    
    this.currentinterlockoptionlist = this.questionList.questions.filter((question: any) =>
      question.id == quesid
    );
    console.log("currentinterlockoptionlist",this.currentinterlockoptionlist[0].options)

    this.currentinterlockoptionlist[0].options.forEach((item:any) => {
      console.log(" currentinterlockoptionid option",item.id);
      
      this.currentinterlockoptionid.push(item.id);
      this.currentinterlockoptionid = Array.from(new Set(this.currentinterlockoptionid));
      console.log("currentinterlockoptionid",this.currentinterlockoptionid)
    });
  }
  
  saveInterlock() {
    const interlockPayload: any[] = [];
    const usercount = Math.floor(this.surveyQuotaJson.totalUsers / (this.currentinterlockoptionid.length * this.interlockoptionid.length));
  
    this.currentinterlockoptionid.forEach((item: any) => {
      interlockPayload.push({
        id: 0,
        quotaId: this.quotaid,
        questionId: this.currentinterlockid,
        isInterlock: true,
        optionId: item,
        userCount: usercount
      });
    });
  
    this.interlockoptionid.forEach((item: any) => {
      interlockPayload.push({
        id: 0,
        quotaId: this.quotaid,
        questionId: item.quesId,
        isInterlock: true,
        optionId: item.optionId,
        userCount: usercount
      });
    });
  
    this.surveyservice.interlockQuota(interlockPayload).subscribe({
      next: (resp) => {
        console.log("API response:", resp);
        this.utility.showSuccess("Successfully");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 200);
      },
      error: (err) => {
        console.error("API error:", err);
      }
    });
  }

  getQuotaInterlock(quotaid:any){
    this.surveyservice.getQuotaInterlock(quotaid).subscribe({
      next: (resp) => {
          this.quotainterlockdata = resp
          console.log("resp",resp);
          console.log("get interlo",this.quotainterlockdata)
      },
      error: (err) =>{
          console.log("error",err)
      }
    })
  }

  deleteInterlockquota(){
    this.surveyservice.deleteInterlockQuota(this.quotaid).subscribe({
      next: (resp) => {
        this.utility.showSuccess("Interlock deleted successfully");
        window.location.reload();

      },
      error: (err) =>{

      }
    })
  }

  
  
  
 
}