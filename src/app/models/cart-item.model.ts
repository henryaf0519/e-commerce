export interface CartItem {
  id: string;     
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  quantity: number;
  show: boolean;
  isNew?: boolean;
  size?: string;
  color?: string;
}