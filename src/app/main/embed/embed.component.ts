import { Component } from '@angular/core';

import { EmbedService } from './embed.service';
import { EmbedContentSource } from './models';

@Component({
  selector: 'app-embed',
  templateUrl: './embed.component.pug',
  styleUrls: ['./embed.component.sass']
})
export class EmbedComponent {

  constructor(private embedService: EmbedService) {
    embedService.preload({
      embed: {
        moduleId: 'messageCenter',
        selector: 'app-message-center'
      }
    });
    embedService.preload({
      embed: {
        moduleId: 'qualityCenter',
        selector: 'app-quality-center'
      }
    });
  }

  get embeds() {
    return this.embedService.list;
  }

  outputs(frame: EmbedContentSource) {
    return {
      hide() { frame.visible = false; }
    };
  }
}
