export interface TabsSettings {
  buttons: TabsButton[];
  buttonClasses?: string[];
}

export interface TabsButton {
  id: string;
  label: string;
  classes?: string[];
  disabled?: boolean;
  hidden?: boolean;
}
