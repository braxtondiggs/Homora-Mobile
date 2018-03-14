import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
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
  user: any;
  accountType: string = 'basic';
  loading: boolean = true;
  @ViewChild(Content) content: Content;
  ListingsTab: any;
  ListerTab: any;
  NewListingTab: any;
  FavoritesTab: any;
  MessagesTab: any;
  ProfileTab: any;
  constructor(private nav: NavController, private userProvider: UserProvider) {
    this.ListingsTab = ListingsPage;
    this.ListerTab = ListerPage;
    this.NewListingTab = NewListingPage;
    this.FavoritesTab = FavoritesPage;
    this.MessagesTab = MessagesPage;
    this.ProfileTab = ProfilePage;
  }

  openAuthPage() {
    this.nav.push(AuthPage);
  }

  ionViewDidLoad() {
    this.userProvider.getAuth().subscribe((user) => {
      this.accountType = localStorage.getItem('account') ? localStorage.getItem('account') : 'basic';
      this.userProvider.set(user);
      this.user = user;
      this.loading = false;
      this.content.resize();
    });
  }
}
