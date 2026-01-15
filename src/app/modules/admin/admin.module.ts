import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../../shared/shared.module";
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { SectionManagerComponent } from './components/section-manager/section-manager.component';

@NgModule({
  declarations: [
    InventoryListComponent,
    InventoryFormComponent,
    AdminSidebarComponent,
    AdminMainComponent,
    AdminOrdersComponent,
    SectionManagerComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    SharedModule
]
})
export class AdminModule { }
