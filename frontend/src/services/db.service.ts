import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { HOSTNAME } from "src/constants";
import { Observable } from "rxjs";

@Injectable()
export class DbService {
  host: string = HOSTNAME;
  constructor(private http: HttpClient) { }

  getUser(login: string, password: string): Observable<any> {
    return this.http.get(`${this.host}/user?login=${login}&password=${password}`)
  }

  addUser(login: string, username: string, password: string): Observable<any> {
    return this.http.put(`${this.host}/new_user?login=${login}&username=${username}&password=${password}`, {});
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.host}/users`)
  }

  sendMessage(activeUser: string, activeRecipient: string, message: string): Observable<any> {
    return this.http.put(`${this.host}/new_message`,
      {
        "sender": activeUser,
        "recipient": activeRecipient,
        "content": message
      })
  }

  getMessages(sender: string, recipient: string): Observable<any> {
    return this.http.get(`${this.host}/user_messages?sender=${sender}&recipient=${recipient}`)
  }
}