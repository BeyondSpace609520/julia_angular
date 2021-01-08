## Content with iframe

There are many windows with iframe, they based on reusable `WindowIframeComponent`

- extend your component with `WindowIframeComponent`
- inject `DomSanitizer`, `LoaderService`. Pass it to `super()`
- call the `this.loadIframe(<path>, <query params object>, <hash>)` inside `ngOnInit` or other method
- set path to template and styles
```
  templateUrl: '../shared/window-iframe/window-iframe.component.pug',
  styleUrls: ['../shared/window-iframe/window-iframe.component.sass']
```

If you need to listen messages from iframe, override the `onMessage` method

Also you can define your own template based on
```
iframe(#iframe, [src]="src", (load)="onLoaded()")
.loading-bar(*ngIf="isLoading | async")
    app-loading
```
