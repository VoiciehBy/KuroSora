import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class MessageUpdateService{
    private subject = new BehaviorSubject<boolean>(true);
    currentState : Observable<boolean> = this.subject.asObservable();

    constructor() {}

    setUpdate(b : boolean){
        this.subject.next(b);
    }
}