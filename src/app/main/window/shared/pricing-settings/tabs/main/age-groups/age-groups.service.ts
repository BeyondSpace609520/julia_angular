import { EventEmitter, Injectable } from '@angular/core';

import { Pricing } from '../../../models';

export type AgeGroup = Pricing['ageGroups'][0];

@Injectable()
export class AgeGroupsService {

  public update = new EventEmitter<true | void>();
  public ageGroups: (AgeGroup | null)[] = [];
  public sortedAgeGroups: (AgeGroup | null)[] = [];

  constructor() {
    this.update.subscribe(() => {
      this.sortedAgeGroups.sort((a, b) => {
        return a && b ? a.from - b.from : 0;
      });
    });
  }

  setGroups(groups: AgeGroup[]) {
    this.ageGroups = [...groups];
    this.sortedAgeGroups = [...groups];
    this.update.emit(true);
  }

  edit(group: AgeGroup, from: number, to: number, percDiscount: number) {
    group.from = from;
    group.to = to;
    group.percDiscount = percDiscount;
    this.update.emit();
  }

  add(group: AgeGroup) {
    this.ageGroups.push(group);
    this.sortedAgeGroups.push(group);
    this.update.emit();
  }

  remove(group: AgeGroup) {
    this.ageGroups[this.ageGroups.indexOf(group)] = null;
    this.sortedAgeGroups.splice(this.sortedAgeGroups.indexOf(group), 1);
    this.update.emit();
  }

  public getOriginalIndex(group: AgeGroup) {
    return this.ageGroups.indexOf(group);
  }
}
