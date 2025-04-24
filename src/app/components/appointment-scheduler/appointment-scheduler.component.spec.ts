import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSchedulerComponent } from './appointment-scheduler.component';

describe('AppointmentSchedulerComponent', () => {
  let component: AppointmentSchedulerComponent;
  let fixture: ComponentFixture<AppointmentSchedulerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentSchedulerComponent]
    });
    fixture = TestBed.createComponent(AppointmentSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
