import { LocationInterface } from '../../interface/listing/location.interface';

export class Location implements LocationInterface {
  constructor(
    public address1 = null,
    public address2 = null,
    public city = null,
    public country = 'US',
    public latlng = null,
    public state = null,
    public zip = null,
    public isPrivate = false
  ) { }
}
