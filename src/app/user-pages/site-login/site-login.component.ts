import { Component } from '@angular/core';
import { SurveyService } from 'src/app/service/survey.service';
import { DataService } from 'src/app/service/data.service';
import { UtilsService } from 'src/app/service/utils.service';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-site-login',
  templateUrl: './site-login.component.html',
  styleUrls: ['./site-login.component.css']
})
export class SiteLoginComponent {
  userId:any;

  constructor(private utils: UtilsService, public themeService: DataService, private surveyservice:SurveyService,private router: Router,
    private route: ActivatedRoute,) {
  }

  token = this.themeService.token
  

  ngOnInit(): void {
    debugger
    console.log("token", this.token); 
  
    if (!localStorage.getItem('authToken')) {
      if (this.token) {
        localStorage.setItem('authToken', this.token); 
        const url = `/dashboard`;
        this.router.navigateByUrl(url);
      } else {
        console.error('Token is not defined.');
      }
    }
  
    debugger
    // Call getMyAccount() regardless of localStorage state
    this.getMyAccount();
  }
  


  getMyAccount() {
    this.userId = this.utils.getUserId();
    this.themeService.GetMyAccount(this.userId).subscribe((data: any) => {

    });
  }

}
