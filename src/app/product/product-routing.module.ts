import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { CardDetailComponent } from './components/card-detail/card-detail.component';

const routes: Routes = [
  { 
    path: '',
    component:ProductsComponent
  },
  {
    path:'detail',
    component:CardDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
