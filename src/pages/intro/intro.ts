import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, Slides } from 'ionic-angular';
import { LoginModal } from '../../components/login/login';
import { MainPage } from '../main/main';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})

export class IntroPage {
  @ViewChild(Slides) slides: Slides;
  constructor(private nav: NavController, private modal: ModalController, private auth: AuthProvider) { }

  gotoMainPage() {
    this.auth.skipIntro();
    this.nav.push(MainPage).then(() => {
      this.nav.remove(0, this.nav.getActive().index);
    });
  }
  openLogin() {
    this.modal.create(LoginModal).present();
  }
}
