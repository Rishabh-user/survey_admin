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

  ngOnInit(): void {
    //localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzY3JpcDgiLCJpc3MiOiJzY3JpcDgiLCJqdGkiOiJhNTI2NDgxMi00MDZhLTRiMjAtODI0Mi1hZThmMThmYjcyY2YiLCJ1c2VyIjoie1wiSWRcIjoxLFwiTmFtZVwiOlwiVmlqYXkgS3VtYXJcIixcIkVtYWlsXCI6XCJ2ai52aWpheUBnbWFpbC5jb21cIixcIlJvbGVJZFwiOjEsXCJSb2xlXCI6XCJTdXBlckFkbWluXCIsXCJFcnJvclwiOm51bGwsXCJDZW50ZXJJZFwiOjEsXCJDZW50ZXJOYW1lXCI6XCJ0cmFja29waW5pb25cIixcIlBhaWRcIjp0cnVlLFwiUGxhbklkXCI6MjUwMCxcIkNlbnRlckRhdGVcIjpcIjIwMjQtMDEtMDlUMTc6MTA6MzEuNjYzXCJ9IiwiZXhwIjoxNzE5MDU4OTgzfQ.mFZbg7fIpgu_I9BO56aCo15Iluk8fohiVDYJTjPb6Bs');
    if (!localStorage.getItem('authToken')) {
      localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJzY3JpcDgiLCJpc3MiOiJzY3JpcDgiLCJqdGkiOiJhYWMwMDRkZi04OTA4LTQ4OTctOTIxZi0zOTVhZTNkNWZhNWUiLCJ1c2VyIjoie1wiSWRcIjoyNTYsXCJOYW1lXCI6XCJSaXNoYWJoIFJhd2F0XCIsXCJFbWFpbFwiOlwicmlzaGFiaC52ZW5kZXJAeW9wbWFpbC5jb21cIixcIlJvbGVJZFwiOjUsXCJSb2xlXCI6XCJWZW5kb3JcIixcIkVycm9yXCI6bnVsbCxcIkNlbnRlcklkXCI6MSxcIkNlbnRlck5hbWVcIjpcInRyYWNrb3BpbmlvblwiLFwiUGFpZFwiOnRydWUsXCJQbGFuSWRcIjoyNTAwLFwiQ2VudGVyRGF0ZVwiOlwiMjAyNC0wMS0wOVQxNzoxMDozMS42NjNcIn0iLCJleHAiOjE3MTkwNjIxOTd9.IfHWB5Zo03z5tXmyb8wWOP2c-YXf8-55_1HhOqlUWq0');
      const url = `/#/dashboard`;
      this.router.navigateByUrl(url);
      // window.location.reload();
    }
    this.getMyAccount();
  }


  getMyAccount() {
    this.userId = this.utils.getUserId();
    this.themeService.GetMyAccount(this.userId).subscribe((data: any) => {

    });
  }

}
