import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  RESET_PASSWORD_STRING,
  BAD_CREDENTIALS_2_STRING,
  OK_STRING
} from 'src/constants';
import { DbService } from 'src/services/db.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-pass-recovery2',
  templateUrl: './pass-recovery2.component.html',
  styleUrls: ['./pass-recovery2.component.css']
})

export class PassRecovery2Component implements OnInit {
  RESET_PASSWORD_STRING = RESET_PASSWORD_STRING;

  password: string;
  password_1: string;
  recoveryUsername: string = '';
  errorTxt: string = '';
  goodTxt: string = '';

  constructor(private uS: UserService,
    private db: DbService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("Password reset(Regen Password Phase #3) component inited, xdd....");
    this.uS.recoveryUsernameState.subscribe(username => this.recoveryUsername = username);
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

      this.errorTxt = BAD_CREDENTIALS_2_STRING;
      setTimeout(() => { this.errorTxt = '' }, 3000);
      return
    }

    this.db.changePassword(this.recoveryUsername, this.password).subscribe({
      error: (err: any) => console.error(`Error: ${err} `),
      complete: () => {
        console.log("Password change has been completed, :D");
        this.uS.setRecoveryUsername('');
      }
    })
    setTimeout(() => { this.goodTxt = OK_STRING; }, 3000);
    setTimeout(() => {
      this.goodTxt = OK_STRING;
      this.router.navigate(["login"]);
    }, 5000);
  }
}
