import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface ClassSchedule {
  dayOfWeek: string;
  time: string;
  instructor: string;
  duration: string;
  level: string;
}

@Component({
  selector: 'app-group-service-detail',
  templateUrl: './group-service-detail.component.html',
  styleUrls: ['./group-service-detail.component.css']
})
export class GroupServiceDetailComponent implements OnInit {
  serviceId: string = '';
  service: any = {};
  
  // Servicios grupales de muestra
  groupServices: any = {
    'hidromasajes': {
      id: 'hidromasajes',
      name: 'Hidromasajes',
      description: 'Disfruta de los beneficios terapéuticos del agua en nuestras sesiones de hidromasaje grupal. Ideal para aliviar dolores musculares y articulares, mejorar la circulación y reducir el estrés en un ambiente relajante y social.',
      benefits: [
        'Mejora la circulación sanguínea',
        'Alivia dolores musculares y articulares',
        'Reduce el estrés y la ansiedad',
        'Favorece la relajación profunda'
      ],
      capacity: '6 personas',
      price: '$3,500 por sesión',
      image: 'assets/images/services/group-1.jpg',
      schedules: [
        { dayOfWeek: 'Lunes', time: '10:00 - 11:00', instructor: 'Carolina Méndez', duration: '60 minutos', level: 'Todos los niveles' },
        { dayOfWeek: 'Lunes', time: '18:00 - 19:00', instructor: 'Gabriel Torres', duration: '60 minutos', level: 'Todos los niveles' },
        { dayOfWeek: 'Miércoles', time: '10:00 - 11:00', instructor: 'Carolina Méndez', duration: '60 minutos', level: 'Todos los niveles' },
        { dayOfWeek: 'Miércoles', time: '18:00 - 19:00', instructor: 'Gabriel Torres', duration: '60 minutos', level: 'Todos los niveles' },
        { dayOfWeek: 'Viernes', time: '16:00 - 17:00', instructor: 'Laura Rodríguez', duration: '60 minutos', level: 'Todos los niveles' },
        { dayOfWeek: 'Sábados', time: '11:00 - 12:00', instructor: 'Laura Rodríguez', duration: '60 minutos', level: 'Todos los niveles' }
      ]
    },
    'yoga': {
      id: 'yoga',
      name: 'Clases de Yoga',
      description: 'Conecta cuerpo, mente y espíritu a través de nuestras clases de yoga dirigidas por instructores certificados. Aprende posturas, técnicas de respiración y meditación para mejorar tu flexibilidad, fuerza y bienestar general.',
      benefits: [
        'Aumenta la flexibilidad y el equilibrio',
        'Fortalece los músculos y mejora la postura',
        'Reduce el estrés y la ansiedad',
        'Mejora la concentración y claridad mental'
      ],
      capacity: '12 personas',
      price: '$2,800 por sesión / $8,500 mensual (3 clases por semana)',
      image: 'assets/images/services/group-2.jpg',
      schedules: [
        { dayOfWeek: 'Lunes', time: '08:00 - 09:15', instructor: 'María Jiménez', duration: '75 minutos', level: 'Principiante' },
        { dayOfWeek: 'Lunes', time: '19:00 - 20:15', instructor: 'Fernando Vega', duration: '75 minutos', level: 'Intermedio' },
        { dayOfWeek: 'Martes', time: '18:00 - 19:15', instructor: 'María Jiménez', duration: '75 minutos', level: 'Principiante' },
        { dayOfWeek: 'Miércoles', time: '08:00 - 09:15', instructor: 'María Jiménez', duration: '75 minutos', level: 'Principiante' },
        { dayOfWeek: 'Miércoles', time: '19:00 - 20:15', instructor: 'Fernando Vega', duration: '75 minutos', level: 'Intermedio' },
        { dayOfWeek: 'Jueves', time: '18:00 - 19:15', instructor: 'María Jiménez', duration: '75 minutos', level: 'Principiante' },
        { dayOfWeek: 'Viernes', time: '08:00 - 09:15', instructor: 'María Jiménez', duration: '75 minutos', level: 'Principiante' },
        { dayOfWeek: 'Viernes', time: '19:00 - 20:30', instructor: 'Fernando Vega', duration: '90 minutos', level: 'Avanzado' },
        { dayOfWeek: 'Sábados', time: '10:00 - 11:30', instructor: 'Fernando Vega', duration: '90 minutos', level: 'Todos los niveles' }
      ]
    }
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.serviceId = params['id'] || '';
      this.loadServiceDetails();
    });
  }

  loadServiceDetails(): void {
    if (this.serviceId && this.groupServices[this.serviceId]) {
      this.service = this.groupServices[this.serviceId];
    }
  }

  getUniqueWeekdays(): string[] {
    if (!this.service.schedules) return [];
    const days = this.service.schedules.map((s: ClassSchedule) => s.dayOfWeek);
    return [...new Set(days)] as string[];
  }
  
  getSchedulesByDay(day: string): ClassSchedule[] {
    if (!this.service.schedules) return [];
    return this.service.schedules.filter((s: ClassSchedule) => s.dayOfWeek === day);
  }
}
