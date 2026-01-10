export interface UserAddress {
  zip: string;
  country: string;
  street1: string;
  state: string;
  city: string;
}

export interface User {
  PK: string;
  SK: string;
  entityType: string;
  name: string;
  email: string;
  phone: string;
  businessId: string;
  roles: ('admin' | 'customer')[];
  address: UserAddress;
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  access_token: string;
  user: User;
}