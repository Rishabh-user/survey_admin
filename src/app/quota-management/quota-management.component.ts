import { Component } from '@angular/core';
import { DataService } from '../service/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SurveyService } from '../service/survey.service';
import { responseDTO } from '../types/responseDTO';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UtilsService } from '../service/utils.service';
import { QuestionDto, QuotaData } from '../types/quota';
import { CryptoService } from 'src/app/service/crypto.service';

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
  quotoid: any

  surveyQuotaJson: QuotaData;
  isEditQuota: boolean = false;
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
      }
    })

  }
  initializeQuotaData() {

    this.surveyQuotaJson = new QuotaData();

    this.surveyQuotaJson.createdDate = new Date();
    this.surveyQuotaJson.surveyId = this.surveyId;
    this.surveyQuotaJson.status = this.status;
  }



  hideBreadcrumb() {
    this.visibilityService.toggleBreadcrumbVisibility(false);
  }

  status: string;
  ngOnInit() {
    this.centerId = this.utils.getCenterId();
    this.hideBreadcrumb();
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
    this.GetSurveyDetails();
    this.getQuotaBySurveyId();
    this.quotaById();
  }
  showCountError: boolean = false;

  showQuotas() {
    if (this.surveycount <= 0 || isNaN(this.surveycount)) {
      this.showCountError = true;
      return;
    }

    this.showCountError = false;
    this.isQuotasVisible = true;
  }
  open(contentInterlock: any) {
    this.modalService.open(contentInterlock)
  }
  // Show add quotas
  quotas: any[] = [{ selectedQuestion: 'Select Question', showQuotasDiv: false }];

  addQuota() {

    const lastItem = this.surveyQuotaJson.questionDto[this.surveyQuotaJson.questionDto.length - 1];

    if (lastItem.questionId == 0) {
      alert("Please select question.");
    } else {
      const newQuestion = new QuestionDto();
      newQuestion.type = 'none';
      this.surveyQuotaJson.questionDto.push(newQuestion);
    }

  }


  showQuestionQuotas(index: number) {
    if (this.quotas[index].selectedQuestion !== 'Select Question') {
      this.quotas[index].showQuotasDiv = true;
    } else {
      this.quotas[index].showQuotasDiv = false;
    }
  }
  // Show and hide Census/Custom dive
  // showCensusDiv: boolean = false;
  // showCustomDiv: boolean = false;
  // censusActive: boolean = false;
  // customActive: boolean = false;
  // toggleCensus(index:number) {
  //   this.showCensusDiv = true;
  //   this.showCustomDiv = false;
  //   this.censusActive = true;
  //   this.customActive = false;
  // }
  // toggleCustom(index:number) {
  //   this.showCensusDiv = false;
  //   this.showCustomDiv = true;
  //   this.censusActive = false;
  //   this.customActive = true;
  // }
  // toggleNone(index:number) {
  //   this.showCensusDiv = false;
  //   this.showCustomDiv = false;
  //   this.censusActive = false;
  //   this.customActive = false;
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
  items: string[] = ['Gender', 'Age', 'Region']; // Array of dynamic items
  toggleActive(index: number) {
    this.activeIndex = index;
  }



  // question api

  questionList: any;
  genericlist: any[] = [];
  optionlist: any[] = [];
  questions: any[] = []
  pageSize: number = 10;
  pageNumber: number = 1
  surveycount: number;
  totalsum: number[] = [];

  GetSurveyDetails() {
    this.questionList = '';
    this.surveyservice.getSurveyDetailsById(this.pageNumber, this.pageSize, this.surveyId).subscribe((data: any) => {
      this.questionList = data;
      console.log("questionList", this.questionList);

      this.questionList.questions.forEach((question: any) => {
        if (question.genericType) {
          this.genericlist.push(question.genericType);
        }
        console.log("qwerty", this.genericlist)
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

  saveQuota(index: number) {
    console.log("saving quota", [index])
    const dataToSend = {
      quotaId: 0,
      surveyId: this.surveyId,
      totalUsers: this.surveycount,
      centerId: this.centerId,
      status: "ACT",
      createdDate: this.getCurrentDateTime(),
      questionDto: {
        quotaQuestionsId: 0,
        quotaId: 0,
        questionId: this.selectedquestionid,
        type: this.activeValue,
        interlock: 0,
        isOpenEnded: false,
        optionsDto: [] as { quotaOptionsId: number; quotaQuestionId: number; optionId: any; userCount: number }[]
      }
    };


    const options = this.selectedoptionid[index];

    options.forEach((optionId: any) => {
      const optionsDto = {
        quotaOptionsId: 0,
        quotaQuestionId: 0,
        optionId: optionId,
        userCount: this.dividedValue
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
  getQuotaBySurveyId() {

    this.surveyservice.getQuotaBySurveyId(this.surveyId).subscribe({
      next: (data: any) => {
        this.isQuotasVisible = true;

        this.surveyQuotaJson = data as QuotaData;
        this.quotaid = data.quotaId
        // this.quotas = [...data?.questionDto];
        this.surveycount = data.totalUsers;

        // if (data && data.questionDto && Array.isArray(data.questionDto) && data.questionDto.length > 0) {
        //   this.isQuotasVisible = true;  
        //   this.questionDto = data.questionDto; // Assigning questionDto data

        //   this.questionDto.forEach((question: any) => {
        //     this.selectedQuestion = question.questionId;
        //     console.log(this.selectedQuestion);
        //     console.log("quotaQuestionsId:", question.quotaQuestionsId);
        //     console.log("quotaId:", question.quotaId);
        //     console.log("questionId:", question.questionId);
        //     console.log("type:", question.type);
        //     console.log("isInterlock:", question.isInterlock);
        //     console.log("isOpenEnded:", question.isOpenEnded);

        //     // Iterate over optionsDto if it exists
        //     if (question.optionsDto && question.optionsDto.length > 0) {
        //       question.optionsDto.forEach((option: any) => {
        //         console.log("quotaOptionsId:", option.quotaOptionsId);
        //         console.log("quotaQuestionId:", option.quotaQuestionId);
        //         console.log("optionId:", option.optionId);
        //         console.log("userCount:", option.userCount);
        //       });
        //     }
        //   });
        // }
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

        console.log("quotabyid json", this.surveyQuotaJson)
        console.log("quotabyid id", this.quotaid)
        console.log("Quotas: quotabyid", this.quotas);
      },
      error: (err: any) => {
        this.initializeQuotaData();
        //#endregion

        console.log("Error fetching quotas quotabyid", err);
      }
    });


  }
}
