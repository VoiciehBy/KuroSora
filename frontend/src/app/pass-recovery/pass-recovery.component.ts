import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import * as CryptoJS from 'crypto-js';
import { UserService } from 'src/services/user.service';
import {
  HOSTNAME,
  RESET_PASSWORD_STRING,
  REMIND_PASSWORD_BTN_STRING
} from 'src/constants';
import { DbService } from 'src/services/db.service';

@Component({
  selector: 'app-pass-recovery',
  templateUrl: './pass-recovery.component.html',
  styleUrls: ['./pass-recovery.component.css']
})

export class PassRecoveryComponent implements OnInit {
  host: string = HOSTNAME;
  RESET_PASSWORD_STRING: string = RESET_PASSWORD_STRING;
  REMIND_PASSWORD_BTN_STRING: string = REMIND_PASSWORD_BTN_STRING;
  //TODO

  email: string;
  username: string;
  recoveryCode: string;

  errorTxt: string = ''

  constructor(private uS: UserService,
    private db: DbService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("Password Recovery component inited, xdd....");
  }

  onRegenPassBtnClick(): void {
    this.db.getRecoveryCode(this.username, this.recoveryCode).subscribe({
      next: () => { },
      error: (err) => console.error(`Error: ${err}`),
      complete: () => {
        console.log("Recovery code was valid, :D... 43")
        this.db.genCode(this.username).subscribe({
          next: () => { },
          error: (err) => console.error(`Error: ${err}`),
          complete: () => {
            this.uS.setActiveUser(this.username);
            this.router.navigate(["/password_recovery_1"]);
          }
        })
      }
    })
  }
}
