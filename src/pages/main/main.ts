import { Component } from '@angular/core';
import { ModalController, NavController, LoadingController } from 'ionic-angular';
import { MapsComponent } from '../../components/maps/maps';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing, User } from '../../models/';
import { ListingPage } from '../listing/listing';

@Component({
  selector: 'main-home',
  templateUrl: 'main.html'
})
export class MainPage {
  listings$: any;
  private listingsCollection: AngularFirestoreCollection<Listing[]>;
  constructor(private afs: AngularFirestore, private modal: ModalController, private nav: NavController, private loading: LoadingController) {
    const loader = this.loading.create({ content: 'Finding Listings...' });
    loader.present();
    this.listingsCollection = afs.collection<Listing[]>('Listings');
    this.listings$ = this.listingsCollection.snapshotChanges().map((actions: any) => {
      return actions.map((action: any) => {
        const data = action.payload.doc.data();
        data.createdBy = afs.doc<User>(data.createdBy.path).valueChanges();
        return ({ $key: action.payload.doc.id, ...data })
      });
    })
    this.listings$.subscribe(() => loader.dismiss());
  }

  openMaps(): void {
    this.modal.create(MapsComponent).present();
  }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }
}
