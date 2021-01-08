/**
 * Alert
 *
 * A simple alert for use with error messages etc
 * @see: https://getbootstrap.com/docs/4.0/components/alerts/
 */
export class Alert {
  static count = 0;
  id: number;

  constructor(
    public msg: string,
    public type: AlertType      = AlertType.info,
    public lifetime: number     = 6000,
    public dismissible: boolean = false,
  ) {
    this.id = ++Alert.count;
  }
}

/**
 * AlertType
 *
 * Different types according to Bootstrap Alerts
 * @see: https://getbootstrap.com/docs/4.0/components/alerts/
 */
export enum AlertType {
  success,
  info,
  warning,
  danger,
}
