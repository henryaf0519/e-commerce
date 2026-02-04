import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ShippingRate {
  id: string;
  provider: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  days: number | string;
  duration: string;
}

export interface ShippingResponse {
  message: string;
  shipmentId: string;
  rates: ShippingRate[];
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiUrl = `${environment.apiUrl}`;
  private stripePromise = loadStripe(environment.strippeKey);

  private shippingAddressSubject = new BehaviorSubject<ShippingAddress | null>(
    null
  );
  shippingAddress$ = this.shippingAddressSubject.asObservable();

  // Cambiamos el tipo a ShippingRate[]
  private shippingRatesSubject = new BehaviorSubject<ShippingRate[]>([]);
  shippingRates$ = this.shippingRatesSubject.asObservable();

  private selectedRateSubject = new BehaviorSubject<ShippingRate | null>(null);
  selectedRate$ = this.selectedRateSubject.asObservable();

  constructor(private http: HttpClient) {}

  async getStripe() {
    return await this.stripePromise;
  }

  setShippingAddress(address: ShippingAddress) {
    this.shippingAddressSubject.next(address);
  }

  getShippingAddress() {
    return this.shippingAddressSubject.value;
  }

getShippingRates(
    addressTo: ShippingAddress,
    items: any[]
  ): Observable<ShippingResponse> {
    console.log('Items enviados para el cálculo de tarifas:', items);
    // Mapeamos los productos del carrito al formato de "Parcelas" que necesita Shippo
    const parcels = items.map((item) => {
      return {
        length: Number(item.length) || 10,
        width: Number(item.width) || 10,
        height: Number(item.height) || 10,
        weight: Number(item.weight) || 0.5,
        quantity: item.quantity
      };
    });

    return this.http.post<ShippingResponse>(`${this.apiUrl}/shippo/shipment`, {
      addressTo,
      parcels, // <--- Enviamos el array de dimensiones
    });
  }


  createPaymentIntent(
    amount: number,
    customerEmail: string = 'usd'
  ): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(
      `${this.apiUrl}/stripe/create-payment-intent`,
      {
        amount,
        customerEmail,
        businessId: environment.businessId,
      }
    );
  }

  setSelectedRate(rate: ShippingRate) {
    this.selectedRateSubject.next(rate);
  }

  getSelectedRate() {
    return this.selectedRateSubject.value;
  }

  createOrder(orderPayload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, orderPayload);
  }
}
