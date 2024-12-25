import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorruptionFormComponent } from './corruption-form.component';

describe('CorruptionFormComponent', () => {
  let component: CorruptionFormComponent;
  let fixture: ComponentFixture<CorruptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorruptionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorruptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
