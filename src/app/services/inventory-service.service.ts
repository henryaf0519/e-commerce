import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CartItem } from '../models/cart-item.model';
import { Observable } from 'rxjs';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('x-business-id', environment.businessId);
  }

  getVisibleProducts(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl, { headers: this.getHeaders() });
  }


  getAdminProducts(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/admin/all`, { headers: this.getHeaders() });
  }

  getProductById(id: string): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
