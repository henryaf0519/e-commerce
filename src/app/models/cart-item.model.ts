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
  
  // Dimensiones
  length?: string | number;
  width?: string | number;
  height?: string | number;
  weight?: string | number;

  // --- NUEVOS CAMPOS (Para paridad con DynamoDB) ---
  PK?: string;
  SK?: string;
  entityType?: string;
  createdAt?: string;
  updatedAt?: string;
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
