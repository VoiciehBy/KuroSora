import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { HOSTNAME } from "src/constants";
import { Observable } from "rxjs";

@Injectable()
export class DbService {
  host: string = HOSTNAME;
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(`${this.host}/users`)
  }

  getUser(username: string): Observable<any> {
    return this.http.get(`${this.host}/user?username=${username}`)
  }

  getUserByHS(login: string, password: string): Observable<any> {
    return this.http.get(`${this.host}/user?login=${login}&password=${password}`)
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.host}/user?id=${id}`)
  }

  getMessages(sender: string, recipient: string): Observable<any> {
    return this.http.get(`${this.host}/user_messages?sender=${sender}&recipient=${recipient}`)
  }

  getCode(username: string, code: string): Observable<any> {
    return this.http.get(`${this.host}/code?username=${username}&code=${code}`);
  }

  getRecoveryCode(username: string, code: string): Observable<any> {
    return this.http.get(`${this.host}/rec_code?username=${username}&code=${code}`);
  }

  getNotifications(username: string = '%', username_1: string): Observable<any> {
    return this.http.get(`${this.host}/notifications?from=${username}&to=${username_1}`);
  }

  createNewAccount(login: string, username: string, password: string): Observable<any> {
    return this.http.put(`${this.host}/new_user?login=${login}&username=${username}&password=${password}`, {});
  }

  sendMessage(activeUser: string, activeRecipient: string, message: string): Observable<any> {
    return this.http.put(`${this.host}/new_message`,
      {
        "sender": activeUser,
        "recipient": activeRecipient,
        "content": message
      })
  }

  genActCode(username: string): Observable<any> {
    return this.http.put(`${this.host}/new_act_code?username=${username}`, {});
  }

  genCode(username: string): Observable<any> {
    return this.http.put(`${this.host}/new_code?username=${username}`, {});
  }

  genRecCode(username: string): Observable<any> {
    return this.http.put(`${this.host}/new_rec_code?username=${username}`, {});
  }

  sendNotification(username: string, username_1: string): Observable<any> {
    return this.http.put(`${this.host}/new_notification?from=${username}&to=${username_1}`, {});
  }

  addFriend(username: string, username_1: string): Observable<any> {
    return this.http.put(`${this.host}/new_friend?u=${username}&uu=${username_1}`, {});
  }

  activateAccount(username: string): Observable<any> {
    return this.http.patch(`${this.host}/user?username=${username}`, {})
  }
  
  changePassword(username: string, password: string): Observable<any> {
    return this.http.patch(`${this.host}/user?username=${username}&password=${password}`, {})
  }

  delCode(code: string): Observable<any> {
    return this.http.delete(`${this.host}/code?v=${code}`);
  }

  delNotification(username: string, username_1: string): Observable<any> {
    return this.http.delete(`${this.host}/notification?from=${username}&to=${username_1}`, {});
  }
}