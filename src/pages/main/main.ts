import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage({
  name: 'main',
  segment: 'home'
})
@Component({
  selector: 'main-home',
  templateUrl: 'main.html'
})
export class MainPage {
  user: any;
  constructor(afAuth: AngularFireAuth, private nav: NavController, ) {
    afAuth.authState.subscribe((user) => {
      this.user = user;
    })
  }

  openAuthPage() {
    this.nav.push('auth');
  }
}
