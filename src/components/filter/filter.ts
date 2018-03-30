import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'filter',
  templateUrl: 'filter.html'
})
export class FilterComponent {
  constructor(private view: ViewController) { }

  close() {
    this.view.dismiss({});
  }

  reset() {
    //TODO: Add reset all
  }

  ionViewDidLoad() {

  }
}
