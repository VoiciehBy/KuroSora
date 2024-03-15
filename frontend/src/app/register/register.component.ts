import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from 'rxjs';
import { ActiveUserService } from 'src/services/activeuser.service';

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  host: string = "http://localhost:3000";
  login: string;
  username: string;

  activeUser: string;

  constructor(private http: HttpClient, private router: Router, private aUU: ActiveUserService) { }

  ngOnInit(): void {
    this.aUU.currentState.subscribe(username => this.activeUser = username);
  }

  getUser(login: string): Observable<any> {
    return this.http.get(`${this.host}/user?login=${login}`)
  }

  addUser(login: string, username: string): Observable<any> {
    return this.http.put(`${this.host}/register_new_user?login=${login}&username=${username}`, {});
  }

  signUp(): void {
    this.addUser(this.login, this.username).subscribe({
      next: () => {
        this.router.navigate([""]);
      },
      error: (err) => console.error(`Error: ${err}`),
      complete: () => console.log("Signing up completed, :D .")
    })
  }
}
