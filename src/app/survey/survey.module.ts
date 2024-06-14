import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyRoutingModule } from './survey-routing.module';

import { EditSurveyComponent } from './edit-survey/edit-survey.component';
import { SurveyListingComponent } from './survey-listing/survey-listing.component';
import { CreateSurveyPopupComponent } from './popups/create-survey-popup/create-survey-popup.component';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { TagInputModule } from 'ngx-chips';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DecimalPipe, NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


import { heroChevronLeft } from '@ng-icons/heroicons/outline';
import { heroChevronRight } from '@ng-icons/heroicons/outline';
import { NgIconsModule, provideNgIconsConfig } from '@ng-icons/core';
import { heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';
import { heroCalendar } from '@ng-icons/heroicons/outline';
import { heroLanguage } from '@ng-icons/heroicons/outline';
import { heroMapPin } from '@ng-icons/heroicons/outline';
import { heroPencilSquare } from '@ng-icons/heroicons/outline';
import { heroEllipsisVertical } from '@ng-icons/heroicons/outline';
import { heroArrowsPointingOut } from '@ng-icons/heroicons/outline';
import { heroTrash } from '@ng-icons/heroicons/outline';
import { heroPencil } from '@ng-icons/heroicons/outline';
import { heroDocumentDuplicate } from '@ng-icons/heroicons/outline';
import { heroBuildingOffice2 } from '@ng-icons/heroicons/outline';
import { heroArrowUpTray } from '@ng-icons/heroicons/outline';
import { heroPlusCircle } from '@ng-icons/heroicons/outline';
import { heroArrowRight } from '@ng-icons/heroicons/outline';
import { heroHome } from '@ng-icons/heroicons/outline';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../shared/shared.module';
import { heroShoppingBag } from '@ng-icons/heroicons/outline';
import { heroInformationCircle } from '@ng-icons/heroicons/outline';

import { heroMinusCircle } from '@ng-icons/heroicons/outline';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { VendarSurveyListComponent } from './vendar-survey-list/vendar-survey-list.component';
// import { DescriptionScreenComponent } from './popups/description-screen/description-screen.component';
//import { MonthlyIncomeForeignPopupComponent } from './popups/monthly-income-foreign-popup/monthly-income-foreign-popup.component';

@NgModule({
  declarations: [

    
    VendarSurveyListComponent,
  ],
  imports: [
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    CommonModule,
    SurveyRoutingModule,
    DragDropModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    TagInputModule,
    NgxDropzoneModule,
    ModalModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonModule,
    CKEditorModule,
    NgIconsModule.withIcons({
      heroQuestionMarkCircle,
      heroCalendar,
      heroLanguage,
      heroMapPin,
      heroPencilSquare,
      heroEllipsisVertical,
      heroArrowsPointingOut,
      heroTrash,
      heroPencil,
      heroDocumentDuplicate,
      heroBuildingOffice2,
      heroArrowUpTray,
      heroPlusCircle,
      heroArrowRight,
      heroHome,
      heroChevronLeft,
      heroChevronRight,
      heroShoppingBag,
      heroMinusCircle,
      heroInformationCircle,
      heroXMark
    }),
    NgxPaginationModule,
    SharedModule
  ],
  providers: [
    provideNgIconsConfig({
      size: '1.5em',
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SurveyModule {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
