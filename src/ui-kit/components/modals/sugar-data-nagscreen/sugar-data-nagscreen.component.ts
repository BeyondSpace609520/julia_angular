import { ApiSupportFormService } from '@/app/helpers/api/api-support-form.service';
import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SugarNagScreenData } from './sugar.data-nagscreen.model';

@Component({
  selector: 'app-sugar-data-nagscreen',
  templateUrl: './sugar-data-nagscreen.component.html',
  styleUrls: ['./sugar-data-nagscreen.component.scss'],
})
export class SugarDataNagscreenComponent implements OnInit {
  public inputColorStr: string = '#616f77';
  public data: SugarNagScreenData;
  public form: FormGroup;
  public page: number = 1;
  public  ar: Array<String>;
  public showMembershipOthers: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private apiSupportFormService: ApiSupportFormService,
  ) { 
  }

  ngOnInit() {
    this.getData();
  }

  private async getData() {
    this.data = await this.apiSupportFormService.getSugarNagScreenData().toPromise();
    this.initForm()
    this.showMembershipOthers = this.data.c_memberships.includes('other');
  }

  private async initForm(): Promise<void> {
    this.form = new FormGroup({
      addressLine: new FormControl(this.data.addressLine, Validators.required),
      postCode: new FormControl(this.data.postCode, Validators.required),
      city: new FormControl(this.data.city, Validators.required),
      country: new FormControl(this.data.country, Validators.required),
      email: new FormControl(this.data.email, Validators.required),
      phone: new FormControl(this.data.phone, Validators.required),
      website: new FormControl(this.data.website),
      businessPlan: new FormControl(this.data.businessPlan, Validators.required),
      c_firstName: new FormControl(this.data.c_firstName, Validators.required),
      c_lastName: new FormControl(this.data.c_lastName, Validators.required),
      c_email: new FormControl(this.data.c_email, Validators.required),
      c_phone: new FormControl(this.data.c_phone),
      c_mobil: new FormControl(this.data.c_mobil),
      hasBillingAddress: new FormControl(this.data.hasBillingAddress),
      billing_invoice_recipient_c: new FormControl(this.data.billing_invoice_recipient_c, Validators.required),
      billing_invoice_recipient2_c: new FormControl(this.data.billing_invoice_recipient2_c),
      billing_addressLine: new FormControl(this.data.billing_addressLine, Validators.required),
      billing_postCode: new FormControl(this.data.billing_postCode, Validators.required),
      billing_city: new FormControl(this.data.billing_city, Validators.required),
      billing_country: new FormControl(this.data.billing_country, Validators.required),
      c_technicalAffinity: new FormControl(this.data.c_technicalAffinity, Validators.required),
      c_memberships: new FormControl(this.data.c_memberships),
      c_category: new FormControl(this.data.c_category),
      c_memberships_other: new FormControl(this.data.c_memberships_other),
    });
    this.changeBillingValdation()
  }

  changeBillingValdation() {
    const billing_invoice_recipient_c: FormControl = <FormControl>this.form.get('billing_invoice_recipient_c');
    const billing_addressLine: FormControl = <FormControl>this.form.get('billing_addressLine');
    const billing_postCode: FormControl = <FormControl>this.form.get('billing_postCode');
    const billing_city: FormControl = <FormControl>this.form.get('billing_city');
    const billing_country: FormControl = <FormControl>this.form.get('billing_country');
    if (this.data.hasBillingAddress === 'on') {
      billing_invoice_recipient_c.setValidators([Validators.required]);
      billing_addressLine.setValidators([Validators.required]);
      billing_postCode.setValidators([Validators.required]);
      billing_city.setValidators([Validators.required]);
      billing_country.setValidators([Validators.required]);
    } else if (this.data.hasBillingAddress === 'off') {
      billing_invoice_recipient_c.setValidators([]);
      billing_addressLine.setValidators([]);
      billing_postCode.setValidators([]);
      billing_city.setValidators([]);
      billing_country.setValidators([]);
    }
    billing_invoice_recipient_c.updateValueAndValidity();
    billing_addressLine.updateValueAndValidity();
    billing_postCode.updateValueAndValidity();
    billing_city.updateValueAndValidity();
    billing_country.updateValueAndValidity();
  }

  public showOthers() {
    this.showMembershipOthers = (<HTMLInputElement>document.getElementById('other')).checked;
  }

  public async save() {
    let dataToSave = this.form.getRawValue();
    dataToSave.c_category = this.checkCategoryCheckboxes();
    if (dataToSave.c_category === '' ) {
      this.inputColorStr = '#d53e2f'
      return;
    }
    this.inputColorStr = '#616f77';
    dataToSave.c_memberships = this.checkMembershipCheckboxes();
    if (dataToSave.hasBillingAddress === 'off') {
      dataToSave.billing_invoice_recipient_c = '';
      dataToSave.billing_addressLine = '';
      dataToSave.billing_postCode = '';
      dataToSave.billing_city = '';
      dataToSave.billing_country = '';
    }
    if (dataToSave.c_memberships.includes('other') === false) {
      dataToSave.c_memberships_other = '';
    }
    await this.apiSupportFormService.saveSugarNagScreenData(dataToSave).toPromise();
    this.activeModal.close();
  }

  public checkCategoryCheckboxes() {
    this.ar = new Array<String>();
    for(let i = 0; i < this.data.categoryList.length; i++) {
      const checkboxValue = (<HTMLInputElement>document.getElementById(this.data.categoryList[i].id)).checked? 'on' : 'off';
      if (checkboxValue === 'on') {
        this.ar.push(this.data.categoryList[i].id);
      }
    }
    return this.ar.toString();
  }

  public checkMembershipCheckboxes() {
    this.ar = new Array<String>();
    for(let i = 0; i < this.data.membershipsList.length; i++) {
      const checkboxValue = (<HTMLInputElement>document.getElementById(this.data.membershipsList[i].id)).checked? 'on' : 'off';
      if (checkboxValue === 'on') {
        this.ar.push(this.data.membershipsList[i].id);
      }
    }
    return this.ar.toString();
  }

  public hasBillingCheck(event) {
    this.data.hasBillingAddress = event.srcElement.checked === true ? 'on' : 'off';
    this.changeBillingValdation();
  }

  public proceed() {
    if (this.form.valid) {
      this.inputColorStr = '#616f77';
      this.page = 2;
    } else {
      this.inputColorStr = '#d53e2f';
    }
  }
}
