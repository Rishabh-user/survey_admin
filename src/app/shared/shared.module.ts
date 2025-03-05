import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgIconsModule } from '@ng-icons/core';
import { heroArrowLongRight } from '@ng-icons/heroicons/outline';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';

import { RouterModule } from '@angular/router';
import { ConvertToUrlPipe } from '../pipes/convert-to-url.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecryptPipe } from '../pipes/decrypt.pipe';
import { EncryptPipe } from '../pipes/encrypt.pipe';
import { CreateSurveyComponent } from '../survey/create-survey/create-survey.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxPaginationModule } from 'ngx-pagination';
import { TagInputModule } from 'ngx-chips';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SurveyRoutingModule } from '../survey/survey-routing.module';
import { EditSurveyComponent } from '../survey/edit-survey/edit-survey.component';
import { SurveyListingComponent } from '../survey/survey-listing/survey-listing.component';
import { GenderPopupComponent } from '../survey/popups/gender-popup/gender-popup.component';
import { AgePopupComponent } from '../survey/popups/age-popup/age-popup.component';
import { NccsPopupComponent } from '../survey/popups/nccs-popup/nccs-popup.component';
import { MonthlyIncomePopupComponent } from '../survey/popups/monthly-income-popup/monthly-income-popup.component';
import { HouseholdComponent } from '../survey/popups/household/household.component';
import { FamilyMemberPopupComponent } from '../survey/popups/family-member-popup/family-member-popup.component';
import { NoOfChildPopupComponent } from '../survey/popups/no-of-child-popup/no-of-child-popup.component';
import { WorkingStatusPopupComponent } from '../survey/popups/working-status-popup/working-status-popup.component';
import { CityPopupComponent } from '../survey/popups/city-popup/city-popup.component';
import { AgeOfChildrenPopupComponent } from '../survey/popups/age-of-children-popup/age-of-children-popup.component';
import { OldSecPopupComponent } from '../survey/popups/old-sec-popup/old-sec-popup.component';
import { IndustryPopupComponent } from '../survey/popups/industry-popup/industry-popup.component';
import { NewFLsmPopupComponent } from '../survey/popups/new-f-lsm-popup/new-f-lsm-popup.component';
import { MSlmPopupComponent } from '../survey/popups/m-slm-popup/m-slm-popup.component';
import { LanguagePopupComponent } from '../survey/popups/language-popup/language-popup.component';
import { SLsmPopupComponent } from '../survey/popups/s-lsm-popup/s-lsm-popup.component';
import { GeoLocationPopupComponent } from '../survey/popups/geo-location-popup/geo-location-popup.component';
import { MaritalStatusNewPopupComponent } from '../survey/popups/marital-status-new-popup/marital-status-new-popup.component';
import { IndustryRespondantPopupComponent } from '../survey/popups/industry-respondant-popup/industry-respondant-popup.component';
import { LocalityPopupComponent } from '../survey/popups/locality-popup/locality-popup.component';
import { HomeAreaTypePopupComponent } from '../survey/popups/home-area-type-popup/home-area-type-popup.component';
import { KidsCountPopupComponent } from '../survey/popups/kids-count-popup/kids-count-popup.component';
import { OldFLsmPopupComponent } from '../survey/popups/old-f-lsm-popup/old-f-lsm-popup.component';
import { SelfiePopupComponent } from '../survey/popups/selfie-popup/selfie-popup.component';
import { StorePopupComponent } from '../survey/popups/store-popup/store-popup.component';
import { OccupationPopupComponent } from '../survey/popups/occupation-popup/occupation-popup.component';
import { SecLsmPopupComponent } from '../survey/popups/sec-lsm-popup/sec-lsm-popup.component';
import { FlsmPopupComponent } from '../survey/popups/flsm-popup/flsm-popup.component';
import { SecBnSlPopupComponent } from '../survey/popups/sec-bn-sl-popup/sec-bn-sl-popup.component';
import { IndustryHouseholdPopupComponent } from '../survey/popups/industry-household-popup/industry-household-popup.component';
import { StatePopupComponent } from '../survey/popups/state-popup/state-popup.component';
import { PinCodePopupComponent } from '../survey/popups/pin-code-popup/pin-code-popup.component';
import { AudioGenderDetectionPopupComponent } from '../survey/popups/audio-gender-detection-popup/audio-gender-detection-popup.component';
import { NamePopupComponent } from '../survey/popups/name-popup/name-popup.component';
import { EmailAddressPopupComponent } from '../survey/popups/email-address-popup/email-address-popup.component';
import { HomeAccessoriesPopupComponent } from '../survey/popups/home-accessories-popup/home-accessories-popup.component';
import { AccomodationTypePopupComponent } from '../survey/popups/accomodation-type-popup/accomodation-type-popup.component';
import { LanguageYouKnowPopupComponent } from '../survey/popups/language-you-know-popup/language-you-know-popup.component';
import { ForeignCountryTravelledPopupComponent } from '../survey/popups/foreign-country-travelled-popup/foreign-country-travelled-popup.component';
import { CreateSurveyPopupComponent } from '../survey/popups/create-survey-popup/create-survey-popup.component';
import { MonthlyIncomeForeignPopupComponent } from '../survey/popups/monthly-income-foreign-popup/monthly-income-foreign-popup.component';
import { DescriptionScreenComponent } from '../survey/popups/description-screen/description-screen.component';
import { OpenendedFormComponent } from '../survey/popups/openended-form/openended-form.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LsmPopupComponent } from '../survey/popups/lsm-popup/lsm-popup.component';

@NgModule({
  declarations: [
    ConvertToUrlPipe,
    DecryptPipe,
    EncryptPipe,
    CreateSurveyComponent,
    EditSurveyComponent,
    SurveyListingComponent,
    GenderPopupComponent,
    AgePopupComponent,
    NccsPopupComponent,
    MonthlyIncomePopupComponent,
    MonthlyIncomeForeignPopupComponent,
    HouseholdComponent,
    FamilyMemberPopupComponent,
    NoOfChildPopupComponent,
    WorkingStatusPopupComponent,
    CityPopupComponent,
    AgeOfChildrenPopupComponent,
    OldSecPopupComponent,
    IndustryPopupComponent,
    NewFLsmPopupComponent,
    MSlmPopupComponent,
    SLsmPopupComponent,
    LanguagePopupComponent,
    GeoLocationPopupComponent,
    MaritalStatusNewPopupComponent,
    IndustryRespondantPopupComponent,
    LocalityPopupComponent,
    ForeignCountryTravelledPopupComponent,
    LanguageYouKnowPopupComponent,
    HomeAreaTypePopupComponent,
    KidsCountPopupComponent,
    OldFLsmPopupComponent,
    StorePopupComponent,
    SelfiePopupComponent,
    AccomodationTypePopupComponent,
    HomeAccessoriesPopupComponent,
    NamePopupComponent,
    EmailAddressPopupComponent,
    PinCodePopupComponent,
    AudioGenderDetectionPopupComponent,
    StatePopupComponent,
    IndustryHouseholdPopupComponent,
    SecBnSlPopupComponent,
    FlsmPopupComponent,
    SecLsmPopupComponent,
    OccupationPopupComponent,
    DescriptionScreenComponent,
    OpenendedFormComponent,
    LsmPopupComponent
  ],
  imports: [
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    CommonModule,
    RouterModule,
    DragDropModule,
    MatAutocompleteModule,
    MatInputModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    ModalModule,
    MatSelectModule,
    MatTooltipModule,
    MatButtonModule,
    NgIconsModule.withIcons({
      heroArrowLongRight,
      heroXMark,
      heroMagnifyingGlass,
    }),
    NgxPaginationModule,
    CKEditorModule
  ],
  exports: [
    ConvertToUrlPipe,
    DecryptPipe,
    EncryptPipe,
    CreateSurveyComponent,
    EditSurveyComponent,
    SurveyListingComponent,
    GenderPopupComponent,
    AgePopupComponent,
    NccsPopupComponent,
    MonthlyIncomePopupComponent,
    HouseholdComponent,
    FamilyMemberPopupComponent,
    NoOfChildPopupComponent,
    WorkingStatusPopupComponent,
    CityPopupComponent,
    AgeOfChildrenPopupComponent,
    OldSecPopupComponent,
    IndustryPopupComponent,
    NewFLsmPopupComponent,
    MSlmPopupComponent,
    SLsmPopupComponent,
    LanguagePopupComponent,
    GeoLocationPopupComponent,
    MaritalStatusNewPopupComponent,
    IndustryRespondantPopupComponent,
    LocalityPopupComponent,
    ForeignCountryTravelledPopupComponent,
    LanguageYouKnowPopupComponent,
    HomeAreaTypePopupComponent,
    KidsCountPopupComponent,
    OldFLsmPopupComponent,
    StorePopupComponent,
    SelfiePopupComponent,
    AccomodationTypePopupComponent,
    HomeAccessoriesPopupComponent,
    NamePopupComponent,
    EmailAddressPopupComponent,
    PinCodePopupComponent,
    AudioGenderDetectionPopupComponent,
    StatePopupComponent,
    IndustryHouseholdPopupComponent,
    SecBnSlPopupComponent,
    FlsmPopupComponent,
    SecLsmPopupComponent,
    OccupationPopupComponent,
    LsmPopupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SharedModule { }
