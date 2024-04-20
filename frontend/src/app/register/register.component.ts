import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {
  CREATE_USER_STRING,
  LOGIN_STRING,
  REGISTER_BTN_STRING,
  ALREADY_HAVE_ACCOUNT_STRING,
  HOSTNAME,
  BAD_REGISTRATION_FORM_STRING
} from 'src/constants';
import { DbService } from 'src/services/db.service';

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  host: string = HOSTNAME;
  CREATE_USER_STRING: string = CREATE_USER_STRING;
  REGISTER_BTN_STRING: string = REGISTER_BTN_STRING;
  LOGIN_STRING: string = LOGIN_STRING;
  ALREADY_HAVE_ACCOUNT_STRING: string = ALREADY_HAVE_ACCOUNT_STRING;

  login: string;
  password: string;
  password_1: string;
  username: string;
  email: string;

  errorTxt: string = ''

  constructor(private db: DbService, private router: Router) { }

  ngOnInit(): void {
    console.log("Register component inited, xdd....");
  }

  emailValid(): boolean {
    return this.email != undefined && this.email.includes('@');
  }

  isLoginValid(): boolean {
    return this.login != undefined
  }

  isUsernameValid(): boolean {
    return this.username != undefined
  }

  isPasswordValid(): boolean {
    return this.password != undefined && this.password_1 != undefined;
  }

  isTwoPasswordsMatch(): boolean {
    return this.password === this.password_1;
  }

  signUp(): void {
    if (!this.isTwoPasswordsMatch()
      || !this.isLoginValid()
      || !this.isUsernameValid()
      || !this.emailValid()
      || !this.isPasswordValid()) {
      this.errorTxt = BAD_REGISTRATION_FORM_STRING
      setTimeout(() => { this.errorTxt = '' }, 3000)
      return
    }

    this.db.addUser(this.login, this.username, this.password).subscribe({
      next: () => { },
      error: (err) => console.error(`Error: ${err}`),
      complete: () => {
        console.log("Adding user completed, :D .");
        this.db.genCode(this.username).subscribe({
          next: () => { },
          error: (err) => console.error(`Error: ${err}`),
          complete: () => {
            console.log("Verification code generation completed, :D .");
            this.db.genRecCode(this.username).subscribe({
              next: () => { },
              error: (err) => console.error(`Error: ${err}`),
              complete: () => {
                console.log("Recovery code generation completed, :D .");
              }
            })
          }
        })
        console.log("Signing up completed, :D .");
        this.router.navigate(["login"]);
      }
    })
  }
}