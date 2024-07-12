import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonFabList, IonToast } from '@ionic/angular/standalone';
import { PhotoService } from '../services/photo.service';
import { ActionSheetController } from '@ionic/angular';
import { UserPhoto } from '../model/userPhoto';
import { addIcons } from 'ionicons';
import { camera, chevronForwardCircle, colorPalette, document, globe, image } from 'ionicons/icons';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
  standalone: true,
  imports: [IonToast, IonFabList, IonImg, IonCol, IonRow, IonGrid, IonIcon, IonFabButton, IonFab, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class PhotoPage implements OnInit {

  constructor(public photoService: PhotoService, private actionSheetController: ActionSheetController) {
    addIcons({ camera, chevronForwardCircle, document, colorPalette, globe, image });
  }

  async ngOnInit() {
    await this.photoService.loadSaved();
    this.checkPermissions();
  }

  isToastOpen: boolean = false;

  addPhotoToGallery() {
    this.checkPermissions();
    this.photoService.addNewToGallery();
  }

  addImageToGallery() {
    this.photoService.addImageToGallery();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();
  }

  private checkPermissions(): void {

    this.photoService.checkPermissions().subscribe(status => {
      console.log(status);
      if (status!=='web' && (status.camera !== 'granted' || status.photos !== 'granted')) {
        this.setOpen(true);
      }
    });

  }

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

}
