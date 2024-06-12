import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/services/user.service';
import {
  HOSTNAME,
  RESET_PASSWORD_STRING,
  REMIND_PASSWORD_BTN_STRING,
  ACCOUNT_IS_NOT_ACTIVATED
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

  email: string = '';
  username: string = '';
  recoveryCode: string = '';
  errorTxt: string = '';

  constructor(private uS: UserService,
    private db: DbService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("Password Recovery component inited, xdd....");
  }

  onRegenPassBtnClick(): void {
    let isAccountActivated = true;
    this.db.getUser(this.username).subscribe({
      next: (data) => {
        if (data[0].activated === 'F')
          isAccountActivated = isAccountActivated && false;
      },
      error: (err: any) => {
        console.error(`Error: ${err}`);
        this.errorTxt = "BAD PLACEHOLDER";
        setTimeout(() => { this.errorTxt = '' }, 3000);
      },
      complete: () => {
        if (isAccountActivated)
          this.db.getRecoveryCode(this.username, this.recoveryCode).subscribe({
            error: (err: any) => {
              console.error(`Error: ${err}`);
              this.errorTxt = "BAD PLACEHOLDER";
              setTimeout(() => { this.errorTxt = '' }, 3000);
            },
            complete: () => {
              console.log("Recovery code was valid, :D...")
              this.db.genCode(this.username).subscribe({
                error: (err: any) => {
                  console.error(`Error: ${err}`);
                  this.errorTxt = "BAD PLACEHOLDER";
                  setTimeout(() => { this.errorTxt = '' }, 3000);
                },
                complete: () => {
                  this.uS.setRecoveryUsername(this.username);
                  this.router.navigate(["/password_recovery_1"]);
                }
              })
            }
          })
        else {
          this.errorTxt = ACCOUNT_IS_NOT_ACTIVATED;
          setTimeout(() => { this.errorTxt = '' }, 3000);
        }
      }
    })
  }
}
