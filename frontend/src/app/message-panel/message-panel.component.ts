
import { Component, OnInit } from '@angular/core';
import { messageC } from 'src/messageC';
import { Observable } from 'rxjs';
import { UserService } from 'src/services/user.service';
import { HOSTNAME, SENT_MESSAGE_TO_STRING } from 'src/constants';
import { DbService } from 'src/services/db.service';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.css']
})
export class MessagePanelComponent implements OnInit {
  host: string = HOSTNAME;
  SENT_MESSAGE_TO_STRING: string = SENT_MESSAGE_TO_STRING;
  activeUser: string;
  activeRecipient: string;
  isMsgNeedToBeUpdated: boolean = false;
  message: string = '';
  messages: messageC[];

  constructor(private db: DbService,
    private uS: UserService) { }

  ngOnInit(): void {
    console.log("Message Panel component inited, xdd....")
    this.uS.activeUserState.subscribe(username => this.activeUser = username)
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username)
    this.uS.messageUpdateState.subscribe(b => this.isMsgNeedToBeUpdated = b);

    setInterval(() => {
      this.updateMessages();
    }, 1000)

    setInterval(() => {
      this.uS.setMsgUpdate(true)
    }, 5000)
  }

  sendMessage(): Observable<any> {
    return this.db.sendMessage(this.activeUser, this.activeRecipient, this.message)
  }

  updateMessages() {
    if (this.isMsgNeedToBeUpdated == false ||
      (this.activeUser == '' || this.activeRecipient == ''))
      return;

    this.messages = []

    this.db.getMessages(this.activeUser, this.activeRecipient).subscribe({
      next: (data) => {
        for (let i = 0; i < data.length; i++) {
          let content = data[i].content.replace('"', '').replace('"', '')
          let m = new messageC(this.activeUser, this.activeRecipient, content, data[i].m_date);
          this.messages.push(m)
          this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
        }
      },
      error: (err) => console.error(`Error: ${err} `),
      complete: () => console.log(`Getting messages from ${this.activeUser} to ${this.activeRecipient}...`)
    })

    this.db.getMessages(this.activeRecipient, this.activeUser).subscribe({
      next: (data) => {
        for (let i = 0; i < data.length; i++) {
          let content = data[i].content.replace('"', '').replace('"', '');
          let m = new messageC(this.activeRecipient, this.activeUser, content, data[i].m_date);
          this.messages.push(m)
          this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
        }
      },
      error: (err) => console.error(`Error: ${err} `),
      complete: () => console.log(`Getting messages from ${this.activeRecipient} to ${this.activeUser}...`)
    })

    this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
    this.uS.setMsgUpdate(false);
  }

  onSendButtonClick(): void {
    this.sendMessage().subscribe({
      next: (data) => console.log(data.res),
      error: (err) => console.error(`Error: ${err} `),
      complete: () => {
        console.log("Message send completed...")
        this.uS.setMsgUpdate(true);
        this.updateMessages();
      }
    })
  }

  onUpdateButtonClick(): void {
    this.uS.setMsgUpdate(true);
  }
}
