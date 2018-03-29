import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Listing, Message, User } from '../../../interface';
import { UserProvider } from '../../../providers';
import { findKey } from 'lodash';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  key: string;
  user: User;
  receiver: User;
  receiver$: Observable<User>
  message$: Observable<Message>;
  private messageDoc: AngularFirestoreDocument<Message>;
  constructor(private navParams: NavParams,
    private afs: AngularFirestore,
    private userProvider: UserProvider) { }

  ionViewDidLoad() {
    this.key = this.navParams.get('key');
    if (this.key) {
      this.user = this.userProvider.get();
      this.messageDoc = this.afs.doc<Message>(`Messages/${this.key}`);
      this.message$ = this.messageDoc.snapshotChanges().map((action: any) => {
        const data = action.payload.data();
        const userRef = findKey(data.users, (o, key) => this.user.$key !== key);
        this.receiver$ = this.afs.doc<User>(`Users/${userRef}`).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        this.receiver$.subscribe((receiver) => {
          console.log(receiver);
          this.receiver = receiver;
        });
        console.log(data);
        return ({ $key: action.payload.id, ...data });
      });
    }
  }
}
