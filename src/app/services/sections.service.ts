import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SectionsService {
  private apiUrl = `${environment.apiUrl}/sections`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'x-business-id',
      environment.businessId || 'tienda-de-henry',
    );
  }

  getSections(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  createSection(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData, {
      headers: this.getHeaders(),
    });
  }
}
