import { createAction, props } from '@ngrx/store';
import { CartItem } from '../models/cart-item.model';

// Acción para agregar un producto al carrito
export const addToCart = createAction(
  '[Cart] Add to Cart',
  props<{ item: CartItem }>()
);

// Acción para eliminar un producto del carrito
export const removeFromCart = createAction(
  '[Cart] Remove from Cart',
  props<{ itemId: string}>()
);

// Acción para actualizar la cantidad de un producto en el carrito
export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ itemId: string, size: string, color: string, quantity: number }>()
);

export const loadCartState = createAction(
  '[Cart] Load Cart State',
  props<{ items: CartItem[] }>()
);
