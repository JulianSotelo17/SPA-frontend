export enum ServiceCategory {
  MASAJES = 'Masajes',
  BELLEZA = 'Belleza',
  TRATAMIENTOS_FACIALES = 'Tratamientos Faciales',
  TRATAMIENTOS_CORPORALES = 'Tratamientos Corporales',
  GRUPALES = 'Grupales'
}

export interface Service {
  id?: number;
  name: string;
  description: string;
  category: ServiceCategory;
  duration: number; // en minutos
  price: number;
  image?: string;
  isGroupService: boolean;
  maxCapacity?: number; // Solo para servicios grupales
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceResponse {
  success: boolean;
  data: Service;
  message?: string;
}

export interface ServiceListResponse {
  success: boolean;
  data: Service[];
  message?: string;
}
