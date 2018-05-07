import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from './login/login';
import { SignupPage } from './signup/signup';
import { MainPage } from '../main';
import { User } from '../../interface'

@Component({
  selector: 'auth-page',
  templateUrl: 'auth.html'
})
export class AuthPage {
  constructor(private nav: NavController,
    private nativePageTransitions: NativePageTransitions,
    private toast: ToastController,
    public auth: AuthProvider,
    private afs: AngularFirestore, ) { }

  login() {
    this.nav.push(LoginPage, {}, { animate: true, direction: 'forward' });
  }

  signup() {
    this.nav.push(SignupPage, {}, { animate: true, direction: 'forward' });
  }

  authPromise(action: Promise<any>): void {
    action.then((res: any) => {
      if (res.additionalUserInfo.isNewUser) {
        let userDoc: AngularFirestoreDocument<User> = this.afs.collection<User>('Users').doc(res.user.uid);
        const userData: User = {
          $key: res.user.uid,
          email: res.additionalUserInfo.profile.email,
          firstName: res.additionalUserInfo.profile.given_name,
          lastName: res.additionalUserInfo.profile.family_name,
          gender: res.additionalUserInfo.profile.gender === 'female' ? 'Female' : 'Male',
          images: [{
            src: res.additionalUserInfo.profile.picture,
            name: 'provider'
          }]
        };
        userDoc.set(userData).then(() => {
          this.continue();
        });
      } else {
        this.continue();
      }
    }, (err: any) => {
      this.showToast(err.message);
    });
  }

  private continue(): void {
    this.auth.skipIntro();
    this.nav.push(MainPage, {}, { animate: false }).then(() => {
      this.nav.remove(0, this.nav.getActive().index);
    });
  }

  ionViewDidLoad() {
    this.nativePageTransitions.slide({
      direction: 'up',
      duration: 500,
      slowdownfactor: 3,
      slidePixels: 20,
      iosdelay: 100,
      androiddelay: 150,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 60
    } as NativeTransitionOptions);
  }

  showToast(message: string): void {
    this.toast.create({
      message,
      duration: 3000,
      showCloseButton: true
    }).present();
  }
}
