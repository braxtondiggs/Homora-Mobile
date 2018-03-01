import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
/*import { NavController } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing, Message, User } from '../../models';*/

@IonicPage({
  name: 'messages',
  segment: 'inbox'
})
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  /*messages$: Observable<Message[]>;
  private messagesCollection: AngularFirestoreCollection<Message[]>;
  constructor(private afs: AngularFirestore, private nav: NavController) {
     var reference = this.afs.collection('Users').doc("rFOEwdw5go4dbitOCXyC");
     this.messagesCollection = this.afs.collection<Message[]>('Messages', ref => ref.where('sender', '==', reference));
  }*/
  constructor(private nav: NavController) {
  }
  viewMessage(key: string): void {
    this.nav.push('message', { key });
  }
}
