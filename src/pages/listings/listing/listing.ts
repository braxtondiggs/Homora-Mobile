import { Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController, NavParams, NavController, ModalController, ToastController, ViewController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { Observable } from 'rxjs/Observable';
import { Favorite, Listing, User } from '../../../interface';
import { ListingProvider, UserProvider } from '../../../providers';
import { ProfileViewPage, ProfileViewFakePage } from '../../profile';
import { MessagePage } from '../../messages';
import { AuthPage } from '../../auth';
import * as _ from 'lodash';
import { AppSettings } from '../../../app/app.constants';
import { } from '@types/googlemaps';
import moment from 'moment';

@Component({
  selector: 'page-listing',
  templateUrl: 'listing.html',
})
export class ListingPage {
  key: string;
  user: User;
  favorite: Favorite;
  accountType: string;
  preview: boolean = false;
  listing: Listing;
  isMapClicked: boolean = false;
  metroTotal: number[] = [];
  map: google.maps.Map;
  markers: google.maps.Marker[] = [];
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  listing$: Observable<Listing>;
  @ViewChild('gmap') gmapElement: any;
  private listingDoc: AngularFirestoreDocument<Listing>;
  private favoriteCollection: AngularFirestoreCollection<Favorite>;
  constructor(
    private afs: AngularFirestore,
    private listingProvider: ListingProvider,
    private userProvider: UserProvider,
    private nav: NavController,
    private navParams: NavParams,
    private modal: ModalController,
    private loading: LoadingController,
    private toast: ToastController,
    private alert: AlertController) { }

  readMore(summary: string): void {
    this.modal.create(ListingReadMore, { summary }).present();
  }

  viewProfile(key: string): void {
    this.nav.push(ProfileViewPage, { key });
  }

  viewProfileFake(key: string): void {
    this.nav.push(ProfileViewFakePage, { key });
  }

  contact(createdBy: string, listing: string): void {
    if (this.user) {
      const key = _.join(_.sortBy([createdBy, this.user.$key]), '') + listing;
      this.nav.push(MessagePage, { key, listing, createdBy });
    } else {
      this.alert.create({
        subTitle: `You need to be logged in to chat with this user!`,
        buttons: [{
          text: 'Cancel'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.nav.push(AuthPage);
          }
        }]
      }).present();
    }
  }

  edit(key: string): void {
    this.listingProvider.setActive(key);
    this.nav.popToRoot().then(() => {
      this.nav.parent.select(2);
    });
  }

  submit(listing: Listing) {
    const loading = this.loading.create();
    loading.present();
    listing.status = 'published';
    this.listingDoc.update(_.omit(listing, ['createdBy$', 'summaryTruncated'])).then(() => {
      loading.dismiss();
      this.nav.pop().then(() => {
        this.nav.parent.select(0);
        this.toast.create({
          message: 'Listing has been successfully published',
          duration: 3000
        }).present();
      });
    });
  }

  availability(date: Date): string {
    return moment(date).isSameOrBefore(moment(), 'day') ? 'Available Now' : moment(date).format('MM/DD/YY');
  }

  duration(lower: number, upper: number): string {
    return lower === upper ? `${upper} months` : `${lower}-${upper} months`;
  }

  isUserListing(key: string): boolean {
    return this.user && key === this.user.$key;
  }

  hasFeatures(features: any): boolean {
    return _.size(_.filter(features, (o) => o)) > 0;
  }

  toggleFavorite(): void {
    if (this.isFavorite() === 'heart') {
      this.afs.doc<Favorite>(`Favorites/${this.favorite.$key}`).delete();
    } else {
      const $key = this.afs.createId();
      this.favoriteCollection.add({
        $key,
        listing: this.afs.doc<Listing>(`Listings/${this.key}`).ref as DocumentReference,
        created: moment().toDate(),
        user: this.userProvider.getDoc().ref as DocumentReference
      } as Favorite);
    }
  }

  isFavorite(): string {
    return this.favorite && this.favorite.listing && this.favorite.listing.path === `Listings/${this.key}` ? 'heart' : 'heart-outline';
  }

  hasListingImage(): boolean {
    return !_.isEmpty(this.listing.images);
  }

  expireListing(): void {
    this.alert.create({
      title: 'Expire this listing?',
      subTitle: 'Are you sure you want to disable this listing, this action will make this listing only visible to you.',
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Expire',
        handler: (data) => {
          const loading = this.loading.create();
          loading.present();
          this.listing.status = 'expired';
          this.listingDoc.update(_.omit(this.listing, ['createdBy$', 'summaryTruncated'])).then(() => this.nav.pop()).then(() => {
            this.nav.parent.select(0);
            this.toast.create({
              message: 'Listing has been successfully expired',
              duration: 3000
            }).present();
            loading.dismiss();
          });
        }
      }]
    }).present();
  }

  ionViewDidLoad() {
    const loading = this.loading.create();
    loading.present();
    this.key = this.navParams.get('key');
    this.preview = this.navParams.get('isPreview') || false;
    this.user = this.userProvider.get();
    this.accountType = this.userProvider.getAccountType();
    if (this.key) {
      this.listingDoc = this.afs.doc<Listing>(`Listings/${this.key}`);
      this.listing$ = this.listingDoc.snapshotChanges().map((action: any) => {
        const data = action.payload.data();
        if (data.createdBy) data.createdBy$ = this.afs.doc<User>(data.createdBy.path).valueChanges();
        data.summaryTruncated = _.truncate(data.summary, { length: 250, separator: ' ' });
        return data;
      });
      this.listing$.subscribe((listing: Listing) => {
        this.listing = listing;
        _.forEach(this.listing.location.metro, (metro, key) => {
          let i;
          for (i = 1; i <= 4; i++) {
            if (_.hasIn(metro, `LineCode${i}`)) { continue; } else { break; };
          }
          this.metroTotal.push(i - 1);
        });
        this.loadMap();
        loading.dismiss();
      })
      if (this.user) {
        this.favoriteCollection = this.afs.collection<Favorite>('Favorites', (ref) => ref.where('user', '==', this.userProvider.getDoc().ref).where('listing', '==', this.listingDoc.ref));
        this.favoriteCollection.valueChanges().subscribe((favorite: Favorite[]) => {
          this.favorite = _.first(favorite);
        });
      }
    }
  }

  private loadMap() {
    var mapProp = {
      center: new google.maps.LatLng(this.listing.location.latlng.latitude, this.listing.location.latlng.longitude),
      zoom: 15,
      disableDefaultUI: true,
      style: [{
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      }]
    };
    setTimeout(() => {
      this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      const center = new google.maps.LatLng(this.listing.location.latlng.latitude, this.listing.location.latlng.longitude)
      if (this.listing.location.isPrivate) {
        new google.maps.Circle({
          strokeColor: '#008489',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#4DD2D7',
          fillOpacity: 0.35,
          map: this.map,
          radius: 275,
          center
        });
      } else {
        new google.maps.Marker({
          position: center,
          map: this.map
        });
      }
      google.maps.event.addListener(this.map, 'click', function() {
        this.setOptions({ scrollwheel: true });
      });
    });
  }
}

@Component({
  templateUrl: 'readmore.html',
})
export class ListingReadMore {
  summary: string;
  constructor(private params: NavParams, private view: ViewController) {
    this.summary = this.params.get('summary');
  }

  dismiss() {
    this.view.dismiss();
  }
}
