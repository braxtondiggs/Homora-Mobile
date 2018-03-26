import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ListingPage } from '../listing/listing';
import { ListingProvider, UserProvider } from '../../../providers';
import { Listing, User } from '../../../interface';
import { AppSettings } from '../../../app/app.constants';
import { groupBy } from 'lodash';
@Component({
  selector: 'page-lister',
  templateUrl: 'lister.html',
})
export class ListerPage {
  listings$: Observable<any>;
  user: User;
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  private listingsCollection: AngularFirestoreCollection<Listing[]>;
  constructor(
    private afs: AngularFirestore,
    private listingProvider: ListingProvider,
    private userProvider: UserProvider,
    private nav: NavController) { }

  addListing(): void {
    this.nav.parent.select(2);
  }

  editListing(key: string): void {
    this.listingProvider.setActive(key);
    this.addListing();
  }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  relist(key: string): void {
    // TODO: Add
  }

  ionViewDidLoad() {
    this.user = this.userProvider.get();
    this.listingsCollection = this.afs.collection<Listing[]>('Listings', (ref) => ref.where('createdBy', '==', this.userProvider.getDoc().ref).orderBy('created', 'desc'));
    this.listings$ = this.listingsCollection.snapshotChanges().map((actions: any) => {
      return groupBy(actions.map((action: any) => {
        const data = action.payload.doc.data();
        data.createdBy$ = this.afs.doc<User>(data.createdBy.path).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        return ({ $key: action.payload.doc.id, ...data });
      }), 'status');
    });
  }
}
