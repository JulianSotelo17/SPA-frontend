import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { ToastrService } from 'ngx-toastr';

// Interface to match the structure of appointment data from the backend
export interface DetailedAppointment {
  id: number;
  date: string;
  startTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'unknown';
  service: {
    id: number;
    name: string;
    category: { // Assuming category is available for the link
      id: string;
    }
  };
  professional: {
    name: string;
    lastName: string;
  };
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  appointments: DetailedAppointment[] = [];
  filteredAppointments: DetailedAppointment[] = [];
  activeFilter: string = 'all';
  loading = true;
  error: string | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.error = null;
    this.appointmentService.getMyAppointments().subscribe({
      next: (response) => {
        const statusMap: { [key: string]: DetailedAppointment['status'] } = {
          'Pendiente': 'pending',
          'Confirmada': 'confirmed',
          'Completada': 'completed',
          'Cancelada': 'cancelled'
        };

        this.appointments = response.data.map((app: any) => ({
          ...app,
          status: statusMap[app.status] || 'unknown'
        }));

        this.filterAppointments('all');
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar tus citas. Por favor, intenta de nuevo más tarde.';
        this.toastr.error(this.error, 'Error de Carga');
        this.loading = false;
        console.error(err);
      }
    });
  }

  filterAppointments(filter: string): void {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredAppointments = [...this.appointments];
    } else {
      this.filteredAppointments = this.appointments.filter(app => app.status === filter);
    }
    
    this.sortAppointments();
  }
  
  private sortAppointments(): void {
    this.filteredAppointments.sort((a, b) => {
      const statusOrder = { 'pending': 1, 'confirmed': 2, 'completed': 3, 'cancelled': 4, 'unknown': 5 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // Sort descending, newest first
    });
  }
  
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'confirmed': return 'bg-primary';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return adjustedDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getServiceIcon(serviceName: string): string {
    const name = serviceName ? serviceName.toLowerCase() : '';
    if (name.includes('masaje')) return 'bi-hand-index-thumb';
    if (name.includes('facial') || name.includes('punta')) return 'bi-emoji-smile';
    if (name.includes('cuerpo') || name.includes('velaslim')) return 'bi-person';
    if (name.includes('pestaña')) return 'bi-eye';
    if (name.includes('depilación')) return 'bi-scissors';
    if (name.includes('manos') || name.includes('pies')) return 'bi-gem';
    if (name.includes('yoga')) return 'bi-universal-access';
    return 'bi-star';
  }

  cancelAppointment(appointmentId: number): void {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.')) {
      return;
    }

    this.appointmentService.updateAppointmentStatus(appointmentId, 'Cancelada').subscribe({
      next: () => {
        this.toastr.success('La cita ha sido cancelada con éxito.', 'Cita Cancelada');
        this.loadAppointments();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'No se pudo cancelar la cita.', 'Error');
        console.error(err);
      }
    });
  }
}
