import { Component, OnInit } from '@angular/core';

interface Appointment {
  id: number;
  serviceId: string;
  categoryId: string;
  serviceName: string;
  serviceIcon: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  // Datos de ejemplo para mostrar en la interfaz
  appointments: Appointment[] = [
    {
      id: 1,
      serviceId: 'anti-stress',
      categoryId: 'masajes',
      serviceName: 'Masaje Anti-stress',
      serviceIcon: 'bi-hand-index-thumb',
      date: new Date(2025, 4, 15), // 15 de mayo de 2025
      time: '10:00',
      status: 'confirmed'
    },
    {
      id: 2,
      serviceId: 'punta-diamante',
      categoryId: 'faciales',
      serviceName: 'Punta de Diamante: Microexfoliación',
      serviceIcon: 'bi-emoji-smile',
      date: new Date(2025, 4, 20), // 20 de mayo de 2025
      time: '15:30',
      status: 'pending'
    },
    {
      id: 3,
      serviceId: 'velaslim',
      categoryId: 'corporales',
      serviceName: 'VelaSlim',
      serviceIcon: 'bi-person',
      date: new Date(2025, 4, 10), // 10 de mayo de 2025
      time: '11:00',
      status: 'completed'
    }
  ];

  // Filtrado de citas
  filteredAppointments: Appointment[] = [];
  activeFilter: string = 'all';

  constructor() { }

  ngOnInit(): void {
    // Inicialmente mostrar todas las citas
    this.filteredAppointments = [...this.appointments];
    
    // Ordenar por fecha, mostrando primero las próximas
    this.sortAppointments();
  }

  // Método para filtrar las citas
  filterAppointments(filter: string): void {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredAppointments = [...this.appointments];
    } else {
      this.filteredAppointments = this.appointments.filter(app => app.status === filter);
    }
    
    this.sortAppointments();
  }
  
  // Ordenar citas por fecha
  private sortAppointments(): void {
    this.filteredAppointments.sort((a, b) => {
      // Primero por estado (pendientes y confirmadas primero)
      const statusOrder = { 'pending': 1, 'confirmed': 2, 'completed': 3, 'cancelled': 4 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      
      // Luego por fecha
      return a.date.getTime() - b.date.getTime();
    });
  }
  
  // Método para obtener el color del badge según el estado
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'confirmed': return 'bg-primary';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
  
  // Método para obtener el texto del estado
  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  }
  
  // Función para formatear la fecha
  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
