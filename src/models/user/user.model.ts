import { Image } from './image.model';
import { Location } from './location.model';
import { Notifications } from './notifications.model';

export interface User {
  birthdate: Date | string;
  description?: string;
  email: string;
  firstName: string;
  images?: Image[];
  lastName: string;
  phone?: number,
  moveInDate?: Date | string;
  location?: Location;
  notifications?: Notifications;
  providerData?: any;
}
