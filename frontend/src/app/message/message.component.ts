import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';

import {
  trigger, style, animate, transition
} from "@angular/animations";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  animations: [trigger("fade", [
    transition(":enter", [
      style({ opacity: 0 }),
      animate(3000, style({ opacity: 1 }))
    ]),
    transition(":leave", [
      style({ opacity: 1 }),
      animate(3000, style({ opacity: 0 }))
    ])
  ])]
})

export class MessageComponent implements OnInit {
  @Input() sender: string;
  @Input() activeUser: string;
  @Input() content: string;
  @Input() timeSince: string;
  @Input() olderThan8Hours: boolean;
  @Input() leftAligned: boolean;

  constructor(private uS: UserService) { }

  ngOnInit(): void {
    console.log("Message component inited, xdd....");
    this.uS.activeUserState.subscribe(username => this.activeUser = username);
  }
}