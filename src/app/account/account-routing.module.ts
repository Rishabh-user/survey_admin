import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './my-account/my-account.component';
import { LinkedinProfileComponent } from './linkedin-profile/linkedin-profile.component';

const routes: Routes = [
  { path: 'my-account', component: MyAccountComponent, data: { title: 'My Account' } },
  { path: 'auth/linkedin/callback', component: LinkedinProfileComponent, data: { title: 'My Linkedin' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }