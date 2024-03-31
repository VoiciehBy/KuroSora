import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as CryptoJS from 'crypto-js';
import { UserService } from 'src/services/user.service';
import {
  HOSTNAME,
  WELCOME_BACK_STRING,
  DONT_HAVE_ACCOUNT_STRING,
  CREATE_ACCOUNT_STRING,
  LOGIN_BTN_STRING,
  BAD_CREDENTIALS_STRING
} from 'src/constants';
import { DbService } from 'src/services/db.service';

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
  BAD_CREDENTIALS_STRING: string = BAD_CREDENTIALS_STRING;

  login: string;
  password: string;
  isMsgNeedToBeUpdated: boolean;

  errorTxt: string = ''

  constructor(private uS: UserService,
    private db: DbService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("Login component inited, xdd....");
    this.uS.messageUpdateState.subscribe(b => this.isMsgNeedToBeUpdated = b);
  }

  signIn(): void {
    let hash = CryptoJS.HmacSHA512('', this.password).toString();
    this.db.getUser(this.login, hash).subscribe({
      next: (data) => {
        if (data.length != 0)
          this.uS.setActiveUser(JSON.stringify(data[0].username).replace('"', '').replace('"', ''));
      },
      error: (err) => {
        console.error(`Error: ${err}`)
        this.errorTxt = this.BAD_CREDENTIALS_STRING
        setTimeout(() => { this.errorTxt = '' }, 3000)
      },
      complete: () => {
        console.log("Signing in completed, :D");
        this.router.navigate([""]);
        this.uS.setMsgUpdate(true);
      }
    })
  }
}
