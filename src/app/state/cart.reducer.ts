import { createReducer, on } from '@ngrx/store';
import { addToCart, removeFromCart, updateQuantity, loadCartState } from './cart.actions';

export interface CartState {
  items: any[];
}

export const initialState: CartState = {
  items: []  // Estado inicial vacío
};

export const cartReducer = createReducer(
  initialState,
  on(addToCart, (state, { item }) => {
    const existingItemIndex = state.items.findIndex(i => i.id === item.id);
  
    if (existingItemIndex !== -1) {
      // Si el item ya existe, actualizamos la cantidad
      const updatedItems = [...state.items];
      updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], quantity: item.quantity };
      
      return {
        ...state,
        items: updatedItems
      };
    } else {
      // Si el item no existe, lo agregamos al carrito
      return {
        ...state,
        items: [...state.items, item]
      };
    }
  }),
  

  on(removeFromCart, (state, { itemId }) => ({
    ...state,
    items: state.items.filter(
      item => item.id !== itemId
    )
  })),

  on(updateQuantity, (state, { itemId, quantity, size, color }) => ({
    ...state,
    items: state.items.map(item =>
      item.id === itemId
        ? { ...item, quantity, size, color }  // Actualizar todos los campos excepto `id`
        : item  // Deja los demás productos sin cambios
    )
  })),

  on(loadCartState, (state, { items }) => ({
    ...state,
    items: items  
  }))
);
