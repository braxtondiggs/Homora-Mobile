import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string;
  constructor(auth: AuthProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.rootPage = auth.showIntro() ? 'intro' : 'main';
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
