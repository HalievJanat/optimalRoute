import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverFormComponent } from './cover-form.component';

describe('CoverFormComponent', () => {
  let component: CoverFormComponent;
  let fixture: ComponentFixture<CoverFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
