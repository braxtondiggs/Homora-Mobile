import { NgModule } from '@angular/core';
import { MainPage } from './main/main';
import { IntroPage } from './intro/intro';
import { ListingPage, ListingReadMore } from './listing/listing';
import { ProfilePage } from './profile/profile';
import { IonicModule } from 'ionic-angular'

@NgModule({
  imports: [IonicModule],
  declarations: [
    MainPage,
    IntroPage,
    ListingPage,
    ListingReadMore,
    ProfilePage
  ],
  entryComponents: [
    MainPage,
    IntroPage,
    ListingPage,
    ListingReadMore,
    ProfilePage
  ],
})
export class PagesModule { }
