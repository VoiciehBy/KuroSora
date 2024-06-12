import { Component, OnInit, Input } from '@angular/core';
import { DbService } from 'src/services/db.service';
import { UserService } from 'src/services/user.service';
import { user } from 'src/user';
import { FRIEND_LIST_UPDATE_INTERVAL } from 'src/constants';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
})

export class FriendListComponent implements OnInit {
  activeUser: string = '';
  activeRecipient: string = '';
  ctxMenuUsername: string = '';
  errorTxt: string = '';
  friends: user[] = [];
  isMsgNeedToBeUpdated: boolean = false;
  @Input() isFriendListNeedToBeUpdated: boolean;
  isCtxMenuVisible: boolean = false;
  isSpinnerVisible: boolean = false;
  friendUpdateInterval: any;

  constructor(private uS: UserService, private db: DbService) { }

  ngOnInit(): void {
    console.log("Friend list component inited, xD...")
    this.uS.activeUserState.subscribe(u => this.activeUser = u);
    this.uS.activeRecipientState.subscribe(u => this.activeRecipient = u);
    this.uS.friendUpdateState.subscribe(b => this.isFriendListNeedToBeUpdated = b);
    this.uS.messageUpdateState.subscribe(b => this.isMsgNeedToBeUpdated = b);

    this.friendUpdateInterval = setInterval(() => {
      if (this.activeUser != '' && this.isFriendListNeedToBeUpdated) {
        this.friends = [];
        this.updateFriendList();
        this.isCtxMenuVisible = false;
        this.isSpinnerVisible = true;
      }
    }, FRIEND_LIST_UPDATE_INTERVAL);
  }

  updateFriendList(): void {
    this.db.getFriends(this.activeUser).subscribe({
      next: (data: any) => {
        this.friends = [];
        if (data.length === 0) {
          console.log("User has no friends, :(...");
          this.uS.setActiveRecipient('');
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
        else
          this.uS.setActiveRecipient('');
        this.uS.setFriendListUpdate(false);
      }
    })
  }

  selectRecipient(username: string): void {
    for (let i = 0; i < this.friends.length; i++)
      if (username != this.activeRecipient
        && this.friends[i].username === username) {
        this.uS.setActiveRecipient(this.friends[i].username);
        this.uS.setMsgUpdate(true);
        return;
      }
  }

  onRightButtonClick(event: any): boolean {
    if (event.which === 3) { //if rmb was clicked
      this.isCtxMenuVisible = true;
      this.ctxMenuUsername = event.target.innerHTML;
    }
    else {
      this.isCtxMenuVisible = false;
      this.ctxMenuUsername = '';
    }
    return false;
  }

  ngOnDestroy(): void {
    clearInterval(this.friendUpdateInterval);
  }
}
