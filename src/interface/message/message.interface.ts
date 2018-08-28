import { Chats } from './chats.interface';
import { DocumentReference, Timestamp } from '@firebase/firestore-types';

export interface Message {
  $key: string;
  chats: Chats[],
  created: Timestamp | Date;
  modified: Timestamp | Date;
  listing: DocumentReference;
  read: any;
  users: any;
}
