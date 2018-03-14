export class Location {
  address1: string;
  address2: string;
  city: string;
  country: string;
  latlng: any;
  state: string;
  zip: string;
  private: boolean;

  constructor() {
    this.address1 = null;
    this.address2 = null;
    this.city = null;
    this.country = 'US';
    this.latlng = null;
    this.state = null;
    this.zip = null;
    this.private = false;
  }
}
