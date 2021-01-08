import { Injectable } from '@angular/core';

import { EmbedContentSource } from './models';

@Injectable()
export class EmbedService {

  list: EmbedContentSource[] = [];

  constructor() { }

  find(moduleId: string, selector: string) {
    return this.list.find(({ embed }) => embed.moduleId === moduleId && embed.selector === selector);
  }

  open(content: EmbedContentSource) : void {
    const frame = this.find(content.embed.moduleId, content.embed.selector);

    if (frame && !frame.visible) {
      frame.visible = true;
    } else {
      this.list.push({ ...content, visible: true });
    }
  }

  preload(content: EmbedContentSource) {
    this.list.push({ ...content, visible: false });
  }

  close(moduleId: string, selector: string) {
    const frame = this.find(moduleId, selector);

    if (frame) {
      frame.visible = false;
    }
  }
}
