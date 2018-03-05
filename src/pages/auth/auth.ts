import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage({
  name: 'auth',
  defaultHistory: ['main']
})
@Component({
  selector: 'auth-page',
  templateUrl: 'auth.html'
})
export class AuthPage {
  constructor(private nav: NavController, private nativePageTransitions: NativePageTransitions, private toast: ToastController, public auth: AuthProvider) { }

  login() {
    this.nav.push('login', {}, { animate: true, direction: 'forward' });
  }

  signup() {
    this.nav.push('signup', {}, { animate: true, direction: 'forward' });
  }

  authPromise(action: Promise<any>) {
    action.then((results: any) => {
      this.auth.skipIntro();
      this.nav.push('main', {}, { animate: false }).then(() => {
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
