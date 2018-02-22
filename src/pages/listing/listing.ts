import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing, User } from '../../models/';

@Component({
  selector: 'page-listing',
  templateUrl: 'listing.html',
})
export class ListingPage {
  key: string = 'rex3S2miHT8VrVHas3Jr';
  listing$: Observable<Listing>;
  private listingDoc: AngularFirestoreDocument<Listing>;
  constructor(private afs: AngularFirestore, private navParams: NavParams) {
    // this.key = this.navParams.get('key');
    if (this.key) {
      this.listingDoc = this.afs.doc<Listing>(`Listings/${this.key}`);
      this.listing$ = this.listingDoc.snapshotChanges().map((action: any) => {
        const data = action.payload.data();
        data.createdBy = afs.doc<User>(data.createdBy.path).valueChanges();
        return ({ $key: action.payload.id, ...data });
      });
    }
  }
}
