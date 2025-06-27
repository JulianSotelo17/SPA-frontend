import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/models/service.model';
import { User } from 'src/app/models/user.model';
import { AppointmentService } from 'src/app/services/appointment.service';
import { ServiceService } from 'src/app/services/service.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  service: Service | null = null;
  professionals: User[] = [];
  selectedDate: string = '';
  selectedTime: string = '';
  selectedProfessionalId: number | null = null;
  timeSlots: { hour: string; available: boolean }[] = [];
  isLoading: boolean = true;
  isBooking: boolean = false;
  minDate: string;

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private appointmentService: AppointmentService,
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    const today = new Date();
    today.setDate(today.getDate() + 2); // Añade 48 horas
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.loadServiceDetails(serviceId);
      this.loadProfessionals(serviceId);
    }
  }

  loadServiceDetails(id: string): void {
    this.isLoading = true;
    this.serviceService.getServiceById(Number(id)).subscribe({
      next: (response) => {
        this.service = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('No se pudo cargar la información del servicio.', 'Error');
        this.isLoading = false;
      }
    });
  }

  loadProfessionals(serviceId: string): void {
    this.serviceService.getProfessionalsByService(serviceId).subscribe({
      next: (response) => {
        this.professionals = response.data;
      },
      error: (err) => {
        this.toastr.error('No se pudieron cargar los profesionales para este servicio.', 'Error');
      }
    });
  }

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.generateTimeSlots();
  }

  generateTimeSlots(): void {
    this.timeSlots = [];
    for (let i = 9; i <= 20; i++) {
      this.timeSlots.push({ hour: `${i.toString().padStart(2, '0')}:00`, available: true });
    }
  }

  selectTime(time: string): void {
    this.selectedTime = time;
  }

  bookAppointment(): void {
    if (!this.validateBooking()) {
      return;
    }

    this.isBooking = true;
    // Calculate startTime and endTime
    const [hour, minute] = this.selectedTime.split(':').map(Number);
    const startTime = new Date(`${this.selectedDate}T${String(hour).padStart(2, '0')}:${String(minute || 0).padStart(2, '0')}:00`);
    
    // The duration of the service is in minutes, it is added to the start time to get the end time.
    const endTime = new Date(startTime.getTime() + this.service!.duration * 60000);

    const appointmentData = {
      serviceId: this.service!.id,
      professionalId: Number(this.selectedProfessionalId),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: 'Pendiente'
    };

    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        this.isBooking = false;
        if (response.success) {
          this.toastr.success('Turno agendado. Serás redirigido para el pago.', 'Éxito');
          setTimeout(() => {
            this.router.navigate(['/payment-summary', response.data.id]);
          }, 2000);
        } else {
          this.toastr.error(response.message || 'No se pudo agendar el turno.', 'Error');
        }
      },
      error: (err) => {
        this.isBooking = false;
        this.toastr.error(err.error?.message || 'Error en el servidor. Intenta de nuevo.', 'Error Crítico');
        console.error('Booking error:', err);
      }
    });
  }

  validateBooking(): boolean {
    if (!this.authService.isLoggedIn) {
      this.toastr.warning('Debes iniciar sesión para agendar un turno.');
      this.router.navigate(['/login']);
      return false;
    }
    if (!this.selectedDate) {
      this.toastr.error('Por favor, selecciona una fecha.');
      return false;
    }
    if (!this.selectedTime) {
      this.toastr.error('Por favor, selecciona una hora.');
      return false;
    }
    if (!this.selectedProfessionalId) {
      this.toastr.error('Por favor, selecciona un profesional.');
      return false;
    }
    return true;
  }

  formatBookingDate(date: string, time: string): string {
    const [hour] = time.split(':');
    const combined = new Date(`${date}T${hour.padStart(2, '0')}:00:00`);
    return combined.toISOString();
  }
}