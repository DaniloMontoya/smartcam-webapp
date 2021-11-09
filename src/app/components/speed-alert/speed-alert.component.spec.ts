import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedAlertComponent } from './speed-alert.component';

describe('SpeedAlertComponent', () => {
  let component: SpeedAlertComponent;
  let fixture: ComponentFixture<SpeedAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
