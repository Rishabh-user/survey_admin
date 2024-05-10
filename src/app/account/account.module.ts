import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { MyAccountComponent } from './my-account/my-account.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIconsModule, provideNgIconsConfig } from '@ng-icons/core';
import { heroHome } from '@ng-icons/heroicons/outline';
import { heroArrowLongRight } from '@ng-icons/heroicons/outline';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MyAccountComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    NgbAccordionModule,
    NgIconsModule.withIcons({
      heroHome
    }),
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
  ]
})
export class AccountModule { }