import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';

enum LoaderType {
  LOAD_MODAL = 'load-modal'
}

export type CopyToId = string | number;
export type OnSaveFunction = (ids: CopyToId[][]) => void;
export interface CopyToSectionItem {
  id: CopyToId;
  label: string;
  tooltip?: string;
  checked?: boolean;
  readonly?: boolean;
}
export interface CopyToSection {
  label: string;
  items: CopyToSectionItem[];
}

@Component({
  selector: 'app-copy-to',
  templateUrl: './copy-to.component.pug',
  styleUrls: ['./copy-to.component.sass']
})
export class CopyToComponent implements OnInit, OnDestroy {

  form: FormArray;
  source?: string;
  description?: string | null;
  formStruct: CopyToSection[];
  onSave: OnSaveFunction;
  isLoading: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading = this.loaderService.isLoading(LoaderType.LOAD_MODAL);
  }

  init(
    props: { source?: string; description?: string } | string,
    sections: CopyToSection[],
    onSave: OnSaveFunction
  ): void {
    this.source = typeof props === 'string' ? props : props.source;
    this.description =  typeof props === 'string' ? null : props.description;
    this.formStruct = sections;
    this.onSave = onSave;
  }

  private getCheckedItems(section: CopyToSection, associatedControlIndex: number): CopyToId[] {
    const items = this.form.controls[associatedControlIndex].get('items') as FormArray;

    return section.items.filter((_, i) => items.controls[i].value).map(item => item.id);
  }

  @Loading(LoaderType.LOAD_MODAL)
  public async save(): Promise<void> {
    const data = this.formStruct.map((section, i) =>  this.getCheckedItems(section, i));

    await this.onSave(data);
  }

  @Loading(LoaderType.LOAD_MODAL)
  async ngOnInit(): Promise<void> {
    this.form = new FormArray(this.formStruct.map(section => {
      const all =  new FormControl(false);
      const items = new FormArray(section.items.map(item => new FormControl({
        value: item.checked || false,
        disabled: item.readonly
      })));

      all.valueChanges.pipe(untilDestroyed(this)).subscribe(isAll => {
        items.controls.forEach(c => c.disabled || c.setValue(isAll));
      });

      return new FormGroup({
        all,
        items
      });
    }));
  }

  ngOnDestroy(): void {}
}
