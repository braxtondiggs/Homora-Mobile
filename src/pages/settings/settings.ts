import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, Platform, ToastController, NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmailComposer } from '@ionic-native/email-composer';
import { AuthProvider, UserProvider } from '../../providers';
import { AngularFireAuth } from 'angularfire2/auth';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { User } from '../../interface';
import { IntroPage } from '../intro';
import * as _ from 'lodash';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  user$: Observable<User>;
  userDoc: AngularFirestoreDocument<User>;
  verifyPhoneForm: FormGroup;
  verifyTokenForm: FormGroup;
  authData: any;
  showVerifyToken: boolean = false;
  verifyAction: string;
  constructor(private afAuth: AngularFireAuth,
    private alert: AlertController,
    private toast: ToastController,
    public nav: NavController,
    private loading: LoadingController,
    private http: HttpClient,
    private userProvider: UserProvider,
    private auth: AuthProvider,
    public platform: Platform,
    private formBuilder: FormBuilder,
    private emailComposer: EmailComposer) {
    this.verifyPhoneForm = this.formBuilder.group({
      phone: ['', Validators.required]
    });
    this.verifyTokenForm = this.formBuilder.group({
      token: ['', [Validators.required]]
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
    this.auth.oAuthLink(providerType).then((result: any) => {
      user.providerData = result.user.providerData;
      this.userProvider.getDoc().update(user);
      this.showToast(`We successfully linked ${providerType} to your account.`);
    }).catch(() => {
      this.showToast(`We could not link ${providerType} at this time, please try again later.`);
    });
  }

  disconnect(providerType: string, user: User): void {
    if (_.size(this.authData.providerData) > 1) {
      this.authData.unlink(providerType).then((result: any) => {
        user.providerData = result.providerData;
        this.userProvider.getDoc().update(user);
        this.showToast(`We successfully unlinked ${providerType} from your account.`);
      }).catch((err) => {
        this.showToast(`We could not unlink ${providerType} at this time, please try again later.`);
      });
    } else {
      this.showToast('You cannot disconnect your only linked account.');
    }
  }

  verifyPhone(user: User): void {
    if (this.verifyPhoneForm.valid) {
      const loader = this.loading.create();
      const phone: string = (user.phone as String).replace(/\D/g, '');
      loader.present();
      this.http.post(`https://v2-homora.herokuapp.com/api/verify/${this.verifyAction}`, {}, {
        headers: new HttpHeaders({
          phone
        })
      }).subscribe((res) => {
        user.phone = phone;
        this.userDoc.update(user).then(() => {
          this.showVerifyToken = true;
          loader.dismiss();
          this.showToast('We have sent a four digit code to your phone, please input the number below.');
        });
      }, () => {
        this.showToast('We could not verify your phone at this time, please try again later.');
      });
    } else {
      this.showToast('Must input a valid phone number.');
    }
  }

  verifyToken(user: User): void {
    if (this.verifyTokenForm.valid) {
      const loader = this.loading.create();
      const token: string = this.verifyTokenForm.value.token;
      const phone: string = (user.phone as String).replace(/\D/g, '');
      loader.present();
      this.http.post('https://v2-homora.herokuapp.com/api/verify', {}, {
        headers: new HttpHeaders({
          phone,
          token
        })
      }).subscribe((res) => {
        user.phoneVerified = true;
        this.userDoc.update(user).then(() => {
          loader.dismiss();
          this.showToast('You have successfully verified your phone number.');
        });
      }, () => {
        this.showToast('We could not verify your phone at this time, please try again later.');
      });
    } else {
      this.showToast('Must input a valid code number.')
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
    return this.authData && _.findIndex(this.authData.providerData, ['providerId', provider]) > -1;
  }

  showToast(message: string): void {
    this.toast.create({
      message,
      duration: 3000,
      position: 'bottom'
    }).present();
  }

  ionViewDidLoad() {
    this.userDoc = this.userProvider.getDoc();
    this.user$ = this.userDoc.valueChanges();
    this.authData = this.userProvider.getAuthData();
  }
}
