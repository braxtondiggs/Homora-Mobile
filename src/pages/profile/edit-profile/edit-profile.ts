import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform, ToastController, Slides } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserProvider } from '../../../providers/user/user';
import { User } from '../../../interface';
import { UserImage } from '../../../interface/user/image.interface';
import { AppSettings } from '../../../app/app.constants';
import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as  moment from 'moment';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
  user: User;
  userDoc: AngularFirestoreDocument<User>;
  profileForm: FormGroup;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  email: string;
  authData: firebase.User;
  maxBirthDate: string = moment().subtract(18, 'y').format('YYYY-MM-DD');
  minMoveDate: string = moment().format('YYYY-MM-DD');
  @ViewChild('file') file: ElementRef;
  @ViewChild(Slides) slides: Slides;
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private userProvider: UserProvider,
    private formBuilder: FormBuilder,
    private alert: AlertController,
    private loading: LoadingController,
    private toast: ToastController,
    private nav: NavController,
    private camera: Camera,
    private platform: Platform) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required])],
      lastName: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required])],
      birthdate: ['', Validators.compose([Validators.required])],
      location: [''],
      description: ['', Validators.compose([Validators.required])],
      moveInDate: ['']
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const loader = this.loading.create();
      loader.present();
      this.email = this.user.email;
      this.userDoc.update(this.formatUser(this.profileForm.value)).then(async () => {
        loader.dismiss();
        this.saveEmail().then(() => {
          this.nav.pop().then(() => {
            this.toast.create({
              message: 'Profile successfully updated.',
              duration: 3000
            }).present();
          });
        }).catch((error) => {
          this.user.email = this.email;
          this.profileForm.patchValue(this.user);
          this.userDoc.update(this.formatUser(this.profileForm.value));
          if (error) {
            this.toast.create({
              message: error.message,
              duration: 3000
            }).present();
          }
        });
      });
    } else {
      const message = _.chain(this.profileForm.controls).map((o: any, key: string) => {
        return _.map(o.errors, (i, _key: string) => {
          return (_key === 'required') ? `${_.startCase(key)} is required` : '';
        })
      }).reject(_.isEmpty).join('</li><li>').value();
      this.alert.create({
        title: 'Something isn\'t right',
        message: `<p>Please correct the following fields:</p><ul><li>${message}</li></ul>`,
        buttons: ['Ok']
      }).present();
    }
  }

  editPhoto(): void {
    if (this.platform.is('cordova')) {
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
    } else {
      this.alert.create({
        title: 'Cordova Error',
        subTitle: 'Looks like cordova is not properly installed or you are using the application on a desktop computer.',
        buttons: ['Ok']
      }).present();
    }
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadImage(reader.result.split(',')[1], file.type);
      };
    }
  }

  deleteImage(index: number, $event): void {
    $event.stopPropagation();
    const name = this.user.images[index].name;
    const ref = this.storage.ref(`Users/${this.user.$key}/${name}`);
    const loading = this.loading.create();
    loading.present();
    this.user.images.splice(index, 1);
    forkJoin([!_.isNull(name) && name !== 'provider' ? ref.delete() : Observable.of({}), this.userDoc.update(_.pickBy(this.user, _.identity))]).subscribe(() => {
      loading.dismiss();
      this.slides.update();
      if (this.slides.isEnd()) this.slides.slideTo(this.slides.length());
    });
  }

  hasProfileImage(): boolean {
    return !_.isEmpty(this.user.images);
  }

  isEmailDisabled(): boolean {
    console.log(this.authData);
    return this.authData && !(_.findIndex(this.authData.providerData, ['providerId', 'password']) > -1);
  }

  ionViewDidLoad() {
    this.userDoc = this.userProvider.getDoc();
    this.userDoc.valueChanges().subscribe((user: any) => {
      this.user = user;
      this.authData = this.userProvider.getAuthData();
      const birthdate = user.birthdate ? user.birthdate.toDate() : this.maxBirthDate;
      const moveInDate = user.moveInDate ? user.moveInDate.toDate() : this.minMoveDate;
      user.birthdate = moment(birthdate).format('YYYY-MM-DD');
      user.moveInDate = moment(moveInDate).format('YYYY-MM-DD');
      this.profileForm.patchValue(user);
    });
  }

  private saveEmail(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.profileForm.controls.email.dirty && this.profileForm.value.email !== this.email) {
        this.alert.create({
          title: 'Confirm Password',
          subTitle: 'Please re-enter your password to update your email address.',
          inputs: [{
            name: 'password',
            placeholder: 'Confirm Password',
            type: 'password'
          }],
          buttons: [{
            text: 'Cancel',
            role: 'cancel',
            handler: (() => reject())
          }, {
            text: 'Update',
            handler: (response: any) => {
              const user = firebase.auth().currentUser;
              const credentials = firebase.auth.EmailAuthProvider.credential(user.email, response.password);
              this.authData.reauthenticateWithCredential(credentials).then(() => {
                this.authData.updateEmail(this.profileForm.value.email).then(() =>
                  resolve()
                ).catch((error) => reject(error));
              }).catch((error) => reject(error));
            }
          }]
        }).present();
      } else {
        resolve();
      }
    });
  }

  private openCamera(type: string): void {
    this.platform.ready().then(() => {
      this.camera.getPicture({
        allowEdit: true,
        quality: 75,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000,
        sourceType: type === 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: type === 'camera',
        encodingType: this.camera.EncodingType.JPEG
      } as CameraOptions).then((image) => {
        this.uploadImage(image);
      }, (err) => {
        if (err === 'cordova_not_available') {
          this.file.nativeElement.click();
        }
      });
    });
  }

  private uploadImage(base64: string, type: string = 'image/jpeg'): void {
    const key = this.afs.collection('Users').ref.doc().id;
    const loading = this.loading.create();
    loading.present();
    const ref = this.storage.ref(`Users/${this.user.$key}/${key}`);
    const task = ref.putString(`data:${type};base64,${base64}`, 'data_url');
    this.user.images = !_.isEmpty(this.user.images) ? this.user.images : [];

    task.downloadURL().subscribe((url: string) => {
      this.user.images.push({
        src: url,
        name: key
      } as UserImage);
      this.userDoc.update(_.pickBy(this.user, _.identity)).then(() => {
        this.slides.slideTo(this.slides.length());
        loading.dismiss();
      });
    });
  }

  private formatUser(user: User): User {
    user.phone = !_.isNull(user.phone) ? _.toNumber(user.phone.toString().replace(/\D/g, '')) : null;
    user.birthdate = !_.isNull(user.birthdate) ? moment(user.birthdate).toDate() : null;
    user.moveInDate = !_.isNull(user.moveInDate) ? moment(user.moveInDate).toDate() : null;
    user = _.pickBy(user, _.identity) as User;
    return user;
  }
}
