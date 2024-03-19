import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title: string = 'frontend';
  host: string = "http://localhost:3000";

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log("Inited, xdd....")
    this.router.navigate(["login"], {})
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login"], {});
  }

  onRegisterButtonClick(): void {
    this.router.navigate(["register"], {});
  }
}