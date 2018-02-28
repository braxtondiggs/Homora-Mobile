import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  constructor(public nav: NavController) { }
}
