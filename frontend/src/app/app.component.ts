import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title: string = 'frontend';

  constructor(public router: Router) { }

  ngOnInit(): void {
    console.log("Inited, xdd....");
    this.router.navigate(["login"], {});
  }
}