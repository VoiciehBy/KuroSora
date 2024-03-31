import { Component, OnInit } from '@angular/core';
import { user } from "../../user";
import { UserService } from 'src/services/user.service';
import {
  HOSTNAME,
  USERS_STRING
} from "../../constants";
import { DbService } from 'src/services/db.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})

export class FriendListComponent implements OnInit {
  host: string = HOSTNAME;
  USERS_STRING: string = USERS_STRING;
  activeUser: string = '';
  activeRecipient: string = '';
  friends: user[] = [];//this.users = [new user("Wielki Elektronik")];

  isMsgNeedToBeUpdated: boolean;

  constructor(private uS: UserService,
    private db: DbService) { }

  ngOnInit(): void {
    console.log("Friend list component inited, xD...")
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username);

    if (this.activeUser != '')
      this.updateFriendList();

    this.uS.messageUpdateState.subscribe(b => this.isMsgNeedToBeUpdated = b);
  }

  updateFriendList(): void {
    this.db.getUsers().subscribe({
      next: (data: any) => {
        this.friends = [];
        for (let i = 0; i < data.length; i++) {
          let u: user = new user(data[i].username);
          if (u.username != this.activeUser)
            this.friends.push(u);
        }
      },
      error: (err: any) => console.error(`Error: ${err} `),
      complete: () => console.log("Friend list updated, :D")
    })
  }

  selectRecipient(username: string): void {
    for (let i = 0; i < this.friends.length; i++)
      if (username != this.activeRecipient && this.friends[i].username == username) {
        this.uS.setActiveRecipient(this.friends[i].username);
        this.uS.setMsgUpdate(true);
        this.updateFriendList();
        break;
      }
  }
}
