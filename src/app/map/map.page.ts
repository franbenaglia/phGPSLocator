import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonSpinner } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { Platform } from '../model/platform';
import { GeolocService } from '../services/geoloc.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MapPage implements OnInit {

  constructor(private geolocService: GeolocService) { }

  platform: Platform;
  positioncoords: string = '';

  ngOnInit() {
    this.position();
  }

  leafletMap: any;

  private lat: number;

  private lng: number;

  private zoom: number = 16;

  spin: boolean = true;

  private position(): void {

    this.geolocService.getCurrentPosition().subscribe(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.loadLeafletMap();
    });
  }

  loadLeafletMap(): void {

    this.spin = true;

    this.leafletMap = new L.Map('leafletMap');

    const self = this;

    this.leafletMap.on('load', function () {

      setTimeout(() => {

        self.leafletMap.invalidateSize();
        self.spin = false;

      }, 100);

    });


    this.leafletMap.setView([this.lat, this.lng], this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

      attribution: '&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

    }).addTo(this.leafletMap);

    let icon = L.icon({

      iconUrl: 'marker-icon.png',

      iconSize: [30, 40]

    });

    let marker = L.marker([this.lat, this.lng], { icon: icon }).addTo(this.leafletMap)

    let popup = L.popup()

      .setContent('<h1>Click me</h1>');

    marker.bindPopup(popup);


    function onMapClick(e) {
      alert("You clicked the map at " + e.latlng);
    }

    this.leafletMap.on('click', onMapClick);

    let osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    });

    let osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
    });

    let baseMaps = {
      'OpenStreetMap': osm,
      'OpenStreetMap.HOT': osmHOT,
      Topography: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'TOPO-WMS'
      }),

      Places: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'OSM-Overlay-WMS'
      }),

      'Topography, then places': L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'TOPO-WMS,OSM-Overlay-WMS'
      }),

      'Places, then topography': L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
        layers: 'OSM-Overlay-WMS,TOPO-WMS'
      })
    };

    let layerControl = L.control.layers(baseMaps).addTo(this.leafletMap);

    //baseMaps.Topography.addTo(this.leafletMap);

  }

}

