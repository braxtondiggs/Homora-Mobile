import { ImageInterface } from '../../interface/listing/image.interface';

export class Image implements ImageInterface {
  constructor(
    public src = ''
  ) { }
}
