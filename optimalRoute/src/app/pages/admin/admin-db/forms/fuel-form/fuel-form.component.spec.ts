import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelFormComponent } from './fuel-form.component';

describe('FuelFormComponent', () => {
  let component: FuelFormComponent;
  let fixture: ComponentFixture<FuelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
