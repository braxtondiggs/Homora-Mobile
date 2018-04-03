import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing } from '../../interface';
import { ListingProvider } from '../../providers';
import { filter, size } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'filter',
  templateUrl: 'filter.html',
  providers: [ListingProvider],
})
export class FilterComponent {
  loading: boolean = false;
  listings$: Observable<Listing[]>;
  listingTotal: number = 75;
  minAvailability: string = moment().format();
  private listingsCollection: AngularFirestoreCollection<Listing>;
  constructor(private afs: AngularFirestore,
    public listingProvider: ListingProvider,
    private view: ViewController) { }

  close() {
    this.view.dismiss({});
  }

  reset() {
    //TODO: Add reset all
  }

  onChange() {
    this.loading = true;
    this.listingsCollection = this.afs.collection<Listing>('Listings', (ref) => ref.where('status', '==', 'published'));
    this.listings$ = this.listingsCollection.snapshotChanges().map((actions: any) => {
      return filter(actions.map((action: any) => {
        const data = action.payload.doc.data();
        return ({ $key: action.payload.doc.id, ...data });
      }), (o) => {
        return this.listingProvider.filterPrice(o) &&
          this.listingProvider.filterDuration(o) &&
          this.listingProvider.filterGender(o) &&
          this.listingProvider.filterAge(o) &&
          this.listingProvider.filterAmenities(o) &&
          this.listingProvider.filterRules(o);
      });
    });
    this.listings$.subscribe((listings: Listing[]) => {
      this.loading = false;
      this.listingTotal = size(listings);
    });
  }
}
