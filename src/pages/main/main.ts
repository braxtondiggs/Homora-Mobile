import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { FavoritesPage } from '../favorites/favorites';
import { ListingsPage } from '../listings';
import { MessagesPage } from '../messages';

@Component({
  selector: 'main-home',
  templateUrl: 'main.html'
})
export class MainPage {
  public FavoriteTab: any;
  public ListingTab: any;
  public MessageTab: any;
  constructor() {
    this.FavoriteTab = FavoritesPage;
    this.ListingTab = ListingsPage;
    this.MessageTab = MessagesPage;
  }
}
