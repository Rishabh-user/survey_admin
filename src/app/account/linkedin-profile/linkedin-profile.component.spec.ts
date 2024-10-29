import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinProfileComponent } from './linkedin-profile.component';

describe('LinkedinProfileComponent', () => {
  let component: LinkedinProfileComponent;
  let fixture: ComponentFixture<LinkedinProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedinProfileComponent]
    });
    fixture = TestBed.createComponent(LinkedinProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
