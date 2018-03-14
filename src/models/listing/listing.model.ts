import * as moment from 'moment';
import { Image } from './image.model';
import { Location } from './location.model';
import { Roommate } from './roommate.model';

export class Listing {
  availability: Date;
  created?: Date;
  $key?: string;
  images?: Image[];
  roommate: Roommate;
  location: Location;
  duration: { lower: number, upper: number };
  deposit: number;
  price: number;
  status: string;
  summary: string;
  title: string;

  constructor() {
    this.availability = moment().toDate();
    this.duration = { lower: 1, upper: 12 };
    this.roommate = new Roommate();
    this.location = new Location();
    this.deposit = null;
    this.price = null;
    this.status = 'draft';
    this.summary = null;
    this.title = null;
  }
}
