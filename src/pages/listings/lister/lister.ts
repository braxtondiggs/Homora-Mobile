import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { ListingPage } from '../listing/listing';
import { ListingProvider, UserProvider } from '../../../providers';
import { Listing, User } from '../../../interface';
import { AppSettings } from '../../../app/app.constants';
import * as _ from 'lodash';

@Component({
  selector: 'page-lister',
  templateUrl: 'lister.html',
})
export class ListerPage {
  listings$: Observable<any>;
  user: User;
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  private listingsCollection: AngularFirestoreCollection<Listing[]>;
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private listingProvider: ListingProvider,
    private userProvider: UserProvider,
    private nav: NavController,
    private alert: AlertController,
    private toast: ToastController,
    private loading: LoadingController) { }

  addListing(): void {
    this.nav.parent.select(2);
  }

  editListing(key: string): void {
    this.listingProvider.setActive(key);
    this.addListing();
  }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  delete(listing: Listing): void {
    this.alert.create({
      title: 'Permanently Delete Listing?',
      subTitle: 'Are you sure you want to delete this listing, this action is permanent.',
      buttons: [{
        text: 'Cancel'
      }, {
        text: 'Delete',
        handler: (data) => {
          const loading = this.loading.create();
          loading.present();
          let promise = [];
          _.forEach(listing.images, (image: any) => {
            promise.push(this.storage.storage.refFromURL(image.src).delete())
          });
          promise.push(this.afs.doc<Listing>(`Listings/${listing.$key}`).delete());
          Observable.forkJoin(promise).subscribe(() => {
            this.toast.create({
              message: 'Listing has been successfully deleted',
              duration: 3000
            }).present();
            loading.dismiss();
          });
        }
      }]
    }).present();
  }

  ionViewDidLoad() {
    this.user = this.userProvider.get();
    this.listingsCollection = this.afs.collection<Listing[]>('Listings', (ref) => ref.where('createdBy', '==', this.userProvider.getDoc().ref).orderBy('created', 'desc'));
    this.listings$ = this.listingsCollection.snapshotChanges().map((actions: any) =>
      _.groupBy(actions.map((action: any) => {
        const data = action.payload.doc.data();
        data.createdBy$ = this.afs.doc<User>(data.createdBy.path).valueChanges();
        return data;
      }), 'status'));
  }
}
