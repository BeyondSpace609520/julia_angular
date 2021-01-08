import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '@/app/helpers/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiNotificationMessagesService {
  constructor(private apiService: ApiService) { }

  public getCurrentVersion(): Observable<string | null> {
    return this.apiService.mainApiPost<string[]>([], 'notificationMessages', 'getCurrentVersion').pipe(
      map(versionArray => versionArray ? versionArray[0] : null)
    );
  }
}
