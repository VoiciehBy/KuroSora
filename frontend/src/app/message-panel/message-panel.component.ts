
import { Component, OnInit } from '@angular/core';
import { messageC } from 'src/message';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-message-panel',
  templateUrl: './message-panel.component.html',
  styleUrls: ['./message-panel.component.css']
})
export class MessagePanelComponent implements OnInit {
  host: string = "http://localhost:3000";

  activeUser: string;
  activeRecipient: string;

  isMsgNeedToBeUpdated: boolean = false;
  message: string = '';
  messages: messageC[];

  constructor(private http: HttpClient,
    private uS: UserService) { }

  ngOnInit(): void {
    console.log("Message Panel component inited, xdd....")
    this.uS.activeUserState.subscribe(username => this.activeUser = username)
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username)
    this.uS.messageUpdateState.subscribe(b => this.isMsgNeedToBeUpdated = b);

    /*setInterval(()=> {
      this.uS.setMsgUpdate(true)
    }, 5000)*/
    setInterval(() => {
      this.updateMessages();
    }, 100)
  }

  sendMessage(): Observable<any> {
    return this.http.put(`${this.host}/message`,
      {
        "sender": this.activeUser,
        "recipient": this.activeRecipient,
        "content": this.message
      })
  }

  getMessages(sender: string, recipient: string): Observable<any> {
    return this.http.get(`${this.host}/user_messages?sender=${sender}&recipient=${recipient}`)
  }

  getMessageTimeSince(miliseconds: number): string {
    let seconds = Math.trunc(miliseconds / 1000)
    let hours = Math.trunc(seconds / 3600)
    let minutes = Math.trunc(seconds / 60) - hours * 60
    seconds = seconds - hours * 3600 - minutes * 60
    let r = ``
    if (hours != 0)
      r += `${hours} h `
    if (minutes != 0)
      r += `${minutes} min `
    if (seconds != 0)
      r += `${ seconds } s`
    return r
  }

  updateMessages() {
    if (this.isMsgNeedToBeUpdated == false || (this.activeUser == '' && this.activeRecipient == ''))
      return;

    this.messages = []

    this.getMessages(this.activeUser, this.activeRecipient).subscribe({
      next: (data) => {
        for (let i = 0; i < data.length; i++) {
          let content = JSON.stringify(data[i].content).replace('"', '').replace('"', '');
          let m_date = JSON.stringify(data[i].m_date).slice(1, 20).replace('T', ' ');
          let miliseconds = Date.now() - Date.parse(data[i].m_date)

          let x = this.getMessageTimeSince(miliseconds)

          let m = new messageC(this.activeUser, this.activeRecipient, content, m_date, x);
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
          let m_date = JSON.stringify(data[i].m_date).slice(1, 20).replace('T', ' ');
          let miliseconds = Date.now() - Date.parse(data[i].m_date)

          let x = this.getMessageTimeSince(miliseconds)

          let m = new messageC(this.activeRecipient, this.activeUser, content, m_date, x);
          this.messages.push(m)
          this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
        }
      },
      error: (err) =>
        console.error(`Error: ${err} `),
      complete: () => console.log(`Getting messages from ${this.activeRecipient} to ${this.activeUser}...`)
    })

    this.messages = this.messages.sort((a, b) => (a.m_date < b.m_date ? -1 : 1));
    this.uS.setMsgUpdate(false);
  }

  onSendButtonClick(): void {
    this.sendMessage().subscribe({
      next: (data) => {
        console.log(data.res)
        this.uS.setMsgUpdate(true);
        this.updateMessages();
      },
      error: (err) => console.error(`Error: ${err} `),
      complete: () => {
        console.log("Message send completed...")
      }
    })
  }

  onUpdateButtonClick(): void {
    this.uS.setMsgUpdate(true);
  }
}
