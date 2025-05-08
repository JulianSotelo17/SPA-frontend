import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  
  constructor(private http: HttpClient) {
    // Intentar recuperar el usuario del localStorage al iniciar
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  public get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.user && response.token) {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // Actualizar el BehaviorSubject
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }
  
  register(name: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, { name, email, password })
      .pipe(
        tap(response => {
          if (response.success && response.user && response.token) {
            // Guardar token y usuario en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // Actualizar el BehaviorSubject
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }
  
  logout(): void {
    // Eliminar datos del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // Reiniciar el BehaviorSubject
    this.currentUserSubject.next(null);
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
