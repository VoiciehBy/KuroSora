import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  isLeftAligned: boolean;

  constructor(private uS: UserService) { }

  ngOnInit(): void {
    console.log("Home component inited, xdd....");
    this.uS.leftAlignedState.subscribe(b => this.isLeftAligned = b);
  }
}