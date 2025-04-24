import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupServiceDetailComponent } from './group-service-detail.component';

describe('GroupServiceDetailComponent', () => {
  let component: GroupServiceDetailComponent;
  let fixture: ComponentFixture<GroupServiceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupServiceDetailComponent]
    });
    fixture = TestBed.createComponent(GroupServiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
