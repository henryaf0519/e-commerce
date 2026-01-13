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
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('x-business-id', environment.businessId);
  }

  // --- PUBLICO ---
  getVisibleProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // --- ADMIN ---

  // Tu cURL específico
  getAdminProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/all`, {
      headers: this.getHeaders(),
    });
  }

  createProduct(product: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, product, {
      headers: this.getHeaders(),
    });
  }

  // Actualizar (usado para Editar y para Ocultar/Mostrar)
  updateProduct(id: string, data: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  // Eliminar
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
