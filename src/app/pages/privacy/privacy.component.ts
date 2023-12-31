import { Component } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { responseDTO } from 'src/app/types/responseDTO';
import { ChangeDetectorRef } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent {
  public Editor = ClassicEditor;
  constructor(public themeService: DataService, private cdr: ChangeDetectorRef) { }
  files: File[] = [];
  id: number = 0;
  name: any;
  description: any;
  image: any

  

  onRemove(event: any) { // Use 'any' as the event type
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  ngOnInit(): void {
    this.getPrivacy()
  }

  userId: any;

  getPrivacy() {
    this.userId = localStorage.getItem("userId");
    this.themeService.GetPrivacyPolicy(this.userId).subscribe((data: any) => {
      console.log("data", data)
      this.name = data.name;
      this.id = data.id
      this.description = data.description
      this.image = data.image
      this.cdr.detectChanges();
    });
  }
  postData() {
    const dataToSend = {
      id: this.id,
      name: this.name,
      description: this.description,
      image: this.image
    };
    console.log("dataToSend", dataToSend)
    this.themeService.CreatePrivacyPolicy(dataToSend).subscribe(
      response => {
        console.log('Response from server:', response);
        swal.fire('', response, 'success');
        // Handle response based on the server behavior
      },
      error => {
        console.error('Error occurred while sending POST request:', error);
        // Handle error, if needed
      }
    );
  }
  onSelect(event: any) {
    const file = event.addedFiles && event.addedFiles.length > 0 ? event.addedFiles[0] : null;

    if (file) {
      this.files.push(file); // Store the selected file
      this.uploadImage(file); // Trigger upload after selecting the file
    }
  }
  
  uploadImage(file: File): void {
  
    this.themeService.uploadImageAboutUs(file,this.userId).subscribe(
      (response:String) => {
        console.log('Upload successful:', response);
        this.image=response
        // Handle response from the image upload
        // You may want to retrieve the URL or any other relevant information from the response
      },
      (error) => {
        console.error('Error occurred while uploading:', error);
        // Handle error
      }
    );
  }

}
