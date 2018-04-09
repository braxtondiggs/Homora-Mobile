import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, ToastController, ViewController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { GeoLocationProvider, ListingProvider } from '../../providers';
import { ListingPage } from '../../pages/listings/listing/listing';
import { Listing } from '../../interface';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../app/app.constants';
import { } from '@types/googlemaps';
import { forEach } from 'lodash';

@Component({
  selector: 'maps',
  templateUrl: 'maps.html'
})
export class MapsComponent {
  map: google.maps.Map;
  isDrawerActive: boolean = true;
  showSearchBtn: boolean = false;
  listings: Listing[];
  listings$: Observable<Listing[]>;
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  DEFAULT_LATLNG = {
    LAT: 38.889931,
    LNG: -77.009003
  };
  @ViewChild('gmap') gmapElement: any;
  constructor(private geolocation: Geolocation,
    private locationProvider: GeoLocationProvider,
    private listingProvider: ListingProvider,
    private toast: ToastController,
    private platform: Platform,
    private view: ViewController,
    private nav: NavController) { }

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
          this.updateMapLocation(location);
        }, (err) => {
          console.log(err);
          this.updateListing();
        });
      }
    });
  }

  close(): void {
    this.view.dismiss();
  }

  redoSearch(): void {
    this.showSearchBtn = false;
  }
  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  private updateMapLocation(location: Geoposition) {
    this.map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
    this.updateListing();
  }

  private updateListing() {
    this.listings$ = this.listingProvider.getListings(true);
    this.listings$.subscribe((listings: Listing[]) => {
      console.log(listings);
      this.listings = listings;
      let marker;
      forEach(this.listings, (listing) => {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(listing.location.latlng.latitude, listing.location.latlng.longitude),
          map: this.map
        });
        google.maps.event.addListener(marker, 'click', (marker, i) => {
          console.log(i, marker);
        });
      });
    });
  }

  private loadMap() {
    var mapProp = {
      center: new google.maps.LatLng(this.DEFAULT_LATLNG.LAT, this.DEFAULT_LATLNG.LNG),
      zoom: 12,
      disableDefaultUI: true,
      style: [{
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      }]
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.map.addListener('click', () => {
      this.isDrawerActive = false;
    });
    this.map.addListener('bounds_changed', () => {
      this.showSearchBtn = true;
    });
  }
}
