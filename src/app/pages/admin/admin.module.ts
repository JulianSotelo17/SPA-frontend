import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServiceManagementComponent } from './service-management/service-management.component';
import { ProfessionalManagementComponent } from './professional-management/professional-management.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ServiceManagementComponent,
    ProfessionalManagementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule,
    ToastrModule.forRoot()
  ]
})
export class AdminModule { }
