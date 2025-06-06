import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  errorMessage: string = '';
  rememberMe: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private authService: AuthService
  ) { }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    // Verificar si hay credenciales guardadas en localStorage
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }
  }
  
  // Getter para acceso fácil a los campos del formulario
  get f() { return this.loginForm.controls; }
  
  login() {
    this.submitted = true;
    
    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    const email = this.f['email'].value;
    const password = this.f['password'].value;
    this.rememberMe = this.f['rememberMe'].value;
    
    // Guardar email en localStorage si rememberMe está marcado
    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    
    console.log(`Intentando login con: ${email}`);
    
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.loading = false;
        
        if (response.success) {
          // Redirigir al home
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.loading = false;
        this.errorMessage = error.error?.message || 'Error al iniciar sesión. Intente nuevamente.';
      }
    });
  }
}
