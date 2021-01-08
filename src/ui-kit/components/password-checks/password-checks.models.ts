export interface PasswordCheck {
  type: string;
  label: string;
  labelParameters?: {[key: string]: string | number};
  value: boolean;
}
