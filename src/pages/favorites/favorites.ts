import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage({
  name: 'favorites'
})
@Component({
  selector: 'favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  constructor(public nav: NavController, afAuth: AngularFireAuth) {
    afAuth.authState.subscribe((user: any) => {
      if (user) {
        console.log(user);
      }
    });
  }
}
