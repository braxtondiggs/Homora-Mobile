import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    platform: Platform,
    geolocation: Geolocation,
    splashScreen: SplashScreen
  ) {
    forkJoin([
      geolocation.getCurrentPosition(),
      platform.ready()
    ]).subscribe(() => {
      splashScreen.hide();
    });
  }
}
