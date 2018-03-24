export interface ListingRoommate {
  gender: string;
  age: RoommateAge;
}

export interface RoommateAge {
  groupEarly20: boolean;
  groupLate20: boolean;
  group30: boolean;
  group40older: boolean;
}
