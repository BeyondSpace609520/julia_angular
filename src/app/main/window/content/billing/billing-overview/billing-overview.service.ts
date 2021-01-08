import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingOverviewService {

  private updateList = new Subject<string>();

  updateList$ = this.updateList.asObservable();

  constructor() {
  }

  updateListEvent(): void {
    this.updateList.next();
  }
}
