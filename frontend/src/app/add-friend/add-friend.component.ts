import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  ADD_FRIEND_STRING
} from 'src/constants';
import { DbService } from 'src/services/db.service';
import { UserService } from 'src/services/user.service';


@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.css']
})

export class AddFriendComponent implements OnInit {
  ADD_FRIEND_STRING: string = ADD_FRIEND_STRING;
  activeUser: string;
  errorTxt: string = '';
  username: string = '';

  constructor(private uS: UserService, private db: DbService, private router: Router) { }

  ngOnInit(): void {
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
  }

  onFindButtonClick(): void {
    this.db.getUser(this.username).subscribe({
      next: () => { },
      error: (err: any) => {
        console.error(`Error: ${err} `);
        this.errorTxt = "BAD PLACEHOLDER";
        setTimeout(() => { this.errorTxt = '' }, 3000);
      },
      complete: () => {
        this.db.getFriendship(this.activeUser, this.username).subscribe({
          next: (data) => { if (data.length != 0) return; },
          error: (err: any) => console.error(`Error: ${err} `),
          complete: () => {
            console.log("XD, :D");
            this.db.sendNotification(this.activeUser, this.username).subscribe({
              next: () => { },
              error: (err: any) => console.error(`Error: ${err} `),
              complete: () => {
                console.log("Notification was added successfully, :D")
                this.router.navigate([""]);
              }
            })
          }
        })
      },
    })
  }
}
