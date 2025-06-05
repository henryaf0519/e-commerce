import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { debounceTime, tap, withLatestFrom } from 'rxjs/operators';
import { addToCart, removeFromCart, updateQuantity, loadCartState } from './cart.actions';  // Importar las acciones
import { CartState } from './cart.reducer';  // Importar el estado del carrito

@Injectable()
export class CartEffects {
  constructor(private actions$: Actions, private store: Store<{ cart: CartState }>) {}

  
  saveCartToLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToCart, removeFromCart, updateQuantity), 
      withLatestFrom(this.store.select('cart')), 
      debounceTime(300), 
      tap(([action, cartState]) => {
        console.log('Guardando carrito en localStorage:', cartState);
        localStorage.setItem('cart-state', JSON.stringify(cartState));  
      })
    ),
    { dispatch: false }
  );
  


  loadCartFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[App] Load Cart From LocalStorage'), 
      tap(() => {
        const savedCart = localStorage.getItem('cart-state');
        if (savedCart) {
          const cartState = JSON.parse(savedCart);
          this.store.dispatch(loadCartState({ items: cartState.items }));  
        }
      })
    ),
    { dispatch: false }  
  );
}
