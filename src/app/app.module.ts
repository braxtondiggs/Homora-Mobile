import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Ionic2MaskDirective } from 'ionic2-mask-directive';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { DragulaModule } from 'ng2-dragula';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Facebook } from '@ionic-native/facebook';
import { EmailComposer } from '@ionic-native/email-composer';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { Camera } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Firebase } from '@ionic-native/firebase';

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
    DragulaModule.forRoot(),
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
    NativePageTransitions,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    FcmProvider,
    ListingProvider,
    UserProvider,
    GeoLocationProvider
  ]
})
export class AppModule { }
