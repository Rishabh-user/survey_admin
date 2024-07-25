import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from './service/data.service';
import { AuthService } from './service/auth.service';
import { LoaderService } from './service/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from './service/modal.service';
import { version } from 'src/environments/version';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'survey-admin';
  layout: string = '';
  headerVisible: boolean = true;
  navbarVisible: boolean = true;
  breadcrumbVisible: boolean = true;
  articleVisible: boolean = true;
  showModal: boolean = false;
  
 


  constructor(private router: ActivatedRoute, public visibilityService: DataService, public themeService: DataService,
    private auth: AuthService, public loaderservice: LoaderService, private modalService: NgbModal, private _modalService: ModalService) {

    this.visibilityService.headerVisible$.subscribe(visible => {
      this.headerVisible = visible;
    });

    this.visibilityService.navbarVisible$.subscribe(visible => {
      this.navbarVisible = visible;
    });
    this.visibilityService.breadcrumbVisible$.subscribe(visible => {
      this.breadcrumbVisible = visible;
    });
    // console.log('App Version:', version);
  }

  ngOnInit() {
    this.auth.initializeUserDetails();

    this.visibilityService.isSidebarVisibleSubject.next(true);

    this._modalService.openModal$.subscribe(open => {

      this.modalOpened = open;
      if (this.modalOpened) {
        this.openModalOnLoad();
      }
    });

  }

  onMouseEnter() {
    this.themeService.setHoverAddWidth(true);
  }

  onMouseLeave() {
    this.themeService.setHoverAddWidth(false);
  }

  @ViewChild('content') modalContent: any;
  modalOpened = false;

  openModalOnLoad() {
    this.modalService.open(this.modalContent, { size: 'lg' });
  }



}