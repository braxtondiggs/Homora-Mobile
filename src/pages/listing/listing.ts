import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing } from '../../models/';

@Component({
  selector: 'page-listing',
  templateUrl: 'listing.html',
})
export class ListingPage {
  key: string;
  listing: Observable<Listing>;
  private listingDoc: AngularFirestoreDocument<Listing>;
  constructor(private afs: AngularFirestore, private navParams: NavParams) {
    this.key = this.navParams.get('key');
    this.listingDoc = afs.doc<Listing>(`Listings/${this.key}`);
    this.listing = this.listingDoc.valueChanges();
  }
}
