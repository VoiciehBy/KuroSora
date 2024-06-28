import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/services/db.service';
import { UserService } from 'src/services/user.service';
import {
  ACCOUNT_ACTIVATION_STRING,
  ACTIVATE_ACCCOUNT_STRING,
  OK_STRING
} from 'src/constants';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})

export class ActivationComponent {
  ACCOUNT_ACTIVATION_STRING: string = ACCOUNT_ACTIVATION_STRING;
  ACTIVATE_ACCCOUNT_STRING: string = ACTIVATE_ACCCOUNT_STRING;

  activeUser: string = '';
  code: string = '';

  errorTxt: string = '';
  goodTxt: string = '';

  constructor(private uS: UserService,
    private db: DbService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("Activation component inited...");
    this.uS.activeUserState.subscribe(u => this.activeUser = u);
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

  onActivateButtonClick(): void {
    this.db.getCode(this.activeUser, this.code).subscribe({
      next: () => { },
      error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
      complete: () => {
        this.db.activateAccount(this.activeUser).subscribe({
          next: () => { },
          error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
          complete: () => {
            console.log("Account activation has been completed, :D");
            this.db.delCode(this.code).subscribe({
              next: () => { },
              error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
              complete: () => {
                console.log("Temp verification code has been deleted...");
                this.uS.setActiveUserActivationState(true);
                this.uS.setFriendListUpdate(true);
                this.showOk();
              }
            })
          }
        })
      }
    })
    setTimeout(() => { this.router.navigate([""]); }, 1000);
  }
}