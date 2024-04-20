import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassRecovery2Component } from './pass-recovery2.component';

describe('PassRecovery2Component', () => {
  let component: PassRecovery2Component;
  let fixture: ComponentFixture<PassRecovery2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PassRecovery2Component]
    });
    fixture = TestBed.createComponent(PassRecovery2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
