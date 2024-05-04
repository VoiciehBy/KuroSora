import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/services/user.service';
import {
  SENT_MESSAGE_TO_STRING,
  ACCOUNT_IS_NOT_ACTIVATED
} from 'src/constants';
import { DbService } from 'src/services/db.service';

@Component({
  selector: 'app-msg-send',
  templateUrl: './msg-send.component.html',
  styleUrls: ['./msg-send.component.css']
})

export class MsgSendComponent implements OnInit {
  SENT_MESSAGE_TO_STRING: string = SENT_MESSAGE_TO_STRING;
  ACCOUNT_IS_NOT_ACTIVE: string = ACCOUNT_IS_NOT_ACTIVATED;
  activeUser: string;
  activeRecipient: string;
  msgTxt: string = '';
  errorTxt: string = ''

  isUserActivated: boolean = false;

  constructor(private uS: UserService,
    private db: DbService) { }

  ngOnInit(): void {
    console.log("Message Send component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username);
    this.isUserActivated = false;
  }

  sendMessage(): Observable<any> {
    return this.db.sendMessage(this.activeUser, this.activeRecipient, this.msgTxt);
  }

  addEmoji(x: any): void {
    this.msgTxt += x.emoji.native;
  }

  onSendButtonClick(): void {
    this.db.getUser(this.activeUser).subscribe({
      next: (data) => {
        if (data)
          this.isUserActivated = (data[0].activated) === 'T' ? true : false;
      },
      error: (err) => console.error(`Error: ${err} `),
      complete: () => {
        if (this.isUserActivated && this.msgTxt.length != 0)
          this.sendMessage().subscribe({
            next: (data) => console.log(data),
            error: (err) => console.error(`Error: ${err} `),
            complete: () => {
              console.log("Message send completed...");
            }
          })
        else {
          if (this.isUserActivated == false)
            this.errorTxt = this.ACCOUNT_IS_NOT_ACTIVE;
          else if (this.msgTxt.length == 0)//REFACTOR TODO
            this.errorTxt = "PLACEHOLDER"
          setTimeout(() => { this.errorTxt = '' }, 3000);
        }
        this.msgTxt = '';
      }
    })
  }
}