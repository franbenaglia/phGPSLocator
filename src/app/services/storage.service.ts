import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Coordinate } from '../model/coordinate';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private platform: Platform) { }

  public coordinates: Coordinate[] = [];

  private COORDINATES_STORAGE: string = 'coordinates';

  public async addNewPosition(coordinate: Coordinate) {

    this.coordinates.push(coordinate);

    Preferences.set({
      key: this.COORDINATES_STORAGE,
      value: JSON.stringify(this.coordinates),
    });

  }

  public async updatePosition(coordinate: Coordinate, coors: Coordinate[]) {

    //let coordinateR = coors.find(c => c.lat === coordinate.lat && c.lng === coordinate.lng);

    coordinate.description = coordinate.description;
    coordinate.title = coordinate.title;

    let coordinatesChanged = coors.map(c => (c.lat === coordinate.lat && c.lng === coordinate.lng) ? coordinate : c);

    this.coordinates.length = 0;
    this.coordinates.push(...coordinatesChanged);

    Preferences.set({
      key: this.COORDINATES_STORAGE,
      value: JSON.stringify(this.coordinates),
    });

  }

  public async getPositions() {

    return await Preferences.get({
      key: this.COORDINATES_STORAGE
    });

  }

  public async deletePosition(coordinate: Coordinate, coors: Coordinate[]) {

    let cs = coors.filter(c => !(c.lat === coordinate.lat && c.lng == coordinate.lng));
    this.coordinates.length = 0;
    this.coordinates.push(...cs);

    Preferences.set({
      key: this.COORDINATES_STORAGE,
      value: JSON.stringify(this.coordinates),
    });

  }

  public async deleteAllPositions() {

    this.coordinates.length = 0;

    Preferences.set({
      key: this.COORDINATES_STORAGE,
      value: JSON.stringify(this.coordinates),
    });

  }


}
