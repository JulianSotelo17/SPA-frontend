import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  /**
   * Crea una nueva cita.
   * @param appointmentData Los datos de la cita a crear.
   */
  createAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, appointment);
  }

  /**
   * Obtiene las citas del usuario logueado (cliente o profesional).
   */
  getMyAppointments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /**
   * Obtiene una cita por su ID.
   * @param id El ID de la cita a obtener.
   */
  getAppointmentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza el estado de una cita.
   * @param id El ID de la cita a actualizar.
   * @param status El nuevo estado de la cita.
   */
  updateAppointmentStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  /**
   * Obtiene la agenda de turnos confirmados para el profesional logueado.
   */
  getProfessionalSchedule(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/professional/me`);
  }
}
