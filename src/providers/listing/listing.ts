import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing, User } from '../../interface';
import { ListingAmenities } from '../../interface/listing/amenities.interface';
import { ListingRules } from '../../interface/listing/rules.interface';
import { RoommateAge } from '../../interface/listing/roommate.interface';
import * as _ from 'lodash';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import geolib from 'geolib';

@Injectable()
export class ListingProvider {
  active: string;
  pristine: boolean;
  sort: string;
  availability: string;
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
    this.availability = null;
    this.price = { lower: 0, upper: 10000 };
    this.duration = { lower: 0, upper: 12 };
    this.gender = 'all';
    this.age = {
      groupEarly20: false,
      groupLate20: false,
      group30: false,
      group40older: false
    } as RoommateAge;
    this.amenities = {
      washer: false,
      wifi: false,
      water: false,
      electricity: false,
      furnished: false,
      doorman: false,
      air: false,
      heating: false,
      month: false,
      gym: false,
      tv: false,
      bathroom: false,
      dog: false,
      cat: false,
      otherPet: false
    } as ListingAmenities;
    this.rules = {
      smoking: false,
      pets: false,
      drugs: false,
      drinking: false,
      dogOk: false,
      catOk: false,
      otherPetOk: false,
      couplesOk: false
    } as ListingRules;
  }

  getActive(): string {
    return this.active;
  }

  setActive(key: string): void {
    this.active = key;
  }

  getListings(lastPoint: firebase.firestore.GeoPoint, filterList: boolean = false, limit: boolean = true, area: any = { center: { latitude: 38.8256989, longitude: -77.0306601 }, radius: 27 }): Observable<Listing[]> {
    const limitValue: number = limit ? 50 : 1000;
    const box = this.boundingBoxCoordinates(area.center, area.radius);
    const lesserGeopoint = new firebase.firestore.GeoPoint(box.swCorner.latitude, box.swCorner.longitude);
    const greaterGeopoint = new firebase.firestore.GeoPoint(box.neCorner.latitude, box.neCorner.longitude);
    const listingsCollection = this.afs.collection<Listing>('Listings', (ref) =>
      lastPoint ?
        ref.where('status', '==', 'published').where('location.latlng', '>', lesserGeopoint).where('location.latlng', '<', greaterGeopoint).orderBy('location.latlng').startAfter(lastPoint).limit(limitValue) :
        ref.where('status', '==', 'published').where('location.latlng', '>', lesserGeopoint).where('location.latlng', '<', greaterGeopoint).orderBy('location.latlng').limit(limitValue));
    return listingsCollection.snapshotChanges().map((actions: any) => {
      const listings = _.filter(actions.map((action: any) => {
        const data = action.payload.doc.data();
        data.images = _.map(data.images, (o) => _.merge(o, { loaded: false }));
        data.createdBy$ = this.afs.doc<User>(data.createdBy.path).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        return ({ $key: action.payload.doc.id, ...data });
      }), (o) => {
        return filterList || this.filterPrice(o) &&
          this.filterDuration(o) &&
          this.filterGender(o) &&
          this.filterAge(o) &&
          this.filterAmenities(o) &&
          this.filterRules(o) &&
          this.filterAvailability(o)
      });
      switch (this.sort) {
        case 'Best Match':
          return _.orderBy(listings, [(o) =>
            geolib.getDistance(area.center, { latitude: o.location.latlng.latitude, longitude: o.location.latlng.longitude }),
            'created'
          ], ['asc', 'desc']);
        case 'Recent':
          return _.orderBy(listings, ['created'], ['desc']);
        case 'Price':
          return _.orderBy(listings, ['price'], ['asc']);
      }
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
    return _.chain(this.amenities).pickBy(_.identity).map((value, key) => value && listing.amenities[key]).compact().size().value() === _.chain(this.amenities).pickBy(_.identity).values().compact().size().value() || _.chain(this.amenities).pickBy(_.identity).values().compact().size().value() === 0;
  }

  filterRules(listing: Listing): boolean {
    if (!listing.rules) return false;
    return _.chain(this.rules).pickBy(_.identity).map((value, key) => value && listing.rules[key]).compact().size().value() === _.chain(this.rules).pickBy(_.identity).values().compact().size().value() || _.chain(this.rules).pickBy(_.identity).values().compact().size().value() === 0;
  }

  filterAvailability(listing: Listing): boolean {
    if (_.isEmpty(this.availability) || moment(this.availability).isSame(moment(), 'day')) return true;
    return moment(this.availability).isAfter(moment(listing.availability as any));
  }

  private boundingBoxCoordinates(center, radius) {
    const KM_PER_DEGREE_LATITUDE = 110.574;
    const latDegrees = radius / KM_PER_DEGREE_LATITUDE;
    const latitudeNorth = Math.min(90, center.latitude + latDegrees);
    const latitudeSouth = Math.max(-90, center.latitude - latDegrees);
    // calculate longitude based on current latitude
    const longDegsNorth = this.metersToLongitudeDegrees(radius, latitudeNorth);
    const longDegsSouth = this.metersToLongitudeDegrees(radius, latitudeSouth);
    const longDegs = Math.max(longDegsNorth, longDegsSouth);
    return {
      swCorner: { // bottom-left (SW corner)
        latitude: latitudeSouth,
        longitude: this.wrapLongitude(center.longitude - longDegs),
      },
      neCorner: { // top-right (NE corner)
        latitude: latitudeNorth,
        longitude: this.wrapLongitude(center.longitude + longDegs),
      },
    };
  }

  private metersToLongitudeDegrees(distance, latitude) {
    const EARTH_EQ_RADIUS = 6378137.0;
    // this is a super, fancy magic number that the GeoFire lib can explain (maybe)
    const E2 = 0.00669447819799;
    const EPSILON = 1e-12;
    const radians = this.degreesToRadians(latitude);
    const num = Math.cos(radians) * EARTH_EQ_RADIUS * Math.PI / 180;
    const denom = 1 / Math.sqrt(1 - E2 * Math.sin(radians) * Math.sin(radians));
    const deltaDeg = num * denom;
    if (deltaDeg < EPSILON) {
      return distance > 0 ? 360 : 0;
    }
    // else
    return Math.min(360, distance / deltaDeg);
  }

  private wrapLongitude(longitude) {
    if (longitude <= 180 && longitude >= -180) {
      return longitude;
    }
    const adjusted = longitude + 180;
    if (adjusted > 0) {
      return (adjusted % 360) - 180;
    }
    return 180 - (-adjusted % 360);
  }

  private degreesToRadians(degrees) { return (degrees * Math.PI) / 180; }
}
