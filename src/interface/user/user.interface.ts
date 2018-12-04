import { UserImage } from './image.interface';
import { UserNotifications } from './notifications.interface';
import { Timestamp } from '@firebase/firestore-types';

export interface User {
  $key: string;
  uid?: string;
  created: Timestamp | Date,
  birthdate?: Timestamp | Date;
  description?: string;
  email: string;
  firstName: string;
  images?: UserImage[];
  lastName: string;
  phone?: number | string,
  phoneVerified?: boolean;
  moveInDate?: Timestamp | Date;
  location?: string;
  gender?: string;
  notifications?: UserNotifications;
  providerData?: any;
}
