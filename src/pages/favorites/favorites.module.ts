import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritesPage } from './favorites';

@NgModule({
  declarations: [
    FavoritesPage
  ],
  imports: [
    IonicPageModule.forChild(FavoritesPage)
  ],
  entryComponents: [
    FavoritesPage
  ]
})
export class FavoritesPageModule { }
