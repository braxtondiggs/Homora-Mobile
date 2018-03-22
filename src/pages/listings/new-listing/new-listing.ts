import { Component, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AlertController, NavParams, Slides } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserProvider } from '../../../providers/user/user';
import { Observable } from 'rxjs/Observable';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { Listing } from '../../../models/listing/listing.model'

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
  private listingDoc: AngularFirestoreDocument<Listing>;
  private listingCollection: AngularFirestoreCollection<Listing>;
  constructor(private afs: AngularFirestore, private formBuilder: FormBuilder, private alert: AlertController, private navParams: NavParams, private camera: Camera, private userProvider: UserProvider) { }

  prev() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  next() {
    this.save();
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
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

  private save() {
    if (this.listingDoc) {
      this.listingDoc.update(this.listing);
    } else {
      console.log(this.listing);
      this.listingCollection = this.afs.collection<Listing>('Listings');
      this.listingCollection.add(this.listing);
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
      let base64Image = `data:image/jpeg;base64,${image}`;
      console.log(base64Image);
      // TODO: Upload Image
    }, (err) => {
      // TODO: Handle error
    });
  }

  ionViewDidLoad() {
    this.key = this.navParams.get('key');
    if (this.key) {
      this.listingDoc = this.afs.doc<Listing>(`Listings/${this.key}`);
      this.listing$ = this.listingDoc.valueChanges()
    } else {
      this.listing$ = Observable.of(new Listing())
    }
    this.listing$.subscribe((listing) => {
      // listing.createdBy = isEmpty(listing.createdBy) ? this.userProvider.getDoc().ref.path : listing.createdBy;
      this.listing = listing;
      console.log(this.listing);
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
        private: [this.listing.location.private],
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
}
