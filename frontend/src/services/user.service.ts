import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class UserService {
    private activeUserSubject = new BehaviorSubject<string>("");
    private activeUserActivationSubject = new BehaviorSubject<boolean>(false);
    private activeRecipientSubject = new BehaviorSubject<string>("");
    private messageUpdateSubject = new BehaviorSubject<boolean>(true);

    private recoveryUsernameSubject = new BehaviorSubject<string>("");

    private friendUpdateSubject = new BehaviorSubject<boolean>(false);
    private notificationListSubject = new BehaviorSubject<boolean>(false);

    private leftAlignedSubject = new BehaviorSubject<boolean>(true);

    activeUserState: Observable<string> = this.activeUserSubject.asObservable();
    activeUserActivationState: Observable<boolean> = this.activeUserActivationSubject.asObservable();
    activeRecipientState: Observable<string> = this.activeRecipientSubject.asObservable();
    messageUpdateState: Observable<boolean> = this.messageUpdateSubject.asObservable();

    recoveryUsernameState: Observable<string> = this.recoveryUsernameSubject.asObservable();

    friendUpdateState: Observable<boolean> = this.friendUpdateSubject.asObservable();
    notificationUpdateState: Observable<boolean> = this.notificationListSubject.asObservable();

    leftAlignedState: Observable<boolean> = this.leftAlignedSubject.asObservable();

    constructor() { }

    setActiveUser(username: string) {
        this.activeUserSubject.next(username);
    }

    setActiveUserActivationState(b: boolean) {
        this.activeUserActivationSubject.next(b);
    }

    setActiveRecipient(username: string) {
        this.activeRecipientSubject.next(username);
    }

    setMsgUpdate(b: boolean) {
        this.messageUpdateSubject.next(b);
    }

    setRecoveryUsername(username: string) {
        this.recoveryUsernameSubject.next(username);
    }

    setFriendListUpdate(b: boolean) {
        this.friendUpdateSubject.next(b);
    }

    setNotificationListUpdate(b: boolean) {
        this.notificationListSubject.next(b);
    }

    setLeftAlignedState(b: boolean) {
        this.leftAlignedSubject.next(b);
    }
}