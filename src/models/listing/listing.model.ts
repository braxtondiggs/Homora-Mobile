import * as moment from 'moment';
import { Image } from './image.model';
import { Location } from './location.model';
import { Roommate } from './roommate.model';
import { Amenities } from './amenities.model';
import { Rules } from './rules.model';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../../models';

export class Listing {
  availability: Date;
  created: Date;
  createdBy: any;
  $key?: string;
  images?: Image[];
  roommate: Roommate;
  location: Location;
  duration: { lower: number, upper: number };
  amenities: Amenities;
  rules: Rules;
  deposit: number;
  price: number;
  status: string;
  summary: string;
  title: string;

  constructor() {
    this.availability = moment().toDate();
    this.created = moment().toDate();
    this.duration = { lower: 1, upper: 12 };
    this.amenities = new Amenities();
    this.rules = new Rules();
    this.roommate = new Roommate();
    this.location = new Location();
    this.deposit = null;
    this.price = null;
    this.status = 'draft';
    this.summary = null;
    this.title = null;
  }
}
