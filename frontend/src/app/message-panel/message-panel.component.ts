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

  constructor(private uS: UserService,
    private db: DbService) { }

  ngOnInit(): void {
    console.log("Message Panel component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username);
    this.uS.messageUpdateState.subscribe(b => this.isMsgNeedToBeUpdated = b);
    this.messages = []

    setInterval(() => {
      this.updateMessages()
      this.uS.setMsgUpdate(true)
    }, 3500);
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
      (this.activeUser == '' || this.activeRecipient == ''))
      return;

    this.addMessagesToTmp(this.activeUser, this.activeRecipient)
    this.addMessagesToTmp(this.activeRecipient, this.activeUser)
    this.tmp = this.tmp.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));

    for (let i = 0; i < this.tmp.length; i++)
      if (message.includes(this.tmp[i].id, this.messages) === false)
        this.messages.push(this.tmp[i])
    this.tmp = []

    for (let m of this.messages)
      m.timeSince = message.updateTimeSince(m.m_date)

    this.tmp = structuredClone(this.messages)
    this.messages = []

    for (let m of this.tmp)
      if (
        (m.sender_id === this.activeUser && m.recipient_id === this.activeRecipient)
        ||
        (m.sender_id === this.activeRecipient && m.recipient_id === this.activeUser)
      )
        this.messages.push(m)
    this.uS.setMsgUpdate(false);
  }
}
