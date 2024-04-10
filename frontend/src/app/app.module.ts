import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { MessagePanelComponent } from './message-panel/message-panel.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router'
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { UserService } from 'src/services/user.service';
import { MessageComponent } from './message/message.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DbService } from 'src/services/db.service';
import { MsgSendComponent } from './msg-send/msg-send.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FriendListComponent,
    MessagePanelComponent,
    RegisterComponent,
    HomeComponent,
    MessageComponent,
    NavbarComponent,
    MsgSendComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    RouterOutlet,
    RouterLink,
    BrowserAnimationsModule,
    PickerComponent
  ],
  providers: [UserService, DbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
