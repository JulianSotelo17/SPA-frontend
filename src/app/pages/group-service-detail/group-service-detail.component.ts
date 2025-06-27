import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Service } from '../../models/service.model';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { ServiceService } from '../../services/service.service';

interface ClassSchedule {
  dayOfWeek: string;
  time: string; // Formato 'HH:mm - HH:mm'
  instructor: string;
}

@Component({
  selector: 'app-group-service-detail',
  templateUrl: './group-service-detail.component.html',
  styleUrls: ['./group-service-detail.component.css']
})
export class GroupServiceDetailComponent implements OnInit {
  service: any = {};
  loading = true;
  error = '';
  minDate: string;

  // --- Booking State ---
  selectedDate: string = '';
  selectedSchedule: ClassSchedule | null = null;
  availableSchedules: ClassSchedule[] = [];
  isBooking = false;

  // --- Mock Data ---
  benefitsByType: { [key: string]: string[] } = {
    'Hidromasajes': [
      'Mejora la circulación sanguínea',
      'Alivia dolores musculares y articulares',
      'Reduce el estrés y la ansiedad',
    ],
    'Clases de Yoga': [
      'Aumenta la flexibilidad y el equilibrio',
      'Fortalece los músculos y mejora la postura',
      'Reduce el estrés y la ansiedad',
    ]
  };

  defaultSchedules: ClassSchedule[] = [
    { dayOfWeek: 'Lunes', time: '10:00 - 11:00', instructor: 'Carolina Méndez' },
    { dayOfWeek: 'Lunes', time: '18:00 - 19:00', instructor: 'Carolina Méndez' },
    { dayOfWeek: 'Martes', time: '09:00 - 10:00', instructor: 'Gabriel Torres' },
    { dayOfWeek: 'Miércoles', time: '10:00 - 11:00', instructor: 'Carolina Méndez' },
    { dayOfWeek: 'Miércoles', time: '18:00 - 19:00', instructor: 'Gabriel Torres' },
    { dayOfWeek: 'Jueves', time: '09:00 - 10:00', instructor: 'Gabriel Torres' },
    { dayOfWeek: 'Viernes', time: '16:00 - 17:00', instructor: 'Laura Rodríguez' },
    { dayOfWeek: 'Sábado', time: '11:00 - 12:00', instructor: 'Laura Rodríguez' },
  ];

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.loadGroupServiceDetails(serviceId);
    } else {
      this.error = 'ID de servicio no válido.';
      this.loading = false;
    }
  }

  loadGroupServiceDetails(id: string): void {
    this.loading = true;
    this.serviceService.getServiceById(Number(id)).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const serviceData = response.data as Service;
          if (serviceData.isGroupService) {
            this.service = {
              ...serviceData,
              price: this.formatPrice(serviceData.price),
              capacity: `${serviceData.maxCapacity || 10} personas`,
              benefits: this.benefitsByType[serviceData.name] || [],
              schedules: this.defaultSchedules
            };
          } else {
            this.error = 'El servicio solicitado no es grupal.';
          }
        } else {
          this.error = response.message || 'Servicio no encontrado.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información del servicio.';
        this.loading = false;
        this.toastr.error(this.error, 'Error');
      }
    });
  }

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.selectedSchedule = null;
    const selectedDay = new Date(this.selectedDate).toLocaleDateString('es-ES', { weekday: 'long' });
    const capitalizedDay = selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1);

    this.availableSchedules = this.service.schedules.filter((s: ClassSchedule) => s.dayOfWeek === capitalizedDay);
  }

  selectSchedule(schedule: ClassSchedule): void {
    this.selectedSchedule = schedule;
  }

  bookAppointment(): void {
    if (!this.selectedDate || !this.selectedSchedule || !this.service.id) {
      this.toastr.warning('Por favor, selecciona una fecha y un horario.', 'Datos incompletos');
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.toastr.error('Debes iniciar sesión para agendar un turno.', 'No autenticado');
      this.router.navigate(['/login']);
      return;
    }

    this.isBooking = true;

    const [startTimeStr] = this.selectedSchedule.time.split(' - ');
    const [hour, minute] = startTimeStr.split(':').map(Number);
    const startTime = new Date(this.selectedDate);
    startTime.setHours(hour, minute, 0, 0);

    const endTime = new Date(startTime.getTime() + this.service.duration * 60000);

    const appointmentData = {
      serviceId: this.service.id,
      clientId: currentUser.id,
      professionalId: null, // No aplica para servicios grupales con horarios fijos
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: 'confirmed', // Los servicios grupales se confirman al pagar
      notes: `Clase de ${this.service.name}`,
    };

    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.toastr.success('Turno agendado. Procediendo al pago.', 'Éxito');
          this.router.navigate(['/payment-summary', response.data.id]);
        } else {
          this.toastr.error(response.message || 'No se pudo crear el turno.', 'Error');
        }
        this.isBooking = false;
      },
      error: (err) => {
        this.isBooking = false;
        this.toastr.error('Ocurrió un error en el servidor. Inténtalo de nuevo.', 'Error');
      }
    });
  }

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-AR')}`;
  }
}
