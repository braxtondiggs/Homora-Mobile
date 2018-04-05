import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { GeoLocationProvider } from '../../providers';
import { } from '@types/googlemaps';

@Component({
  selector: 'maps',
  templateUrl: 'maps.html'
})
export class MapsComponent {
  map: google.maps.Map;
  DEFAULT_LATLNG = {
    LAT: 38.889931,
    LNG: -77.009003
  };
  drawerOptions: any = {
    handleHeight: 0,
    thresholdFromBottom: 200,
    thresholdFromTop: 200,
    bounceBack: false
  };
  @ViewChild('gmap') gmapElement: any;
  constructor(private geolocation: Geolocation,
    private locationProvider: GeoLocationProvider,
    private toast: ToastController,
    private platform: Platform) { }

  ionViewDidLoad() {
    this.loadMap();
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.geolocation.getCurrentPosition({
          maximumAge: 3000,
          timeout: 5000,
          enableHighAccuracy: true
        }).then((location: Geoposition) => this.updateMapLocation(location)).catch((error: any) => {
          this.toast.create({ message: error.toString(), duration: 3000 }).present();
        });
      } else {
        this.locationProvider.getLocation().subscribe((location: Geoposition) => {
          console.log(location);
          this.updateMapLocation(location);
        }, (err) => {
          console.log(err);
        });
      }
    });
  }
  private updateMapLocation(location: Geoposition) {
    this.map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
  }

  private loadMap() {
    var mapProp = {
      center: new google.maps.LatLng(this.DEFAULT_LATLNG.LAT, this.DEFAULT_LATLNG.LNG),
      zoom: 13,
      style: [{
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      }]
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }
}
