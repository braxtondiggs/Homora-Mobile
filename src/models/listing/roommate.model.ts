import { RoommateInterface, RoommateAgeInterface } from '../../interface/listing/roommate.interface';

export class Roommate implements RoommateInterface {
  constructor(
    public gender = 'all',
    public age = new RoommateAge()
  ) { }
}

export class RoommateAge implements RoommateAgeInterface {
  constructor(
    public groupEarly20 = true,
    public groupLate20 = true,
    public group30 = true,
    public group40older = true
  ) { }
}
