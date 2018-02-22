import { Image } from './image.model';
import { Location } from './location.model';

export interface Listing {
  availability?: Date;
  created?: Date;
  $key?: string;
  images?: Image[];
  location: Location;
  price?: number;
  status?: string;
  summary?: string;
  title?: string;
}
