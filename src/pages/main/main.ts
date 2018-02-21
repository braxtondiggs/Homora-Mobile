import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { MapsComponent } from '../../components/maps/maps';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing } from '../../models/';
import { ListingPage } from '../listing/listing';

@Component({
  selector: 'main-home',
  templateUrl: 'main.html'
})
export class MainPage {
  listings: Observable<Listing[]>;
  private listingsCollection: AngularFirestoreCollection<Listing[]>;
  constructor(private afs: AngularFirestore, private modal: ModalController, private nav: NavController) {
    this.listingsCollection = afs.collection<Listing[]>('Listings');
    // this.listings =
    this.listingsCollection.snapshotChanges().map((actions: any) => {
      // return actions.map((action: any) => ({ $key: action.payload.doc.id, ...action.payload.doc.data() }));
      return actions.map((action: any) => {
        const data = action.payload.doc.data();
        return ({ $key: action.payload.doc.id, ...data })
      });
    }).subscribe((data: any) => {
      console.log(data);
      console.log(data[0].createdBy);
    })
  }

  openMaps(): void {
    this.modal.create(MapsComponent).present();
  }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }
}
