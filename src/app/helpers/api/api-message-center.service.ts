import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@/app/helpers/api/api.service';
import { MessageCenterMessage, RawMessageCenterMessage } from '@/app/main/embed/models';
import { reduceMessageCenterMessage } from '@/app/main/embed/reduce';

@Injectable({
  providedIn: 'root',
})
export class ApiMessageCenterService {

  constructor(private apiService: ApiService) {}

  public getMessageCenterMessages(): Observable<MessageCenterMessage> {
    return this.apiService
      .easybookingGet<RawMessageCenterMessage>('messageCenter/messages', {
        p3: 'all',
      })
      .pipe(map(reduceMessageCenterMessage));
  }

  public getMessageCenterCount(): Observable<number> {
    return this.apiService.mainApiPost<string[]>(['appUser'], 'notificationMessages', 'getCurrentMessageCount').pipe(
      map(response => +response[0])
    );
  }
}
