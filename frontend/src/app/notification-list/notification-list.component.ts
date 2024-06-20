import { Component, OnInit } from '@angular/core';
import { notification } from "../../notification";
import {
  NOTIFICATIONS_STRING,
  NO_NOTIFICATION_STRING,
  FRIEND_REQUEST_STRING,
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

  notifications: notification[] = [];
  isNotificationsNeedToBeUpdated: boolean = false;
  notificationListUpdate: any;

  constructor(private uS: UserService, private db: DbService) { }

  ngOnInit(): void {
    console.log("Notfication list component inited, xD...")
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username);
    this.uS.notificationUpdateState.subscribe(b => this.isNotificationsNeedToBeUpdated = b);
    this.uS.setNotificationListUpdate(true);

    this.notificationListUpdate = setInterval(() => {
      if (this.activeUser != '' && this.isNotificationsNeedToBeUpdated) {
        this.notifications = [];
        this.updateNotificationList();
      }
    }, NOTIFICATION_LIST_UPDATE_INTERVAL)
  }

  updateNotificationList(): void {
    this.db.getNotifications(this.activeUser).subscribe({
      next: (data: any) => {
        this.notifications = [];
        for (let i = 0; i < data.length; i++) {
          this.db.getUserById(data[i].user_1_id).subscribe({ //TO DO REFACTOR
            next: (result) => {
              let n: notification = new notification(data[i].id, result[0].username, this.activeUser);
              if (n.from != this.activeUser)
                this.notifications.push(n);
            },
            error: (err: any) => console.error(`Error: ${err} `),
            complete: () => console.log("Notification list updated successfully, :D...")
          });
        }
      },
      error: (err: any) => console.error(`Error: ${err} `),
      complete: () => {
        console.log("Notification list updated, :D")
        this.uS.setNotificationListUpdate(false);
      }
    })
  }

  onAcceptButtonClicked(i: number): void {
    this.db.addFriend(this.notifications[i].from, this.activeUser).subscribe({
      error: (err: any) => console.error(err),
      complete: () => {
        console.log("Friend request successfull...");
        this.db.delNotificationById(this.notifications[0].id).subscribe({
          error: (err: any) => console.error(`Error: ${err}`),
          complete: () => {
            console.log("Deleting friend request successfull...");
            this.uS.setNotificationListUpdate(true);
          }
        })
      }
    })
  }

  onDeclineButtonClicked(i: number): void {
    this.db.delNotificationById(this.notifications[0].id).subscribe({
      error: (err: any) => console.error(`Error: ${err}`),
      complete: () => console.log("Deleting friend request successfull...")
    })
  }

  ngOnDestroy(): void {
    clearInterval(this.notificationListUpdate);
  }
}