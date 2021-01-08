import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

import { isDate } from 'date-fns';
import { PipeDate } from 'easybooking-ui-kit/injection';

import { MainService } from '../main.service';

@Pipe({
    name: 'ebDate'
})
export class EbDatePipe implements PipeTransform, PipeDate {

    constructor(private datePipe: DatePipe, private mainService: MainService) {}

    public getFormat(appendTime?: boolean, angularFormat = false) {
        // https://trello.com/c/L0tlPClE/65-customer-admin-guest-interaction-fixes-changes
        let dateFormat = this.mainService.getCompanyDetails().df_format;

        if (angularFormat) { // Angular's pipe and date-fns have different format standards
            dateFormat = dateFormat.replace('DD', 'dd').replace('YYYY', 'yyyy');
        }

        return `${dateFormat}${appendTime ? ' HH:mm:ss' : ''}`;
    }

    transform(value: Date, appendTime: boolean): string;
    transform(value: any, appendTime: boolean = true): string | undefined | null {
        return value && this.datePipe.transform(isDate(value) ? value : new Date(value), this.getFormat(appendTime, true));
    }
}
