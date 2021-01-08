import {
  Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild
} from '@angular/core';

import { Customer, User } from '@/app/auth/models';
import { redirectToCustomer } from '@/app/helpers/static.functions';

const listLimit = 20;

@Component({
  selector: 'app-customer-selector',
  templateUrl: './customer-selector.component.pug',
  styleUrls: ['./customer-selector.component.sass']
})
export class CustomerSelectorComponent implements OnChanges {

  search = '';
  customers: Customer[] = [];
  highlightedIndex = 0;

  @Input() user!: User;
  @Output() customerSelectorReady = new EventEmitter();

  @HostBinding('class.header-dropdown') readonly dropdownClass = true;
  @HostBinding('class.toggled') opened = false;
  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
  @HostListener('mouseleave') onMouseLeave() {
    this.opened = false;
  }

  constructor() { }

  filterList(): void {
    if (!this.user || !this.user.databases) {
      this.customers = [];
      this.customerSelectorReady.emit();
      return;
    }
    this.customers = this.user.databases.filter(customer => {
      if (!this.search) {
        return true;
      }
      return [
        customer.city,
        customer.postCode,
        customer.databaseName,
        customer.companyName,
        customer.id.toString()
      ].some(value => value && value.toLowerCase().match(this.search.toLowerCase()));
    }).slice(0, listLimit - 1);
    this.customerSelectorReady.emit();
    if (this.highlightedIndex >= this.customers.length) {
      this.highlightedIndex = Math.max(this.customers.length - 1, 0);
    }
  }

  keyPressed(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.moveHighlight(-1);
        break;
      case 'ArrowDown':
        this.moveHighlight(1);
        break;
      case 'Enter':
        this.selectCustomer(this.highlightedIndex);
        break;
    }
  }

  selectCustomer(index: number): void {
    if (index >= this.customers.length || index < 0) {
      return;
    }
    const customer: Customer = this.customers[index];
    redirectToCustomer(customer.id);
  }

  toggle(): void {
    this.highlightedIndex = 0;
    this.opened = !this.opened;
    if (this.opened) {
      this.searchInput.nativeElement.focus();
      this.searchInput.nativeElement.select();
    }
  }

  private moveHighlight(delta: number): void {
    if (this.highlightedIndex === null) {
      this.highlightedIndex = 0;
      return;
    }
    const limit = this.customers.length;
    this.highlightedIndex = (this.highlightedIndex + delta) % limit;
    if (this.highlightedIndex < 0) {
      this.highlightedIndex += limit;
    }
  }

  ngOnChanges({user}: SimpleChanges): void {
    if (user) {
      this.filterList();
    }
  }

}
