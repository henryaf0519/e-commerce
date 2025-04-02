import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { CartState } from 'src/app/state/cart.reducer';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  cart$: Observable<CartState>;  // Variable para el carrito

  constructor(private cartService: CartService) {
    this.cart$ = this.cartService.getCartState();  // Usamos el servicio para acceder al estado global
  }

  ngOnInit(): void {
    // Verifica que los datos están cargados correctamente
    this.cart$.subscribe(cart => {
      console.log('Estado del carrito en CartComponent:', cart);  // Muestra el estado del carrito
    });
  }

  // Método para eliminar un producto
  removeFromCart(itemId: string, size: string, color: string): void {
    this.cartService.removeFromCart(itemId);  // Usamos el servicio para despachar la acción
  }

  // Método para actualizar la cantidad de un producto
  updateQuantity(itemId: string, size: string, color: string, quantity: number): void {
    this.cartService.updateQuantity(itemId, size, color, quantity);  // Usamos el servicio para despachar la acción
  }

}
