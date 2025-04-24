import { Component } from '@angular/core';

interface Service {
  id: string;
  name: string;
  description?: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  services: Service[];
  bgColor: string;
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  individualServices: ServiceCategory[] = [
    {
      id: 'masajes',
      title: 'Masajes',
      icon: 'bi-hand-index-thumb',
      bgColor: 'bg-white',
      services: [
        { id: 'anti-stress', name: 'Anti-stress' },
        { id: 'descontracturantes', name: 'Descontracturantes' },
        { id: 'piedras-calientes', name: 'Masajes con piedras calientes' },
        { id: 'circulatorios', name: 'Circulatorios' }
      ]
    },
    {
      id: 'belleza',
      title: 'Belleza',
      icon: 'bi-stars',
      bgColor: 'bg-light',
      services: [
        { id: 'lifting-pestana', name: 'Lifting de pestaña' },
        { id: 'depilacion-facial', name: 'Depilación facial' },
        { id: 'manos-pies', name: 'Belleza de manos y pies' }
      ]
    },
    {
      id: 'faciales',
      title: 'Tratamientos Faciales',
      icon: 'bi-emoji-smile',
      bgColor: 'bg-white',
      services: [
        { id: 'punta-diamante', name: 'Punta de Diamante: Microexfoliación', description: 'Técnica de microexfoliación para renovar la piel' },
        { id: 'limpieza-hidratacion', name: 'Limpieza profunda + Hidratación' },
        { id: 'crio-frecuencia', name: 'Crio frecuencia facial', description: 'Produce el "SHOCK TERMICO" logrando resultados instantáneos de efecto lifting' }
      ]
    },
    {
      id: 'corporales',
      title: 'Tratamientos Corporales',
      icon: 'bi-person',
      bgColor: 'bg-light',
      services: [
        { id: 'velaslim', name: 'VelaSlim', description: 'Reducción de la circunferencia corporal y la celulitis' },
        { id: 'dermohealth', name: 'DermoHealth', description: 'Moviliza los distintos tejidos de la piel y estimula la microcirculación, generando un drenaje linfático' },
        { id: 'criofrecuencia', name: 'Criofrecuencia', description: 'Produce un efecto de lifting instantáneo' },
        { id: 'ultracavitacion', name: 'Ultracavitación', description: 'Técnica reductora' }
      ]
    }
  ];

  groupServices: ServiceCategory[] = [
    {
      id: 'grupales',
      title: 'Servicios Grupales',
      icon: 'bi-people-fill',
      bgColor: 'bg-white',
      services: [
        { id: 'hidromasajes', name: 'Hidromasajes' },
        { id: 'yoga', name: 'Yoga' }
      ]
    }
  ];
}
