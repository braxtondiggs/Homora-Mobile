import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserProvider } from '../../../providers/user/user';
import { User } from '../../../models';
import { join, isEmpty, map, reject, startCase } from 'lodash';
import * as  moment from 'moment';

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
  constructor(private userProvider: UserProvider, private formBuilder: FormBuilder, private alert: AlertController, private loading: LoadingController, private nav: NavController, private camera: Camera) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      birthdate: ['', Validators.required],
      location: [''],
      description: ['', Validators.required],
      moveInDate: ['']
    });
  }

  saveProfile(): void {
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

  editPhoto(): void {
    this.alert.create({
      title: 'Take Picture',
      message: 'Take a new photo or select one from your existing photo library.',
      buttons: [{
        text: 'Gallery',
        handler: () => this.openCamera('gallery')
      }, {
        text: 'Camera',
        handler: () => this.openCamera('camera')
      }]
    }).present();
  }

  ionViewDidLoad() {
    this.userDoc = this.userProvider.getDoc();
    this.userDoc.valueChanges().subscribe((user) => {
      this.user = user;
      this.user.birthdate = moment(user.birthdate).format('YYYY-MM-DD');
      this.user.moveInDate = moment(user.moveInDate).format('YYYY-MM-DD');
    });
  }

  private openCamera(type: string): void {
    this.camera.getPicture({
      quality: 70,
      destinationType: type === 'camera' ? this.camera.DestinationType.DATA_URL : this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    } as CameraOptions).then((image) => {
      let base64Image = `data:image/jpeg;base64,${image}`;
      console.log(base64Image);
      // TODO: Upload Image
    }, (err) => {
      // TODO: Handle error
    });
  }
}
