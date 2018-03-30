import { Component } from '@angular/core';
import { AlertController, LoadingController, NavParams, NavController, ModalController, ToastController, ViewController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing, User } from '../../../interface';
import { ListingProvider, UserProvider } from '../../../providers';
import { ProfileViewPage } from '../../profile';
import { MessagePage } from '../../messages';
import { AuthPage } from '../../auth';
import { filter, join, omit, truncate, size, sortBy } from 'lodash';
import { AppSettings } from '../../../app/app.constants';
import moment from 'moment';

@Component({
  selector: 'page-listing',
  templateUrl: 'listing.html',
})
export class ListingPage {
  key: string;
  user: User;
  accountType: string;
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
    private toast: ToastController,
    private alert: AlertController) { }

  readMore(summary: string): void {
    this.modal.create(ListingReadMore, { summary }).present();
  }

  viewProfile(key: string): void {
    this.nav.push(ProfileViewPage, { key });
  }

  contact(createdBy: string, listing: string): void {
    if (this.user) {
      const key = join(sortBy([createdBy, this.user.$key]), '') + listing;
      this.nav.push(MessagePage, { key, listing, createdBy });
    } else {
      this.alert.create({
        subTitle: `You need to be logged in to chat with this user!`,
        buttons: [{
          text: 'Cancel'
        }, {
          text: 'Ok',
          handler: (data) => {
            this.nav.push(AuthPage);
          }
        }]
      }).present();
    }
  }

  edit(key: string): void {
    this.listingProvider.setActive(key);
    this.nav.popToRoot().then(() => {
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
    return this.user && key === this.user.$key;
  }

  hasFeatures(features: any): boolean {
    return size(filter(features, (o) => o)) > 0;
  }

  ionViewDidLoad() {
    this.key = this.navParams.get('key');
    this.preview = this.navParams.get('isPreview') || false;
    this.user = this.userProvider.get();
    this.accountType = this.userProvider.getAccountType();
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
