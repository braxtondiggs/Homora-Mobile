import { Component } from '@angular/core';
import { LoadingController, ModalController, NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { FilterComponent, MapsComponent } from '../../components';
import { Observable } from 'rxjs/Observable';
import { Favorite, Listing, User } from '../../interface';
import { UserProvider } from '../../providers';
import { ListingPage } from './listing/listing';
import { ProfileViewPage } from '../profile';
import { AppSettings } from '../../app/app.constants';
import * as moment from 'moment';
import { findIndex } from 'lodash';

@Component({
  selector: 'listings',
  templateUrl: 'listings.html'
})
export class ListingsPage {
  user: User;
  favorites: Favorite[];
  listings$: Observable<Listing[]>;
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  private listingsCollection: AngularFirestoreCollection<Listing>;
  private favoriteCollection: AngularFirestoreCollection<Favorite>;
  constructor(private afs: AngularFirestore,
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
    const index = findIndex(this.favorites, ['listing.path', `Listings/${key}`]);
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
    return findIndex(this.favorites, ['listing.path', `Listings/${key}`]) > -1 ? 'heart' : 'heart-outline';
  }

  openMaps(): void {
    this.modal.create(MapsComponent).present();
  }

  openFilter(): void {
    this.modal.create(FilterComponent).present();
  }

  ionViewDidLoad() {
    const loader = this.loading.create({ content: 'Finding Listings...' });
    loader.present();
    this.user = this.userProvider.get();
    this.listingsCollection = this.afs.collection<Listing>('Listings', (ref) => ref.where('status', '==', 'published').orderBy('created', 'desc'));
    this.listings$ = this.listingsCollection.snapshotChanges().map((actions: any) => {
      return actions.map((action: any) => {
        const data = action.payload.doc.data();
        data.createdBy$ = this.afs.doc<User>(data.createdBy.path).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        return ({ $key: action.payload.doc.id, ...data });
      });
    });
    this.listings$.subscribe(() => {
      loader.dismiss();
      if (this.user) {
        this.favoriteCollection = this.afs.collection<Favorite>('Favorites', (ref) => ref.where('user', '==', this.userProvider.getDoc().ref));
        this.favoriteCollection.snapshotChanges().map((actions: any) => actions.map((action: any) => ({ $key: action.payload.doc.id, ...action.payload.doc.data() }))).subscribe((favorites: Favorite[]) => {
          this.favorites = favorites;
        });
      }
    });
  }
}
