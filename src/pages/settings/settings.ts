import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, AlertController, ToastController, NavController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Rx';
import { User } from '../../models';
import { findIndex } from 'lodash';

@IonicPage({
  name: 'settings'
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  user$: Observable<User>;
  verify: FormGroup;
  authData: any;
  constructor(private afAuth: AngularFireAuth, private alert: AlertController, private toast: ToastController, public nav: NavController, private userProvider: UserProvider, private auth: AuthProvider, private formBuilder: FormBuilder) {
    this.user$ = userProvider.get$();
    this.authData = userProvider.getAuthData();
    this.verify = this.formBuilder.group({
      phone: ['', Validators.required],
    });
  }

  verifyEmail() {
    this.authData.sendEmailVerification().then(() => {
      this.showToast('A confirmation email has been sent to your email. Please check your inbox.');
    }, (error: any) => {
      this.showToast(error.message);
    });
  }

  connect(providerType: string, user: User) {
    let provider = providerType === 'facebook' ? new firebase.auth.FacebookAuthProvider() : new firebase.auth.GoogleAuthProvider();
    this.authData.linkWithPopup(provider).then((result: any) => {
      user.providerData = result.user.providerData;
      this.userProvider.getDoc().update(user);
      this.showToast(`We successfully linked ${providerType} to your account.`);
    }).catch(() => {
      this.showToast(`We could not link ${providerType} at this time, please try again later.`);
    });
  }

  disconnect(providerType: string, user: User) {
    this.authData.unlink(`${providerType}.com`).then((result: any) => {
      user.providerData = result.providerData;
      this.userProvider.getDoc().update(user);
      this.showToast(`We successfully unlinked ${providerType} from your account.`);
    }).catch(function() {
      this.showToast(`We could not unlink ${providerType} at this time, please try again later.`);
    });
  }

  verifyPhone() {

  }

  closeAccount(user: User): void {
    this.alert.create({
      title: 'Deactivate Account',
      message: 'This is action is permanent and your profile and any listings will disappear. We\'ll miss you terribly.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Deactivate',
          handler: () => {
            this.auth.credentials(user).then((data) => {
              this.authData.reauthenticate(data.data.credential).then(() => {
                //TODO: Need to delete listings
                Observable.forkJoin([
                  // TODO: Need to delete firebase images
                  this.authData.delete(),
                  this.authData.signOut(),
                  this.userProvider.getDoc().delete()
                ]).subscribe(() => {
                  this.nav.push('main', {}, { animate: false }).then(() => {
                    this.nav.remove(0, this.nav.getActive().index);
                  });
                  this.showToast('Account has been deleted successfully!');
                });
              });
            });
          }
        }
      ]
    }).present();
  }

  logout(): void {
    this.afAuth.auth.signOut().then(() => {
      this.nav.push('main', {}, { animate: false }).then(() => {
        this.nav.remove(0, this.nav.getActive().index);
      });
      this.showToast('Log out Successful!');
    });
  }

  contact() {
    //TODO: Add Contact
  }

  hasProvider(provider) {
    return findIndex(this.authData.providerData, ['providerId', provider]) > -1;
  }

  showToast(message: string) {
    this.toast.create({
      message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }
}
