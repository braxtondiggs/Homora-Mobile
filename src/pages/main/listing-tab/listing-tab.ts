import { Component } from '@angular/core';
import { LoadingController, App } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ListingPage } from '../../listing/listing';
import { ProfilePage } from '../../profile/profile';
import { Observable } from 'rxjs/Observable';
import { Listing, User } from '../../../models';
@Component({
  selector: 'listing-tab',
  templateUrl: 'listing-tab.html'
})
export class ListingTab {
  listings$: Observable<Listing[]>;
  private listingsCollection: AngularFirestoreCollection<Listing[]>;
  constructor(private afs: AngularFirestore, private loading: LoadingController, private app: App) {
    const loader = this.loading.create({ content: 'Finding Listings...' });
    loader.present();
    this.listingsCollection = this.afs.collection<Listing[]>('Listings');
    this.listings$ = this.listingsCollection.snapshotChanges().map((actions: any) => {
      return actions.map((action: any) => {
        const data = action.payload.doc.data();
        data.createdBy$ = afs.doc<User>(data.createdBy.path).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        return ({ $key: action.payload.doc.id, ...data })
      });
    })
    this.listings$.subscribe(() => loader.dismiss());
  }
  viewListing(key: string): void {
    this.app.getRootNav().push(ListingPage, { key });
  }

  viewProfile(key: string, event: Event): void {
    event.stopPropagation();
    this.app.getRootNav().push(ProfilePage, { key });
  }
}
