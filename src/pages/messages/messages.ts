import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MessagePage } from './message/message';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing, Message, User } from '../../interface';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  messages$: Observable<Message[]>;
  private messagesCollection: AngularFirestoreCollection<Message[]>;
  constructor(private afs: AngularFirestore, private nav: NavController) {
    // this.messagesCollection = this.afs.collection<Message[]>('Messages', ref => ref.where('sender', '==', reference));
  }

  viewMessage(key: string): void {
    this.nav.push(MessagePage, { key });
  }
}
