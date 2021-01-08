import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { ApiILogCalendarService } from '@/app/helpers/api/api-ilog-calendar.service';
import { ApiNotificationMessagesService } from '@/app/helpers/api/api-notification-messages.service';

import { ApiClient } from '../helpers/api-client';
import { ApiAppService } from '../helpers/api/api-app.service';
import { ApiAuthService } from '../helpers/api/api-auth.service';
import { ApiCompanyService } from '../helpers/api/api-company.service';
import { ApiCustomerAdminService } from '../helpers/api/api-customer-admin.service';
import { ApiHotelService } from '../helpers/api/api-hotel.service';
import { ApiLoggerService } from '../helpers/api/api-logger.service';
import { ApiRegistrationFormService } from '../helpers/api/api-registration-form.service';
import { ApiTemplateAdminService } from '../helpers/api/api-template-admin.service';
import { ApiService } from '../helpers/api/api.service';
import { CacheService } from '../helpers/cache.service';
import { fakeBackendProvider } from '../helpers/fake-backend';
import { apiInterceptor } from './api.interceptor';
import { loaderInterceptor } from './loader.interceptor';
import { LoaderService } from './loader.service';
import { ShowLoaderPipe } from './show-loader.pipe';

@NgModule({
  imports: [HttpClientModule],
  declarations: [ShowLoaderPipe]
})
export class HttpModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HttpModule,
      providers: [
        LoaderService,
        ApiClient,
        ApiAppService,
        ApiAuthService,
        ApiCompanyService,
        ApiCustomerAdminService,
        ApiHotelService,
        ApiILogCalendarService,
        ApiNotificationMessagesService,
        ApiRegistrationFormService,
        ApiTemplateAdminService,
        ApiService,
        ApiLoggerService,
        CacheService,
        loaderInterceptor,
        apiInterceptor,
        fakeBackendProvider,
      ],
    };
  }
}
