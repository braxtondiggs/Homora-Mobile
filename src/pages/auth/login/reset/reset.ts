import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'reset-page',
  templateUrl: 'reset.html',
})
export class ResetPage {
  public reset: FormGroup;
  private email: string;
  constructor(private afAuth: AngularFireAuth, private formBuilder: FormBuilder, private nav: NavController, private navParams: NavParams, private toast: ToastController) {
    this.email = this.navParams.get('email');
    this.reset = this.formBuilder.group({
      email: [this.email, Validators.required], // TODO: Add Custom Email Validators
    });
  }
  doReset() {
    if (this.reset.valid) {
      this.afAuth.auth.sendPasswordResetEmail(this.reset.value.email).then(() => {
        this.toast.create({
          message: `A password reset link has been sent to: ${this.reset.value.email}`,
          duration: 3000,
          showCloseButton: true
        }).present();
        this.nav.pop();
      }).catch(() => {
        this.toast.create({
          message: 'No account exist for the request email address.',
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
}
