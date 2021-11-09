import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SosAlertComponent } from './sos-alert.component';

describe('SosAlertComponent', () => {
  let component: SosAlertComponent;
  let fixture: ComponentFixture<SosAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SosAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SosAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
