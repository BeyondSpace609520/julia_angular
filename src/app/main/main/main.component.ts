import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { animationLength } from '@/app/helpers/constants';
import { MainService } from '../main.service';
import { Window } from '../window/models';
import { WindowsService } from '../window/windows.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.pug',
  styleUrls: ['./main.component.sass'],
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [style({ opacity: 0 }), animate(animationLength)]),
      transition('* => void', animate(animationLength, style({ opacity: 0 })))
    ])
  ]
})
export class MainComponent implements OnDestroy {

  public windows: Observable<Window[]>;

  constructor(
    public windowsService: WindowsService,
    public mainService: MainService,
  ) {
    this.windows = this.windowsService.list$.pipe(untilDestroyed(this));
  }

  ngOnDestroy(): void {}

}
