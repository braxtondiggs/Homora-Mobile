import { Component, ViewChild } from '@angular/core';
import { Content, Events, LoadingController, NavController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../interface';
import { AuthPage } from '../auth';
import { ListingsPage, ListerPage, NewListingPage } from '../listings';
import { FavoritesPage } from '../favorites';
import { MessagesPage } from '../messages';
import { ProfilePage } from '../profile';

@Component({
  selector: 'main-home',
  templateUrl: 'main.html'
})
export class MainPage {
  auth: any;
  user: User;
  accountType: string = 'basic';
  isLoading: boolean = true;
  @ViewChild(Content) content: Content;
  ListingsTab: any;
  ListerTab: any;
  NewListingTab: any;
  FavoritesTab: any;
  MessagesTab: any;
  ProfileTab: any;
  constructor(private events: Events,
    private nav: NavController,
    private loading: LoadingController,
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

  ionViewDidLoad() {
    this.init();
  }
}
