import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage({
  name: 'favorites'
})
@Component({
  selector: 'favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  constructor(public nav: NavController) { }
}
