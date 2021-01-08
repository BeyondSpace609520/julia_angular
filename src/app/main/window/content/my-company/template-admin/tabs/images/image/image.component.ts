import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { selectFileDialog } from '@/app/main/window/shared/forms/file-dialog';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.pug',
  styleUrls: ['./image.component.sass']
})
export class ImageComponent implements OnChanges {

  @Input() path?: string;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() exist = true;
  @Output() upload = new EventEmitter<File | null>();
  @Output() clear = new EventEmitter();
  @Output() star = new EventEmitter();

  src: SafeResourceUrl | null = null;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges({ path }: SimpleChanges) {
    if (path && path.currentValue !== path.previousValue) {
      const src = environment.mediaUrl + (path.currentValue || '/wo/Services/images/0000000000_SMALLNoImage.jpg');

      this.src = this.sanitizer.bypassSecurityTrustResourceUrl(src);
    }
  }

  async onUpload() {
    const file = await selectFileDialog('image/x-png,image/gif,image/jpeg');

    if (file) {
      this.upload.emit(file);
    }
  }

  onClear() {
    this.clear.emit();
  }

  onStar() {
    this.star.emit();
  }
}
