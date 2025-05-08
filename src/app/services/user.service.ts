import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';

interface ProfileResponse {
  success: boolean;
  user: User;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient) { }
  
  // Método para obtener las cabeceras con el token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  // Obtener el perfil del usuario actual
  getUserProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/user/profile`, {
      headers: this.getAuthHeaders()
    });
  }
  
  // Aquí se pueden añadir más métodos para actualizar el perfil, cambiar contraseña, etc.
}
