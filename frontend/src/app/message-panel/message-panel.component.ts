import { Component, OnInit } from '@angular/core';
import { message } from 'src/message';
import { UserService } from 'src/services/user.service';
import { DbService } from 'src/services/db.service';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.css']
})

export class MessagePanelComponent implements OnInit {
  activeUser: string;
  activeRecipient: string;
  msgTxt: string = '';
  isMsgNeedToBeUpdated: boolean = false;
  messages: message[] = [];
  tmp: message[] = [];

  showSpinner: boolean = false;

  constructor(private uS: UserService,
    private db: DbService) { }

  ngOnInit(): void {
    console.log("Message Panel component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username);
    this.uS.messageUpdateState.subscribe(b => this.isMsgNeedToBeUpdated = b);
    this.messages = [];

    setInterval(() => {
      this.uS.setMsgUpdate(true)
      this.showSpinner = true;
    }, 1500);

    setInterval(() => {
      this.updateMessages()
    }, 1000);
  }

  addMessagesToTmp(A: string, B: string) {
    this.db.getMessages(A, B).subscribe({
      next: (data) => {
        for (let i = 0; i < data.length; i++) {
          let content = data[i].content.replace('"', '').replace('"', '');
          let m = new message(data[i].id, A, B, content, data[i].m_date);
          this.tmp.push(m);
        }
      },
      error: (err) => console.error(`Error: ${err} `),
      complete: () => {
        console.log(`Getting messages from ${A} to ${B}...`)
        this.tmp = this.tmp.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
      }
    })
  }

  updateMessages() {
    if (this.isMsgNeedToBeUpdated == false ||
      (this.activeUser == '' || this.activeRecipient == '')) {
      this.showSpinner = false;
      return;
    }

    this.showSpinner = true;
    this.addMessagesToTmp(this.activeUser, this.activeRecipient)
    this.addMessagesToTmp(this.activeRecipient, this.activeUser)
    this.tmp = this.tmp.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));

    for (let i = 0; i < this.tmp.length; i++)
      if (message.includes(this.tmp[i].id, this.messages) === false)
        this.messages.push(this.tmp[i]);
    this.tmp = [];

    for (let m of this.messages) {
      m.timeSince = message.updateTimeSince(m.m_date)
      if (m.timeSince == m.m_date.slice(0, 10))
        m.olderThan8Hours = true;
    }

    this.tmp = structuredClone(this.messages)
    this.messages = []

    for (let m of this.tmp)
      if (
        (m.sender === this.activeUser && m.recipient === this.activeRecipient)
        ||
        (m.sender === this.activeRecipient && m.recipient === this.activeUser)
      )
        this.messages.push(m)
    this.showSpinner = false;
    this.uS.setMsgUpdate(false);
  }
}