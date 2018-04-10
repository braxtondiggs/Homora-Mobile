import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../interface';
import { ProfileViewPage } from './view/profile-view';
import { NotificationsPage, SettingsPage } from '../settings';
import { AppSettings } from '../../app/app.constants';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: User;
  DEFAULT_USER_IMAGE: string = AppSettings.DEFAULT_USER_IMAGE;
  constructor(private events: Events,
    private nav: NavController,
    private userProvider: UserProvider) { }

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
    this.events.publish('switchAccount');
  }

  accountType(): boolean {
    return localStorage.getItem('account') === 'basic';
  }

  ionViewDidLoad() {
    this.user = this.userProvider.get();
  }
}
