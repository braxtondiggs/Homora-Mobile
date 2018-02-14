import { NgModule } from '@angular/core';
import { MainPage } from './main/main';
import { IntroPage } from './intro/intro';
import { IonicModule } from 'ionic-angular'

@NgModule({
  imports: [IonicModule],
  declarations: [
    MainPage,
    IntroPage
  ],
  entryComponents: [
    MainPage,
    IntroPage

  ],
})
export class PagesModule { }
