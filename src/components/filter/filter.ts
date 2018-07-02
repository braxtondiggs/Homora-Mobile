import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Listing } from '../../interface';
import { ListingProvider } from '../../providers';
import { toNumber, size } from 'lodash';
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
    private view: ViewController,
    private params: NavParams) {
    this.listingTotal = toNumber(this.params.get('listingTotal'));
  }

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

  formatTotal(total: number): string {
    return total > 0 ? `${total}+` : total.toString()
  }

  private getListings(filter: boolean): void {
    this.listingProvider.getListings(null, filter).subscribe((listings: Listing[]) => {
      this.loading = false;
      this.listingTotal = size(listings);
    });
  }
}
