import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Alert} from '../components/alerts/alert.model';

@Injectable()
export class AlertService {
  // Observable sources
  private alertSource = new Subject<Alert>();

  // Observable streams
  alert$ = this.alertSource.asObservable();

  // Service message commands
  addAlert(alert: Alert) {
    this.alertSource.next(alert);
  }
}
