import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class UserService {
    private activeUserSubject = new BehaviorSubject<string>("");
    private activeRecipientSubject = new BehaviorSubject<string>("");
    activeUserState: Observable<string> = this.activeUserSubject.asObservable();
    activeRecipientState: Observable<string> = this.activeRecipientSubject.asObservable();

    constructor() { }

    setActiveUser(username: string) {
        this.activeUserSubject.next(username);
    }
    
    setActiveRecipient(username: string) {
        this.activeRecipientSubject.next(username);
    }
}