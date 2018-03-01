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
  public loading: boolean = false;
  private email: string;
  constructor(private afAuth: AngularFireAuth, private formBuilder: FormBuilder, private nav: NavController, private navParams: NavParams, private toast: ToastController) {
    this.email = this.navParams.get('email');
    this.reset = this.formBuilder.group({
      email: [this.email, Validators.required], // TODO: Add Custom Email Validators
    });
  }
  doReset(): void {
    if (this.reset.valid) {
      this.loading = true;
      this.afAuth.auth.sendPasswordResetEmail(this.reset.value.email).then(() => {
        this.showToast(`A password reset link has been sent to: ${this.reset.value.email}`);
        this.nav.pop();
      }).catch(() => {
        this.showToast('No account exist for the request email address.');
      });
    } else {
      this.showToast('Invaild Email. Please check if your email has been entered correctly.');
    }
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
