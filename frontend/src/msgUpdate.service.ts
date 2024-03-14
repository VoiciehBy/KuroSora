import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class MessageUpdateService{
    private msgStateObserver = new BehaviorSubject<boolean>(true);
    currentState : Observable<boolean> = this.msgStateObserver.asObservable();

    constructor() {}

    setUpdate(b : boolean){
        this.msgStateObserver.next(b);
    }
}