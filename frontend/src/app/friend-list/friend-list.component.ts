import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { user } from "../../user";
import { HttpClient } from '@angular/common/http';
import { MessageUpdateService } from 'src/services/msgupdate.service';
import { Observable } from 'rxjs';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {
  host: string = "http://localhost:3000";
  activeUser: string = '';
  activeRecipient: string = '';
  friends: user[] = [];//this.users = [new user("Wielki Elektronik")];

  isMsgNeedToBeUpdated: boolean;

  constructor(private http: HttpClient,
    private msg: MessageUpdateService,
    private uS : UserService) { }

  ngOnInit(): void {
    console.log("FriendList component inited, xD...")
    this.updateFriendList();
    this.msg.currentState.subscribe(b => this.isMsgNeedToBeUpdated = b);
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.host}/users`)
  }

  updateFriendList(): void {
    if (this.activeUser !== '')
      return
    this.getUsers().subscribe({
      next: (data) => {
        this.friends = [];
        for (let i = 0; i < data.length; i++) {
          let u: user = new user(data[i].username);
          if (u.username != this.activeUser)
            this.friends.push(u)
        }
      },
      error: (err) => console.error(`Error: ${err} `),
      complete: () => console.log("Friend list updated, :D")
    })
  }

  selectRecipient(username: string): void {
    console.log(username != this.activeRecipient)
    console.log(`Active Recipient ${this.activeRecipient}`)
    for (let i = 0; i < this.friends.length; i++)
      if (username != this.activeRecipient && this.friends[i].username == username) {
        this.uS.setActiveRecipient(this.friends[i].username)
        this.msg.setUpdate(true);
        this.updateFriendList();
        break;
      }
  }
}
