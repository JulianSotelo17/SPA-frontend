import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ServiceService } from '../../../services/service.service';
import { ToastrService } from 'ngx-toastr';

interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
}

@Component({
  selector: 'app-professional-management',
  templateUrl: './professional-management.component.html',
  styleUrls: ['./professional-management.component.css']
})
export class ProfessionalManagementComponent implements OnInit {
  professionals: any[] = [];
  services: any[] = [];
  loading = false;
  loadingProfessionals = false;
  selectedProfessional: any = null;
  
  // Formularios
  professionalForm: FormGroup;
  
  // Estado del modal
  showModal = false;
  isEditing = false;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private serviceService: ServiceService,
    private toastr: ToastrService
  ) {
    // Inicializar formulario
    this.professionalForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      serviceId: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProfessionals();
    this.loadServices();
  }

  /**
   * Cargar la lista de profesionales
   */
  loadProfessionals(): void {
    this.loadingProfessionals = true;
    
    this.userService.getProfessionals().subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          this.professionals = response.data;
          console.log('Profesionales cargados:', this.professionals);
        } else {
          this.toastr.error(response.message || 'Error al cargar profesionales');
        }
        this.loadingProfessionals = false;
      },
      (error: any) => {
        console.error('Error al cargar profesionales:', error);
        this.toastr.error('Error al cargar la lista de profesionales');
        this.loadingProfessionals = false;
      }
    );
  }

  /**
   * Cargar la lista de servicios para el dropdown
   */
  loadServices(): void {
    this.serviceService.getServices().subscribe(
      (response: ApiResponse) => {
        if (response.success && Array.isArray(response.data)) {
          this.services = response.data;
          console.log('Servicios cargados:', this.services);
        } else {
          this.toastr.error('Error al cargar servicios');
        }
      },
      (error: any) => {
        console.error('Error al cargar servicios:', error);
        this.toastr.error('Error al cargar la lista de servicios');
      }
    );
  }

  /**
   * Abrir modal para crear un nuevo profesional
   */
  openCreateModal(): void {
    this.isEditing = false;
    this.selectedProfessional = null;
    this.resetForm();
    this.professionalForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.professionalForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  /**
   * Abrir modal para editar un profesional existente
   */
  openEditModal(professional: any): void {
    this.isEditing = true;
    this.selectedProfessional = professional;
    
    // Quitar validación de password para edición
    this.professionalForm.get('password')?.clearValidators();
    this.professionalForm.get('password')?.updateValueAndValidity();
    
    // Rellenar el formulario con los datos del profesional
    this.professionalForm.patchValue({
      name: professional.name,
      email: professional.email,
      phone: professional.phone || '',
      serviceId: professional.serviceId
    });
    
    this.showModal = true;
  }

  /**
   * Cerrar el modal y resetear el formulario
   */
  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  /**
   * Resetear el formulario
   */
  resetForm(): void {
    this.professionalForm.reset({
      serviceId: null
    });
  }

  /**
   * Enviar el formulario para crear o actualizar profesional
   */
  onSubmitForm(): void {
    if (this.professionalForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.professionalForm.controls).forEach(key => {
        this.professionalForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    const formData = this.professionalForm.value;
    
    if (this.isEditing && this.selectedProfessional) {
      // Si el campo password está vacío, eliminarlo del objeto
      if (!formData.password) {
        delete formData.password;
      }
      
      this.userService.updateProfessional(this.selectedProfessional.id, formData).subscribe(
        (response: ApiResponse) => {
          if (response.success) {
            this.toastr.success('Profesional actualizado exitosamente');
            this.loadProfessionals();
            this.closeModal();
          } else {
            this.toastr.error(response.message || 'Error al actualizar profesional');
          }
          this.loading = false;
        },
        (error: any) => {
          console.error('Error al actualizar profesional:', error);
          this.toastr.error('Error al actualizar profesional');
          this.loading = false;
        }
      );
    } else {
      console.log("llegue aca linea 187")
      this.userService.createProfessional(formData).subscribe(
        (response: ApiResponse) => {
          if (response.success) {
            this.toastr.success('Profesional registrado exitosamente');
            this.loadProfessionals();
            this.closeModal();
          } else {
            this.toastr.error(response.message || 'Error al registrar profesional');
          }
          this.loading = false;
        },
        (error: any) => {
          console.error('Error al registrar profesional:', error);
          this.toastr.error('Error al registrar profesional');
          this.loading = false;
        }
      );
    }
  }

  /**
   * Eliminar un profesional
   */
  deleteProfessional(professional: any): void {
    if (!confirm(`¿Está seguro que desea eliminar al profesional ${professional.name}?`)) {
      return;
    }
    
    this.userService.deleteProfessional(professional.id).subscribe(
      (response: ApiResponse) => {
        if (response.success) {
          this.toastr.success('Profesional eliminado exitosamente');
          this.loadProfessionals();
        } else {
          this.toastr.error(response.message || 'Error al eliminar profesional');
        }
      },
      (error: any) => {
        console.error('Error al eliminar profesional:', error);
        this.toastr.error('Error al eliminar profesional');
      }
    );
  }

  /**
   * Obtener el nombre de un servicio dado su ID
   */
  getServiceNameById(serviceId: number): string {
    if (!serviceId) return 'Sin asignar';
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.name : 'Sin asignar';
  }

  /**
   * Verificar si hay un error en un campo del formulario
   */
  hasError(controlName: string, errorName: string): boolean {
    const control = this.professionalForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }
}
