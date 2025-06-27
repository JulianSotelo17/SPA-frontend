export enum UserRole {
  CLIENT = 'client',
  PROFESSIONAL = 'professional',
  ADMIN = 'admin'
}

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  serviceId?: number;
  assignedService?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Professional extends User {
  serviceId: number;
  assignedService: any;
}

export interface UserResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface ProfessionalResponse {
  success: boolean;
  data: Professional[];
  message?: string;
}

export interface SingleProfessionalResponse {
  success: boolean;
  data: Professional;
  message?: string;
}
