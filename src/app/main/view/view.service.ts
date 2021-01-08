import { Injectable } from '@angular/core';

import { EmbedService } from '@/app/main/embed/embed.service';
import { State, WindowContentSource, WindowContentSourceProperties } from '@/app/main/window/models';
import { WindowsService } from '@/app/main/window/windows.service';
import { ViewSettings } from './models';
import { getViewSettings } from './utils';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  constructor(
    private embedService: EmbedService,
    private windowsService: WindowsService,
  ) { }

  public openViewById(viewId: string, onLoad?: () => any): void {
    const viewSettings = getViewSettings(viewId);
    if (viewSettings) {
      this.openView(viewSettings, onLoad);
    } else {
      console.error('Cannot open View with unknown viewId: ' + viewId);
    }
  }

  public async focusViewById(viewId: string, onLoad?: () => any): Promise<void> {
    const viewSettings = getViewSettings(viewId);
    if (viewSettings) {
      return this.focusView(viewSettings, onLoad);
    } else {
      console.error('Cannot focus View with unknown viewId: ' + viewId);
      return new Promise((resolve, reject) => {});
    }
  }

  public openView(viewSettings: ViewSettings, onLoad?: () => any): void {
    if (!viewSettings.contentSource) {
      return;
    } else if ('window' in viewSettings.contentSource) {
      this.windowsService.addWindow(
        viewSettings.label,
        viewSettings.id,
        viewSettings.contentSource,
        onLoad,
      );
    } else if ('embed' in viewSettings.contentSource) {
      this.embedService.open(viewSettings.contentSource);
    }
  }

  public focusView(viewSettings: ViewSettings, onLoad?: () => any): Promise<void> {
    if (!viewSettings.id) {
      return new Promise((resolve, reject) => { } );
    }
    const existingWindow = this.windowsService.getWindowById(viewSettings.id);

    return new Promise((resolve, reject) => {
      try {
        if (!existingWindow) {
          this.openView(viewSettings, () => setTimeout(() => resolve(), 4000));
          // TODO, timeout until js in iframe loads
        } else {
          this.windowsService.selectWindow(existingWindow);
          resolve();
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public openViewWithProperties(viewId: string, properties: WindowContentSourceProperties): void {
    const viewSettings = getViewSettings(viewId);
    if (viewSettings && viewSettings.contentSource && 'window' in viewSettings.contentSource) {
      (viewSettings.contentSource as WindowContentSource).props = Object.assign(properties, viewSettings.contentSource.props || {});
      this.openView(viewSettings);
    }
  }

  public focusViewWithProperties(viewId: string, properties: WindowContentSourceProperties): void {
    const viewSettings = getViewSettings(viewId);
    if (viewSettings && viewSettings.contentSource && 'window' in viewSettings.contentSource) {
      (viewSettings.contentSource as WindowContentSource).props = Object.assign(properties, viewSettings.contentSource.props || {});
      this.focusView(viewSettings);
    }
  }
}
