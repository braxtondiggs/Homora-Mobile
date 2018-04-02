import { Injectable } from '@angular/core';
import { Listing } from '../../interface';

@Injectable()
export class ListingProvider {
  active: string;

  getActive(): string {
    return this.active
  }

  setActive(key: string): void {
    this.active = key;
  }

  filterPrice(listing: Listing, price: any): boolean {
    return listing.price >= price.lower && listing.price <= price.upper
  }

  filterDuration(listing: Listing, duration: any): boolean {
    return listing.duration && listing.duration.lower >= duration.lower && listing.duration.upper <= duration.upper
  }

  filterGender(listing: Listing, gender: string): boolean {
    return gender === 'all' || listing.roommate && listing.roommate.gender === gender || listing.roommate && listing.roommate.gender === 'all';
  }
}
