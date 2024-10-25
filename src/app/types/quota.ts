export class QuotaData {
    quotaId: number;
    surveyId: number;
    totalUsers: number;
    createdDate: Date;
    centerId: number;
    status: string;
    vendarId: number;
    questionDto: QuestionDto[];
  
    constructor() {
      this.quotaId = 0;
      this.surveyId = 0;
      this.totalUsers = 0;
      this.createdDate = new Date();
      this.centerId = 0;
      this.status = '';
      this.vendarId = 0;
      this.questionDto = [];
    }
  }
  
  export class QuestionDto {
    quotaQuestionsId: number;
    quotaId: number;
    questionId: number;
    type: string;
    isInterlock: boolean;
    isOpenEnded: boolean;
    optionsDto: OptionDto[];
  
    constructor() {
      this.quotaQuestionsId = 0;
      this.quotaId = 0;
      this.questionId = 0;
      this.type = '';
      this.isInterlock = false;
      this.isOpenEnded = false;
      this.optionsDto = [];
    }
  }
  
  export class OptionDto {
    quotaOptionsId: number;
    quotaQuestionId: number;
    optionId: number;
    userCount: number;
  
    constructor() {
      this.quotaOptionsId = 0;
      this.quotaQuestionId = 0;
      this.optionId = 0;
      this.userCount = 0;
    }
  }

  export class QuotaInterlock {
    id: number=0;
    quotaId: number;
    questionId: number;
    isInterlock:boolean= true;
    optionId: number;
    userCount: number;
  }
  