import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutInfoComponent } from './components/checkout-info/checkout-info.component';
import { CheckoutShippingComponent } from './components/checkout-shipping/checkout-shipping.component';
import { CheckoutPaymentComponent } from './components/checkout-payment/checkout-payment.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' }, // Redirigir al primer paso
      { path: 'info', component: CheckoutInfoComponent },
      { path: 'shipping', component: CheckoutShippingComponent },
      { path: 'payment', component: CheckoutPaymentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
