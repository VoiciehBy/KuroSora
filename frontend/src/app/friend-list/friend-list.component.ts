import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/services/db.service';
import { UserService } from 'src/services/user.service';
import { user } from 'src/user';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})
export class FriendListComponent implements OnInit {
  activeUser: string = '';
  activeRecipient: string = '';
  friends: user[] = [];
  isMsgNeedToBeUpdated: boolean = false;
  isFriendListNeedToBeUpdated: boolean = true;
  ctxMenuVisible: boolean = false;
  ctxMenuUsername: string = '';

  errorTxt: string = '';
  showSpinner: boolean = false;

  constructor(private uS: UserService,
    private db: DbService) { }

  ngOnInit(): void {
    console.log("Friend list component inited, xD...")
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username);
    this.uS.friendUpdateState.subscribe(b => this.isFriendListNeedToBeUpdated = b);
    this.uS.messageUpdateState.subscribe(b => this.isMsgNeedToBeUpdated = b);

    setInterval(() => {
      if (this.activeUser != '' && this.isFriendListNeedToBeUpdated) {
        this.updateFriendList();
        this.ctxMenuVisible = false;
        this.showSpinner = true;
      }
    }, 3200);
  }

  updateFriendList(): void {
    this.db.getFriends(this.activeUser).subscribe({
      next: (data: any) => {
        this.friends = [];
        if (data.length === 0) {
          console.log("User has no friends, :(...");
          return;
        }
        else {
          for (let i = 0; i < data.length; i++) {
            let u: user = new user(data[i].username);
            if (u.username != this.activeUser)
              this.friends.push(u);
          }
        }
      },
      error: (err: any) => console.error(`Error: ${err} `),
      complete: () => {
        console.log("Friend list updated, :D...")
        if (this.friends.length != 0)
          this.uS.setActiveRecipient(this.friends[0].username);
        this.uS.setFriendListUpdate(false);
      }
    })
  }

  selectRecipient(username: string): void {
    for (let i = 0; i < this.friends.length; i++)
      if (username != this.activeRecipient && this.friends[i].username === username) {
        this.uS.setActiveRecipient(this.friends[i].username);
        this.uS.setMsgUpdate(true);
        return;
      }
  }

  onRightButtonClick(event: any): boolean {
    if (event.which === 3) { //if rmb was clicked
      this.ctxMenuVisible = true;
      this.ctxMenuUsername = event.target.innerHTML;
    }
    else {
      this.ctxMenuVisible = false;
      this.ctxMenuUsername = '';
    }
    return false;
  }
}
