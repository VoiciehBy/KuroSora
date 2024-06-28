import { Component, OnInit } from '@angular/core';
import { notification } from "../../notification";
import {
  NOTIFICATIONS_STRING, NO_NOTIFICATION_STRING, FRIEND_REQUEST_STRING,
  NOTIFICATION_LIST_UPDATE_INTERVAL
} from 'src/constants';
import { UserService } from 'src/services/user.service';
import { DbService } from 'src/services/db.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})

export class NotificationListComponent implements OnInit {
  NOTIFICATIONS_STRING: string = NOTIFICATIONS_STRING;
  NO_NOTIFICATION_STRING: string = NO_NOTIFICATION_STRING;
  FRIEND_REQUEST_STRING: string = FRIEND_REQUEST_STRING;
  activeUser: string = '';
  activeRecipient: string = '';
  errorTxt: string = '';
  notifications: notification[] = [];
  isNotificationsNeedToBeUpdated: boolean = false;
  notificationListUpdate: any;

  constructor(private uS: UserService, private db: DbService) { }

  ngOnInit(): void {
    console.log("Notfication list component inited, xD...");
    this.uS.activeUserState.subscribe(u => this.activeUser = u);
    this.uS.activeRecipientState.subscribe(u => this.activeRecipient = u);
    this.uS.notificationUpdateState.subscribe(b => this.isNotificationsNeedToBeUpdated = b);
    this.uS.setNotificationListUpdate(true);
    this.notificationListUpdate = setInterval(() => {
      if (this.activeUser != '' && this.isNotificationsNeedToBeUpdated) {
        this.notifications = [];
        this.updateNotificationList();
      }
    }, NOTIFICATION_LIST_UPDATE_INTERVAL)
  }

  showError(err: any, txt: string, duration: number) {
    console.error(`Error: ${err} `);
    this.errorTxt = txt;
    setTimeout(() => { this.errorTxt = '' }, duration);
  }

  updateNotificationList(): void {
    this.db.getNotifications(this.activeUser).subscribe({
      next: (data: any) => {
        this.notifications = [];
        for (let c of data)
          this.db.getUserById(c.user_1_id).subscribe({
            next: (result) => {
              let n: notification = new notification(c.id, result[0].username, this.activeUser);
              if (n.from != this.activeUser)
                this.notifications.push(n);
            },
            error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
            complete: () => console.log("Notification list updated successfully, :D...")
          });
      },
      error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
      complete: () => {
        console.log("Notification list updated, :D")
        this.uS.setNotificationListUpdate(false);
      }
    })
  }

  deleteNotificationById(id: number): void {
    this.db.delNotificationById(id).subscribe({
      next: (data: any) => { },
      error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
      complete: () => {
        console.log("Deleting friend request successfull...");
        this.uS.setNotificationListUpdate(true);
      }
    })
  }

  onAcceptButtonClicked(i: number): void {
    this.db.addFriend(this.notifications[i].from, this.activeUser).subscribe({
      next: (data: any) => { },
      error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
      complete: () => {
        console.log("Accepting friend request was successfull...");
        this.deleteNotificationById(this.notifications[i].id);
      }
    })
  }

  onDeclineButtonClicked(i: number): void {
    this.deleteNotificationById(this.notifications[i].id);
  }

  ngOnDestroy(): void {
    clearInterval(this.notificationListUpdate);
  }
}