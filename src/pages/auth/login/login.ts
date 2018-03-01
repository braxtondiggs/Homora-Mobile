import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../../providers/auth/auth';

@IonicPage({
  name: 'login',
  defaultHistory: ['main', 'auth']
})
@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  public login: FormGroup;
  public loading: boolean = false;
  constructor(private afAuth: AngularFireAuth, private formBuilder: FormBuilder, private nav: NavController, private toast: ToastController, private auth: AuthProvider) {
    this.login = this.formBuilder.group({
      email: ['', Validators.required], // TODO: Add Custom Email Validators
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  doLogin() {
    if (this.login.valid) {
      this.loading = true;
      this.afAuth.auth.signInWithEmailAndPassword(this.login.value.email, this.login.value.password).then(() => {
        this.auth.skipIntro();
        this.nav.push('main', {}, { animate: false }).then(() => {
          this.nav.remove(0, this.nav.getActive().index);
        });
      }).catch(() => {
        this.showToast('Invaild Login.');
      });
    } else {
      this.showToast('Invaild Email. Please check if your email has been entered correctly.');
    }
  }

  forgotPassword() {
    this.nav.push('reset', { email: this.login.value.email }, { animate: true, direction: 'forward' });
  }

  showToast(message: string): void {
    this.loading = false;
    this.toast.create({
      message,
      duration: 3000,
      showCloseButton: true
    }).present();
  }
}
