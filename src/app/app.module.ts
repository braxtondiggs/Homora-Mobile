import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Ionic2MaskDirective } from 'ionic2-mask-directive';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';

import { MyApp } from './app.component';
import { PagesModule } from '../pages/pages.module';
import { ComponentsModule } from '../components/components.module';
import { environment } from './app.environment';
import { AuthProvider, FcmProvider, GeoLocationProvider, ListingProvider, UserProvider } from '../providers';

@NgModule({
  declarations: [MyApp, Ionic2MaskDirective],
  imports: [
    PagesModule,
    ComponentsModule,
    ReactiveFormsModule,
    BrowserModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      preloadModules: true
    }),
    AngularFireModule.initializeApp(environment.firebase)
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    SplashScreen,
    Geolocation,
    Firebase,
    Facebook,
    EmailComposer,
    Camera,
    InAppBrowser,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    FcmProvider,
    ListingProvider,
    UserProvider,
    GeoLocationProvider
  ]
})
export class AppModule { }
