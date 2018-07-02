import { Timestamp } from '@firebase/firestore-types';

export interface Chats {
  created: Timestamp | Date;
  message?: string;
  image?: string;
  sender: string;
}
