import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryServiceService, InventoryItem } from 'src/app/services/inventory-service.service';


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  items: InventoryItem[] = [];
  
  constructor(
    private inventoryService: InventoryServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.items = this.inventoryService.getItems();
  }

  create() { this.router.navigate(['admin/create']); }
  edit(id: string) { this.router.navigate(['admin/edit', id]); }
  remove(id: string) { this.inventoryService.removeItem(id); }
}
