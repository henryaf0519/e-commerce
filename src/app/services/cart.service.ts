import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartState } from '../state/cart.reducer';
import { Store } from '@ngrx/store';
import { addToCart, removeFromCart, updateQuantity } from '../state/cart.actions'; 

@Injectable({
  providedIn: 'root'
})
export class CartService {

 // Observable para acceder al estado global del carrito
 cart$: Observable<CartState>;

 constructor(private store: Store<{ cart: CartState }>) {
   this.cart$ = this.store.select('cart');  // Suscripción al estado global del carrito
 }

 // Método para obtener el estado del carrito
 getCartState(): Observable<CartState> {
   return this.cart$;  // Devuelve el observable del carrito
 }

 // Método para agregar un producto al carrito
 addToCart(item: any) {
   this.store.dispatch(addToCart({ item }));  // Despacha la acción para agregar al carrito
 }

 // Método para eliminar un producto del carrito
 removeFromCart(itemId: string) {
   this.store.dispatch(removeFromCart({ itemId}));  // Despacha la acción para eliminar del carrito
 }

 // Método para actualizar la cantidad de un producto en el carrito
 updateQuantity(itemId: string, size: string, color: string, quantity: number) {
   this.store.dispatch(updateQuantity({ itemId, size, color, quantity }));  // Despacha la acción para actualizar la cantidad
 }
}
