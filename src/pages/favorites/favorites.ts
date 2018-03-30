import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';
import { UserProvider } from '../../providers';
import { Favorite, Listing, User } from '../../interface';
import { ListingPage } from '../listings';
import { ProfileViewPage } from '../profile';
import { AppSettings } from '../../app/app.constants';

@Component({
  selector: 'favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  favorites$: Observable<Favorite[]>;
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  private favoriteCollection: AngularFirestoreCollection<Favorite>;
  constructor(private afs: AngularFirestore,
    private userProvider: UserProvider,
    private nav: NavController) { }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  removeFavorite(favorite: Favorite, $event: Event): void {
    this.afs.doc<Favorite>(`Favorites/${favorite.$key}`).delete();
    $event.stopPropagation();
  }

  viewProfile(key: string, $event: Event): void {
    $event.stopPropagation();
    this.nav.push(ProfileViewPage, { key });
  }

  ionViewDidLoad() {
    this.favoriteCollection = this.afs.collection<Favorite>('Favorites', (ref) => ref.where('user', '==', this.userProvider.getDoc().ref));
    this.favorites$ = this.favoriteCollection.snapshotChanges().map((actions: any) => {
      return actions.map((action: any) => {
        const data = action.payload.doc.data();
        data.listing$ = this.afs.doc<Listing>(data.listing.path).snapshotChanges().map((action: any) => {
          const data = action.payload.data();
          data.createdBy$ = this.afs.doc<User>(data.createdBy.path).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
          return ({ $key: action.payload.id, ...data });
        });
        return ({ $key: action.payload.doc.id, ...data });
      });
    });
  }
}
