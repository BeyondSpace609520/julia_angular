import { PricingForBEFE } from '@/ui-kit/components/modals/pricing-test-console/models';
import { FormatService } from '@/ui-kit/services/format.service';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pricing-test-console-shopping-cart',
  templateUrl: './pricing-test-console-shopping-cart.component.html',
  styleUrls: ['./pricing-test-console-shopping-cart.component.sass']
})
export class PricingTestConsoleShoppingCartComponent implements OnChanges {
  @Input() prices: PricingForBEFE;
  @Input() nightsStay: number;

  public adults: string | null;
  public children: string | null;
  public catering: string | null;
  public visitorsTax: string | null;
  public pet: string | null;
  public cleanup: string | null;
  public shortStay: string | null;
  public discount: string | null;
  public cot: string | null;
  public garage: string | null;
  public other: string | null;
  public total: string | null;
  public titleForTotal = '';

  constructor(
    private formatService: FormatService,
    private translate: TranslateService
  ) { }

  private parsePrices() {
    if (this.prices) {
      this.adults = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalPriceAdults + this.prices.totalPriceRoom));
      this.children = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalPriceChildren));
      this.catering = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalPriceCatering));
      this.visitorsTax = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalPriceVisitorsTax));
      this.pet = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalPricePets));
      this.cleanup = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalPriceCleanUp));
      this.shortStay = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalChargeShortStay));
      this.discount = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalDiscountLastMinute + this.prices.totalLongStayDiscount + this.prices.totalEarlyBirdDiscount));
      this.cot = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalPriceCot));
      this.garage = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalPriceGarage));
      this.other = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalChargingSchemeCharges));

      this.total = this.getFormattedPrice(this.formatService.numberFormat(this.prices.totalPriceAdults
        + this.prices.totalPriceRoom
        + this.prices.totalPriceChildren
        + this.prices.totalPriceCatering
        + this.prices.totalPriceVisitorsTax
        + this.prices.totalPricePets
        + this.prices.totalPriceCleanUp
        + this.prices.totalChargeShortStay
        + this.prices.totalDiscountLastMinute
        + this.prices.totalLongStayDiscount
        + this.prices.totalEarlyBirdDiscount
        + this.prices.totalPriceCot
        + this.prices.totalPriceGarage
        + this.prices.totalChargingSchemeCharges));
    }
  }

  private getFormattedPrice(str: string | null) {
    return str ? str : '';
  }

  private getTranslationForTotal() {
    this.translate.get('BackEnd_WikiLanguage.EPP_TotalForXXNights').subscribe((str) => {
      this.titleForTotal = str.replace('XX', this.nightsStay);
    });
  }

  ngOnChanges({ prices, nightsStay }: SimpleChanges) {
    if (prices) {
      setTimeout(() => {
        this.parsePrices();
      });
    }
    if (nightsStay) {
      this.getTranslationForTotal();
    }
  }
}
