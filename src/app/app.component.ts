import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { IntroPage } from '../pages/intro/intro';
import { MainPage } from '../pages/main'
import { FcmProvider } from '../providers';
import { tap } from 'rxjs/operators';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  constructor(private fcm: FcmProvider,
    private push: Push,
    auth: AuthProvider,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen) {
    this.rootPage = auth.showIntro() ? IntroPage : MainPage;
    platform.ready().then(() => {
      fcm.getToken();
      statusBar.styleDefault();
      splashScreen.hide();
      this.setupPushNotifications();
    });
  }

  private setupPushNotifications() {
    this.push.hasPermission().then((res: any) => { });
    this.fcm.listenToNotifications().pipe(tap((msg) => {
      console.log(msg);
    })).subscribe()
  }
}
