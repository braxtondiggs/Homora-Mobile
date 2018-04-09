import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

const GEOLOCATION_ERRORS = {
  'errors.location.unsupportedBrowser': 'Browser does not support location services',
  'errors.location.permissionDenied': 'You have rejected access to your location',
  'errors.location.positionUnavailable': 'Unable to determine your location',
  'errors.location.timeout': 'Service timeout has been reached'
};

@Injectable()
export class GeoLocationProvider {
  private metroAPI: string = '67eff788e1b442228ea5d35814f82391';
  constructor(private http: HttpClient) { }

  public getLocation(geoLocationOptions?: any): Observable<any> {
    geoLocationOptions = geoLocationOptions || { timeout: 5000 };
    return Observable.create(observer => {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next(position);
            observer.complete();
          },
          (error) => {
            switch (error.code) {
              case 1:
                observer.error(GEOLOCATION_ERRORS['errors.location.permissionDenied']);
                break;
              case 2:
                observer.error(GEOLOCATION_ERRORS['errors.location.positionUnavailable']);
                break;
              case 3:
                observer.error(GEOLOCATION_ERRORS['errors.location.timeout']);
                break;
            }
          },
          geoLocationOptions);
      } else {
        observer.error(GEOLOCATION_ERRORS['errors.location.unsupportedBrowser']);
      }
    });
  }

  public latLngForAddress(address: string, multi?: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          key: 'AIzaSyBzeUk8oXwjrV1HfG7wlIx_tTocekPb8SU',
          address
        }
      }).subscribe((data: any) => {
        const result = data.results;
        if (typeof multi !== 'undefined' || multi) {
          return resolve(result);
        } else if (!_.isEmpty(result) && (_.includes(result[0].types, 'street_address') || _.includes(result[0].types, 'subpremise') || (typeof multi !== 'undefined'))) {
          return resolve(result[0].geometry.location);
        } else {
          return reject('We could not find your address, please try again');
        }
      });
    });
  }

  public getMetros(latlng: { lat: number, lng: number }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let that = this;
      this.http.get('https://api.wmata.com/Rail.svc/json/jStationEntrances', {
        params: {
          api_key: this.metroAPI,
          Lat: _.toString(latlng.lat),
          Lon: _.toString(latlng.lng),
          Radius: '1000'
        }
      }).subscribe((result: any) => {
        let metros = result.Entrances,
          promises = [];
        if (_.size(metros) > 0) {
          metros = _.uniqBy(metros, 'StationCode1');
          _.forEach(metros, function(metro) {
            promises.push(that.getMetro(metro));
          });
          return resolve(Observable.forkJoin(promises).toPromise());
        }
        return resolve();
      });
    });
  }

  private getMetro(metro: any): Promise<any> {
    return this.http.get('https://api.wmata.com/Rail.svc/json/jStationInfo', {
      params: {
        api_key: this.metroAPI,
        StationCode: metro.StationCode1
      }
    }).toPromise();
  }
}
export let geolocationServiceInjectables: Array<any> = [
  { provide: GeoLocationProvider, useClass: GeoLocationProvider }
];
