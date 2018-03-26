import { Component } from '@angular/core';
import { LoadingController, NavParams, NavController, ModalController, ToastController, ViewController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing, User } from '../../../interface';
import { ListingProvider, UserProvider } from '../../../providers';
import { ProfileViewPage } from '../../profile';
import { omit, truncate } from 'lodash';
import { AppSettings } from '../../../app/app.constants';
import moment from 'moment';

@Component({
  selector: 'page-listing',
  templateUrl: 'listing.html',
})
export class ListingPage {
  key: string;
  preview: boolean = false;
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  listing$: Observable<Listing>;
  private listingDoc: AngularFirestoreDocument<Listing>;
  constructor(
    private afs: AngularFirestore,
    private listingProvider: ListingProvider,
    private userProvider: UserProvider,
    private nav: NavController,
    private navParams: NavParams,
    private modal: ModalController,
    private loading: LoadingController,
    private toast: ToastController) { }

  readMore(summary: string): void {
    this.modal.create(ListingReadMore, { summary }).present();
  }

  viewProfile(key: string): void {
    this.nav.push(ProfileViewPage, { key });
  }

  contact(user: string, listing: string): void {
    // TODO: Add messaging
  }

  edit(key: string): void {
    this.listingProvider.setActive(key);
    this.nav.pop().then(() => {
      this.nav.parent.select(2);
    });
  }

  submit(listing: Listing) {
    const loading = this.loading.create();
    loading.present();
    listing.status = 'published';
    this.listingDoc.update(omit(listing, ['createdBy$', 'summaryTruncated'])).then(() => {
      loading.dismiss();
      this.nav.pop().then(() => {
        this.nav.parent.select(0);
        this.toast.create({
          message: 'Listing has been successfully published',
          duration: 3000
        }).present();
      });
    });
  }

  availability(date: Date): string {
    return moment(date).isSameOrBefore(moment(), 'day') ? 'Available Now' : moment(date).format('MM/DD/YY');
  }

  duration(lower: number, upper: number): string {
    if (lower === upper) {
      return `${upper} months`;
    } else {
      return `${lower}-${upper} months`;
    }
  }

  isUserListing(key: string): boolean {
    return key === this.userProvider.get().$key;
  }

  ionViewDidLoad() {
    this.key = this.navParams.get('key');
    this.preview = this.navParams.get('isPreview') || false;
    if (this.key) {
      this.listingDoc = this.afs.doc<Listing>(`Listings/${this.key}`);
      this.listing$ = this.listingDoc.snapshotChanges().map((action: any) => {
        const data = action.payload.data();
        if (data.createdBy) data.createdBy$ = this.afs.doc<User>(data.createdBy.path).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        data.summaryTruncated = truncate(data.summary, { length: 250, separator: ' ' });
        return ({ $key: action.payload.id, ...data });
      });
    }
  }
}

@Component({
  templateUrl: 'readmore.html',
})
export class ListingReadMore {
  summary: string;
  constructor(private params: NavParams, private view: ViewController) {
    this.summary = this.params.get('summary');
  }

  dismiss() {
    this.view.dismiss();
  }
}
