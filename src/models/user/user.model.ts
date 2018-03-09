import { Image } from './image.model';
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
  location?: string;
  gender?: string;
  notifications?: Notifications;
  providerData?: any;
}
