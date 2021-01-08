import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';

import { Pricing } from '../../../models';
import { AgeGroup, AgeGroupsService } from './age-groups.service';


@Component({
  selector: 'app-age-groups',
  templateUrl: './age-groups.component.pug',
  styleUrls: ['./age-groups.component.sass'],
})
export class AgeGroupsComponent implements OnChanges, OnDestroy {
  @Input() pricing!: Pricing;
  @Input() canReset = true;
  @Output() resetGroups = new EventEmitter();

  ageGroupsForm: Map<AgeGroup, FormGroup>;
  selectedGroup: AgeGroup | null = null;

  constructor(private ageService: AgeGroupsService) {}

  selectGroup(item: AgeGroup): void {
    this.selectedGroup = item;
  }

  ngOnChanges({ pricing }: SimpleChanges) {
    if (pricing && pricing.currentValue !== pricing.previousValue) {
      this.ageGroupsForm = new Map();
      this.pricing.ageGroups.map((group) => {
        this.ageGroupsForm.set(group, this.createGroupControl(group));
      });

      this.ageService.setGroups(this.pricing.ageGroups);
    }
  }

  private createGroupControl(ageGroup: Pricing['ageGroups'][0]) {
    const group = new FormGroup({
      from: new FormControl(ageGroup.from),
      to: new FormControl(ageGroup.to),
      percDiscount: new FormControl(ageGroup.percDiscount),
    });

    group.valueChanges.pipe(untilDestroyed(this)).subscribe(({ from, to, percDiscount }) => {
      this.ageService.edit(ageGroup, +from, +to, +percDiscount);
    });

    return group;
  }

  extractAgeGroup(g: AbstractControl): Pricing['ageGroups'][0] {
    return {
      from: +(g.get('from') as FormControl).value,
      to: +(g.get('to') as FormControl).value,
      percDiscount: +(g.get('percDiscount') as FormControl).value,
    };
  }

  addGroup() {
    const data = {
      from: 0,
      to: 0,
      percDiscount: 0,
    };

    this.ageGroupsForm.set(data, this.createGroupControl(data));
    this.ageService.add(data);
  }

  removeGroup(group: Pricing['ageGroups'][0]) {
    this.ageGroupsForm.delete(group);
    this.ageService.remove(group);
  }

  getGroupForm(group: Pricing['ageGroups'][0]) {
    return this.ageGroupsForm.get(group);
  }

  ngOnDestroy() {}
}
