import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.success) {
            this.handleLoginSuccess(response);
          }
        })
      );
  }

  private handleLoginSuccess(response: LoginResponse): void {
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
    this.redirectBasedOnRole(response.user.roles);
  }

  private redirectBasedOnRole(roles: string[]): void {
    if (roles.includes('admin')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (roles.includes('customer')) {
      this.router.navigate(['/profile/orders']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.currentUserSubject.next(JSON.parse(userJson));
    }
  }

  getCurrentUserAddress() {
    return this.currentUserSubject.value?.address;
  }

  updateProfile(data: Partial<User>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/auth/profile`, data).pipe(
      tap(() => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            name: data.name || currentUser.name,
            phone: data.phone || currentUser.phone,
            address: {
              ...currentUser.address,
              street1: (data as any).street1 || currentUser.address?.street1,
              city: (data as any).city || currentUser.address?.city,
              state: (data as any).state || currentUser.address?.state,
              zip: (data as any).zip || currentUser.address?.zip,
              country: (data as any).country || currentUser.address?.country,
            },
          };

          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }

  changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/change-password`, passwords);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
