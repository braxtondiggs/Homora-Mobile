import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Listing } from '../../interface';
import { ListingProvider } from '../../providers';
import { size } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'filter',
  templateUrl: 'filter.html'
})
export class FilterComponent {
  loading: boolean = false;
  listingTotal: number = 75;
  minAvailability: string = moment().format();
  constructor(private listingProvider: ListingProvider,
    private view: ViewController) { }

  close(): void {
    this.view.dismiss();
  }

  reset(): void {
    this.loading = true;
    this.listingProvider.resetFilter();
    setTimeout(() => {
      this.getListings(true);
    }, 600);
  }

  rangelLabel(value: number): string {
    return value < 12 ? `${value} months` : 'Over 1 year';
  }

  sortChange(): void {
    this.listingProvider.pristine = false;
  }

  onChange(): void {
    if (!this.loading) {
      this.loading = true;
      this.listingProvider.pristine = false;
      this.getListings(false);
    }
  }

  private getListings(filter: boolean): void {
    this.listingProvider.getListings(filter).subscribe((listings: Listing[]) => {
      this.loading = false;
      this.listingTotal = size(listings);
    });
  }
}
