import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/services/db.service';
import { UserService } from 'src/services/user.service';

import {
  ACCOUNT_ACTIVATION_STRING,
  ACTIVATE_ACCCOUNT_STRING
} from 'src/constants';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})

export class ActivationComponent {
  activeUser: string = '';
  code: string = '';
  errorTxt: string = ''

  ACCOUNT_ACTIVATION_STRING = ACCOUNT_ACTIVATION_STRING;
  ACTIVATE_ACCCOUNT_STRING = ACTIVATE_ACCCOUNT_STRING;

  constructor(private uS: UserService,
    private db: DbService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("Activation component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
  }

  onActivateButtonClick(): void {
    this.db.getCode(this.activeUser, this.code).subscribe({
      error: (err: any) => console.error(`Error: ${err} `),
      complete: () => {
        this.db.activateAccount(this.activeUser).subscribe({
          error: (err: any) => {
            console.error(`Error: ${err} `);
            this.errorTxt = "BAD PLACEHOLDER";
            setTimeout(() => { this.errorTxt = '' }, 3000);
          },
          complete: () => {
            console.log("Account activation has been completed, :D");
            this.db.delCode(this.code).subscribe({
              error: (err: any) => console.error(`Error: ${err} `),
              complete: () => {
                console.log("Temporary verification code has been deleted, :D...")
                this.uS.setActiveUserActivationState(true);
                this.uS.setFriendListUpdate(true);
                this.router.navigate([""], {});
              }
            })
          }
        })
      }
    })
  }
}
