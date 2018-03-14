import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { MainPage } from '../main';
import { AuthPage } from '../auth';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})

export class IntroPage {
  @ViewChild(Slides) slides: Slides;
  constructor(private nav: NavController, private auth: AuthProvider) { }

  gotoMainPage() {
    this.auth.skipIntro();
    this.nav.push(MainPage, {}, { animate: false }).then(() => {
      this.nav.remove(0, this.nav.getActive().index);
    });
  }

  openAuthPage() {
    this.nav.push(AuthPage);
  }
}
