import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../../providers/auth/auth';
import { User } from '../../../interface'
import { MainPage } from '../../main';
import * as  moment from 'moment';

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signup: FormGroup;
  public loading: boolean = false;
  public maxBirthDate: string = moment().subtract(18, 'y').format();
  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private toast: ToastController,
    private auth: AuthProvider) {
    this.signup = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required], // TODO: Add Custom Email Validators
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      birthday: ['', Validators.required]
    });
  }

  doSignup(): void {
    if (this.signup.valid) {
      this.loading = true;
      this.afAuth.auth.createUserWithEmailAndPassword(this.signup.value.email, this.signup.value.password).then((user: any) => {
        let userDoc: AngularFirestoreDocument<User> = this.afs.collection<User>('Users').doc(user.uid);
        const userData: User = {
          $key: user.uid,
          created: moment().toDate(),
          birthdate: moment(this.signup.value.birthday).toDate(),
          email: this.signup.value.email,
          firstName: this.signup.value.firstName,
          lastName: this.signup.value.lastName,
          notifications: {
            policy: {
              text: false,
              email: true,
              push: true
            },
            messages: {
              text: false,
              email: true,
              push: true
            }
          }
        };
        userDoc.set(userData).then(() => {
          this.afAuth.auth.signInWithEmailAndPassword(this.signup.value.email, this.signup.value.password).then((user: any) => {
            user.sendEmailVerification();
            // this.http.post('http://dev.homora.com/api/users/signup', merge(user, { image: AppSettings.DEFAULT_USER_IMAGE }));
            this.auth.skipIntro();
            this.nav.push(MainPage, {}, { animate: false }).then(() => {
              this.nav.remove(0, this.nav.getActive().index);
            });
          });
        }, (error: any) => {
          this.showToast(error.msg);
        });
      }).catch((error: any) => {
        this.showToast(error.message);
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
