import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UserListingComponent } from './user-listing/user-listing.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ProfileByIdComponent } from './profile-by-id/profile-by-id.component';

const routes: Routes = [
  { path: 'all-users', component: UserListingComponent, data: { title: 'All User' } },
  { path: 'add-user', component: AddUserComponent, data: { title: 'Add New User' } },
  { path: 'profile-id', component: ProfileByIdComponent, data: { title: 'user profile by id' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserPagesRoutingModule { }
