import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { responseDTO } from 'src/app/types/responseDTO';
import { ChangeDetectorRef } from '@angular/core';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';
declare var Dropzone: any;


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  // Tooltip
  showTooltip: { [key: string]: boolean } = {};
  toggleTooltip(identifier: string) {
    this.showTooltip[identifier] = !this.showTooltip[identifier];
  }
  hideTooltip(identifier: string) {
    this.showTooltip[identifier] = false;
  }
  // Tooltip
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


  // Define a variable to track whether the image has been updated
  imageUpdated: boolean = false;

  onSelect(event: any) {
    const file = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (file) {
      this.files.push(file);
      this.uploadImage(file);
      console.log("uploaded", this.uploadImage(file));
    }
  }

  uploadImage(file: File): void {
    this.themeService.uploadImageAboutUs(file, this.userId).subscribe(
      (response: string) => {
        console.log('Upload successful:', response);
        this.image = response.replace(/"/g, '');
        this.imageUpdated = true; // Set to true since the image has been updated
        console.log(this.image);
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
      }
    );
  }

  postData() {
    this.extractFileNameFromUrl;
    if (!this.validateSurvey()) {
      this.util.showError('Please fill all required fields.');
      return;
    }

    let imageName = '';

    // Check if image is updated or not
    if (this.imageUpdated) {
      imageName = this.image.split('\\').pop() || this.image;
    }
    else {
      imageName = '';
    }

    const dataToSend = {
      id: this.id,
      name: this.name,
      description: this.description,
      image: imageName,
      centerId: this.centerId
    };

    console.log("dataToSend", dataToSend);

    this.themeService.CreateAboutUs(dataToSend).subscribe(
      response => {
        console.log('Response from server:', response);
        this.util.showSuccess(response);
        window.location.reload();
      },
      error => {
        console.error('Error occurred while sending POST request:', error);
        this.util.showError('error');
      }
    );
  }


  selectedImage: string | ArrayBuffer | null = null;



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
        return parts.pop()!;
      }
    }
    return url;
  }



}