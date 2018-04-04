import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { } from '@types/googlemaps';

@Component({
  selector: 'maps',
  templateUrl: 'maps.html'
})
export class MapsComponent {
  map: google.maps.Map;
  @ViewChild('gmap') gmapElement: any;
  constructor(private geolocation: Geolocation,
    private platform: Platform) { }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp: Geoposition) => {
        console.log('location', resp);
        // this.loadMap(resp);
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  /*loadMap(position: Geoposition) {
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

        // Now you can use all methods safely.
        this.map.addMarker({
          title: 'Ionic',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: 43.0741904,
            lng: -89.3809802
          }
        })
          .then(marker => {
            marker.on(GoogleMapsEvent.MARKER_CLICK)
              .subscribe(() => {
                alert('clicked');
              });
          });

      });
  }*/
}
