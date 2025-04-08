import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { CartComponent } from './components/cart/cart.component';
import { StoreModule } from '@ngrx/store';
import { cartReducer } from '../../state/cart.reducer';
import { SharedModule } from "../../shared/shared.module";
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    ShoppingCartRoutingModule,
    StoreModule.forFeature('cart', cartReducer),
    SharedModule,
    FormsModule
]
})
export class ShoppingCartModule { }
