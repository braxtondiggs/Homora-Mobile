import { Image } from './image.model';
import { Location } from './location.model';
import { Notifications } from './notifications.model';

export interface User {
  birthdate: Date;
  description?: string;
  email: string;
  firstName: string;
  images?: Image[];
  lastName: string;
  location?: Location;
  notifications?: Notifications;
  providerData?: any;
}
