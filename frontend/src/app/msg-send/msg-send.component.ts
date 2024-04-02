import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { SENT_MESSAGE_TO_STRING } from 'src/constants';
import { DbService } from 'src/services/db.service';

@Component({
  selector: 'app-msg-send',
  templateUrl: './msg-send.component.html',
  styleUrls: ['./msg-send.component.css']
})

export class MsgSendComponent implements OnInit {
  SENT_MESSAGE_TO_STRING: string = SENT_MESSAGE_TO_STRING;
  activeUser: string;
  activeRecipient: string;
  msgTxt: string = '';

  constructor(private uS: UserService,
    private db: DbService) { }

  ngOnInit(): void {
    console.log("Message Panel component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username);
  }

  sendMessage(): Observable<any> {
    return this.db.sendMessage(this.activeUser, this.activeRecipient, this.msgTxt);
  }

  onSendButtonClick(): void {
    this.sendMessage().subscribe({
      next: (data) => console.log(data.res),
      error: (err) => console.error(`Error: ${err} `),
      complete: () => {
        console.log("Message send completed...");
      }
    })
  }
}
