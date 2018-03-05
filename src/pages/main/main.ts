import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Content } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

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
  constructor(private nav: NavController, private userProvider: UserProvider) { }

  openAuthPage() {
    this.nav.push('auth');
  }

  ionViewDidLoad() {
    this.userProvider.getAuth().subscribe((user) => {
      this.userProvider.set(user);
      this.user = user;
      this.loading = false;
      this.content.resize();
    });
  }
}
