import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular';
// import { Push } from '@ionic-native/push';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { IntroPage } from '../pages/intro/intro';
import { MainPage } from '../pages/main'
// import { FcmProvider } from '../providers';
// import { tap } from 'rxjs/operators';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  constructor(// private fcm: FcmProvider,
    // private push: Push,
    platform: Platform,
    auth: AuthProvider,
    splashScreen: SplashScreen,
    afs: AngularFirestore) {
    afs.app.firestore().settings({ timestampsInSnapshots: true });
    this.rootPage = auth.showIntro() ? IntroPage : MainPage;
    platform.ready().then(() => {
      // fcm.getToken();
      splashScreen.hide();
      // this.setupPushNotifications();
    });
  }

  /*private setupPushNotifications() {
    if (this.platform.is('cordova')) {
      this.push.hasPermission().then((res: any) => { });
      this.fcm.listenToNotifications().pipe(tap((msg) => {
        console.log(msg);
      })).subscribe();
    }
  }*/
}
