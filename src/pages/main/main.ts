import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { MapsComponent } from '../../components/maps/maps';
import { ProfilePage } from '../profile/profile';
import { MessagesPage } from '../messages/messages';
import { FavoriteTab } from './favorite-tab/favorite-tab';
import { ListingTab } from './listing-tab/listing-tab';

@Component({
  selector: 'main-home',
  templateUrl: 'main.html'
})
export class MainPage {
  public FavoriteTab: any;
  public ListingTab: any;
  constructor(private modal: ModalController, private nav: NavController) {
    this.FavoriteTab = FavoriteTab;
    this.ListingTab = ListingTab;
  }

  openMaps(): void {
    this.modal.create(MapsComponent).present();
  }

  viewProfile(key: string, event: Event): void {
    event.stopPropagation();
    this.nav.push(ProfilePage, { key });
  }

  viewMessages() {
    this.nav.push(MessagesPage);
  }
}
