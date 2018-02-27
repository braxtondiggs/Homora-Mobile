import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as firebase from 'firebase/app';

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
  constructor(private afAuth: AngularFireAuth, private view: ViewController, private formBuilder: FormBuilder) { }

  doLogin() {
    this.submitAttempt = true;
    this.afAuth.auth.signInWithEmailAndPassword(this.login.value.email, this.login.value.password)
  }

  facebook() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  google() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
