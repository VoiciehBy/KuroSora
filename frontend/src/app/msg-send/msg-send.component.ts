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

  constructor(private uS: UserService, private db: DbService) { }

  ngOnInit(): void {
    console.log("Message Send component inited, xdd....");
    this.uS.activeUserState.subscribe(u => this.activeUser = u);
    this.uS.activeRecipientState.subscribe(u => this.activeRecipient = u);
    this.uS.activeUserActivationState.subscribe(b => this.isUserActivated = b);
    this.templates = [];
    this.updateTemplates();
  }

  showError(err: any, txt: string, duration: number) {
    console.error(`Error: ${err} `);
    this.errorTxt = txt;
    setTimeout(() => { this.errorTxt = '' }, duration);
  }

  onRightButtonClick(event: any): boolean {
    return false;
  }

  updateTemplates() {
    this.db.getTemplates(this.activeUser).subscribe({
      next: (data: any) => {
        if (data.length === 0)
          console.log(`User '${this.activeUser}' has no templates, :(...`);
        else {
          for (let i = 0; i < data.length; i++) {
            let t: template = new template(data[i].id,
              data[i].owner_id, data[i].content);
            this.templates.push(t);
          }
        }
      },
      error: (err: any) => this.showError(err, "BAD PLACEHOLDER", 3000),
      complete: () => console.log("Template list updated, :D...")
    })
  }

  selectTemplate(t: template): void {
    this.currentTemplateId = t.id;
  }

  insertTemplate(): void {
    for (let t of this.templates)
      if (t.id == this.currentTemplateId)
        this.msgTxt = this.msgTxt + ' ' + t.content;
  }

  sendTemplate(): void {
    this.insertTemplate();
    this.onSendButtonClick();
  }

  addEmoji(x: any): void {
    this.msgTxt += x.emoji.native;
  }

  onSendButtonClick(): void {
    if (this.isUserActivated && this.msgTxt.length != 0)
      this.db.sendMessage(this.activeUser, this.activeRecipient, this.msgTxt).subscribe({
        next: (data: any) => { },
        error: (err) => this.showError(err, "BAD PLACEHOLDER", 3000),
        complete: () => console.log("Message send completed...")
      })
    else if (!this.isUserActivated)
      this.showError(this.ACCOUNT_IS_NOT_ACTIVE, this.ACCOUNT_IS_NOT_ACTIVE, 3000);
    else if (this.msgTxt.length == 0)
      this.showError(MESSAGE_EMPTY_STRING, MESSAGE_EMPTY_STRING, 3000);
    this.msgTxt = '';
  }
}