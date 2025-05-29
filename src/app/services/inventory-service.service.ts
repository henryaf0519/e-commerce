import { Injectable } from '@angular/core';
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryServiceService {

  constructor() { }

  getItems() {
   
  }

  addItem(item: InventoryItem) {
   
  }

 updateItem(updated: InventoryItem) {

}

  removeItem(id: string) {
 
  }

  getItemById(id: string) {
    return {
      id: '1',
      name: 'Producto de ejemplo',
      quantity: 10,
      price: 100
    };
   
  }
}
