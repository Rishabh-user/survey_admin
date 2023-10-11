import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { EditSurveyComponent } from './edit-survey/edit-survey.component';
import { SurveyListingComponent } from './survey-listing/survey-listing.component';

const routes: Routes = [
  { path: 'create-survey', component: CreateSurveyComponent},
  { path: 'edit-survey', component: EditSurveyComponent},
  { path: 'all-survey', component: SurveyListingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
