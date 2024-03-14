import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { FriendListComponent } from './friend-list/friend-list.component';
import { MessagePanelComponent } from './message-panel/message-panel.component';
import { MessageUpdateService } from 'src/msgUpdate.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginDialogComponent,
    FriendListComponent,
    MessagePanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [MessageUpdateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
