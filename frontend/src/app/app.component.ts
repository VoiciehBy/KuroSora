import { Component, OnInit } from '@angular/core';

import { HttpClient } from "@angular/common/http";

import { user } from 'src/user';
import { Observable } from 'rxjs';
import { messageC } from 'src/message';

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

  messages: messageC[] = [];
  users: user[];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.activeUser = "Testovy";
    this.activeRecipient = "Testovy1";
    this.message = ""; //this.users = [new user("Wielki Elektronik")];
    this.users = [];

    this.updateUsers();
    this.updateMessages();

    console.log("Inited, xdd....")
    setInterval(() => {
      this.updateMessages();
    }, 10000)
  }

  getUser(username = "Testovy1"): Observable<any> {
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
          if (u.username != this.activeUser)
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

    this.messages = []
    this.updateMessages();
  }

  selectUser(username: string): void {
    for (let i = 0; i < this.users.length; i++)
      if (this.users[i].username == username)
        this.activeUser = this.users[i].username;

    this.updateUsers();
    this.updateMessages();
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

  updateMessages() {
    this.messages = []

    this.getMessages(this.activeUser, this.activeRecipient).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let content = JSON.stringify(data[i].content).replace('"', '').replace('"', '');
        let m_date = JSON.stringify(data[i].m_date)

        let m = new messageC(this.activeUser, this.activeRecipient, content, m_date);
        this.messages.push(m)
        this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
      }
    },
      err =>
        console.error(`Error: ${err}`))

    this.getMessages(this.activeRecipient, this.activeUser).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        let content = JSON.stringify(data[i].content).replace('"', '').replace('"', '');
        let m_date = JSON.stringify(data[i].m_date)

        let m = new messageC(this.activeRecipient, this.activeUser, content, m_date);
        this.messages.push(m)
        this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
      }
    },
      err =>
        console.error(`Error: ${err}`))

    this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
  }

  onSendButtonClick(): void {
    this.sendMessage().subscribe(data => {
      console.log(data.res)
      this.updateMessages();
    },
      err =>
        console.error(`Error: ${err}`))
  }
}