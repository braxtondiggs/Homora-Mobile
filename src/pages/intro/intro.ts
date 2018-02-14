import { Component, ViewChild } from '@angular/core';
import { ModalController, NavController, Slides } from 'ionic-angular';
import { LoginModal } from '../../components/login/login';
import { MainPage } from '../main/main';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})

export class IntroPage {
  @ViewChild(Slides) slides: Slides;
  constructor(public nav: NavController, public modal: ModalController) { }

  gotoMainPage() {
    this.nav.push(MainPage).then(() => {
      this.nav.remove(0, this.nav.getActive().index);
    });
  }
  openLogin() {
    this.modal.create(LoginModal).present();
  }
}
