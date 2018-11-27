import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { IntroPage } from '../pages/intro/intro';
import { MainPage } from '../pages/main';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  constructor(afs: AngularFirestore,
    geolocation: Geolocation,
    auth: AuthProvider,
    platform: Platform,
    splashScreen: SplashScreen) {
    afs.app.firestore().settings({ timestampsInSnapshots: true });
    this.rootPage = auth.showIntro() ? IntroPage : MainPage;
    Promise.all([
      geolocation.getCurrentPosition(),
      platform.ready()
    ]).then(() => {
      splashScreen.hide();
    });
  }
}
