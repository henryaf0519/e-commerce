import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CartState } from 'src/app/state/cart.reducer';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
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
      console.log('Estado del carrito en CartComponent:', cart);
      if(cart.items.length === 0) {
        this.showCart = false;
      }
      else{
        this.showCart = true;
      }
    });
  }

  removeFromCart(itemId: string, size: string, color: string): void {
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

  getQuantityOptions(item: any): number[] {
    // Generar un array con las opciones de cantidad del 1 al quantityStock
    return Array.from({ length: item.quantityStock }, (_, index) => index + 1);
  }
  
  updateQuantity(item: any, newQuantity: number): void {
    if (newQuantity < 1) {
      newQuantity = 1;
    } else if (newQuantity > item.quantityStock) {
      newQuantity = item.quantityStock;
    }
    console.log('newQuantity', newQuantity);
    this.cartService.updateQuantity(item.id, item.size, item.color, newQuantity);
  }

  removeItem(item: any): void {
    // Llamamos al método del servicio para eliminar el ítem
    this.cartService.removeFromCart(item.id);
  }
}
