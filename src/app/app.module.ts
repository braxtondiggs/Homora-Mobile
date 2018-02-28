import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';

import { MyApp } from './app.component';
import { PagesModule } from '../pages/pages.module';
import { ComponentsModule } from '../components/components.module';
import { environment } from './app.environment';
import { AuthProvider } from '../providers/auth/auth';

@NgModule({
  declarations: [MyApp],
  imports: [
    PagesModule,
    ComponentsModule,
    ReactiveFormsModule,
    BrowserModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase)
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    NativePageTransitions,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider
  ]
})
export class AppModule { }
