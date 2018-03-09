import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, IonicPage } from 'ionic-angular';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserProvider } from '../../../providers/user/user';
import { User } from '../../../models';
import { join, isEmpty, map, reject, startCase } from 'lodash';
import * as  moment from 'moment';

@IonicPage({
  name: 'editProfile',
})
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
  user: User;
  userDoc: AngularFirestoreDocument<User>;
  profileForm: FormGroup;
  maxBirthDate: string = moment().subtract(18, 'y').format();
  minMoveDate: string = moment().format();
  constructor(private userProvider: UserProvider, private formBuilder: FormBuilder, private alert: AlertController, private loading: LoadingController, private nav: NavController) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      birthdate: ['', Validators.required],
      description: ['', Validators.required],
      moveInDate: ['', Validators.required]
    });
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.user.birthdate = moment(this.user.birthdate).toDate();
      this.user.moveInDate = moment(this.user.moveInDate).toDate();
      const loader = this.loading.create();
      loader.present();
      this.userDoc.update(this.user).then(() => {
        loader.dismiss();
        this.nav.pop();
      });
    } else {
      const message = join(reject(map(this.profileForm.controls, (o: any, key: string) => {
        return map(o.errors, (i, _key: string) => {
          return (_key === 'required') ? `${startCase(key)} is required` : '';
        })
      }), isEmpty), '</li><li>');
      this.alert.create({
        title: 'Something is\'t right',
        message: `<p>Please correct the following fields:</p><ul><li>${message}</li></ul>`,
        buttons: ['Ok']
      }).present();
    }
  }

  editPhoto() { }

  ionViewDidLoad() {
    this.userDoc = this.userProvider.getDoc();
    this.userDoc.valueChanges().subscribe((user) => {
      this.user = user;
      this.user.birthdate = moment(user.birthdate).format('YYYY-MM-DD');
      this.user.moveInDate = moment(user.moveInDate).format('YYYY-MM-DD');
    });
  }
}
