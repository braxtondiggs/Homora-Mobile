import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from './login/login';
import { SignupPage } from './signup/signup';
import { MainPage } from '../main';

@Component({
  selector: 'auth-page',
  templateUrl: 'auth.html'
})
export class AuthPage {
  constructor(private nav: NavController, private nativePageTransitions: NativePageTransitions, private toast: ToastController, public auth: AuthProvider) { }

  login() {
    this.nav.push(LoginPage, {}, { animate: true, direction: 'forward' });
  }

  signup() {
    this.nav.push(SignupPage, {}, { animate: true, direction: 'forward' });
  }

  authPromise(action: Promise<any>) {
    action.then((results: any) => {
      this.auth.skipIntro();
      this.nav.push(MainPage, {}, { animate: false }).then(() => {
        this.nav.remove(0, this.nav.getActive().index);
      });
    }, (err: any) => {
      this.showToast(err.msg);
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
