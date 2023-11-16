import { Component, OnInit } from '@angular/core';

import { HttpClient } from "@angular/common/http";

import { user } from 'src/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title: string = 'frontend';
  host: string = "http://localhost:3000";
  activeUser: string;
  activeRecipient: string;
  message: string;

  users: user[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.activeUser = "Testovy";
    this.activeRecipient = "Testovy1";
    this.message = "";
    this.users = [new user("PanKleks")];
    console.log("Inited, xdd....")
  }

  getUser(username = "Testovy1"): Observable<any> {
    return this.http.get(`${this.host}/users?username=${username}`)
  }

  updateUsers(): void {
    this.getUser().subscribe(data => {
      let u : user = new user(data.username);
      this.users.push(u)
    },
      err =>
        console.error(`Error: ${err}`))
  }

  selectUser(username: string): void {
    for (let i = 0; i < this.users.length; i++)
      if (this.users[i].username == username)
        this.activeRecipient = this.users[i].username;
  }

  sendMessage(): Observable<any> {
    return this.http.put(`${this.host}/message`,
      {
        "sender": this.activeUser,
        "recipient": this.activeRecipient,
        "content": this.message
      })
  }

  onSendButtonClick(): void {
    this.sendMessage().subscribe(data => {
      console.log(data)
    },
      err =>
        console.error(`Error: ${err}`))
  }
}