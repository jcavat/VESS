import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, File } from 'ionic-native';
// Pages
import { DefiningLayerPage } from '../defining-layer/defining-layer';
import { Notation1Page } from '../notation-1/notation-1';
// Providers
import { Toasts } from './../../providers/toasts';
import { Utils } from './../../providers/utils';

declare var cordova;

@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html'
})
export class CameraPage {
  public imageFile: string;
  private isOfagUser: boolean = false;
  pageTitle: string;
  stepView: number;
  imageNamePath: string;
  dirName: string;
  description: string;
  defaultBlockPicture: string = "./assets/icon/two-layers-example.png";
  defaultLayerPicture: string = "./assets/icon/generic-image.png";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toasts: Toasts) {
    this.stepView = this.navParams.get('stepView');


    //image in function of step
    switch (this.stepView) {
      case 1:
        this.pageTitle = "Photo du bloc entier";
        this.dirName = "blocks";

        this.imageFile = this.defaultBlockPicture;
        this.description = "Prenez une photo montrant le bloc entier et ses différentes couches, ainsi que le trou dont il est extrait :";
        break;
      case 5:
        this.pageTitle = "Photo de la couche";
        this.dirName = "layers";
        this.imageFile = this.defaultLayerPicture;
        this.description = "Prenez une photo de la couche :";
        break;
    }
    this.imageNamePath = this.dirName + "/" + Utils.getDatetimeFilename('.jpg');

  }

  takePicture() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000, //TODO: check if it necessary to resize picture, and if so, set correct values
      targetHeight: 1000,
      correctOrientation: true
    }).then((imagePath) => {
      //read new image
      this.imageFile = "data:image/jpeg;base64," + imagePath;
      //check if directory exist
      File.checkDir(cordova.file.dataDirectory, this.dirName).then(success => {
        //Directory is already created, so write imgFile
        File.writeFile(cordova.file.dataDirectory, this.imageNamePath, imagePath, true)
      }, error => {
        //Directory is not created, so you have to create it
        File.createDir(cordova.file.dataDirectory, this.dirName, true).then(success => {
          //Directory is created, so you have to create image file
          File.writeFile(cordova.file.dataDirectory, this.imageNamePath, imagePath, true);
        }, error => {
          this.toasts.showToast("Erreur lors de la création du répertoire de l'image.");
        });
      });

    }, (err) => {
      this.toasts.showToast("Erreur lors de la création de l'image.");
    });
  }


  validationStep() {
    switch (this.stepView) {
      case 1:
        if (this.isOfagUser && this.imageFile == this.defaultBlockPicture) { // OFAG user must take a picture
          this.toasts.showToast("Veuillez prendre une photo.");
        } else {
          this.navCtrl.push(DefiningLayerPage, {
            stepView: this.stepView + 1,
            picture: this.imageFile
          })
        }
        break;
      case 5:
        if (this.isOfagUser && this.imageFile == this.defaultLayerPicture) { // OFAG user must take a picture
          this.toasts.showToast("Veuillez prendre une photo.");
        } else {
          this.navCtrl.push(Notation1Page)
        }
        break;
    }
  }
}
