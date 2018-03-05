import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { isEmpty } from 'lodash';

@Injectable()
export class AuthProvider {
  constructor(private afAuth: AngularFireAuth) { }
  skipIntro(): void {
    localStorage.setItem('intro', 'true');
  }

  showIntro(): boolean {
    return isEmpty(localStorage.getItem('intro'));
  }

  credentials(user: any): Promise<any> {
    let provider = user.providerData[0];
    if (provider.providerId === 'google.com') {
      return this.google();
    } else if (provider.providerId === 'facebook.com') {
      return this.facebook();
    }
  }

  facebook(): Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
  }

  google(): Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
