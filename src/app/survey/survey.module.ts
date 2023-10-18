import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyRoutingModule } from './survey-routing.module';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { EditSurveyComponent } from './edit-survey/edit-survey.component';
import { SurveyListingComponent } from './survey-listing/survey-listing.component';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { TagInputModule } from 'ngx-chips';
import { ReactiveFormsModule } from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DecimalPipe, NgFor } from '@angular/common';
//import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';


// Icons
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
// Icons

@NgModule({
  declarations: [
    CreateSurveyComponent,
    EditSurveyComponent,
    SurveyListingComponent
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
    //DecimalPipe, NgFor, FormsModule, NgbTypeaheadModule, NgbPaginationModule,
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
      heroHome
    }),
  ],
  providers: [
    provideNgIconsConfig({
      size: '1.5em',
    }),
  ],
})
export class SurveyModule {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
 }
