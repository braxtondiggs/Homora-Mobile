import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController, Slides } from 'ionic-angular';
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
import { join, isEmpty, isNull, map, reject, startCase } from 'lodash';
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
  maxBirthDate: string = moment().subtract(18, 'y').format();
  minMoveDate: string = moment().format();
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
    private camera: Camera) {
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
      this.formatUser();
      const loader = this.loading.create();
      loader.present();
      this.userDoc.update(this.user).then(() => {
        loader.dismiss();
        this.nav.pop().then(() => {
          this.toast.create({
            message: 'Profile successfully updated.',
            duration: 3000
          }).present();
        })
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
    forkJoin([!isNull(name) ? ref.delete() : Observable.of({}), this.userDoc.update(this.user)]).subscribe(() => loading.dismiss());
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
      this.uploadImage(image);
    }, (err) => {
      if (err === 'cordova_not_available') {
        this.file.nativeElement.click();
      }
    });
  }

  private uploadImage(base64: string, type: string = 'image/jpeg'): void {
    const key = this.afs.collection('Users').ref.doc().id;
    const loading = this.loading.create();
    loading.present();
    const ref = this.storage.ref(`Users/${this.user.$key}/${key}`);
    const task = ref.putString(`data:${type};base64,${base64}`, 'data_url');
    this.user.images = !isEmpty(this.user.images) ? this.user.images : [];

    task.downloadURL().subscribe((url: string) => {
      this.user.images.push({
        src: url,
        name: key
      } as UserImage);
      this.userDoc.update(this.user).then(() => {
        this.slides.slideTo(this.slides.length());
        loading.dismiss();
      });
    });
  }

  private formatUser() {
    this.user.birthdate = !isNull(this.user.birthdate) ? moment(this.user.birthdate).toDate() : null;
    this.user.moveInDate = !isNull(this.user.moveInDate) ? moment(this.user.moveInDate).toDate() : null;
  }
}