import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendPanelComponent } from './friend-panel.component';

describe('FriendPanelComponent', () => {
  let component: FriendPanelComponent;
  let fixture: ComponentFixture<FriendPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendPanelComponent]
    });
    fixture = TestBed.createComponent(FriendPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
