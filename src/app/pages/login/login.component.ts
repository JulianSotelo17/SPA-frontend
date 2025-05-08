import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  
  constructor(private router: Router, private authService: AuthService) { }
  
  login() {
    this.loading = true;
    this.errorMessage = '';
    
    // Usar datos del formulario (temporal)
    // En producción, estos valores vendrían del formulario
    const email = 'usuario@test.com'; // Usando el usuario demo que creamos en el backend
    const password = '123456';
    
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
