import { Chats } from './chats.interface';
import { DocumentReference } from '@firebase/firestore-types';

export interface Message {
  chats: Chats[],
  created: Date;
  modified: Date;
  listing: DocumentReference;
  read: any;
  users: any;
}
