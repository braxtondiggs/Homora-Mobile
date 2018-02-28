import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { LoginPage } from './login/login';
import { SignupPage } from './signup/signup';

@IonicPage()
@Component({
  selector: 'auth-page',
  templateUrl: 'auth.html'
})
export class AuthPage {
  constructor(private nav: NavController, private afAuth: AngularFireAuth, private nativePageTransitions: NativePageTransitions) { }

  login() {
    this.nav.push(LoginPage, {}, { animate: true, direction: 'forward' });
  }

  signup() {
    this.nav.push(SignupPage, {}, { animate: true, direction: 'forward' });
  }

  facebook() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  google() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
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
}
