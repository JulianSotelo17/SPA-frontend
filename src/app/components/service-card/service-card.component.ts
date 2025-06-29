import { Component, Input } from '@angular/core';
import { Service } from '../../models/service.model';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.css']
})
export class ServiceCardComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() services: Service[] = [];
  @Input() bgColor: string = 'bg-white';
  @Input() expanded: boolean = false;
  @Input() isGroupService: boolean = false;
  @Input() categoryId: string = '';
  
  toggleExpand() {
    this.expanded = !this.expanded;
  }
}
