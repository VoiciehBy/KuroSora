import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { user } from 'src/user';
import { ActiveUserService } from 'src/services/activeuser.service';

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
    private aUU: ActiveUserService) { }

  ngOnInit(): void {
    console.log("Inited home component, xdd....")
    this.aUU.currentState.subscribe(username => this.activeUser = username);
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login-dialog"], {});
  }

  onRegisterButtonClick(): void {
    this.router.navigate(["register"], {});
  }
}
