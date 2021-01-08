import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output, Renderer2,
  ViewChild
} from '@angular/core';

import { IPosition } from 'angular2-draggable';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { environment } from '@/environments/environment';
import { LanguageService } from '../../i18n/language.service';
import { State, Window, WindowContent, WindowPosition, WindowSize } from './models';
import { calculatePositionOfMinimized, redirectWithPOST } from './utils';
import { WindowsService } from './windows.service';

const defaultPosition: WindowPosition = { x: 50, y: 50 };
const defaultSize: WindowSize = { width: 700, height: 400 };

@Component({
  selector: 'app-window',
  templateUrl: './window.component.pug',
  styleUrls: ['./window.component.sass']
})
export class WindowComponent implements WindowContent, OnInit, OnDestroy, DoCheck {

  @Input() window: Window;
  @Input() bounds: HTMLElement;
  // tslint:disable-next-line: no-output-native
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<void> = new EventEmitter();

  @HostBinding('class.top')
  @Input() top = false;

  @ViewChild('container', { static: true }) containerRef: ElementRef;
  @ViewChild('header', { static: true }) headerRef: ElementRef;

  private minimizedIndex: Observable<number | null>;
  private state = new BehaviorSubject<State>(State.Default);
  private stateChanges: Observable<State> = this.state.asObservable().pipe(
    untilDestroyed(this),
    distinctUntilChanged()
  );
  private position = new BehaviorSubject<WindowPosition>(defaultPosition);
  private positionChanges: Observable<WindowPosition> = this.position.asObservable().pipe(
    untilDestroyed(this),
    distinctUntilChanged((prev, next) => prev.x === next.x && prev.y === next.y)
  );
  private size = new BehaviorSubject<WindowSize>(defaultSize);
  private sizeChanges: Observable<WindowSize> = this.size.asObservable().pipe(
    untilDestroyed(this),
    distinctUntilChanged((prev, next) => prev.width === next.width && prev.height === next.height)
  );

  public displayWidth: Observable<number>;
  public displayHeight: Observable<number>;
  public displayPosition: Observable<WindowPosition>;

  public inputs: {[key: string]: any};
  public outputs: {[key: string]: any};

  private restoreState: State | null = null;
  private previousState: State | null = null;
  private previousTop: boolean;

  constructor(
    private windowsService: WindowsService,
    private languageService: LanguageService,
    private renderer: Renderer2
  ) {}

  public openReference(): void {
    if (this.window.contentSource && this.window.contentSource.academyScreenId) {
      redirectWithPOST(
        environment.remoteUrl + '/wo/Services/com/gotoacademy.php',
        {
          screen: this.window.contentSource.academyScreenId,
          l_id: String(this.languageService.getLanguageId())
        }
      );
    }
  }

  public endOffset(position: IPosition): void {
    if (this.isMaximized || this.isMinimized) {
      return;
    }

    this.position.next(this.getNormalizedPosition(position));
  }

  @HostBinding('class.minimized')
  get isMinimized() {
    return this.window.state === State.Minimized;
  }

  @HostBinding('class.maximized')
  get isMaximized() {
    return this.window.state === State.Maximized;
  }

  public minimize(): void {
    this.window.state = State.Minimized;
    this.windowsService.windowStateChanged();
  }

  public maximize(): void {
    this.window.state = State.Maximized;
    this.windowsService.windowStateChanged();
  }

  public restore(): void {
    this.window.state = this.restoreState || State.Default;
    this.windowsService.windowStateChanged();
  }

  @HostListener('window:resize', ['$event'])
  onViewportResize() {
    // this.externalWindowChange.emit();
  }

  public onResizeStart(): void {
    this.selected.emit();
  }

  public onResizeStop(sizeEvent: IResizeEvent): void {
    this.normalizeResizePosition(sizeEvent.size);
    this.size.next(this.getNormalizedSize(sizeEvent.size));
  }

  private initDisplayProperties(): void {
    this.displayWidth = combineLatest([
      this.sizeChanges,
      this.stateChanges,
    ]).pipe(
      map(([size, state]) => this.getDisplayWidth(size, state)),
    );
    this.displayHeight = combineLatest([
      this.sizeChanges,
      this.stateChanges,
    ]).pipe(
      map(([size, state]) => this.getDisplayHeight(size, state)),
    );
    this.displayPosition = combineLatest([
      this.positionChanges,
      this.displayWidth,
      this.displayHeight,
      this.minimizedIndex,
      this.stateChanges,
    ]).pipe(
      map((
        [position, width, height, minimizedIndex, state]
      ) => this.getDisplayPosition(position, width, height, minimizedIndex || 0, state)),
    );
  }

  private setInputs(): void {
    this.inputs = {};
    if (this.window.contentSource) {
      this.inputs = Object.assign(this.window.contentSource.props || {}, { window: this.window });
    }
    this.inputs.top = this.top;
  }

  private setOutputs(): void {
    this.outputs = {
      onload: () => {
        if (this.window.onload) {
          this.window.onload(this.window);
        }
      },
      windowTitleChange: (title: string) => {
        this.window.title = title;
      },
      moveToTop: () => {
        this.selected.emit();
      },
    };
  }

  private setInitialSize(): void {
    this.size.next(Object.assign(defaultSize, this.window.contentSource && this.window.contentSource.initial));
  }

  private getDisplayPosition(
    position: WindowPosition,
    displayWidth: number,
    displayHeight: number,
    minimizedIndex: number,
    state: State
  ): WindowPosition {
    if (state === State.Minimized) {
      const bounds = { width: this.bounds.clientWidth, height: this.bounds.clientHeight };
      return calculatePositionOfMinimized(
        minimizedIndex,
        { width: displayWidth, height: displayHeight },
        bounds
      );
    } else if (state === State.Maximized) {
      return {x: 0, y: 0};
    } else {
      return position;
    }
  }

  private getDisplayWidth(size: WindowSize, state: State): number {
    if (state === State.Minimized) {
      return this.bounds.clientWidth / 6;
    } else if (state === State.Maximized) {
      return this.bounds.clientWidth;
    }
    return size.width;
  }

  private getDisplayHeight(size: WindowSize, state: State): number {
    if (state === State.Minimized) {
      return this.headerRef.nativeElement.clientHeight;
    } else if (state === State.Maximized) {
      return this.bounds.clientHeight;
    }
    return size.height;
  }

  private checkIfStateChanged(): void {
    if (this.previousState !== this.window.state) { // triggers once when state changed
      this.restoreState = this.previousState === State.Minimized ? State.Default : this.previousState;
      this.state.next(this.window.state);
    }
    this.previousState = this.window.state;
  }

  private checkIfTopChanged(): void {
    if (this.previousTop !== this.top) {
      this.inputs.top = this.top;
    }
    this.previousTop = this.top;
  }

  private normalizeResizePosition(newSize: WindowSize): void {
    const container = this.containerRef.nativeElement;
    const offsetTop = container.offsetTop;
    const offsetLeft = container.offsetLeft;
    if (offsetTop === 0 && offsetLeft === 0) {
      return;
    }
    this.renderer.setStyle(container, 'top', 0);
    this.renderer.setStyle(container, 'left', 0);
    const {x, y} = this.position.getValue();
    this.position.next(this.getNormalizedPosition({
      x: x + offsetLeft,
      y: y + offsetTop
    }, newSize));
  }

  private getNormalizedPosition(position: WindowPosition, newSize?: WindowSize): WindowPosition {
    const { width, height } = newSize ? newSize : this.size.getValue();
    const newX = Math.max(0, Math.min(this.bounds.clientWidth - width, position.x));
    const newY = Math.max(0, Math.min(this.bounds.clientHeight - height, position.y));
    return { x: newX, y: newY };
  }

  private getNormalizedSize(size: WindowSize): WindowSize {
    const { x, y } = this.position.getValue();
    return {
      width: Math.min(this.bounds.clientWidth - x, size.width),
      height: Math.min(this.bounds.clientHeight - y, size.height)
    };
  }

  ngOnInit(): void {
    this.minimizedIndex = this.windowsService.getMinimizedIndexObservable(this.window);
    this.initDisplayProperties();
    this.setInputs();
    this.setOutputs();
    this.setInitialSize();
  }

  ngOnDestroy(): void {}

  ngDoCheck(): void {
    this.checkIfStateChanged();
    this.checkIfTopChanged();
  }
}
