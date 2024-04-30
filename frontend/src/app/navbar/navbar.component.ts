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

  constructor(public router: Router,
    private uS: UserService) { }

  ngOnInit(): void {
    console.log("Navbar component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeUserActivationState.subscribe(b => this.isActiveUserAccountActivated = b);
    this.router.navigate(["login"], {});
  }

  onHomeButtonClick(): void {
    this.router.navigate([""], {});
  }

  onNotificationButtonClick(): void {
    this.router.navigate(["notifications"], {});
  }

  onActivationButtonClick(): void {
    this.router.navigate(["activate"], {});
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login"], {});
  }

  onSignOutButtonClick(): void {
    this.uS.setActiveUser('');
    this.uS.setActiveRecipient('');
    this.uS.setActiveUserActivationState(false);
    this.router.navigate(["login"], {});
  }
}