import { AmenitiesInterface } from '../../interface/listing/amenities.interface';

export class Amenities implements AmenitiesInterface {
  constructor(
    public washer = false,
    public wifi = false,
    public water = false,
    public electricity = false,
    public furnished = false,
    public doorman = false,
    public air = false,
    public heating = false,
    public month = false,
    public gym = false,
    public tv = false,
    public bathroom = false,
    public dog = false,
    public cat = false,
    public otherPet = false
  ) { }
}
