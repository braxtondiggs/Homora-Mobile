import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models';

@IonicPage({
  name: 'profile'
})
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user$: Observable<User>;
  constructor(private nav: NavController, userProvider: UserProvider) {
    this.user$ = userProvider.get$();
  }

  viewProfile(key: string): void {
    this.nav.push('profileView', { key })
  }

  navSelected(page: string): void {
    this.nav.push(page);
  }
}