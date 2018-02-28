import { NgModule } from '@angular/core';
import { MainPage } from './main/main';
import { IntroPage } from './intro/intro';
import { ListingsPage, ListingPage, ListingReadMore } from './listings';
import { FavoritesPage } from './favorites/favorites';
import { ProfilePage } from './profile/profile';
import { MessagesPage, MessagePage } from './messages';
import { MomentModule } from 'angular2-moment';
import { IonicModule } from 'ionic-angular'

@NgModule({
  imports: [IonicModule, MomentModule],
  declarations: [
    MainPage,
    ListingsPage,
    FavoritesPage,
    IntroPage,
    ListingPage,
    ListingReadMore,
    ProfilePage,
    MessagesPage,
    MessagePage
  ],
  entryComponents: [
    MainPage,
    ListingsPage,
    FavoritesPage,
    IntroPage,
    ListingPage,
    ListingReadMore,
    ProfilePage,
    MessagesPage,
    MessagePage
  ],
})
export class PagesModule { }
