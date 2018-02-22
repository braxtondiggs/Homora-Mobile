import { Component } from '@angular/core';
import { NavParams, NavController, ModalController, ViewController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing, User } from '../../models/';
import { ProfilePage } from '../profile/profile';
import { truncate } from 'lodash';

@Component({
  selector: 'page-listing',
  templateUrl: 'listing.html',
})
export class ListingPage {
  key: string; // = 'rex3S2miHT8VrVHas3Jr';
  listing$: Observable<Listing>;
  private listingDoc: AngularFirestoreDocument<Listing>;
  constructor(private afs: AngularFirestore, private nav: NavController, private navParams: NavParams, private modal: ModalController) {
    this.key = this.navParams.get('key');
    if (this.key) {
      this.listingDoc = this.afs.doc<Listing>(`Listings/${this.key}`);
      this.listing$ = this.listingDoc.snapshotChanges().map((action: any) => {
        const data = action.payload.data();
        data.createdBy$ = afs.doc<User>(data.createdBy.path).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        data.summaryTruncated = truncate(data.summary, { length: 150, separator: ' ' });
        return ({ $key: action.payload.id, ...data });
      });
    }
  }

  readMore(summary: string): void {
    this.modal.create(ListingReadMore, { summary }).present();
  }

  viewProfile(key: string): void {
    this.nav.push(ProfilePage, { key });
  }

  contact(key: any): void {
    console.log(key);
  }
}

@Component({
  templateUrl: 'readmore.html',
})
export class ListingReadMore {
  summary: string;
  constructor(private params: NavParams, private view: ViewController) {
    this.summary = params.get('summary');
  }

  dismiss() {
    this.view.dismiss();
  }
}
