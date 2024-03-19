import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class ActiveUserService {
    private subject = new BehaviorSubject<string>("");
    currentState: Observable<string> = this.subject.asObservable();

    constructor() { }

    setActiveUser(username: string) {
        this.subject.next(username);
    }
}