import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

// 1. Obtenemos todo el estado de la feature "cart"
// Asegúrate de que en tu app.module.ts el StoreModule.forRoot tenga la clave 'cart'
export const selectCartState = createFeatureSelector<CartState>('cart');

// 2. Selector para obtener la lista de items
export const selectCartItems = createSelector(
  selectCartState,
  (state: CartState) => state.items
);

// 3. Selector para obtener la visibilidad del Sidebar (NUEVO)
export const selectShowSidebar = createSelector(
  selectCartState,
  (state: CartState) => state.showSidebar
);

// 4. Selector derivado: Calcula el precio total automáticamente
// Esto es genial porque se recalcula solo si cambia la lista de items
export const selectTotalPrice = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => total + (item.price * item.quantity), 0)
);

// 5. Selector derivado: Cuenta el número total de productos (para el badge del header)
export const selectTotalItems = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => total + item.quantity, 0)
);