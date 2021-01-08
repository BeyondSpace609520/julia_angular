import { environment } from '@/environments/environment';
import { Injectable } from '@angular/core';

interface ScriptSettings {
  name: string;
  source: string;
  parameters?: {[key: string]: string | number};
}

interface ScriptInstances {
  [name: string]: {
    source: string;
    parameters?: {[key: string]: string | number};
    loaded: boolean;
  }
}

export interface ScriptStatus {
  name: string;
  status: ScriptStatusType;
}

type ScriptStatusType = 'loaded' | 'alreadyLoaded' | 'error' | 'notFound';

const scriptSettings: ScriptSettings[] = [
  {
    name: 'livezilla',
    source: 'https://support.easybooking.eu/script.php?id=' + environment.livezillaId,
    parameters: {
      id: environment.livezillaId,
      defer: ''
    }
  }
];

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  private scripts: ScriptInstances = {};

  constructor() {
    scriptSettings.forEach(({name, source, parameters}) => {
      this.scripts[name] = {source, parameters, loaded: false};
    });
  }

  load(...names: string[]): Promise<ScriptStatus[]> {
    return Promise.all(names.map(name => this.loadScript(name).then(status => ({name, status}))));
  }

  private async loadScript(name: string): Promise<ScriptStatusType> {
    return new Promise<ScriptStatusType>(resolve => {
      if (!this.scripts.hasOwnProperty(name)) {
        return resolve('notFound');
      }
      const script = this.scripts[name];
      if (script.loaded) {
        return resolve('alreadyLoaded');
      }
      const scriptElement: HTMLScriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = script.source;
      if (script.parameters) {
        Object.keys(script.parameters).forEach(parameter => {
          if (script.parameters && script.parameters.hasOwnProperty(parameter)) {
            scriptElement.setAttribute(parameter, script.parameters[parameter] + '');
          }
        });
      }
      scriptElement.addEventListener('load', () => {
        resolve('loaded');
      });
      scriptElement.addEventListener('error', () => resolve('error'));
      document.getElementsByTagName('body')[0].appendChild(scriptElement);
    });
  }
}
