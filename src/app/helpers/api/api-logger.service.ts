import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LogBackendInit, LogBackendLogout } from './api-logger.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiLoggerService {

  constructor(private apiService: ApiService) { }

  public logBackendInit(data: LogBackendInit): Observable<number[]> {
    return this.apiService.mainApiPost([data, data.be_dbName], 'AppClass', 'logBackEndEvent');
  }

  public logBackendLogout(data: LogBackendLogout): Observable<void> {
    return this.apiService.mainApiPost([data], 'AppClass', 'logBackEndEvent');
  }

  public sendAliveSignal(sessionId: number, dbName: string): Observable<void> {
    return this.apiService.mainApiPost([sessionId, dbName], 'AppClass', 'sendAliveSignal');
  }
}
