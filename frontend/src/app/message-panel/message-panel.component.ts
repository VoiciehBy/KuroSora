
import { Component, OnInit, Input } from '@angular/core';
import { messageC } from 'src/message';
import { HttpClient } from '@angular/common/http';
import { MessageUpdateService } from 'src/services/msgupdate.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.css']
})
export class MessagePanelComponent implements OnInit {
  host: string = "http://localhost:3000";

  @Input() activeUser: string;
  @Input() activeRecipient: string;

  isMsgNeedToBeUpdated: boolean = false;
  message: string = '';
  messages: messageC[];

  constructor(private http: HttpClient, private msgUpdate: MessageUpdateService) { }

  ngOnInit(): void {
    this.updateMessages()

    setInterval(() => {
      this.updateMessages();
    }, 1000)
    this.msgUpdate.currentState.subscribe(b => this.isMsgNeedToBeUpdated = b);
  }

  sendMessage(): Observable<any> {
    return this.http.put(`${this.host}/message`,
      {
        "sender": this.activeUser,
        "recipient": this.activeRecipient,
        "content": this.message
      })
  }

  getMessages(sender: string = "Testovy", recipient: string = "Testovy1"): Observable<any> {
    return this.http.get(`${this.host}/user_messages?sender=${sender}&recipient=${recipient}`)
  }

  updateMessages() {
    if (this.isMsgNeedToBeUpdated == false || (this.activeUser == '' && this.activeRecipient == ''))
      return;

    this.messages = []

    this.getMessages(this.activeUser, this.activeRecipient).subscribe({
      next: (data) => {
        for (let i = 0; i < data.length; i++) {
          let content = JSON.stringify(data[i].content).replace('"', '').replace('"', '');
          let m_date = JSON.stringify(data[i].m_date)

          let m = new messageC(this.activeUser, this.activeRecipient, content, m_date);
          this.messages.push(m)
          this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
        }
      },
      error: (err) =>
        console.error(`Error: ${err} `),
      complete: () => console.log(`Getting messages from ${this.activeUser} to ${this.activeRecipient}...`)
    })

    this.getMessages(this.activeRecipient, this.activeUser).subscribe({
      next: (data) => {
        for (let i = 0; i < data.length; i++) {
          let content = JSON.stringify(data[i].content).replace('"', '').replace('"', '');
          let m_date = JSON.stringify(data[i].m_date)

          let m = new messageC(this.activeRecipient, this.activeUser, content, m_date);
          this.messages.push(m)
          this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
        }
      },
      error: (err) =>
        console.error(`Error: ${err} `),
      complete: () => console.log(`Getting messages from ${this.activeRecipient} to ${this.activeUser}...`)
    })

    this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
    this.msgUpdate.setUpdate(false);
  }

  onSendButtonClick(): void {
    this.sendMessage().subscribe({
      next: (data) => {
        console.log(data.res)
        this.msgUpdate.setUpdate(true);
        this.updateMessages();
      },
      error: (err) =>
        console.error(`Error: ${err} `),
      complete: () => console.log("Message send completed...")
    })
  }
}
