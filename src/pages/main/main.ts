import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'main',
  segment: 'home'
})
@Component({
  selector: 'main-home',
  templateUrl: 'main.html'
})
export class MainPage {
  title = 'listings';
  constructor(params: NavParams) {
    console.log(params); // returns NavParams {data: Object}
    // this.fooId = params.user;
  }
}
