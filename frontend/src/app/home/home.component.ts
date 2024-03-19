import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string = 'frontend';
  host: string = "http://localhost:3000";
  activeUser: string;

  constructor(private router: Router,
    private uS: UserService) { }

  ngOnInit(): void {
    console.log("Home component inited, xdd....")
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login-dialog"], {});
  }

  onRegisterButtonClick(): void {
    this.router.navigate(["register"], {});
  }
}
