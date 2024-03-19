import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class ActiveRecipientService {
    private subject = new BehaviorSubject<string>("");
    currentState: Observable<string> = this.subject.asObservable();

    constructor() { }

    setActiveRecipient(username: string) {
        this.subject.next(username);
    }
}