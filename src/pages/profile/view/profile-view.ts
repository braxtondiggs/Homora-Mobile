import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing, User } from '../../../interface';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ListingPage } from '../../listings/listing/listing';
import { AppSettings } from '../../../app/app.constants';
import { isEmpty } from 'lodash';

@Component({
  selector: 'page-profile-view',
  templateUrl: 'profile-view.html',
})
export class ProfileViewPage {
  key: string;
  edit: boolean;
  user$: Observable<User>;
  listings$: Observable<Listing[]>;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  private userDoc: AngularFirestoreDocument<User>;
  private listingsCollection: AngularFirestoreCollection<Listing>;
  constructor(private afs: AngularFirestore,
    private navParams: NavParams,
    private nav: NavController) { }

  canEditProfile(): boolean {
    return !isEmpty(this.key) && this.edit;
  }

  editProfile(): void {
    this.nav.push(EditProfilePage);
  }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  hasProfileImage(images: any[]): boolean {
    return !isEmpty(images);
  }

  ionViewCanEnter() {
    return !isEmpty(this.navParams.get('key'));
  }

  ionViewDidLoad() {
    this.key = this.navParams.get('key');
    this.edit = this.navParams.get('edit');
    if (this.key) {
      this.userDoc = this.afs.doc<User>(`Users/${this.key}`);
      this.user$ = this.userDoc.valueChanges();
      this.listingsCollection = this.afs.collection<Listing>('Listings', (ref) => ref.where('createdBy', '==', this.userDoc.ref).where('status', '==', 'published').orderBy('created', 'desc').limit(25));
      this.listings$ = this.listingsCollection.valueChanges();
    }
  }
}
