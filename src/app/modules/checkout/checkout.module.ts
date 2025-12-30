import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutInfoComponent } from './components/checkout-info/checkout-info.component';
import { CheckoutShippingComponent } from './modules/checkout/components/checkout-shipping/checkout-shipping.component';
import { CheckoutPaymentComponent } from './modules/checkout/components/checkout-payment/checkout-payment.component';


@NgModule({
  declarations: [
    CheckoutInfoComponent,
    CheckoutShippingComponent,
    CheckoutPaymentComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule
  ]
})
export class CheckoutModule { }
