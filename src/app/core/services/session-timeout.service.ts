import { Injectable } from "@angular/core";

import { Observable, Subscription, fromEvent, interval, merge } from "rxjs";
import { skipWhile, startWith, switchMap, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SessionTimeoutService {
  private idleTime = 600; // 10 mins
  sessionSubscription!: Subscription;

  private eventStreams$: Observable<any>[] = [];
  private mergedEventStreams$: Observable<any>;
  private events = [
    [document, "visibilitychange"],
    [document, "mousemove"],
    [document, "scroll"],
    [document, "click"],
    [document, "wheel"],
    [document, "keyup"],
  ];

  constructor() {
    this.events.forEach((event) => {
      this.eventStreams$.push(fromEvent(event[0] as any, event[1] as string));
    });
    this.mergedEventStreams$ = merge(...this.eventStreams$);
  }

  startSession() {
    return this.mergedEventStreams$.pipe(
      startWith(0),
      switchMap(() => interval(1000).pipe(take(this.idleTime))),
      skipWhile((value: number) => {
        return value != this.idleTime - 1;
      })
    );
  }
}
