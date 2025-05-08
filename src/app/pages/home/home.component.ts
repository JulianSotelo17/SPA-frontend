import { Component } from '@angular/core';

interface FeaturedService {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Servicios destacados que se mostrarán en la página de inicio
  featuredServices: FeaturedService[] = [
    {
      id: 'anti-stress',
      categoryId: 'masajes',
      name: 'Masajes Anti-stress',
      description: 'Alivia tensiones y mejora tu circulación con nuestros masajes personalizados.',
      icon: 'bi-hand-index-thumb'
    },
    {
      id: 'punta-diamante',
      categoryId: 'faciales',
      name: 'Tratamientos Faciales',
      description: 'Rejuvenece tu piel con nuestros tratamientos faciales nutritivos y revitalizantes.',
      icon: 'bi-emoji-smile'
    },
    {
      id: 'velaslim',
      categoryId: 'corporales',
      name: 'Tratamientos Corporales',
      description: 'Experimenta nuestros tratamientos corporales para restaurar tu equilibrio y bienestar.',
      icon: 'bi-person'
    }
  ];
}
