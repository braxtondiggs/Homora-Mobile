import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginModal {
  constructor(public view: ViewController) { }
}
