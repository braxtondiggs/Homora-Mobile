import { DocumentReference, Timestamp } from '@firebase/firestore-types';

export interface Favorite {
  $key?: string,
  created: Timestamp | Date;
  listing: DocumentReference;
  user: DocumentReference;
}
