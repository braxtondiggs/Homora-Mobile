import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from './login/login';
import { SignupPage } from './signup/signup';
import { MainPage } from '../main';
import { User } from '../../interface'
import * as  moment from 'moment';

@Component({
  selector: 'auth-page',
  templateUrl: 'auth.html'
})
export class AuthPage {
  constructor(private nav: NavController,
    private nativePageTransitions: NativePageTransitions,
    private toast: ToastController,
    public auth: AuthProvider,
    private afs: AngularFirestore,
    public platform: Platform) { }

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
          created: moment().toDate(),
          email: res.additionalUserInfo.profile.email,
          firstName: res.credential.providerId === 'facebook.com' ? res.additionalUserInfo.profile.first_name : res.additionalUserInfo.profile.given_name,
          lastName: res.credential.providerId === 'facebook.com' ? res.additionalUserInfo.profile.last_name : res.additionalUserInfo.profile.family_name,
          gender: res.additionalUserInfo.profile.gender === 'female' ? 'Female' : 'Male',
          images: [{
            src: res.credential.providerId === 'facebook.com' ? res.additionalUserInfo.profile.picture.data.url : res.additionalUserInfo.profile.picture,
            name: 'provider'
          }],
          notifications: {
            policy: {
              text: false,
              email: true,
              push: true
            },
            messages: {
              text: false,
              email: true,
              push: true
            }
          }
        };
        if (res.additionalUserInfo.profile.birthday) {
          userData.birthdate = moment(res.additionalUserInfo.profile.birthday).toDate();
        }
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
    this.platform.ready().then(() => {
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
    });
  }

  showToast(message: string): void {
    this.toast.create({
      message,
      duration: 3000,
      showCloseButton: true
    }).present();
  }
}
