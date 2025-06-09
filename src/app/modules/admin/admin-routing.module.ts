import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';

const routes: Routes = [
  {
    path: '',
    component: AdminMainComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // Ejemplo de dashboard o página principal
      { path: 'dashboard', component: /* tu componente dashboard aquí */ InventoryFormComponent },
      { path: 'create', component: InventoryFormComponent },
      // agrega aquí más rutas hijas como 'edit/:id', 'config', etc.
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
