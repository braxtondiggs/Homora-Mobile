import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IntroPage } from '../pages/intro/intro';
import { MainPage } from '../pages/main/main';
import { AuthProvider } from '../providers/auth/auth';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  constructor(private auth: AuthProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.rootPage = this.auth.showIntro() ? IntroPage : MainPage;
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
