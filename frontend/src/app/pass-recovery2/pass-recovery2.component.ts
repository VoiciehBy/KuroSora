import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  RESET_PASSWORD_STRING
} from 'src/constants';
import { DbService } from 'src/services/db.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-pass-recovery2',
  templateUrl: './pass-recovery2.component.html',
  styleUrls: ['./pass-recovery2.component.css']
})

export class PassRecovery2Component implements OnInit {
  password: string;
  password_1: string;
  activeUser: string;

  errorTxt: string = ''

  RESET_PASSWORD_STRING = RESET_PASSWORD_STRING;

  constructor(private uS: UserService,
    private db: DbService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("Password reset(Regen Password Phase #3) component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
  }

  isPasswordValid(): boolean {
    return this.password != undefined && this.password_1 != undefined;
  }

  isTwoPasswordsMatch(): boolean {
    return this.password === this.password_1;
  }

  onConfirmButtonClick(): void {
    if (!this.isTwoPasswordsMatch()
      || !this.isPasswordValid()) {

      this.errorTxt = 'BAD PLACEHOLDER'
      setTimeout(() => { this.errorTxt = '' }, 3000)
      return
    }

    this.db.changePassword(this.activeUser, this.password).subscribe({
      next: (data: any) => { },
      error: (err: any) => console.error(`Error: ${err} `),
      complete: () => {
        console.log("Password change has been completed, :D")
        this.router.navigate(["login"]);
      }
    })
  }
}
