import { createReducer, on } from '@ngrx/store';
import { addToCart, removeFromCart, updateQuantity } from './cart.actions';

// Define el estado inicial del carrito
export interface CartState {
  items: any[];
}

export const initialState: CartState = {
  items: []  
};

// Reducer para manejar las acciones del carrito
export const cartReducer = createReducer(
  initialState,
  on(addToCart, (state, { item }) => ({
    ...state,
    items: [...state.items, item]  
  })),
  on(removeFromCart, (state, { itemId, size, color }) => ({
    ...state,
    items: state.items.filter(
      item => item.id !== itemId || item.size !== size || item.color !== color
    ) 
  })),
  on(updateQuantity, (state, { itemId, size, color, quantity }) => ({
    ...state,
    items: state.items.map(item =>
      item.id === itemId && item.size === size && item.color === color
        ? { ...item, quantity } 
        : item
    )
  }))
);
