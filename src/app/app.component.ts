import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AuthProvider } from '../providers/auth/auth';
import { IntroPage } from '../pages/intro/intro';
import { MainPage } from '../pages/main';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  constructor(geolocation: Geolocation,
    auth: AuthProvider,
    platform: Platform,
    splashScreen: SplashScreen) {
    this.rootPage = auth.showIntro() ? IntroPage : MainPage;
    Promise.all([
      geolocation.getCurrentPosition(),
      platform.ready()
    ]).then(() => {
      splashScreen.hide();
    });
  }
}
