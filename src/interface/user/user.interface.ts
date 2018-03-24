import { UserImage } from './image.interface';
import { UserNotifications } from './notifications.interface';

export interface User {
  $key: string;
  birthdate: Date | string;
  description?: string;
  email: string;
  firstName: string;
  images?: UserImage[];
  lastName: string;
  phone?: number,
  moveInDate?: Date | string;
  location?: string;
  gender?: string;
  notifications?: UserNotifications;
  providerData?: any;
}
