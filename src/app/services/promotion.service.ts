import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  // Ajusta la URL base según cómo esté configurado tu backend
  private apiUrl = `${environment.apiUrl}/promotions`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('x-business-id', environment.businessId);
  }

  // Obtener la única promoción activa
  getActivePromotion(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/active`, {
      headers: this.getHeaders(),
    });
  }

  // Crear o Actualizar (si ya existe, el backend debería manejar la lógica de upsert)
  savePromotion(data: FormData): Observable<any> {
    console.log('Saving promotion with data:', data);
    return this.http.post<any>(this.apiUrl, data, {
      headers: this.getHeaders(),
    });
  }

  // Validar si el código es apto para un email específico
  validatePromotionCode(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate`,
      { email, code },
      { headers: this.getHeaders() }
    );
  }


  getAllPromotions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() });
  }

  toggleActive(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/activate`, {}, { headers: this.getHeaders() });
  }

  deactivate(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/deactivate`, {}, { headers: this.getHeaders() });
  }


}