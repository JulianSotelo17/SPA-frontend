import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface AppointmentTime {
  hour: string;
  available: boolean;
}

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {
  serviceId: string = '';
  categoryId: string = '';
  service: any = {};
  
  // Estado del formulario de cita
  selectedDate: Date = new Date();
  selectedTime: string = '';
  confirmationStep: boolean = false;
  appointmentSuccess: boolean = false;
  customerName: string = '';
  customerEmail: string = '';
  customerPhone: string = '';
  notes: string = '';
  
  // Servicios de muestra
  serviceCategories: any = {
    'masajes': {
      title: 'Masajes',
      services: {
        'anti-stress': {
          id: 'anti-stress',
          name: 'Masaje Anti-stress',
          description: 'Un masaje terapéutico diseñado para aliviar la tensión y el estrés acumulado. Ideal para quienes llevan un ritmo de vida acelerado y necesitan un momento de relajación profunda.',
          benefits: ['Reduce el estrés y la ansiedad', 'Mejora la calidad del sueño', 'Alivia la tensión muscular', 'Aumenta la sensación de bienestar'],
          duration: '60 minutos',
          price: '$4,500',
          image: 'assets/images/services/massage-1.jpg'
        },
        'descontracturantes': {
          id: 'descontracturantes',
          name: 'Masaje Descontracturante',
          description: 'Masaje profundo que trabaja los tejidos musculares para liberar contracturas y nudos. Perfecto para quienes sufren de dolores musculares crónicos o después de actividad física intensa.',
          benefits: ['Libera contracturas musculares', 'Reduce dolores crónicos', 'Mejora la movilidad', 'Acelera la recuperación muscular'],
          duration: '50 minutos',
          price: '$5,000',
          image: 'assets/images/services/massage-2.jpg'
        },
        'piedras-calientes': {
          id: 'piedras-calientes',
          name: 'Masaje con Piedras Calientes',
          description: 'Terapia que combina masajes tradicionales con la aplicación de piedras basálticas calientes que ayudan a relajar los músculos profundos y mejorar la circulación sanguínea.',
          benefits: ['Relaja profundamente los músculos', 'Mejora la circulación', 'Equilibra los centros energéticos', 'Proporciona sensación de bienestar'],
          duration: '75 minutos',
          price: '$5,800',
          image: 'assets/images/services/massage-3.jpg'
        },
        'circulatorios': {
          id: 'circulatorios',
          name: 'Masaje Circulatorio',
          description: 'Masaje que favorece la circulación sanguínea y linfática, ayudando a eliminar toxinas y reducir la retención de líquidos en el cuerpo.',
          benefits: ['Mejora la circulación sanguínea', 'Reduce la retención de líquidos', 'Ayuda a eliminar toxinas', 'Disminuye la sensación de piernas pesadas'],
          duration: '45 minutos',
          price: '$4,200',
          image: 'assets/images/services/massage-4.jpg'
        }
      }
    },
    'belleza': {
      title: 'Belleza',
      services: {
        'lifting-pestana': {
          id: 'lifting-pestana',
          name: 'Lifting de Pestañas',
          description: 'Tratamiento que eleva y curva las pestañas naturales, dándoles un aspecto más largo y definido sin necesidad de extensiones.',
          benefits: ['Efecto de pestañas más largas', 'Mirada más despejada', 'Dura hasta 8 semanas', 'No requiere mantenimiento diario'],
          duration: '45 minutos',
          price: '$3,800',
          image: 'assets/images/services/beauty-1.jpg'
        },
        'depilacion-facial': {
          id: 'depilacion-facial',
          name: 'Depilación Facial',
          description: 'Técnica especializada para remover vello facial no deseado, dejando la piel suave y libre de irritaciones.',
          benefits: ['Piel suave y tersa', 'Tratamiento personalizado por zonas', 'Ideal para pieles sensibles', 'Resultados duraderos'],
          duration: '30 minutos',
          price: '$2,500',
          image: 'assets/images/services/beauty-2.jpg'
        },
        'manos-pies': {
          id: 'manos-pies',
          name: 'Belleza de Manos y Pies',
          description: 'Tratamiento completo de manicura y pedicura que incluye exfoliación, tratamiento de cutículas, masaje e hidratación profunda.',
          benefits: ['Uñas perfectamente arregladas', 'Piel hidratada y suave', 'Incluye masaje relajante', 'Elimina células muertas y durezas'],
          duration: '80 minutos',
          price: '$3,900',
          image: 'assets/images/services/beauty-3.jpg'
        }
      }
    },
    'faciales': {
      title: 'Tratamientos Faciales',
      services: {
        'punta-diamante': {
          id: 'punta-diamante',
          name: 'Punta de Diamante: Microexfoliación',
          description: 'Técnica de microexfoliación que utiliza puntas de diamante para eliminar células muertas y estimular la producción de colágeno, renovando la piel.',
          benefits: ['Reduce líneas finas', 'Disminuye manchas superficiales', 'Mejora la textura de la piel', 'Estimula la producción de colágeno'],
          duration: '50 minutos',
          price: '$4,600',
          image: 'assets/images/services/facial-1.jpg'
        },
        'limpieza-hidratacion': {
          id: 'limpieza-hidratacion',
          name: 'Limpieza Profunda + Hidratación',
          description: 'Tratamiento que combina una limpieza profunda para eliminar impurezas con una hidratación intensiva que devuelve la luminosidad a la piel.',
          benefits: ['Elimina impurezas y puntos negros', 'Equilibra el pH de la piel', 'Hidratación intensa', 'Piel más luminosa y radiante'],
          duration: '60 minutos',
          price: '$4,200',
          image: 'assets/images/services/facial-2.jpg'
        },
        'crio-frecuencia': {
          id: 'crio-frecuencia',
          name: 'Crio Frecuencia Facial',
          description: 'Innovador tratamiento que combina bajas temperaturas con radiofrecuencia para generar un "shock térmico" que produce un efecto lifting inmediato.',
          benefits: ['Efecto lifting inmediato', 'Reduce la flacidez facial', 'Mejora la definición del óvalo facial', 'Estimula la producción de colágeno y elastina'],
          duration: '45 minutos',
          price: '$5,500',
          image: 'assets/images/services/facial-3.jpg'
        }
      }
    },
    'corporales': {
      title: 'Tratamientos Corporales',
      services: {
        'velaslim': {
          id: 'velaslim',
          name: 'VelaSlim',
          description: 'Tratamiento no invasivo que combina radiofrecuencia, luz infrarroja y vacumterapia para reducir la circunferencia corporal y la celulitis.',
          benefits: ['Reduce la circunferencia corporal', 'Disminuye la apariencia de celulitis', 'Mejora la textura de la piel', 'Reafirma zonas con flacidez'],
          duration: '60 minutos',
          price: '$6,500',
          image: 'assets/images/services/body-1.jpg'
        },
        'dermohealth': {
          id: 'dermohealth',
          name: 'DermoHealth',
          description: 'Tecnología avanzada que moviliza los distintos tejidos de la piel y estimula la microcirculación, generando un drenaje linfático efectivo.',
          benefits: ['Reduce la retención de líquidos', 'Mejora la circulación sanguínea', 'Ayuda a eliminar toxinas', 'Combate la celulitis'],
          duration: '50 minutos',
          price: '$5,800',
          image: 'assets/images/services/body-2.jpg'
        },
        'criofrecuencia': {
          id: 'criofrecuencia',
          name: 'Criofrecuencia Corporal',
          description: 'Tratamiento que aplica el principio del shock térmico a nivel corporal, combinando frío y radiofrecuencia para un efecto lifting instantáneo.',
          benefits: ['Reafirma la piel', 'Reduce la flacidez', 'Mejora el contorno corporal', 'Efecto lifting inmediato'],
          duration: '70 minutos',
          price: '$7,200',
          image: 'assets/images/services/body-3.jpg'
        },
        'ultracavitacion': {
          id: 'ultracavitacion',
          name: 'Ultracavitación',
          description: 'Técnica reductora no invasiva que utiliza ultrasonidos de baja frecuencia para transformar la grasa localizada en una sustancia líquida que el organismo puede eliminar naturalmente.',
          benefits: ['Reduce grasa localizada', 'No invasivo e indoloro', 'Resultados visibles desde las primeras sesiones', 'Ideal para zonas específicas'],
          duration: '45 minutos',
          price: '$5,500',
          image: 'assets/images/services/body-4.jpg'
        }
      }
    }
  };

  timeSlots: AppointmentTime[] = [
    { hour: '09:00', available: true },
    { hour: '10:00', available: true },
    { hour: '11:00', available: true },
    { hour: '12:00', available: true },
    { hour: '13:00', available: false },
    { hour: '15:00', available: true },
    { hour: '16:00', available: true },
    { hour: '17:00', available: true },
    { hour: '18:00', available: true }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['category'] || '';
      this.serviceId = params['id'] || '';
      this.loadServiceDetails();
    });
  }

  loadServiceDetails(): void {
    if (this.categoryId && this.serviceId && 
        this.serviceCategories[this.categoryId] && 
        this.serviceCategories[this.categoryId].services[this.serviceId]) {
      this.service = this.serviceCategories[this.categoryId].services[this.serviceId];
    }
  }

  selectDate(date: Date): void {
    this.selectedDate = date;
  }

  selectTime(hour: string): void {
    this.selectedTime = hour;
  }

  isTimeSelected(hour: string): boolean {
    return this.selectedTime === hour;
  }

  proceedToConfirmation(): void {
    if (this.selectedDate && this.selectedTime) {
      this.confirmationStep = true;
    }
  }

  backToSchedule(): void {
    this.confirmationStep = false;
  }

  submitAppointment(): void {
    // Aquí iría la lógica para enviar la solicitud al backend
    console.log('Appointment submitted', {
      service: this.service,
      date: this.selectedDate,
      time: this.selectedTime,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      notes: this.notes
    });
    
    // Simulamos éxito
    this.appointmentSuccess = true;
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
