export class Roommate {
  gender: string;
  age: RoommateAge;

  constructor() {
    this.gender = 'all';
    this.age = new RoommateAge();
  }
}


export class RoommateAge {
  groupEarly20: boolean;
  groupLate20: boolean;
  group30: boolean;
  group40older: boolean;

  constructor() {
    this.groupEarly20 = true;
    this.groupLate20 = true;
    this.group30 = true;
    this.group40older = true;
  }
}
