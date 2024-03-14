import { Component, Output, EventEmitter } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
})
export class LoginDialogComponent {
  host: string = "http://localhost:3000";
  login: string;
  password: string;

  constructor(private http: HttpClient, private router: Router) { }

  @Output() selectUserEvent = new EventEmitter<string>();

  getUser(login = "test1"): Observable<any> {
    return this.http.get(`${this.host}/user?login=${login}`)
  }

  signIn(): void {
    this.router.navigate([""]);
    this.getUser(this.login).subscribe(
      data => {
        this.login = data.login
        this.selectUserEvent.emit(data.username)
      },
      err =>
        console.error(`Error: ${err}`))
  }
}
