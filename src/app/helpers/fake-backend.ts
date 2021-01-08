import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
// tslint:disable-next-line: max-line-length
import { CustomerBooking, CustomerBookingLogBooking, CustomerBookingLogRoom, Room } from '../main/window/content/customer-admin/company-customer-admin/models';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(800))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                // mockServer - fake response only in local configuration
                case url.endsWith('/customer-admin/detail') && method === 'GET':
                    return getCustomerDetail();
                case url.endsWith('/customer-admin/booking/log') && method === 'GET':
                    return getCustomerBookingLog();
                case url.endsWith('/customer-admin/interaction') && method === 'GET':
                    return getCustomerInteraction();
                default:
                    return next.handle(request);
            }
        }

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ message });
        }

        function checkAuth() {
            // return unauthorized();

            return ok({ l_id: 1 });
        }

        function getCustomerDetail() {
            return ok({
                accountNo: 345435,
                salutation: 'Mr.',
                title: 'title',
                firstName: 'name',
                lastName: 'surname',
                email: 'email',
                email2: 'email2',
                channelEmail: 'channelEmail',
                phoneNo: '3424234234',
                address: 'str.',
                postCode: 234,
                country: 'Ukraine',
                locale: 'en',
                ip: '127.0.0.1',
                creationDate: new Date(),
                birthday: new Date(),
                identNo: 344234234,
                taxNumber: 5555,
                internalInformation: '-',
                sendNewsletter: true,
                sendSafeEmail: false,
                sendThankyouEmail: false,
                sendPaymentsEmail: false,
                sendRegionalEvents: false,
                anonymizationDate: new Date(),
                allowAutoAnonymization: true
            });
        }

        function getCustomerBookingLog() {
            const roomLog: CustomerBookingLogRoom = {
                action: 'room_added',
                date: new Date(),
                user: 'test@test.com',
                roomId: '456',
                specialOffer: 'kjhk',
                arrival: new Date(),
                departure: new Date(),
                catering: '-',
                nights: 2,
                persons: 3,
                children: 1,
                smallPets: 2,
                largePets: 0,
                babyBeds: 0,
                parkingSpace: 1,
                childrenAges: [14],
                priceAdults: 300,
                priceChildren: 80,
                priceCatering: 100,
                visitorsTax: 34,
                pricePets: 70,
                cleaningCharge: 0,
                totalDiscount: 0,
                shortStayCharge: 28,
                priceBabyBeds: 23,
                priceParking: 46,
                surcharges: 24,
                total: 600
            };

            const bookingLog: CustomerBookingLogBooking = {
                action: 'booking_added',
                date: new Date(),
                user: 'test@test.com',
                lang: 'en',
                status: 'jj',
                guestId: 67,
                payment: 'jkl',
                bookingNumber: '5a',
                emailText: '',
                headerText: '<>',
                footerText: '<>',
                depositProposed: 67,
                depositPaid: 84,
                depositDueDate: new Date(),
                paymentReminderDate: new Date(),
                cancellationFee: 6,
                validUntilDate: new Date(),
                locked: true
            };

            return ok([
                roomLog,
                bookingLog
            ]);
        }

        function getCustomerInteraction() {
            return ok([
                {
                    refNo: 45,
                    status: 'test',
                    date: new Date(),
                    status2: 'test',
                    readDate: new Date(),
                    email: 'test@test.com',
                    total: 456
                }
            ]);
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
