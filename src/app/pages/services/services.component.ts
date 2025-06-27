import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { Service, ServiceCategory } from '../../models/service.model';

// Interfaz para organizar servicios por categoría en la vista
export interface CategoryGroup {
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
export class ServicesComponent implements OnInit {
  
  individualServices: CategoryGroup[] = [];
  groupServices: CategoryGroup[] = [];
  loading = false;
  error = '';
  
  // Adaptador para mapear las categorías del backend a las categorías del frontend
  categoryAdapter: {[key: string]: string} = {
    'Masajes': 'MASSAGE',
    'Tratamientos Faciales': 'FACIAL_TREATMENT',
    'Tratamientos Corporales': 'BODY_TREATMENT',
    'Belleza': 'BEAUTY',
    'Grupales': 'GROUP'
  };
  
  // Mapeo de iconos para categorías
  categoryIconMap: {[key: string]: string} = {
    'MASSAGE': 'bi-hand-index-thumb',
    'FACIAL_TREATMENT': 'bi-emoji-smile',
    'BODY_TREATMENT': 'bi-droplet',
    'BEAUTY': 'bi-stars',
    'GROUP': 'bi-people'
  };
  
  // Mapeo de colores de fondo para categorías
  categoryBgColorMap: {[key: string]: string} = {
    'MASSAGE': 'bg-white',
    'FACIAL_TREATMENT': 'bg-light',
    'BODY_TREATMENT': 'bg-white',
    'BEAUTY': 'bg-light',
    'GROUP': 'bg-white'
  };
  
  // Mapeo de nombres legibles para categorías
  categoryTitleMap: {[key: string]: string} = {
    'MASSAGE': 'Masajes',
    'FACIAL_TREATMENT': 'Tratamientos Faciales',
    'BODY_TREATMENT': 'Tratamientos Corporales',
    'BEAUTY': 'Belleza',
    'GROUP': 'Servicios Grupales'
  };
  
  constructor(private serviceService: ServiceService) {}
  
  ngOnInit(): void {
    this.loadServices();
  }
  
  loadServices(): void {
    this.loading = true;
    this.error = '';
    
    console.log('Iniciando petición de servicios...');
    
    this.serviceService.getServices().subscribe(
      response => {
        console.log('Respuesta completa del API:', response);
        console.log('Estado de éxito:', response.success);
        console.log('Datos recibidos:', response.data);
        
        if (response.success && Array.isArray(response.data)) {
          console.log('Cantidad de servicios recibidos:', response.data.length);
          console.log('Primer servicio de ejemplo:', response.data[0]);
          this.organizeServicesByCategory(response.data);
        } else {
          console.error('Respuesta inválida o sin servicios:', response);
          this.error = 'No se pudieron cargar los servicios.';
        }
        this.loading = false;
      },
      error => {
        console.error('Error al cargar servicios:', error);
        this.error = 'Error al cargar los servicios. Por favor, intente de nuevo más tarde.';
        this.loading = false;
      }
    );
  }
  
  organizeServicesByCategory(services: Service[]): void {
    console.log('Organizando servicios por categoría, total de servicios:', services.length);
    
    // Reiniciar arreglos
    this.individualServices = [];
    this.groupServices = [];
    
    // Agrupar por categoría
    const servicesByCategory: {[category: string]: Service[]} = {};
    
    // Separar servicios individuales y grupales
    services.forEach(service => {
      console.log('Procesando servicio:', service.id, service.name, 'Categoría:', service.category, 'Grupal:', service.isGroupService);
      
      if (service.isGroupService) {
        console.log('Servicio grupal detectado:', service.name);
        if (!servicesByCategory['GROUP']) {
          servicesByCategory['GROUP'] = [];
        }
        servicesByCategory['GROUP'].push(service);
      } else {
        // Para servicios individuales, agrupar por categoría
        console.log('Servicio individual detectado, categoría:', service.category);
        
        // Adaptar la categoría del backend al formato que espera el frontend
        const adaptedCategory = this.categoryAdapter[service.category] || service.category;
        console.log('Categoría adaptada:', service.category, '->', adaptedCategory);
        
        if (!servicesByCategory[adaptedCategory]) {
          servicesByCategory[adaptedCategory] = [];
          console.log('Creando nueva categoría:', adaptedCategory);
        }
        servicesByCategory[adaptedCategory].push(service);
      }
    });
    
    // Crear grupos de categorías para la visualización
    console.log('Categorías encontradas:', Object.keys(servicesByCategory));
    
    Object.keys(servicesByCategory).forEach(category => {
      console.log('Procesando categoría:', category, 'con', servicesByCategory[category].length, 'servicios');
      
      const group: CategoryGroup = {
        id: category.toLowerCase(),
        title: this.categoryTitleMap[category] || category,
        icon: this.categoryIconMap[category] || 'bi-question-circle',
        services: servicesByCategory[category],
        bgColor: this.categoryBgColorMap[category] || 'bg-white'
      };
      
      console.log('Grupo creado:', group.title, 'con', group.services.length, 'servicios');
      
      if (category === 'GROUP') {
        this.groupServices.push(group);
        console.log('Añadido a servicios grupales, total ahora:', this.groupServices.length);
      } else {
        this.individualServices.push(group);
        console.log('Añadido a servicios individuales, total ahora:', this.individualServices.length);
      }
    });
    
    console.log('Organización final:');
    console.log('Servicios individuales por categoría:', this.individualServices);
    console.log('Servicios grupales:', this.groupServices);
  }
}
