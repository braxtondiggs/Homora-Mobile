import { Component, ViewChild } from '@angular/core';
import { Content, Events, LoadingController, NavController, Platform } from 'ionic-angular';
import { DocumentReference } from '@firebase/firestore-types';
import { AngularFirestore } from 'angularfire2/firestore';
import { FcmProvider, UserProvider } from '../../providers';
import { Message, User } from '../../interface';
import { AuthPage } from '../auth';
import { ListingsPage, ListerPage, NewListingPage } from '../listings';
import { FavoritesPage } from '../favorites';
import { MessagesPage } from '../messages';
import { ProfilePage } from '../profile';
import { tap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'main-home',
  templateUrl: 'main.html'
})
export class MainPage {
  auth: any;
  user: User;
  accountType: string = 'basic';
  isLoading: boolean = true;
  badgeNumber: number = null;
  @ViewChild(Content) content: Content;
  ListingsTab: any;
  ListerTab: any;
  NewListingTab: any;
  FavoritesTab: any;
  MessagesTab: any;
  ProfileTab: any;
  constructor(private afs: AngularFirestore,
    private events: Events,
    private fcm: FcmProvider,
    private loading: LoadingController,
    private nav: NavController,
    private platform: Platform,
    private userProvider: UserProvider) {
    this.ListingsTab = ListingsPage;
    this.ListerTab = ListerPage;
    this.NewListingTab = NewListingPage;
    this.FavoritesTab = FavoritesPage;
    this.MessagesTab = MessagesPage;
    this.ProfileTab = ProfilePage;

    this.events.subscribe('switchAccount', () => {
      const loading = this.loading.create();
      loading.present();
      this.init().then(() => {
        loading.dismiss();
      })
    });
  }

  openAuthPage() {
    this.nav.push(AuthPage);
  }

  init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userProvider.getAuth().subscribe((auth: any) => {
        if (auth) {
          this.accountType = this.userProvider.getAccountType();
          this.userProvider.setAuth(auth);
          this.content.resize();
          this.userProvider.get$().subscribe((user: User) => {
            this.isLoading = false;
            this.auth = auth;
            this.user = user
            this.userProvider.set(user);
            this.setupPushNotifications(this.userProvider.getDoc().ref);
            this.afs.collection<Message>('Messages', ref => ref.where(`users.${this.user.$key}`, '==', true)).valueChanges().subscribe((messages: Message[]) => {
              this.badgeNumber = _.size(_.filter(messages, [`read.${this.user.$key}`, false]));
              this.badgeNumber = (this.badgeNumber <= 0) ? null : this.badgeNumber;
            });
            return resolve();
          });
        } else {
          this.isLoading = false;
          this.auth = auth;
          this.content.resize();
          return resolve();
        }
      });
    });
  }

  private setupPushNotifications(userId: DocumentReference) {
    if (this.platform.is('cordova')) {
      this.fcm.getToken(userId);
    }
  }

  ionViewDidLoad() {
    this.init();
  }
}
