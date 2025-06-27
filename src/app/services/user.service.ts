import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse, Professional, ProfessionalResponse, SingleProfessionalResponse } from '../models/user.model';
import { Service } from '../models/service.model';
import { environment } from '../../environments/environment';

interface GenericResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Base URL sin el /api al final para construir correctamente las rutas
  private baseUrl = 'http://localhost:3000';
  
  constructor(private http: HttpClient) { }
  
  // Método para obtener las cabeceras con el token de autenticación
  // private getAuthHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('token');
  //   return new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${token}`
  //   });
  // }
  
  // Obtener el perfil del usuario actual
  // getUserProfile(): Observable<UserResponse> {
  //   return this.http.get<UserResponse>(`${this.apiUrl}/auth/profile`, {
  //     headers: this.getAuthHeaders()
  //   });
  // }

  // Obtener todos los profesionales (solo para administradores)
  getProfessionals(): Observable<ProfessionalResponse> {
    return this.http.get<ProfessionalResponse>(`${this.baseUrl}/api/users/professionals`);
  }

  // Crear un nuevo profesional (solo para administradores)
  createProfessional(data: any): Observable<SingleProfessionalResponse> {
    return this.http.post<SingleProfessionalResponse>(`${this.baseUrl}/api/users/professionals`, data);
  }

  // Actualizar un profesional existente (solo para administradores)
  updateProfessional(id: number, data: any): Observable<SingleProfessionalResponse> {
    return this.http.put<SingleProfessionalResponse>(`${this.baseUrl}/api/users/professionals/${id}`, data);
  }

  // Eliminar un profesional (solo para administradores)
  deleteProfessional(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${this.baseUrl}/api/users/professionals/${id}`);
  }
}
