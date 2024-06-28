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

  @Input() isFriendListNeedToBeUpdated: boolean;

  isCtxMenuVisible: boolean = false;
  isSpinnerVisible: boolean = false;
  friendUpdateInterval: any;

  constructor(private uS: UserService, private db: DbService) { }

  ngOnInit(): void {
    console.log("Friend list component inited, xD...");
    this.uS.activeUserState.subscribe(u => this.activeUser = u);
    this.uS.activeRecipientState.subscribe(u => this.activeRecipient = u);
    this.uS.friendUpdateState.subscribe(b => this.isFriendListNeedToBeUpdated = b);

    this.friendUpdateInterval = setInterval(() => {
      if (this.activeUser != '' && this.isFriendListNeedToBeUpdated) {
        this.friends = [];
        this.updateFriendList();
        this.isCtxMenuVisible = false;
        this.isSpinnerVisible = true;
        setTimeout(() => { this.isSpinnerVisible = false; }, 2000);
        this.uS.setFriendListUpdate(false);
      }
    }, FRIEND_LIST_UPDATE_INTERVAL);
  }

  showError(err: any, txt: string, duration: number) {
    console.error(`Error: ${err} `);
    this.errorTxt = txt;
    setTimeout(() => { this.errorTxt = '' }, duration);
  }

  updateFriendList(): void {
    this.db.getFriends(this.activeUser).subscribe({
      next: (data: any) => {
        this.friends = [];
        if (data.length === 0) {
          console.log("User has no friends, :(...");
          this.uS.setActiveRecipient('');
        }
        else {
          for (let c of data) {
            let u: user = new user(c.username);
            if (u.username != this.activeUser)
              this.friends.push(u);
          }
        }
      },
      error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
      complete: () => {
        console.log("Friend list updated, :D...");
        if (this.friends.length != 0)
          this.uS.setActiveRecipient(this.friends[0].username);
        else
          this.uS.setActiveRecipient('');
        this.uS.setFriendListUpdate(false);
      }
    })
  }

  selectRecipient(username: string): void {
    for (let f of this.friends)
      if (username != this.activeRecipient && f.username === username) {
        this.uS.setActiveRecipient(f.username);
        this.uS.setMsgUpdate(true);
        return;
      }
  }

  onRightButtonClick(event: any): boolean {
    if (event.which === 3) {
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
