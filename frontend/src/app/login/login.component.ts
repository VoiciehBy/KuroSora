import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { UserService } from 'src/services/user.service';
import {
  WELCOME_BACK_STRING,
  DONT_HAVE_ACCOUNT_STRING,
  CREATE_ACCOUNT_STRING,
  LOGIN_BTN_STRING,
  HOSTNAME
} from 'src/constants';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  host: string = HOSTNAME;

  WELCOME_BACK_STRING: string = WELCOME_BACK_STRING;
  DONT_HAVE_ACCOUNT_STRING: string = DONT_HAVE_ACCOUNT_STRING;
  CREATE_ACCOUNT_STRING: string = CREATE_ACCOUNT_STRING;
  LOGIN_BTN_STRING: string = LOGIN_BTN_STRING;

  login: string;
  password: string;

  activeUser: string;
  isMsgNeedToBeUpdated: boolean;

  constructor(private http: HttpClient,
    private router: Router,
    private uS: UserService) { }

  ngOnInit(): void {
    console.log("Login component inited, xdd....")
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.messageUpdateState.subscribe(b => this.isMsgNeedToBeUpdated = b);
  }

  getUser(login: string, password: string): Observable<any> {
    return this.http.get(`${this.host}/user?login=${login}&password=${password}`)
  }

  signIn(): void {
    let hash = CryptoJS.HmacSHA512('', this.password).toString()
    this.getUser(this.login, hash).subscribe({
      next: (data) => {
        this.uS.setActiveUser(data.username)
      },
      error: (err) => console.error(`Error: ${err}`),
      complete: () => {
        console.log("Signing in completed, :D")
        this.router.navigate([""]);
        this.uS.setMsgUpdate(true)
      }
    })
  }
}
