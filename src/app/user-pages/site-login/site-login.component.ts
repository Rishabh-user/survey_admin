import { Component } from '@angular/core';
import { SurveyService } from 'src/app/service/survey.service';
import { DataService } from 'src/app/service/data.service';
import { UtilsService } from 'src/app/service/utils.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-site-login',
  templateUrl: './site-login.component.html',
  styleUrls: ['./site-login.component.css']
})
export class SiteLoginComponent {
  userId: any;

  constructor(private utils: UtilsService, public themeService: DataService, private surveyservice: SurveyService, private router: Router,
    private route: ActivatedRoute,) {
  }

  // token = this.themeService.token
  sitetoken:any


  // ngOnInit(): void {
  //   this.sitetoken = this.route.snapshot.queryParamMap.get('token');
  //   localStorage.setItem('sitetoken',this.sitetoken)
  //   console.log("sitetoken",this.sitetoken)

  //     if (this.sitetoken) {
  //       //localStorage.removeItem('authToken');

  //       localStorage.setItem('authToken', this.sitetoken);

  //       const refreshCount = parseInt(localStorage.getItem('refreshCount') || '0', 10);

  //       if (refreshCount < 2) {
  //         localStorage.setItem('refreshCount', (refreshCount + 1).toString());

  //         setTimeout(() => {
  //           location.reload();
  //         }, 2000);
  //       } else {
  //         localStorage.setItem('refreshCount', '0');

  //         setTimeout(() => {
  //           const url = `/dashboard`;
  //           this.router.navigateByUrl(url);
  //         }, 2000);
  //       }

  //     } else {
  //       console.error('Token is not defined.');
  //     }
  

  //   this.getMyAccount();
  // }

  ngOnInit(): void {
    this.sitetoken = this.route.snapshot.queryParamMap.get('token');
    console.log("sitetoken", this.sitetoken);

    if (this.sitetoken) {
      localStorage.setItem('sitetoken', this.sitetoken);
      localStorage.setItem('authToken', this.sitetoken);

      if (!localStorage.getItem('refreshed')) {
        localStorage.setItem('refreshed', 'true');
        setTimeout(() => {
          location.reload();
        }, 2000);
        return;
      } else {
        localStorage.removeItem('refreshed');
        this.router.navigateByUrl('/dashboard');
      }
    } else {
      console.error('Token is not defined.');
      this.router.navigateByUrl('/dashboard');
      return;
    }

    this.getMyAccount();
  }



  getMyAccount() {
    this.userId = this.utils.getUserId();
    if (!this.userId) {
      console.error('User ID is not defined.');
      this.router.navigateByUrl('/error');
      return;
    }
    this.themeService.GetMyAccount(this.userId).subscribe((data: any) => {

    });
  }

  navigateToSiteLogin(token: string): void {
    this.router.navigate(['/user-pages/site-login'], { queryParams: { token: token } });
  }

}
