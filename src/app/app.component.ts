import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular';
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
    auth: AuthProvider,
    platform: Platform,
    splashScreen: SplashScreen) {
    afs.app.firestore().settings({ timestampsInSnapshots: true });
    this.rootPage = auth.showIntro() ? IntroPage : MainPage;
    platform.ready().then(() => {
      splashScreen.hide();
    });
  }
}
