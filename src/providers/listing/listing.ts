import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing } from '../../interface';
import { ListingAmenities } from '../../interface/listing/amenities.interface';
import { ListingRules } from '../../interface/listing/rules.interface';
import { RoommateAge } from '../../interface/listing/roommate.interface';
// import { filter, intersectionWith } from 'lodash';
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
        return this.filterAge(o)/*filterList || this.filterPrice(o) &&
          this.filterDuration(o) &&
          this.filterGender(o) &&
          this.filterAge(o) &&
          this.filterAmenities(o) &&
          this.filterRules(o);*/
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
    if (listing.roommate && listing.roommate.age) {
      const data = _.pickBy(this.age, _.identity);
      console.log('listing', listing.roommate.age);
      console.log(_.merge(data, listing.roommate.age));
      // console.log(listing.roommate.age);
      // console.log(_.intersectionWith([listing.roommate.age], [this.age], _.isEqual));
      return true;
    } else {
      return false;
    }
    // return (listing.roommate && listing.roommate.age) && listing.roommate.age.groupEarly20 === this.age.groupEarly20 || listing.roommate.age.groupLate20 === this.age.groupLate20 || listing.roommate.age.group30 === this.age.group30 || listing.roommate.age.group40older === this.age.group40older;
  }

  filterAmenities(listing: Listing): boolean {
    return listing.amenities && listing.amenities.washer === this.amenities.washer && listing.amenities.wifi === this.amenities.wifi && listing.amenities.water === this.amenities.water && listing.amenities.electricity === this.amenities.electricity && listing.amenities.furnished === this.amenities.furnished &&
      listing.amenities.doorman === this.amenities.doorman && listing.amenities.air === this.amenities.air && listing.amenities.heating === this.amenities.heating && listing.amenities.month === this.amenities.month && listing.amenities.gym === this.amenities.gym && listing.amenities.tv === this.amenities.tv &&
      listing.amenities.bathroom === this.amenities.bathroom && listing.amenities.dog === this.amenities.dog && listing.amenities.cat === this.amenities.cat && listing.amenities.otherPet === this.amenities.otherPet;
  }

  filterRules(listing: Listing): boolean {
    return listing.rules && listing.rules.smoking === this.rules.smoking && listing.rules.pets === this.rules.pets && listing.rules.drugs === this.rules.drugs && listing.rules.drinking === this.rules.drinking && listing.rules.dogOk === this.rules.dogOk &&
      listing.rules.catOk === this.rules.catOk && listing.rules.otherPetOk === this.rules.otherPetOk && listing.rules.couplesOk === this.rules.couplesOk;
  }
}
