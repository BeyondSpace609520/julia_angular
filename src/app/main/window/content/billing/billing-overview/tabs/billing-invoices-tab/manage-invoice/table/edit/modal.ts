import { Type } from '@angular/core';

import { ModalOptions } from 'easybooking-ui-kit/services/modal.service';

import { VersionDetail } from '../../models';
import { EditType1Component } from './edit-type1/edit-type1.component';
import { EditType2Component } from './edit-type2/edit-type2.component';
import { EditType3Component } from './edit-type3/edit-type3.component';
import { EditType4Component } from './edit-type4/edit-type4.component';
import { ModalBody } from './modal-body';

interface ModalEdit {
    body: Type<ModalBody>;
    opts?: ModalOptions;
}

export function getEditModal(item: VersionDetail, isStandaloneBill: boolean): ModalEdit {
  if (item.isRoomBookingDetail) {
    return {
      body: EditType1Component
    };
  }

  if (!item.isRoomBookingDetail && item.bookingProductId === 0 && !isStandaloneBill) {
    return {
      body: EditType2Component
    };
  }

  if (isStandaloneBill || (item.bookingProductId > 0 && (item.insuranceProductId === null || item.insuranceProductId === 0))) {
    return {
      body: EditType3Component,
      opts: {
        ngbOptions: {
          size: 'lg'
        },
        hidePrimaryButton: true
      }
    };
  }

  if (item.insuranceProductId && item.insuranceProductId > 0) { return {
    body: EditType4Component
  };
  }

  throw new Error(`Edit body not found for the item ${item.text}`);
}
