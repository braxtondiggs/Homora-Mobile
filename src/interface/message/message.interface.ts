import { Chats } from './chats.interface';
import { DocumentReference } from '@firebase/firestore-types';

export interface Message {
  chats: Chats[],
  created: Date;
  listing: DocumentReference;
  users: boolean[];
}
