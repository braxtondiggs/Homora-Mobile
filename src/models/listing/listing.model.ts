import { Image } from './image.model';

export interface Listing {
  availability?: Date;
  created?: Date;
  $key?: string;
  images?: Image[];
  price?: number;
  status?: string;
  summary?: string;
  title?: string;
}
