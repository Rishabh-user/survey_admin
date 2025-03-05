import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LsmPopupComponent } from './lsm-popup.component';

describe('LsmPopupComponent', () => {
  let component: LsmPopupComponent;
  let fixture: ComponentFixture<LsmPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LsmPopupComponent]
    });
    fixture = TestBed.createComponent(LsmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
