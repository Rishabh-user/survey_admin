import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyIncomeForeignPopupComponent } from './monthly-income-foreign-popup.component';

describe('MonthlyIncomeForeignPopupComponent', () => {
  let component: MonthlyIncomeForeignPopupComponent;
  let fixture: ComponentFixture<MonthlyIncomeForeignPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonthlyIncomeForeignPopupComponent]
    });
    fixture = TestBed.createComponent(MonthlyIncomeForeignPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
