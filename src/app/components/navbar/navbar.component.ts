import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userSubscription?: Subscription;
  isMenuCollapsed = true;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Suscribirse al estado de autenticación del usuario
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  ngOnDestroy(): void {
    // Desuscribirse para evitar memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  
  toggleNavbar(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  // Determinar si se debe mostrar o no un elemento de menú basado en el rol
  shouldShowMenuItem(requiredRoles?: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Si no hay roles requeridos, mostrar siempre
    }
    
    if (!this.currentUser || !this.currentUser.role) {
      return false; // Si no hay usuario o no tiene rol, no mostrar elementos restringidos
    }
    
    return requiredRoles.includes(this.currentUser.role);
  }
}
