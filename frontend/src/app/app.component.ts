import { Component, OnInit } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { user } from 'src/user';
import { Observable } from 'rxjs';
import { ActiveUserService } from 'src/services/activeuser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title: string = 'frontend';
  host: string = "http://localhost:3000";
  activeUser: string = 'Testovy';
  activeRecipient: string = 'Testovy1';
  users: user[];

  constructor(private http: HttpClient, private router: Router, private aUU: ActiveUserService) { }

  ngOnInit(): void {
    this.users = [];//this.users = [new user("Wielki Elektronik")];
    this.updateUsers();
    console.log("Inited, xdd....")
    this.aUU.currentState.subscribe(username => this.activeUser = username);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.host}/users`)
  }

  updateUsers(): void {
    this.getUsers().subscribe(
      {
        next: (data) => {
          this.users = [];
          for (let i = 0; i < data.length; i++) {
            let u: user = new user(data[i].username);
            this.users.push(u)
          }
        },
        error: (err) => console.error(`Error: ${err}`),
        complete: () => console.log("Users updated completed, :D .")
      })
  }

  selectRecipient(username: string): void {
    for (let i = 0; i < this.users.length; i++)
      if (this.users[i].username == username)
        this.activeRecipient = this.users[i].username;
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login-dialog"], {});
  }

  onRegisterButtonClick(): void {
    this.router.navigate(["registration"], {});
  }
}