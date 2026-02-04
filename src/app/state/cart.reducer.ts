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
    const existingItemIndex = state.items.findIndex(i => i.id === item.id);
  
    if (existingItemIndex !== -1) {
      // Si el item ya existe, creamos una copia del array para mantener inmutabilidad
      const updatedItems = [...state.items];
      const existingItem = updatedItems[existingItemIndex];

      // Actualizamos el item sumando la cantidad y preservando/actualizando dimensiones
      updatedItems[existingItemIndex] = { 
        ...existingItem, 
        // Sumamos la cantidad existente con la nueva para que el estado refleje el cambio real
        quantity: existingItem.quantity + item.quantity,
        // Actualizamos dimensiones solo si el nuevo item las trae, de lo contrario mantenemos las anteriores
        length: item.length ?? existingItem.length,
        width: item.width ?? existingItem.width,
        height: item.height ?? existingItem.height,
        weight: item.weight ?? existingItem.weight,
        // También actualizamos talla y color si aplica
        size: item.size ?? existingItem.size,
        color: item.color ?? existingItem.color
      };
      
      return {
        ...state,
        items: updatedItems
      };
    } else {
      // Si el item no existe, lo agregamos al carrito como un nuevo elemento
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