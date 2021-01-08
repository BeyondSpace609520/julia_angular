import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AlertService} from '../../services/alert.service';
import {Alert} from './alert.model';

@Component({
  selector:    'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  animations:  [
    trigger('flyInOut', [
      state(
        'in',
        style({ opacity: '1' }),
      ),
      transition(
        'void => *', [
          style({ opacity: '0' }),
          animate(250),
        ],
      ),
      transition(
        '* => void', [
          animate(500,
            style({ opacity: '0' })),
        ],
      ),
    ]),
  ],
})
export class AlertsComponent implements OnInit, OnDestroy {
  alerts: Alert[] = []; // Contains all currently visible alerts
  subscription: Subscription;

  constructor(private alertService: AlertService) {
    // Subscribe to AlertService
    this.alertService.alert$.subscribe((alert: Alert) => {
      this.addAlert(alert);
    });
  }

  /**
   * Add a new alert and show it to the user
   */
  addAlert(alert: Alert) {
    if (alert.lifetime <= 0) {
      alert.dismissible = true;
    }

    this.alerts.push(alert);

    if (alert.lifetime > 0) {
      setTimeout(() => {
        this.removeAlert(alert);
      }, alert.lifetime);
    }
  }

  /**
   * Removes an alert
   *
   * Gets called automatically after x seconds(if it has lifetime > 0), or
   * Gets removed when user dismisses the alert
   */
  removeAlert(alert: Alert) {
    for (let i = 0; i < this.alerts.length; i++) {
      if (alert.id === this.alerts[i].id) {
        this.alerts.splice(i, 1);
      }
    }
  }

  /**
   * User clicked close-icon on an alert
   */
  onDismiss(alert: Alert) {
    this.removeAlert(alert);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
