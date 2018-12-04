import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Listing } from '../../../interface';
import { ListingPage } from '../../listings/listing/listing';
import { AppSettings } from '../../../app/app.constants';
import { isEmpty } from 'lodash';

@Component({
  selector: 'page-profile-view-fake',
  templateUrl: 'profile-view-fake.html',
})
export class ProfileViewFakePage {
  key: string;
  listing$: Observable<Listing>;
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  constructor(private afs: AngularFirestore,
    private navParams: NavParams,
    private nav: NavController) { }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  ionViewCanEnter() {
    return !isEmpty(this.navParams.get('key'));
  }

  ionViewDidLoad() {
    this.key = this.navParams.get('key');
    this.listing$ = this.afs.doc<Listing>(`Listings/${this.key}`).valueChanges();
  }
}
