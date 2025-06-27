import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServiceManagementComponent } from './service-management/service-management.component';
import { ProfessionalManagementComponent } from './professional-management/professional-management.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'services', component: ServiceManagementComponent },
  { path: 'professionals', component: ProfessionalManagementComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
