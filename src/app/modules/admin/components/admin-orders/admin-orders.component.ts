import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent {
  orders$!: Observable<Order[]>;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders$ = this.orderService.getAllOrders();
  }
// Dentro de tu clase OrdersComponent
getStatusClass(status: string): string {
  switch (status) {
    case 'PAID_AND_SHIPPED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'PAID':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

viewOrderDetails(order: any) {
  console.log('Navegando a detalles de:', order.orderId);
  // Aquí podrías abrir un modal o navegar a /orders/:id
}

}
