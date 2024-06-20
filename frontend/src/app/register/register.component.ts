import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {
  CREATE_USER_STRING,
  LOGIN_STRING,
  REGISTER_BTN_STRING,
  ALREADY_HAVE_ACCOUNT_STRING,
  BAD_REGISTRATION_FORM_STRING,
  OK_STRING
} from 'src/constants';
import { DbService } from 'src/services/db.service';

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  CREATE_USER_STRING: string = CREATE_USER_STRING;
  REGISTER_BTN_STRING: string = REGISTER_BTN_STRING;
  LOGIN_STRING: string = LOGIN_STRING;
  ALREADY_HAVE_ACCOUNT_STRING: string = ALREADY_HAVE_ACCOUNT_STRING;

  login: string = '';
  password: string = '';
  password_1: string = '';
  username: string = '';
  email: string = '';

  errorTxt: string = '';
  goodTxt: string = '';

  constructor(private db: DbService, private router: Router) { }

  ngOnInit(): void {
    console.log("Register component inited, xdd....");
  }

  emailValid(): boolean {
    return this.email.includes('@');
  }

  isLoginValid(): boolean {
    return this.login != '';
  }

  isUsernameValid(): boolean {
    return this.username != '';
  }

  isPasswordValid(): boolean {
    return this.password != '' && this.password_1 != '';
  }

  isTwoPasswordsMatch(): boolean {
    return this.password === this.password_1;
  }

  isCredentialsValid(): boolean {
    return (!this.isTwoPasswordsMatch()
      || !this.isLoginValid()
      || !this.isUsernameValid()
      || !this.emailValid()
      || !this.isPasswordValid());
  }

  signUp(): void {
    if (this.isCredentialsValid()) {
      this.errorTxt = BAD_REGISTRATION_FORM_STRING;
      setTimeout(() => { this.errorTxt = '' }, 3000);
      return;
    }

    this.db.createNewAccount(this.login, this.username, this.password).subscribe({
      error: (err) => console.error(`Error: ${err}`),
      complete: () => {
        console.log("Adding user completed, :D .");
        this.db.genActCode(this.username, this.email).subscribe({
          error: (err) => console.error(`Error: ${err}`),
          complete: () => {
            console.log("Activation code generation completed, :D .");
            this.db.genRecCode(this.username, this.email).subscribe({
              error: (err) => console.error(`Error: ${err}`),
              complete: () => console.log("Recovery code generation completed, :D .")
            })
          }
        })
        console.log("Signing up completed, :D .");
        setTimeout(() => { this.goodTxt = OK_STRING; }, 3000);
        setTimeout(() => {
          this.goodTxt = OK_STRING;
          this.router.navigate(["login"]);
        }, 5000);
      }
    })
  }
}