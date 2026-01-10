export interface OrderItem {
  quantity: number;
  productId: string;
  title: string;
  price: number;
}

export interface Invoice {
  date: string;
  stripeReceiptUrl: string;
  total: number;
  subtotal: number;
  invoiceId: string;
  currency: string;
  items: OrderItem[];
  status: string;
  paymentRef: string;
}

export interface ShippingAddress {
  zip: string;
  country: string;
  city: string;
  phone: string;
  name: string;
  street1: string;
  state: string;
}

export interface Shipping {
  carrier: string;
  address: ShippingAddress;
  labelUrl: string;
  trackingNumber: string;
  trackingUrl: string;
  transactionId: string;
}

export interface Order {
  entityType: string;
  orderId: string;
  status: string; 
  createdAt: string;
  invoice: Invoice;
  shipping?: Shipping; 
  PK: string;
  email: string;
}