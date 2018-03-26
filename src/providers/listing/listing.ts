import { Injectable } from '@angular/core';

@Injectable()
export class ListingProvider {
  active: string;

  getActive(): string {
    return this.active
  }

  setActive(key: string): void {
    this.active = key;
  }
}
