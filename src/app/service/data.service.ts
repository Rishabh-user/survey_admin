import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { responseDTO } from '../types/responseDTO';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public isSidebarVisibleSubject = new BehaviorSubject<boolean>(true);
  isSidebarVisible$ = this.isSidebarVisibleSubject.asObservable();

  private questionIdSource = new BehaviorSubject<any>(null);
  currentQuestionId = this.questionIdSource.asObservable();

  private redirectionuid = new BehaviorSubject<any>(null);
  uid = this.redirectionuid.asObservable();

 

  userId: any;

  public addMargin: boolean = false;
  public addwidth: boolean = false;
  public dashboardMargin: boolean = false;
  makeRequest: any;
  getSyrveyReportBySurveyId: any;
  getSurveyReportBySurveyId: any;
  public toggle(): void {
    this.addMargin = !this.addMargin;
    this.addwidth = !this.addwidth;
    this.dashboardMargin = !this.dashboardMargin;
  }

  public closeSideBar() {
    this.addMargin = true;
    this.addwidth = true;
    this.dashboardMargin = true;
  }

  public hoveraddwidth: boolean = false;

  setHoverAddWidth(hover: boolean): void {
    this.hoveraddwidth = hover;
  }


  changeQuestionId(questionId: any){
    this.questionIdSource.next(questionId);
    
  }

  redirectionUID(questionId: any){
    this.redirectionuid.next(questionId);
    
  }

  private headerVisibleSubject = new BehaviorSubject<boolean>(true);
  private footerVisibleSubject = new BehaviorSubject<boolean>(true);
  private navbarVisibleSubject = new BehaviorSubject<boolean>(true);
  private breadcrumbVisibleSubject = new BehaviorSubject<boolean>(true);
  public articleVisible = new BehaviorSubject<boolean>(true);

  headerVisible$ = this.headerVisibleSubject.asObservable();
  footerVisible$ = this.footerVisibleSubject.asObservable();
  navbarVisible$ = this.navbarVisibleSubject.asObservable();
  breadcrumbVisible$ = this.breadcrumbVisibleSubject.asObservable();

  toggleHeaderVisibility(visible: boolean) {
    this.headerVisibleSubject.next(visible);
  }

  toggleFooterVisibility(visible: boolean) {
    this.footerVisibleSubject.next(visible);
  }

  toggleNavbarVisibility(visible: boolean) {
    this.navbarVisibleSubject.next(visible);
  }

  toggleSidebar() {
    this.isSidebarVisibleSubject.next(!this.isSidebarVisibleSubject.value);
  }

  toggleBreadcrumbVisibility(visible: boolean) {
    this.breadcrumbVisibleSubject.next(visible);
  }

  token = '';

  sitetoken=localStorage.getItem('sitetoken')


  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private util: UtilsService) {
    this.userId = util.getUserId();
  }

  GetAboutUs(userId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${userId}/AboutUs/GetAboutUs`;
    return this.http.get<responseDTO[]>(url);
  }
  CreateAboutUs(data: any): Observable<any> {
    var userId = this.util.getUserId();
    const url = `${this.apiUrl}api/admin/${userId}/AboutUs/CreateAboutUs`;

    return this.http.post(url, data, { responseType: 'text' });
  }


  GetPrivacyPolicy(userId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${userId}/PrivacyPolicy/GetPrivacyPolicy`;
    return this.http.get<responseDTO[]>(url);
  }
  CreatePrivacyPolicy(data: any): Observable<any> {
    var userId = this.util.getUserId();
    const url = `${this.apiUrl}api/admin/${userId}/PrivacyPolicy/CreatePrivacyPolicy`;

    return this.http.post(url, data, { responseType: 'text' });
  }



  GetTermsConditions(userId: any): Observable<responseDTO[]> {
    const url = `${this.apiUrl}api/admin/${userId}/TermAndCondition/GetTermAndConditions`;
    return this.http.get<responseDTO[]>(url);
  }
  CreateTermsConditions(data: any): Observable<any> {
    var userId = this.util.getUserId();
    const url = `${this.apiUrl}api/admin/${userId}/TermAndCondition/CreateTermAndCondition`;

    return this.http.post(url, data, { responseType: 'text' });
  }


  GetMyAccount(userId: any): Observable<responseDTO[]> {
    
    const headers = new HttpHeaders({
      'Custom-Header': this.sitetoken || ''
    });
    const url = `${this.apiUrl}api/admin/${userId}/Profile/GetProfileById?usetId=${userId}`;
    return this.http.get<responseDTO[]>(url, { headers });
  }
  CreateMyAccount(data: any): Observable<any> {
    var userId = this.util.getUserId();
    const url = `${this.apiUrl}api/admin/${userId}/Profile/UpdateProfile`;

    return this.http.post(url, data, { responseType: 'text' });
  }


  ChangePassword(data: any): Observable<any> {
    var userId = this.util.getUserId();
    const url = `${this.apiUrl}api/admin/${userId}/Profile/ChangePassword`;

    return this.http.post(url, data, { responseType: 'text' });
  }


  GetAllUser(userId: any): Observable<responseDTO[]> {
    var userId = this.util.getUserId();
    const url = `${this.apiUrl}api/admin/${userId}/Profile/GetProfile`;
    return this.http.get<responseDTO[]>(url);
  }
  AddNewUser(data: any): Observable<any> {
    var userId = this.util.getUserId();
    const url = `${this.apiUrl}api/admin/${userId}/Profile/CreateProfile`;

    return this.http.post(url, data, { responseType: 'text' });
  }
  uploadImage(file: File, userId: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${this.apiUrl}api/admin/${userId}/Profile/ChangeProfileImage`;
    return this.http.post<any>(url, formData);
  }
  uploadImageAboutUs(file: File, userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiUrl}api/admin/${userId}/AboutUs/UploadAboutImage`;
    return this.http.post(url, formData, { responseType: 'text' });
  }
  uploadImageTNC(file: File, userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiUrl}api/admin/${userId}/TermAndCondition/UploadTermAndConditionsImage`;
    return this.http.post(url, formData, { responseType: 'text' });
  }
  uploadImagePP(file: File, userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `${this.apiUrl}api/admin/${userId}/PrivacyPolicy/UploadPrivacyPolicyImage`;
    return this.http.post(url, formData, { responseType: 'text' });
  }
  GetAllUserProfileById(userId: any, centerId: any): Observable<responseDTO[]> {
    var userId = this.util.getUserId();
    const url = `${this.apiUrl}api/admin/${userId}/Profile/GetProfileByOrgnaizationId?centerId=${centerId}`;
    return this.http.get<responseDTO[]>(url);
  }
  getExpertAidById(centerId: any): Observable<responseDTO[]> {
    var userId = this.util.getUserId();
    const url = `${this.apiUrl}api/admin/${userId}/ExpertAid/GetExpertAidByCenter?centerId=${centerId}`;
    return this.http.get<responseDTO[]>(url);
  }

  getAllExpertAidList(userId: any): Observable<responseDTO[]> {
    var userId = this.util.getUserId();
    const url = `${this.apiUrl}api/admin/${userId}/ExpertAid/GetExpertAid`;
    return this.http.get<responseDTO[]>(url);
  }


  private searchQuerySubject = new BehaviorSubject<string>('');

  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  getSearchQuery(): Observable<string> {
    return this.searchQuerySubject.asObservable();
  }


}
