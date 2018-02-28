import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../../providers/auth/auth';
import { ResetPage } from './reset/reset';
import { MainPage } from '../../main/main';

@IonicPage()
@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  public login: FormGroup;
  constructor(private afAuth: AngularFireAuth, private formBuilder: FormBuilder, private nav: NavController, private toast: ToastController, private auth: AuthProvider) {
    this.login = this.formBuilder.group({
      email: ['', Validators.required], // TODO: Add Custom Email Validators
      password: ['', Validators.required]
    });
  }

  doLogin() {
    if (this.login.valid) {
      this.afAuth.auth.signInWithEmailAndPassword(this.login.value.email, this.login.value.password).then(() => {
        this.auth.skipIntro();
        this.nav.push(MainPage, {}, { animate: false }).then(() => {
          this.nav.remove(0, this.nav.getActive().index);
        });
      }).catch(() => {
        this.toast.create({
          message: 'Invaild Login.',
          duration: 3000,
          showCloseButton: true
        }).present();
      });
    } else {
      this.toast.create({
        message: 'Invaild Email. Please check if your email has been entered correctly.',
        duration: 3000,
        showCloseButton: true
      }).present();
    }
  }

  forgotPassword() {
    this.nav.push(ResetPage, { email: this.login.value.email }, { animate: true, direction: 'forward' });
  }
}
