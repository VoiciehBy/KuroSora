import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string = 'frontend';
  host: string = "http://localhost:3000";
  activeUser: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log("Home component inited, xdd....")
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login-dialog"], {});
  }

  onRegisterButtonClick(): void {
    this.router.navigate(["register"], {});
  }
}
