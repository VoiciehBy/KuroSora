import { Component, OnInit } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import { user } from 'src/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title: string = 'frontend';
  host: string = "http://localhost:3000";
  a = [].constructor(20);
  activeUser: string = 'Testovy';
  activeRecipient: string = 'Testovy1';
  users: user[];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.users = [];//this.users = [new user("Wielki Elektronik")];
    this.updateUsers();
    console.log("Inited, xdd....")
  }

  getUser(username: string): Observable<any> {
    return this.http.get(`${this.host}/user?username=${username}`)
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.host}/users`)
  }

  updateUsers(): void {
    this.getUsers().subscribe(
      data => {
        this.users = [];
        for (let i = 0; i < data.length; i++) {
          let u: user = new user(data[i].username);
          this.users.push(u)
        }
      },
      err =>
        console.error(`Error: ${err}`))
  }

  selectRecipient(username: string): void {
    for (let i = 0; i < this.users.length; i++)
      if (this.users[i].username == username)
        this.activeRecipient = this.users[i].username;
  }

  public selectUser(username: string): void {
    for (let i = 0; i < this.users.length; i++)
      if (this.users[i].username == username)
        this.activeUser = this.users[i].username;
  }

  onLoginButtonClick(): void {
    this.router.navigate(["login-dialog"]);
    console.log(this.router.url)
  }

  getSelectUserEvent($event: any) {
    this.activeUser = $event
    if ($event.username == this.users[0].username)
      this.activeRecipient = this.users[1].username;
    else
      this.activeRecipient = this.users[0].username;
  }
}