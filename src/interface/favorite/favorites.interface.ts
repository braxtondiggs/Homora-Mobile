import { DocumentReference } from '@firebase/firestore-types';

export interface Favorite {
  $key?: string,
  created: Date;
  listing: DocumentReference;
  user: DocumentReference;
}
