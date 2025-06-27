import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../services/appointment.service';
import { Service } from '../../models/service.model';
import { User } from '../../models/user.model';

// Definición de la interfaz localmente para reflejar la estructura de datos del backend
interface Appointment {
  id: number;
  date: string;
  startTime: string;
  status: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';
  service: Service; // Objeto de servicio anidado con el precio
  professional: User;
  client: User;
}

@Component({
  selector: 'app-payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.css']
})
export class PaymentSummaryComponent implements OnInit {
  appointment: Appointment | null = null;
  isLoading = true;
  isProcessing = false;
  displayPrice: number = 0;
  originalPrice: number = 0;
  hasDiscount = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    const appointmentId = this.route.snapshot.paramMap.get('id');
    if (!appointmentId) {
      this.toastr.error('No se proporcionó un ID de turno.', 'Error');
      this.router.navigate(['/appointments']);
      return;
    }

    this.loadAppointmentDetails(appointmentId);
  }

  loadAppointmentDetails(id: string): void {
    this.isLoading = true;
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.appointment = response.data;
          this.calculatePrice(); // Calcular precio después de recibir los datos
        } else {
          this.toastr.error(response.message || 'Error al cargar el turno', 'Error');
          this.router.navigate(['/appointments']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.toastr.error('No se pudo cargar la información del turno.', 'Error de Servidor');
        this.isLoading = false;
        this.router.navigate(['/appointments']);
      }
    });
  }

  calculatePrice(): void {
    if (!this.appointment || !this.appointment.service) {
      this.toastr.error('No se pudo calcular el precio del servicio.', 'Error de Datos');
      return;
    }

    this.originalPrice = this.appointment.service.price;
    const appointmentDate = new Date(this.appointment.date + 'T' + this.appointment.startTime);
    const hoursDiff = (appointmentDate.getTime() - new Date().getTime()) / 36e5;

    if (hoursDiff > 48) {
      this.hasDiscount = true;
      this.displayPrice = this.originalPrice * 0.85;
    } else {
      this.hasDiscount = false;
      this.displayPrice = this.originalPrice;
    }
  }

  confirmPayment(): void {
    if (this.isProcessing || !this.appointment) {
      return;
    }

    this.isProcessing = true;
    this.appointmentService.updateAppointmentStatus(this.appointment.id, 'Confirmada').subscribe({
      next: () => {
        this.toastr.success('Tu turno ha sido confirmado con éxito.', 'Pago Realizado');
        this.router.navigate(['/appointments']);
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Hubo un error al confirmar el pago.', 'Error');
        this.isProcessing = false;
      }
    });
  }
}
