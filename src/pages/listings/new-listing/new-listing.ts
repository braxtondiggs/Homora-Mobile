import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertController, LoadingController, NavController, Slides } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { ListingProvider, UserProvider } from '../../../providers';
import { Observable } from 'rxjs/Observable';
import { isEmpty, toNumber } from 'lodash';
import * as moment from 'moment';
import { Listing } from '../../../interface';

@Component({
  selector: 'page-new-listing',
  templateUrl: 'new-listing.html',
})
export class NewListingPage {
  key: string;
  listing: Listing;
  listing$: Observable<Listing>;
  minAvailability: string = moment().format();
  rangeLabelLower: string;
  rangeLabelUpper: string;
  listingForm: FormGroup;
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
    if (this.slides.isBeginning && this.key) {
      this.nav.parent.select(0);
    } else {
      this.slides.lockSwipes(false);
      this.slides.slidePrev();
      this.slides.lockSwipes(true);
    }
  }

  next() {
    this.save().then(() => {
      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
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

  delete() {
    //TODO: Add delete
  }

  private save(): Promise<void> {
    this.formatListing();
    if (this.listingDoc) {
      return this.listingDoc.update(this.listing);
    } else {
      this.key = this.afs.collection('Listings').ref.doc().id;
      this.listingDoc = this.afs.doc<Listing>(`Listings/${this.key}`);
      return this.listingDoc.set(this.listing)
    }
  }

  private rangelLabel(value: number): string {
    return value < 12 ? `${value} months` : 'Over 1 year';
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
    const loading = this.loading.create();
    loading.present();
    const ref = this.storage.ref(`Listings/${this.listing.createdBy.id}/${this.key}/${this.afs.collection('Users').ref.doc().id}`);
    const task = ref.putString(`data:${type};base64,${base64}`, 'data_url');
    task.downloadURL().subscribe((url: string) => {
      this.listing.images.push({
        src: url
      });
      this.save().then(() => loading.dismiss());
    });
  }

  ionViewWillEnter() {
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
        price: 0,
        deposit: 0,
        roommate: {
          age: {
            groupEarly20: true,
            groupLate20: true,
            group30: true,
            group40older: true
          },
          gender: 'all'
        },
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
      listing.createdBy = isEmpty(listing.createdBy) ? this.userProvider.getDoc().ref : listing.createdBy;
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
      setTimeout(() => {
        this.slides.lockSwipes(true);
      });
    });
  }

  private formatListing() {
    this.listing.price = toNumber(this.listing.price);
    this.listing.deposit = toNumber(this.listing.deposit);
    this.listing.availability = moment(this.listing.availability).toDate();
  }
}
