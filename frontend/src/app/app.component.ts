import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title: string = 'frontend';
  host: string = "http://localhost:3000";
  
  LOGIN_BTN_STRING : string = "Zaloguj";
  LOGOUT_BTN_STRING : string = "Wyloguj";
  
  activeUser: string;

  constructor(private router: Router,
    private uS : UserService) { }

  ngOnInit(): void {
    console.log("Inited, xdd....")
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.router.navigate(["login"], {})
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login"], {});
  }

  onSignOutButtonClick(): void{
    this.uS.setActiveUser("");
    this.router.navigate(["login"], {});
  }

  onRegisterButtonClick(): void {
    this.router.navigate(["register"], {});
  }
}