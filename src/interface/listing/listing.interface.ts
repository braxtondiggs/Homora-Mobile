import { ImageInterface } from './image.interface';
import { LocationInterface } from './location.interface';
import { RoommateInterface } from './roommate.interface';
import { AmenitiesInterface } from './amenities.interface';
import { RulesInterface } from './rules.interface';

export interface ListingInterface {
  availability: Date;
  created: Date;
  createdBy: any;
  $key?: string;
  images?: ImageInterface[];
  roommate: RoommateInterface;
  location: LocationInterface;
  duration: { lower: number, upper: number };
  amenities: AmenitiesInterface;
  rules: RulesInterface;
  deposit: number;
  price: number;
  status: string;
  summary: string;
  title: string;
}
