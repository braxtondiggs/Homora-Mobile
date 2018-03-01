import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Content } from 'ionic-angular';
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
  loading: boolean = true;
  @ViewChild(Content) content: Content;
  constructor(afAuth: AngularFireAuth, private nav: NavController, ) {
    afAuth.authState.subscribe((user) => {
      this.user = user;
      this.loading = false;
      this.content.resize();
    })
  }

  openAuthPage() {
    this.nav.push('auth');
  }
}
