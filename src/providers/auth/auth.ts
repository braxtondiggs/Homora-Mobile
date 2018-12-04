import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { UserProvider } from '../user/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { isEmpty } from 'lodash';
import { auth } from 'firebase/app';

@Injectable()
export class AuthProvider {
  constructor(private afAuth: AngularFireAuth,
    private userProvider: UserProvider,
    private platform: Platform) { }

  skipIntro(): void {
    localStorage.setItem('intro', 'true');
  }

  showIntro(): boolean {
    return isEmpty(localStorage.getItem('intro'));
  }

  credentials(user: any): Promise<any> {
    let provider = user.providerData[0];
    if (provider.providerId === 'google.com') {
      return this.oAuthSignIn('google');
    } else if (provider.providerId === 'facebook.com') {
      return this.oAuthSignIn('facebook');
    }
  }

  oAuthSignIn(action: string): Promise<any> {
    const provider: auth.AuthProvider = (action === 'google') ? new auth.GoogleAuthProvider() : new auth.FacebookAuthProvider();
    if (!this.platform.is('cordova')) {
      return this.afAuth.auth.signInWithPopup(provider);
    } else {
      return this.afAuth.auth.signInWithRedirect(provider).then(() => this.afAuth.auth.getRedirectResult())
    }
  }

  oAuthLink(action: string): Promise<any> {
    const provider: auth.AuthProvider = (action === 'google.com') ? new auth.GoogleAuthProvider() : new auth.FacebookAuthProvider();
    const auth = this.userProvider.getAuthData();
    if (!this.platform.is('cordova')) {
      return auth.linkWithPopup(provider);
    } else {
      return auth.linkWithRedirect(provider);
    }
  }
}
