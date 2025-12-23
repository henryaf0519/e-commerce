import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CartState } from 'src/app/state/cart.reducer';
import { CartItem } from 'src/app/models/cart-item.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cart$: Observable<CartState>;
  totalPrice$: Observable<number>; // Convertimos la función en un stream reactivo

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {
    this.cart$ = this.cartService.getCartState();
    
    // Inicializamos el cálculo del total de forma reactiva
    // Esto es mucho más eficiente que llamar a una función totalPrice() desde el template
    this.totalPrice$ = this.cart$.pipe(
      map(cartState => {
        const total = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return parseFloat(total.toFixed(2));
      })
    );
  }

  // Eliminamos ngOnInit y showCart:
  // 1. 'showCart' no se usaba en el HTML (usabas cart$ | async).
  // 2. La suscripción manual causaba un memory leak.

  removeFromCart(itemId: string): void {
    this.cartService.removeFromCart(itemId);  
  }

  getQuantityOptions(item: CartItem): number[] {
    const maxStock = item.stock || 0;
    return Array.from({ length: maxStock }, (_, index) => index + 1);
  }
  
  // --- SOLUCIÓN PUNTO D: Tipado Estricto ---
  // Cambiamos 'any' por 'number | string'. Aunque el select envía strings, 
  // permitimos number por si se bindea directamente.
  updateQuantity(item: CartItem, quantity: number | string): void {
    const newQuantity = Number(quantity); // Conversión explícita y segura
    
    // Validación adicional de seguridad
    if (isNaN(newQuantity) || newQuantity < 1) {
      return;
    } 
    
    if (newQuantity > item.stock) {
      alert(`Lo sentimos, solo quedan ${item.stock} unidades disponibles.`);
      return;
    }

    this.cartService.updateQuantity(item.id, item.size || '', item.color || '', newQuantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }
}