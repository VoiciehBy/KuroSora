import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  host: string = "http://localhost:3000";
  login: string;
  password: string;
  username: string;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    console.log("Registe component inited, xdd....")
   }

  addUser(login: string, username: string, password: string): Observable<any> {
    return this.http.put(`${this.host}/register_new_user?login=${login}&username=${username}&password=${password}`, {});
  }

  signUp(): void {
    if (this.login == undefined || this.login == '' || this.username == undefined)
      return

    this.addUser(this.login, this.username, this.password).subscribe({
      next: () => { },
      error: (err) => console.error(`Error: ${err}`),
      complete: () => {
        console.log("Signing up completed, :D .")
        this.router.navigate(["login"]);
      }
    })
  }
}
