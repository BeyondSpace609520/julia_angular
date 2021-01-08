import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// tslint:disable-next-line: interface-over-type-literal
export type ImageItem = { path: string };

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.pug',
  styleUrls: ['./image-carousel.component.sass']
})
export class ImageCarouselComponent implements OnInit {

  @Input() images: ImageItem[];
  @Input() current: ImageItem;
  @Output() selectImage = new EventEmitter<ImageItem>();

  constructor() { }

  ngOnInit() {
  }

  get wrapperStyles() {
    return {
      ['offset-' + this.images.indexOf(this.current)]: true
    };
  }
}
