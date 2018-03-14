import { Component } from '@angular/core';
import { LoadingController, ModalController, NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FilterComponent, MapsComponent } from '../../components';
import { Observable } from 'rxjs/Observable';
import { Listing, User } from '../../models';
import { ListingPage } from './listing/listing';
import { ProfileViewPage } from '../profile';

@Component({
  selector: 'listings',
  templateUrl: 'listings.html'
})
export class ListingsPage {
  listings$: Observable<Listing[]>;
  private listingsCollection: AngularFirestoreCollection<Listing[]>;
  constructor(private afs: AngularFirestore, private loading: LoadingController, private modal: ModalController, private nav: NavController) { }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  viewProfile(key: string, event: Event): void {
    event.stopPropagation();
    this.nav.push(ProfileViewPage, { key });
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
    this.listingsCollection = this.afs.collection<Listing[]>('Listings');
    this.listings$ = this.listingsCollection.snapshotChanges().map((actions: any) => {
      return actions.map((action: any) => {
        const data = action.payload.doc.data();
        data.createdBy$ = this.afs.doc<User>(data.createdBy.path).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        return ({ $key: action.payload.doc.id, ...data })
      });
    })
    this.listings$.subscribe(() => loader.dismiss());
  }
}
