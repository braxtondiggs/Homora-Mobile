import { Listing } from '../listing/listing.interface';
import { User } from '../user/user.interface';

export interface Message {
  created: Date;
  listing?: Listing;
  message: string;
  receiver: User;
  sender: User;
}
