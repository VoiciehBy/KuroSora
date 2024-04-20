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

  constructor(public router: Router,
    private uS: UserService) { }

  ngOnInit(): void {
    console.log("Navbar component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.router.navigate(["login"], {});
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login"], {});
  }

  onSignOutButtonClick(): void {
    this.uS.setActiveUser("");
    this.router.navigate(["login"], {});
  }

  onRegisterButtonClick(): void {
    this.router.navigate(["register"], {});
  }

  onActivationButtonClick(): void {
    this.router.navigate(["activate"],{});
  }
}