import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertController, LoadingController, NavController, Slides } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { ListingProvider, UserProvider } from '../../../providers';
import { ListingPage } from '../listing/listing';
import { Observable } from 'rxjs/Rx';
import { DocumentReference } from '@firebase/firestore-types';
import { first, findIndex, map, includes, isEmpty, isNull, reject, toNumber, size } from 'lodash';
import * as moment from 'moment';
import { Listing } from '../../../interface';

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
  private listingDoc: AngularFirestoreDocument<Listing>;
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private alert: AlertController,
    private camera: Camera,
    private listingProvider: ListingProvider,
    private userProvider: UserProvider,
    private loading: LoadingController) { }

  prev() {
    if (this.slides.isBeginning() && this.key) {
      this.nav.parent.select(0);
    } else {
      this.slides.lockSwipes(false);
      this.slides.slidePrev();
      this.slides.lockSwipes(true);
    }
  }

  next() {
    this.saving = true;
    this.save().then(() => {
      if (!this.slides.isEnd()) {
        this.slides.lockSwipes(false);
        this.slides.slideNext();
        this.slides.lockSwipes(true);
      } else if (this.slides.isEnd() && this.listingForm.valid && size(this.listing.images) > 2) {
        this.submitted = true;
        this.listingProvider.setActive(this.key);
        this.nav.push(ListingPage, { key: this.key, isPreview: true });
      } else if ((this.slides.isEnd() && this.listingForm.invalid) || (this.slides.isEnd() && size(this.listing.images) <= 2)) {
        const error = first(reject(map(this.listingForm.controls, (o, key) => ({ errors: o.errors, name: key })), (o) => isNull(o.errors)));
        this.submitted = true;
        this.alert.create({
          title: 'Looks like some info is missing.',
          subTitle: 'Some information is missing or needs to be updated.',
          buttons: [{
            text: 'Ok',
            handler: () => {
              if (error) {
                const index = findIndex(this.labelMap, (o: any) => includes(o, error.name));
                this.slides.lockSwipes(false);
                this.slides.slideTo(index);
                this.slides.lockSwipes(true);
              }
            }
          }]
        }).present();
      }
      this.saving = false;
    });
  }

  durationChange(): void {
    this.rangeLabelLower = this.rangelLabel(this.listing.duration.lower);
    this.rangeLabelUpper = this.rangelLabel(this.listing.duration.upper);
  }

  select(type: string, name: string): void {
    this.listing[type][name] = !this.listing[type][name];
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
    const name = this.listing.images[index].name;
    const ref = this.storage.ref(`Listings/${this.listing.createdBy.id}/${this.key}/${name}`);
    const loading = this.loading.create();
    loading.present();
    this.listing.images.splice(index, 1);
    Observable.forkJoin([ref.delete(), this.listingDoc.update(this.listing)]).subscribe(() => loading.dismiss());
  }

  onSlideChange() {
    this.backBtn = this.showBackBtn();
  }

  private showBackBtn(): boolean {
    return !isEmpty(this.key) || !this.slides.isBeginning();
  }

  private save(force: boolean = false): Promise<void> {
    if (this.listingForm.dirty || force) {
      this.formatListing();
      if (this.listingDoc) {
        return this.listingDoc.update(this.listing);
      } else {
        this.key = this.afs.collection('Listings').ref.doc().id;
        this.listingDoc = this.afs.doc<Listing>(`Listings/${this.key}`);
        return this.listingDoc.set(this.listing)
      }
    } else {
      return Promise.resolve();
    }
  }

  private rangelLabel(value: number): string {
    return value < 12 ? `${value} months` : 'Over 1 year';
  }

  private openCamera(type: string): void {
    this.camera.getPicture({
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
      if (isEmpty(this.listing.images)) this.listing.images = [];
      this.listing.images.push({
        name: key,
        src: url
      });
      this.save(true).then(() => loading.dismiss());
    });
  }

  ionViewDidEnter() {
    this.key = this.listingProvider.getActive();
    if (this.key) {
      this.listingDoc = this.afs.doc<Listing>(`Listings/${this.key}`);
      this.listing$ = this.listingDoc.valueChanges();
      this.listingProvider.setActive(null);
    } else {
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
      listing.createdBy = isEmpty(listing.createdBy) ? this.userProvider.getDoc().ref as DocumentReference : listing.createdBy as DocumentReference;
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
    if (this.slides && this.slides.length() > 0 && isNull(this.listingProvider.getActive())) {
      this.slides.lockSwipes(false);
      this.slides.slideTo(0);
      this.slides.lockSwipes(true);
    }
  }

  private formatListing() {
    this.listing.price = !isNull(this.listing.price) ? toNumber(this.listing.price) : null;
    this.listing.deposit = !isNull(this.listing.deposit) ? toNumber(this.listing.deposit) : null;
    this.listing.availability = moment(this.listing.availability).toDate();
  }
}
