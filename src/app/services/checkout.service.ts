import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface ShippingAddress {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  country: string;
  department: string;
  postalCode: string;
  phone: string;
}

export interface ShippingRate {
  id: string;
  provider: string;
  serviceName: string;
  days: string;
  price: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  
  private apiUrl = `${environment.apiUrl}/checkout`;

  private shippingAddressSubject = new BehaviorSubject<ShippingAddress | null>(null);
  shippingAddress$ = this.shippingAddressSubject.asObservable();

  private shippingRatesSubject = new BehaviorSubject<any[]>([]);
  shippingRates$ = this.shippingRatesSubject.asObservable();

  private selectedRateSubject = new BehaviorSubject<ShippingRate | null>(null);
  selectedRate$ = this.selectedRateSubject.asObservable();

  constructor(private http: HttpClient) {}

  setShippingAddress(address: ShippingAddress) {
    this.shippingAddressSubject.next(address);
  }

  getShippingAddress() {
    return this.shippingAddressSubject.value;
  }

  getShippingRates(address: ShippingAddress, items: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/shipping-rates`, { address, items });
  }

  createPaymentIntent(amount: number, currency: string = 'usd'): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/create-payment-intent`, {
      amount,
      currency
    });
  }

  setSelectedRate(rate: ShippingRate) {
    this.selectedRateSubject.next(rate);
  }

  getSelectedRate() {
    return this.selectedRateSubject.value;
  }
}
