import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Observable, from, bindCallback } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocService {

  constructor() {

  }

  getCurrentPosition(): Observable<any> {

    if (!Capacitor.isNativePlatform()) {
      return from(this.getPositionFromNavigator());
    } else {
      return from(this.currentPositionNative());
    }
  }

  private currentPositionNative = async () => {
    return await Geolocation.getCurrentPosition();
  };

  private getPositionFromNavigator = () => {
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
    });
  }

}
