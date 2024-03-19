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
import { MessageUpdateService } from 'src/services/msgupdate.service';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { UserService } from 'src/services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FriendListComponent,
    MessagePanelComponent,
    RegisterComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    RouterOutlet,
    RouterLink,
    BrowserAnimationsModule
  ],
  providers: [MessageUpdateService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
