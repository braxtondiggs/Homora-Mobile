import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'favorite-tab',
  templateUrl: 'favorite-tab.html'
})
export class FavoriteTab {
  constructor(public nav: NavController) { }
}
