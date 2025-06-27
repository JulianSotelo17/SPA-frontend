import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../services/appointment.service';
import { Service } from '../../models/service.model';
import { User } from '../../models/user.model';

// Interfaz para la estructura de datos de la agenda
interface ScheduleAppointment {
  id: number;
  date: string;
  startTime: string;
  service: { name: string; duration: number; };
  client: { name: string; phone: string; };
}

@Component({
  selector: 'app-professional-schedule',
  templateUrl: './professional-schedule.component.html',
  styleUrls: ['./professional-schedule.component.css']
})
export class ProfessionalScheduleComponent implements OnInit {
  appointments: ScheduleAppointment[] = [];
  isLoading = true;

  constructor(
    private appointmentService: AppointmentService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadSchedule();
  }

  markAsCompleted(appointmentId: number): void {
    this.appointmentService.updateAppointmentStatus(appointmentId, 'Completada').subscribe({
      next: () => {
        // Si se completa con éxito, filtramos la cita de la lista para que desaparezca de la vista.
        this.appointments = this.appointments.filter(app => app.id !== appointmentId);
        // Opcional: podrías añadir una notificación de éxito aquí.
      },
      error: (err) => {
        console.error('Error updating appointment status', err);
        // Opcional: podrías mostrar un mensaje de error al usuario.
      }
    });
  }

  loadSchedule(): void {
    this.isLoading = true;
    this.appointmentService.getProfessionalSchedule().subscribe({
      next: (response) => {
        if (response.success) {
          this.appointments = response.data;
        } else {
          this.toastr.error(response.message || 'No se pudo cargar la agenda.', 'Error');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('Ocurrió un error en el servidor al cargar la agenda.', 'Error');
        this.isLoading = false;
      }
    });
  }
}
