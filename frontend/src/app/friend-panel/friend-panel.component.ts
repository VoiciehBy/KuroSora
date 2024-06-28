import { Component, OnInit } from '@angular/core';
import { user } from "../../user";
import { UserService } from 'src/services/user.service';
import {
  FRIENDS_STRING,
  ADD_FRIEND_STRING
} from "../../constants";
import { DbService } from 'src/services/db.service';

@Component({
  selector: 'app-friend-panel',
  templateUrl: './friend-panel.component.html',
  styleUrls: ['./friend-panel.component.css']
})

export class FriendPanelComponent implements OnInit {
  FRIENDS_STRING: string = FRIENDS_STRING;
  ADD_FRIEND_STRING: string = ADD_FRIEND_STRING;

  activeUser: string = '';
  activeRecipient: string = '';
  ctxMenuUsername: string = '';
  newFriendUsername: string = '';
  errorTxt: string = '';

  friends: user[] = [];

  isActiveUserActivated: boolean = false;
  isFriendListNeedToBeUpdated: boolean = true;

  constructor(private uS: UserService, private db: DbService) { }

  ngOnInit(): void {
    console.log("Friend list component inited, xD...");
    this.uS.activeUserState.subscribe(u => this.activeUser = u);
    this.uS.activeRecipientState.subscribe(u => this.activeRecipient = u);
    this.uS.activeUserActivationState.subscribe(b => this.isActiveUserActivated = b);
    this.uS.friendUpdateState.subscribe(b => this.isFriendListNeedToBeUpdated = b);
  }

  showError(err: any, txt: string, duration: number) {
    console.error(`Error: ${err} `);
    this.errorTxt = txt;
    setTimeout(() => { this.errorTxt = '' }, duration);
  }

  onAddFriendButtonClick(): void {
    this.uS.setMsgUpdate(false);

    if (!this.isActiveUserActivated) {
      console.error("The account is not activated...");
      this.showError("The account is not activated...", "The account is not activated...", 3000);
      return;
    }

    this.db.getUser(this.newFriendUsername).subscribe({
      next: (data: any) => { },
      error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
      complete: () => {
        let isAlreadyFriends = false;
        this.db.getFriendship(this.activeUser, this.newFriendUsername).subscribe({
          next: (data: any) => {
            if (JSON.stringify(data) != '{}') {
              console.log("Frienship already exist, xD...");
              isAlreadyFriends = true;
            }
          },
          error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
          complete: () => {
            if (!isAlreadyFriends) {
              let isFriendRequestAlreadySent = false;
              this.db.getNotification(this.activeUser, "FRIEND_REQUEST").subscribe({
                next: (data: any) => {
                  if (JSON.stringify(data) != '{}') {
                    console.log("Friend request already exist, xD...");
                    isFriendRequestAlreadySent = true;
                  }
                },
                error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
                complete: () => {
                  if (!isFriendRequestAlreadySent)
                    this.db.sendNotification(this.activeUser, this.newFriendUsername).subscribe({
                      next: (data: any) => { },
                      error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
                      complete: () => {
                        console.log("Notification was added successfully, :D");
                        this.uS.setMsgUpdate(true);
                      }
                    })
                }
              })
            }
          }
        })
      },
    })
  }
}