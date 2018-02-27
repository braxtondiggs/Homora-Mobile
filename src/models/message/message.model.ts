import { Listing } from '../listing/listing.model';
import { User } from '../user/user.model';

export interface Message {
  created: Date;
  listing?: Listing;
  message: string;
  receiver: User;
  sender: User;
}
