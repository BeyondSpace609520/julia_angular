import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '@/app/auth/auth.service';
import { LanguageService } from '@/app/i18n/language.service';
import { environment } from '@/environments/environment';

@Component({
  selector: 'app-quality-center',
  templateUrl: './quality-center.component.pug',
  styleUrls: ['./quality-center.component.sass'],
})
export class QualityCenterComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  @Input() visible!: boolean;
  @Output() hide = new EventEmitter();
  src: SafeResourceUrl | null = null;

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    const {
      customerId: cid,
      languageId: lid,
    } = this.authService.getQueryParams();

    this.src = this.getIframeSrc(cid, lid);
    this.languageService.languageId$
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((languageId) => {
        this.src = this.getIframeSrc(cid, languageId);
      });
  }

  getIframeSrc(cid: number, lid: number): SafeResourceUrl {
    const path = `/easybookingConfig/?cid=${cid}&lid=${lid}#iframe/qualityCenter`;
    const src = environment.legacyContentUrl + path;
    return this.sanitizer.bypassSecurityTrustResourceUrl(src);
  }

  ngOnChanges(changes: SimpleChanges) {
    const { visible } = changes;

    if (
      visible.currentValue &&
      visible.currentValue !== visible.previousValue
    ) {
      const iframe = this.iframe.nativeElement as HTMLIFrameElement;

      (iframe.contentWindow as any).messageFromFlex('startDragin');
    }
  }

  ngOnDestroy(): void {}

  @HostListener('window:message', ['$event'])
  listenMessageEvent(e: MessageEvent) {
    if (e.data === 'dragOut') {
      this.hide.emit();
    }
  }
}
