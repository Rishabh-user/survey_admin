import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenendedFormComponent } from './openended-form.component';

describe('OpenendedFormComponent', () => {
  let component: OpenendedFormComponent;
  let fixture: ComponentFixture<OpenendedFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenendedFormComponent]
    });
    fixture = TestBed.createComponent(OpenendedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
