import { Component } from '@angular/core';

interface ContactInfo {
  title: string;
  icon: string;
  details: string[];
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  // Formulario de contacto
  name: string = '';
  email: string = '';
  phone: string = '';
  message: string = '';
  subject: string = '';
  
  // Estado del formulario
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: boolean = false;
  
  // Información de contacto
  contactInfo: ContactInfo[] = [
    {
      title: 'Dirección',
      icon: 'bi-geo-alt',
      details: ['Av. Corrientes 1234', 'Ciudad Autónoma de Buenos Aires', 'Argentina']
    },
    {
      title: 'Horario de atención',
      icon: 'bi-clock',
      details: ['Lunes a Viernes: 9:00 - 20:00', 'Sábados: 10:00 - 16:00', 'Domingos: Cerrado']
    },
    {
      title: 'Contacto',
      icon: 'bi-envelope',
      details: ['info@relaxspa.com', '+54 11 5555-1234', 'WhatsApp: +54 9 11 5555-1234']
    }
  ];
  
  // Redes sociales
  socialMedia = [
    { name: 'Instagram', icon: 'bi-instagram', url: 'https://instagram.com' },
    { name: 'Facebook', icon: 'bi-facebook', url: 'https://facebook.com' },
    { name: 'Twitter', icon: 'bi-twitter-x', url: 'https://twitter.com' },
    { name: 'TikTok', icon: 'bi-tiktok', url: 'https://tiktok.com' }
  ];
  
  submitForm(): void {
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    
    // Simulación de envío de formulario
    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      
      // Limpiar el formulario
      this.resetForm();
      
      // Ocultar el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }, 1500);
  }
  
  validateForm(): boolean {
    // Validación simple, en una aplicación real sería más completa
    return !!(this.name && this.email && this.message);
  }
  
  resetForm(): void {
    this.name = '';
    this.email = '';
    this.phone = '';
    this.subject = '';
    this.message = '';
  }
}
