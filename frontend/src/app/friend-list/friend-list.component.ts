import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { user } from "../../user";
import { HttpClient } from '@angular/common/http';
import { MessageUpdateService } from 'src/msgUpdate.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {
  host: string = "http://localhost:3000";
  activeUser: string = "";
  activeRecipient: string = "";
  users: user[];

  isMsgNeedToBeUpdated: boolean;

  @Output() selectRecipientEvent = new EventEmitter<string>();

  constructor(private http: HttpClient, private msgUpdate: MessageUpdateService) { }

  ngOnInit(): void {
    this.updateUsers();
    this.msgUpdate.currentState.subscribe(b => this.isMsgNeedToBeUpdated = b);
  }

  getUser(username : string): Observable<any> {
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
    this.updateUsers();

    this.selectRecipientEvent.emit(this.activeRecipient);
    this.msgUpdate.setUpdate(true);
  }
}
