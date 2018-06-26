import { Component } from '@angular/core';
import { AlertController, LoadingController, Loading, ModalController, NavController, Platform, ToastController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { FilterComponent, MapsComponent } from '../../components';
import { Observable } from 'rxjs/Observable';
import { Favorite, Listing, User } from '../../interface';
import { GeoLocationProvider, ListingProvider, UserProvider } from '../../providers';
import { ListingPage } from './listing/listing';
import { ProfileViewPage } from '../profile';
import { AppSettings } from '../../app/app.constants';
import * as moment from 'moment';
import * as _ from 'lodash';
import geolib from 'geolib';

@Component({
  selector: 'listings',
  templateUrl: 'listings.html'
})
export class ListingsPage {
  user: User;
  listings: Listing[];
  filter: boolean = false;
  isLoading: boolean = true;
  favorites: Favorite[];
  listings$: Observable<Listing[]>;
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  private favoriteCollection: AngularFirestoreCollection<Favorite>;
  constructor(private afs: AngularFirestore,
    private listingProvider: ListingProvider,
    private locationProvider: GeoLocationProvider,
    private userProvider: UserProvider,
    private geolocation: Geolocation,
    private loading: LoadingController,
    private modal: ModalController,
    private nav: NavController,
    private platform: Platform,
    private alert: AlertController,
    private toast: ToastController) { }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  viewProfile(key: string, $event: Event): void {
    $event.stopPropagation();
    this.nav.push(ProfileViewPage, { key });
  }

  toggleFavorite(key: string, $event: Event): void {
    const index = _.findIndex(this.favorites, ['listing.path', `Listings/${key}`]);
    if (index > -1) {
      this.afs.doc<Favorite>(`Favorites/${this.favorites[index].$key}`).delete();
    } else {
      this.favoriteCollection.add({
        listing: this.afs.doc<Listing>(`Listings/${key}`).ref as DocumentReference,
        created: moment().toDate(),
        user: this.userProvider.getDoc().ref as DocumentReference
      } as Favorite);
    }
    $event.stopPropagation();
  }

  isFavorite(key: string): string {
    return _.findIndex(this.favorites, ['listing.path', `Listings/${key}`]) > -1 ? 'heart' : 'heart-outline';
  }

  openMaps(): void {
    this.modal.create(MapsComponent).present();
  }

  openFilter(): void {
    const modal = this.modal.create(FilterComponent, { listingTotal: _.size(this.listings) });
    modal.onDidDismiss(() => {
      this.filter = !this.listingProvider.pristine;
      this.ionViewDidLoad();
    });
    modal.present();
  }

  removeFilters(): void {
    this.listingProvider.resetFilter();
    this.filter = !this.listingProvider.pristine;
    this.ionViewDidLoad();
  }

  duration(lower: number, upper: number): string {
    return lower === upper ? `${upper} months` : `${lower}-${upper} months`;
  }

  hasListingImage(listing: Listing): boolean {
    return !_.isEmpty(listing.images);
  }

  availability(date: Date): string {
    return moment(date).isSameOrBefore(moment(), 'day') ? 'Available Now' : moment(date).format('MM/DD');
  }

  getListings(location: Geoposition, loader: Loading) {
    if (!_.isNull(location) && !this.hasPassedBoundaries(location)) {
      this.listings$ = this.listingProvider.getListings(false, {
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        radius: 27
      });
    } else {
      this.listings$ = this.listingProvider.getListings();
      this.alert.create({
        title: 'Outside supported boundaries',
        subTitle: 'We currently do not support areas outside of DC, we plan to expand shortly.',
        buttons: ['Ok']
      }).present();
    }
    this.listings$.subscribe((listings: Listing[]) => {
      this.listings = listings;
      loader.dismiss();
      this.isLoading = false;
      if (this.user) {
        this.favoriteCollection = this.afs.collection<Favorite>('Favorites', (ref) => ref.where('user', '==', this.userProvider.getDoc().ref));
        this.favoriteCollection.snapshotChanges().map((actions: any) => actions.map((action: any) => ({ $key: action.payload.doc.id, ...action.payload.doc.data() }))).subscribe((favorites: Favorite[]) => {
          this.favorites = favorites;
        });
      }
    });
  }

  hasPassedBoundaries(location: Geoposition): boolean {
    return !geolib.isPointInside({ latitude: location.coords.latitude, longitude: location.coords.longitude }, AppSettings.MAP_BOUNDS)
  }

  ionViewDidLoad() {
    const loader: Loading = this.loading.create({ content: 'Finding Listings...' });
    loader.present();
    this.isLoading = true;
    this.user = this.userProvider.get();
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.geolocation.getCurrentPosition({
          maximumAge: 3000,
          timeout: 5000,
          enableHighAccuracy: true
        }).then((location: Geoposition) => {
          this.getListings(location, loader);
        }).catch((error: any) => {
          this.toast.create({ message: error.toString(), duration: 3000 }).present();
          this.getListings(null, loader);
        });
      } else {
        this.locationProvider.getLocation().subscribe((location: Geoposition) => {
          this.getListings(location, loader);
        }, (error: any) => {
          this.toast.create({ message: error.toString(), duration: 3000 }).present();
          this.getListings(null, loader);
        });
      }
    });
  }
}
