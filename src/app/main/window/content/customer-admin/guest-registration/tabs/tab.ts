import { EventEmitter, Output } from '@angular/core';

import { Status } from '../models';

export interface SearchData {
    name: string;
    fromDate: Date;
    untilDate: Date;
    status: Status;
    hotel: number;
    from: number;
    until: number;
    type: number;
}

export interface TabInformation {
    from: Date | null;
    until: Date | null;
}

export abstract class Tab {
    @Output() tabLoad = new EventEmitter<TabInformation>();

    abstract exportCSV(): void | Promise<void>;
    abstract exportExcel(): void | Promise<void>;
    abstract search(data: SearchData): void | Promise<void>;
}
