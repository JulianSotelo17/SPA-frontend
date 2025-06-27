import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { GroupServiceDetailComponent } from './pages/group-service-detail/group-service-detail.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PaymentSummaryComponent } from './pages/payment-summary/payment-summary.component';
import { ProfessionalScheduleComponent } from './pages/professional-schedule/professional-schedule.component'; // Importar el nuevo componente
import { AdminGuard } from './guards/admin.guard';
import { ProfessionalGuard } from './guards/professional.guard'; // Importar el nuevo guard

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'service/:category/:id', component: ServiceDetailComponent },
  { path: 'group-service/:id', component: GroupServiceDetailComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'payment-summary/:id', component: PaymentSummaryComponent },
  { path: 'professional-schedule', component: ProfessionalScheduleComponent, canActivate: [ProfessionalGuard] },
  // Ruta para el módulo de administración con carga perezosa (lazy loading)
  { 
    path: 'admin', 
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard] // Protege todas las rutas de administración
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
