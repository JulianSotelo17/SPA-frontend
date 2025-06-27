import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service, ServiceResponse, ServiceListResponse } from '../models/service.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  
  // Obtener todos los servicios
  getServices(): Observable<ServiceListResponse> {
    return this.http.get<ServiceListResponse>(this.apiUrl);
  }
  
  // Obtener un servicio por ID
  getServiceById(id: number): Observable<ServiceResponse> {
    return this.http.get<ServiceResponse>(`${this.apiUrl}/${id}`);
  }
  
  // Crear un nuevo servicio (solo para admin)
  createService(serviceData: Service): Observable<ServiceResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<ServiceResponse>(this.apiUrl, serviceData, { headers });
  }
  
  // Actualizar un servicio existente (solo para admin)
  updateService(id: number, serviceData: Partial<Service>): Observable<ServiceResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<ServiceResponse>(`${this.apiUrl}/${id}`, serviceData, { headers });
  }
  
  // Eliminar un servicio (solo para admin)
  // Obtener profesionales por servicio
  getProfessionalsByService(serviceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${serviceId}/professionals`);
  }

  // Eliminar un servicio (solo para admin)
  deleteService(id: number): Observable<ServiceResponse> {
    const headers = this.getAuthHeaders();
    return this.http.delete<ServiceResponse>(`${this.apiUrl}/${id}`, { headers });
  }
  
  // Obtener headers con token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
