import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutInfoComponent } from './components/checkout-info/checkout-info.component';

import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutSuccessComponent } from './components/checkout-success/checkout-success.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    CheckoutInfoComponent,
    CheckoutShippingComponent,
    CheckoutPaymentComponent,
    CheckoutSuccessComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    TranslateModule
  ],
    exports: [
    TranslateModule
  ]
})
export class CheckoutModule { }