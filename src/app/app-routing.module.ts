import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'products', loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule)},
  { path: 'cart', loadChildren: () => import('./modules/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule)},
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
  { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)},
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  
  { path: '**', redirectTo: '/products' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
