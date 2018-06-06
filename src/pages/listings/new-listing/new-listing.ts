import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertController, Content, LoadingController, NavController, Platform, ToastController, Slides } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { GeoLocationProvider, ListingProvider, UserProvider } from '../../../providers';
import { ListingPage } from '../listing/listing';
import { Listing } from '../../../interface';
import { Metro } from '../../../interface/listing/location.interface';
import { Observable } from 'rxjs/Rx';
import { DocumentReference } from '@firebase/firestore-types';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as firebase from 'firebase/app'

@Component({
  selector: 'page-new-listing',
  templateUrl: 'new-listing.html',
})
export class NewListingPage {
  key: string;
  saving: boolean = false;
  submitted: boolean = false;
  backBtn: boolean = false;
  listing: Listing;
  listing$: Observable<Listing>;
  minAvailability: string = moment().format();
  rangeLabelLower: string;
  rangeLabelUpper: string;
  listingForm: FormGroup;
  labelMap: any;
  @ViewChild(Slides) slides: Slides;
  @ViewChild('file') file: ElementRef;
  @ViewChild(Content) content: Content;
  private listingDoc: AngularFirestoreDocument<Listing>;
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private alert: AlertController,
    private toast: ToastController,
    private camera: Camera,
    private geoLocationProvider: GeoLocationProvider,
    private listingProvider: ListingProvider,
    private userProvider: UserProvider,
    private platform: Platform,
    private loading: LoadingController) { }

  prev() {
    if (this.slides.isBeginning() && this.key) {
      this.nav.parent.select(0);
    } else if (this.slides.getActiveIndex() === 1) {
      this.save().then(() => {
        this.goBack();
      }).catch((err: any) => {
        this.saving = false;
        this.toast.create({
          message: err,
          duration: 3000
        }).present();
      });
    } else {
      this.goBack();
    }
  }

  goBack() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.content.scrollToTop();
    this.slides.lockSwipes(true);
  }

  next() {
    this.saving = true;
    this.save().then(() => {
      if (!this.slides.isEnd()) {
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.content.scrollToTop();
        this.slides.lockSwipes(true);
      } else if (this.slides.isEnd() && this.listingForm.valid && _.size(this.listing.images) > 2) {
        this.submitted = true;
        this.listingProvider.setActive(this.key);
        this.nav.push(ListingPage, { key: this.key, isPreview: true });
      } else if ((this.slides.isEnd() && this.listingForm.invalid) || (this.slides.isEnd() && _.size(this.listing.images) <= 2)) {
        const error = _.first(_.reject(_.map(this.listingForm.controls, (o, key) => ({ errors: o.errors, name: key })), (o) => _.isNull(o.errors)));
        this.submitted = true;
        this.alert.create({
          title: 'Looks like some info is missing.',
          subTitle: 'Some information is missing or needs to be updated.',
          buttons: [{
            text: 'Ok',
            handler: () => {
              if (error) {
                const index = _.findIndex(this.labelMap, (o: any) => _.includes(o, error.name));
                this.slides.lockSwipes(false);
                this.slides.slideTo(index);
                this.slides.lockSwipes(true);
              }
            }
          }]
        }).present();
      }
      this.saving = false;
    }).catch((err: any) => {
      this.saving = false;
      this.toast.create({
        message: err,
        duration: 3000
      }).present();
    });
  }

  durationChange(): void {
    this.rangeLabelLower = this.rangelLabel(this.listing.duration.lower);
    this.rangeLabelUpper = this.rangelLabel(this.listing.duration.upper);
  }

  select(type: string, name: string): void {
    this.listingForm.markAsDirty();
    this.listing[type][name] = !this.listing[type][name];
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
    const name = this.listing.images[index].name;
    const ref = this.storage.ref(`Listings/${this.listing.createdBy.id}/${this.key}/${name}`);
    const loading = this.loading.create();
    loading.present();
    this.listing.images.splice(index, 1);
    Observable.forkJoin([ref.delete(), this.listingDoc.update(this.listing)]).subscribe(() => {
      loading.dismiss();
      this.slides.update();
      if (this.slides.isEnd()) this.slides.slideTo(this.slides.length());
    });
  }

  onSlideChange() {
    this.backBtn = this.showBackBtn();
  }

  private showBackBtn(): boolean {
    return !_.isEmpty(this.key) || !this.slides.isBeginning();
  }

  private save(force: boolean = false): Promise<any> {
    if (this.listingForm.dirty || force) {
      return this.formatListing().then(() => {
        if (this.listingDoc) {
          return this.listingDoc.update(this.listing);
        } else {
          this.key = this.afs.collection('Listings').ref.doc().id;
          this.listingDoc = this.afs.doc<Listing>(`Listings/${this.key}`);
          return this.listingDoc.set(this.listing)
        }
      }).catch((err) => {
        return Promise.reject(err);
      });
    } else {
      return Promise.resolve();
    }
  }

  private rangelLabel(value: number): string {
    return value < 12 ? `${value} months` : 'Over 1 year';
  }

  private openCamera(type: string): void {
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
  }

  private uploadImage(base64: string, type: string = 'image/jpeg'): void {
    const key: string = this.afs.collection('Users').ref.doc().id;
    const loading = this.loading.create();
    loading.present();
    const ref = this.storage.ref(`Listings/${this.listing.createdBy.id}/${this.key}/${key}`);
    const task = ref.putString(`data:${type};base64,${base64}`, 'data_url');
    task.downloadURL().subscribe((url: string) => {
      if (_.isEmpty(this.listing.images)) this.listing.images = [];
      this.listing.images.push({
        name: key,
        src: url
      });
      this.save(true).then(() => loading.dismiss()).catch((err) => {
        loading.dismiss();
        this.toast.create({
          message: err,
          duration: 3000
        }).present();
      });
    });
  }

  ionViewDidEnter() {
    this.key = this.listingProvider.getActive();
    if (this.key) {
      this.listingDoc = this.afs.doc<Listing>(`Listings/${this.key}`);
      this.listing$ = this.listingDoc.valueChanges();
      this.listingProvider.setActive(null);
    } else {
      this.listingDoc = null;
      this.listing$ = Observable.of({
        availability: moment().toDate(),
        amenities: {
          washer: false,
          wifi: false,
          water: false,
          electricity: false,
          furnished: false,
          doorman: false,
          air: false,
          heating: false,
          month: false,
          gym: false,
          tv: false,
          bathroom: false,
          dog: false,
          cat: false,
          otherPet: false
        },
        created: moment().toDate(),
        duration: { lower: 1, upper: 12 },
        location: {
          country: 'US',
          isPrivate: false,
          address1: null,
          address2: null,
          city: null,
          latlng: null,
          state: null,
          zip: null
        },
        price: null,
        deposit: null,
        roommate: {
          age: {
            groupEarly20: true,
            groupLate20: true,
            group30: true,
            group40older: true
          },
          gender: 'all'
        },
        title: null,
        summary: null,
        rules: {
          smoking: false,
          pets: false,
          drugs: false,
          drinking: false,
          dogOk: false,
          catOk: false,
          otherPetOk: false,
          couplesOk: false
        },
        status: 'draft',
      } as Listing)
    }
    this.listing$.subscribe((listing) => {
      listing.createdBy = _.isEmpty(listing.createdBy) ? this.userProvider.getDoc().ref as DocumentReference : listing.createdBy as DocumentReference;
      this.listing = listing;
      this.rangeLabelLower = this.rangelLabel(this.listing.duration.lower);
      this.rangeLabelUpper = this.rangelLabel(this.listing.duration.upper);
      this.listingForm = this.formBuilder.group({
        title: [this.listing.title, Validators.required],
        summary: [this.listing.summary, Validators.required],
        address1: [this.listing.location.address1, Validators.required],
        address2: [this.listing.location.address2],
        city: [this.listing.location.city, Validators.required],
        state: [this.listing.location.state, Validators.required],
        zip: [this.listing.location.zip, Validators.required],
        isPrivate: [this.listing.location.isPrivate],
        gender: [this.listing.roommate.gender],
        groupEarly20: [this.listing.roommate.age.groupEarly20],
        groupLate20: [this.listing.roommate.age.groupLate20],
        group30: [this.listing.roommate.age.group30],
        group40older: [this.listing.roommate.age.group40older],
        price: [this.listing.price, Validators.required],
        deposit: [this.listing.deposit, Validators.required],
        availability: [moment(this.listing.availability).format('YYYY-MM-DD'), Validators.required],
        duration: [this.listing.duration, Validators.required],
        washer: [this.listing.amenities.washer],
        wifi: [this.listing.amenities.wifi],
        water: [this.listing.amenities.water],
        electricity: [this.listing.amenities.electricity],
        furnished: [this.listing.amenities.furnished],
        doorman: [this.listing.amenities.doorman],
        air: [this.listing.amenities.air],
        heating: [this.listing.amenities.heating],
        month: [this.listing.amenities.month],
        gym: [this.listing.amenities.gym],
        tv: [this.listing.amenities.tv],
        bathroom: [this.listing.amenities.bathroom],
        dog: [this.listing.amenities.dog],
        cat: [this.listing.amenities.cat],
        otherPet: [this.listing.amenities.otherPet],
        smoking: [this.listing.rules.smoking],
        pets: [this.listing.rules.pets],
        drugs: [this.listing.rules.drugs],
        drinking: [this.listing.rules.drinking],
        dogOk: [this.listing.rules.dogOk],
        catOk: [this.listing.rules.catOk],
        otherPetOk: [this.listing.rules.otherPetOk],
        couplesOk: [this.listing.rules.couplesOk]
      });
      this.listingForm.markAsPristine();
      this.listingForm.markAsUntouched();
      this.listingForm.updateValueAndValidity();
      this.labelMap = [
        ['title', 'summary'],
        ['address1', 'city', 'state', 'zip'],
        [],
        ['price', 'deposit', 'availability', 'duration']
      ];
      setTimeout(() => {
        this.slides.lockSwipes(true);
        this.backBtn = this.showBackBtn();
      }, 500);
    });
  }

  ionViewDidLeave() {
    if (this.slides && this.slides.length() > 0 && _.isNull(this.listingProvider.getActive())) {
      this.slides.lockSwipes(false);
      this.slides.slideTo(0);
      this.slides.lockSwipes(true);
    }
  }

  private formatListing(): Promise<void> {
    this.listing.price = !_.isNull(this.listing.price) ? _.toNumber(this.listing.price) : null;
    this.listing.deposit = !_.isNull(this.listing.deposit) ? _.toNumber(this.listing.deposit) : null;
    this.listing.availability = moment(this.listing.availability).toDate();
    let that = this;
    if (this.listingForm.controls.address1.dirty || this.listingForm.controls.address2.dirty || this.listingForm.controls.city.dirty || this.listingForm.controls.state.dirty || this.listingForm.controls.zip.dirty) {
      const address = `${this.listing.location.address1} ${!_.isEmpty(this.listing.location.address2) ? this.listing.location.address2 : ''}
         ${this.listing.location.city} , ${this.listing.location.state} ${this.listing.location.zip} ${this.listing.location.country}`;
      return this.geoLocationProvider.latLngForAddress(address).then(function(latlng) {
        if (that.listing.location.isPrivate) {
          let random = [_.toNumber(_.random(0.0001, 0.0009).toFixed(4)), _.toNumber(_.random(0.0001, 0.0009).toFixed(4))];
          latlng.lat = _.random(0, 1) === 0 ? _.subtract(latlng.lat, random[0]) : _.add(latlng.lat, random[0]);
          latlng.lng = _.random(0, 1) === 0 ? _.subtract(latlng.lng, random[1]) : _.add(latlng.lng, random[1]);
        }
        that.listing.location.latlng = new firebase.firestore.GeoPoint(latlng.lat, latlng.lng);
        return that.geoLocationProvider.getMetros(latlng).then(function(metros: Metro[]) {
          if (!_.isEmpty(metros)) {
            that.listing.location.metro = metros;
            _.forEach(that.listing.location.metro, function(metro: any, key: any) {
              that.listing.location.metro[key].latlng = new firebase.firestore.GeoPoint(metro.Lat, metro.Lon);
              that.listing.location.metro[key] = _.chain(metro).pickBy(_.identity).omit(['Lat', 'Lon']).value() as any;
            });
          }
          return Promise.resolve();
        });
      }, (err) => {
        return Promise.reject(err);
      });
    } else {
      return Promise.resolve();
    }
  }
}
