export interface RoommateInterface {
  gender: string;
  age: RoommateAgeInterface;
}

export interface RoommateAgeInterface {
  groupEarly20: boolean;
  groupLate20: boolean;
  group30: boolean;
  group40older: boolean;
}
