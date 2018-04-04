import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing } from '../../interface';
import { ListingAmenities } from '../../interface/listing/amenities.interface';
import { ListingRules } from '../../interface/listing/rules.interface';
import { RoommateAge } from '../../interface/listing/roommate.interface';
import * as _ from 'lodash';

@Injectable()
export class ListingProvider {
  active: string;
  pristine: boolean;
  sort: string;
  price: { lower: number, upper: number };
  duration: { lower: number, upper: number };
  gender: string;
  age: RoommateAge;
  amenities: ListingAmenities;
  rules: ListingRules;

  constructor(private afs: AngularFirestore) {
    this.resetFilter();
  }

  resetFilter() {
    this.pristine = true;
    this.sort = 'Best Match';
    this.price = { lower: 0, upper: 10000 };
    this.duration = { lower: 0, upper: 12 };
    this.gender = 'all';
    this.age = {
      groupEarly20: true,
      groupLate20: true,
      group30: true,
      group40older: false
    } as RoommateAge;
    this.amenities = {
      washer: true,
      wifi: true,
      water: false,
      electricity: false,
      furnished: false,
      doorman: false,
      air: true,
      heating: true,
      month: false,
      gym: true,
      tv: false,
      bathroom: true,
      dog: true,
      cat: true,
      otherPet: false
    } as ListingAmenities;
    this.rules = {
      smoking: false,
      pets: false,
      drugs: false,
      drinking: false,
      dogOk: true,
      catOk: true,
      otherPetOk: false,
      couplesOk: true
    } as ListingRules;
  }

  getActive(): string {
    return this.active;
  }

  setActive(key: string): void {
    this.active = key;
  }

  getListings(filterList: boolean = true): Observable<Listing[]> {
    const listingsCollection = this.afs.collection<Listing>('Listings', (ref) => ref.where('status', '==', 'published'));
    return listingsCollection.snapshotChanges().map((actions: any) => {
      return _.filter(actions.map((action: any) => {
        const data = action.payload.doc.data();
        return ({ $key: action.payload.doc.id, ...data });
      }), (o) => {
        return filterList || this.filterPrice(o) &&
          this.filterDuration(o) &&
          this.filterGender(o) &&
          this.filterAge(o) &&
          this.filterAmenities(o) &&
          this.filterRules(o);
      });
    });
  }

  filterPrice(listing: Listing): boolean {
    return listing.price >= this.price.lower && listing.price <= this.price.upper
  }

  filterDuration(listing: Listing): boolean {
    return listing.duration && listing.duration.lower >= this.duration.lower && listing.duration.upper <= this.duration.upper
  }

  filterGender(listing: Listing): boolean {
    return listing.roommate && (this.gender === 'all' || listing.roommate.gender === this.gender || listing.roommate.gender === 'all');
  }

  filterAge(listing: Listing): boolean {
    if (!listing.roommate || !listing.roommate.age) return false;
    return _.chain(this.age).pickBy(_.identity).map((value, key) => value && listing.roommate.age[key]).compact().size().value() > 0 || _.chain(this.age).pickBy(_.identity).values().compact().size().value() === 0;
  }

  filterAmenities(listing: Listing): boolean {
    if (!listing.amenities) return false;
    return _.chain(this.amenities).pickBy(_.identity).map((value, key) => value && listing.amenities[key]).compact().size().value() > 0 || _.chain(this.amenities).pickBy(_.identity).values().compact().size().value() === 0;
  }

  filterRules(listing: Listing): boolean {
    if (!listing.rules) return false;
    return _.chain(this.rules).pickBy(_.identity).map((value, key) => value && listing.rules[key]).compact().size().value() > 0 || _.chain(this.rules).pickBy(_.identity).values().compact().size().value() === 0;
  }
}
