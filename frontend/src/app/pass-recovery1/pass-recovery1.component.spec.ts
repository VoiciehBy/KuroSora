import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassRecovery1Component } from './pass-recovery1.component';

describe('PassRecovery1Component', () => {
  let component: PassRecovery1Component;
  let fixture: ComponentFixture<PassRecovery1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassRecovery1Component]
    });
    fixture = TestBed.createComponent(PassRecovery1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
