import { NgModule } from '@angular/core';
import { MainPage } from './main/main';
import { IntroPage } from './intro/intro';
import { ListingPage } from './listing/listing';
import { IonicModule } from 'ionic-angular'

@NgModule({
  imports: [IonicModule],
  declarations: [
    MainPage,
    IntroPage,
    ListingPage
  ],
  entryComponents: [
    MainPage,
    IntroPage,
    ListingPage
  ],
})
export class PagesModule { }
