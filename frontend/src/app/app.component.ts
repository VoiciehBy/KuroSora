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
  a = [].constructor(20);
  activeUser: string;
  activeRecipient: string;
  message: string;

  messages: string[] = [];

  users: user[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.activeUser = "Testovy";
    this.activeRecipient = "Testovy1";
    this.message = "";
    this.users = [new user("Wielki Elektronik")];
    this.updateUsers();
    console.log("Inited, xdd....")

    this.getMessages().subscribe(data => {
      for (let i = 0; i < data.length; i++)
        this.messages.push(JSON.stringify(data[i].content))
    },
      err =>
        console.error(`Error: ${err}`))
  }

  getUser(username = "Testovy1"): Observable<any> {
    return this.http.get(`${this.host}/user?username=${username}`)
  }

  updateUsers(): void {
    this.getUser().subscribe(
      data => {
        let u: user = new user(data.username);
        this.users.push(u)
      },
      err =>
        console.error(`Error: ${err}`))
    this.getUser("PanKleks").subscribe(data => {
      let u: user = new user(data.username);
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

  getMessages(sender = "Testovy", recipient = "Testovy1"): Observable<any> {
    return this.http.get(`${this.host}/user_messages?sender=${sender}&recipient=${recipient}`)
  }

  onSendButtonClick(): void {
    this.sendMessage().subscribe(data => {
      console.log(data)
    },
      err =>
        console.error(`Error: ${err}`))
  }
}