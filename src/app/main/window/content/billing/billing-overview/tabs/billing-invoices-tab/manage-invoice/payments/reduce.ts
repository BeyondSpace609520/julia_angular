import { PrintPaymentCardResponse, PrintPaymentCashResponse, RawPrintPaymentCardResponse, RawPrintPaymentCashResponse } from './models';

export function reduceResponse1(r: RawPrintPaymentCardResponse): PrintPaymentCardResponse {
    return {
        isCashPayment: false,
        pdfFilename: r.pdf_filename
    };
}

export function reduceResponse2(r: RawPrintPaymentCashResponse): PrintPaymentCashResponse {
    return {
        isCashPayment: true,
        pdfFilename: r.pdf_filename,
        justSending: r.justSending === 'on',
        cashPaymentDefaultFormat: r.cashPaymentDefaultFormat,
        validPayment: r.validPayment === 'on',
        id: +r.rc_id,
        sendingDurationLeft: r.sendingDurationLeft
    };
}
