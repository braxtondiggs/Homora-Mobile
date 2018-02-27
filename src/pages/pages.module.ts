import { NgModule } from '@angular/core';
import { FavoriteTab, ListingTab, MainPage } from './main';
import { IntroPage } from './intro/intro';
import { ListingPage, ListingReadMore } from './listing/listing';
import { ProfilePage } from './profile/profile';
import { MessagesPage, MessagePage } from './messages';
import { MomentModule } from 'angular2-moment';
import { IonicModule } from 'ionic-angular'

@NgModule({
  imports: [IonicModule, MomentModule],
  declarations: [
    MainPage,
    ListingTab,
    FavoriteTab,
    IntroPage,
    ListingPage,
    ListingReadMore,
    ProfilePage,
    MessagesPage,
    MessagePage
  ],
  entryComponents: [
    MainPage,
    ListingTab,
    FavoriteTab,
    IntroPage,
    ListingPage,
    ListingReadMore,
    ProfilePage,
    MessagesPage,
    MessagePage
  ],
})
export class PagesModule { }
