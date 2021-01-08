import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { getViewSettings } from '@/app/main/view/utils';
import { ViewService } from '@/app/main/view/view.service';

@Component({
  selector: 'app-settings-button',
  templateUrl: './settings-button.component.pug',
  styleUrls: ['./settings-button.component.sass']
})
export class SettingsButtonComponent implements OnChanges {

  @Input() moduleId!: string;

  public title: string;

  constructor(private viewService: ViewService) {}

  public openSettings(): void {
    this.viewService.openViewById(this.moduleId);
  }

  ngOnChanges({moduleId}: SimpleChanges): void {
    if (moduleId && moduleId.currentValue) {
      const viewSettings = getViewSettings(moduleId.currentValue);
      if (viewSettings) {
        this.title = viewSettings.label;
      }
    }
  }
}
