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
      this.showCart = cart.items.length > 0;
    });
  }

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

  getQuantityOptions(item: CartItem): number[] {
    // Protección contra nulos (si stock no viene, asume 0)
    const maxStock = item.stock || 0;
    return Array.from({ length: maxStock }, (_, index) => index + 1);
  }
  
  // --- CORRECCIÓN AQUÍ ---
  // Cambiamos 'event: any' por 'quantity: any' ya que ngModelChange envía el valor
  updateQuantity(item: CartItem, quantity: any): void {
    const newQuantity = Number(quantity); // Aseguramos que sea número
    
    if (newQuantity < 1) {
      return;
    } 
    
    if (newQuantity > item.stock) {
      alert(`Lo sentimos, solo quedan ${item.stock} unidades disponibles.`);
      return;
    }

    // Enviamos la actualización al servicio
    this.cartService.updateQuantity(item.id, item.size || '', item.color || '', newQuantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id);
  }
}