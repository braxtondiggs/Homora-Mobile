import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { MessagePage } from './message/message';
import { Listing, Message, User } from '../../models';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  messages$: Observable<Message[]>;
  private messagesCollection: AngularFirestoreCollection<Message[]>;
  constructor(private afs: AngularFirestore, private nav: NavController) {
    // var reference = this.afs.collection('Users').doc("rFOEwdw5go4dbitOCXyC");
    // this.messagesCollection = this.afs.collection<Message[]>('Messages', ref => ref.where('sender', '==', reference));
  }
  viewMessage(key: string): void {
    this.nav.push(MessagePage, { key });
  }
}
