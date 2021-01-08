import { ContractRenewalData } from '@/ui-kit/components/modals/contract-renewal/models';
import { DATE_FORMAT_PROVIDER, PipeDate } from '@/ui-kit/injection';
import { FormatService } from '@/ui-kit/services/format.service';
import { Component, Inject, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-pricing',
  templateUrl: './new-pricing.component.html',
  styleUrls: ['./new-pricing.component.sass']
})
export class NewPricingComponent implements OnInit {

  @Input() contact!: ContractRenewalData['contact'];
  @Input() validUntilDate!: Date;

  validUntil: string;

  constructor(
    @Inject(DATE_FORMAT_PROVIDER) private dateFormatter: PipeDate,
    private formatService: FormatService
  ) { }

  ngOnInit(): void {
    this.validUntil = this.formatService.dateFormat(this.validUntilDate, this.dateFormatter.getFormat()) || '';
  }

}
