import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  activeUser: string;
  isActiveUserAccountActivated: boolean;
  isLeftAligned: boolean;

  constructor(public router: Router,
    private uS: UserService) { }

  ngOnInit(): void {
    console.log("Navbar component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeUserActivationState.subscribe(b => this.isActiveUserAccountActivated = b);
    this.uS.leftAlignedState.subscribe(b => this.isLeftAligned = b);
    this.router.navigate(["login"], {});
  }

  onHomeButtonClick(): void {
    this.uS.setMsgUpdate(true);
    this.uS.setFriendListUpdate(true);
    this.uS.setNotificationListUpdate(false);
    this.router.navigate([""], {});
  }

  onNotificationButtonClick(): void {
    this.uS.setActiveRecipient('');
    this.uS.setMsgUpdate(false);
    this.uS.setFriendListUpdate(false);
    this.router.navigate(["notifications"], {});
  }

  onActivationButtonClick(): void {
    this.uS.setActiveRecipient('');
    this.uS.setMsgUpdate(false);
    this.uS.setFriendListUpdate(false);
    this.uS.setNotificationListUpdate(false);
    this.router.navigate(["activate"], {});
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login"], {});
  }

  onSignOutButtonClick(): void {
    this.uS.setActiveUser('');
    this.uS.setActiveRecipient('');
    this.uS.setActiveUserActivationState(false);
    this.uS.setMsgUpdate(false);
    this.uS.setFriendListUpdate(false);
    this.uS.setNotificationListUpdate(false);
    this.router.navigate(["login"], {});
  }

  onToggleAligmentButtonClick(): void {
    this.uS.setLeftAlignedState(!this.isLeftAligned);
    this.uS.setFriendListUpdate(true);
  }
}