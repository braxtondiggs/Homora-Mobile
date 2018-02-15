import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginModal {
  public submitAttempt: boolean = false;
  public login: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  constructor(private view: ViewController, private formBuilder: FormBuilder) { } // tslint:disable-line no-unused-variable
  doLogin() {
    this.submitAttempt = true;
    console.log(this.login.value);
  }
}
