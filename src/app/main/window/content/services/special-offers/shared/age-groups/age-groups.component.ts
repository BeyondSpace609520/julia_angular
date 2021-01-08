import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { SpecialOfferPricing } from '../../models';

const MAX_AGE_GROUPS = 5;

@Component({
  selector: 'app-age-groups',
  templateUrl: './age-groups.component.pug',
  styleUrls: ['./age-groups.component.sass']
})
export class AgeGroupsComponent implements OnDestroy {
  private allValidSubject = new BehaviorSubject<boolean>(true);

  @Input() ageGroups!: SpecialOfferPricing['ageGroups'];
  @Output() ageGroupsChange = new EventEmitter<SpecialOfferPricing['ageGroups']>();
  @Output() allValid: Observable<boolean> = this.allValidSubject.asObservable().pipe(
    untilDestroyed(this),
    distinctUntilChanged()
  );

  public get canAdd(): boolean {
    return this.ageGroups.length < MAX_AGE_GROUPS;
  }

  constructor() { }

  public add(): void {
    if (!this.canAdd) { return; }
    this.ageGroups = [...this.ageGroups, { from: 0, to: 0 }];
    this.ageGroupsChange.emit(this.ageGroups);
  }

  public onInputValidityChange(): void {
    this.allValidSubject.next(this.ageGroups.every(ageGroup => ageGroup.from !== null && ageGroup.to >= ageGroup.from));
  }

  public remove(): void {
    this.ageGroups = this.ageGroups.slice(0, this.ageGroups.length - 1);
    this.ageGroupsChange.emit(this.ageGroups);
  }

  ngOnDestroy(): void {}
}
