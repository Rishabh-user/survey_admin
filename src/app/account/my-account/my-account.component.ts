import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent {
  signupForm: FormGroup;
  imageName: any;
  gstNumber: any;
  address: any;
  city: any;
  state: any;
  country: any;
  zip: any;
  centerId: any;
  centerName: string;
  planName: any;
  planAmount: any;
  plans: any;
  constructor(private utils: UtilsService, public themeService: DataService, private modalService: NgbModal, private authService: AuthService, private cdr: ChangeDetectorRef, private util: UtilsService, private fb: FormBuilder) {
    this.baseUrl = environment.baseURL;
    this.centerName = this.utils.getCenterName();
  }


  files: File[] = [];
  role: any;
  id: number = 0;
  firstName: any;
  lastName: any;
  email: any;
  contactNo: any
  roleId: number = 0;
  image: any;
  oldPassword: any;
  newPassword: any;
  confirmPassword: any;
  baseUrl = '';


  openLg(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true });

  }
  showSweetAlert() {
    Swal.fire('update');
  }

  ngOnInit(): void {
    //this.role = localStorage.getItem("role")
    this.role = this.util.getRole();
    this.getMyAccount();
    this.signupForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  userId: any;


  getMyAccount() {
    //this.userId = localStorage.getItem("userId");
    this.userId = this.util.getUserId();
    this.themeService.GetMyAccount(this.userId).subscribe((data: any) => {
      console.log("data", data)
      this.plans = data.plan
      console.log("plan", this.plans)
      console.log("organizationName", this.centerName)
      this.firstName = data.firstName;
      this.lastName = data.lastName
      this.id = data.id
      this.email = data.email
      this.contactNo = data.contactNo
      this.roleId = data.roleId
      this.image = data.image
      this.selectedImage = data.image
      this.gstNumber = data.center.gstNumber
      this.centerName = this.centerName
      this.address = data.address
      this.city = data.city
      this.state = data.state
      this.country = data.country
      this.zip = data.zip

      this.cdr.detectChanges();
    });
  }

  postData() {

    if (!this.validateSurvey()) {
      this.util.showError('Please fill all required fields.');
      return;
    }

    const imageName = this.image.split('\\').pop() || this.image;
    const dataToSend = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      contactNo: this.contactNo,
      roleId: this.roleId,
      // address: this.address,
      // city: this.city,
      // state: this.state,
      // country: this.country,
      // zip: this.zip,
      center: {
        address: this.address,
        city: this.city,
        state: this.state,
        country: this.country,
        zip: this.zip
      },
      imageName: imageName,
      status: 'ACT'
    };
    console.log("dataToSend", dataToSend)
    this.themeService.CreateMyAccount(dataToSend).subscribe(
      response => {
        console.log('Response from server:', response);
        this.util.showSuccess(response);
        window.location.reload();
        // Swal.fire('', response);
        // Handle response based on the server behavior
      },
      error => {
        console.error('Error occurred while sending POST request:', error);
        // Handle error, if needed
      }
    );
  }

  updatepassword() {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.util.showError('All fields are required.');
      // Swal.fire('Error Occurs', 'All fields are required.', 'error');
    }
    else if (this.confirmPassword != this.newPassword) {
      // Swal.fire('Error Occurs', 'New password and confirm password should be same.', 'error');
      this.util.showError('New password and confirm password should be same.');
    } else {
      const dataToSend2 = {
        id: this.id,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword,
      };
      console.log("dataToSend", dataToSend2)
      this.themeService.ChangePassword(dataToSend2).subscribe({
        next: (response) => {
          console.log('Response from server:', response);
          this.util.showSuccess(response);
          this.authService.logout();
          window.location.reload();
          // Swal.fire('', response, 'success');
          // Handle response based on the server behavior
        },
        error: (err) => {
          console.error('Error occurred while sending POST request:', err);
          this.util.showError(err);

          // Handle error, if needed
        }
      });
    }
  }


  // Upload Image

  selectedImage: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        this.onUpload(file); // Trigger upload after selecting the file
      };
      reader.readAsDataURL(file);
    }
  }

  onUpload(file: File): void {
    if (!file) {
      console.error('No file selected.');
      return;
    }
    console.log("inside onUpload");
    this.themeService.uploadImage(file, this.userId).subscribe(
      (response) => {
        console.log('Upload successful:', response);
        // Handle response from server
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
        // Handle error
      }
    );
  }


  // new

  information: any[] = [];
  firstname: boolean = true
  lastname: boolean = true
  Contact: boolean = true
  roletype: boolean = true
  emailaddress: boolean = true
  Useraddress: boolean = true
  CompanyGstNumber: boolean = true
  Usercity: boolean = true
  Userstate: boolean = true
  Usercountry: boolean = true
  Userzip: boolean = true

  validateSurvey(): boolean {
    this.firstname = !!this.firstName && this.firstName.trim().length > 0;
    this.lastname = !!this.lastName && this.lastName.trim().length > 0;
    this.Contact = !!this.contactNo && this.contactNo.toString().trim().length > 0;
    this.roletype = !!this.role && this.role.trim().length > 0;
    this.emailaddress = !!this.email && this.email.trim().length > 0;
    // this.Useraddress = !!this.address && this.address.trim().length > 0;
    // this.CompanyGstNumber = !!this.gstNumber && this.gstNumber.trim().length > 0;
    // this.Usercity = !!this.city && this.city.trim().length > 0;
    // this.Userstate = !!this.state && this.state.trim().length > 0;
    // this.Usercountry = !!this.country && this.country.trim().length > 0;
    // this.Userzip = !!this.zip && this.zip.trim().length > 0;

    // You might want to return whether all fields are valid
    return (
      this.firstname &&
      this.lastname &&
      this.Contact &&
      this.role &&
      this.emailaddress &&
      this.Useraddress &&
      this.CompanyGstNumber &&
      this.Usercity &&
      this.Userstate &&
      this.Usercountry &&
      this.Userzip
    );
  }

  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  oldPasswordrequires: boolean = true
  newPasswordrequires: boolean = true
  confirmPasswordrequires: boolean = true

  password(): boolean {
    this.oldPasswordrequires = !!this.oldPassword && this.oldPassword.trim().length > 0;
    this.newPasswordrequires = !!this.newPassword && this.newPassword.trim().length > 0;
    this.confirmPasswordrequires = !!this.confirmPassword && this.confirmPassword.trim().length > 0;

    // You might want to return whether all fields are valid
    return (
      this.oldPasswordrequires &&
      this.newPasswordrequires &&
      this.confirmPasswordrequires
    );
  }

}
