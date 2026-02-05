import { createReducer, on } from '@ngrx/store';
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  loadCartState, 
  openCartSidebar, 
  closeCartSidebar, 
  clearCart 
} from './cart.actions';
import { CartItem } from '../models/cart-item.model';

export interface CartState {
  items: CartItem[];
  showSidebar: boolean;
}

export const initialState: CartState = {
  items: [],
  showSidebar: false,
};

export const cartReducer = createReducer(
  initialState,
  on(addToCart, (state, { item }) => {
    console.log('🚨 [4. Reducer] ACTION RECEIVED. Payload:', item);
    const existingItemIndex = state.items.findIndex(i => i.id === item.id);
  
    if (existingItemIndex !== -1) {
      console.log('   -> El item YA EXISTE. Actualizando...');
      const updatedItems = [...state.items];
      const existingItem = updatedItems[existingItemIndex];

      updatedItems[existingItemIndex] = { 
        ...existingItem, 
        quantity: existingItem.quantity + item.quantity,
        length: item.length ?? existingItem.length,
        width: item.width ?? existingItem.width,
        height: item.height ?? existingItem.height,
        weight: item.weight ?? existingItem.weight,
        size: item.size ?? existingItem.size,
        color: item.color ?? existingItem.color
      };
      
      return {
        ...state,
        items: updatedItems
      };
    } else {
      console.log('   -> El item es NUEVO. Agregando...');
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
        ? { ...item, quantity, size, color }  // Actualiza los campos específicos
        : item
    )
  })),

  on(loadCartState, (state, { items }) => ({
    ...state,
    items: items  
  })),

  on(openCartSidebar, (state) => ({
    ...state,
    showSidebar: true
  })),
  
  on(closeCartSidebar, (state) => ({
    ...state,
    showSidebar: false
  })),

  on(clearCart, (state) => ({
    ...state,
    items: []
  }))
);