import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;

  private userData = new BehaviorSubject<User | any>(null);
  public userData$ = this.userData.asObservable();


  constructor(private http: HttpClient, private router: Router) {

  }


  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  login(userDetails: any) {
    
    localStorage.removeItem('authToken');
    //localStorage.clear();
    const params = new HttpParams()
      .set('email', userDetails.email)
      .set('password', userDetails.password)
      .set('captchertoken', userDetails.captchertoken);
    return this.http.post(`${this.apiUrl}Login?${params.toString()}`, userDetails, { responseType: 'text' }).pipe(
      map((response) => {
        if (response) {
          localStorage.setItem('authToken', response);
          this.setUserDetails();
        }
        
        return response;
      }),
      
      catchError((error) => {
        
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
    
  }


  setUserDetails() {
    this.userData.next(null);
    if (localStorage.getItem('authToken')) {
      const userDetails = new User();
      var token = localStorage.getItem('authToken');

      let decodeUserDetails;
      if (token) {
        decodeUserDetails = JSON.parse(window.atob(token.split('.')[1]));

        var _userDetail = JSON.parse(decodeUserDetails.user);

        userDetails.role = _userDetail?.Role;
        userDetails.userId = _userDetail?.Id;
        userDetails.userName = _userDetail?.Name;
        userDetails.userEmail = _userDetail?.Email;
        userDetails.RoleId = _userDetail?.RoleId;
        userDetails.CenterId = _userDetail?.CenterId;
        userDetails.CenterName = _userDetail?.CenterName;
        userDetails.PlanId = _userDetail?.PlanId

        this.userData.next(userDetails);
      } else {
        this.logout();
      }
    }
  }

  initializeUserDetails() {
    this.setUserDetails();
  }

  logout(returnUrl = '') {
    localStorage.removeItem('authToken');
    localStorage.clear();
    this.userData.next(null);

    if (returnUrl != '') {
      this.router.navigate(['/login', returnUrl]);
    } else {
      this.router.navigate(['/login']);
    }
  }
  registerOrganization(data: any): Observable<any> {
    const url = `${this.apiUrl}RegisterOrganization`
    return this.http.post(url, data).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }
  verifyEmail(dataToSend: any): Observable<any> {
    const url = `${this.apiUrl}EmailVerify`;
    return this.http.post(url, dataToSend, { responseType: 'text' }).pipe(
      map((response) => {

        if (response.charAt(0) === '"' && response.charAt(response.length - 1) === '"') {
          response = response.slice(1, -1);
        }
        if (response) {
          localStorage.setItem('authToken', response);
          this.setUserDetails();
        }
        return response;
      })
    );
  }
  resetPassword(email: string) {
    const url = `${this.apiUrl}ForgetPassword?emailId=${email}`;
    return this.http.post(url, {});
  }
  verifyEmailAndResetPassword(data: any) {
    const url = `${this.apiUrl}EmailVerifyForgetPassword`;
    return this.http.post(url, data, { responseType: 'text' });
  }

  private clientId = 'YOUR_CLIENT_ID';
  private clientSecret = 'YOUR_CLIENT_SECRET';
  private redirectUri = 'https://opinionest.com/dashboard/profile-settings';
  private tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';

  getAccessToken(code: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', this.redirectUri);
    body.set('client_id', this.clientId);
    body.set('client_secret', this.clientSecret);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(this.tokenUrl, body.toString(), { headers });
  }

}
