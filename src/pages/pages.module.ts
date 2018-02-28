import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicModule } from 'ionic-angular';
import { MainPage } from './main/main';
import { IntroPage } from './intro/intro';
import { ListingsPage, ListingPage, ListingReadMore } from './listings';
import { FavoritesPage } from './favorites/favorites';
import { ProfilePage } from './profile/profile';
import { MessagesPage, MessagePage } from './messages';
import { AuthPage, SignupPage, LoginPage, ResetPage } from './auth';

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
    MessagePage,
    AuthPage,
    SignupPage,
    LoginPage,
    ResetPage
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
    MessagePage,
    AuthPage,
    SignupPage,
    LoginPage,
    ResetPage
  ],
})
export class PagesModule { }
