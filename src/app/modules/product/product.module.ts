import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductsComponent } from './components/products/products.component';
import { SharedModule } from '../../shared/shared.module';
import { CardDetailComponent } from './components/card-detail/card-detail.component';
import { StoreModule } from '@ngrx/store';
import { cartReducer } from '../../state/cart.reducer';


@NgModule({
  declarations: [
    ProductsComponent,
    CardDetailComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    StoreModule.forFeature('cart', cartReducer)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductModule { }
