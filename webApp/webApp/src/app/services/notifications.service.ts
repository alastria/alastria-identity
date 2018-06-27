import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationsService {

  private notifications = new Subject<string>();
  notifications$ = this.notifications.asObservable();

  public notify(message : string) {
    this.notifications.next(message);
  }

}
