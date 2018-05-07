import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, Platform, ToastController, NavController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { UserProvider } from '../../providers/user/user';
import { AuthProvider } from '../../providers/auth/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { User } from '../../interface';
import { IntroPage } from '../intro';
import { findIndex } from 'lodash';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  user$: Observable<User>;
  verify: FormGroup;
  authData: any;
  verifyAction: string;
  constructor(private afAuth: AngularFireAuth,
    private alert: AlertController,
    private toast: ToastController,
    public nav: NavController,
    private userProvider: UserProvider,
    private auth: AuthProvider,
    public platform: Platform,
    private formBuilder: FormBuilder,
    private emailComposer: EmailComposer) {
    this.verify = this.formBuilder.group({
      phone: ['', Validators.required],
    });
  }

  verifyEmail(): void {
    this.authData.sendEmailVerification().then(() => {
      this.showToast('A confirmation email has been sent to your email. Please check your inbox.');
    }, (error: any) => {
      this.showToast(error.message);
    });
  }

  connect(providerType: string, user: User): void {
    let provider = providerType === 'facebook.com' ? new firebase.auth.FacebookAuthProvider() : new firebase.auth.GoogleAuthProvider();
    this.authData.linkWithPopup(provider).then((result: any) => {
      user.providerData = result.user.providerData;
      this.userProvider.getDoc().update(user);
      this.showToast(`We successfully linked ${providerType} to your account.`);
    }).catch(() => {
      this.showToast(`We could not link ${providerType} at this time, please try again later.`);
    });
  }

  disconnect(providerType: string, user: User): void {
    this.authData.unlink(providerType).then((result: any) => {
      user.providerData = result.providerData;
      this.userProvider.getDoc().update(user);
      this.showToast(`We successfully unlinked ${providerType} from your account.`);
    }).catch(function() {
      this.showToast(`We could not unlink ${providerType} at this time, please try again later.`);
    });
  }

  verifyPhone(): void {
    if (this.verifyAction === 'call') {
      //TODO:
    } else if (this.verifyAction === 'sms') {
      //TODO:
    }
  }

  closeAccount(user: User): void {
    this.alert.create({
      title: 'Deactivate Account',
      message: 'This is action is permanent and your profile and any listings will disappear. We\'ll miss you terribly.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Deactivate',
        handler: () => {
          this.auth.credentials(user).then((data) => {
            this.authData.reauthenticate(data.data.credential).then(() => {
              //TODO: Need to delete listings
              forkJoin([
                // TODO: Need to delete firebase images
                this.authData.delete(),
                this.authData.signOut(),
                this.userProvider.getDoc().delete()
              ]).subscribe(() => {
                localStorage.clear();
                this.nav.setRoot(IntroPage).then(() => {
                  this.showToast('Account has been deleted successfully!');
                });
              });
            });
          });
        }
      }]
    }).present();
  }

  logout(): void {
    this.afAuth.auth.signOut().then(() => {
      localStorage.clear();
      this.userProvider.set(null);
      this.nav.setRoot(IntroPage).then(() => {
        this.showToast('Log out Successful!');
      });
    });
  }

  contact() {
    this.emailComposer.open({
      to: 'support@homora.com'
    });
  }

  hasProvider(provider: string): boolean {
    return this.authData && findIndex(this.authData.providerData, ['providerId', provider]) > -1;
  }

  showToast(message: string): void {
    this.toast.create({
      message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  ionViewDidLoad() {
    this.user$ = this.userProvider.getDoc().valueChanges();
    this.authData = this.userProvider.getAuthData();
  }
}
