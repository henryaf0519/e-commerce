import { Component, OnInit } from '@angular/core';
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
export class CartComponent implements OnInit {
  cart$: Observable<CartState>;
  showCart: boolean = true;

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {
    this.cart$ = this.cartService.getCartState();
  }

 ngOnInit(): void {
    this.cart$.subscribe(cart => {
      // Validamos si hay items para mostrar u ocultar la vista del carrito
      this.showCart = cart.items.length > 0;
    });
  }

  // Actualizado para usar solo el ID según la lógica de tu reducer actual
  removeFromCart(itemId: string): void {
    this.cartService.removeFromCart(itemId);  
  }

  totalPrice(): Observable<number> {
    return this.cart$.pipe(
      map(cartState => {
        const total = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return parseFloat(total.toFixed(2));
      })
    );
  }

  /**
   * Genera las opciones de cantidad basadas en el stock real del backend.
   * Si el stock es 10, el select mostrará del 1 al 10.
   */
  getQuantityOptions(item: CartItem): number[] {
    const maxStock = item.stock || 0;
    return Array.from({ length: maxStock }, (_, index) => index + 1);
  }
  
  /**
   * Actualiza la cantidad validando contra el stock disponible.
   */
  updateQuantity(item: CartItem, event: any): void {
    const newQuantity = parseInt(event.target.value, 10);
    
    if (newQuantity < 1) {
      return;
    } 
    
    if (newQuantity > item.stock) {
      alert(`Lo sentimos, solo quedan ${item.stock} unidades disponibles.`);
      return;
    }

    // Nota: Asegúrate de que el servicio acepte estos parámetros en este orden
    this.cartService.updateQuantity(item.id, item.size || '', item.color || '', newQuantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }
}
