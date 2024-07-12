import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonGrid, IonRow, IonLabel, IonInput, IonItem, IonButton } from "@ionic/angular/standalone";
import { from } from 'rxjs';
import { Coordinate } from 'src/app/model/coordinate';
import { UserPhoto } from 'src/app/model/userPhoto';
import { PhotoService } from 'src/app/services/photo.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-marker-content',
  templateUrl: './marker-content.component.html',
  styleUrls: ['./marker-content.component.scss'],
  standalone: true,
  imports: [IonButton, IonItem, IonInput, IonLabel, IonRow, IonGrid, FormsModule, ReactiveFormsModule]
})
export class MarkerContentComponent implements OnInit {


  constructor(private storage: StorageService, private router: Router, private photoService: PhotoService) { }

  @Input() coordinate: Coordinate;
  @Output() dismissPopOverEvent = new EventEmitter<Boolean>;
  private image: UserPhoto;

  private urllocalserver: string = environment.localserver;

  ngOnInit() {
    this.load();
  }

  public form = new FormGroup({
    "title": new FormControl("", Validators.required),
    "description": new FormControl("", Validators.required),
  });

  onSubmit() {

    let exist: any;
    let coordinates: Coordinate[];

    from(this.storage.getPositions()).subscribe(ms => {

      coordinates = JSON.parse(ms.value);

      if (coordinates) {
        exist = coordinates.find(c => c.lat === this.coordinate.lat && c.lng === this.coordinate.lng);
      }

      let title = this.form.controls['title'].value;
      let description = this.form.controls['description'].value;

      this.coordinate.description = description;
      this.coordinate.title = title;
      this.coordinate.photo = this.image;

      if (!exist) {
        this.storage.addNewPosition(this.coordinate);
      } else {
        this.storage.updatePosition(this.coordinate, coordinates);
      }

      this.dismissPopOverEvent.emit(true);

    });

  }

  load() {
    this.form.patchValue({
      title: this.coordinate!.title,
      description: this.coordinate!.description,
    });
  }

  async upLoadPhoto() {
    this.image = await this.photoService.getUserPhoto();
  }

  async upLoadImage() {
    this.image = await this.photoService.getImage();
  }

  close() {
    this.dismissPopOverEvent.emit(true);
  }

  delete() {

    let coordinate: Coordinate;
    let coordinates: Coordinate[];

    from(this.storage.getPositions()).subscribe(ms => {

      coordinates = JSON.parse(ms.value);

      if (coordinates) {
        coordinate = coordinates.find(c => c.lat === this.coordinate.lat && c.lng === this.coordinate.lng);
        if (coordinate) {
          this.storage.deletePosition(coordinate, coordinates);
        }
      }

      //this.dismissPopOverEvent.emit(true);
      window.location.assign(this.urllocalserver);

    });

  }



}
