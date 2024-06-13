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

  token = this.themeService.token


  ngOnInit(): void {
    //debugger
    //console.log("token", this.token); 

    if (!localStorage.getItem('authToken')) {
      if (this.token) {
        localStorage.setItem('authToken', this.token);

        // Check the refresh count
        const refreshCount = parseInt(localStorage.getItem('refreshCount') || '0', 10);

        if (refreshCount < 2) {
          // Increment the refresh count and store it
          localStorage.setItem('refreshCount', (refreshCount + 1).toString());

          // Delay the page refresh by 2 seconds (2000 milliseconds)
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          // Reset the refresh count and navigate to the dashboard
          localStorage.setItem('refreshCount', '0');

          // Delay the redirection by 2 seconds (2000 milliseconds)
          setTimeout(() => {
            const url = `/dashboard`;
            this.router.navigateByUrl(url);
          }, 2000);
        }

      } else {
        console.error('Token is not defined.');
      }
    } else {
      // If the authToken is already present, reset the refresh count
      localStorage.setItem('refreshCount', '0');
    }


    //debugger
    // Call getMyAccount() regardless of localStorage state
    this.getMyAccount();
  }



  getMyAccount() {
    this.userId = this.utils.getUserId();
    this.themeService.GetMyAccount(this.userId).subscribe((data: any) => {

    });
  }

}
