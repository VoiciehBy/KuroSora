import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/services/db.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {
  @Input() visible: boolean;
  @Input() ctxMenuUsername: string;
  @Input() activeUser: string;

  activeRecipient : string;

  constructor(private uS: UserService, private db: DbService, private router: Router) { }

  ngOnInit(): void {
    console.log("Context menu component inited, xdd....");
    this.uS.activeRecipientState.subscribe(username => this.activeRecipient = username);
  }

  onRightButtonClick(event: any): boolean {
    return false;
  }

  deleteFriend(): void {
    this.uS.setMsgUpdate(false);
    if (this.activeUser != '')
      this.db.delFriendship(this.activeUser, this.ctxMenuUsername).subscribe({
        error: (err: any) => console.error(`Error: ${err}`),
        complete: () => {
          console.log("Ending friendship was successfull...")
          this.uS.setFriendListUpdate(true);
          this.uS.setActiveRecipient('');
        }
      })
  }
}
