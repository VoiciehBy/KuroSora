import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HOSTNAME } from 'src/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  host: string = HOSTNAME;
  activeUser: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log("Home component inited, xdd....");
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login-dialog"], {});
  }

  onRegisterButtonClick(): void {
    this.router.navigate(["register"], {});
  }
}
