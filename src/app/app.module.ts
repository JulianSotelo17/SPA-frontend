import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';
import { ServiceDetailComponent } from './pages/service-detail/service-detail.component';
import { GroupServiceDetailComponent } from './pages/group-service-detail/group-service-detail.component';
import { AppointmentSchedulerComponent } from './components/appointment-scheduler/appointment-scheduler.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { ContactComponent } from './pages/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    HomeComponent,
    ServicesComponent,
    ServiceCardComponent,
    ServiceDetailComponent,
    GroupServiceDetailComponent,
    AppointmentSchedulerComponent,
    AppointmentsComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
