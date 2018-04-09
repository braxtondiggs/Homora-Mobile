export interface ListingLocation {
  address1: string;
  address2: string;
  city: string;
  country: string;
  latlng: any;
  state: string;
  zip: string;
  metro: Metro[];
  isPrivate: boolean;
}

export interface Metro {
  Address: {
    City: string,
    State: string,
    Street: string,
    Zip: string
  };
  LineCode1: string;
  LineCode2?: string;
  LineCode3?: string;
  LineCode4?: string;
  Name: string;
  latlng: any;
}
