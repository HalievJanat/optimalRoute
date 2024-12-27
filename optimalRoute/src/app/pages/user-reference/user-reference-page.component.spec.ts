import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReferencePageComponent } from './user-reference-page.component';

describe('SystemPageComponent', () => {
  let component: UserReferencePageComponent;
  let fixture: ComponentFixture<UserReferencePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReferencePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReferencePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
