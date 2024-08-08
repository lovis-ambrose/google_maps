import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoogleMap, MapMarker } from '@angular/google-maps';
// @ts-ignore
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    GoogleMap,
    MapMarker,
    ReactiveFormsModule,
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  formData: FormGroup;
  mapLoaded = false;
  loader!: Loader;
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 }; // Default location
  zoom = 15;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [this.center];

  constructor(private _fb: FormBuilder) {
    this.formData = this._fb.group({
      address: ['', [Validators.pattern(/^[a-zA-Z0-9\s,.'-]{2,}$/)]],
    });
  }

  ngOnInit(): void {
    this.loader = new Loader({
      apiKey: 'AIzaSyATK9OJw_jMVMoJ7hlB52eKZsqJlppp2oA',
      version: 'weekly',
    });

    this.loader.load().then(() => {
      this.mapLoaded = true;
      this.setDefaultLocation();
    }).catch(() => {
      console.error('Error loading Google Maps API');
    });
  }

  updateMap(): void {
    if (this.mapLoaded) {
      const address = this.formData.get('address')?.value || '';
      if (address) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            this.center = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            };
            this.markerPositions = [this.center];
          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
            this.setDefaultLocation();
          }
        });
      } else {
        this.setDefaultLocation();
      }

    }
  }

  setDefaultLocation(): void {
    this.center = { lat: 37.7749, lng: -122.4194 };
    this.markerPositions = [this.center];
  }
}