import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../loader-types';
import { OnChangeFunction, OnInsertFunction } from '../types';

@Component({
  selector: 'app-insert-modal-body',
  templateUrl: './body.component.pug',
  styleUrls: ['./body.component.sass']
})
export class InsertModalBodyComponent implements OnDestroy {

  label = '';
  name = new FormControl(null, [Validators.required]);
  onInsert: OnInsertFunction;
  isLoading: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.ON_SAVE);
  }

  init(label: string, value: string, f: OnInsertFunction, onChange: OnChangeFunction): void {
    this.label = label;
    this.onInsert = f;

    this.name.valueChanges.pipe(untilDestroyed(this)).subscribe(() => onChange(this.name.valid));
    this.name.setValue(value);
  }

  @Loading(LoaderType.ON_SAVE)
  async onSave(): Promise<boolean> {
    return await this.onInsert(this.name.value);
  }

  ngOnDestroy(): void {}
}
