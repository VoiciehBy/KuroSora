import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import {
  SENT_MESSAGE_TO_STRING,
  ACCOUNT_IS_NOT_ACTIVATED,
  MESSAGE_EMPTY_STRING
} from 'src/constants';
import { DbService } from 'src/services/db.service';
import { template } from 'src/template';

@Component({
  selector: 'app-msg-send',
  templateUrl: './msg-send.component.html',
  styleUrls: ['./msg-send.component.css']
})

export class MsgSendComponent implements OnInit {
  SENT_MESSAGE_TO_STRING: string = SENT_MESSAGE_TO_STRING;
  ACCOUNT_IS_NOT_ACTIVE: string = ACCOUNT_IS_NOT_ACTIVATED;
  MESSAGE_EMPTY_STRING: string = MESSAGE_EMPTY_STRING;

  templates: template[] = [];
  currentTemplateId: number = 0;

  activeUser: string = '';
  activeRecipient: string = '';
  msgTxt: string = '';
  errorTxt: string = '';

  isUserActivated: boolean = false;
  isLeftAligned: boolean = false;

  constructor(private uS: UserService, private db: DbService) { }

  ngOnInit(): void {
    console.log("Message Send component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username);
    this.uS.leftAlignedState.subscribe(b => this.isLeftAligned = b);
    this.isUserActivated = false;

    this.updateTemplates();
  }

  onRightButtonClick(event: any): boolean {
    return false;
  }

  updateTemplates() {
    this.db.getTemplates(this.activeUser).subscribe({
      next: (data: any) => {
        this.templates = [];
        if (data.length === 0) {
          console.log("User has no templates, :(...");
          return;
        }
        else {
          for (let i = 0; i < data.length; i++) {
            let t: template = new template(data[i].id,
              data[i].owner_id, data[i].content);
            this.templates.push(t);
          }
        }
      },
      error: (err: any) => console.error(`Error: ${err} `),
      complete: () => console.log("Template list updated, :D...")
    })
  }

  selectTemplate(t: template): void {
    this.currentTemplateId = t.id;
  }

  insertTemplate(): void {
    for (let i = 0; i < this.templates.length; i++) {
      if (this.templates[i].id == this.currentTemplateId) {
        this.msgTxt += ' ';
        this.msgTxt += this.templates[i].content;
      }
    }
  }

  sendTemplate(): void {
    this.insertTemplate();
    this.onSendButtonClick();
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
      error: (err) => console.error(`Error: ${err}`),
      complete: () => {
        if (this.isUserActivated && this.msgTxt.length != 0)
          this.db.sendMessage(this.activeUser, this.activeRecipient, this.msgTxt).subscribe({
            error: (err) => console.error(`Error: ${err} `),
            complete: () => console.log("Message send completed...")
          })
        else if (this.isUserActivated == false)
          this.errorTxt = this.ACCOUNT_IS_NOT_ACTIVE;
        else if (this.msgTxt.length == 0)
          this.errorTxt = MESSAGE_EMPTY_STRING;
        setTimeout(() => { this.errorTxt = '' }, 3000);
        this.msgTxt = '';
      }
    })
  }
}