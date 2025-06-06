import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern('^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$')],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      termsCheck: [false, Validators.requiredTrue]
    }, {
      validators: RegisterComponent.passwordMatchValidator
    });
  }
  
  // Validador personalizado para verificar que las contraseñas coincidan
  static passwordMatchValidator(formGroup: FormGroup): { [key: string]: any } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }
  
  // Getter para acceso fácil a los campos del formulario
  get f() { return this.registerForm.controls; }
  
  onSubmit() {
    this.submitted = true;
    
    // Detener si el formulario es inválido
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    // Combinar nombre y apellido en un solo campo
    const fullName = `${this.f['firstName'].value} ${this.f['lastName'].value}`;
    
    // Preparar datos para el registro
    const userData = {
      name: fullName,
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: 'client', // Por defecto, los usuarios que se registran son clientes
      phone: this.f['phone'].value || undefined // Incluir teléfono solo si está presente
    };
    
    this.authService.register(userData).subscribe({
      next: (response) => {
        // Registro exitoso, redirigir a la página de inicio
        this.router.navigate(['/home']);
      },
      error: (error) => {
        // Manejar errores de registro
        this.errorMessage = error.error?.message || 'Error durante el registro. Inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }
}
