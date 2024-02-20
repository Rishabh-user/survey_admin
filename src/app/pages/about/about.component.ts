import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { responseDTO } from 'src/app/types/responseDTO';
import { ChangeDetectorRef } from '@angular/core';
import swal from 'sweetalert2';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';
declare var Dropzone: any;


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  public Editor = ClassicEditor;
  userId: any;
  constructor(public themeService: DataService, private cdr: ChangeDetectorRef, private util: UtilsService) {
    this.baseUrl = environment.baseURL;
  }
  files: File[] = [];
  id: number = 0;
  name: any;
  description: any;
  image: any
  centerId: any;
  baseUrl = '';

  onRemove(event: any) { // Use 'any' as the event type
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  ngOnInit(): void {
    this.userId = this.util.getUserId();
    this.centerId = this.util.getCenterId();
    this.getAboutus();

  }



  getAboutus() {
    this.userId = this.util.getUserId();
    this.themeService.GetAboutUs(this.userId).subscribe((data: any) => {
      console.log("data", data)
      this.name = data.name;
      this.id = data.id
      this.description = data.description
      this.image = data.image
      this.cdr.detectChanges();
    });


  }
  postData() {
    this.extractFileNameFromUrl
    if (!this.validateSurvey()) {
      this.util.showError('Please fill all required fields.');
      return;
    }
    const imageName = this.image.split('\\').pop() || this.image;
    const dataToSend = {
      id: this.id,
      name: this.name,
      description: this.description,
      image: imageName,
      centerId: this.centerId

    };
    console.log("dataToSend", dataToSend)
    this.themeService.CreateAboutUs(dataToSend).subscribe(
      response => {
        console.log('Response from server:', response);
        // swal.fire('', response, 'success');
        this.util.showSuccess(response);
        // Handle response based on the server behavior
      },
      error => {
        console.error('Error occurred while sending POST request:', error);
        this.util.showError('error');
        // swal.fire('', error, 'error');
        // Handle error, if needed
      }
    );
  }
  onSelect(event: any) {
    const file = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (file) {
      this.files.push(file); // Store the selected file
      this.uploadImage(file);
      console.log("uplaoded", this.uploadImage(file))// Trigger upload after selecting the file
    }
  }

  uploadImage(file: File): void {

    this.themeService.uploadImageAboutUs(file, this.userId).subscribe(
      (response: String) => {
        console.log('Upload successful:', response);
        this.image = response.replace(/"/g, '')
        console.log(this.image)

        // Handle response from the image upload
        // You may want to retrieve the URL or any other relevant information from the response
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
        // Handle error
      }
    );
  }

  selectedImage: string | ArrayBuffer | null = null;

  // onSelect(event: any): void {
  //   const files = event.addedFiles;
  //   if (files && files.length > 0) {
  //     const file = files[0]; // Assuming only one file is selected
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.selectedImage = e.target.result;
  //       console.log(this.selectedImage);
  //       this.onUpload(file); // Trigger upload after selecting the file
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }


  // onUpload(file: File): void {
  //   if (!file) {
  //     console.error('No file selected.');
  //     return;
  //   }
  //   console.log("inside onUpload");
  //   this.themeService.uploadImageAboutUs(file, this.userId).subscribe(
  //     (response) => {
  //       console.log('Upload successful:', response);
  //       this.image = response
  //       // Handle response from server
  //     },
  //     (error) => {
  //       console.error('Error occurred while uploading:', error);
  //       // Handle error
  //     }
  //   );
  // }

  information: any[] = [];
  title: boolean = true
  descriptioninfo: boolean = true

  validateSurvey(): boolean {
    this.title = !!this.name && this.name.trim().length > 0;
    this.descriptioninfo = !!this.description && this.description.trim().length > 0;

    // You might want to return whether all fields are valid
    return (
      this.title &&
      this.descriptioninfo
    );
  }
  private extractFileNameFromUrl(url: string): string {
    if (url.includes('/')) {
      const parts = url.split('/');
      if (parts.length > 0) {
        return parts.pop()!; // Get and return the last part
      }
    }
    return url; // If no '/' is found or parts array is empty, return the whole URL
  }



}