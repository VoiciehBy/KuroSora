import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { ActiveUserService } from 'src/services/activeuser.service';
import * as CryptoJS from 'crypto-js';
import { MessageUpdateService } from 'src/services/msgupdate.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  host: string = "http://localhost:3000";
  login: string;
  password: string;

  activeUser: string;
  isMsgNeedToBeUpdated: boolean;

  constructor(private http: HttpClient,
    private router: Router,
    private msgUpdate: MessageUpdateService,
    private aUU: ActiveUserService) { }

  ngOnInit(): void {
    this.msgUpdate.currentState.subscribe(b => this.isMsgNeedToBeUpdated = b);
    this.aUU.currentState.subscribe(username => this.activeUser = username);
  }

  getUser(login: string, password: string): Observable<any> {
    return this.http.get(`${this.host}/user?login=${login}&password=${password}`)
  }

  signIn(): void {
    let hash = CryptoJS.HmacSHA512('', this.password).toString()
    this.getUser(this.login, hash).subscribe({
      next: (data) => {
        this.aUU.setActiveUser(data.username)
      },
      error: (err) => console.error(`Error: ${err}`),
      complete: () => {
        console.log("Signing in completed, :D")
        this.router.navigate([""]);
        this.msgUpdate.setUpdate(true)
      }
    })
  }
}
