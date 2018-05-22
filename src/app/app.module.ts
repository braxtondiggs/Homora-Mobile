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
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Facebook } from '@ionic-native/facebook';
import { EmailComposer } from '@ionic-native/email-composer';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { Camera } from '@ionic-native/camera';
import { Firebase } from '@ionic-native/firebase';
// import { Push } from '@ionic-native/push';

import { MyApp } from './app.component';
import { PagesModule } from '../pages/pages.module';
import { ComponentsModule } from '../components/components.module';
import { environment } from './app.environment';
import { AuthProvider, ListingProvider, UserProvider } from '../providers';
import { GeoLocationProvider } from '../providers/geolocation/geolocation';

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
    StatusBar,
    SplashScreen,
    Geolocation,
    Firebase,
    Facebook,
    EmailComposer,
    Camera,
    NativePageTransitions,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    ListingProvider,
    UserProvider,
    GeoLocationProvider
  ]
})
export class AppModule { }
