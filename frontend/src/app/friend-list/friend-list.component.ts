import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { user } from "../../user";
import { HttpClient } from '@angular/common/http';
import { MessageUpdateService } from 'src/services/msgupdate.service';
import { Observable } from 'rxjs';
import { ActiveUserService } from 'src/services/activeuser.service';
import { ActiveRecipientService } from 'src/services/activeRecipient.service';

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
    private aUU: ActiveUserService,
    private aR: ActiveRecipientService) { }

  ngOnInit(): void {
    this.updateFriendList();
    this.msg.currentState.subscribe(b => this.isMsgNeedToBeUpdated = b);
    this.aUU.currentState.subscribe(username => this.activeUser = username);
    this.aR.currentState.subscribe(username => this.activeRecipient = username);
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
          if (u.username != "Testovy" && u.username != "Testovy1"
            && u.username != this.activeUser)
            this.friends.push(u)
        }
      },
      error: (err) => console.error(`Error: ${err} `),
      complete: () => console.log("Friend list updated, :D")
    })
  }

  selectRecipient(username: string): void {
    for (let i = 0; i < this.friends.length; i++)
      if (this.friends[i].username == username) {
        this.activeRecipient = this.friends[i].username;
        this.aR.setActiveRecipient(this.activeRecipient)
        break;
      }
    this.updateFriendList();
    this.msg.setUpdate(true);
  }
}
