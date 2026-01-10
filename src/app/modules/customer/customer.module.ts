import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerLayoutComponent } from './components/customer-layout/customer-layout.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CustomerLayoutComponent,
    MyOrdersComponent,
    MyProfileComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule { }
