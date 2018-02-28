import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, IonicPage } from 'ionic-angular';
import { AuthPage } from '../auth';
import { MainPage } from '../main/main';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
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
