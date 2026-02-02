export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  quantity: number;
  stock: number;
  show: boolean;
  isNew?: boolean;
  size?: string;
  color?: string;
  section?: string;
  length?: string; // Longitud
  width?: string  // Ancho
  height?: string; // Altura
  weight?: string; // Peso
}

// Nueva interfaz para la vista agrupada
export interface SectionGroup {
  id: string;
  displayTitle: string;
  subtitle: string;
  tagline: string;
  bannerImage: string;
  products: CartItem[];
}
