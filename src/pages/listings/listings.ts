import { Component } from '@angular/core';
import { LoadingController, ModalController, NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { FilterComponent, MapsComponent } from '../../components';
import { Observable } from 'rxjs/Observable';
import { Favorite, Listing, User } from '../../interface';
import { ListingProvider, UserProvider } from '../../providers';
import { ListingPage } from './listing/listing';
import { ProfileViewPage } from '../profile';
import { AppSettings } from '../../app/app.constants';
import * as moment from 'moment';
import * as _ from 'lodash';

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
    private userProvider: UserProvider,
    private loading: LoadingController,
    private modal: ModalController,
    private nav: NavController) { }

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

  ionViewDidLoad() {
    const loader = this.loading.create({ content: 'Finding Listings...' });
    loader.present();
    this.isLoading = true;
    this.user = this.userProvider.get();
    this.listings$ = this.listingProvider.getListings();
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
}
