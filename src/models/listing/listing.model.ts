import { ListingInterface } from '../../interface/listing/listing.interface';
import { Location } from './location.model';
import { Roommate } from './roommate.model';
import { Amenities } from './amenities.model';
import { Rules } from './rules.model';
import { merge, toNumber } from 'lodash';
import * as moment from 'moment';

export class Listing implements ListingInterface {
  constructor(
    public availability = moment().toDate(),
    public created = moment().toDate(),
    public createdBy = null,
    public duration = { lower: 1, upper: 12 },
    public amenities = new Amenities(),
    public rules = new Rules(),
    public roommate = new Roommate(),
    public location = new Location(),
    public images = [],
    public deposit = null,
    public price = null,
    public status = 'draft',
    public summary = null,
    public title = null
  ) { }

  formattedData(listing: Listing) {
    return merge(listing, {
      amenities: Object.assign({}, listing.amenities),
      rules: Object.assign({}, listing.rules),
      roommate: {
        gender: listing.roommate.gender,
        age: Object.assign({}, listing.roommate.age),
      },
      location: Object.assign({}, listing.location),
      deposit: toNumber(listing.deposit),
      price: toNumber(listing.price)
    })
  }
}
