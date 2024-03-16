import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { ActiveUserService } from 'src/services/activeuser.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  host: string = "http://localhost:3000";
  login: string;
  password: string;

  activeUser: string;

  constructor(private http: HttpClient, private router: Router, private aUU: ActiveUserService) { }

  ngOnInit(): void {
    this.aUU.currentState.subscribe(username => this.activeUser = username);
  }

  getUser(login: string, password : string): Observable<any> {
    return this.http.get(`${this.host}/user?login=${login}&password=${password}`)
  }

  signIn(): void {
    let hash = CryptoJS.HmacSHA512('',this.password).toString()
    this.getUser(this.login, hash).subscribe({
      next: (data) => {
        this.login = data.login
        this.aUU.setActiveUser(data.username)
        this.router.navigate([""]);
      },
      error: (err) =>
        console.error(`Error: ${err}`),
      complete: () => console.log("Signing in completed, :D")
    })
  }
}
