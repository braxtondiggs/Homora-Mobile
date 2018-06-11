import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController, Platform, Slides, ToastController, ViewController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { GeoLocationProvider, ListingProvider } from '../../providers';
import { ListingPage } from '../../pages/listings/listing/listing';
import { Listing } from '../../interface';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../app/app.constants';
import { } from '@types/googlemaps';
import * as _ from 'lodash';
import * as moment from 'moment';
import geolib from 'geolib';

@Component({
  selector: 'maps',
  templateUrl: 'maps.html'
})
export class MapsComponent {
  map: google.maps.Map;
  markers: google.maps.Marker[] = [];
  isDrawerActive: boolean = true;
  showSearchBtn: boolean = false;
  activeListing: boolean[];
  isLoading: boolean = true;
  hasPassedBoundaries: boolean = false;
  listings: Listing[];
  listings$: Observable<Listing[]>;
  DEFAULT_LISTING_IMAGE: string = AppSettings.DEFAULT_LISTING_IMAGE;
  DEFAULT_LATLNG = {
    LAT: 38.8256989,
    LNG: -77.0306601
  };
  @ViewChild(Slides) slides: Slides;
  @ViewChild('gmap') gmapElement: any;
  constructor(private geolocation: Geolocation,
    private locationProvider: GeoLocationProvider,
    private listingProvider: ListingProvider,
    private toast: ToastController,
    private platform: Platform,
    private view: ViewController,
    private alert: AlertController,
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
    this.updateListing();
  }
  viewListing(key: string): void {
    this.nav.push(ListingPage, { key });
  }

  duration(lower: number, upper: number): string {
    return lower === upper ? `${upper} months` : `${lower}-${upper} months`;
  }

  availability(date: Date): string {
    return moment(date).isSameOrBefore(moment(), 'day') ? 'Available Now' : moment(date).format('MM/DD');
  }

  private updateMapLocation(location: Geoposition) {
    this.map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
    this.updateListing();
  }

  private updateListing() {
    this.isLoading = true;
    setTimeout(() => {
      var bounds = this.map.getBounds();
      var center = bounds.getCenter();
      var r = 6378.8
      // degrees to radians (divide by 57.2958)
      var ne_lat = bounds.getNorthEast().lat() / 57.2958
      var ne_lng = bounds.getNorthEast().lng() / 57.2958
      var c_lat = bounds.getCenter().lat() / 57.2958
      var c_lng = bounds.getCenter().lng() / 57.2958
      var r_km = r * Math.acos(
        Math.sin(c_lat) * Math.sin(ne_lat) +
        Math.cos(c_lat) * Math.cos(ne_lat) * Math.cos(ne_lng - c_lng)
      )
      this.listings$ = this.listingProvider.getListings(false, {
        center: {
          latitude: center.lat(),
          longitude: center.lng()
        },
        radius: r_km
      });
      this.listings$.subscribe((listings: Listing[]) => {
        this.isLoading = false;
        this.listings = listings;
        let marker;
        _.forEach(this.markers, (_marker, i) => {
          this.markers[i].setMap(null);
        })
        _.forEach(this.listings, (listing, i) => {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(listing.location.latlng.latitude, listing.location.latlng.longitude),
            map: this.map
          });
          this.markers.push(marker);
          google.maps.event.addListener(marker, 'click', ((marker, i) => () => {
            this.activeListing = _.fill(Array(_.size(this.listings)), false);
            this.activeListing[i] = true;
            this.isDrawerActive = true;
            this.slides.slideTo(i);
          })(marker, i));
        });
      });
    }, 250);
  }

  private loadMap() {
    var mapProp = {
      center: new google.maps.LatLng(this.DEFAULT_LATLNG.LAT, this.DEFAULT_LATLNG.LNG),
      zoom: 11,
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
      this.isDrawerActive = !this.isDrawerActive;
    });

    this.map.addListener('bounds_changed', () => {
      if (!this.isLoading) { this.showSearchBtn = true; }
      if (!this.hasPassedBoundaries && !this.isLoading) {
        if (!geolib.isPointInside({ latitude: this.map.getCenter().lat(), longitude: this.map.getCenter().lng() }, AppSettings.MAP_BOUNDS)) {
          this.hasPassedBoundaries = true;
          this.alert.create({
            title: 'Outside supported boundaries',
            subTitle: 'We currently do not support areas outside of DC, we plan to expand shortly.',
            buttons: ['Ok']
          }).present();
        }
      }
    });
  }
}
