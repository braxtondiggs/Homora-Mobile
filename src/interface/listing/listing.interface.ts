import { DocumentReference, Timestamp } from '@firebase/firestore-types';
import { ListingImage } from './image.interface';
import { ListingLocation } from './location.interface';
import { ListingRoommate } from './roommate.interface';
import { ListingAmenities } from './amenities.interface';
import { ListingRules } from './rules.interface';

export interface Listing {
  availability: Timestamp | Date | String;
  craigslist: boolean;
  created: Timestamp | Date;
  createdBy: DocumentReference;
  $key?: string;
  images?: ListingImage[];
  roommate: ListingRoommate;
  location: ListingLocation;
  duration: { lower: number, upper: number };
  amenities: ListingAmenities;
  rules: ListingRules;
  deposit?: number;
  price?: number;
  status: string;
  summary: string;
  title: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  occupants: number;
}
