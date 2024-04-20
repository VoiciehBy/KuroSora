import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { HOSTNAME } from "src/constants";
import { Observable } from "rxjs";

@Injectable()
export class DbService {
  host: string = HOSTNAME;
  constructor(private http: HttpClient) { }

  getUser(username: string): Observable<any> {
    return this.http.get(`${this.host}/user?username=${username}`)
  }

  getUser_1(login: string, password: string): Observable<any> {
    return this.http.get(`${this.host}/handshake?login=${login}&password=${password}`)
  }

  addUser(login: string, username: string, password: string): Observable<any> {
    return this.http.put(`${this.host}/new_user?login=${login}&username=${username}&password=${password}`, {});
  }

  genCode(username: string): Observable<any> {
    return this.http.put(`${this.host}/new_code?username=${username}`, {});
  }

  genRecCode(username: string): Observable<any> {
    return this.http.put(`${this.host}/new_rec_code?username=${username}`, {});
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.host}/users`)
  }

  getCode(username: string, code: string): Observable<any> {
    return this.http.get(`${this.host}/code?username=${username}&code=${code}`);
  }

  getRecoveryCode(username: string, code: string): Observable<any> {
    return this.http.get(`${this.host}/rec_code?username=${username}&code=${code}`);
  }

  deleteCode(code: string): Observable<any> {
    return this.http.delete(`${this.host}/code?v=${code}`);
  }

  sendMessage(activeUser: string, activeRecipient: string, message: string): Observable<any> {
    return this.http.put(`${this.host}/new_message`,
      {
        "sender": activeUser,
        "recipient": activeRecipient,
        "content": message
      })
  }

  activateAccount(username: string): Observable<any> {
    return this.http.patch(`${this.host}/user?username=${username}`, {})
  }

  changePassword(username: string, password: string): Observable<any> {
    return this.http.patch(`${this.host}/user?username=${username}&password=${password}`, {})
  }

  getMessages(sender: string, recipient: string): Observable<any> {
    return this.http.get(`${this.host}/user_messages?sender=${sender}&recipient=${recipient}`)
  }
}