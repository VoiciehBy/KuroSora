import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})

export class MessageComponent implements OnInit {
  @Input() sender_id: string;
  @Input() activeUser: string;
  @Input() content: string;
  @Input() timeSince: string;

  constructor(private uS: UserService) { }

  ngOnInit(): void {
    console.log("Message component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
  }
}
