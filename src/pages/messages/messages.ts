import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { MessagePage } from './message/message';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Listing, Message, User } from '../../interface';
import { UserProvider } from '../../providers';
import { AppSettings } from '../../app/app.constants';
import * as _ from 'lodash';

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
    private nav: NavController,
    private toast: ToastController) {
  }

  viewMessage(key: string): void {
    this.nav.push(MessagePage, { key });
  }

  deleteMessage(key: string): void {
    this.afs.doc<Message>(`Messages/${key}`).delete().then(() => {
      this.toast.create({
        duration: 3000,
        message: 'Message was successfully deleted'
      }).present();
    });
  }

  ionViewDidLoad() {
    this.user = this.userProvider.get();
    this.messagesCollection = this.afs.collection<Message>('Messages', ref => ref.where(`users.${this.user.$key}`, '==', true));
    this.messages$ = this.messagesCollection.snapshotChanges().pipe(map((actions: any) => {
      return actions.map((action: any) => {
        const data = action.payload.doc.data();
        const userRef = _.findKey(data.users, (o, key) => this.user.$key !== key);
        data.user$ = this.afs.doc<User>(`Users/${userRef}`).valueChanges();
        data.listing$ = this.afs.doc<Listing>(data.listing.path).valueChanges();
        return data;
      });
    }));
  }
}
