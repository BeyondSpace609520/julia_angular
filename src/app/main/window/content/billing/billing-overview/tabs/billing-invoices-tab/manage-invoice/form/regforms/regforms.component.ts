import { Component, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { RegForm } from '../models';

@Component({
  selector: 'app-regforms',
  templateUrl: './regforms.component.pug',
  styleUrls: ['./regforms.component.sass'],
})
export class RegformsComponent {
  public registrationForms: RegForm[] = [];
  public selected: RegForm | null = null;
  public isSaveTriggered = new EventEmitter<void>();

  public isLoading: Observable<boolean>;

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.REGFORMS);
  }

  @Loading(LoaderType.REGFORMS)
  public async init(bookingId: number): Promise<void> {
    this.registrationForms = await this.apiClient
      .getRegForms(bookingId)
      .toPromise();
  }

  public removeSelected() {
    if (this.selected) {
      this.registrationForms.splice(
        this.registrationForms.indexOf(this.selected),
        1
      );
    }
  }

  public onRegisterDblClick(item: RegForm | null) {
    if (!item) {
      return;
    }
    this.isSaveTriggered.emit();
  }
}
