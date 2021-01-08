export enum State {
  Minimized = 'minimized',
  Maximized = 'maximized',
  Default = 'default'
}

export interface WindowContentSource {
  window: {
    moduleId: string;
    selector: string;
  };
  initial?: {
    width?: number;
    height?: number;
    state?: State;
  };
  props?: WindowContentSourceProperties;
  academyScreenId?: string;
}

export interface WindowContentSourceProperties {
  [key: string]: any;
}

export interface Window {
  id: string;
  instanceId: symbol;
  title: string;
  contentSource?: WindowContentSource;
  state: State;
  onload?: (window: Window) => any;
  titleChanged?: (title: string) => void;
}

export interface WindowContent {
  window: Window;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}
