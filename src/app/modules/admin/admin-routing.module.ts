import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';

const routes: Routes = [

  { path: '', component: AdminMainComponent },
  { path: 'create', component: InventoryFormComponent },
  { path: 'edit/:id', component: InventoryFormComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
