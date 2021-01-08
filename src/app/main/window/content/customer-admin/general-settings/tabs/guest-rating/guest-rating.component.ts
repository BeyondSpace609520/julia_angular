import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { GuestRating } from '../../models';

@Component({
  selector: 'app-guest-rating',
  templateUrl: './guest-rating.component.pug',
  styleUrls: ['./guest-rating.component.sass']
})
export class GuestRatingComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public isLoading: Observable<boolean>;

  private activeChildFields = {
    share: ['active'],
    showNetwork: ['active', 'share'],
    showBooking: ['active'],
  };

  constructor(
    private apiClient: ApiClient,
    private loaderService: LoaderService
  ) {
    this.isLoading = this.loaderService.isLoading(LoaderType.RATING);
  }

  private updateActive(): void {
    Object.entries(this.activeChildFields).forEach(([target, deps]) => {
      const allActive = deps.every(d => (this.form.get(d) as FormControl).value);
      const field = this.form.get(target) as FormControl;

      if (allActive) {
        field.enable({ emitEvent: false });
      } else {
        field.disable({ emitEvent: false });
      }
    });
  }

  private listenField(name: string, field: keyof GuestRating): void {
    (this.form.get(name) as FormControl).valueChanges.pipe(untilDestroyed(this)).subscribe(val =>
      this.apiClient.saveGuestRating(field, val).toPromise()
    );
  }

  @Loading(LoaderType.RATING)
  async ngOnInit(): Promise<void> {
    const rating = await this.apiClient.getGuestRating().toPromise();

    this.form = new FormGroup({
      active: new FormControl(rating.c_guestRatingActive === 'on'),
      share: new FormControl(rating.rv_shareRatings === 'on'),
      showNetwork: new FormControl(rating.c_grUseNetworkRatings === 'on'),
      showBooking: new FormControl(rating.c_grShowRatingInBookingEdit === 'on'),
    });

    this.listenField('active', 'c_guestRatingActive');
    this.listenField('share', 'rv_shareRatings');
    this.listenField('showNetwork', 'c_grUseNetworkRatings');
    this.listenField('showBooking', 'c_grShowRatingInBookingEdit');

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.updateActive());
    this.updateActive();
  }

  ngOnDestroy(): void {}
}
