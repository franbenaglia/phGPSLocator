import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-photo-album',
  templateUrl: './photo-album.page.html',
  styleUrls: ['./photo-album.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PhotoAlbumPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
