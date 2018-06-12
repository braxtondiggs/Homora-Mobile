import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';

@Injectable()
export class FcmProvider {
  constructor(
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform
  ) { }

  // Get permission from the user
  async getToken(userRef: DocumentReference) {
    let token;
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    if (!this.platform.is('cordova')) {
      //TODO: Add PWA support with angularfire2
    }

    return this.saveTokenToFirestore(token, userRef);
  }

  // Save the token to firestore
  private saveTokenToFirestore(token: string, user: DocumentReference): Promise<void> {
    if (!token && user) return;
    return this.afs.collection('Devices').doc(token).set({
      token,
      user
    });
  }

  // Listen to incoming FCM messages
  listenToNotifications(): Observable<any> {
    return this.firebaseNative.onNotificationOpen();
  }
}
