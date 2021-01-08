import { Trigger } from '@/app/main/models';

export interface RawPrintPaymentCardResponse {
    isCashPayment: 'off';
    pdf_filename: string;
}

export interface RawPrintPaymentCashResponse {
    isCashPayment: 'on';
    pdf_filename: string;
    justSending: Trigger;
    cashPaymentDefaultFormat: string;
    validPayment: Trigger;
    rc_id: string;
    sendingDurationLeft: number;
}

export interface PrintPaymentCardResponse {
    isCashPayment: false;
    pdfFilename: string;
}

export interface PrintPaymentCashResponse {
    isCashPayment: true;
    pdfFilename: string;
    justSending: boolean;
    cashPaymentDefaultFormat: 'manual' | 'A4' | string;
    validPayment: boolean;
    id: number;
    sendingDurationLeft: number;
}
