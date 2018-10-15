import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore } from 'angularfire2/firestore';
import { DocumentReference } from '@firebase/firestore-types';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { GeoLocationProvider } from '../geolocation/geolocation';

@Injectable()
export class FcmProvider {
  constructor(
    public firebaseNative: Firebase,
    public afs: AngularFirestore,
    private platform: Platform,
    private locationProvider: GeoLocationProvider,
    private geolocation: Geolocation
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
    const location = await this.getUserLocation();
    return this.saveTokenToFirestore(token, userRef, location);
  }

  // Save the token to firestore
  private saveTokenToFirestore(token: string, user: DocumentReference, location: string): Promise<void> {
    if (!token && user) return;
    return this.afs.collection('Devices').doc(token).set({
      token,
      user,
      location
    });
  }

  private async getUserLocation() {
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.geolocation.getCurrentPosition({
          maximumAge: 3000,
          timeout: 5000,
          enableHighAccuracy: true
        }).then(async (location: Geoposition) => {
          return resolve(await this.convertLatLng(location));
        });
      } else {
        this.locationProvider.getLocation().subscribe(async (location: Geoposition) => {
          return resolve(await this.convertLatLng(location));
        });
      }
    });
  }

  private async convertLatLng(location: Geoposition) {
    return await this.locationProvider.reverseGeocode({ latitude: location.coords.latitude, longitude: location.coords.longitude });
  }

  // Listen to incoming FCM messages
  listenToNotifications(): Observable<any> {
    return this.firebaseNative.onNotificationOpen();
  }
}
