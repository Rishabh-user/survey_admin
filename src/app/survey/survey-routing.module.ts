import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { EditSurveyComponent } from './edit-survey/edit-survey.component';
import { SurveyListingComponent } from './survey-listing/survey-listing.component';
import { VendarSurveyListComponent } from './vendar-survey-list/vendar-survey-list.component';

const routes: Routes = [
  { path: 'manage-survey/:param1', component: CreateSurveyComponent, data: { triggerToggle: true } },
  { path: 'manage-question/:param1', component: EditSurveyComponent, data: { triggerToggle: true } },
  { path: 'all-survey', component: SurveyListingComponent, data: { title: 'View Survey' } },
  { path: 'vendar-survey-list', component: VendarSurveyListComponent, data: { title: 'View Survey' } },
  { path: 'user/:id/:name', component: CreateSurveyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
