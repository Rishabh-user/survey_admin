import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionScreenComponent } from './description-screen.component';

describe('DescriptionScreenComponent', () => {
  let component: DescriptionScreenComponent;
  let fixture: ComponentFixture<DescriptionScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescriptionScreenComponent]
    });
    fixture = TestBed.createComponent(DescriptionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
