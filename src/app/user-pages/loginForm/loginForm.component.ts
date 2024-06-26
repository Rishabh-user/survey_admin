import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from 'src/app/service/data.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaptchaComponent } from 'src/app/shared/captcha/captcha.component';
import { UtilsService } from 'src/app/service/utils.service';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-loginForm',
  templateUrl: './loginForm.component.html',
  styleUrls: ['./loginForm.component.css']
})
export class LoginFormComponent {
  @ViewChild(CaptchaComponent) captchaComponent: CaptchaComponent;


  @Input('Component') isComponent = false;
  errorMessage: string;
  submitted = false;
  loading = false;
  loginForm: FormGroup;
  token: string | undefined;
  constructor(
    private visibilityService: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private utility: UtilsService,
    private modalservice: ModalService
  ) {
    visibilityService.articleVisible.next(false);
    this.token = undefined;
  }


  ngOnInit() {

    this.createForm();
  }


  createForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9]+([._-][A-Za-z0-9]+)*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$|^[A-Za-z0-9_-]+([.-][A-Za-z0-9_-]+)*$/),
        ],
      ],
      password: ['', Validators.required],
      rememberMe: [false],
      captchertoken: [false],

    });
  }
  // islogin:boolean = true
  // onSubmit() {
  //   this.submitted = true;
  //   if (this.loginForm.valid) {
  //     this.loginForm.removeControl('rememberMe');
  //     this.errorMessage = '';
  //     this.loading = true;
  //     const returnUrl =
  //       this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';


  //     const userDetails = {
  //       email: this.loginForm.get('email')?.value,
  //       password: this.loginForm.get('password')?.value,
  //       captchertoken: this.loginForm.get('captchertoken')?.value
  //     };

  //     this.authService
  //       .login(userDetails)
  //       .pipe(first())
  //       .subscribe({
  //         next: (result) => {
  //           debugger
  //           if (result) {
  //             localStorage.setItem('authToken', result); 
  //             this.loginForm.reset();

  //             // this.router.navigateByUrl(returnUrl).then(() => {

  //             //   window.location.reload();
  //             // });
  //             if(this.islogin){
  //               this.router.navigateByUrl(returnUrl).then(() => {
  //                 window.location.reload();
  //               });
  //             }else{
  //               this.modalservice.closeModal();
  //               window.location.reload();
  //             }
  //             debugger
  //           } else {
  //             this.loading = false;
  //             this.errorMessage = result;
  //           }
  //         },
  //         error: (errObject) => {
  //           this.utility.showError("Please enter correct password ");
  //         },
  //         complete: () => {
  //           this.loading = false;
  //         },
  //       });
  //   }
  //   //}
  // }
  islogin: boolean = false;

onSubmit() {
  this.submitted = true;
  if (this.loginForm.valid) {
    this.loginForm.removeControl('rememberMe');
    this.errorMessage = '';
    this.loading = true;
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';

    const userDetails = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      captchertoken: this.loginForm.get('captchertoken')?.value
    };

    this.authService.login(userDetails).pipe(first()).subscribe({
      next: (result) => {
        let popuplogin =  localStorage.getItem("popuplogin");
        if (result) {
          localStorage.setItem('authToken', result); 
          this.loginForm.reset();
          console.log("S",this.islogin)
        
          if(popuplogin == 'true'){
            // Login via popup
            this.modalservice.closeModal();
            localStorage.removeItem("popuplogin");
            window.location.reload()
          }
          else{
            this.router.navigateByUrl(returnUrl).then(() => {
              window.location.reload();
            });
          }
        
        } else {
          this.loading = false;
          this.errorMessage = result;
        }
      },
      error: (errObject) => {
        this.utility.showError("Please enter correct password ");
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

}
