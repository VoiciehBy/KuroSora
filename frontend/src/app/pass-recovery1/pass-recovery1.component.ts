import { Component, OnInit } from '@angular/core';
import { CONFIRM_STRING } from 'src/constants';
import { Router } from '@angular/router';
import { DbService } from 'src/services/db.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-pass-recovery1',
  templateUrl: './pass-recovery1.component.html',
  styleUrls: ['./pass-recovery1.component.css']
})

export class PassRecovery1Component implements OnInit {
  CONFIRM_STRING: string = CONFIRM_STRING;

  recoveryUsername: string = '';
  code: string = '';
  errorTxt: string = '';

  constructor(private uS: UserService,
    private db: DbService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("Regen verification(Regen Password Phase #2) component inited, xdd....");
    this.uS.recoveryUsernameState.subscribe(u => this.recoveryUsername = u);
  }

  showError(err: any, txt: string, duration: number) {
    console.error(`Error: ${err} `);
    this.errorTxt = txt;
    setTimeout(() => { this.errorTxt = '' }, duration);
  }

  onConfirmActivationButtonClick(): void {
    this.db.getCode(this.recoveryUsername, this.code).subscribe({
      next: (data: any) => { },
      error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
      complete: () => {
        console.log("Verfication has been completed, :D")
        this.db.delCode(this.code).subscribe({
          error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
          complete: () => {
            console.log("Code deletion has been completed, :D");
            this.router.navigate(["password_recovery_2"]);
          }
        })
      }
    })
  }
}
