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
  activeUser: string;
  code: string = '123456';
  errorTxt: string = ''

  constructor(private uS: UserService,
    private db: DbService,
    private router: Router) { }

  ngOnInit(): void {
    console.log("Regen verification(Regen Password Phase #2) component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);//ACTIVE USER ERROR
  }

  onConfirmActivationButtonClick(): void {
    this.db.getCode(this.activeUser, this.code).subscribe({
      next: (data: any) => { },
      error: (err: any) => console.error(`Error: ${err} `),
      complete: () => {
        console.log("Verfication has been completed, :D")
        this.db.deleteCode(this.code).subscribe({
          next: (data: any) => { },
          error: (err: any) => console.error(`Error: ${err} `),
          complete: () => {
            console.log("Code deletion has been completed, :D")
            this.router.navigate(["password_recovery_2"]);
          }
        })
      }
    })
  }
}
