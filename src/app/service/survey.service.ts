import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { responseDTO } from '../types/responseDTO';
import { responseGenericQuestion } from '../types/responseGenericQuestion';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  apiUrl = environment.apiUrl;
  userId = 0;
  getStatesByCountryId: any;
  constructor(private http: HttpClient, private util: UtilsService) {
    this.userId = util.getUserId();
  }
  GetCategories() {
    return this.http
      .get<responseDTO>(`${this.apiUrl}api/admin/${this.userId}/Category/GetCategories`)
      .pipe(map((result) => result as responseDTO));
  }

  GetGenericQuestion(countryId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GenericQuestion/GetGenericType?countryId=${countryId}`;
    return this.http.get<responseDTO[]>(url);
  }

  GetGenericQuestionType(typeId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GenericQuestion/GetGenericQuestions?typeId=${typeId}`;
    return this.http.get<responseDTO[]>(url);
  }


  GetQuestionTypes(): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GenericQuestion/GetQuestionTypes`;
    return this.http.get<responseDTO[]>(url);
  }
  GetStateByCountryID(country_id: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Geography/GetStateByCountryId?countryIds=${country_id}`;
    return this.http.get<responseDTO[]>(url);
  }
  GetCountries(): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Geography/GetCountries`;
    return this.http.get<responseDTO[]>(url);
  }
  GetListOfCountry(country_id: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Geography/GetGeographyListByCountryId?countryIds=${country_id}`;
    return this.http.get<responseDTO[]>(url);
  }


  createSurvey(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Survey/CreateSurvey`;

    const sanitizedData = this.removeCircularReferences(data);

    return this.http.post(url, sanitizedData, { responseType: 'text' });
  }

  updateSurvey(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Survey/UpdateSurvey`;

    return this.http.post(url, data, { responseType: 'text' });
  }

  // GetSurveyById(userId: any, surveycategoryid: any): Observable<responseDTO[]> {
  //   userId = localStorage.getItem("userId");
  //   const url = `${this.apiUrl}api/admin/${userId}/Survey/GetSurveyById?surveyId=${surveycategoryid}`;
  //   return this.http.get<responseDTO[]>(url);
  // }

  CreateGeneralQuestion(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/CreateGeneralQuestion`;
    return this.http.post(url, data, { responseType: 'text' });
  }
  updateGeneralQuestion(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/UpdateGeneralQuestion`;
    return this.http.post(url, data, { responseType: 'text' });
  }


  GetSurveyById(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Survey/GetSurveyById?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }
  getQuestionDetailsById(questionId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/QuestionById?qid=${questionId}`;
    return this.http.get<responseDTO[]>(url);
  }

  getLogicValues() {
    return this.http
      .get<responseDTO>(`${this.apiUrl}api/admin/${this.userId}/Logics/GetValues`)
      .pipe(map((result) => result as responseDTO));
  }
  getLogicThens() {
    return this.http
      .get<responseDTO>(`${this.apiUrl}api/admin/${this.userId}/Logics/GetThens`)
      .pipe(map((result) => result as responseDTO));
  }
  updateSurveyStatus(data: any): Observable<any> {
    const { surveyId, surveyStatus } = data;
    const url = `${this.apiUrl}api/admin/${this.userId}/Survey/UpdateSurveyStatus?surveyId=${encodeURIComponent(surveyId)}&status=${encodeURIComponent(surveyStatus)}`;

    return this.http.post(url, data, { responseType: 'text' });
  }
  // getLogicQuestionList(data: any) {
  //   const { surveyId, questionId } = data;
  //   return this.http
  //     .get<responseDTO>(`${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetList?surveyID=${encodeURIComponent(surveyId)}`)
  //     .pipe(map((result) => result as any));
  // }
  getLogicQuestionList(data: any) {
    const { surveyId, questionId } = data;
    return this.http
      .get<responseDTO>(`${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetList?surveyID=${encodeURIComponent(surveyId)}&quesId=${encodeURIComponent(questionId)}`)
      .pipe(map((result) => result as any));
  }

  createLogic(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/CreateLogics`;
    return this.http.post(url, data, { responseType: 'text' });
  }
  updateLogic(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/UpdateLogics`;
    return this.http.post(url, data, { responseType: 'text' });
  }
  getGenericQuestionType1(typeId: any): Observable<responseGenericQuestion[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GenericQuestion/GetGenericQuestions?typeId=${typeId}`;
    return this.http.get<responseGenericQuestion[]>(url);
  }
  uploadImageQuestion(file: File, queryParams: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    let url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/UploadQuestionImage`;
    if (queryParams) {
      const queryParamsString = new URLSearchParams(queryParams).toString();
      url += `?${queryParamsString}`;
    }
    return this.http.post(url, formData, { responseType: 'text' });
  }
  uploadVideoQuestion(file: File, queryParams: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    let url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/UploadQuestionVideo`;
    if (queryParams) {
      const queryParamsString = new URLSearchParams(queryParams).toString();
      url += `?${queryParamsString}`;
    }
    return this.http.post(url, formData, { responseType: 'text' });
  }
  changeQuestionPosition(queryParams: any): Observable<any> {

    let url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/ChangeQuestionPosition`;
    if (queryParams) {
      const queryParamsString = new URLSearchParams(queryParams).toString();
      url += `?${queryParamsString}`;
    }
    return this.http.get(url, { responseType: 'text' });
  }
  getOptionsLogicValues() {
    return this.http
      .get<responseDTO>(`${this.apiUrl}api/admin/${this.userId}/Logics/GetOptionLogicValue`)
      .pipe(map((result) => result as responseDTO));
  }
  getOptionsByQuestionId(queryParams: any): Observable<any> {

    let url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetOptions`;
    if (queryParams) {
      const queryParamsString = new URLSearchParams(queryParams).toString();
      url += `?${queryParamsString}`;
    }
    return this.http.get(url, { responseType: 'text' });
  }
  getCountries() {
    return this.http
      .get<responseDTO>(`${this.apiUrl}api/admin/${this.userId}/Geography/GetCountries`)
      .pipe(map((result) => result as responseDTO));
  }
  removeCircularReferences(data: any): any {
    const seen = new WeakSet();
    const sanitizedData = JSON.parse(JSON.stringify(data, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    }));

    return sanitizedData;
  }
  getSurveyListWithPage(pageNumber: number, pageSize: number): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Survey/GetSurveyList?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<responseDTO[]>(url);
  }
  //getSurveyDetailsById
  getSurveyDetailsById(pageNumber: number, pageSize: number, surveyId: number): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Survey/GetSurveyById?surveyId=${surveyId}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<responseDTO[]>(url);
  }
  GetRecentSurveyList(): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Survey/RecentCreatedSurvey`;
    return this.http.get<responseDTO[]>(url);
  }

  GetSurveyList(): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Survey/GetSurveyList?pageNumber=1&pageSize=100`;
    return this.http.get<responseDTO[]>(url);
  }
  getQuestionLogics(qid: number, sid: number): Observable<any> {
    const params = {
      qid: qid.toString(),
      sid: sid.toString()
    };
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetLogics`;
    return this.http.get<any>(url, { params });
  }
  postRandomizedQuestions(data: any[]): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/QuestionRandomize`;
    return this.http.post(url, data);
  }
  postRandomizedQuestionsUpdate(data: any[]): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/UpdateQuestionRandomize`;
    return this.http.post(url, data);
  }
  surveyLooping(surveyId: number, dummySurveyId: number): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/SurveyLooping?surveyId=${surveyId}&dummySurveyId=${dummySurveyId}`;
    return this.http.post(url, {});
  }
  getAgeOptionsLogicValues() {
    return this.http
      .get<responseDTO>(`${this.apiUrl}api/admin/${this.userId}/Logics/GetAgeOperationValue`)
      .pipe(map((result) => result as responseDTO));
  }
  createCalculation(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/CreateLogicsOnAgeCalculation`;
    return this.http.post(url, data, { responseType: 'text' });
  }
  getQuestionListBranching(qid: number, sid: number): Observable<any> {
    const params = {
      quesId: qid.toString(),
      surveyID: sid.toString()
    };
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetList`;
    return this.http.get<any>(url, { params });
  }
  getRandomizedQuestions(sid: number): Observable<any> {
    const params = {
      sId: sid.toString()
    };
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetQuestionRandomize`;
    return this.http.get<any>(url, { params });
  }
  getSurveyLooping(sid: number): Observable<any> {
    const params = {
      surveyId: sid
    };
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetSurveyLooping`;
    return this.http.get<any>(url, { params });
  }
  getQuestionListAgeCalculation(qid: number, sid: number): Observable<any> {
    const params = {
      qId: qid.toString(),
      sId: sid.toString()
    };
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetAgeCalculationLogics`;
    return this.http.get<any>(url, { params });
  }
  createExpertAid(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/ExpertAid/CreateExpertAid`;
    return this.http.post(url, data, { responseType: 'text' });
  }
  deleteQuestion(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/DeleteQuestionById`;
    return this.http.delete(url, { body: data, responseType: 'text' });
  }
  updateProfile(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Profile/UpdateProfile`;
    return this.http.post(url, data, { responseType: 'text' });
  }
  updateExpertAidProfile(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/ExpertAid/UpdateExpertAid`;
    return this.http.post(url, data, { responseType: 'text' });
  }


  cloneQuestion(questionId: any, sID: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/CloneQuestion?qID=${questionId}&sID=${sID}`;
    const data = {};

    return this.http.post<responseDTO[]>(url, data);
  }

  getReportSurvey(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Report/SurveyReport?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }

  getLogicCount(surveyId: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetCountLogicInSurvey?sID=${surveyId}`;
    return this.http.get(url, { responseType: 'text' });
  }

  getSurveySearch(queryParams: any): Observable<any> {

    let url = `${this.apiUrl}api/admin/${this.userId}/Survey/GetSurveySearch`;
    if (queryParams) {
      const queryParamsString = new URLSearchParams(queryParams).toString();
      url += `?${queryParamsString}`;
    }
    return this.http.get(url, { responseType: 'text' });
  }


  deleteSurvey(surveyId: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Survey/DeleteSurveyById?surveyId=${surveyId}`;
    return this.http.delete(url, { responseType: 'text' });
  }


  GetQuestionListBySurveyId(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Survey/GetQuestionListBySurveyId?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }


  uploadOptionImage(file: File, qid: any, oid: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/UploadOptionImage?qid=${qid}&oid=${oid}`;
    return this.http.post(url, formData, { responseType: 'text' });
  }


  uploadImageAddScreen(file: File, userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiUrl}api/admin/${userId}/GeneralQuestion/UploadQuestionImage`;
    return this.http.post(url, formData, { responseType: 'text' });
  }
  deleteQuestionLogicById(logicId: number) {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/DeleteQuestionLogicById?logicId=${logicId}`;
    return this.http.delete(url);
  }

  getNotification(): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Notification/GetNotifications`;
    return this.http.get<responseDTO[]>(url);
  }

  // Quota Apii
  createQuota(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Quota/CreateQuota`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  updateQuota(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Quota/UpdateQuota`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  manageQuota(data: any, isEdit: boolean): Observable<any> {

    const action = (isEdit) ? 'UpdateQuota' : 'CreateQuota';
    const url = `${this.apiUrl}api/admin/${this.userId}/Quota/${action}`;
    
    return this.http.post(url, data, { responseType: 'text' });
  }

  deleteQuota(quotaId: any): Observable<any> {

    const url = `${this.apiUrl}api/admin/${this.userId}/Quota/DeleteQuota?quotaId=${quotaId}`;
    
    return this.http.delete(url);
  }



  getQuotaBySurveyId(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Quota/GetQuotaBySurveyId?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }

  uploadAddScreenVideoQuestion(file: File, qid: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    let url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/UploadQuestionVideo?qid=${qid}`;

    return this.http.post(url, formData, { responseType: 'text' });
  }


  getSurveyReportBySurvey(pageNumber: number, pageSize: number): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Report/GetSurveyList?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<responseDTO[]>(url);
  }

  getSurveyReportBySurveyId(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Report/SurveyReport?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }

  getVendarSurveyList(pageNumber: number, pageSize: number): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Vendar/GetSurveyList?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<responseDTO[]>(url);
  }
  deleteRandomizedQuestions(surveyId: any, groupId: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/DeleteQuestionRandomize?surveyId=${surveyId}&groupId=${groupId}`;
    return this.http.post(url, { responseType: 'text' });
  }
  getQuotaById(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Vendar/GetQuotaBySurveyId?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }
  getReportBySurvey(year: any, month?: number | null): Observable<responseDTO[]> {
    let url = `${this.apiUrl}api/admin/${this.userId}/Survey/ReportBySurvey?byYear=${year}`;
    if (month) {
      url += `&byMonth=${month}`;
    }
    return this.http.get<responseDTO[]>(url);
  }

  generateCsv(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    if ((navigator as any).msSaveBlob) {
      // For IE 10+
      (navigator as any).msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // For other browsers that support the HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  optionLogics(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/OptionLogics`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  GetOptionLogic(qid: any,sid:any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetOptionLogics?qid=${qid}&sid=${sid}`;
    return this.http.get<responseDTO[]>(url);
  }

  deleteOptionLogicById(logicId:any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/DeleteOptionLogicById?logicId=${logicId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  getReport(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Report/RowSurveyReportById?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }

  getQuesNumberRequired(surveyId: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GenericQuestion/IsQuestionNumberRequired?surveyId=${surveyId}`;
    return this.http.get(url, { responseType: 'text' });
  }
  partnerRedirect(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/PartnerRedirects/CreatePartnerRedirect`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  GetPartnerRirection(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}GetPartnerRedirect?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }

  GetBinaryReport(surveyId: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Report/GetBinaryReport?surveyId=${surveyId}`;
    return this.http.get<string>(url);
  }

  updatePartnerRedirect(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/PartnerRedirects/UpdarePartnerRedirect`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  deletePartnerRedirect(surveyId: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/PartnerRedirects/DeletePartnerRedirect?surveyId=${surveyId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  createPiping(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/CreatePiping`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  updatePiping(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/UpdatePiping`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  GetPiping(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/GetPiping?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }

  GetPipingByGroup(surveyId: any,questionId:any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/GetPipingByGroup?surveyId=${surveyId}&questionId=${questionId}`;
    return this.http.get<responseDTO[]>(url);
  }

  deletePipe(surveyId: any,groupId:any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/DeletePiping?surveyId=${surveyId}&groupId=${groupId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  endScreen(surveyId: any,questionId:any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/SetEndScreen?surveyId=${surveyId}&questionId=${questionId}`;
    return this.http.post(url, { responseType: 'text' });
  }

  createMatrixHeaderLogics(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/CreateMatrixHeaderLogics`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  updateMatrixHeaderLogics(data: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/UpdateMatrixHeaderLogics`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  getMatrixHeaderLogics(surveyId:any,questionId:any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/GetMatrixHeaderLogics?surveyId=${surveyId}&questionId=${questionId}`;
    return  this.http.get<responseDTO[]>(url);
  }

  getOpenEndedValues(isOpenEnded: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/GetValues?isOpenEnded=${isOpenEnded}`;
    return this.http.get<responseDTO[]>(url);
  }

  getEndScreenId(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/GetEndScreen?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }

  deleteEndScreen(questionId: any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/DeleteScreen?questionId=${questionId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  // getMatrixHeaderColumn(questionId:any): Observable<responseDTO[]> {
  //   const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetMatrixHeadersByQuestionId?questionId=${questionId}`;
  //   return  this.http.get<responseDTO[]>(url);
  // }

  getMatrixHeaderColumn(queryParams: any): Observable<any> {

    let url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/GetMatrixHeadersByQuestionId`;
    if (queryParams) {
      const queryParamsString = new URLSearchParams(queryParams).toString();
      url += `?${queryParamsString}`;
    }
    return this.http.get(url, { responseType: 'text' });
  }

  deleteMartixLogic(logicId: any,groupId:any): Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/DeleteMatrixHeaderLogic?logicId=${logicId}&groupId=${groupId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

 
  getVendorList(surveyId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Profile/GetProfileBySurveyId?surveyId=${surveyId}`;
    return this.http.get<responseDTO[]>(url);
  }

  getMultiSelectValues(isOpenEnded:boolean): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Logics/GetMultiSelectValues?isOpenEnded=${isOpenEnded}`;
    return this.http.get<responseDTO[]>(url);
  }

  deleteAnwerGroup(groupId:any,quesId:any):Observable<any> {
    const url=`${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/DeleteAnswerGroup?groupId=${groupId}&questionId=${quesId}`;
    return this.http.post(url, { responseType: 'text' });
    
  }

  deleteAutoCode(surveyId:any):Observable<any> {
    const url=`${this.apiUrl}DeleteAutocode?surveyId=${surveyId}`;
    return this.http.post(url, { responseType: 'text' });
  }
  
  interlockQuota(data:any):Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Quota/QuotaInterlock`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  getQuotaInterlock(quotaId:any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Quota/ParingOptions?quotaId=${quotaId}`;
    return this.http.get<responseDTO[]>(url);
  }

  deleteInterlockQuota(quotaId:any):Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Quota/DeleteInterlock?quotaId=${quotaId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  deleteQuotaQuestion(quotaId:any,quesId:any):Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Quota/DeleteQuotaQuestion?quotaId=${quotaId}&questionId=${quesId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  getClientList(PageNumber:any,PageSize:any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${this.userId}/Report/GetReportList?PageNumber=${PageNumber}&PageSize=${PageSize}`;
    return this.http.get<responseDTO[]>(url);
  }

  cloneSurvey(sId:any):Observable<any> {
    const url = `${this.apiUrl}api/admin/${this.userId}/GeneralQuestion/CloneSurvey?sId=${sId}`;
    return this.http.post(url, { responseType: 'text' });
  }

}