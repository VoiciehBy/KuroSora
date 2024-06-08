import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/services/db.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-pass-recovery1',
  templateUrl: './pass-recovery1.component.html',
  styleUrls: ['./pass-recovery1.component.css']
})

export class PassRecovery1Component implements OnInit {
  recoveryUsername: string;
  code: string = '';
  errorTxt: string = '';

  constructor(private uS: UserService,
    private db: DbService,
    private router: Router) { }

  //TO DO TRANSLATIONS STRINGS

  ngOnInit(): void {
    console.log("Regen verification(Regen Password Phase #2) component inited, xdd....");
    this.uS.recoveryUsernameState.subscribe(username => this.recoveryUsername = username);//ACTIVE USER ERROR
  }

  onConfirmActivationButtonClick(): void {
    this.db.getCode(this.recoveryUsername, this.code).subscribe({
      error: (err: any) => {
        console.error(`Error: ${err}`);
        this.errorTxt = "BAD PLACEHOLDER";
        setTimeout(() => { this.errorTxt = '' }, 3000);
      },
      complete: () => {
        console.log("Verfication has been completed, :D")
        this.db.delCode(this.code).subscribe({
          error: (err: any) => {
            console.error(`Error: ${err}`);
            this.errorTxt = "BAD PLACEHOLDER";
            setTimeout(() => { this.errorTxt = '' }, 3000);
          },
          complete: () => {
            console.log("Code deletion has been completed, :D");
            this.router.navigate(["password_recovery_2"]);
          }
        })
      }
    })
  }
}
