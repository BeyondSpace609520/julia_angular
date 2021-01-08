import { Pipe, PipeTransform } from '@angular/core';

import { FormatService } from '@/ui-kit/services/format.service';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  public constructor(
    private formatService: FormatService
  ) {}

  transform(amount: number, decimals?: number): string | null {
    return this.formatService.numberFormat(amount, decimals, true);
  }
}
