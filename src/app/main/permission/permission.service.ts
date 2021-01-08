import { Injectable } from '@angular/core';

import { combineLatest, fromEvent, merge } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { MainService } from '../main.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  can = {
    accessAdminArea: false,
    export: false,
    import: false,
    seeRating: false,
    setAttachEvents: false,
    seeHtmlCalendar: false,
    guestRegistration: false,
    guestMap: false,
    seeInsurance: false,
    forceEdit: false,
    notForceEdit: true,
    casablancaNew: false,
    seeRegistrationNumbers: false,
    gapFillEnabled: false,
    seeAdvancedPricing: false,
    seeRoomOwnerModule: false,
    seeAATPortal: false,
  };

  constructor(private mainService: MainService) {
    this.mainService.company$.subscribe(company => {
      if (!company) { return; }

      this.can.accessAdminArea = company.au_isAdmin === 'on';

      this.can.export = company.customerStatus === 'Demo' || company.customerStatus === 'Test' || company.au_isAdmin === 'off';
      this.can.import = company.hasFeratelHotelCode === 'on';
      this.can.seeRating = company.c_guestRatingActive === 'on';
      this.can.setAttachEvents = company.hasFeratelHotelCode === 'on';

      this.can.seeHtmlCalendar = company.c_useAngularRoomplan === 'on';
      this.can.guestRegistration = +company.customer_country_id !== 232;
      this.can.guestMap = company.c_guestMapActive === 'on';

      this.can.seeInsurance = company.erActive === 'on';
      this.can.casablancaNew = company.casablancaNew === 'on';
      this.can.seeRegistrationNumbers = company.c_meldewesen !== 'off';

      this.can.gapFillEnabled = company.c_gapFillEnabled === 'on';

      this.can.seeAdvancedPricing = company.c_hasAdvancedPricingModule === 'on';

      this.can.seeRoomOwnerModule = company.c_roomOwnerModule === 'on';

      this.can.seeAATPortal = company.c_aatAdminPortal === 'on';
    });

    const ctrlPress$ = merge(fromEvent(document, 'keydown'), fromEvent(document, 'keyup')).pipe(
      filter((e: KeyboardEvent) => e.key === 'Control'),
      map((e: KeyboardEvent) => e.type === 'keydown'),
      distinctUntilChanged()
    );

    combineLatest(this.mainService.company$, ctrlPress$).subscribe(([company, ctrlPressed]) => {
      this.can.forceEdit = company ? company.c_notObligedToCashRegisterLaw === 'on' && ctrlPressed : false;
      this.can.notForceEdit = !this.can.forceEdit;
    });
  }
}
