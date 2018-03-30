import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { Observable } from 'rxjs/Observable';
import { ListingPage } from '../../listings/listing/listing';
import { ProfileViewPage } from '../../profile/view/profile-view';
import { Listing, Message, User } from '../../../interface';
import { UserProvider } from '../../../providers';
import { AppSettings } from '../../../app/app.constants';
import { findKey } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  key: string;
  messageInput: string = '';
  user: User;
  receiver: User;
  message: Message;
  listing$: Observable<Listing>;
  receiver$: Observable<User>
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  private messageDoc: AngularFirestoreDocument<Message>;
  private listingDoc: AngularFirestoreDocument<Listing>;
  @ViewChild(Content) content: Content;
  constructor(private afs: AngularFirestore,
    private userProvider: UserProvider,
    private navParams: NavParams,
    private nav: NavController) { }

  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  viewProfile(key: string): void {
    this.nav.push(ProfileViewPage, { key });
  }

  onFocus() {
    this.content.resize();
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (!this.messageInput.trim()) return;
    if (this.message.chats) {
      this.message.modified = moment().toDate();
      this.message.chats.push({
        created: moment().toDate(),
        message: this.messageInput,
        sender: this.user.$key
      });
      this.messageDoc.update(this.message).then(() => {
        this.messageInput = '';
        this.scrollToBottom();
      });
    } else {
      const message: Message = {
        chats: [{
          created: moment().toDate(),
          message: this.messageInput,
          sender: this.user.$key
        }],
        created: moment().toDate(),
        listing: this.listingDoc.ref as DocumentReference,
        modified: moment().toDate(),
        users: {
          [this.user.$key]: true,
          [this.receiver.$key]: true
        }
      };
      this.messageDoc.set(message).then(() => {
        this.messageInput = '';
        this.scrollToBottom();
      });
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  ionViewDidLoad() {
    this.key = this.navParams.get('key');
    if (this.key) {
      this.user = this.userProvider.get();
      this.messageDoc = this.afs.doc<Message>(`Messages/${this.key}`);
      this.messageDoc.snapshotChanges().map((action: any) => {
        const data = action.payload.data();
        let userRef: string;
        let listingRef: string;
        if (action.payload.exists) {
          userRef = findKey(data.users, (o, key) => this.user.$key !== key);
          listingRef = data.listing.path;
        } else {
          userRef = this.navParams.get('createdBy');
          listingRef = `Listings/${this.navParams.get('listing')}`;
        }
        this.receiver$ = this.afs.doc<User>(`Users/${userRef}`).snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        this.listingDoc = this.afs.doc<Listing>(listingRef);
        this.listing$ = this.listingDoc.snapshotChanges().map((action: any) => ({ $key: action.payload.id, ...action.payload.data() }));
        this.content.resize();
        this.receiver$.subscribe((receiver) => {
          this.receiver = receiver;
        });
        return ({ $key: action.payload.id, ...data });
      }).subscribe((message) => {
        console.log(message);
        this.message = message;
        this.scrollToBottom();
      });
    }
  }
}
