import { Pipe } from '@angular/core';
import { Timestamp } from '@firebase/firestore-types';
import { Message } from '../interface';
import * as _ from 'lodash';

@Pipe({
  name: 'latestMessage'
})
export class MessagePipe {
  public transform(items: Message[]) {
    return _.orderBy(items, [(o: Message) => (o.modified as Timestamp).toDate()], ['desc']);;
  }
}
