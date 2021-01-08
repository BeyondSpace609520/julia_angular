import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { animationLength } from '@/app/helpers/constants';
import { InitService } from './helpers/init/init.service';
import { SplashService } from './helpers/splash/splash.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.pug',
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [style({ opacity: 0 }), animate(animationLength)]),
      transition('* => void', animate(animationLength, style({ opacity: 0 })))
    ])
  ]
})
export class AppComponent implements OnDestroy {
  contentLoading = true;

  constructor(
    public initService: InitService,
    private splashService: SplashService
  ) {
    this.splashService.visible$.pipe(untilDestroyed(this)).subscribe(visible => {
      this.contentLoading = visible;
    });
  }

  ngOnDestroy(): void {}
}
