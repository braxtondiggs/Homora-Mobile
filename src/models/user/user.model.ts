import { Image } from './image.model';

export interface User {
  birthdate?: Date;
  description?: string;
  email?: string;
  firstName?: string;
  $key?: string;
  images?: Image[];
  lastName?: string;
}
