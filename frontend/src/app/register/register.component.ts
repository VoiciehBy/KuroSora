import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {
  CREATE_USER_STRING,
  LOGIN_STRING,
  REGISTER_BTN_STRING,
  ALREADY_HAVE_ACCOUNT_STRING,
  HOSTNAME
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
  username: string;

  constructor(private db: DbService, private router: Router) { }

  ngOnInit(): void {
    console.log("Register component inited, xdd....");
  }

  signUp(): void {
    if (this.login == undefined || this.login == '' || this.username == undefined)
      return

    //allows duplicate entries

    this.db.addUser(this.login, this.username, this.password).subscribe({
      next: () => { },
      error: (err) => {
        console.error(`Error: ${err}`)
      },
      complete: () => {
        console.log("Signing up completed, :D .");
        this.router.navigate(["login"]);
      }
    })
  }
}