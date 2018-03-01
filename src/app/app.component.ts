import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { Observable } from 'rxjs/Observable';
import { User } from '../models';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: string;
  user$: Observable<User>;
  private userDoc: AngularFirestoreDocument<User>;
  constructor(afs: AngularFirestore, afAuth: AngularFireAuth, auth: AuthProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    this.rootPage = auth.showIntro() ? 'intro' : 'main';
    afAuth.authState.subscribe((user: any) => {
      if (user) {
        this.userDoc = afs.doc<User>(`Users/${user.uid}`);
        this.user$ = this.userDoc.valueChanges();
      }
    });
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
