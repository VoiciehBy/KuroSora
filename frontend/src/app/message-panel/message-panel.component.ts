import { Component, OnInit } from '@angular/core';
import { message } from 'src/message';
import { UserService } from 'src/services/user.service';
import { DbService } from 'src/services/db.service';
import {
  SHOW_SPINNER_INTERVAL,
  MESSAGE_LIST_UPDATE_INTERVAL
} from 'src/constants';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.css']
})

export class MessagePanelComponent implements OnInit {
  activeUser: string = '';
  activeRecipient: string = '';
  messages: message[] = [];
  tmp: message[] = [];
  
  isMsgNeedToBeUpdated: boolean = false;
  isSpinnerVisible: boolean = false;
  isLeftAligned: boolean = false;
  isSpinnerVisibleInterval: any;
  messageUpdateInterval: any;

  constructor(private uS: UserService, private db: DbService) { }

  ngOnInit(): void {
    console.log("Message Panel component inited, xdd....");
    this.uS.activeUserState.subscribe(u => this.activeUser = u);
    this.uS.activeRecipientState.subscribe(u => this.activeRecipient = u);
    this.uS.messageUpdateState.subscribe(b => this.isMsgNeedToBeUpdated = b);
    this.uS.leftAlignedState.subscribe(b => this.isLeftAligned = b);
    this.messages = [];

    this.isSpinnerVisibleInterval = setInterval(() => {
      if (this.activeUser != '')
        this.uS.setMsgUpdate(true);
      if (this.activeRecipient === '') {
        this.messages = [];
        this.tmp = [];
      }
      this.isSpinnerVisible = true;
    }, SHOW_SPINNER_INTERVAL);

    this.messageUpdateInterval = setInterval(() => {
      if (this.activeUser != '')
        this.updateMessages()
    }, MESSAGE_LIST_UPDATE_INTERVAL);
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
      (this.activeUser === '' || this.activeRecipient === '')) {
      this.isSpinnerVisible = false;
      return;
    }

    this.isSpinnerVisible = true;
    this.addMessagesToTmp(this.activeUser, this.activeRecipient)
    this.addMessagesToTmp(this.activeRecipient, this.activeUser);
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

    this.tmp = structuredClone(this.messages);
    this.messages = [];

    for (let m of this.tmp)
      if (
        (
          m.sender === this.activeUser
          &&
          m.recipient === this.activeRecipient
        )
        ||
        (
          m.sender === this.activeRecipient
          &&
          m.recipient === this.activeUser
        )
      )
        this.messages.push(m);
    this.isSpinnerVisible = false;
    this.uS.setMsgUpdate(false);
  }

  ngOnDestroy(): void {
    clearInterval(this.isSpinnerVisibleInterval);
    clearInterval(this.messageUpdateInterval);
  }
}