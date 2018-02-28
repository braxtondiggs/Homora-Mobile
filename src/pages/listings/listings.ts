import { Component } from '@angular/core';
import { LoadingController, ModalController, App } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ListingPage } from './listing/listing';
import { ProfilePage } from '../profile/profile';
import { FilterComponent, MapsComponent } from '../../components';
import { Observable } from 'rxjs/Observable';
import { Listing, User } from '../../models';

@Component({
  selector: 'listings',
  templateUrl: 'listings.html'
})
export class ListingsPage {
  listings$: Observable<Listing[]>;
  private listingsCollection: AngularFirestoreCollection<Listing[]>;
  constructor(private afs: AngularFirestore, private loading: LoadingController, private modal: ModalController, private app: App) {
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
  openMaps(): void {
    this.modal.create(MapsComponent).present();
  }
  openFilter(): void {
    this.modal.create(FilterComponent).present();
  }
}
