import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing } from '../../interface';
import { ListingProvider } from '../../providers';
import { filter } from 'lodash';

@Component({
  selector: 'filter',
  templateUrl: 'filter.html'
})
export class FilterComponent {
  sort: string = 'Best Match';
  price: { lower: number, upper: number } = { lower: 0, upper: 10000 };
  duration: { lower: number, upper: number } = { lower: 0, upper: 12 };
  gender: string = 'all';
  groupEarly20: boolean = true;
  groupLate20: boolean = true;
  group30: boolean = true;
  group40older: boolean = false;
  listings$: Observable<Listing[]>;
  private listingsCollection: AngularFirestoreCollection<Listing>;
  constructor(private afs: AngularFirestore,
    private listingProvider: ListingProvider,
    private view: ViewController) {
    this.initComponent();
  }

  close() {
    this.view.dismiss({});
  }

  reset() {
    //TODO: Add reset all
  }

  onChange() {
    this.listingsCollection = this.afs.collection<Listing>('Listings', (ref) => ref.where('status', '==', 'published'));
    this.listings$ = this.listingsCollection.snapshotChanges().map((actions: any) => {
      return filter(actions.map((action: any) => {
        const data = action.payload.doc.data();
        return ({ $key: action.payload.doc.id, ...data });
      }), (o) => {
        return this.listingProvider.filterPrice(o, this.price) &&
          this.listingProvider.filterDuration(o, this.duration) &&
          this.listingProvider.filterGender(o, this.gender);
      });
    });
    this.listings$.subscribe((value: any) => {
      console.log(value);
    });
  }

  private initComponent() {

  }
}
