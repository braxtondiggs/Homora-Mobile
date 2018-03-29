import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MessagePage } from './message/message';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Rx';
import { Message, User } from '../../interface';
import { UserProvider } from '../../providers';
import { AppSettings } from '../../app/app.constants';
import { findKey } from 'lodash';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  user: User;
  messages$: Observable<Message[]>;
  messagesCollection: AngularFirestoreCollection<Message>;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  constructor(private afs: AngularFirestore,
    private userProvider: UserProvider,
    private nav: NavController) {
  }

  viewMessage(key: string): void {
    this.nav.push(MessagePage, { key });
  }

  deleteMessage(key: string): void {
    //TODO: delete
  }

  ionViewDidLoad() {
    this.user = this.userProvider.get();
    this.messagesCollection = this.afs.collection<Message>('Messages', ref => ref.where(`users.${this.user.$key}`, '==', true));
    this.messages$ = this.messagesCollection.snapshotChanges().map((actions: any) => {
      return actions.map((action: any) => {
        const data = action.payload.doc.data();
        const userRef = findKey(data.users, (o, key) => this.user.$key !== key);
        data.user$ = this.afs.doc<User>(`Users/${userRef}`).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        return ({ $key: action.payload.doc.id, ...data });
      });
    });
  }
}
