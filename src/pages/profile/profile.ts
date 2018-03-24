import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../interface';
import { ProfileViewPage } from './view/profile-view';
import { NotificationsPage, SettingsPage } from '../settings';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User;
  constructor(private nav: NavController, private userProvider: UserProvider) { }

  viewProfile(key: string): void {
    this.nav.push(ProfileViewPage, { key, edit: true })
  }
  gotoSettings(): void {
    this.nav.push(SettingsPage, {});
  }

  gotoNotification(): void {
    this.nav.push(NotificationsPage, {});
  }

  switchAccount(): void {
    localStorage.setItem('account', localStorage.getItem('account') === 'lister' ? 'basic' : 'lister');
    window.location.reload();
  }

  accountType(): boolean {
    return localStorage.getItem('account') === 'basic';
  }

  ionViewDidLoad() {
    this.user = this.userProvider.get();
  }
}
