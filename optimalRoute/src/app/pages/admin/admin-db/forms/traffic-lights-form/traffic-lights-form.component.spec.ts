import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficLightsFormComponent } from './traffic-lights-form.component';

describe('TrafficLightsFormComponent', () => {
  let component: TrafficLightsFormComponent;
  let fixture: ComponentFixture<TrafficLightsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficLightsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficLightsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
