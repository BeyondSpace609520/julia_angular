import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthCommonModule } from './auth/auth.module';
import { UserService } from './auth/user.service';
import { InitGuard } from './helpers/init/init.guard';
import { InitService } from './helpers/init/init.service';
import { SplashComponent } from './helpers/splash/splash.component';
import { I18nModule } from './i18n/i18n.module';
import { AuthScreenModule } from './main/auth-screen/auth-screen.module';
import { reactiveEmbedModules } from './main/embed/embed.module';
import { reactiveModules } from './main/window/window.module';
import { HttpModule } from './shared/http.module';

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthCommonModule,
    AuthScreenModule,
    I18nModule.forRoot(),
    HttpModule.forRoot(),
    BrowserAnimationsModule,
    ...reactiveModules,
    ...reactiveEmbedModules
  ],
  bootstrap: [AppComponent],
  providers: [InitService, InitGuard, UserService]
})
export class AppModule { }
