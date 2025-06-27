import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../../services/service.service';
import { Service, ServiceCategory } from '../../../models/service.model';

@Component({
  selector: 'app-service-management',
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css']
})
export class ServiceManagementComponent implements OnInit {
  services: Service[] = [];
  loading = false;
  error = '';
  success = '';
  
  // Para el form de creación/edición
  serviceForm: FormGroup;
  isEditing = false;
  currentServiceId: number | null = null;
  
  // Categorías disponibles para el select
  serviceCategories = Object.values(ServiceCategory);
  
  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService
  ) {
    this.serviceForm = this.createServiceForm();
  }
  
  ngOnInit(): void {
    this.loadServices();
  }
  
  // Carga todos los servicios
  loadServices(): void {
    this.loading = true;
    this.error = '';
    
    this.serviceService.getServices().subscribe(
      response => {
        if (response.success && response.data) {
          this.services = response.data;
        }
        this.loading = false;
      },
      error => {
        console.error('Error al cargar los servicios', error);
        this.error = 'No se pudieron cargar los servicios. Por favor, intente de nuevo.';
        this.loading = false;
      }
    );
  }
  
  // Crea el form reactivo
  createServiceForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      duration: [60, [Validators.required, Validators.min(15), Validators.max(240)]],
      price: [0, [Validators.required, Validators.min(0)]],
      image: [''],
      isGroupService: [false],
      maxCapacity: [null]
    });
  }
  
  // Para editar un servicio
  editService(service: Service): void {
    this.isEditing = true;
    this.currentServiceId = service.id ?? null;
    
    // Establecer valores en el formulario
    this.serviceForm.patchValue({
      name: service.name,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: service.price,
      image: service.image || '',
      isGroupService: service.isGroupService,
      maxCapacity: service.maxCapacity || null
    });
    
    // Desplazar al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Para eliminar un servicio
  deleteService(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('¿Está seguro de que desea eliminar este servicio? Esta acción no se puede deshacer.')) {
      this.loading = true;
      
      this.serviceService.deleteService(id).subscribe(
        response => {
          if (response.success) {
            this.success = 'Servicio eliminado con éxito';
            this.loadServices(); // Recargar la lista
          } else {
            this.error = response.message || 'Error al eliminar el servicio';
          }
          this.loading = false;
        },
        error => {
          console.error('Error al eliminar el servicio', error);
          this.error = 'No se pudo eliminar el servicio. Por favor, intente de nuevo.';
          this.loading = false;
        }
      );
    }
  }
  
  // Para guardar un servicio (crear o actualizar)
  onSubmit(): void {
    if (this.serviceForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.serviceForm.controls).forEach(key => {
        const control = this.serviceForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    this.loading = true;
    this.error = '';
    this.success = '';
    
    const serviceData = this.serviceForm.value as Service;
    
    // Si se está editando, actualizar; de lo contrario, crear
    if (this.isEditing && this.currentServiceId) {
      this.serviceService.updateService(this.currentServiceId, serviceData).subscribe(
        response => {
          if (response.success) {
            this.success = 'Servicio actualizado con éxito';
            this.loadServices();
            this.resetForm();
          } else {
            this.error = response.message || 'Error al actualizar el servicio';
          }
          this.loading = false;
        },
        error => {
          console.error('Error al actualizar el servicio', error);
          this.error = 'No se pudo actualizar el servicio. Por favor, intente de nuevo.';
          this.loading = false;
        }
      );
    } else {
      this.serviceService.createService(serviceData).subscribe(
        response => {
          if (response.success) {
            this.success = 'Servicio creado con éxito';
            this.loadServices();
            this.resetForm();
          } else {
            this.error = response.message || 'Error al crear el servicio';
          }
          this.loading = false;
        },
        error => {
          console.error('Error al crear el servicio', error);
          this.error = 'No se pudo crear el servicio. Por favor, intente de nuevo.';
          this.loading = false;
        }
      );
    }
  }
  
  // Resetea el formulario
  resetForm(): void {
    this.serviceForm.reset({
      name: '',
      description: '',
      category: '',
      duration: 60,
      price: 0,
      image: '',
      isGroupService: false,
      maxCapacity: null
    });
    this.isEditing = false;
    this.currentServiceId = null;
  }
  
  // Controla la visibilidad del campo maxCapacity según isGroupService
  onIsGroupServiceChange(): void {
    const isGroupService = this.serviceForm.get('isGroupService')?.value;
    
    if (isGroupService) {
      this.serviceForm.get('maxCapacity')?.setValidators([Validators.required, Validators.min(2)]);
    } else {
      this.serviceForm.get('maxCapacity')?.clearValidators();
      this.serviceForm.get('maxCapacity')?.setValue(null);
    }
    
    this.serviceForm.get('maxCapacity')?.updateValueAndValidity();
  }
}
