import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {
  CREATE_USER_STRING, LOGIN_STRING,
  REGISTER_BTN_STRING, ALREADY_HAVE_ACCOUNT_STRING,
  BAD_REGISTRATION_FORM_STRING, OK_STRING
} from 'src/constants';
import { DbService } from 'src/services/db.service';
import config from 'src/config.json';
import { validator } from '../../validator';

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

  showError(err: any, txt: string, duration: number) {
    console.error(`Error: ${err} `);
    this.errorTxt = txt;
    setTimeout(() => { this.errorTxt = '' }, duration);
  }

  showOk(txt: string = OK_STRING, duration: number = 3000) {
    this.goodTxt = txt;
    setTimeout(() => { this.goodTxt = '' }, duration);
  }

  signUp(): void {
    let v: validator = new validator(this.login, this.password, this.password_1, this.username, this.email);
    if (!v.isValid())
      this.showError(BAD_REGISTRATION_FORM_STRING, BAD_REGISTRATION_FORM_STRING, 3000);
    else
      this.db.createNewAccount(this.login, this.username, this.password).subscribe({
        next: (data: any) => { },
        error: (err) => this.showError(err, "BAD PLACEHOLDER", 3000),
        complete: () => {
          console.log("Adding user completed, :D .");
          this.db.genActCode(this.username, this.email).subscribe({
            next: (data: any) => { },
            error: (err) => this.showError(err, "BAD PLACEHOLDER", 3000),
            complete: () => {
              console.log("Activation code generation completed, :D .");
              this.db.genRecCode(this.username, this.email).subscribe({
                next: (data: any) => { },
                error: (err) => this.showError(err, "BAD PLACEHOLDER", 3000),
                complete: () => {
                  console.log("Recovery code generation completed, :D .");
                  this.db.addTemplatesTo(this.username, config.default_templates).subscribe({
                    next: (data: any) => { },
                    error: (err) => this.showError(err, "BAD PLACEHOLDER", 3000),
                    complete: () => {
                      console.log("Adding default templates completed, :D .");
                      this.showOk();
                      setTimeout(() => { this.router.navigate(["login"]); }, 1000);
                    }
                  })
                }
              })
            }
          })
        }
      })
  }
}