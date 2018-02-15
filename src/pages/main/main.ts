import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { MapsComponent } from '../../components/maps/maps';

@Component({
  selector: 'main-home',
  templateUrl: 'main.html'
})
export class MainPage {

  constructor(public modal: ModalController) { }
  openMaps() {
    this.modal.create(MapsComponent).present();
  }
}
